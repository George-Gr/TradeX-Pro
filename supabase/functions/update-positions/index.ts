/// <reference lib="deno.ns" />

// @ts-expect-error: Deno URL imports
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-expect-error: Deno URL imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UpdatePositionsRequest {
  user_id?: string; // Optional: update for specific user only
  symbols?: string[]; // Optional: update for specific symbols only
}

interface MarketData {
  symbol: string;
  price: number;
}

interface Position {
  id: string;
  user_id: string;
  symbol: string;
  side: string;
  quantity: number;
  entry_price: number;
  current_price?: number;
  unrealized_pnl?: number;
  realized_pnl?: number;
  stop_loss?: number;
  take_profit?: number;
  updated_at?: string;
}

// Profile interface for user margin/equity calculation
type Profile = {
  id: string
  balance: number
  margin_used: number
  free_margin: number
  equity: number
  account_status: string
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // @ts-expect-error: Deno global
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const updateData = (await req.json()) as UpdatePositionsRequest;

    // Get market data for relevant symbols
    let marketDataQuery = supabaseClient.from('market_data_cache').select('symbol, price');

    if (updateData.symbols && updateData.symbols.length > 0) {
      marketDataQuery = marketDataQuery.in('symbol', updateData.symbols);
    }

    const { data: marketData, error: marketError } = await marketDataQuery;

    if (marketError) {
      console.error('Market data fetch error:', marketError);
      return new Response(JSON.stringify({ error: 'Failed to fetch market data' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!marketData || marketData.length === 0) {
      return new Response(JSON.stringify({ error: 'No market data available' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create market data map for easy lookup
    const marketDataMap = new Map<string, number>();
    marketData.forEach((data: MarketData) => {
      marketDataMap.set(data.symbol, data.price);
    });

    const symbols = Array.from(marketDataMap.keys());

    // Get all positions for the relevant symbols
    let positionsQuery = supabaseClient.from('positions').select('*').in('symbol', symbols);

    if (updateData.user_id) {
      positionsQuery = positionsQuery.eq('user_id', updateData.user_id);
    }

    const { data: positions, error: positionsError } = await positionsQuery;

    if (positionsError) {
      console.error('Positions fetch error:', positionsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch positions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!positions || positions.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No positions to update',
          updated_count: 0,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Update positions with new P&L calculations
    const updatePromises = positions.map(async (position: Position) => {
      const currentPrice = marketDataMap.get(position.symbol);

      if (!currentPrice) {
        console.warn(`No market data for symbol: ${position.symbol}`);
        return position;
      }

      // Calculate unrealized P&L
      const priceDifference = currentPrice - position.entry_price;
      const pnlPerUnit = position.side === 'long' ? priceDifference : -priceDifference;
      const unrealizedPnl = pnlPerUnit * position.quantity;

      // Update position
      const { data: updatedPosition, error: updateError } = await supabaseClient
        .from('positions')
        .update({
          current_price: currentPrice,
          unrealized_pnl: unrealizedPnl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', position.id)
        .select()
        .single();

      if (updateError) {
        console.error(`Position update error for ${position.symbol}:`, updateError);
        return null;
      }

      return updatedPosition;
    });

    const updatedPositions = await Promise.all(updatePromises);
    const successfulUpdates = updatedPositions.filter((p: Position | null) => p !== null);

    // Check for margin call conditions (equity below a threshold)
    const userIds = [...new Set(positions.map((p: Position) => p.user_id))];
    const marginCallPromises = userIds.map(async (userId) => {
      // Calculate total unrealized P&L for this user
      const { data: userPositions } = await supabaseClient
        .from('positions')
        .select('unrealized_pnl, realized_pnl')
        .eq('user_id', userId);

      if (!userPositions || userPositions.length === 0) return;

      const totalUnrealizedPnl = (userPositions as { unrealized_pnl?: number }[]).reduce(
        (sum: number, pos) => sum + (pos.unrealized_pnl ?? 0),
        0,
      );

      // Get user profile
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('balance, margin_used, free_margin, equity, account_status')
        .eq('id', userId)
        .single();

      if (!profile) return;

      // Calculate current equity
      const currentEquity = profile.balance + profile.margin_used + totalUnrealizedPnl;

      // Margin call threshold (e.g., 20% of used margin)
      const marginCallThreshold = profile.margin_used * 0.2;

      if (currentEquity < marginCallThreshold && profile.account_status !== 'suspended') {
        // Trigger margin call
        await supabaseClient
          .from('profiles')
          .update({
            account_status: 'suspended',
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        // Log margin call event
        await supabaseClient.from('audit_logs').insert({
          user_id: userId,
          action: 'margin_call',
          entity_type: 'profile',
          entity_id: userId,
          details: {
            equity: currentEquity,
            margin_used: profile.margin_used,
            threshold: marginCallThreshold,
            timestamp: new Date().toISOString(),
          },
        });

        console.log(`Margin call triggered for user ${userId}`);
      }
    });

    await Promise.all(marginCallPromises);

    return new Response(
      JSON.stringify({
        success: true,
        updated_count: successfulUpdates.length,
        symbols_updated: symbols,
        positions_updated: successfulUpdates.length,
        message: `Updated ${successfulUpdates.length} positions for ${symbols.length} symbols`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Update positions error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
