import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AuthStore } from './types';
import { supabase } from '../integrations/supabase/client';
import { usePortfolioStore } from './portfolioStore';
import { useMarketDataStore } from './marketDataStore';
import { useTradingStore } from './tradingStore';

const SESSION_REFRESH_INTERVAL = 1000 * 60 * 15; // 15 minutes
const TOKEN_REFRESH_MARGIN = 1000 * 60 * 5; // 5 minutes before expiry

const initialState = {
  user: null,
  session: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isEmailVerified: false,
  profile: null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => {
        let sessionRefreshInterval: NodeJS.Timeout | null = null;

        const setupSessionRefresh = () => {
          if (sessionRefreshInterval) {
            clearInterval(sessionRefreshInterval);
          }

          sessionRefreshInterval = setInterval(async () => {
            const session = await supabase.auth.getSession();
            if (session.data.session) {
              const expiresAt = new Date(session.data.session.expires_at).getTime();
              const now = Date.now();

              if (expiresAt - now <= TOKEN_REFRESH_MARGIN) {
                const { data, error } = await supabase.auth.refreshSession();
                if (!error && data.session) {
                  set({ session: data.session });
                }
              }
            }
          }, SESSION_REFRESH_INTERVAL);
        };

        const cleanupStores = () => {
          // Clean up other stores when logging out
          usePortfolioStore.getState().cleanup?.();
          useMarketDataStore.getState().watchlist.forEach((symbol) => {
            useMarketDataStore.getState().unsubscribeFromMarketData(symbol.symbol);
          });
          useMarketDataStore.setState((state) => ({ ...state, watchlist: [], marketData: {} }));
          useTradingStore.setState((state) => ({
            ...state,
            positions: [],
            orders: [],
            orderHistory: [],
          }));
        };

        return {
          ...initialState,

          initialize: async () => {
            try {
              const {
                data: { session },
                error,
              } = await supabase.auth.getSession();
              if (error) throw error;

              if (session) {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();

                set({
                  user: session.user,
                  session,
                  isAuthenticated: true,
                  isEmailVerified: session.user.email_confirmed_at != null,
                  profile,
                });

                setupSessionRefresh();
              }
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Failed to initialize session',
              });
            }
          },

          login: async (email: string, password: string) => {
            try {
              set({ isLoading: true, error: null });
              const {
                data: { session, user },
                error,
              } = await supabase.auth.signInWithPassword({
                email,
                password,
              });

              if (error) throw error;

              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

              set({
                user,
                session,
                isAuthenticated: true,
                isLoading: false,
                isEmailVerified: user.email_confirmed_at != null,
                profile,
              });

              setupSessionRefresh();
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Failed to login',
                isLoading: false,
              });
              throw error;
            }
          },

          logout: async () => {
            try {
              set({ isLoading: true, error: null });
              const { error } = await supabase.auth.signOut();

              if (error) throw error;

              if (sessionRefreshInterval) {
                clearInterval(sessionRefreshInterval);
              }

              cleanupStores();

              set({
                ...initialState,
                isLoading: false,
              });
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Failed to logout',
                isLoading: false,
              });
              throw error;
            }
          },

          register: async (email: string, password: string, username: string) => {
            try {
              set({ isLoading: true, error: null });
              const {
                data: { user, session },
                error,
              } = await supabase.auth.signUp({
                email,
                password,
                options: {
                  data: {
                    username,
                  },
                },
              });

              if (error) throw error;

              // Create user profile
              if (user) {
                const { error: profileError } = await supabase.from('profiles').insert([
                  {
                    id: user.id,
                    username,
                    email,
                    created_at: new Date().toISOString(),
                  },
                ]);

                if (profileError) throw profileError;
              }

              set({
                user,
                session,
                isAuthenticated: true,
                isLoading: false,
                isEmailVerified: false,
                profile: {
                  id: user.id,
                  username,
                  email,
                  created_at: new Date().toISOString(),
                },
              });
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Failed to register',
                isLoading: false,
              });
              throw error;
            }
          },

          resetPassword: async (email: string) => {
            try {
              set({ isLoading: true, error: null });
              const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
              });

              if (error) throw error;

              set({ isLoading: false });
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Failed to reset password',
                isLoading: false,
              });
              throw error;
            }
          },

          updatePassword: async (password: string) => {
            try {
              set({ isLoading: true, error: null });
              const { error } = await supabase.auth.updateUser({
                password,
              });

              if (error) throw error;

              set({ isLoading: false });
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Failed to update password',
                isLoading: false,
              });
              throw error;
            }
          },

          updateProfile: async (updates: Partial<Profile>) => {
            try {
              set({ isLoading: true, error: null });
              const {
                data: { user },
              } = await supabase.auth.getUser();
              if (!user) throw new Error('User not authenticated');

              const { data, error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

              if (error) throw error;

              set({
                profile: data,
                isLoading: false,
              });
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Failed to update profile',
                isLoading: false,
              });
              throw error;
            }
          },

          refreshSession: async () => {
            try {
              const {
                data: { session },
                error,
              } = await supabase.auth.getSession();
              if (error) throw error;

              if (session) {
                set({
                  session,
                  user: session.user,
                  isAuthenticated: true,
                });
              }
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Failed to refresh session',
              });
            }
          },
        };
      },
      {
        name: 'auth-store',
        // Only persist non-sensitive data
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          profile: {
            username: state.profile?.username,
            email: state.profile?.email,
          },
        }),
      }
    )
  )
);

// Initialize auth store when the app loads
useAuthStore.getState().initialize();
