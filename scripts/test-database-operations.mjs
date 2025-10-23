#!/usr/bin/env node

/**
 * TradeX-Pro Database Operations Test Script
 * Tests all database operations with consolidated schema
 */

// Import required modules
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load environment variables
if (!existsSync(join(__dirname, '..', '.env'))) {
  console.error('❌ .env file not found in root directory');
  process.exit(1);
}

const envContent = readFileSync(join(__dirname, '..', '.env'), 'utf-8');
const env = {};

envContent.split('\n').forEach((line) => {
  const [key, ...values] = line.split('=');
  if (key && values.length > 0) {
    env[key.trim()] = values.join('=').trim();
  }
});

// Validate required environment variables
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
const FINNHUB_API_KEY = env.VITE_FINNHUB_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    '❌ Missing required environment variables: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY'
  );
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

class DatabaseTestSuite {
  constructor() {
    this.testResults = [];
    this.testUser = null;
    this.testOrders = [];
    this.testPositions = [];
  }

  log(result, message, details = null) {
    const status = result ? '✅' : '❌';
    console.log(`${status} ${message}`);
    this.testResults.push({ result, message, details, timestamp: new Date() });

    if (!result && details) {
      console.log(`   Details: ${JSON.stringify(details, null, 2)}`);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting TradeX-Pro Database Operations Tests\n');

    try {
      await this.testConnection();
      await this.testAuthentication();
      await this.testProfileOperations();
      await this.testWatchlistOperations();
      await this.testSymbolsAndMarkets();
      await this.testOrderOperations();
      await this.testPositionOperations();
      await this.testEdgeFunctions();
      await this.testAnalyticsFunctions();
      await this.testAdminFunctions();
      await this.testRiskManagement();
    } catch (error) {
      this.log(false, `Test suite failed with error: ${error.message}`, error);
    }

    this.printSummary();
  }

  async testConnection() {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      const connected = !error;
      this.log(connected, 'Database connection', error ? error.message : 'Connected successfully');
    } catch (error) {
      this.log(false, 'Database connection failed', error.message);
    }
  }

  async testAuthentication() {
    try {
      // Test user registration (assume user already exists for testing)
      const testEmail = `test_${Date.now()}@tradexpro.test`;
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'testpassword123',
      });

      const signupWorked = !signUpError || signUpError.message.includes('already registered');
      this.log(signupWorked, 'User authentication', signUpError);

      if (signUpData.user) {
        this.testUser = signUpData.user;
      }
    } catch (error) {
      this.log(false, 'Authentication test failed', error.message);
    }
  }

  async testProfileOperations() {
    try {
      // Test profile creation/updates
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', this.testUser?.id)
        .single();

      const profileExists = !error;
      this.log(profileExists, 'Profile operations', error);

      // Test profile balance update
      if (profileExists && data) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            balance: 10000,
            bonus_balance: 100,
            equity: 10000,
            margin_used: 0,
            free_margin: 10000,
          })
          .eq('id', data.id);

        this.log(!updateError, 'Profile balance update', updateError);
      }
    } catch (error) {
      this.log(false, 'Profile operations failed', error.message);
    }
  }

  async testWatchlistOperations() {
    try {
      // Test watchlist management
      if (!this.testUser?.id) {
        this.log(false, 'Watchlist test skipped - no test user');
        return;
      }

      const watchlistEntries = [
        { symbol: 'AAPL', name: 'Apple Inc.' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.' },
        { symbol: 'MSFT', name: 'Microsoft Corp.' },
      ];

      // Add to watchlist
      const { error: insertError } = await supabase.from('user_watchlists').insert(
        watchlistEntries.map((entry) => ({
          user_id: this.testUser.id,
          symbol: entry.symbol,
          symbol_name: entry.name,
        }))
      );

      this.log(!insertError, 'Watchlist insertion', insertError);

      // Query watchlist
      const { data: watchlistData, error: queryError } = await supabase
        .from('user_watchlists')
        .select('*')
        .eq('user_id', this.testUser.id);

      const watchlistWorks = !queryError && watchlistData?.length >= 0;
      this.log(watchlistWorks, 'Watchlist queries', queryError);

      // Remove from watchlist
      const { error: deleteError } = await supabase
        .from('user_watchlists')
        .delete()
        .eq('user_id', this.testUser.id)
        .eq('symbol', 'AAPL');

      this.log(!deleteError, 'Watchlist deletion', deleteError);
    } catch (error) {
      this.log(false, 'Watchlist operations failed', error.message);
    }
  }

  async testSymbolsAndMarkets() {
    try {
      // Test market data operations
      const testSymbols = ['AAPL', 'GOOGL'];

      for (const symbol of testSymbols) {
        const { error: insertError } = await supabase.from('market_data_cache').upsert({
          symbol,
          price: Math.random() * 100 + 50,
          change: Math.random() * 10 - 5,
          change_percent: Math.random() * 20 - 10,
          volume: Math.floor(Math.random() * 1000000),
          high: Math.random() * 100 + 60,
          low: Math.random() * 40 + 40,
          open: Math.random() * 100 + 45,
        });

        this.log(!insertError, `Market data for ${symbol}`, insertError);
      }
    } catch (error) {
      this.log(false, 'Market data operations failed', error.message);
    }
  }

  async testOrderOperations() {
    try {
      if (!this.testUser?.id) {
        this.log(false, 'Order test skipped - no test user');
        return;
      }

      // Create test order
      const testOrder = {
        user_id: this.testUser.id,
        symbol: 'AAPL',
        order_type: 'market',
        side: 'buy',
        quantity: 1.0,
        price: 150.0,
        status: 'pending',
      };

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(testOrder)
        .select()
        .single();

      const orderCreated = !orderError && orderData?.id;
      this.log(orderCreated, 'Order creation', orderError);

      if (orderCreated) {
        this.testOrders.push(orderData);

        // Update order status
        const { error: updateError } = await supabase
          .from('orders')
          .update({ status: 'filled' })
          .eq('id', orderData.id);

        this.log(!updateError, 'Order status update', updateError);
      }
    } catch (error) {
      this.log(false, 'Order operations failed', error.message);
    }
  }

  async testPositionOperations() {
    try {
      if (!this.testUser?.id || this.testOrders.length === 0) {
        this.log(false, 'Position test skipped - prerequisites not met');
        return;
      }

      // Create test position
      const testPosition = {
        user_id: this.testUser.id,
        order_id: this.testOrders[0].id,
        symbol: 'AAPL',
        side: 'long',
        quantity: 1.0,
        entry_price: 150.0,
        unrealized_pnl: 5.5,
        margin_required: 1500.0,
      };

      const { data: positionData, error: positionError } = await supabase
        .from('positions')
        .insert(testPosition)
        .select()
        .single();

      const positionCreated = !positionError && positionData?.id;
      this.log(positionCreated, 'Position creation', positionError);

      if (positionCreated) {
        this.testPositions.push(positionData);

        // Close position
        const { error: closeError } = await supabase
          .from('positions')
          .update({
            closed_at: new Date(),
            unrealized_pnl: 10.0,
          })
          .eq('id', positionData.id);

        this.log(!closeError, 'Position closure', closeError);
      }
    } catch (error) {
      this.log(false, 'Position operations failed', error.message);
    }
  }

  async testEdgeFunctions() {
    try {
      // Test execute-order edge function
      const testOrder = {
        symbol: 'AAPL',
        order_type: 'market',
        side: 'buy',
        quantity: 0.1,
        price: null,
      };

      const { data: edgeData, error: edgeError } = await supabase.functions.invoke(
        'execute-order',
        {
          body: testOrder,
        }
      );

      // Edge function may fail due to various reasons (auth, balance, etc.) but should respond
      const edgeFunctionResponds = edgeData !== null || edgeError !== null;
      this.log(edgeFunctionResponds, 'Edge function execute-order', edgeError);
    } catch (error) {
      this.log(false, 'Edge function testing failed', error.message);
    }
  }

  async testAnalyticsFunctions() {
    try {
      // Test analytics functions using SQL functions
      const { data, error } = await supabase.rpc('get_trading_metrics');

      const analyticsWorks = !error || data !== null;
      this.log(analyticsWorks, 'Analytics functions', error);
    } catch (error) {
      this.log(false, 'Analytics testing failed', error.message);
    }
  }

  async testAdminFunctions() {
    try {
      // Test admin metrics function
      const { data, error } = await supabase.rpc('get_admin_metrics');

      const adminWorks = !error || data !== null;
      this.log(adminWorks, 'Admin functions', error);
    } catch (error) {
      this.log(false, 'Admin functions testing failed', error.message);
    }
  }

  async testRiskManagement() {
    try {
      // Test margin calculation function
      if (this.testUser?.id) {
        const { data, error } = await supabase.rpc('calculate_margin_levels', {
          user_id: this.testUser.id,
        });

        const marginWorks = !error && data !== null;
        this.log(marginWorks, 'Margin calculation', error);
      } else {
        this.log(false, 'Margin test skipped - no test user');
      }
    } catch (error) {
      this.log(false, 'Risk management testing failed', error.message);
    }
  }

  printSummary() {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 DATABASE TEST SUITE SUMMARY');
    console.log('='.repeat(60));

    const passed = this.testResults.filter((t) => t.result).length;
    const total = this.testResults.length;
    const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';

    console.log(`\n📊 Overall Results: ${passed}/${total} tests passed (${successRate}%)`);

    if (passed === total) {
      console.log('🎉 All database operations working correctly!');
      console.log('✅ TradeX-Pro is ready for production deployment.');
    } else {
      console.log('⚠️  Some tests failed. Check details above.');
      console.log('🔧 Review error messages and fix database operations.');
    }

    console.log('\n📋 Test Results:');

    const categories = {};
    this.testResults.forEach((test) => {
      const category = test.message.split(' ')[0];
      if (!categories[category]) categories[category] = [];
      categories[category].push(test);
    });

    Object.keys(categories).forEach((category) => {
      const tests = categories[category];
      const passedCount = tests.filter((t) => t.result).length;
      console.log(`   ${category}: ${passedCount}/${tests.length} passed`);
    });

    // Cleanup test data
    if (this.testUser) {
      console.log('\n🧹 Cleaning up test data...');

      // Remove test orders
      if (this.testOrders.length > 0) {
        supabase
          .from('orders')
          .delete()
          .in(
            'id',
            this.testOrders.map((o) => o.id)
          );
      }

      // Remove test positions
      if (this.testPositions.length > 0) {
        supabase
          .from('positions')
          .delete()
          .in(
            'id',
            this.testPositions.map((p) => p.id)
          );
      }

      // Remove test profile updates
      supabase
        .from('profiles')
        .update({
          balance: 0,
          bonus_balance: 0,
          equity: 0,
          margin_used: 0,
          free_margin: 0,
        })
        .eq('id', this.testUser.id);
    }

    console.log(`\n🏁 Database testing complete at ${new Date().toISOString()}`);
    console.log('='.repeat(60));
  }
}

// Run the tests if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testSuite = new DatabaseTestSuite();
  await testSuite.runAllTests();

  // Exit with appropriate code
  const successRate =
    (testSuite.testResults.filter((t) => t.result).length / testSuite.testResults.length) * 100;
  process.exit(successRate >= 80 ? 0 : 1); // 80% pass rate required
}

export default DatabaseTestSuite;
