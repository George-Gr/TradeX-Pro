import { Toaster as Sonner } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
const InternalError = lazy(() => import('./pages/error/InternalError'));
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/auth/Login'));
const Signup = lazy(() => import('./pages/auth/Signup'));
const Dashboard = lazy(() => import('./pages/protected/Dashboard'));
const Admin = lazy(() => import('./pages/admin/Admin'));
const TradingTerminal = lazy(() => import('./pages/protected/TradingTerminal'));
const Portfolio = lazy(() => import('./pages/protected/Portfolio'));
const OrderHistory = lazy(() => import('./pages/protected/OrderHistory'));
const AccessDenied = lazy(() => import('./pages/error/AccessDenied'));
const NotFound = lazy(() => import('./pages/error/NotFound'));

// Public Features
const WebTrading = lazy(() => import('./pages/public/features/WebTrading'));
const InvestmentSecurity = lazy(() => import('./pages/public/features/InvestmentSecurity'));
const MarketRiskAnalysis = lazy(() => import('./pages/public/features/MarketRiskAnalysis'));
const News = lazy(() => import('./pages/public/features/News'));
const CopyTrading = lazy(() => import('./pages/public/features/CopyTrading'));
// Public Assets
const Stocks = lazy(() => import('./pages/public/assets/Stocks'));
const Commodities = lazy(() => import('./pages/public/assets/Commodities'));
const Indices = lazy(() => import('./pages/public/assets/Indices'));
const Forex = lazy(() => import('./pages/public/assets/Forex'));
const Crypto = lazy(() => import('./pages/public/assets/Crypto'));
// Public Education
const Articles = lazy(() => import('./pages/public/education/Articles'));
const Webinars = lazy(() => import('./pages/public/education/Webinars'));
const Certifications = lazy(() => import('./pages/public/education/Certifications'));
const Mentorship = lazy(() => import('./pages/public/education/Mentorship'));
const Glossary = lazy(() => import('./pages/public/education/Glossary'));
// Public About
const OurCompany = lazy(() => import('./pages/public/about/OurCompany'));
const SecurityPrivacy = lazy(() => import('./pages/public/about/SecurityPrivacy'));
const LicenseRegulation = lazy(() => import('./pages/public/about/LicenseRegulation'));
const OurTeam = lazy(() => import('./pages/public/about/OurTeam'));
const ArticlesBlog = lazy(() => import('./pages/public/about/ArticlesBlog'));
const ContactUs = lazy(() => import('./pages/public/about/ContactUs'));
// Public Legal
const Terms = lazy(() => import('./pages/public/legal/Terms'));
const PrivacyPolicy = lazy(() => import('./pages/public/legal/PrivacyPolicy'));
const RiskDisclosure = lazy(() => import('./pages/public/legal/RiskDisclosure'));
const AMLPolicy = lazy(() => import('./pages/public/legal/AMLPolicy'));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route
              path="/"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Landing />
                </Suspense>
              }
            />
            <Route
              path="/login"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="/signup"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Signup />
                </Suspense>
              }
            />
            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                </Suspense>
              }
            />
            <Route
              path="/admin"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ProtectedRoute requiredRole="admin">
                    <Admin />
                  </ProtectedRoute>
                </Suspense>
              }
            />
            <Route
              path="/trading-terminal"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ProtectedRoute>
                    <TradingTerminal />
                  </ProtectedRoute>
                </Suspense>
              }
            />
            <Route
              path="/portfolio"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ProtectedRoute>
                    <Portfolio />
                  </ProtectedRoute>
                </Suspense>
              }
            />
            <Route
              path="/order-history"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                </Suspense>
              }
            />
            <Route
              path="/error/access-denied"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <AccessDenied />
                </Suspense>
              }
            />
            <Route
              path="/error/internal-error"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <InternalError />
                </Suspense>
              }
            />
            {/* Public Features Subpages */}
            <Route
              path="/public/features/web-trading"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <WebTrading />
                </Suspense>
              }
            />
            <Route
              path="/public/features/investment-security"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <InvestmentSecurity />
                </Suspense>
              }
            />
            <Route
              path="/public/features/market-risk-analysis"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <MarketRiskAnalysis />
                </Suspense>
              }
            />
            <Route
              path="/public/features/news"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <News />
                </Suspense>
              }
            />
            <Route
              path="/public/features/copy-trading"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <CopyTrading />
                </Suspense>
              }
            />
            {/* Public Assets Subpages */}
            <Route
              path="/public/assets/stocks"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Stocks />
                </Suspense>
              }
            />
            <Route
              path="/public/assets/commodities"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Commodities />
                </Suspense>
              }
            />
            <Route
              path="/public/assets/indices"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Indices />
                </Suspense>
              }
            />
            <Route
              path="/public/assets/forex"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Forex />
                </Suspense>
              }
            />
            <Route
              path="/public/assets/crypto"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Crypto />
                </Suspense>
              }
            />
            {/* Public Education Subpages */}
            <Route
              path="/public/education/articles"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Articles />
                </Suspense>
              }
            />
            <Route
              path="/public/education/webinars"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Webinars />
                </Suspense>
              }
            />
            <Route
              path="/public/education/certifications"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Certifications />
                </Suspense>
              }
            />
            <Route
              path="/public/education/mentorship"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Mentorship />
                </Suspense>
              }
            />
            <Route
              path="/public/education/glossary"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Glossary />
                </Suspense>
              }
            />
            {/* Public About Subpages */}
            <Route
              path="/public/about/our-company"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <OurCompany />
                </Suspense>
              }
            />
            <Route
              path="/public/about/security-privacy"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <SecurityPrivacy />
                </Suspense>
              }
            />
            <Route
              path="/public/about/license-regulation"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <LicenseRegulation />
                </Suspense>
              }
            />
            <Route
              path="/public/about/our-team"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <OurTeam />
                </Suspense>
              }
            />
            <Route
              path="/public/about/articles-blog"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ArticlesBlog />
                </Suspense>
              }
            />
            <Route
              path="/public/about/contact-us"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ContactUs />
                </Suspense>
              }
            />
            {/* Public Legal Subpages */}
            <Route
              path="/public/legal/terms"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <Terms />
                </Suspense>
              }
            />
            <Route
              path="/public/legal/privacy-policy"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <PrivacyPolicy />
                </Suspense>
              }
            />
            <Route
              path="/public/legal/risk-disclosure"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <RiskDisclosure />
                </Suspense>
              }
            />
            <Route
              path="/public/legal/aml-policy"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <AMLPolicy />
                </Suspense>
              }
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
