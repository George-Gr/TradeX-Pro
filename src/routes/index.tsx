import { ErrorBoundary } from '@/components/error/ErrorBoundary';
import Landing from '@/pages/Landing';
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Lazy loaded routes
const Features = lazy(() => import('@/pages/features'));
const Assets = lazy(() => import('@/pages/assets'));
const Education = lazy(() => import('@/pages/education'));
const About = lazy(() => import('@/pages/about'));
const Legal = lazy(() => import('@/pages/legal'));
const Auth = lazy(() => import('@/pages/auth'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/features',
    element: <Features />,
    children: [
      { path: 'web-trading', element: <Features.WebTrading /> },
      { path: 'copy-trading', element: <Features.CopyTrading /> },
      { path: 'analytics', element: <Features.Analytics /> },
      { path: 'security', element: <Features.Security /> },
    ],
  },
  {
    path: '/assets',
    element: <Assets />,
    children: [
      { path: 'stocks', element: <Assets.Stocks /> },
      { path: 'commodities', element: <Assets.Commodities /> },
      { path: 'indices', element: <Assets.Indices /> },
      { path: 'forex', element: <Assets.Forex /> },
      { path: 'crypto', element: <Assets.Crypto /> },
    ],
  },
  {
    path: '/education',
    element: <Education />,
    children: [
      { path: 'articles', element: <Education.Articles /> },
      { path: 'webinars', element: <Education.Webinars /> },
      { path: 'certifications', element: <Education.Certifications /> },
      { path: 'mentorship', element: <Education.Mentorship /> },
      { path: 'glossary', element: <Education.Glossary /> },
    ],
  },
  {
    path: '/about',
    element: <About />,
    children: [
      { path: 'company', element: <About.Company /> },
      { path: 'team', element: <About.Team /> },
      { path: 'careers', element: <About.Careers /> },
      { path: 'contact', element: <About.Contact /> },
      { path: 'press', element: <About.Press /> },
    ],
  },
  {
    path: '/legal',
    element: <Legal />,
    children: [
      { path: 'privacy', element: <Legal.Privacy /> },
      { path: 'terms', element: <Legal.Terms /> },
      { path: 'licenses', element: <Legal.Licenses /> },
      { path: 'cookies', element: <Legal.Cookies /> },
    ],
  },
  {
    path: '/auth',
    element: <Auth />,
    children: [
      { path: 'login', element: <Auth.Login /> },
      { path: 'signup', element: <Auth.Signup /> },
      { path: 'forgot-password', element: <Auth.ForgotPassword /> },
      { path: 'reset-password', element: <Auth.ResetPassword /> },
    ],
  },
]);
