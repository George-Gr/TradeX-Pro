import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link } from 'react-router-dom';

const navConfig = [
  {
    label: 'Features',
    items: [
      { label: 'Web Trading', path: '/public/features/web-trading' },
      { label: 'Investment Security', path: '/public/features/investment-security' },
      { label: 'Market Risk Analysis', path: '/public/features/market-risk-analysis' },
      { label: 'News', path: '/public/features/news' },
      { label: 'Copy Trading', path: '/public/features/copy-trading' },
    ],
  },
  {
    label: 'Assets',
    items: [
      { label: 'Stocks', path: '/public/assets/stocks' },
      { label: 'Commodities', path: '/public/assets/commodities' },
      { label: 'Indices', path: '/public/assets/indices' },
      { label: 'Forex', path: '/public/assets/forex' },
      { label: 'Crypto', path: '/public/assets/crypto' },
    ],
  },
  {
    label: 'Education',
    items: [
      { label: 'Articles', path: '/public/education/articles' },
      { label: 'Webinars', path: '/public/education/webinars' },
      { label: 'Certifications', path: '/public/education/certifications' },
      { label: 'Mentorship', path: '/public/education/mentorship' },
      { label: 'Glossary', path: '/public/education/glossary' },
    ],
  },
  {
    label: 'About',
    items: [
      { label: 'Our Company', path: '/public/about/our-company' },
      { label: 'Security & Privacy', path: '/public/about/security-privacy' },
      { label: 'License & Regulation', path: '/public/about/license-regulation' },
      { label: 'Our Team', path: '/public/about/our-team' },
      { label: 'Articles & Blog', path: '/public/about/articles-blog' },
      { label: 'Contact Us', path: '/public/about/contact-us' },
    ],
  },
  {
    label: 'Legal',
    items: [
      { label: 'Terms', path: '/public/legal/terms' },
      { label: 'Privacy Policy', path: '/public/legal/privacy-policy' },
      { label: 'Risk Disclosure', path: '/public/legal/risk-disclosure' },
      { label: 'AML Policy', path: '/public/legal/aml-policy' },
    ],
  },
];

const PublicHeader = () => (
  <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/90">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link to="/">
          <span className="text-2xl font-bold">TradePro</span>
        </Link>
      </div>
      <nav className="flex gap-6">
        {navConfig.map((nav) => (
          <Popover key={nav.label}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="font-semibold">
                {nav.label}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-2 min-w-[200px]">
              <ul>
                {nav.items.map((item) => (
                  <li key={item.label}>
                    <Link to={item.path} className="block px-2 py-1 rounded hover:bg-accent">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </PopoverContent>
          </Popover>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <Link to="/login">
          <Button variant="ghost">Login</Button>
        </Link>
        <Link to="/signup">
          <Button className="shadow-glow-primary">Get Started</Button>
        </Link>
      </div>
    </div>
  </header>
);

export default PublicHeader;
