import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { MarketDataStore } from './types';
import { MarketData, Symbol } from '../types/trading';
import { supabase } from '../integrations/supabase/client';

interface WebSocketConnection {
  ws: WebSocket;
  reconnectAttempts: number;
  reconnectTimeout?: NodeJS.Timeout;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 2000; // 2 seconds

const initialState = {
  marketData: {},
  watchlist: [],
  isLoading: false,
  error: null,
};

export const useMarketDataStore = create<MarketDataStore>()(
  devtools(
    persist(
      (set, get) => {
        const connections: Record<string, WebSocketConnection> = {};

        const setupWebSocket = (symbol: string) => {
          if (connections[symbol]?.ws) {
            connections[symbol].ws.close();
          }

          const wsUrl =
            import.meta.env.VITE_MARKET_DATA_WS_URL || 'wss://api.tradex.pro/market-data';
          const ws = new WebSocket(`${wsUrl}/${symbol}`);

          connections[symbol] = {
            ws,
            reconnectAttempts: 0,
          };

          ws.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              get().updateMarketData(symbol, data);
            } catch (error) {
              console.error('Failed to parse market data:', error);
            }
          };

          ws.onclose = () => {
            if (connections[symbol].reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
              connections[symbol].reconnectTimeout = setTimeout(
                () => {
                  connections[symbol].reconnectAttempts++;
                  setupWebSocket(symbol);
                },
                RECONNECT_DELAY * Math.pow(2, connections[symbol].reconnectAttempts)
              );
            } else {
              set((state) => ({
                error: `Connection to ${symbol} market data failed after ${MAX_RECONNECT_ATTEMPTS} attempts`,
              }));
            }
          };

          ws.onerror = (error) => {
            console.error(`WebSocket error for ${symbol}:`, error);
            ws.close();
          };

          return ws;
        };

        return {
          ...initialState,

          updateMarketData: (symbol: string, data: MarketData) => {
            set((state) => ({
              marketData: {
                ...state.marketData,
                [symbol]: {
                  ...state.marketData[symbol],
                  ...data,
                  lastUpdated: new Date().toISOString(),
                },
              },
            }));
          },

          addToWatchlist: async (symbol: Symbol) => {
            try {
              const {
                data: { user },
              } = await supabase.auth.getUser();
              if (!user) throw new Error('User not authenticated');

              const { error } = await supabase.from('watchlists').upsert({
                user_id: user.id,
                symbol: symbol.symbol,
                created_at: new Date().toISOString(),
              });

              if (error) throw error;

              set((state) => ({
                watchlist: [...state.watchlist, symbol],
              }));

              // Start WebSocket subscription for the new symbol
              get().subscribeToMarketData(symbol.symbol);
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Failed to add to watchlist',
              });
              throw error;
            }
          },

          removeFromWatchlist: async (symbol: Symbol) => {
            try {
              const {
                data: { user },
              } = await supabase.auth.getUser();
              if (!user) throw new Error('User not authenticated');

              const { error } = await supabase
                .from('watchlists')
                .delete()
                .eq('user_id', user.id)
                .eq('symbol', symbol.symbol);

              if (error) throw error;

              set((state) => ({
                watchlist: state.watchlist.filter((s) => s.symbol !== symbol.symbol),
              }));

              // Unsubscribe from the symbol's market data
              get().unsubscribeFromMarketData(symbol.symbol);
            } catch (error) {
              set({
                error: error instanceof Error ? error.message : 'Failed to remove from watchlist',
              });
              throw error;
            }
          },

          subscribeToMarketData: (symbol: string) => {
            try {
              set({ isLoading: true, error: null });
              setupWebSocket(symbol);
              set({ isLoading: false });
            } catch (error) {
              set({
                error:
                  error instanceof Error ? error.message : 'Failed to subscribe to market data',
                isLoading: false,
              });
              throw error;
            }
          },

          unsubscribeFromMarketData: (symbol: string) => {
            if (connections[symbol]) {
              if (connections[symbol].reconnectTimeout) {
                clearTimeout(connections[symbol].reconnectTimeout);
              }
              connections[symbol].ws.close();
              delete connections[symbol];

              // Clear market data for the unsubscribed symbol
              set((state) => {
                const { [symbol]: _, ...remainingMarketData } = state.marketData;
                return { marketData: remainingMarketData };
              });
            }
          },
        };
      },
      {
        name: 'market-data-store',
        partialize: (state) => ({
          watchlist: state.watchlist,
        }),
      }
    ),
    { name: 'market-data-store' }
  )
);
