import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import Dashboard from '@/pages/protected/Dashboard';
import TradingTerminal from '@/pages/protected/TradingTerminal';
import Portfolio from '@/pages/protected/Portfolio';
import OrderHistory from '@/pages/protected/OrderHistory';
import Wallet from '@/pages/protected/Wallet';
import AnalyticsDashboard from '@/pages/protected/AnalyticsDashboard';
import Admin from '@/pages/admin/Admin';
import NotFound from '@/pages/error/NotFound';
import AccessDenied from '@/pages/error/AccessDenied';
import InternalError from '@/pages/error/InternalError';
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Lazy loaded public pages
const Forex = lazy(() => import('@/pages/public/assets/Forex'));
const Stocks = lazy(() => import('@/pages/public/assets/Stocks'));
const Commodities = lazy(() => import('@/pages/public/assets/Commodities'));
const Indices = lazy(() => import('@/pages/public/assets/Indices'));
const Crypto = lazy(() => import('@/pages/public/assets/Crypto'));

const Articles = lazy(() => import('@/pages/public/education/Articles'));
const Webinars = lazy(() => import('@/pages/public/education/Webinars'));
const Certifications = lazy(() => import('@/pages/public/education/Certifications'));
const Mentorship = lazy(() => import('@/pages/public/education/Mentorship'));
const Glossary = lazy(() => import('@/pages/public/education/Glossary'));

const OurCompany = lazy(() => import('@/pages/public/about/OurCompany'));
const OurTeam = lazy(() => import('@/pages/public/about/OurTeam'));
const ContactUs = lazy(() => import('@/pages/public/about/ContactUs'));
const ArticlesBlog = lazy(() => import('@/pages/public/about/ArticlesBlog'));
const LicenseRegulation = lazy(() => import('@/pages/public/about/LicenseRegulation'));
const SecurityPrivacy = lazy(() => import('@/pages/public/about/SecurityPrivacy'));

const Terms = lazy(() => import('@/pages/public/legal/Terms'));
const PrivacyPolicy = lazy(() => import('@/pages/public/legal/PrivacyPolicy'));
const RiskDisclosure = lazy(() => import('@/pages/public/legal/RiskDisclosure'));
const AMLPolicy = lazy(() => import('@/pages/public/legal/AMLPolicy'));

const WebTrading = lazy(() => import('@/pages/public/features/WebTrading'));
const CopyTrading = lazy(() => import('@/pages/public/features/CopyTrading'));
const MarketRiskAnalysis = lazy(() => import('@/pages/public/features/MarketRiskAnalysis'));
const InvestmentSecurity = lazy(() => import('@/pages/public/features/InvestmentSecurity'));
const News = lazy(() => import('@/pages/public/features/News'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    errorElement: (
      <ErrorBoundary>
        <InternalError />
      </ErrorBoundary>
    ),
  },
  // Auth routes
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  // Protected routes
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/trading',
    element: (
      <ProtectedRoute>
        <TradingTerminal />
      </ProtectedRoute>
    ),
  },
  {
    path: '/portfolio',
    element: (
      <ProtectedRoute>
        <Portfolio />
      </ProtectedRoute>
    ),
  },
  {
    path: '/order-history',
    element: (
      <ProtectedRoute>
        <OrderHistory />
      </ProtectedRoute>
    ),
  },
  {
    path: '/wallet',
    element: (
      <ProtectedRoute>
        <Wallet />
      </ProtectedRoute>
    ),
  },
  {
    path: '/analytics',
    element: (
      <ProtectedRoute>
        <AnalyticsDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="admin">
        <Admin />
      </ProtectedRoute>
    ),
  },
  // Public feature pages
  {
    path: '/features/web-trading',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <WebTrading />
      </Suspense>
    ),
  },
  {
    path: '/features/copy-trading',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <CopyTrading />
      </Suspense>
    ),
  },
  {
    path: '/features/market-risk-analysis',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <MarketRiskAnalysis />
      </Suspense>
    ),
  },
  {
    path: '/features/investment-security',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <InvestmentSecurity />
      </Suspense>
    ),
  },
  {
    path: '/features/news',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <News />
      </Suspense>
    ),
  },
  // Public asset pages
  {
    path: '/assets/forex',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Forex />
      </Suspense>
    ),
  },
  {
    path: '/assets/stocks',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Stocks />
      </Suspense>
    ),
  },
  {
    path: '/assets/commodities',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Commodities />
      </Suspense>
    ),
  },
  {
    path: '/assets/indices',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Indices />
      </Suspense>
    ),
  },
  {
    path: '/assets/crypto',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Crypto />
      </Suspense>
    ),
  },
  // Public education pages
  {
    path: '/education/articles',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Articles />
      </Suspense>
    ),
  },
  {
    path: '/education/webinars',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Webinars />
      </Suspense>
    ),
  },
  {
    path: '/education/certifications',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Certifications />
      </Suspense>
    ),
  },
  {
    path: '/education/mentorship',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Mentorship />
      </Suspense>
    ),
  },
  {
    path: '/education/glossary',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Glossary />
      </Suspense>
    ),
  },
  // Public about pages
  {
    path: '/about/company',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <OurCompany />
      </Suspense>
    ),
  },
  {
    path: '/about/team',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <OurTeam />
      </Suspense>
    ),
  },
  {
    path: '/about/contact',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ContactUs />
      </Suspense>
    ),
  },
  {
    path: '/about/articles',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <ArticlesBlog />
      </Suspense>
    ),
  },
  {
    path: '/about/licenses',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <LicenseRegulation />
      </Suspense>
    ),
  },
  {
    path: '/about/security',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <SecurityPrivacy />
      </Suspense>
    ),
  },
  // Public legal pages
  {
    path: '/legal/terms',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Terms />
      </Suspense>
    ),
  },
  {
    path: '/legal/privacy',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <PrivacyPolicy />
      </Suspense>
    ),
  },
  {
    path: '/legal/risk',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <RiskDisclosure />
      </Suspense>
    ),
  },
  {
    path: '/legal/aml',
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <AMLPolicy />
      </Suspense>
    ),
  },
  // Error pages
  {
    path: '/403',
    element: <AccessDenied />,
  },
  {
    path: '/500',
    element: <InternalError />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
