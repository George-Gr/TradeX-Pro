import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TradingStore } from './types';
import { Order, Position, OrderHistory } from '../types/trading';
import { supabase } from '../integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

const initialState = {
  selectedSymbol: null,
  positions: [],
  orders: [],
  orderHistory: [],
  isLoading: false,
  error: null,
};

export const useTradingStore = create<TradingStore>()(
  devtools(
    (set, get) => {
      let ordersSubscription: RealtimeChannel | null = null;

      return {
        ...initialState,

        setSelectedSymbol: (symbol: string) => {
          set({ selectedSymbol: symbol });
        },

        updatePositions: (positions: Position[]) => {
          set({ positions });
        },

        updateOrders: (orders: Order[]) => {
          set({ orders });
        },

        placeOrder: async (orderData: Omit<Order, 'id'>) => {
          try {
            set({ isLoading: true, error: null });
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
              .from('orders')
              .insert({
                ...orderData,
                user_id: user.id,
                status: 'open',
                created_at: new Date().toISOString(),
              })
              .select()
              .single();

            if (error) throw error;

            set((state) => ({
              orders: [...state.orders, data as Order],
              isLoading: false,
            }));
            return data;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to place order',
              isLoading: false,
            });
            throw error;
          }
        },

        closePosition: async (positionId: string, quantity?: number) => {
          try {
            set({ isLoading: true, error: null });
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: position, error: fetchError } = await supabase
              .from('positions')
              .select('*')
              .eq('id', positionId)
              .single();

            if (fetchError) throw fetchError;

            const closeQuantity = quantity || position.quantity;

            const { error: closeError } = await supabase
              .from('positions')
              .update({
                quantity: position.quantity - closeQuantity,
                status: closeQuantity === position.quantity ? 'closed' : 'open',
                updated_at: new Date().toISOString(),
              })
              .eq('id', positionId);

            if (closeError) throw closeError;

            set((state) => ({
              positions: state.positions
                .map((pos) =>
                  pos.id === positionId
                    ? {
                        ...pos,
                        quantity: pos.quantity - closeQuantity,
                        status:
                          closeQuantity === pos.quantity ? ('closed' as const) : ('open' as const),
                      }
                    : pos
                )
                .filter((pos) => pos.status !== 'closed') as Position[],
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to close position',
              isLoading: false,
            });
            throw error;
          }
        },

        cancelOrder: async (orderId: string) => {
          try {
            set({ isLoading: true, error: null });
            const { error } = await supabase
              .from('orders')
              .update({ status: 'cancelled', updated_at: new Date().toISOString() })
              .eq('id', orderId);

            if (error) throw error;

            set((state) => ({
              orders: state.orders.filter((order) => order.id !== orderId),
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to cancel order',
              isLoading: false,
            });
            throw error;
          }
        },

        modifyOrder: async (orderId: string, updates: Partial<Order>) => {
          try {
            set({ isLoading: true, error: null });
            const { data, error } = await supabase
              .from('orders')
              .update({ ...updates, updated_at: new Date().toISOString() })
              .eq('id', orderId)
              .select()
              .single();

            if (error) throw error;

            set((state) => ({
              orders: state.orders.map((order) =>
                order.id === orderId ? { ...order, ...updates } : order
              ),
              isLoading: false,
            }));
            return data;
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to modify order',
              isLoading: false,
            });
            throw error;
          }
        },

        fetchOrderHistory: async () => {
          try {
            set({ isLoading: true, error: null });
            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data, error } = await supabase
              .from('trade_history')
              .select('*')
              .eq('user_id', user.id)
              .order('created_at', { ascending: false });

            if (error) throw error;

            set((state) => ({
              orderHistory: data as OrderHistory[],
              isLoading: false,
            }));
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch order history',
              isLoading: false,
            });
            throw error;
          }
        },

        subscribeToUpdates: async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (!user) return;

          // Unsubscribe from any existing subscription
          if (ordersSubscription) {
            ordersSubscription.unsubscribe();
          }

          // Subscribe to orders table changes
          ordersSubscription = supabase
            .channel('orders-channel')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'orders',
                filter: `user_id=eq.${user.id}`,
              },
              async (payload) => {
                // Fetch updated orders
                const { data: orders, error } = await supabase
                  .from('orders')
                  .select('*')
                  .eq('user_id', user.id)
                  .eq('status', 'open');

                if (!error && orders) {
                  set({ orders: orders as Order[] });
                }
              }
            )
            .subscribe();
        },
      };
    },
    { name: 'trading-store' }
  )
);
