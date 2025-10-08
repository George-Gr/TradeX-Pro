import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Users, Shield, BarChart3, Copy, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">TradePro</span>
          </div>
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Master CFD Trading Risk-Free
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practice paper trading, copy successful traders, and build your skills with real-time market data.
            No risk, all reward.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="shadow-glow-primary">
                Start Trading Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose TradePro?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-primary/20 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Real-Time Trading</h3>
              <p className="text-muted-foreground">
                Execute trades instantly with live market data. Experience realistic trading conditions without financial risk.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Copy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Copy Trading</h3>
              <p className="text-muted-foreground">
                Follow top performers and automatically replicate their trades. Learn from the best traders in real-time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Advanced Analytics</h3>
              <p className="text-muted-foreground">
                Track your performance with detailed analytics. Understand your strengths and improve your strategy.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Social Trading</h3>
              <p className="text-muted-foreground">
                Connect with a community of traders. Share strategies, compete on leaderboards, and grow together.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Secure Platform</h3>
              <p className="text-muted-foreground">
                Your data is protected with bank-level security. Trade with confidence on our encrypted platform.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/50 transition-colors">
            <CardContent className="pt-6 space-y-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Multi-Asset Trading</h3>
              <p className="text-muted-foreground">
                Trade Forex, Stocks, Commodities, and Crypto. Diversify your portfolio across multiple asset classes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="py-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Start Trading?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of traders who are honing their skills with TradePro.
              Start with virtual funds and trade your way to confidence.
            </p>
            <Link to="/signup">
              <Button size="lg" className="shadow-glow-primary">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 TradePro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
