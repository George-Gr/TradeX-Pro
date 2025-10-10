import PublicHeader from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  Copy,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
  Check,
  Play,
  Globe,
  Lock,
  Award,
  Activity,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Landing = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <>
      <Helmet>
        <title>TradePro - Master CFD Trading Without Risk | #1 Trading Simulator</title>
        <meta
          name="description"
          content="Experience professional-grade CFD trading simulation with virtual funds. Perfect your strategy, copy elite traders, and analyze real-time market data. Join 100K+ traders mastering the markets risk-free."
        />
        <meta name="keywords" content="trading simulator, CFD trading, copy trading, virtual trading, trading platform, market analysis, risk-free trading" />
        <link rel="canonical" href="https://tradepro.app" />
        <meta property="og:title" content="TradePro - Master CFD Trading Without Risk" />
        <meta property="og:description" content="Join 100K+ traders perfecting their strategies on our professional trading simulator." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-gradient-hero">
        {/* Header */}
        <PublicHeader />

        {/* Hero Section */}
        <section className="relative container mx-auto px-4 py-20 md:py-32 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto relative z-10"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Column - Content */}
              <div className="space-y-8 text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
                >
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">
                    #1 Trading Simulator Platform
                  </span>
                </motion.div>

                <div className="space-y-6">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                    <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                      Master Trading
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                      Without The Risk
                    </span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    Experience institutional-grade trading with virtual capital. Perfect your strategy, learn from experts, and master the markets before risking real money.
                  </p>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Link to="/signup">
                    <Button 
                      size="lg" 
                      className="group relative overflow-hidden shadow-[var(--glow-subtle)] hover:shadow-[var(--glow-primary)] transition-all duration-300 px-8"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        Start Trading Free
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-shine bg-[length:200%_100%] group-hover:animate-[shimmer_2s_infinite]" />
                    </Button>
                  </Link>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="group border-primary/20 hover:border-primary/40 hover:bg-primary/5"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="grid grid-cols-3 gap-6 pt-8"
                >
                  <div className="text-center lg:text-left">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                      100K+
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Active Traders</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                      50M+
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Trades Executed</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
                      99.9%
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Uptime</div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Visual Element */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="relative"
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden">
                  {/* Glassmorphic Card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-card/80 via-card/60 to-card/40 backdrop-blur-xl border border-primary/10 rounded-3xl p-8">
                    {/* Simulated Trading Interface */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Portfolio Value</div>
                          <div className="text-3xl font-bold">$125,847</div>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-success/20 text-success text-sm font-semibold flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          +12.4%
                        </div>
                      </div>
                      
                      {/* Chart placeholder */}
                      <div className="h-48 bg-gradient-to-br from-primary/5 to-transparent rounded-xl border border-primary/10 flex items-end justify-around p-4 gap-2">
                        {[...Array(12)].map((_, i) => (
                          <div 
                            key={i}
                            className="bg-gradient-to-t from-primary to-primary/50 rounded-t"
                            style={{ 
                              height: `${Math.random() * 70 + 30}%`,
                              width: '100%',
                            }}
                          />
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-background/40 border border-border/50">
                          <div className="text-sm text-muted-foreground">Win Rate</div>
                          <div className="text-2xl font-bold text-success">68.3%</div>
                        </div>
                        <div className="p-4 rounded-xl bg-background/40 border border-border/50">
                          <div className="text-sm text-muted-foreground">Total Trades</div>
                          <div className="text-2xl font-bold">1,247</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 blur-3xl -z-10" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-24 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Why Choose{' '}
              </span>
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                TradePro
              </span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience the future of trading education with features designed for both beginners and seasoned professionals
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: Zap,
                title: 'Real-Time Market Data',
                description: 'Execute trades instantly with live market data feeds. Experience realistic trading conditions powered by professional-grade infrastructure.',
                delay: 0.1,
              },
              {
                icon: Copy,
                title: 'Copy Trading',
                description: 'Follow and automatically replicate trades from top performers. Learn proven strategies from successful traders in real-time.',
                delay: 0.2,
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Track performance with institutional-grade analytics. Deep insights into your trading patterns, strengths, and improvement areas.',
                delay: 0.3,
              },
              {
                icon: Users,
                title: 'Social Trading Community',
                description: 'Connect with traders worldwide. Share strategies, compete on leaderboards, and grow your skills together.',
                delay: 0.4,
              },
              {
                icon: Shield,
                title: 'Bank-Level Security',
                description: 'Your data is protected with military-grade encryption. Trade with confidence on our secure, compliant platform.',
                delay: 0.5,
              },
              {
                icon: TrendingUp,
                title: 'Multi-Asset Trading',
                description: 'Access Forex, Stocks, Commodities, Indices, and Crypto. Build a diversified portfolio across all major asset classes.',
                delay: 0.6,
              },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.5 }}
              >
                <Card className="group h-full relative overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:shadow-[var(--shadow-elevation-medium)]">
                  <CardContent className="p-8 space-y-4">
                    <div className="relative inline-block">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-primary/10">
                        <feature.icon className="h-7 w-7 text-primary" />
                      </div>
                      <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <Button 
                      variant="ghost" 
                      className="group/btn p-0 h-auto font-semibold text-primary hover:text-primary hover:bg-transparent"
                    >
                      Learn more
                      <ChevronRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-shine bg-[length:200%_100%] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Social Proof / Testimonials */}
        <section className="container mx-auto px-4 py-24 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
              Trusted by Traders Worldwide
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of successful traders who transformed their journey with TradePro
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {[
              {
                name: 'Sarah Mitchell',
                role: 'Professional Trader',
                content: "TradePro's simulation environment is incredibly realistic. I perfected my strategy without risking capital. The analytics helped me identify and fix my weak points.",
                rating: 5,
                delay: 0.1,
              },
              {
                name: 'James Rodriguez',
                role: 'Forex Specialist',
                content: "The copy trading feature is game-changing. I learned more in 3 months by following top traders than I did in years of trial and error. Absolutely brilliant platform.",
                rating: 5,
                delay: 0.2,
              },
              {
                name: 'Emma Chen',
                role: 'Day Trader',
                content: "Real-time data with zero lag. The platform feels exactly like my live trading account. Perfect for testing new strategies before deploying them with real money.",
                rating: 5,
                delay: 0.3,
              },
            ].map((testimonial) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: testimonial.delay }}
              >
                <Card className="h-full bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-colors">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex text-primary gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>

                    <p className="text-foreground leading-relaxed italic">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
                        <span className="text-lg font-bold text-primary">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50"
          >
            {['Bloomberg', 'Reuters', 'Forbes', 'WSJ', 'TechCrunch'].map((brand) => (
              <div key={brand} className="text-2xl font-bold text-muted-foreground">
                {brand}
              </div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl"
          >
            <Card className="border-primary/20 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl">
              <CardContent className="p-12 md:p-16 lg:p-20">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                      <span className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                        Start Trading Today
                      </span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      Join 100,000+ traders mastering the markets. Get $100,000 virtual capital, access to all features, and unlimited trades — completely free.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/signup">
                      <Button 
                        size="lg" 
                        className="group px-8 shadow-[var(--glow-primary)] hover:shadow-[var(--glow-primary)]"
                      >
                        Create Free Account
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="border-primary/20 hover:border-primary/40">
                        Sign In
                      </Button>
                    </Link>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6 pt-8">
                    {[
                      { icon: Check, text: 'No Credit Card Required' },
                      { icon: Lock, text: 'Bank-Level Security' },
                      { icon: Globe, text: 'Available Worldwide' },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center justify-center gap-2 text-muted-foreground">
                        <item.icon className="h-5 w-5 text-primary" />
                        <span className="text-sm font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Background glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 blur-3xl -z-10" />
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="text-2xl font-bold">TradePro</div>
                <p className="text-sm text-muted-foreground">
                  Master trading without the risk. Professional-grade simulation platform trusted by 100K+ traders worldwide.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/features/web-trading" className="hover:text-primary transition-colors">Features</Link></li>
                  <li><Link to="/assets/forex" className="hover:text-primary transition-colors">Assets</Link></li>
                  <li><Link to="/education/articles" className="hover:text-primary transition-colors">Education</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/about/company" className="hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link to="/about/team" className="hover:text-primary transition-colors">Team</Link></li>
                  <li><Link to="/about/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/legal/terms" className="hover:text-primary transition-colors">Terms</Link></li>
                  <li><Link to="/legal/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                  <li><Link to="/legal/risk" className="hover:text-primary transition-colors">Risk Disclosure</Link></li>
                </ul>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
              <p>© 2025 TradePro. All rights reserved. Trading simulators are for educational purposes only.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Landing;
