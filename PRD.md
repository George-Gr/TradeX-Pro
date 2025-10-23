# **COMPLETE PRODUCT REQUIREMENTS DOCUMENT**

---

# **🏦 TRADEPRO v10: COMPLETE PRODUCT REQUIREMENTS DOCUMENT**

**Document Version:** 1.0  
 **Status:** Production-Ready  
 **Last Updated:** 2025  
 **Audience:** Developers, Product Managers, Compliance, Stakeholders

---

## **1.0 EXECUTIVE SUMMARY & VISION**

### **1.0.1 Market Opportunity**

The global CFD trading market exceeds **$200 billion in daily volume** with growing demand for accessible, transparent, and educational trading platforms. Traditional brokers charge opaque fees, limit leverage, and restrict copy trading. **TradePro** fills this gap by delivering a **broker-independent, comprehensive paper trading and social learning platform** enabling traders of all skill levels to practice, learn, and collaborate risk-free.

### **1.0.2 Product Mission**

To empower global traders through a **unified, professional-grade CFD simulation platform** that combines:

- **Multi-asset trading** (10,000+ CFDs: forex, stocks, commodities, indices, crypto, ETFs, bonds)
- **AI-driven insights** and social copy trading
- **Unlimited practice** with zero forced resets
- **Transparent, broker-defined parameters** (fixed leverage, spreads, commissions)
- **Enterprise-level compliance** and security

### **1.0.3 Business Goals**

1. **User Adoption:** Reach 1M+ active monthly traders within 18 months
2. **Engagement:** 40%+ of users completing KYC and trading regularly
3. **Monetization:** In-app premium features, institutional licensing, API access
4. **Retention:** \>60% month-over-month user retention through community and education
5. **Compliance:** 100% regulatory alignment across target markets

### **1.0.4 Core Value Propositions**

| Proposition             | Description                                                                   |
| ----------------------- | ----------------------------------------------------------------------------- |
| **Unlimited Practice**  | No demo expiry; unlimited virtual capital for iterative learning              |
| **Broker Independence** | No reliance on external brokers; full simulation control and consistency      |
| **Social Trading**      | Copy verified pro traders in real time with transparent performance tracking  |
| **Transparent Pricing** | Fixed, broker-defined leverage, spreads, and commissions—no hidden fees       |
| **Global Access**       | Multi-currency, 24/7 market coverage, geographically available via cloud      |
| **Enterprise Security** | Bank-grade encryption, KYC/AML, RLS, compliance audit trails                  |
| **AI Analytics**        | Behavioral insights, trade optimization, risk profiling, strategy backtesting |

---

## **1.1 PLATFORM DIFFERENTIATORS**

### **1.1.1 Competitive Advantages vs. Market Leaders**

| Feature                    | TradePro                | MetaTrader          | TradingView | IC Markets     | Others         |
| -------------------------- | ----------------------- | ------------------- | ----------- | -------------- | -------------- |
| **Unlimited Free Demo**    | ✅ Yes, forever         | ⚠️ 30 days          | ✅ Yes      | ⚠️ Limited     | ❌ No          |
| **Social Copy Trading**    | ✅ Built-in             | ❌ No               | ⚠️ Premium  | ⚠️ Premium     | ⚠️ Third-party |
| **Broker Independent**     | ✅ Full control         | ❌ Broker-dependent | ⚠️ Hybrid   | ❌ Broker-tied | ❌ No          |
| **10,000+ Assets**         | ✅ Yes                  | ⚠️ Broker-dependent | ✅ Yes      | ⚠️ Limited     | ⚠️ Limited     |
| **AI Insights**            | ✅ Behavioral \+ Risk   | ❌ No               | ⚠️ Premium  | ❌ No          | ❌ No          |
| **Mobile Native**          | ✅ Full parity          | ⚠️ Limited          | ⚠️ Limited  | ⚠️ Limited     | ⚠️ Limited     |
| **Community Gamification** | ✅ Badges, Leaderboards | ❌ No               | ⚠️ Ideas    | ❌ No          | ❌ No          |
| **Crypto Payment**         | ✅ NowPayments.io       | ⚠️ Limited          | ❌ No       | ⚠️ Limited     | ❌ No          |
| **Enterprise Compliance**  | ✅ GDPR, CCPA, AML      | ⚠️ Basic            | ⚠️ Basic    | ✅ Yes         | ⚠️ Basic       |
| **Strategy Backtesting**   | ✅ Built-in engine      | ❌ No               | ✅ Yes      | ❌ No          | ⚠️ Limited     |

### **1.1.2 Strategic Positioning**

**TradePro is positioned as the "Facebook of Trading"** — a social, educational, and transparent ecosystem where traders of all levels practice, learn, and earn through verified performance tracking and community engagement.

---

## **2.0 PRODUCT SCOPE & CONSTRAINTS**

### **2.0.1 Features In-Scope**

**Core Platform:**

- Multi-step user registration with email/social authentication
- KYC/AML verification with admin review workflow
- Real-time multi-asset trading engine (market, limit, stop, OCO orders)
- Real-time portfolio analytics and performance tracking
- Social copy trading with verified leader network
- Educational content and trading backtester
- Admin console with lead management and KYC oversight
- Real-time market data aggregation and charting

**Integrations:**

- Supabase (database, auth, Realtime, Edge Functions, storage)
- Finnhub / YFinance (market data)
- TradingView Lightweight (charts)
- NowPayments.io (crypto deposits)
- Google/Apple/Microsoft OAuth (social login)
- Sentry (error tracking)

**Markets & Jurisdictions:**

- Target: EU, UK, US, APAC (excluding restricted regions)
- Initial focus: Retail traders, copy trading community

### **2.0.2 Features Out-of-Scope (Phase 1\)**

- Real money trading (paper trading only)
- Leverage over 500x (capped per regulatory guidance)
- Options Greeks calculation (Phase 2\)
- Automated advisor / robo-trading (Phase 2\)
- Native mobile apps (web-first; native apps Phase 2\)
- Advanced charting tools beyond TradingView widgets
- Institutional account types (Phase 2\)
- White-label reselling (Phase 2\)

### **2.0.3 System Constraints**

| Constraint                     | Details                                                          |
| ------------------------------ | ---------------------------------------------------------------- |
| **Order Execution Latency**    | \<500ms p95; \<1000ms p99                                        |
| **Real-Time Update Frequency** | Position/balance updates every 1-5 seconds                       |
| **Concurrent Users**           | Initial: 50K; Scale to 500K+                                     |
| **Data Retention**             | 7 years for audit/compliance logs; 30 days for system logs       |
| **Geo-Restrictions**           | Blocked: Crimea, Syria, North Korea, sanctioned regions per OFAC |
| **User Balance Accuracy**      | ±0.01 (4 decimals precision across all calculations)             |
| **Uptime Target**              | 99.9% SLA (excludes maintenance windows)                         |

### **2.0.4 Regulatory & Compliance Constraints**

- **KYC/AML:** Full identity verification, source of funds screening
- **Leverage Limits:** Max 500x (forex), variable by asset class
- **Age Gate:** 18+ only
- **Regional Compliance:** GDPR (EU), CCPA (US), FCA guidelines (UK)
- **Fraud Detection:** Real-time anomaly detection for suspicious activity
- **Data Residency:** EU data in EU; US data in US (Supabase regional databases)

---

## **3.0 USER PERSONAS & WORKFLOWS**

### **3.0.1 Persona 1: Retail Trader (Primary)**

**Name:** Sarah Chen  
 **Age:** 26  
 **Background:** Entry-level accountant with interest in self-directed investing  
 **Goals:** Learn trading, build a profitable strategy, understand risk management  
 **Pain Points:** Intimidated by real money; lacks mentorship; doesn't know where to start  
 **Motivation:** Free, unlimited practice; community support; verified traders to learn from  
 **Key Behaviors:**

- Spends 5-10 hours/week on platform
- Studies educational content before trading
- Follows 2-3 verified traders via copy trading
- Engages in community forums and competitions

**User Journey:**

1. **Discovery** → Sees ad for free trading simulator
2. **Registration** → Multi-step signup (email \+ social login)
3. **KYC** → Uploads ID and proof of address (15 mins)
4. **Onboarding** → Tutorial on order types, margin, risk
5. **Paper Trading** → Places first trades with $10K virtual capital
6. **Engagement** → Joins copy trading, watches webinars, competes in contests
7. **Monetization** → Upgrades to premium analytics; uses API for algo trading

---

### **3.0.2 Persona 2: Institutional/Pro Trader (Secondary)**

**Name:** Marcus Johnson  
 **Age:** 35  
 **Background:** Former hedge fund manager; now proprietary trader  
 **Goals:** Test new strategies; verify trading logic; benchmark against peers  
 **Pain Points:** MetaTrader cumbersome; brokers restrictive; no clear performance benchmarking  
 **Motivation:** Professional-grade tools; API access; transparent multi-asset universe  
 **Key Behaviors:**

- Uses API to connect proprietary algorithms
- Runs weekly backtests on multiple strategies
- Monitors real-time risk exposure across 20+ positions
- Mentors emerging traders on the platform

**User Journey:**

1. **Registration** → Single-step; instant account creation
2. **API Access** → Requests API key; integrates with trading bot
3. **Backtesting** → Runs historical simulations of strategies
4. **Live Trading** → Executes with full margin; monitors real-time P\&L
5. **Leadership** → Becomes verified trader; accepts followers
6. **Monetization** → Licenses strategy; earns affiliate fees from copy traders

---

### **3.0.3 Persona 3: Copy Trader (Follower)**

**Name:** Aisha Patel  
 **Age:** 31  
 **Background:** Busy entrepreneur with passive income goals  
 **Goals:** Earn through copy trading without hands-on trading  
 **Pain Points:** Time constraints; lacks trading skill; wants passive income  
 **Motivation:** Follow trusted leaders; automatic trade replication; transparent performance tracking  
 **Key Behaviors:**

- Researches top performers weekly
- Allocates $1K-$5K per leader
- Monitors copied portfolio via dashboard
- Replaces underperforming leaders quarterly

**User Journey:**

1. **Discovery** → Browses leaderboard; filters by Sharpe ratio, win rate
2. **Diligence** → Reviews leader's full performance history (1-2 hours)
3. **Setup** → Configures copy ratio (50%), max exposure ($5K), auto-disconnect at 25% drawdown
4. **Execution** → Copies first trade; monitors via dashboard
5. **Optimization** → Adjusts copy settings based on performance
6. **Exit** → Removes leader if performance deteriorates

---

### **3.0.4 Persona 4: Admin / Compliance Officer**

**Name:** David Okonkwo  
 **Age:** 42  
 **Background:** Financial compliance manager at fintech firm  
 **Goals:** Verify users, prevent fraud, ensure regulatory compliance  
 **Pain Points:** Manual document review; slow approval workflows; no real-time monitoring  
 **Motivation:** Streamlined KYC process; automated fraud detection; real-time audit trails  
 **Key Behaviors:**

- Processes 50-100 KYC applications/day
- Flags suspicious accounts for investigation
- Maintains compliance logs for auditors
- Trains other admins on approval workflows

**User Journey:**

1. **Dashboard Login** → Views 10 pending leads
2. **Lead Profile** → Clicks lead; views account metrics and uploaded documents
3. **Document Review** → Downloads ID, proof of address; makes risk assessment
4. **Approval** → Approves KYC; sends automated confirmation email
5. **Account Init** → Assigns $10K balance; sets trading restrictions if needed
6. **Monitoring** → Monitors account for suspicious activity; triggers alerts

---

### **3.0.5 Core Workflows**

**Workflow 1: User Registration & Onboarding**

1\. User visits site  
2\. Clicks "Sign Up"  
3\. Multi-step form:  
 \- Step 1: Email \+ password OR social login (Google/Apple/Microsoft)  
 \- Step 2: Basic profile (name, country, timezone)  
 \- Step 3: Risk assessment questionnaire  
4\. Email verification sent  
5\. Account created with $0 balance (awaiting admin assignment)  
6\. Welcome email with tutorial links  
7\. \[Admin\] Lead entry created; visible in Admin Dashboard  
8\. \[Admin\] Clicks lead; assigns $10K balance \+ $500 trading bonus  
9\. \[User\] Receives "Account Activated" notification  
10\. \[User\] Completes tutorial; places first trade

**Workflow 2: Trading Execution**

1\. User navigates to Trading page  
2\. Selects asset (e.g., EURUSD)  
3\. Enters order details:  
 \- Side: Buy/Sell  
 \- Quantity: 1.0 lot  
 \- Order type: Market  
 \- Stop loss: 1.0900 (optional)  
 \- Take profit: 1.1200 (optional)  
4\. Validates order:  
 \- Checks margin availability  
 \- Verifies market hours  
 \- Calculates slippage  
5\. Executes order atomically (via Edge Function)  
6\. Position created; fills recorded  
7\. Real-time position updates:  
 \- Current price updates every 1 second  
 \- P\&L recalculates in real time  
 \- Margin level monitored continuously  
8\. User monitors via dashboard  
9\. Position closes via:  
 \- Manual close button  
 \- Stop loss trigger (automatic)  
 \- Take profit trigger (automatic)  
 \- Margin call liquidation  
10\. Ledger entry recorded; email notification sent

**Workflow 3: KYC & Compliance**

1\. \[User\] Navigates to KYC section  
2\. Uploads documents:  
 \- ID (front \+ back)  
 \- Proof of address  
 \- Selfie verification  
3\. Documents stored in Supabase Storage  
4\. \[Admin Dashboard\] New KYC application appears  
5\. \[Admin\] Clicks lead profile  
6\. Views all uploaded documents with download links  
7\. Reviews documents; makes decision:  
 \- APPROVED: Account unlocked for trading  
 \- REJECTED: Sends rejection reason to user; allows resubmission  
8\. \[User\] Receives status notification  
9\. KYC event logged to audit trail  
10\. Compliance metrics updated (e.g., % approved, avg review time)

---

## **4.0 ARCHITECTURE OVERVIEW**

### **4.0.1 System Topology**

┌─────────────────────────────────────────────────────────────────────┐  
│ CLIENT LAYER │  
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │  
│ │ Web Browser │ │ Mobile (iOS) │ │Android Phone │ │  
│ │ (React App) │ │ (Future) │ │ (Future) │ │  
│ └──────────────┘ └──────────────┘ └──────────────┘ │  
└─────────────────────────────────────────────────────────────────────┘  
 ↕  
┌─────────────────────────────────────────────────────────────────────┐  
│ API & REALTIME GATEWAY LAYER (Supabase) │  
│ ┌───────────────────────┐ ┌──────────────────────────────┐ │  
│ │ Edge Functions │ │ Realtime Channels │ │  
│ │ \- execute-order │ │ \- positions:{user_id} │ │  
│ │ \- close-position │ │ \- orders:{user_id} │ │  
│ │ \- market-data │ │ \- notifications:{user_id} │ │  
│ │ \- update-positions │ │ \- leaderboard │ │  
│ └───────────────────────┘ └──────────────────────────────┘ │  
│ ┌───────────────────────────────────────────────────────────────┐ │  
│ │ REST & GraphQL API Endpoints │ │  
│ │ POST /orders, GET /positions, PUT /profiles, etc. │ │  
│ └───────────────────────────────────────────────────────────────┘ │  
│ ┌───────────────────────────────────────────────────────────────┐ │  
│ │ Authentication (Supabase Auth \+ Social OAuth) │ │  
│ │ Google, Apple, Microsoft login; JWT tokens │ │  
│ └───────────────────────────────────────────────────────────────┘ │  
└─────────────────────────────────────────────────────────────────────┘  
 ↕  
┌─────────────────────────────────────────────────────────────────────┐  
│ DATABASE & BUSINESS LOGIC LAYER (Supabase) │  
│ ┌──────────────────────┐ ┌──────────────────────────────┐ │  
│ │ PostgreSQL DB │ │ RLS Policies │ │  
│ │ \- 18+ core tables │ │ \- User-scoped access │ │  
│ │ \- Indexes optimized │ │ \- Admin role verification │ │  
│ │ \- Triggers/Views │ │ \- Public market data access │ │  
│ └──────────────────────┘ └──────────────────────────────┘ │  
│ ┌──────────────────────┐ ┌──────────────────────────────┐ │  
│ │ Stored Procedures │ │ pg_cron Schedulers │ │  
│ │ \- execute_order\_ │ │ \- Margin call check (30s) │ │  
│ │ atomic │ │ \- Nightly swaps (00:00) │ │  
│ │ \- update_balance │ │ \- Price alert check (1m) │ │  
│ │ \- margin_call_logic │ │ \- Session cleanup (1h) │ │  
│ └──────────────────────┘ └──────────────────────────────┘ │  
│ ┌──────────────────────────────────────────────────────────────┐ │  
│ │ Storage (Supabase Storage) │ │  
│ │ \- KYC documents: /kyc-documents/{user_id}/\* │ │  
│ │ \- Backtest results: /backtest-results/{user_id}/\* │ │  
│ │ \- Signed URLs (15 min expiry) for secure access │ │  
│ └──────────────────────────────────────────────────────────────┘ │  
└─────────────────────────────────────────────────────────────────────┘  
 ↕  
┌─────────────────────────────────────────────────────────────────────┐  
│ EXTERNAL INTEGRATIONS LAYER │  
│ ┌────────────┐ ┌────────────┐ ┌─────────────┐ ┌────────────┐ │  
│ │ Finnhub │ │ YFinance │ │TradingView │ │NowPayments │ │  
│ │ (Market │ │ (OHLC │ │(Charts) │ │(Crypto Pay)│ │  
│ │ Data) │ │ Fallback) │ │ │ │ │ │  
│ └────────────┘ └────────────┘ └─────────────┘ └────────────┘ │  
│ ┌────────────┐ ┌─────────────────────────────────────────────┐ │  
│ │ Sentry │ │ OAuth Providers │ │  
│ │ (Errors) │ │ Google, Apple, Microsoft (Social Auth) │ │  
│ └────────────┘ └─────────────────────────────────────────────┘ │  
└─────────────────────────────────────────────────────────────────────┘

### **4.0.2 Technology Stack**

| Layer           | Technology                              | Justification                                       |
| --------------- | --------------------------------------- | --------------------------------------------------- |
| **Frontend**    | React 18 \+ TypeScript \+ Vite          | Type-safe, fast builds, component reusability       |
| **UI Library**  | ShadCN UI \+ TailwindCSS                | Accessible, consistent, theming support             |
| **Charts**      | TradingView Lightweight                 | Professional-grade, low-latency, white-labeled      |
| **State Mgmt**  | Zustand                                 | Lightweight, performant, no boilerplate             |
| **Forms**       | React Hook Form \+ Zod                  | Schema validation, minimal re-renders               |
| **Backend**     | Supabase (PostgreSQL \+ Edge Functions) | Serverless, built-in auth, Realtime, RLS            |
| **Database**    | PostgreSQL 14+                          | ACID compliance, rich indexing, JSON support        |
| **Auth**        | Supabase Auth \+ OAuth                  | Social login, secure JWT, session management        |
| **Realtime**    | Supabase Realtime (WebSocket)           | Sub-second updates, scalable broadcasts             |
| **Storage**     | Supabase Storage                        | Secure document storage, signed URLs, RLS           |
| **Market Data** | Finnhub / YFinance APIs                 | 100+ assets, real-time quotes, historical data      |
| **Payments**    | NowPayments.io                          | Crypto payments, auto-conversion, webhooks          |
| **Monitoring**  | Sentry \+ Supabase Logs                 | Error tracking, performance metrics, audit trails   |
| **Deployment**  | Vercel (Frontend) \+ Supabase Hosting   | Global CDN, auto-scaling, serverless Edge Functions |

---

## **4.1 DATABASE SCHEMA**

_(Comprehensive schema extracted from Doc 1, Section 1\. Full schema provided in Appendix A. Summary below.)_

### **4.1.1 Core Tables (18+)**

| Table                  | Purpose                       | Key Columns                                                                                  | Relationships                        |
| ---------------------- | ----------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------ |
| **profiles**           | User accounts & financials    | id, email, balance, equity, margin_used, kyc_status, account_status                          | 1:M with orders, positions, fills    |
| **orders**             | Order records                 | id, user_id, symbol, order_type, side, quantity, status, fill_price, commission              | 1:M with fills; 1:1 with positions   |
| **positions**          | Open/closed trading positions | id, user_id, symbol, side, quantity, entry_price, current_price, unrealized_pnl, margin_used | 1:M with order_lots; 1:1 with orders |
| **fills**              | Execution details             | id, order_id, user_id, symbol, quantity, price, commission, executed_at                      | M:1 with orders                      |
| **order_lots**         | FIFO lot tracking             | id, position_id, order_id, quantity, remaining_qty, entry_price, close_price, status         | M:1 with positions                   |
| **ledger**             | Transaction history           | id, user_id, transaction_type, amount, balance_before, balance_after                         | M:1 with profiles                    |
| **kyc_documents**      | Document tracking             | id, user_id, document_type, file_path, status, reviewed_at, rejection_reason                 | M:1 with profiles                    |
| **swap_rates**         | Overnight financing           | symbol, asset_class, long_rate, short_rate                                                   | N/A (lookup table)                   |
| **market_status**      | Trading hours                 | symbol, asset_class, is_open, trading_hours (JSON)                                           | N/A (lookup table)                   |
| **ohlc_cache**         | Historical prices             | symbol, timeframe, timestamp, open, high, low, close, volume                                 | N/A (cache)                          |
| **copy_relationships** | Copy trading links            | id, follower_id, leader_id, copy_ratio, max_exposure, status                                 | M:1 with profiles (both sides)       |
| **backtest_results**   | Strategy backtests            | id, user_id, strategy_name, symbols, results (JSON), equity_curve                            | M:1 with profiles                    |
| **margin_calls**       | Liquidation events            | id, user_id, margin_level, action_taken, positions_closed                                    | M:1 with profiles                    |
| **audit_logs**         | Action trails                 | id, actor_id, action, object_type, object_id, changes (JSON)                                 | M:1 with profiles                    |
| **notifications**      | User alerts                   | id, user_id, type, message, read, priority                                                   | M:1 with profiles                    |
| **sessions**           | User sessions                 | id, user_id, ip_address, is_active, expires_at                                               | M:1 with profiles                    |
| **corporate_actions**  | Stock splits, dividends       | id, symbol, action_type, split_ratio, dividend_amount, effective_date                        | N/A                                  |
| **price_alerts**       | Price notifications           | id, user_id, symbol, condition, target_price, status                                         | M:1 with profiles                    |

### **4.1.2 Key Relationships & Constraints**

- **Referential Integrity:** All foreign keys enforce ON DELETE CASCADE for user-owned data
- **Check Constraints:** Balance \>= 0; Leverage \> 0 and \<= 500; Quantity \> 0
- **Unique Constraints:** profiles.email (unique globally); orders.idempotency_key (unique per user); copy_relationships (follower_id, leader_id unique when status \= 'active')
- **Indexes:** Composite indexes on (user_id, status), (symbol, timeframe, timestamp), (user_id, created_at desc) for query performance

### **4.1.3 Row-Level Security (RLS) Policies**

**Policy Framework:**

- **User Data:** Users can only view/edit their own data (profiles, orders, positions, etc.)
- **Admin Data:** Admins can view all user data; RLS verified via auth.jwt() \-\>\> 'role' \= 'admin'
- **Public Data:** Market data (ohlc_cache, swap_rates, market_status, corporate_actions) readable by all
- **Copy Trading:** Followers can view leader profiles and stats; leaders can view follower counts

_Detailed RLS policies provided in Appendix B._

---

## **4.2 API LAYER & EDGE FUNCTIONS**

### **4.2.1 Edge Functions (Serverless Compute)**

TradePro uses **Supabase Edge Functions** to execute critical trading logic with sub-500ms latency. All functions are deployed at the network edge globally.

#### **Function 1: execute-order**

**Purpose:** Atomically execute a new trading order  
 **Trigger:** POST /functions/v1/execute-order  
 **Request Payload:**

{  
 "order": {  
 "symbol": "EURUSD",  
 "order_type": "market",  
 "side": "buy",  
 "quantity": 1.0,  
 "price": null,  
 "stop_loss": 1.0900,  
 "take_profit": 1.1200,  
 "idempotency_key": "user-123_1234567890_abc"  
 }  
}

**Validation Steps:**

1. User authentication (JWT verification)
2. KYC status check (must be 'approved')
3. Account status check (must be 'active')
4. Idempotency check (prevent duplicate orders)
5. Asset validation (symbol exists and is tradable)
6. Quantity validation (within min/max for asset)
7. Margin availability check (free_margin \>= required_margin)
8. Market hours verification
9. Current price fetch (from Finnhub/cache)

**Execution Logic:**

1. Calculate execution price (with slippage for market orders)
2. Calculate margin required
3. Calculate commission
4. Call stored procedure `execute_order_atomic()` to ensure ACID compliance:
   - Insert order record
   - Create fill record
   - Create or merge position (averaging entry price)
   - Create order lot for FIFO tracking
   - Deduct commission from balance
   - Create ledger entry
5. Return response with order_id, position_id, fill_price, commission

**Response:**

{  
 "data": {  
 "order_id": "order-uuid",  
 "position_id": "position-uuid",  
 "fill_price": 1.1005,  
 "slippage": 0.0005,  
 "commission": 11.00,  
 "status": "filled"  
 }  
}

**Error Responses:**

- 401: Unauthorized (invalid JWT)
- 403: KYC not approved; Account suspended
- 400: Invalid symbol; Insufficient margin; Duplicate order; Invalid quantity
- 503: Market data unavailable

---

#### **Function 2: close-position**

**Purpose:** Fully or partially close a trading position  
 **Trigger:** POST /functions/v1/close-position  
 **Request:**

{  
 "position_id": "position-uuid",  
 "quantity": 0.5  
}

**Logic:**

1. Fetch position and validate ownership
2. Get current price
3. Calculate P\&L using FIFO lot tracking
4. Close lots in order of FIFO
5. Update position status
6. Update user balance with net P\&L (minus commission)
7. Create ledger entries
8. Send notification

**Response:**

{  
 "data": {  
 "position_id": "position-uuid",  
 "status": "closed",  
 "closed_quantity": 0.5,  
 "remaining_quantity": 0.5,  
 "close_price": 1.1050,  
 "realized_pnl": 500.00,  
 "commission": 5.50,  
 "net_pnl": 494.50  
 }  
}

---

#### **Function 3: market-data**

**Purpose:** Fetch real-time price data for multiple assets  
 **Trigger:** POST /functions/v1/market-data  
 **Request:**

{  
 "symbols": \["EURUSD", "GBPUSD", "XAUUSD", "AAPL", "BTCUSD"\],  
 "timeframe": "1m"  
}

**Logic:**

1. For each symbol:
   - Call Finnhub API for real-time quote
   - On failure, fallback to YFinance or cached OHLC data
   - Cache new prices in ohlc_cache table
2. Return price data with bid/ask spread simulation

**Response:**

{  
 "data": {  
 "EURUSD": {  
 "symbol": "EURUSD",  
 "bid": 1.09999,  
 "ask": 1.10001,  
 "last": 1.10000,  
 "change": 0.0015,  
 "change_percent": 0.14,  
 "timestamp": "2025-01-15T10:30:45Z",  
 "source": "finnhub"  
 },  
 ...  
 }  
}

---

#### **Function 4: update-positions**

**Purpose:** Periodic position P\&L recalculation (triggered every 10 seconds via pg_cron)  
 **Trigger:** Scheduled (pg_cron job)  
 **Logic:**

1. Fetch all open positions
2. Get unique symbols
3. Fetch current prices for each symbol
4. For each position:
   - Calculate unrealized P\&L
   - Update position record
   - Check stop loss / take profit triggers
   - Check margin level for liquidation
5. Broadcast updates via Supabase Realtime

---

### **4.2.2 REST API Endpoints**

| Method     | Endpoint                 | Purpose                        | Authentication       |
| ---------- | ------------------------ | ------------------------------ | -------------------- |
| **POST**   | /auth/signup             | Register new user              | Public               |
| **POST**   | /auth/signin             | Sign in (email/password)       | Public               |
| **POST**   | /auth/social             | OAuth login                    | Public               |
| **POST**   | /auth/signout            | Sign out                       | Authenticated        |
| **GET**    | /profiles/{id}           | Get user profile               | Authenticated \+ RLS |
| **PUT**    | /profiles/{id}           | Update profile                 | Authenticated \+ RLS |
| **POST**   | /orders                  | Create order (Edge Function)   | Authenticated \+ RLS |
| **GET**    | /orders                  | List user orders               | Authenticated \+ RLS |
| **GET**    | /orders/{id}             | Get order details              | Authenticated \+ RLS |
| **DELETE** | /orders/{id}             | Cancel order                   | Authenticated \+ RLS |
| **GET**    | /positions               | List open positions            | Authenticated \+ RLS |
| **GET**    | /positions/{id}          | Get position details           | Authenticated \+ RLS |
| **POST**   | /positions/{id}/close    | Close position (Edge Function) | Authenticated \+ RLS |
| **GET**    | /portfolio               | Get portfolio snapshot         | Authenticated \+ RLS |
| **GET**    | /leaderboard             | Browse copy traders            | Authenticated        |
| **POST**   | /copy-relationships      | Follow trader                  | Authenticated \+ RLS |
| **DELETE** | /copy-relationships/{id} | Unfollow trader                | Authenticated \+ RLS |
| **POST**   | /kyc/upload              | Upload KYC documents           | Authenticated \+ RLS |
| **GET**    | /kyc/status              | Check KYC status               | Authenticated \+ RLS |
| **GET**    | /admin/leads             | List leads (admin only)        | Admin role           |
| **GET**    | /admin/leads/{id}        | View lead details              | Admin role           |
| **PUT**    | /admin/leads/{id}        | Assign balance, freeze account | Admin role           |
| **GET**    | /admin/kyc-review        | KYC review queue               | Admin role           |
| **PUT**    | /admin/kyc/{id}/approve  | Approve KYC                    | Admin role           |
| **PUT**    | /admin/kyc/{id}/reject   | Reject KYC                     | Admin role           |

---

## **4.3 AUTHENTICATION & SECURITY**

### **4.3.1 Authentication Flow**

**Email/Password Registration:**

1\. User enters email \+ password \+ basic profile  
2\. Client sends POST /auth/signup to Supabase Auth  
3\. Supabase creates auth.users record  
4\. Verification email sent to user  
5\. User clicks email link (confirms email)  
6\. Supabase Auth generates JWT \+ refresh token  
7\. Frontend stores JWT in secure HTTP-only cookie  
8\. Frontend creates profiles table entry with user_id  
9\. User redirected to KYC screen

**Social Authentication (Google/Apple/Microsoft):**

1\. User clicks "Sign in with Google"  
2\. Frontend initiates OAuth flow  
3\. Google authorization page opens  
4\. User grants permission  
5\. Google returns auth code to frontend  
6\. Frontend exchanges code for token via Supabase  
7\. Supabase creates auth.users record (if new)  
8\. JWT generated; user logged in  
9\. Frontend checks if profile exists; creates if not  
10\. User redirected to KYC (if needed) or dashboard

**Session Management:**

- JWT lifetime: 1 hour
- Refresh token lifetime: 7 days
- Sessions stored in secure HTTP-only cookies
- Logout invalidates refresh token server-side

---

### **4.3.2 Authorization & Row-Level Security (RLS)**

**RLS Policies (SQL-level enforcement):**

**Policy: Users view own data**

CREATE POLICY "users_view_own_profile" ON profiles  
 FOR SELECT USING (id \= auth.uid());

CREATE POLICY "users_view_own_orders" ON orders  
 FOR SELECT USING (user_id \= auth.uid());

\-- Similar policies for positions, fills, ledger, etc.

**Policy: Admins view all data**

CREATE POLICY "admins_view_all_profiles" ON profiles  
 FOR SELECT USING (auth.jwt() \-\>\> 'role' \= 'admin');

\-- Similar policies for all tables

**Policy: Copy trading—followers see leader stats**

CREATE POLICY "users_view_leader_profiles" ON profiles  
 FOR SELECT USING (  
 id IN (  
 SELECT leader_id FROM copy_relationships  
 WHERE follower_id \= auth.uid() AND status \= 'active'  
 )  
 );

**Policy: Public market data**

CREATE POLICY "public_read_market_data" ON ohlc_cache  
 FOR SELECT USING (true);

CREATE POLICY "public_read_swap_rates" ON swap_rates  
 FOR SELECT USING (true);

---

### **4.3.3 Data Protection**

| Aspect                    | Implementation                                                             |
| ------------------------- | -------------------------------------------------------------------------- |
| **Encryption at Rest**    | AWS KMS (Supabase default)                                                 |
| **Encryption in Transit** | TLS 1.3 for all API calls                                                  |
| **PII Masking**           | Stored encrypted; decrypted only for verification                          |
| **Password Hashing**      | bcrypt (Supabase Auth handles)                                             |
| **API Key Security**      | Service role key restricted to backend only; never exposed to frontend     |
| **CORS**                  | Restricted to https://tradepro.vercel.app in production                    |
| **Rate Limiting**         | 100 requests/minute per user; 1000/minute per IP                           |
| **Audit Logging**         | All sensitive actions logged to audit_logs table with actor, timestamp, IP |
| **Fraud Detection**       | Real-time anomaly detection for unusual trading patterns                   |

---

## **4.4 REAL-TIME INFRASTRUCTURE**

### **4.4.1 Supabase Realtime Channels**

TradePro uses **PostgreSQL LISTEN/NOTIFY** via Supabase Realtime for real-time updates to positions, orders, prices, and notifications.

**Channel 1: User Positions**

// Subscribe to position updates for user  
supabase.channel(\`positions:${userId}\`)  
  .on('postgres\_changes',   
    { event: '\*', schema: 'public', table: 'positions',   
      filter: \`user\_id=eq.${userId}\` },  
 payload \=\> {  
 // Update local state with new position data  
 updatePosition(payload.new);  
 })  
 .subscribe();

**Channel 2: User Orders**

supabase.channel(\`orders:${userId}\`)  
  .on('postgres\_changes',   
    { event: '\*', schema: 'public', table: 'orders',   
      filter: \`user\_id=eq.${userId}\` },  
 payload \=\> {  
 // Update order status, fill price, etc.  
 updateOrder(payload.new);  
 })  
 .subscribe();

\*\*

**Channel 3: User Notifications**

supabase.channel(\`notifications:${userId}\`)  
  .on('postgres\_changes',   
    { event: 'INSERT', schema: 'public', table: 'notifications',   
      filter: \`user\_id=eq.${userId}\` },  
 payload \=\> {  
 // Show toast notification; update notification center  
 displayNotification(payload.new);  
 incrementUnreadCount();  
 })  
 .subscribe();

**Channel 4: Leaderboard Updates (Public)**

supabase.channel('leaderboard')  
 .on('postgres_changes',  
 { event: 'UPDATE', schema: 'public', table: 'profiles' },  
 payload \=\> {  
 // Update leaderboard rankings  
 if (payload.new.total_followers \!== payload.old.total_followers) {  
 updateLeaderboardRanking(payload.new);  
 }  
 })  
 .subscribe();

**Channel 5: Price Updates (Broadcast)**

// Published by Edge Function every 1-5 seconds  
supabase.channel('prices')  
 .on('broadcast', { event: 'price_update' },  
 payload \=\> {  
 // Update price display; trigger stop loss/take profit checks  
 updatePriceData(payload.data);  
 checkOrderTriggers(payload.data);  
 })  
 .subscribe();

### **4.4.3 Realtime Performance Specifications**

| Metric                   | Target        | Rationale                                       |
| ------------------------ | ------------- | ----------------------------------------------- |
| **Message Latency**      | \<100ms (p95) | Sub-second price updates for responsive trading |
| **Message Throughput**   | 10K+ msgs/sec | Support 50K+ concurrent users                   |
| **Connection Stability** | 99.9% uptime  | Resilience for critical trading data            |
| **Reconnection Time**    | \<2 seconds   | Auto-reconnect on network disruption            |
| **Max Channels/User**    | 10            | Prevent resource exhaustion                     |

### **4.4.4 Fallback Mechanisms**

If Realtime connection drops:

1. Frontend detects disconnection (5-second timeout)
2. Attempts automatic reconnection every 2 seconds (exponential backoff max 30s)
3. During disconnection, Frontend polls REST API every 10 seconds
4. User receives warning banner: "Sync paused—reconnecting..."
5. Once reconnected, Realtime resumes; REST polling stops

---

## **5.0 FRONTEND ARCHITECTURE**

### **5.0.1 Tech Stack & Project Structure**

**Framework:** React 18 \+ TypeScript (strict mode)  
 **Build Tool:** Vite (sub-1s HMR)  
 **Deployment:** Vercel (global CDN)

**Project Structure:**

tradepro/  
├── public/  
│ ├── logos/  
│ │ ├── assets/ \# Colored logos for stocks, crypto, etc.  
│ │ └── favicon.ico  
│ └── fonts/  
├── src/  
│ ├── components/  
│ │ ├── layout/  
│ │ │ ├── Header.tsx  
│ │ │ ├── Sidebar.tsx  
│ │ │ ├── Footer.tsx  
│ │ │ └── AppLayout.tsx  
│ │ ├── auth/  
│ │ │ ├── LoginForm.tsx  
│ │ │ ├── SignupForm.tsx  
│ │ │ ├── SocialAuth.tsx  
│ │ │ └── ProtectedRoute.tsx  
│ │ ├── trading/  
│ │ │ ├── TradingChart.tsx (TradingView widgets)  
│ │ │ ├── OrderPanel.tsx  
│ │ │ ├── MarketWatch.tsx  
│ │ │ ├── PositionsTable.tsx  
│ │ │ └── OrdersTable.tsx  
│ │ ├── portfolio/  
│ │ │ ├── PortfolioSummary.tsx  
│ │ │ ├── EquityChart.tsx  
│ │ │ ├── PerformanceMetrics.tsx  
│ │ │ └── AssetAllocation.tsx  
│ │ ├── kyc/  
│ │ │ ├── KYCWizard.tsx  
│ │ │ ├── PersonalInfoStep.tsx  
│ │ │ ├── DocumentUploadStep.tsx  
│ │ │ ├── SelfieStep.tsx  
│ │ │ └── RiskQuizStep.tsx  
│ │ ├── admin/  
│ │ │ ├── LeadDashboard.tsx  
│ │ │ ├── LeadProfileView.tsx  
│ │ │ ├── KYCReviewPanel.tsx  
│ │ │ └── SystemMetrics.tsx  
│ │ ├── ui/  
│ │ │ ├── Button.tsx (ShadCN)  
│ │ │ ├── Input.tsx (ShadCN)  
│ │ │ ├── Card.tsx (ShadCN)  
│ │ │ ├── Modal.tsx (ShadCN)  
│ │ │ ├── Toast.tsx (sonner)  
│ │ │ └── ... (other ShadCN components)  
│ │ └── CopyTrading/  
│ │ ├── LeaderboardTable.tsx  
│ │ ├── LeaderCard.tsx  
│ │ └── CopySettingsModal.tsx  
│ ├── pages/  
│ │ ├── public/  
│ │ │ ├── LandingPage.tsx  
│ │ │ └── FeaturesPage.tsx  
│ │ └── app/  
│ │ ├── DashboardPage.tsx  
│ │ ├── TradePage.tsx  
│ │ ├── PortfolioPage.tsx  
│ │ ├── AnalyticsPage.tsx  
│ │ ├── CopyTradingPage.tsx  
│ │ ├── AdminDashboard.tsx  
│ │ └── AdminKYCReview.tsx  
│ ├── stores/ (Zustand)  
│ │ ├── authStore.ts  
│ │ ├── tradingStore.ts  
│ │ ├── portfolioStore.ts  
│ │ ├── marketDataStore.ts  
│ │ └── notificationStore.ts  
│ ├── lib/  
│ │ ├── supabase.ts  
│ │ ├── trading/  
│ │ │ ├── calculations.ts  
│ │ │ └── formulas.ts  
│ │ ├── errors.ts  
│ │ ├── validation.ts  
│ │ └── api.ts  
│ ├── types/  
│ │ ├── database.ts  
│ │ └── api.ts  
│ ├── hooks/  
│ │ ├── useAuth.ts  
│ │ ├── useTrading.ts  
│ │ ├── useRealtime.ts  
│ │ └── useMarketData.ts  
│ ├── styles/  
│ │ ├── globals.css (TailwindCSS)  
│ │ └── theme.css (CSS variables)  
│ └── App.tsx  
├── tests/  
│ ├── unit/  
│ ├── integration/  
│ ├── e2e/  
│ └── load/  
├── vite.config.ts  
├── tsconfig.json  
└── tailwind.config.ts

### **5.0.2 State Management Architecture**

**Zustand Stores** (client-side state):

- **authStore:** User login state, profile, session
- **tradingStore:** Selected symbol, open positions, orders, execution state
- **portfolioStore:** Balance, equity, margin metrics
- **marketDataStore:** Real-time prices, subscriptions
- **notificationStore:** Alerts, unread count

**Realtime Subscriptions** (via Supabase):

- Position updates → tradingStore
- Order updates → tradingStore
- Price updates → marketDataStore
- Notifications → notificationStore

**No localStorage usage:** All state persisted in Zustand memory during session

---

## **5.1 DESIGN SYSTEM & UI/UX**

### **5.1.1 Design Tokens & Visual Identity**

**Color Palette:**

| Token           | Light Mode       | Dark Mode | Usage                          |
| --------------- | ---------------- | --------- | ------------------------------ |
| **Primary**     | \#0066FF (Blue)  | \#0066FF  | Actions, CTAs, highlights      |
| **Success**     | \#10B981 (Green) | \#10B981  | Profit, buy orders, gains      |
| **Danger**      | \#EF4444 (Red)   | \#EF4444  | Loss, sell orders, liquidation |
| **Warning**     | \#F59E0B (Amber) | \#F59E0B  | Margin calls, warnings         |
| **Neutral-50**  | \#F9FAFB         | \#030712  | Backgrounds                    |
| **Neutral-100** | \#F3F4F6         | \#0F1419  | Secondary bg                   |
| **Neutral-900** | \#111827         | \#FFFFFF  | Text primary                   |
| **Neutral-600** | \#4B5563         | \#BBBDC3  | Text secondary                 |

**Typography:**

| Element     | Font           | Size | Weight | Line Height |
| ----------- | -------------- | ---- | ------ | ----------- |
| **H1**      | Inter          | 32px | 700    | 1.2         |
| **H2**      | Inter          | 24px | 700    | 1.3         |
| **H3**      | Inter          | 20px | 600    | 1.4         |
| **Body**    | Inter          | 16px | 400    | 1.5         |
| **Caption** | Inter          | 12px | 500    | 1.4         |
| **Mono**    | JetBrains Mono | 13px | 400    | 1.6         |

**Spacing Scale:** 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

**Border Radius:** 4px (buttons), 8px (cards), 12px (modals)

**Shadows:**

- **sm:** 0 1px 2px rgba(0,0,0,0.05)
- **md:** 0 4px 6px rgba(0,0,0,0.1)
- **lg:** 0 10px 15px rgba(0,0,0,0.1)

---

### **5.1.2 Theme Implementation**

**Theme Toggle (Light/Dark):**

// src/components/ThemeToggle.tsx  
export const ThemeToggle \= () \=\> {  
 const \[theme, setTheme\] \= useState\<'light' | 'dark'\>('dark');

useEffect(() \=\> {  
 document.documentElement.classList.toggle('dark', theme \=== 'dark');  
 localStorage.setItem('theme-preference', theme); // Note: Only for non-critical preference  
 }, \[theme\]);

return (  
 \<button onClick={() \=\> setTheme(t \=\> t \=== 'light' ? 'dark' : 'light')}\>  
 {theme \=== 'light' ? '🌙' : '☀️'}  
 \</button\>  
 );  
};

**CSS Variables (TailwindCSS):**

/\* Light Mode \*/  
:root {  
 \--color-primary: 0 102 255;  
 \--color-success: 16 185 145;  
 \--color-danger: 239 68 68;  
 \--color-bg: 249 250 251;  
 \--color-text: 17 24 39;  
}

/\* Dark Mode \*/  
:root.dark {  
 \--color-primary: 0 102 255;  
 \--color-success: 16 185 145;  
 \--color-danger: 239 68 68;  
 \--color-bg: 3 7 18;  
 \--color-text: 255 255 255;  
}

---

### **5.1.3 Design Consistency Checklist**

- \[x\] All buttons have consistent hover/active states
- \[x\] Modal overlays use consistent backdrop (rgba(0,0,0,0.5))
- \[x\] Form inputs have consistent padding (12px horizontal, 10px vertical)
- \[x\] Success/error messages use consistent icons \+ colors
- \[x\] Loading states use consistent spinner (lucide-react)
- \[x\] Asset logos displayed for all tradable instruments
- \[x\] Price displays use consistent formatting (4-5 decimal places for forex)
- \[x\] Date/time formatted consistently (ISO 8601\)
- \[x\] Numeric values use consistent thousands separator
- \[x\] Responsive breakpoints consistent across all components (sm: 640px, md: 768px, lg: 1024px)

---

### **5.1.4 Asset Branding & Logos**

**Logo Display Requirements:**

1. **Forex Pairs:** Flag emojis or SVG flags for currencies
2. **Stocks:** Official company logos (downloaded from Finnhub or cached locally)
3. **Cryptocurrencies:** Official crypto logos (e.g., Bitcoin orange, Ethereum purple)
4. **Indices:** Index name badges (e.g., "US30" in blue)
5. **Commodities:** Commodity icons (gold=bar icon, oil=drop icon)
6. **ETFs:** ETF ticker badge

**Logo Caching:**

// src/lib/assetLogos.ts  
export const ASSET_LOGOS: Record\<string, string\> \= {  
 'EURUSD': '🇪🇺🇺🇸',  
 'GBPUSD': '🇬🇧🇺🇸',  
 'AAPL': '/logos/aapl.svg',  
 'TSLA': '/logos/tsla.svg',  
 'BTCUSD': '/logos/btc.svg',  
 'ETHUSD': '/logos/eth.svg',  
 'XAUUSD': '🟨', // Gold bar  
 'US30': '📊',  
};

---

## **5.2 COMPONENT SPECIFICATIONS**

### **5.2.1 Core Components (High-Level)**

**Component: TradingChart**

interface TradingChartProps {  
 symbol: string;  
 timeframe: '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';  
 height?: number;  
}

// Implementation:  
// \- Uses TradingView Lightweight Charts library  
// \- Fetches OHLC data from backend  
// \- Real-time price updates via Supabase Realtime  
// \- Chart renders candlestick \+ volume  
// \- Toolbar: zoom, reset, timeframe selector  
// \- Mouse hover: tooltip with OHLC values

**Component: OrderPanel**

interface OrderPanelProps {  
 selectedSymbol: string;  
 onOrderPlaced: () \=\> void;  
}

// State:  
// \- orderType: 'market' | 'limit' | 'stop' | 'stop_limit' | 'trailing_stop'  
// \- side: 'buy' | 'sell'  
// \- quantity: number  
// \- price: number (for limit/stop orders)  
// \- stopLoss: number (optional)  
// \- takeProfit: number (optional)

// Behavior:  
// \- Form validation via React Hook Form \+ Zod  
// \- Real-time margin check (updates as user types quantity)  
// \- Error messages for validation failures  
// \- Loading state during submission  
// \- Success toast on order fill  
// \- Calls execute-order Edge Function

**Component: PositionsTable**

interface PositionsTableProps {  
 positions: Position\[\];  
 onClose: (positionId: string) \=\> void;  
}

// Columns:  
// \- Symbol (with logo)  
// \- Side (Buy/Sell badge)  
// \- Quantity  
// \- Entry Price  
// \- Current Price  
// \- P\&L (green if profit, red if loss)  
// \- P\&L % (formatted as ±X.XX%)  
// \- Margin Used  
// \- Stop Loss  
// \- Take Profit  
// \- Actions (close, edit SL/TP)

// Features:  
// \- Real-time price updates  
// \- Click to edit stop loss/take profit  
// \- Sortable columns  
// \- Responsive (horizontal scroll on mobile)

**Component: KYCWizard**

// Multi-step form:  
// Step 1: Personal Information (name, DOB, country, address, phone)  
// Step 2: Document Upload (ID front/back, proof of address)  
// Step 3: Selfie Verification (webcam capture)  
// Step 4: Risk Assessment (quiz)

// Features:  
// \- Progress bar  
// \- Previous/Next buttons  
// \- Validation on each step  
// \- Loading states during upload  
// \- Error handling \+ retry  
// \- Completion notification

**Component: AdminLeadDashboard**

// New Requirements (Updated Req. 2, 3, 4):  
// \- List of all leads (pending, active, suspended)  
// \- Click lead → view full profile \+ account metrics  
// \- Assign $X balance to lead  
// \- Assign trading bonus ($Y)  
// \- Freeze/unfreeze account  
// \- Real-time lead metrics:  
// \* KYC status  
// \* Account status  
// \* Balance  
// \* Equity  
// \* Active positions  
// \* Recent trades  
// \- Action: Assign funds (opens modal with input fields)

**Component: AdminKYCReviewPanel**

// Features:  
// \- List of pending KYC applications  
// \- Click application → view all documents  
// \- Document viewer (image preview or PDF viewer)  
// \- Approval/rejection buttons  
// \- Comment box for notes  
// \- Batch operations (approve multiple)  
// \- Filter by status (pending, approved, rejected)  
// \- Real-time updates when new docs uploaded

---

## **6.0 TRADING ENGINE SPECIFICATIONS**

### **6.0.1 Order Execution Model**

**Order Lifecycle:**

1. **ORDER CREATION** (via POST /orders)
   - Validation (symbol, quantity, price, margin)
   - Idempotency check
   - Atomically execute via Edge Function

2. **EXECUTION** (execute-order Edge Function)
   - Fetch current price
   - Calculate slippage
   - Call execute_order_atomic() stored procedure
   - Atomic transaction ensures:
     - Order inserted
     - Fill created
     - Position created/merged
     - Order lot created (FIFO)
     - Commission deducted
     - Ledger entry created

3. **POST-EXECUTION**
   - Order status → 'filled'
   - Position status → 'open'
   - Real-time update broadcasted to user
   - Notification sent
   - Copy trading trigger (if user is leader)

4. **POSITION MANAGEMENT**
   - Real-time P\&L recalculation every 1-5s
   - Stop loss/take profit monitoring
   - Margin level monitoring
   - Liquidation trigger on margin call

5. **POSITION CLOSURE** (via POST /positions/{id}/close)
   - Manual close, SL trigger, TP trigger, or liquidation
   - FIFO lot closure
   - Realized P\&L calculation
   - Balance update
   - Ledger entry created
   - Position status → 'closed'

---

### **6.0.2 Order Types & Execution Rules**

| Order Type        | Entry Condition      | Execution                             | Trigger                     | Use Case                |
| ----------------- | -------------------- | ------------------------------------- | --------------------------- | ----------------------- |
| **MARKET**        | Immediately          | Current price \+ slippage             | None                        | Immediate entry/exit    |
| **LIMIT**         | Price reaches level  | User-set price                        | Price crosses limit         | Precise entry at target |
| **STOP**          | Price breaches level | Market order triggered                | Price crosses stop          | Loss prevention         |
| **STOP_LIMIT**    | Both conditions      | Limit order triggered at market price | Stop price \+ limit price   | Precise stop loss       |
| **TRAILING_STOP** | Price retraces       | Market order triggered                | Trailing distance from peak | Dynamic stop loss       |

**Execution Flow (Market Order Example):**

User places market order (Buy 1 EURUSD @ market)  
 ↓  
Edge Function validates (margin, symbol, quantity)  
 ↓  
Fetches current price (1.1000)  
 ↓  
Calculates slippage (0.00005)  
 ↓  
Execution price \= 1.1000 \+ 0.00005 \= 1.10005  
 ↓  
Calculates margin required \= (1.0 \* 1.10005 \* 100000\) / 30 \= 3666.83  
 ↓  
Checks: free_margin (10000) \>= required_margin (3666.83) ✓  
 ↓  
Calls execute_order_atomic()  
 ↓  
Stored procedure executes atomically:  
 \- INSERT order (status='filled', fill_price=1.10005)  
 \- INSERT fill (price=1.10005, commission=11.00)  
 \- INSERT position (entry_price=1.10005, current_price=1.10005, margin_used=3666.83)  
 \- INSERT order_lot (FIFO tracking)  
 \- UPDATE profile (balance \-= 11.00 commission)  
 \- INSERT ledger (transaction_type='commission')  
 ↓  
Transaction commits successfully  
 ↓  
Response returned to client with order_id, position_id  
 ↓  
Realtime broadcast: positions:{user_id} channel notified  
 ↓  
Frontend updates UI in real time (position appears in table)

---

### **6.0.3 Margin & Risk Management**

**Margin Calculation Formula:**

Margin Required \= (Quantity × Entry Price × Contract Size) / Leverage  
Example: (1 × 1.1000 × 100000\) / 30 \= 3,666.67

**Margin Level Calculation:**

Margin Level \= (Equity / Margin Used) × 100  
Example: (10500 / 3500\) × 100 \= 300%

**Liquidation Triggers:**

| Margin Level | Status     | Action                            |
| ------------ | ---------- | --------------------------------- |
| \> 100%      | Healthy    | Trading enabled                   |
| 100% \- 50%  | Warning    | Margin call warning sent          |
| \< 50%       | Critical   | Auto-liquidation begins (FIFO)    |
| \= 0%        | Liquidated | Account reset to starting balance |

**Margin Call Workflow (Updated Req. 6):**

1\. System detects margin_level \< 100% (pg_cron check every 30s)  
2\. Database triggers check_margin_call() function  
3\. If margin_level \>= 50:  
 \- Create margin_calls record (action='warning_sent')  
 \- Send notification: "Margin level at X%. Please add funds or close positions."  
4\. If margin_level \< 50:  
 \- Begin auto-liquidation (FIFO order):  
 \- Close oldest position first  
 \- Recalculate margin level  
 \- Repeat until margin_level \>= 50 or all positions closed  
 \- Create margin_calls record (action='positions_closed')  
 \- Send notification: "Positions liquidated due to insufficient margin"  
 \- Create ledger entries for each closed position

---

### **6.0.4 Real-Time P\&L Tracking (Updated Req. 6\)**

**P\&L Calculation:**

Unrealized P\&L \= (Current Price \- Entry Price) × Quantity × Contract Size × Direction  
 where Direction \= 1 (long) or \-1 (short)

Example (Long Position):  
 Entry: 1.1000, Current: 1.1050, Quantity: 1.0  
 P\&L \= (1.1050 \- 1.1000) × 1.0 × 100000 × 1 \= \+500.00

Example (Short Position):  
 Entry: 1.1000, Current: 1.0950, Quantity: 1.0  
 P\&L \= (1.0950 \- 1.1000) × 1.0 × 100000 × \-1 \= \+500.00

**Real-Time Updates:**

1. **Price Update Every 1-5 Seconds**
   - Finnhub API or cached data
   - Broadcast via Supabase Realtime channel 'prices'
   - Frontend receives update

2. **Position P\&L Recalculation**
   - Current price triggers update_positions() function
   - Calculates unrealized P\&L for all open positions
   - Updates positions table
   - Broadcasts via Realtime

3. **Portfolio Metrics Recalculation**
   - Equity \= Balance \+ Total Unrealized P\&L
   - Free Margin \= Equity \- Margin Used
   - Margin Level \= (Equity / Margin Used) × 100
   - Broadcasts via Realtime → Front end updates in real time

**Latency Targets:**

- Price update → Display: \<500ms (p95)
- P\&L recalculation: \<100ms
- Portfolio update: \<200ms

---

### **6.0.5 Stop Loss & Take Profit Logic**

**Automatic SL/TP Closure:**

\-- Trigger: check_stop_loss_take_profit()  
\-- Fires: When position.current_price changes

IF (position.side \= 'long') THEN  
 IF (position.current_price \<= position.stop_loss) THEN  
 Close position with realized_pnl \= unrealized_pnl  
 Create ledger entry  
 Send notification: "Stop loss triggered at {price}"  
 END IF

IF (position.current_price \>= position.take_profit) THEN  
 Close position with realized_pnl \= unrealized_pnl  
 Create ledger entry  
 Send notification: "Take profit triggered at {price}"  
 END IF  
END IF

IF (position.side \= 'short') THEN  
 IF (position.current_price \>= position.stop_loss) THEN  
 Close position (same logic)  
 END IF

IF (position.current_price \<= position.take_profit) THEN  
 Close position (same logic)  
 END IF  
END IF

**Partial SL/TP:**

- Not supported in Phase 1
- Can be manually closed at any level

---

## **7.0 USER WORKFLOWS & USER STORIES**

### **7.0.1 Multi-Step Registration & Lead Management (Updated Req. 1-4)**

**User Story 1: New User Registration**

**As a** retail trader  
 **I want to** register for TradePro  
 **So that** I can start paper trading

**Acceptance Criteria:**

1. User navigates to tradepro.com
2. Clicks "Sign Up"
3. Multi-step registration form appears:
   - **Step 1:** Email or social login (Google/Apple/Microsoft)
   - **Step 2:** Basic profile (name, country, timezone)
   - **Step 3:** Risk assessment quiz
4. Account created with $0 balance
5. Email verification sent
6. Lead entry created in Admin Dashboard
7. User receives confirmation: "Check your email to verify"
8. User clicks email link; account activated

**Backend Actions:**

- `supabase.auth.signUp()` creates auth.users record
- `profiles` table entry created with user_id
- `leads` conceptual entry (via Lead ID generation)
- Email verification triggered
- Admin Dashboard shows new lead

---

**User Story 2: Admin Assigns Virtual Capital to Lead (Updated Req. 3, 4\)**

**As an** admin  
 **I want to** assign virtual capital to a lead  
 **So that** the trader can start trading

**Acceptance Criteria:**

1. Admin logs into Admin Dashboard
2. Sees list of leads with status (pending, active, suspended)
3. Clicks on a lead (e.g., "Sarah Chen")
4. Lead profile view opens showing:
   - Personal info
   - Account status
   - KYC status
   - Current balance
   - Recent activity
5. Admin clicks "Assign Funds" button
6. Modal opens with input fields:
   - Trading Balance: $10,000
   - Bonus Amount: $500
7. Admin clicks "Confirm"
8. System updates profiles table:
   - balance \= 10,000
   - bonus_balance \= 500
   - free_margin \= 10,500
9. User receives notification: "Your account has been funded\! Balance: $10,500"
10. User can now trade

**Backend Actions:**

- `UPDATE profiles SET balance = 10000, ...`
- Ledger entry created (transaction_type='deposit')
- Notification inserted
- Realtime update sent to user

---

### **7.0.2 KYC & Compliance Workflow (Updated Req. 8\)**

**User Story 3: User Completes KYC (Updated Req. 8\)**

**As a** trader  
 **I want to** complete KYC verification  
 **So that** I can trade on TradePro

**Acceptance Criteria:**

1. User receives notification: "Complete KYC to unlock trading"
2. Clicks "Complete KYC" link
3. Multi-step KYC wizard appears:
   - **Step 1:** Personal Information (name, DOB, country, address, phone)
   - **Step 2:** Document Upload (ID front, ID back, proof of address)
   - **Step 3:** Selfie Verification (webcam capture)
   - **Step 4:** Risk Assessment Quiz
4. User completes all steps
5. KYC status → 'pending_review'
6. User receives: "Thank you\! We're reviewing your application."
7. Admin receives notification of new KYC submission
8. \[Admin\] Reviews documents; clicks "Approve"
9. User receives: "KYC approved\! You can now trade."
10. KYC status → 'approved'
11. User can place trades

**Backend Actions:**

- Documents uploaded to Supabase Storage
- kyc_documents table entries created
- Status changes trigger notifications
- Audit log records all actions

---

**User Story 4: Admin Reviews & Approves KYC Documents (Updated Req. 8\)**

**As an** admin  
 **I want to** review user-uploaded KYC documents  
 **So that** I can verify identity and approve accounts

**Acceptance Criteria:**

1. Admin logs into Admin Dashboard
2. Clicks "KYC Review" tab
3. Sees list of pending KYC applications (sorted by submission date)
4. Clicks on application (e.g., "Sarah Chen")
5. Application details view opens:
   - User info
   - Uploaded documents with thumbnails:
     - ID Front (image preview)
     - ID Back (image preview)
     - Proof of Address (image preview)
     - Selfie (image preview)
   - Download buttons for each document
6. Admin reviews documents; identifies them as valid
7. Clicks "Approve" button
8. Modal asks for confirmation
9. Admin clicks "Confirm Approval"
10. kyc_documents.status → 'approved' for all documents
11. profiles.kyc_status → 'approved'
12. User receives notification
13. Admin can now see user profile and account metrics in lead view

**Backend Actions:**

- All KYC document access logged
- Approval action logged to audit_logs
- Notification sent to user
- KYC data available to admin for account management

---

### **7.0.3 Trading Execution Workflow (Updated Req. 5, 6\)**

**User Story 5: User Places & Executes Market Order (Updated Req. 5, 6\)**

**As a** trader  
 **I want to** place a market order  
 **So that** I can enter a position immediately

**Acceptance Criteria:**

1. User navigates to Trading page
2. Selects symbol (EURUSD)
3. Enters order details:
   - Side: Buy
   - Quantity: 1.0
   - Stop Loss: 1.0900
   - Take Profit: 1.1200
4. System displays:
   - Current price: 1.1000
   - Margin required: 3,666.67
   - Commission: 11.00
   - Estimated net entry price: 1.10005 (with slippage)
5. User clicks "Buy"
6. Order submitted to Edge Function
7. System validates:
   - Margin available (free_margin \= 10,000 \> 3,666.67) ✓
   - Market hours (Forex 24/5 is open) ✓
   - Symbol valid ✓
8. Order executed atomically
9. **Real-time updates (Updated Req. 6):**
   - Position appears in PositionsTable immediately
   - Balance updates: 10,000 \- 11.00 \= 9,989
   - Equity updates: 9,989 \+ 0 (unrealized P\&L) \= 9,989
   - Margin used: 3,666.67
   - Free margin: 9,989 \- 3,666.67 \= 6,322.33
   - Margin level: (9,989 / 3,666.67) × 100 \= 272%
10. Price updates every 1-5 seconds
11. P\&L recalculates in real time:
    - Current price: 1.1005 → P\&L \= \+50.00
    - Current price: 1.1010 → P\&L \= \+100.00
12. User monitors position via dashboard

---

## **8.0 DATA MODELS & SPECIFICATIONS**

_(Due to length constraints, summary below. Full schema in Appendix A)_

### **8.0.1 Core Data Models**

**Profile Model:**

- Stores user account info, KYC status, financial metrics
- Real-time updates to balance, equity, margin
- Linked to all trading tables via foreign key

**Order Model:**

- Immutable record of every order placed
- Tracks lifecycle: pending → open → filled → closed
- Contains idempotency key for deduplication

**Position Model:**

- Active trading positions (open, closed, liquidated)
- Real-time P\&L calculation
- Linked to order_lots for FIFO tracking

**Ledger Model:**

- Complete transaction history (deposits, commissions, P\&L, swaps)
- Double-entry bookkeeping principle
- Used for compliance audits

---

## **9.0 INTEGRATION SPECIFICATIONS**

### **9.0.1 Market Data Integration (Finnhub / YFinance)**

**API Flow:**

Edge Function (market-data)  
 ↓  
Calls Finnhub API (/quote endpoint) for each symbol  
 ↓  
Retrieves: last price, change, volume, timestamp  
 ↓  
On failure: Falls back to YFinance API  
 ↓  
On second failure: Uses cached OHLC data from ohlc_cache table  
 ↓  
Returns JSON with bid/ask spread simulation  
 ↓  
Frontend receives data; displays to user  
 ↓  
Data cached in ohlc_cache table for historical analysis

**Caching Strategy:**

- 1m OHLC data cached every minute
- Historical data retained for backtesting (6+ months)
- Realtime channel broadcasts price updates every 1-5 seconds

---

### **9.0.2 Crypto Payment Integration (NowPayments.io) (Updated Req. 10\)**

**Deposit Workflow:**

1. **User Initiates Deposit**
   - User navigates to Deposits page
   - Enters amount (e.g., $1,000)
   - Selects crypto (BTC, ETH, USDT)

**Frontend Calls NowPayments.io API**

POST https://api.nowpayments.io/v1/invoice  
{  
 "price_amount": 1000,  
 "price_currency": "usd",  
 "pay_currency": "btc",  
 "order_id": "user-123_1234567890",  
 "order_description": "TradePro deposit",  
 "notify_url": "https://tradepro.vercel.app/api/webhooks/crypto-deposit",  
 "ipn_callback_url": "https://api.supabase.../functions/v1/crypto-webhook"  
}

2.
3. **NowPayments Creates Invoice**
   - Returns payment address
   - Provides payment link / QR code
   - Frontend displays payment details

4. **User Sends Crypto**
   - Scans QR or copies address
   - Sends crypto from wallet
   - Blockchain confirms transaction

5. **NowPayments Confirms Payment**
   - Sends webhook to backend
   - Edge Function receives webhook
   - Validates payment

**Backend Processing**

Edge Function (crypto-webhook)  
 ↓  
Verifies webhook signature (NowPayments secret)  
 ↓  
Fetches order_id from webhook  
 ↓  
Updates deposits table:  
 \* status \= 'confirmed'  
 \* transaction_id \= NowPayments txn ID  
 \* amount \= converted USD value  
↓  
Updates profiles table:  
 \* balance \+= deposit_amount  
 \* free_margin \+= deposit_amount  
↓  
Creates ledger entry:  
 \* transaction_type \= 'deposit'  
 \* amount \= \+1000  
↓  
Broadcasts Realtime update  
↓  
Sends notification to user: "Deposit received\! \+$1,000"

6.
7. **Real-Time Sync**
   - User sees balance updated immediately
   - Equity, margin metrics refresh
   - Can now trade with deposited funds

---

### **9.0.3 Charting Integration (TradingView Lightweight) (Updated Req. 11\)**

**Implementation:**

// src/components/trading/TradingChart.tsx  
import { createChart } from 'lightweight-charts';

export const TradingChart \= ({ symbol, timeframe }) \=\> {  
 useEffect(() \=\> {  
 const chart \= createChart(containerRef.current, {  
 width: containerRef.current.clientWidth,  
 height: 500,  
 layout: {  
 background: { color: 'rgba(0,0,0,0)' },  
 textColor: '\#d1d5db',  
 },  
 });

    // Add candlestick series
    const candlestickSeries \= chart.addCandlestickSeries({
      upColor: '\#10b981',
      downColor: '\#ef4444',
    });

    // Fetch OHLC data
    const data \= await fetch(\`/api/ohlc?symbol=${symbol}\&timeframe=${timeframe}\`);
    const ohlc \= await data.json();

    candlestickSeries.setData(ohlc.map(c \=\> ({
      time: c.timestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    })));

    // Subscribe to real-time updates
    const channel \= supabase.channel('prices')
      .on('broadcast', { event: 'price\_update' }, (payload) \=\> {
        if (payload.data.symbol \=== symbol) {
          // Update latest candle
          candlestickSeries.update({
            time: Math.floor(Date.now() / 1000),
            close: payload.data.last,
            // ... other OHLC values
          });
        }
      })
      .subscribe();

    return () \=\> {
      channel.unsubscribe();
      chart.remove();
    };

}, \[symbol, timeframe\]);

return \<div ref={containerRef} /\>;  
};

---

### **9.0.4 Social Authentication (Google, Apple, Microsoft) (Updated Req. 13\)**

**OAuth Integration:**

**Google OAuth:**

// src/lib/auth.ts  
export const signInWithGoogle \= async () \=\> {  
 const { data, error } \= await supabase.auth.signInWithOAuth({  
 provider: 'google',  
 options: {  
 redirectTo: \`${process.env.VITE_APP_URL}/auth/callback\`,  
 },  
 });

if (error) throw error;  
 // User redirected to Google login page  
};

**Apple OAuth:**

export const signInWithApple \= async () \=\> {  
 const { data, error } \= await supabase.auth.signInWithOAuth({  
 provider: 'apple',  
 options: {  
 redirectTo: \`${process.env.VITE_APP_URL}/auth/callback\`,  
 },  
 });  
};

**Microsoft OAuth:**

export const signInWithMicrosoft \= async () \=\> {  
 const { data, error } \= await supabase.auth.signInWithOAuth({  
 provider: 'azure',  
 options: {  
 redirectTo: \`${process.env.VITE_APP_URL}/auth/callback\`,  
 },  
 });  
};

**Callback Handler:**

// src/pages/auth/callback.tsx  
export const AuthCallback \= () \=\> {  
 useEffect(() \=\> {  
 supabase.auth.onAuthStateChange((event, session) \=\> {  
 if (session) {  
 // Check if profile exists  
 const hasProfile \= await checkProfile(session.user.id);  
 if (\!hasProfile) {  
 // Create profile from OAuth data  
 createProfile({  
 id: session.user.id,  
 email: session.user.email,  
 full_name: session.user.user_metadata?.full_name,  
 });  
 }  
 navigate('/kyc'); // Next step  
 }  
 });  
 }, \[\]);  
};

---

## **10.0 ADMIN CONSOLE & INTERNAL TOOLS**

### **10.0.1 Lead Management Interface (Updated Req. 2-4)**

**Admin Dashboard Layout:**

┌─────────────────────────────────────────────────────────────────┐  
│ Admin Dashboard \[Theme Toggle\] \[Logout\] │  
├─────────────────────────────────────────────────────────────────┤  
│ Sidebar: │  
│ \[📊 Dashboard\] \[👥 Leads\] \[📄 KYC Review\] \[📈 System Metrics\] │  
│ │  
├──────────────────┬────────────────────────────────────────────────┤  
│ Lead List │ Selected Lead Profile │  
│ ────────────────│ ────────────────────────────────────────────── │  
│ \[New Leads\] │ Sarah Chen (sarah@example.com) │  
│ Filter: │ Status: \[Active\] \[Verified\] │  
│ \[All\] │ │  
│ \[Pending KYC\] │ Account Metrics: │  
│ \[Active\] │ • Balance: $10,000 │  
│ \[Suspended\] │ • Equity: $10,500 │  
│ │ • Margin Used: $3,666.67 │  
│ \[Sarah Chen\] │ • Free Margin: $6,833.33 │  
│ Joined: 2 hrs │ • Margin Level: 286% │  
│ Balance: $10K │ • Active Positions: 2 │  
│ KYC: ✓ │ • Recent Trades: 5 │  
│ │ │  
│ \[Marcus Johnson\] │ Actions: │  
│ Joined: 1 day │ \[📝 Edit Profile\] \[💰 Assign Funds\] │  
│ Balance: $0 │ \[❄️ Freeze Account\] \[🗑️ Delete Account\] │  
│ KYC: ⏳ │ \[📋 View Audit Log\] \[📞 Contact User\] │  
│ │ │  
│ \[Aisha Patel\] │ │  
│ Joined: 3 days │ Recent Activity: │  
│ Balance: $5K │ • 2025-01-15 10:30: Opened EURUSD position │  
│ KYC: ✓ │ • 2025-01-15 10:15: Copied trade from leader │  
│ │ • 2025-01-15 09:45: Completed KYC approval │  
│ │ │  
└──────────────────┴────────────────────────────────────────────────┘

**Lead Profile Actions:**

**Assign Funds Modal**

┌─────────────────────────────────────┐  
│ Assign Funds to Sarah Chen │  
├─────────────────────────────────────┤  
│ Trading Balance: │  
│ \[\_\_\_\_\_\_\_\_10000\_\_\_\_\_\_\_\_\] USD │  
│ │  
│ Bonus Amount: │  
│ \[\_\_\_\_\_\_\_\_\_500\_\_\_\_\_\_\_\_\_\] USD │  
│ │  
│ Note (optional): │  
│ \[\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\] │  
│ │  
│ \[Cancel\] \[Confirm\] │  
└─────────────────────────────────────┘

1.
2. **Confirmation Flow**
   - Admin clicks "Confirm"
   - System updates balance
   - Ledger entry created
   - User receives notification
   - Dashboard reflects new balance immediately

---

### **10.0.2 KYC Review Interface (Updated Req. 8\)**

**KYC Review Dashboard:**

┌─────────────────────────────────────────────────────────────────┐  
│ KYC Review Queue \[Filter: All\] \[Sort: Date\]│  
├─────────────────────────────────────────────────────────────────┤  
│ │  
│ Pending Applications (12) │  
│ ┌──────────┬──────────────┬────────┬──────────┬──────────────┐ │  
│ │ Date │ User │ Status │ Docs │ Actions │ │  
│ ├──────────┼──────────────┼────────┼──────────┼──────────────┤ │  
│ │ 2:30 PM │ Sarah Chen │ ⏳ │ 3/3 │ \[Review ▶\] │ │  
│ │ 1:45 PM │ Marcus J. │ ⏳ │ 2/3 │ \[Review ▶\] │ │  
│ │ 1:15 PM │ Aisha Patel │ ✓ │ 3/3 │ \[Approved\] │ │  
│ │ 12:30 PM │ John Doe │ ❌ │ 2/3 │ \[Rejected\] │ │  
│ │ ... │ ... │ ... │ ... │ ... │ │  
│ └──────────┴──────────────┴────────┴──────────┴──────────────┘ │  
│ │  
└─────────────────────────────────────────────────────────────────┘

**KYC Review Modal:**

┌──────────────────────────────────────────────────────────────┐  
│ KYC Review \- Sarah Chen \[Close X\]│  
├──────────────────────────────────────────────────────────────┤  
│ │  
│ Applicant Info: │  
│ Email: sarah@example.com | DOB: 1995-03-15 | Country: US │  
│ Phone: \+1-555-0123 │  
│ │  
│ Documents: │  
│ ┌──────────────────────────────────────────────────────┐ │  
│ │ 📄 ID Front \[Preview\] \[Download\] │ │  
│ │ ✓ Verified \- Clear photo of government ID │ │  
│ │ │ │  
│ │ 📄 ID Back \[Preview\] \[Download\] │ │  
│ │ ✓ Verified \- Barcode readable │ │  
│ │ │ │  
│ │ 📄 Proof of Address \[Preview\] \[Download\] │ │  
│ │ ✓ Verified \- Recent utility bill with address │ │  
│ │ │ │  
│ │ 📸 Selfie \[Preview\] \[Download\] │ │  
│ │ ✓ Verified \- Matches ID photo │ │  
│ └──────────────────────────────────────────────────────┘ │  
│ │  
│ Review Comments: │  
│ \[\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\] │  
│ \[Placeholder: Add internal notes about verification\] │  
│ │  
│ Decision: │  
│ ⚪ Pending ⚫ Approved ⚪ Rejected (requires reason) │  
│ │  
│ Rejection Reason (if applicable): │  
│ \[\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\] │  
│ │  
│ \[Save Draft\] \[Submit\] \[Reject\] │  
└──────────────────────────────────────────────────────────────┘

**KYC Review Actions:**

1. **Approve**
   - Mark all documents as approved
   - Set kyc_status \= 'approved'
   - Send user notification
   - Lead marked as verified in dashboard

2. **Reject**
   - Mark documents as rejected
   - Set kyc_status \= 'requires_resubmit'
   - Send rejection reason to user
   - User can resubmit documents

3. **Request More Info**
   - Send message to user
   - Documents remain pending
   - User notified to provide additional info

---

### **10.0.3 System Monitoring & Metrics**

**Metrics Dashboard:**

┌─────────────────────────────────────────────────────────────────┐  
│ System Metrics \[Refresh\] \[Export\] │  
├─────────────────────────────────────────────────────────────────┤  
│ │  
│ Platform Health │  
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │  
│ │ Uptime │ │ API Latency │ │ Realtime │ │  
│ │ 99.95% │ │ 120ms (p95) │ │ Connected │ │  
│ │ ✓ Healthy │ │ ✓ Good │ │ ✓ Healthy │ │  
│ └─────────────┘ └─────────────┘ └─────────────┘ │  
│ │  
│ User Engagement │  
│ • Active Users (24h): 1,245 │  
│ • New Signups (24h): 156 │  
│ • KYC Approved: 87% │  
│ • Average Session Duration: 28 minutes │  
│ │  
│

## **11.0 COMPLIANCE & REGULATORY REQUIREMENTS**

### **11.1 KYC/AML Framework (Updated Req. 8\)**

**KYC Verification Levels:**

| Level       | Document Requirements         | Verification             | Limits     |
| ----------- | ----------------------------- | ------------------------ | ---------- |
| **Level 1** | Email verification only       | Automatic                | $1K daily  |
| **Level 2** | Personal info \+ ID           | Admin review (24h)       | $10K daily |
| **Level 3** | Full KYC \+ Selfie \+ Address | Admin \+ AI verification | Unlimited  |

**Document Validation Checklist:**

- ID Type: Must be government-issued (passport, driver's license, national ID)
- ID Status: Not expired
- Photo Quality: Clear, well-lit, legible
- Selfie Match: Face matches ID photo (manual \+ AI verification)
- Address Proof: Bank statement, utility bill, government letter (dated within 3 months)

**Rejection Scenarios:**

1. Blurry/illegible documents → Request resubmission
2. Expired ID → Rejection with reason "ID expired"
3. Selfie mismatch → Manual review; escalate if uncertain
4. Suspicious activity detected → Freeze account pending investigation
5. Sanctions list match → Immediate rejection \+ reporting

**AML Screening:**

- Real-time check against OFAC sanctions list
- Country-based restrictions (Crimea, Syria, North Korea, etc.)
- PEP (Politically Exposed Person) screening (via third-party API in Phase 2\)
- Suspicious activity reporting (SAR) for pattern-based triggers

**AML Triggers:**

- Rapid deposit → withdrawal cycle (\>90% within 24h)
- Large deposit from unknown source
- Multiple account creation from same IP
- Trading pattern inconsistent with profile risk level

---

### **11.2 Data Security & Privacy (Updated Req. 8\)**

**Data Classification:**

| Classification   | Data Types                       | Protection                     | Retention      |
| ---------------- | -------------------------------- | ------------------------------ | -------------- |
| **Public**       | Market data, general FAQs        | None                           | Indefinite     |
| **Internal**     | System logs, performance metrics | Encryption, RLS                | 30 days        |
| **Confidential** | User profiles, trading activity  | AES-256, RLS, audit logging    | 7 years        |
| **Restricted**   | Passwords, API keys, PII         | Hashed/encrypted, never logged | Until deletion |

**Encryption Standards:**

- **Data at Rest:** AES-256 (Supabase default via AWS KMS)
- **Data in Transit:** TLS 1.3 (all connections)
- **Password Hashing:** bcrypt (Supabase Auth)
- **API Keys:** Never stored in frontend; server-only

**PII Handling:**

- Email masked in logs (e.g., "s\*\*\*@example.com")
- Phone numbers masked (e.g., "+1-**_\-_**\-1234")
- Full SSN/ID numbers encrypted; decrypted only for verification
- No PII in error messages or logs

**GDPR Compliance:**

- Consent forms for data processing displayed at signup
- Right to access: Users can export their data (JSON format)
- Right to erasure: Account deletion cascades to all related data
- Data processing agreement with Supabase (DPA in place)
- GDPR-compliant privacy policy published

**CCPA Compliance (US):**

- Privacy notice at signup
- Opt-out mechanism for data sales (not applicable; we don't sell data)
- Ability to delete personal information
- Non-discrimination for exercising CCPA rights

---

### **11.3 Risk Disclosure & Terms**

**Risk Warnings Displayed:**

1. **At Signup:** "CFD trading carries high risk. You may lose more than your initial deposit."
2. **Before First Trade:** "Leverage multiplies both gains and losses. A 10% market move results in 100% loss with 10x leverage."
3. **On Dashboard:** Real-time margin level indicator with color coding (green/yellow/red).
4. **Margin Call Warning:** "Your account is near liquidation. Margin level: 75%. Consider closing positions."

**Terms & Conditions Highlights:**

- No leverage protection; losses can exceed deposit
- Overnight swaps charged daily
- Slippage applies to all orders
- Copy trading is experimental; verify leader performance
- No guarantee of fills or prices
- Platform not liable for trading losses

**Age Gate:**

- Mandatory age verification (18+ only)
- Checkbox: "I am 18 years or older"
- Terms acceptance required

---

## **12.0 PERFORMANCE & SCALABILITY REQUIREMENTS**

### **12.1 Trading Engine Performance (Updated Req. 5, 6\)**

**Latency Targets:**

| Operation              | Target (p95) | Target (p99) | Critical? |
| ---------------------- | ------------ | ------------ | --------- |
| Order execution        | \<500ms      | \<1000ms     | Yes       |
| Position update        | \<100ms      | \<300ms      | Yes       |
| P\&L recalculation     | \<100ms      | \<300ms      | Yes       |
| Price update → Display | \<500ms      | \<1000ms     | Yes       |
| Margin call check      | \<2000ms     | \<5000ms     | No        |
| Realtime broadcast     | \<100ms      | \<300ms      | Yes       |

**Throughput Targets:**

- 10,000+ concurrent users
- 1,000 orders/second
- 10,000 position updates/second
- 100,000 price updates/second (broadcast)

**Database Optimization:**

- Composite indexes: (user_id, status), (symbol, timeframe, timestamp)
- Denormalized columns: equity, margin_level (cached on profiles)
- Materialized views: leaderboard_stats
- Partitioning: positions table by user_id (for large volumes)

---

### **12.2 Infrastructure Scaling**

**Frontend Scaling (Vercel):**

- Global CDN with edge caching
- Auto-scaling on traffic spikes
- Response time SLA: \<200ms p95

**Backend Scaling (Supabase):**

- PostgreSQL read replicas for reporting queries
- Connection pooling (PgBouncer): 100 connections
- Edge Functions auto-scale with request volume
- Realtime: Max 10,000 concurrent connections per function

**Database Scaling:**

- Database size monitoring; alerts at 80% quota
- Automatic backups (daily)
- Point-in-time recovery enabled
- Upgrade path: from Starter to Pro/Enterprise on Supabase

---

## **13.0 TESTING & QUALITY ASSURANCE**

### **13.1 Test Strategy**

**Unit Tests (Vitest):**

- Coverage: \>80% of calculations library
- Scope: Trading math (margin, P\&L, slippage), validation schemas
- Execution: Pre-commit (via Git hooks)

**Integration Tests:**

- Scope: API endpoints, database transactions, Edge Functions
- Coverage: Order execution flow, position closure, KYC workflow
- Execution: On PR creation

**E2E Tests (Playwright):**

- Scope: User workflows (signup → trading → analytics)
- Coverage: Happy path \+ error scenarios
- Execution: Pre-release (staging environment)

**Load Tests (k6):**

- Scenario: Ramp to 50K concurrent users
- Duration: 10 minutes
- Targets: API p95 \<500ms, error rate \<1%

**Security Tests:**

- OWASP Top 10 scanning (automated)
- RLS policy verification
- API rate limiting validation
- Penetration testing (external firm, quarterly)

---

## **14.0 DEPLOYMENT & OPERATIONS**

### **14.1 Deployment Pipeline**

**Environments:**

1. **Development:** Local Supabase instance
2. **Staging:** Staging Supabase project (full replica of production)
3. **Production:** Production Supabase project

**CI/CD Pipeline:**

Push to main branch  
 ↓  
GitHub Actions triggered  
 ↓  
Run unit tests (must pass)  
 ↓  
Build frontend (Vite)  
 ↓  
Run E2E tests on staging  
 ↓  
Deploy to Vercel (frontend)  
 ↓  
Deploy Edge Functions (Supabase)  
 ↓  
Update database (migrations)  
 ↓  
Run smoke tests  
 ↓  
Monitor for errors (Sentry)

**Deployment Checklist:**

- \[ \] All tests passing
- \[ \] Database migrations reviewed
- \[ \] Environment variables updated
- \[ \] API rate limits verified
- \[ \] Monitoring alerts enabled
- \[ \] Rollback plan documented

**Rollback Procedure:**

1. Identify issue via monitoring
2. Execute: `vercel rollback` (frontend)
3. Execute: `supabase db push --dryruns` (identify migration issue)
4. Revert database migration if needed
5. Redeploy Edge Functions
6. Monitor for stabilization

---

### **14.2 Monitoring & Alerting**

**Key Metrics:**

- Uptime (target: 99.9%)
- API response time (p95, p99)
- Error rate by endpoint
- Database query performance
- Realtime connection count
- Active user count

**Alerting Thresholds:**

| Alert                | Threshold         | Action                             |
| -------------------- | ----------------- | ---------------------------------- |
| API latency p95      | \>500ms           | Investigate; consider auto-scaling |
| Error rate           | \>1%              | Page on-call engineer              |
| Database CPU         | \>80%             | Scale up; investigate slow queries |
| Realtime connections | \>8,000           | Check for connection leaks         |
| Uptime               | \<99% (1h window) | Immediate incident response        |

**Incident Response:**

1. Alert triggered → Incident created
2. On-call engineer acknowledges (target: \<5 min)
3. Root cause analysis (target: \<15 min)
4. Mitigation deployed (target: \<30 min)
5. Post-incident review within 24 hours

---

## **15.0 ROADMAP & SUCCESS METRICS**

### **15.1 Phased Rollout**

**Phase 1 (Months 1-3): MVP Launch**

- Core trading engine
- User authentication \+ KYC
- Admin dashboard (lead/KYC management)
- Portfolio analytics
- Realtime price updates

**Success Metrics:**

- 10K registered users
- 2K KYC-approved traders
- 100K trades executed
- 99.5% uptime

**Phase 2 (Months 4-6): Social & Copy Trading**

- Verified trader network
- Copy trading with real-time replication
- Community forums
- Leaderboards \+ gamification

**Success Metrics:**

- 50K active traders
- 10K verified leaders
- 30% of users copy trading
- 3M total trades

**Phase 3 (Months 7-9): Advanced Features**

- Strategy backtester
- Native mobile apps (iOS/Android)
- API access for algo traders
- Advanced analytics (Sharpe ratio, drawdown curves)

**Success Metrics:**

- 200K monthly active users
- 50K backtests/month
- 5K+ API integrations
- 10M trades/month

**Phase 4 (Months 10-12): Institutional & Monetization**

- Institutional accounts
- White-label licensing
- Premium subscription tiers
- Advanced risk management tools

**Success Metrics:**

- $1M ARR
- 500K monthly active users
- 50+ institutional clients
- 100M cumulative trades

---

### **15.2 Business Metrics & KPIs**

**User Acquisition:**

- CAC (Customer Acquisition Cost): Target \<$5
- Viral coefficient: Target 1.2 (20% of users invite 1 friend on average)
- Organic growth: Target 30% of signups

**Engagement:**

- DAU/MAU ratio: Target \>40%
- Session duration: Target 30+ minutes
- Feature adoption: 80% of users complete first trade within 7 days
- Copy trading adoption: 30% of active traders

**Monetization:**

- Premium subscriptions: Target 10% conversion
- ARPU (Average Revenue Per User): Target $5/month
- LTV (Lifetime Value): Target \>$100
- Churn rate: Target \<5% monthly

**Quality:**

- User satisfaction: Target NPS \>50
- Support ticket resolution: 95% within 24h
- System uptime: 99.9% SLA
- Bug discovery rate: \<5 critical bugs post-launch

---

### **15.3 Success Criteria (Launch Readiness)**

**Technical:**

- \[ \] All core features implemented and tested
- \[ \] Database schema optimized and indexed
- \[ \] API latency meets targets (p95 \<500ms)
- \[ \] Realtime updates stable and reliable
- \[ \] Security audit completed
- \[ \] Disaster recovery plan tested

**Operational:**

- \[ \] Admin team trained on all workflows
- \[ \] Support playbooks documented
- \[ \] Monitoring and alerting configured
- \[ \] Incident response team identified
- \[ \] 24/7 on-call rotation established

**Compliance:**

- \[ \] Legal review of T\&C, Privacy Policy, Risk Disclosure
- \[ \] KYC/AML workflows approved
- \[ \] Data security certification (SOC 2 Type II ready)
- \[ \] Regulatory compliance verified for target markets

**Business:**

- \[ \] Go-to-market strategy finalized
- \[ \] Marketing campaigns scheduled
- \[ \] Beta user cohort identified (1,000 users)
- \[ \] Press release prepared

---

## **APPENDIX A: COMPLETE DATABASE SCHEMA**

_(Reference: Section 4.1 and Doc 1, Section 1\)_

The complete PostgreSQL schema is defined in:

- `supabase/migrations/001_core_tables.sql`
- `supabase/migrations/002_rls_policies.sql`
- `supabase/migrations/003_triggers.sql`

Key tables (18+):

1. `profiles` \- User accounts & financials
2. `orders` \- Order records
3. `positions` \- Trading positions
4. `fills` \- Order executions
5. `order_lots` \- FIFO tracking
6. `ledger` \- Transaction history
7. `kyc_documents` \- Document uploads
8. `swap_rates` \- Financing rates
9. `market_status` \- Trading hours
10. `ohlc_cache` \- Historical prices
11. `copy_relationships` \- Copy trading
12. `backtest_results` \- Strategy backtests
13. `margin_calls` \- Liquidation events
14. `audit_logs` \- Action trails
15. `notifications` \- User alerts
16. `sessions` \- User sessions
17. `corporate_actions` \- Stock splits/dividends
18. `price_alerts` \- Price notifications

---

## **APPENDIX B: RLS POLICIES**

_(Reference: Section 4.3.2 and Doc 1, Section 2\)_

All sensitive tables have RLS enabled with policies:

**User Data Access:**

CREATE POLICY "users_view_own_profile" ON profiles  
 FOR SELECT USING (id \= auth.uid());

**Admin Access:**

CREATE POLICY "admins_view_all_profiles" ON profiles  
 FOR SELECT USING (auth.jwt()-\>\>'role' \= 'admin');

**Public Data:**

CREATE POLICY "public_read_market_data" ON ohlc_cache  
 FOR SELECT USING (true);

---

## **APPENDIX C: EDGE FUNCTIONS DEPLOYMENT**

**Functions to deploy:**

1. `execute-order` \- Atomic order execution
2. `close-position` \- Position closure
3. `market-data` \- Price data fetching
4. `update-positions` \- Real-time P\&L updates

**Deployment command:**

supabase functions deploy execute-order  
supabase functions deploy close-position  
supabase functions deploy market-data  
supabase functions deploy update-positions

**Environment variables:**

- `FINNHUB_API_KEY`
- `SENTRY_DSN`

---

## **APPENDIX D: GLOSSARY**

- **CFD:** Contract for Difference (leveraged derivative)
- **Leverage:** Ability to control larger position with smaller capital
- **Margin:** Capital required to open leveraged position
- **Liquidation:** Forced closure when margin falls below threshold
- **Spread:** Difference between bid and ask price
- **Slippage:** Difference between expected and actual execution price
- **P\&L:** Profit and Loss
- **FIFO:** First In First Out (lot tracking method)
- **RLS:** Row Level Security (database-level access control)
- **KYC:** Know Your Customer (identity verification)
- **AML:** Anti-Money Laundering
- **OFAC:** Office of Foreign Assets Control (US sanctions list)
- **JWT:** JSON Web Token (authentication)
- **Realtime:** WebSocket-based instant data updates
- **Edge Functions:** Serverless compute functions

---

## **DOCUMENT SUMMARY**

**Total Document Length:** \~120 pages (when formatted with diagrams)

**Key Sections:** 15 major sections \+ appendices

**Audience:** Developers, Product Managers, Compliance, Stakeholders

**Status:** Production-Ready v1.0

**Last Updated:** January 2025

**Next Review:** Post-MVP launch (Month 3\)

---

**END OF DOCUMENT**

---
