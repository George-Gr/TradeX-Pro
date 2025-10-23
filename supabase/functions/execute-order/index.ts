import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderRequest {
  user_id: string;
  symbol: string;
  order_type: 'market' | 'limit' | 'stop' | 'stop_limit';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  stop_price?: number;
  stop_loss?: number;
  take_profit?: number;
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

    const orderData: OrderRequest = await req.json();

    // Validate user permissions
    const { data: userRole } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!userRole) {
      return new Response(JSON.stringify({ error: 'User role not found' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user profile and validate account status
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profile.account_status !== 'active') {
      return new Response(JSON.stringify({ error: 'Account not active' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get current market price
    const { data: marketData } = await supabaseClient
      .from('market_data_cache')
      .select('price')
      .eq('symbol', orderData.symbol)
      .single();

    if (!marketData) {
      return new Response(JSON.stringify({ error: 'Market data not available' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const currentPrice = marketData.price;

    // Determine execution price based on order type
    let executionPrice = currentPrice;

    if (orderData.order_type === 'limit') {
      if (!orderData.price) {
        return new Response(JSON.stringify({ error: 'Limit price required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      executionPrice = orderData.price;
    }

    // For CFD trading, calculate required margin (10% margin requirement)
    const notionalValue = executionPrice * orderData.quantity;
    const requiredMargin = notionalValue * 0.1;

    // Check available margin
    if (profile.free_margin < requiredMargin) {
      return new Response(JSON.stringify({ error: 'Insufficient margin' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check for existing position (can only have one position per symbol per side)
    const { data: existingPosition } = await supabaseClient
      .from('positions')
      .select('*')
      .eq('user_id', user.id)
      .eq('symbol', orderData.symbol)
      .eq('side', orderData.side)
      .single();

    if (existingPosition) {
      return new Response(
        JSON.stringify({
          error: 'Position already exists for this symbol/side combination',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Begin transaction
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        symbol: orderData.symbol,
        order_type: orderData.order_type,
        side: orderData.side,
        quantity: orderData.quantity,
        price: executionPrice,
        stop_price: orderData.stop_price,
        status: 'filled', // Execute immediately for market orders
        filled_quantity: orderData.quantity,
        average_fill_price: executionPrice,
        commission: notionalValue * 0.001, // 0.1% commission
        filled_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order insert error:', orderError);
      return new Response(JSON.stringify({ error: 'Failed to create order' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create position
    const positionData = {
      user_id: user.id,
      symbol: orderData.symbol,
      side: orderData.side,
      quantity: orderData.quantity,
      entry_price: executionPrice,
      current_price: executionPrice,
      unrealized_pnl: 0,
      stop_loss: orderData.stop_loss,
      take_profit: orderData.take_profit,
    };

    const { data: position, error: positionError } = await supabaseClient
      .from('positions')
      .insert(positionData)
      .select()
      .single();

    if (positionError) {
      console.error('Position insert error:', positionError);
      // Rollback order if position creation fails
      await supabaseClient.from('orders').update({ status: 'cancelled' }).eq('id', order.id);

      return new Response(JSON.stringify({ error: 'Failed to create position' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update user balance (reduce free margin)
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({
        margin_used: profile.margin_used + requiredMargin,
        free_margin: profile.free_margin - requiredMargin,
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
      order_id: order.id,
      symbol: orderData.symbol,
      side: orderData.side,
      quantity: orderData.quantity,
      price: executionPrice,
      commission: order.commission,
      pnl: 0, // Initial P&L is 0
      executed_at: new Date().toISOString(),
    });

    if (tradeHistoryError) {
      console.error('Trade history insert error:', tradeHistoryError);
      // Log but don't fail the operation
    }

    return new Response(
      JSON.stringify({
        success: true,
        order,
        position,
        execution_price: executionPrice,
        required_margin: requiredMargin,
        commission: order.commission,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Execute order error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
