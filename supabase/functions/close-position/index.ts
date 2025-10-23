import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ClosePositionRequest {
  position_id: string;
  close_quantity?: number; // Optional: partial close, default is full close
  close_price?: number; // Optional: specify close price, default is current market price
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const closeData: ClosePositionRequest = await req.json();

    // Get position details
    const { data: position, error: positionError } = await supabaseClient
      .from('positions')
      .select('*')
      .eq('id', closeData.position_id)
      .eq('user_id', user.id)
      .single();

    if (positionError || !position) {
      return new Response(JSON.stringify({ error: 'Position not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determine close quantity (default to full quantity if not specified)
    const closeQuantity = closeData.close_quantity || position.quantity;

    // Validate close quantity
    if (closeQuantity <= 0 || closeQuantity > position.quantity) {
      return new Response(JSON.stringify({ error: 'Invalid close quantity' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determine close price (default to current market price if not specified)
    let closePrice = closeData.close_price;

    if (!closePrice) {
      const { data: marketData } = await supabaseClient
        .from('market_data_cache')
        .select('price')
        .eq('symbol', position.symbol)
        .single();

      if (!marketData) {
        return new Response(JSON.stringify({ error: 'Market data not available' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      closePrice = marketData.price;
    }

    if (!closePrice) {
      throw new Error('Close price is required');
    }

    // Calculate P&L for the closing portion
    const priceDifference = closePrice - position.entry_price;
    const pnlPerUnit = position.side === 'long' ? priceDifference : -priceDifference;
    const realizedPnl = pnlPerUnit * closeQuantity;

    // Calculate commission for closing trade
    const notionalValue = closePrice * closeQuantity;
    const commission = notionalValue * 0.001; // 0.1% commission

    // Create closing order record
    const { data: closeOrder, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        symbol: position.symbol,
        order_type: 'market',
        side: position.side === 'long' ? 'sell' : 'buy', // Opposite side for closing
        quantity: closeQuantity,
        price: closePrice,
        status: 'filled',
        filled_quantity: closeQuantity,
        average_fill_price: closePrice,
        commission: commission,
        pnl: realizedPnl,
        filled_at: new Date().toISOString(),
        closed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      console.error('Close order insert error:', orderError);
      return new Response(JSON.stringify({ error: 'Failed to create close order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Determine if this is a full or partial close
    const remainingQuantity = position.quantity - closeQuantity;
    let updatedPosition = null;

    if (remainingQuantity <= 0) {
      // Full close - delete position
      const { error: deleteError } = await supabaseClient
        .from('positions')
        .delete()
        .eq('id', position.id);

      if (deleteError) {
        console.error('Position delete error:', deleteError);
        return new Response(JSON.stringify({ error: 'Failed to close position' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } else {
      // Partial close - update position quantity and add realized P&L

      const { data: updated, error: updateError } = await supabaseClient
        .from('positions')
        .update({
          quantity: remainingQuantity,
          realized_pnl: (position.realized_pnl || 0) + realizedPnl,
          updated_at: new Date().toISOString(),
        })
        .eq('id', position.id)
        .select()
        .single();

      if (updateError) {
        console.error('Position update error:', updateError);
        return new Response(JSON.stringify({ error: 'Failed to update position' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      updatedPosition = updated;
    }

    // Update user profile
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('balance, margin_used, free_margin, equity')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: 'Profile not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Calculate margin to release (proportional to closed quantity)
    const marginToRelease = (profile.margin_used * closeQuantity) / position.quantity;

    const newBalance = profile.balance + (realizedPnl - commission);
    const newMarginUsed = profile.margin_used - marginToRelease;
    const newFreeMargin = profile.free_margin + marginToRelease + (realizedPnl - commission);
    const newEquity = newBalance + profile.margin_used - marginToRelease + realizedPnl - commission;

    // Update profile with realized P&L
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({
        balance: newBalance,
        margin_used: newMarginUsed,
        free_margin: newFreeMargin,
        equity: newEquity,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('Profile update error:', profileError);
      return new Response(JSON.stringify({ error: 'Failed to update account balance' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create trade history record
    const { error: tradeHistoryError } = await supabaseClient.from('trade_history').insert({
      user_id: user.id,
      order_id: closeOrder.id,
      symbol: position.symbol,
      side: closeOrder.side,
      quantity: closeQuantity,
      price: closePrice,
      commission: commission,
      pnl: realizedPnl,
      executed_at: new Date().toISOString(),
    });

    if (tradeHistoryError) {
      console.error('Trade history insert error:', tradeHistoryError);
      // Log but don't fail the operation
    }

    return new Response(
      JSON.stringify({
        success: true,
        order: closeOrder,
        position: updatedPosition,
        close_quantity: closeQuantity,
        close_price: closePrice,
        realized_pnl: realizedPnl,
        commission: commission,
        remaining_quantity: remainingQuantity,
        full_close: remainingQuantity <= 0,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Close position error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
