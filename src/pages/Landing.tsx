import PublicHeader from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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
  X,
  ChevronDown,
  Sparkles,
  Target,
  Clock,
  BookOpen,
  MessageSquare,
  Mail,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useState, useEffect, useRef } from 'react';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-primary/70 bg-clip-text text-transparent">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

const Landing = () => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  };

  const faqs = [
    {
      question: 'Is TradePro really 100% free?',
      answer: 'Yes! Creating an account and accessing our full trading simulator is completely free. There are no hidden fees, subscriptions, or credit card requirements. You get $100,000 virtual capital and access to all features at no cost.',
    },
    {
      question: 'What is paper trading and how does it work?',
      answer: 'Paper trading is simulated trading with virtual money. It allows you to practice trading strategies, test ideas, and learn without risking real capital. Our platform uses real-time market data to provide an authentic trading experience that mirrors live conditions.',
    },
    {
      question: 'Can I trade real money on this platform?',
      answer: 'TradePro is exclusively a paper trading platform for educational purposes. We focus on providing the best risk-free learning environment. If you want to transition to real trading, you can apply the skills learned here to any broker platform.',
    },
    {
      question: 'How realistic is the trading experience?',
      answer: 'Extremely realistic. We use live market data, accurate spread calculations, realistic slippage, and authentic order execution. The only difference from real trading is that your capital is virtual. This allows you to learn without financial risk.',
    },
    {
      question: 'Do I need trading experience to start?',
      answer: 'No! TradePro is designed for all skill levels. Complete beginners can start with our Trading Academy, follow our tutorials, and gradually build their skills. Experienced traders can use the platform to test new strategies or refine their techniques.',
    },
    {
      question: 'What markets can I trade?',
      answer: 'You can trade 90+ instruments across 5 asset classes: Forex (currency pairs), Stocks (major companies), Commodities (gold, oil, etc.), Indices (S&P 500, NASDAQ, etc.), and Cryptocurrencies (Bitcoin, Ethereum, etc.).',
    },
  ];

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

        {/* Hero Section with Parallax */}
        <motion.section
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative container mx-auto px-4 py-20 md:py-32 overflow-hidden"
        >
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
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1]">
                    <span className="text-gradient-premium">
                      Master Trading
                    </span>
                    <br />
                    <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                      Without The Risk
                    </span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    Experience institutional-grade trading with <span className="text-primary font-semibold">$100,000 virtual capital</span>. Perfect your strategy, learn from experts, and master the markets before risking real money.
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
                      className="group relative overflow-hidden shadow-[var(--glow-subtle)] hover:shadow-[var(--glow-primary)] transition-all duration-300 px-8 text-base h-14"
                    >
                      <span className="relative z-10 flex items-center gap-2 font-semibold">
                        Start Trading Free
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-shine bg-[length:200%_100%] group-hover:animate-[shimmer_2s_infinite]" />
                    </Button>
                  </Link>
                  
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="group border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-base h-14"
                    onClick={() => setVideoModalOpen(true)}
                  >
                    <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                    Watch Demo
                  </Button>
                </motion.div>

                {/* Trust Indicators with Animated Counters */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="grid grid-cols-3 gap-6 pt-8"
                >
                  <div className="text-center lg:text-left">
                    <AnimatedCounter end={100} suffix="K+" />
                    <div className="text-sm text-muted-foreground mt-1">Active Traders</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <AnimatedCounter end={50} suffix="M+" />
                    <div className="text-sm text-muted-foreground mt-1">Trades Executed</div>
                  </div>
                  <div className="text-center lg:text-left">
                    <AnimatedCounter end={99.9} suffix="%" />
                    <div className="text-sm text-muted-foreground mt-1">Uptime</div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Visual Element with Floating Animation */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="relative animate-float"
              >
                <div className="relative aspect-square rounded-3xl overflow-hidden">
                  {/* Glassmorphic Card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-card/90 via-card/70 to-card/50 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 shadow-[var(--shadow-elevation-high)]">
                    {/* Simulated Trading Interface */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            Portfolio Value
                          </div>
                          <div className="text-3xl font-bold mt-1">$125,847</div>
                        </div>
                        <div className="px-4 py-2 rounded-full bg-success/20 text-success text-sm font-semibold flex items-center gap-2 animate-pulse-glow">
                          <Activity className="w-4 h-4" />
                          +12.4%
                        </div>
                      </div>
                      
                      {/* Chart placeholder with animated bars */}
                      <div className="h-48 bg-gradient-to-br from-primary/5 to-transparent rounded-xl border border-primary/10 flex items-end justify-around p-4 gap-2 overflow-hidden relative">
                        {[...Array(12)].map((_, i) => (
                          <motion.div 
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.random() * 70 + 30}%` }}
                            transition={{ delay: i * 0.1, duration: 0.5, ease: 'easeOut' }}
                            className="bg-gradient-to-t from-primary to-primary/50 rounded-t"
                            style={{ width: '100%' }}
                          />
                        ))}
                        <div className="absolute inset-0 bg-gradient-to-t from-card/20 to-transparent pointer-events-none" />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4">
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="p-4 rounded-xl bg-background/40 border border-border/50 backdrop-blur-sm"
                        >
                          <div className="text-sm text-muted-foreground">Win Rate</div>
                          <div className="text-2xl font-bold text-success">68.3%</div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          className="p-4 rounded-xl bg-background/40 border border-border/50 backdrop-blur-sm"
                        >
                          <div className="text-sm text-muted-foreground">Total Trades</div>
                          <div className="text-2xl font-bold">1,247</div>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-primary/40 to-primary/30 blur-3xl -z-10 animate-pulse-glow" />
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
          </div>
        </motion.section>

        {/* Features Section with Enhanced Cards */}
        <section className="container mx-auto px-4 py-24 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
              <span className="text-gradient-premium">
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
                gradient: 'from-yellow-500/20 to-orange-500/5',
                delay: 0.1,
              },
              {
                icon: Copy,
                title: 'Copy Trading',
                description: 'Follow and automatically replicate trades from top performers. Learn proven strategies from successful traders in real-time.',
                gradient: 'from-blue-500/20 to-cyan-500/5',
                delay: 0.2,
              },
              {
                icon: BarChart3,
                title: 'Advanced Analytics',
                description: 'Track performance with institutional-grade analytics. Deep insights into your trading patterns, strengths, and improvement areas.',
                gradient: 'from-purple-500/20 to-pink-500/5',
                delay: 0.3,
              },
              {
                icon: Users,
                title: 'Social Trading Community',
                description: 'Connect with traders worldwide. Share strategies, compete on leaderboards, and grow your skills together.',
                gradient: 'from-green-500/20 to-emerald-500/5',
                delay: 0.4,
              },
              {
                icon: Shield,
                title: 'Bank-Level Security',
                description: 'Your data is protected with military-grade encryption. Trade with confidence on our secure, compliant platform.',
                gradient: 'from-red-500/20 to-rose-500/5',
                delay: 0.5,
              },
              {
                icon: TrendingUp,
                title: 'Multi-Asset Trading',
                description: 'Access Forex, Stocks, Commodities, Indices, and Crypto. Build a diversified portfolio across all major asset classes.',
                gradient: 'from-primary/20 to-primary/5',
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
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-primary/10`}>
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

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-24 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gradient-premium">
              Start Trading in 3 Simple Steps
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started in minutes and begin your journey to trading mastery
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8 relative">
            {[
              {
                step: '01',
                icon: Users,
                title: 'Create Account',
                description: 'Sign up in 2 minutes with just your email. No credit card or payment information required.',
                time: '2 min',
              },
              {
                step: '02',
                icon: Target,
                title: 'Get Virtual Capital',
                description: 'Receive $100,000 in virtual funds instantly. Start trading across 90+ markets immediately.',
                time: 'Instant',
              },
              {
                step: '03',
                icon: TrendingUp,
                title: 'Start Trading',
                description: 'Execute your first trade and begin learning. Access all features, analytics, and educational resources.',
                time: 'Instant',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative"
              >
                <Card className="relative h-full border-primary/10 bg-gradient-to-br from-card to-card/50 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex items-start justify-between">
                      <div className="text-6xl font-display font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                        {item.step}
                      </div>
                      <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </div>
                    </div>

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="h-7 w-7 text-primary" />
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Connecting Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/40 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link to="/signup">
              <Button size="lg" className="group shadow-[var(--glow-primary)] hover:shadow-[var(--glow-primary)] px-8">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gradient-premium">
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
                <Card className="h-full bg-gradient-to-br from-card/90 to-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-[var(--shadow-elevation-medium)] group">
                  <CardContent className="p-8 space-y-6">
                    <div className="flex text-primary gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-current" />
                      ))}
                    </div>

                    <p className="text-foreground leading-relaxed italic text-lg">
                      "{testimonial.content}"
                    </p>

                    <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 group-hover:scale-110 transition-transform">
                        <span className="text-lg font-bold text-primary">
                          {testimonial.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-lg">{testimonial.name}</div>
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
            className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-60"
          >
            <div className="text-sm text-muted-foreground font-semibold">As featured in:</div>
            {['Bloomberg', 'Reuters', 'Forbes', 'WSJ', 'TechCrunch'].map((brand) => (
              <div key={brand} className="text-2xl font-bold text-muted-foreground hover:text-primary/70 transition-colors">
                {brand}
              </div>
            ))}
          </motion.div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-24 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4 mb-16"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gradient-premium">
              Frequently Asked Questions
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to know about trading on TradePro
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm hover:border-primary/20 transition-all overflow-hidden">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full text-left p-6 flex items-center justify-between gap-4 group"
                  >
                    <span className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {faq.question}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-primary transition-transform duration-300 flex-shrink-0 ${
                        expandedFAQ === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {expandedFAQ === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-border/50 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl"
          >
            <Card className="border-primary/30 bg-gradient-to-br from-card to-card/50 backdrop-blur-xl shadow-[var(--shadow-elevation-high)]">
              <CardContent className="p-12 md:p-16 lg:p-20">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold">
                      <span className="text-gradient-premium">
                        Start Trading Today
                      </span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      Join <span className="text-primary font-semibold">100,000+ traders</span> mastering the markets. Get <span className="text-primary font-semibold">$100,000 virtual capital</span>, access to all features, and unlimited trades — completely free.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link to="/signup">
                      <Button 
                        size="lg" 
                        className="group px-8 shadow-[var(--glow-primary)] hover:shadow-[var(--glow-primary)] text-base h-14"
                      >
                        Create Free Account
                        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="border-primary/20 hover:border-primary/40 text-base h-14">
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
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 blur-3xl -z-10 animate-pulse-glow" />
          </motion.div>
        </section>

        {/* Footer with Newsletter */}
        <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-12">
            {/* Newsletter */}
            <div className="mb-12 pb-12 border-b border-border/50">
              <div className="max-w-xl mx-auto text-center space-y-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Stay Updated</h3>
                  <p className="text-muted-foreground">
                    Get trading tips, platform updates, and market insights delivered to your inbox
                  </p>
                </div>
                <div className="flex gap-2 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg bg-background border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <Button size="lg" className="px-6">
                    <Mail className="mr-2 h-4 w-4" />
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </div>
            </div>

            {/* Footer Links */}
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="space-y-4">
                <div className="text-2xl font-display font-bold">TradePro</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Master trading without the risk. Professional-grade simulation platform trusted by 100K+ traders worldwide.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/features/web-trading" className="hover:text-primary transition-colors">Features</Link></li>
                  <li><Link to="/assets/forex" className="hover:text-primary transition-colors">Markets</Link></li>
                  <li><Link to="/education/articles" className="hover:text-primary transition-colors">Education</Link></li>
                  <li><Link to="/features/copy-trading" className="hover:text-primary transition-colors">Copy Trading</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/about/company" className="hover:text-primary transition-colors">About Us</Link></li>
                  <li><Link to="/about/team" className="hover:text-primary transition-colors">Team</Link></li>
                  <li><Link to="/about/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                  <li><Link to="/about/articles" className="hover:text-primary transition-colors">Blog</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link to="/legal/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                  <li><Link to="/legal/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                  <li><Link to="/legal/risk" className="hover:text-primary transition-colors">Risk Disclosure</Link></li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>© 2025 TradePro. All rights reserved. Trading simulators are for educational purposes only.</p>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" />
                  SSL Secure
                </span>
                <span className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  GDPR Compliant
                </span>
              </div>
            </div>
          </div>
        </footer>

        {/* Video Modal */}
        <AnimatePresence>
          {videoModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setVideoModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="relative w-full max-w-4xl aspect-video bg-card rounded-2xl border border-primary/20 overflow-hidden shadow-[var(--shadow-elevation-high)]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Play className="w-16 h-16 mx-auto text-primary animate-pulse" />
                    <p className="text-muted-foreground">Demo video will play here</p>
                    <p className="text-sm text-muted-foreground/70">Video integration pending</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Landing;
