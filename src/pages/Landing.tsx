import PublicHeader from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BarChart3,
  ChevronRight,
  Copy,
  Globe,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative container mx-auto px-4 py-24 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto space-y-8 text-center relative z-10"
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4"
            >
              #1 Trading Simulator Platform
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Master CFD Trading
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary/90 via-primary/70 to-primary/90 bg-clip-text text-transparent">
                Without Risk
              </span>
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Experience professional-grade trading with virtual funds. Perfect your strategy, copy
              elite traders, and analyze real-time market data on our cutting-edge platform.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/signup">
              <Button size="lg" className="shadow-glow-primary group relative overflow-hidden">
                <span className="relative z-10">Start Trading Now</span>
                <motion.div
                  className="absolute inset-0 bg-primary/20"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="group">
              Watch Demo
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="pt-12 flex justify-center gap-8 text-muted-foreground"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">100K+</div>
              <div className="text-sm">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">50M+</div>
              <div className="text-sm">Trades Executed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">99.9%</div>
              <div className="text-sm">Uptime</div>
            </div>
          </motion.div>
        </motion.div>

        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Why Choose TradePro?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of trading with our cutting-edge features designed for both
            beginners and professionals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="group relative overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="pt-8 pb-8 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Real-Time Trading</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Execute trades instantly with live market data. Experience realistic trading
                    conditions without financial risk.
                  </p>
                </div>
                <div className="pt-2">
                  <Button variant="ghost" className="group/btn">
                    Learn more
                    <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="group relative overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="pt-8 pb-8 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Copy className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Copy Trading</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Follow top performers and automatically replicate their trades. Learn from the
                    best traders in real-time.
                  </p>
                </div>
                <div className="pt-2">
                  <Button variant="ghost" className="group/btn">
                    Learn more
                    <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="group relative overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="pt-8 pb-8 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Advanced Analytics</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Track your performance with detailed analytics. Understand your strengths and
                    improve your strategy.
                  </p>
                </div>
                <div className="pt-2">
                  <Button variant="ghost" className="group/btn">
                    Learn more
                    <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="group relative overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="pt-8 pb-8 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Social Trading</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Connect with a community of traders. Share strategies, compete on leaderboards,
                    and grow together.
                  </p>
                </div>
                <div className="pt-2">
                  <Button variant="ghost" className="group/btn">
                    Learn more
                    <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="group relative overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="pt-8 pb-8 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Secure Platform</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Your data is protected with bank-level security. Trade with confidence on our
                    encrypted platform.
                  </p>
                </div>
                <div className="pt-2">
                  <Button variant="ghost" className="group/btn">
                    Learn more
                    <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="group relative overflow-hidden border-primary/20 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="pt-8 pb-8 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Multi-Asset Trading</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Trade Forex, Stocks, Commodities, and Crypto. Diversify your portfolio across
                    multiple asset classes.
                  </p>
                </div>
                <div className="pt-2">
                  <Button variant="ghost" className="group/btn">
                    Learn more
                    <ChevronRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="container mx-auto px-4 py-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Trusted by Traders Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of successful traders who have transformed their trading journey with
            TradePro
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur border-primary/10">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah K.</h4>
                    <p className="text-sm text-muted-foreground">Professional Trader</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "TradePro's real-time simulation helped me perfect my trading strategy without
                  risking real money. The analytics are exceptional!"
                </p>
                <div className="flex text-primary">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur border-primary/10">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Michael R.</h4>
                    <p className="text-sm text-muted-foreground">Day Trader</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "The copy trading feature is a game-changer. I've learned so much by following
                  experienced traders and analyzing their strategies."
                </p>
                <div className="flex text-primary">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur border-primary/10">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Alex T.</h4>
                    <p className="text-sm text-muted-foreground">Portfolio Manager</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "The advanced analytics and multi-asset trading capabilities have revolutionized
                  how I manage my portfolio. Truly impressive platform!"
                </p>
                <div className="flex text-primary">
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                  <Star className="h-4 w-4 fill-current" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center justify-center p-6 bg-card/50 backdrop-blur rounded-lg border border-primary/10"
          >
            <img
              src="/logos/bloomberg.svg"
              alt="Bloomberg"
              className="h-8 opacity-70 hover:opacity-100 transition-opacity"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center p-6 bg-card/50 backdrop-blur rounded-lg border border-primary/10"
          >
            <img
              src="/logos/reuters.svg"
              alt="Reuters"
              className="h-8 opacity-70 hover:opacity-100 transition-opacity"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center p-6 bg-card/50 backdrop-blur rounded-lg border border-primary/10"
          >
            <img
              src="/logos/forbes.svg"
              alt="Forbes"
              className="h-8 opacity-70 hover:opacity-100 transition-opacity"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center justify-center p-6 bg-card/50 backdrop-blur rounded-lg border border-primary/10"
          >
            <img
              src="/logos/wsj.svg"
              alt="Wall Street Journal"
              className="h-8 opacity-70 hover:opacity-100 transition-opacity"
            />
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="relative overflow-hidden border-primary/20">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-2xl" />
            </div>
            <CardContent className="relative py-16 px-4 md:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  Start Your Trading Journey Today
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Join over 100,000 traders who have transformed their trading skills with TradePro.
                  Get instant access to our advanced trading simulator and start risk-free.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link to="/signup">
                    <Button
                      size="lg"
                      className="shadow-glow-primary group relative overflow-hidden"
                    >
                      <span className="relative z-10">Create Free Account</span>
                      <motion.div
                        className="absolute inset-0 bg-primary/20"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-5 w-5" />
                    <span>30-Day Money-Back Guarantee</span>
                  </div>
                </div>
                <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-sm text-muted-foreground">
                  <div>
                    <div className="font-bold text-primary text-2xl mb-1">100K+</div>
                    Active Traders
                  </div>
                  <div>
                    <div className="font-bold text-primary text-2xl mb-1">50M+</div>
                    Trades Executed
                  </div>
                  <div>
                    <div className="font-bold text-primary text-2xl mb-1">99.9%</div>
                    Uptime
                  </div>
                  <div>
                    <div className="font-bold text-primary text-2xl mb-1">24/7</div>
                    Support
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <img src="/logos/tradepro-logo.svg" alt="TradePro Logo" className="h-8" />
                <span className="font-bold text-xl">TradePro</span>
              </Link>
              <p className="text-muted-foreground mb-4 max-w-sm">
                Experience the future of trading with our advanced CFD trading simulator. Practice,
                learn, and master trading strategies risk-free.
              </p>
              <div className="flex gap-4">
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="hover:text-primary">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/features/web-trading"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Web Trading
                  </Link>
                </li>
                <li>
                  <Link
                    to="/features/copy-trading"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Copy Trading
                  </Link>
                </li>
                <li>
                  <Link
                    to="/features/analytics"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/features/security"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/resources/blog" className="text-muted-foreground hover:text-primary">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    to="/resources/tutorials"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Tutorials
                  </Link>
                </li>
                <li>
                  <Link to="/resources/api" className="text-muted-foreground hover:text-primary">
                    API Docs
                  </Link>
                </li>
                <li>
                  <Link to="/resources/help" className="text-muted-foreground hover:text-primary">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/company/about" className="text-muted-foreground hover:text-primary">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/company/careers" className="text-muted-foreground hover:text-primary">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/company/contact" className="text-muted-foreground hover:text-primary">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/company/press" className="text-muted-foreground hover:text-primary">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/legal/privacy" className="text-muted-foreground hover:text-primary">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link to="/legal/terms" className="text-muted-foreground hover:text-primary">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/legal/licenses" className="text-muted-foreground hover:text-primary">
                    Licenses
                  </Link>
                </li>
                <li>
                  <Link to="/legal/cookies" className="text-muted-foreground hover:text-primary">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 TradePro. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Select defaultValue="en">
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
              <Link to="#" className="text-sm text-muted-foreground hover:text-primary">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
