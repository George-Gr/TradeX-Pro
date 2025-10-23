# TradeX Pro State Management Documentation

## Overview

TradeX Pro uses Zustand for state management, organized into domain-specific stores. Each store is responsible for a specific aspect of the application's state and provides a clean API for state updates and actions.

## Stores Structure

### Trading Store (`tradingStore.ts`)

Manages all trading-related state including positions, orders, and selected symbols.

```typescript
import { useTradingStore } from '@/stores';

// Access state
const positions = useTradingStore((state) => state.positions);
const selectedSymbol = useTradingStore((state) => state.selectedSymbol);

// Perform actions
await useTradingStore.getState().placeOrder({
  symbol: 'AAPL',
  side: 'buy',
  quantity: 100,
  price: 150.0,
});
```

### Authentication Store (`authStore.ts`)

Handles user authentication state and operations.

```typescript
import { useAuthStore } from '@/stores';

// Login
await useAuthStore.getState().login(email, password);

// Access auth state
const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
const user = useAuthStore((state) => state.user);
```

### Portfolio Store (`portfolioStore.ts`)

Manages user portfolio and balance information.

```typescript
import { usePortfolioStore } from '@/stores';

// Fetch portfolio data
await usePortfolioStore.getState().fetchPortfolio();

// Access portfolio state
const portfolio = usePortfolioStore((state) => state.portfolio);
const balances = usePortfolioStore((state) => state.balances);
```

### Market Data Store (`marketDataStore.ts`)

Handles real-time market data and watchlist management.

```typescript
import { useMarketDataStore } from '@/stores';

// Subscribe to market data
await useMarketDataStore.getState().subscribeToMarketData('AAPL');

// Access market data
const marketData = useMarketDataStore((state) => state.marketData['AAPL']);
const watchlist = useMarketDataStore((state) => state.watchlist);
```

### Notification Store (`notificationStore.ts`)

Manages system notifications and alerts.

```typescript
import { useNotificationStore } from '@/stores';

// Add notification
useNotificationStore.getState().addNotification({
  type: 'success',
  title: 'Order Placed',
  message: 'Your order has been successfully placed',
});

// Access notifications
const notifications = useNotificationStore((state) => state.notifications);
const hasUnread = useNotificationStore((state) => state.hasUnread);
```

## Best Practices

1. **Selector Usage**
   - Always use selectors to access store state
   - Keep selectors as specific as possible to prevent unnecessary re-renders

```typescript
// Good
const symbol = useTradingStore((state) => state.selectedSymbol);

// Bad - causes re-renders when other state changes
const state = useTradingStore((state) => state);
```

2. **Action Handling**
   - Use store actions for all state modifications
   - Handle errors within store actions
   - Keep components free of state management logic

3. **Store Integration**
   - Prefer combining stores at the hook level rather than store level
   - Create custom hooks for complex state combinations

```typescript
// Custom hook combining multiple stores
export const useTradeExecution = () => {
  const placeOrder = useTradingStore((state) => state.placeOrder);
  const balance = usePortfolioStore((state) => state.balances);
  const marketData = useMarketDataStore((state) => state.marketData);

  // Custom logic combining multiple stores
  return {
    // ... combined functionality
  };
};
```

4. **Error Handling**
   - Always check `isLoading` and `error` states
   - Handle errors at the component level
   - Show appropriate loading and error states to users

```typescript
const { isLoading, error, data } = useTradingStore((state) => ({
  isLoading: state.isLoading,
  error: state.error,
  data: state.positions
}))

if (isLoading) return <LoadingSpinner />
if (error) return <ErrorMessage message={error} />
```

## Store Migration Guide

When migrating existing components to use the new store structure:

1. Identify local state that should be moved to stores
2. Replace useState/useReducer with store selectors
3. Replace local state updates with store actions
4. Remove redundant prop drilling
5. Update unit tests to mock store hooks

Example migration:

```typescript
// Before
const TradingComponent = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPositions();
  }, []);

  // ... component logic
};

// After
const TradingComponent = () => {
  const positions = useTradingStore((state) => state.positions);
  const isLoading = useTradingStore((state) => state.isLoading);

  useEffect(() => {
    useTradingStore.getState().fetchPositions();
  }, []);

  // ... component logic
};
```
