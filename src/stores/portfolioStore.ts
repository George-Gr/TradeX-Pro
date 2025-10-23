import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { PortfolioStore } from './types';
import { Portfolio, Balance } from '../types';
import { supabase } from '../integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const initialState = {
  portfolio: null,
  portfolioHistory: [],
  balances: [],
  isLoading: false,
  error: null,
  lastFetched: null as number | null,
};

export const usePortfolioStore = create<PortfolioStore>()(
  devtools(
    (set, get) => {
      let portfolioSubscription: RealtimeChannel | null = null;
      let balancesSubscription: RealtimeChannel | null = null;

      const setupSubscriptions = (userId: string) => {
        // Unsubscribe from existing subscriptions
        if (portfolioSubscription) portfolioSubscription.unsubscribe();
        if (balancesSubscription) balancesSubscription.unsubscribe();

        // Subscribe to portfolio changes
        portfolioSubscription = supabase
          .channel('portfolio-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'portfolios',
              filter: `user_id=eq.${userId}`,
            },
            async (payload) => {
              const { data: portfolio } = await supabase
                .from('portfolios')
                .select('*')
                .eq('user_id', userId)
                .single();

              if (portfolio) {
                set((state) => ({
                  portfolio,
                  portfolioHistory: [
                    ...state.portfolioHistory,
                    {
                      ...portfolio,
                      timestamp: new Date().toISOString(),
                    },
                  ].slice(-100), // Keep last 100 snapshots
                }));
              }
            }
          )
          .subscribe();

        // Subscribe to balance changes
        balancesSubscription = supabase
          .channel('balance-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'balances',
              filter: `user_id=eq.${userId}`,
            },
            async (payload) => {
              const { data: balances } = await supabase
                .from('balances')
                .select('*')
                .eq('user_id', userId);

              if (balances) {
                set({ balances });
              }
            }
          )
          .subscribe();
      };

      return {
        ...initialState,

        updatePortfolio: (portfolio: Portfolio) => {
          set((state) => ({
            portfolio,
            portfolioHistory: [
              ...state.portfolioHistory,
              {
                ...portfolio,
                timestamp: new Date().toISOString(),
              },
            ].slice(-100), // Keep last 100 snapshots
          }));
        },

        updateBalances: (balances: Balance[]) => {
          set({ balances });
        },

        fetchPortfolio: async () => {
          try {
            const now = Date.now();
            const state = get();

            // Return cached data if it's still fresh
            if (state.portfolio && state.lastFetched && now - state.lastFetched < CACHE_DURATION) {
              return;
            }

            set({ isLoading: true, error: null });

            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const [portfolioResult, historyResult] = await Promise.all([
              supabase.from('portfolios').select('*').eq('user_id', user.id).single(),
              supabase
                .from('portfolio_history')
                .select('*')
                .eq('user_id', user.id)
                .order('timestamp', { ascending: false })
                .limit(100),
            ]);

            if (portfolioResult.error) throw portfolioResult.error;
            if (historyResult.error) throw historyResult.error;

            set({
              portfolio: portfolioResult.data,
              portfolioHistory: historyResult.data,
              isLoading: false,
              lastFetched: now,
            });

            // Setup real-time subscriptions
            setupSubscriptions(user.id);
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch portfolio',
              isLoading: false,
            });
            throw error;
          }
        },

        fetchBalances: async () => {
          try {
            set({ isLoading: true, error: null });

            const {
              data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error('User not authenticated');

            const { data: balances, error } = await supabase
              .from('balances')
              .select('*')
              .eq('user_id', user.id);

            if (error) throw error;

            set({
              balances,
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'Failed to fetch balances',
              isLoading: false,
            });
            throw error;
          }
        },

        cleanup: () => {
          if (portfolioSubscription) portfolioSubscription.unsubscribe();
          if (balancesSubscription) balancesSubscription.unsubscribe();
          set(initialState);
        },
      };
    },
    { name: 'portfolio-store' }
  )
);
