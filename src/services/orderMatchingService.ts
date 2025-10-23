import { supabase } from '@/integrations/supabase/client';

export interface Order {
  id: string;
  user_id: string;
  symbol: string;
  order_type: 'market' | 'limit' | 'stop' | 'stop_limit';
  side: 'buy' | 'sell';
  quantity: number;
  price?: number;
  stop_loss?: number;
  take_profit?: number;
  status: 'pending' | 'filled' | 'partial' | 'cancelled';
  created_at: string;
}

export interface Position {
  id: string;
  user_id: string;
  symbol: string;
  side: 'long' | 'short';
  quantity: number;
  entry_price: number;
  unrealized_pnl: number;
}

class OrderMatchingService {
  private orderQueue: Order[] = [];
  private isProcessing = false;
  private queueProcessInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start automatic queue processing
    this.startQueueProcessing();
  }

  /**
   * Start automatic processing of order queue
   */
  startQueueProcessing() {
    // Process orders every 2 seconds
    this.queueProcessInterval = setInterval(async () => {
      if (!this.isProcessing && this.orderQueue.length > 0) {
        await this.processOrderQueue();
      }
    }, 2000);
  }

  /**
   * Stop automatic queue processing
   */
  stopQueueProcessing() {
    if (this.queueProcessInterval) {
      clearInterval(this.queueProcessInterval);
      this.queueProcessInterval = null;
    }
  }

  /**
   * Add order to matching queue
   */
  async addToQueue(order: Order): Promise<boolean> {
    try {
      // Add order to processing queue
      this.orderQueue.push(order);

      console.log(`📋 Added order ${order.id} to matching queue`);

      return true;
    } catch (error) {
      console.error('Failed to add order to queue:', error);
      return false;
    }
  }

  /**
   * Process next orders in matching queue
   */
  private async processOrderQueue() {
    if (this.isProcessing || this.orderQueue.length === 0) return;

    this.isProcessing = true;

    try {
      // Process orders in FIFO order
      while (this.orderQueue.length > 0) {
        const order = this.orderQueue.shift();

        if (order) {
          console.log(`⚡ Processing order ${order.id}`);
          const success = await this.processOrder(order);

          if (success) {
            console.log(`✅ Order ${order.id} processed successfully`);
          } else {
            console.log(`❌ Order ${order.id} processing failed, re-queueing`);

            // Re-queue failed orders with backoff
            setTimeout(() => {
              this.orderQueue.push(order);
            }, 5000); // Retry after 5 seconds
          }
        }

        // Don't process too many at once to avoid overwhelming the system
        if (this.orderQueue.length % 5 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } catch (error) {
      console.error('Order queue processing error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process individual order matching
   */
  private async processOrder(order: Order): Promise<boolean> {
    try {
      // Get current market price for the symbol
      const { data: marketData, error: marketError } = await supabase
        .from('market_data_cache')
        .select('price, bid, ask, high, low')
        .eq('symbol', order.symbol)
        .single();

      if (marketError || !marketData) {
        console.error(`Market data unavailable for ${order.symbol}`);
        return false;
      }

      // For now, we'll implement basic market order execution
      // In production, this would involve proper matching algorithms

      const executionPrice = this.calculateExecutionPrice(order, marketData);

      if (!executionPrice) {
        console.log(`Price not executable for order ${order.id}`);
        return false;
      }

      // Execute the order
      const result = await this.executeOrder(order, executionPrice);

      return result;
    } catch (error) {
      console.error(`Order processing failed for ${order.id}:`, error);
      return false;
    }
  }

  /**
   * Calculate execution price based on order type
   */
  private calculateExecutionPrice(
    order: Order,
    marketData: { price: number; bid?: number; ask?: number }
  ): number | null {
    switch (order.order_type) {
      case 'market':
        // For market orders, use current market price
        return marketData.price;

      case 'limit':
        if (order.side === 'buy' && order.price && order.price >= marketData.price) {
          return marketData.price;
        }
        if (order.side === 'sell' && order.price && order.price <= marketData.price) {
          return marketData.price;
        }
        return null; // Price not executable

      case 'stop':
        if (order.side === 'buy' && marketData.price >= (order.price || 0)) {
          return marketData.price;
        }
        if (order.side === 'sell' && marketData.price <= (order.price || 0)) {
          return marketData.price;
        }
        return null; // Stop price not triggered

      default:
        return marketData.price;
    }
  }

  /**
   * Execute order at given price
   */
  private async executeOrder(order: Order, executionPrice: number): Promise<boolean> {
    try {
      // Use the Edge Function for execution (for now this calls our existing execute-order)
      const { data: result, error } = await supabase.functions.invoke('execute-order', {
        body: {
          symbol: order.symbol,
          order_type: order.order_type,
          side: order.side,
          quantity: order.quantity,
          price: order.price,
          execution_price: executionPrice, // Pass the calculated execution price
          stop_loss: order.stop_loss,
          take_profit: order.take_profit,
          from_queue: true, // Mark that this came from queue processing
        },
      });

      if (error) throw error;

      return result.success === true;
    } catch (error) {
      console.error(`Order execution failed:`, error);
      return false;
    }
  }

  /**
   * Cancel order (remove from queue if pending)
   */
  cancelOrder(orderId: string): void {
    this.orderQueue = this.orderQueue.filter((order) => order.id !== orderId);
  }

  /**
   * Get current queue status
   */
  getQueueStatus() {
    return {
      length: this.orderQueue.length,
      processing: this.isProcessing,
      orders: this.orderQueue.map((order) => ({
        id: order.id,
        symbol: order.symbol,
        side: order.side,
        type: order.order_type,
        quantity: order.quantity,
        created_at: order.created_at,
      })),
    };
  }

  /**
   * Clean up service
   */
  destroy() {
    this.stopQueueProcessing();
    this.orderQueue = [];
  }

  // ============================================================================
  // ADVANCED MATCHING ALGORITHMS (What would be implemented for high-frequency trading)
  // ============================================================================

  /**
   * Price-Time Priority Algorithm (Basic FIFO)
   * New orders get executed based on time priority and price
   */
  private async priceTimePriorityMatching(order: Order): Promise<boolean> {
    // This is a simplified implementation
    // In production, you would have a proper order book with bids/asks

    const { data: pendingOrders } = await supabase
      .from('orders')
      .select('*')
      .eq('symbol', order.symbol)
      .neq('side', order.side) // Opposite side orders
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (!pendingOrders || pendingOrders.length === 0) {
      return false; // No matching orders
    }

    // Find matching orders based on price and priority
    const matchingOrder = this.findBestMatch(order, pendingOrders);

    if (matchingOrder) {
      // Execute matched orders
      return await this.matchOrders(order, matchingOrder);
    }

    return false;
  }

  /**
   * Find best matching order
   */
  private findBestMatch(order: Order, oppositeOrders: Order[]): Order | null {
    switch (order.order_type) {
      case 'market':
        // Match with best available price (FIFO by time, then by price)
        return oppositeOrders[0]; // First in queue

      case 'limit': {
        // Match with orders at better or equal prices
        const matchingLimit = oppositeOrders.find((oppositeOrder) => {
          const isPriceMatch =
            order.side === 'buy'
              ? (oppositeOrder.price || 0) <= (order.price || 0)
              : (oppositeOrder.price || 0) >= (order.price || 0);

          // Could also check for exact quantity matches or partial fills
          return isPriceMatch && oppositeOrder.quantity <= order.quantity;
        });

        return matchingLimit || null;
      }

      default:
        return null;
    }
  }

  /**
   * Match two orders and create position
   */
  private async matchOrders(order1: Order, order2: Order): Promise<boolean> {
    try {
      // Calculate fill quantity (minimum of both orders)
      const fillQuantity = Math.min(order1.quantity, order2.quantity);
      const executionPrice = order1.price || order2.price || 100; // Default fallback price

      // Update both orders to partial/filled status
      await Promise.all([
        supabase
          .from('orders')
          .update({ status: fillQuantity === order1.quantity ? 'filled' : 'partial' })
          .eq('id', order1.id),
        supabase
          .from('orders')
          .update({ status: fillQuantity === order2.quantity ? 'filled' : 'partial' })
          .eq('id', order2.id),
      ]);

      // Create position for the buyer (order1 in this example)
      const { error: positionError } = await supabase.from('positions').insert({
        user_id: order1.user_id,
        symbol: order1.symbol,
        side: order1.side === 'buy' ? 'long' : 'short',
        quantity: fillQuantity,
        entry_price: executionPrice,
        unrealized_pnl: 0,
        margin_required: executionPrice * fillQuantity * 0.1, // 10% margin
        order_id: order1.id,
      });

      if (positionError) throw positionError;

      return true;
    } catch (error) {
      console.error('Order matching failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const orderMatchingService = new OrderMatchingService();
