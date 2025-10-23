import { supabase } from '@/integrations/supabase/client';

const FINNHUB_API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;
const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const POLLING_INTERVAL = 5000; // 5 seconds for real-time updates
const CACHE_DURATION = 300000; // 5 minutes for caching quotes

// Rate limiting for Finnhub API (60 requests per minute)
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 55; // Keep some buffer below limit
const API_CALLS: number[] = [];

interface OHLCVData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface MarketQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  bid: number;
  ask: number;
  updated_at: string;
}

interface MarketOHLCV {
  symbol: string;
  interval: string;
  data: OHLCVData[];
  lastUpdated: number;
}

class MarketDataService {
  private subscriptions = new Map<string, Set<(data: MarketQuote) => void>>();
  private pollingIntervals = new Map<string, NodeJS.Timeout>();
  private cachedData = new Map<string, MarketQuote>();
  private cachedOHLCV = new Map<string, Map<string, MarketOHLCV>>();
  private isInitialized = false;

  constructor() {
    // Initialize with cached data from database
    this.initializeFromCache();
  }

  private async initializeFromCache() {
    try {
      const { data: cachedQuotes, error } = await supabase
        .from('market_data_cache')
        .select('*')
        .gt('updated_at', new Date(Date.now() - CACHE_DURATION).toISOString());

      if (error) {
        console.warn('Failed to load cached market data:', error);
        return;
      }

      // Populate cache with fresh database data
      cachedQuotes?.forEach((quote) => {
        const marketQuote: MarketQuote = {
          symbol: quote.symbol,
          price: quote.price,
          change: quote.change || 0,
          changePercent: quote.change_percent || 0,
          volume: quote.volume || 0,
          high: quote.high || 0,
          low: quote.low || 0,
          open: quote.open || 0,
          bid: quote.bid || quote.price,
          ask: quote.ask || quote.price,
          updated_at: quote.updated_at,
        };
        this.cachedData.set(quote.symbol, marketQuote);
      });

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize market data cache:', error);
    }
  }

  private checkRateLimit(): boolean {
    const now = Date.now();

    // Clean up old API calls outside the window
    API_CALLS.splice(
      0,
      API_CALLS.findIndex((call) => now - call > RATE_LIMIT_WINDOW)
    );

    return API_CALLS.length < MAX_REQUESTS_PER_WINDOW;
  }

  private recordApiCall() {
    API_CALLS.push(Date.now());
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async fetchFromFinnhub(
    endpoint: string,
    params: Record<string, string> = {}
  ): Promise<Record<string, any>> {
    if (!FINNHUB_API_KEY || !this.checkRateLimit()) {
      throw new Error('Finnhub API key missing or rate limit exceeded');
    }

    this.recordApiCall();

    const urlParams = new URLSearchParams({
      token: FINNHUB_API_KEY,
      ...params,
    });

    const response = await fetch(`${FINNHUB_BASE_URL}${endpoint}?${urlParams.toString()}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'TradeX-Pro/1.0.0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Finnhub API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(`Finnhub API: ${data.error}`);
    }

    return data;
  }

  async getQuote(symbol: string): Promise<MarketQuote> {
    try {
      // Try to fetch from Finnhub API first
      const finnhubData = await this.fetchFromFinnhub('/quote', { symbol });

      const quote: MarketQuote = {
        symbol: symbol,
        price: finnhubData.c, // Current price
        change: finnhubData.d, // Change
        changePercent: finnhubData.dp, // Change percent
        volume: finnhubData.v || 0,
        high: finnhubData.h, // High price
        low: finnhubData.l, // Low price
        open: finnhubData.o, // Open price
        bid: finnhubData.c - 0.01, // Approximate bid
        ask: finnhubData.c + 0.01, // Approximate ask
        updated_at: new Date().toISOString(),
      };

      // Cache the result
      this.cachedData.set(symbol, quote);

      // Update database cache asynchronously
      this.updateDatabaseCache(quote);

      return quote;
    } catch (error) {
      console.warn(`Failed to fetch quote for ${symbol}:`, error);

      // Fallback to cached data
      const cachedQuote = this.cachedData.get(symbol);
      if (cachedQuote) {
        return cachedQuote;
      }

      // Try to get from database as last resort
      const { data: dbQuote, error: dbError } = await supabase
        .from('market_data_cache')
        .select('*')
        .eq('symbol', symbol)
        .single();

      if (dbQuote && !dbError) {
        const quote: MarketQuote = {
          symbol: dbQuote.symbol,
          price: dbQuote.price,
          change: dbQuote.change || 0,
          changePercent: dbQuote.change_percent || 0,
          volume: dbQuote.volume || 0,
          high: dbQuote.high || 0,
          low: dbQuote.low || 0,
          open: dbQuote.open || 0,
          bid: dbQuote.bid || dbQuote.price,
          ask: dbQuote.ask || dbQuote.price,
          updated_at: dbQuote.updated_at,
        };
        this.cachedData.set(symbol, quote);
        return quote;
      }

      throw new Error(`Unable to get market data for ${symbol}`);
    }
  }

  async getOHLCV(
    symbol: string,
    resolution: string = '1',
    from?: number,
    to?: number
  ): Promise<MarketOHLCV> {
    const cacheKey = `${symbol}_${resolution}`;
    const cachedData = this.cachedOHLCV.get(symbol)?.get(resolution);

    // Return cached data if it's still fresh
    if (cachedData && Date.now() - cachedData.lastUpdated < CACHE_DURATION) {
      return cachedData;
    }

    try {
      const now = Math.floor(Date.now() / 1000);
      const fromTime = from || now - 30 * 24 * 60 * 60; // 30 days ago
      const toTime = to || now;

      const finnhubData = await this.fetchFromFinnhub('/stock/candle', {
        symbol,
        resolution,
        from: fromTime.toString(),
        to: toTime.toString(),
      });

      if (finnhubData.s !== 'ok') {
        throw new Error(`Invalid response status: ${finnhubData.s}`);
      }

      const data: OHLCVData[] = (finnhubData.t as number[]).map(
        (timestamp: number, index: number) => ({
          timestamp: timestamp * 1000, // Convert to milliseconds
          open: finnhubData.o[index],
          high: finnhubData.h[index],
          low: finnhubData.l[index],
          close: finnhubData.c[index],
          volume: finnhubData.v[index],
        })
      );

      const ohlcvData: MarketOHLCV = {
        symbol,
        interval: resolution,
        data,
        lastUpdated: Date.now(),
      };

      // Cache the result
      if (!this.cachedOHLCV.has(symbol)) {
        this.cachedOHLCV.set(symbol, new Map());
      }
      this.cachedOHLCV.get(symbol)!.set(resolution, ohlcvData);

      return ohlcvData;
    } catch (error) {
      console.warn(`Failed to fetch OHLCV data for ${symbol}:`, error);

      // Return cached data if available
      if (cachedData) {
        return cachedData;
      }

      throw new Error(`Unable to get OHLCV data for ${symbol}`);
    }
  }

  private async updateDatabaseCache(quote: MarketQuote) {
    try {
      await supabase.from('market_data_cache').upsert({
        symbol: quote.symbol,
        price: quote.price,
        change: quote.change,
        change_percent: quote.changePercent,
        volume: quote.volume,
        high: quote.high,
        low: quote.low,
        open: quote.open,
        bid: quote.bid,
        ask: quote.ask,
        updated_at: quote.updated_at,
      });
    } catch (error) {
      console.warn('Failed to update database cache:', error);
    }
  }

  subscribeToUpdates(symbol: string, callback: (data: MarketQuote) => void): () => void {
    if (!this.subscriptions.has(symbol)) {
      this.subscriptions.set(symbol, new Set());
    }

    const subscribers = this.subscriptions.get(symbol)!;
    subscribers.add(callback);

    // Start polling if this is the first subscriber
    if (!this.pollingIntervals.has(symbol)) {
      const interval = setInterval(async () => {
        try {
          const quote = await this.getQuote(symbol);
          const subscribers = this.subscriptions.get(symbol);
          if (subscribers) {
            subscribers.forEach((subscriber) => subscriber(quote));
          }
        } catch (error) {
          console.warn(`Failed to update ${symbol} in subscription:`, error);
        }
      }, POLLING_INTERVAL);
      this.pollingIntervals.set(symbol, interval);
    }

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscriptions.get(symbol);
      if (subscribers) {
        subscribers.delete(callback);
        if (subscribers.size === 0) {
          // No more subscribers, stop polling
          this.subscriptions.delete(symbol);
          const interval = this.pollingIntervals.get(symbol);
          if (interval) {
            clearInterval(interval);
            this.pollingIntervals.delete(symbol);
          }
        }
      }
    };
  }

  async getMultipleQuotes(symbols: string[]): Promise<Map<string, MarketQuote>> {
    const results = new Map<string, MarketQuote>();

    // Process in batches to respect rate limits
    const batchSize = 10;
    for (let i = 0; i < symbols.length; i += batchSize) {
      const batch = symbols.slice(i, i + batchSize);
      const batchPromises = batch.map((symbol) => this.getQuote(symbol));

      try {
        const batchResults = await Promise.allSettled(batchPromises);
        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            results.set(batch[index], result.value);
          } else {
            console.warn(`Failed to get quote for ${batch[index]}:`, result.reason);
          }
        });
      } catch (error) {
        console.warn('Batch quote fetch failed:', error);
      }

      // Small delay between batches to be rate-limit friendly
      if (i + batchSize < symbols.length) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  // Cleanup method to stop all polling when service is destroyed
  destroy() {
    this.pollingIntervals.forEach((interval) => clearInterval(interval));
    this.pollingIntervals.clear();
    this.subscriptions.clear();
    this.cachedData.clear();
    this.cachedOHLCV.clear();
  }
}

// Export singleton instance
export const marketDataService = new MarketDataService();
