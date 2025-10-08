import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Wallet, BarChart3, LogOut } from "lucide-react";

interface Profile {
  balance: number;
  bonus_balance: number;
  equity: number;
  margin_used: number;
  account_status: string;
  kyc_status: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }

    // Fetch profile
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("balance, bonus_balance, equity, margin_used, account_status, kyc_status")
      .eq("id", session.user.id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Could not load profile data",
        variant: "destructive",
      });
    } else {
      setProfile(profileData);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">TradePro</span>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Your Dashboard</h1>
            <p className="text-muted-foreground">
              Your account status: <span className="text-primary capitalize">{profile?.account_status}</span>
            </p>
          </div>

          {/* Account Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold">${profile?.balance.toFixed(2) || "0.00"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Bonus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">${profile?.bonus_balance.toFixed(2) || "0.00"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Equity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  <span className="text-2xl font-bold">${profile?.equity.toFixed(2) || "0.00"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Margin Used</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">${profile?.margin_used.toFixed(2) || "0.00"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* KYC Notice */}
          {profile?.kyc_status === "not_started" && (
            <Card className="border-warning/50 bg-warning/5">
              <CardContent className="pt-6">
                <p className="text-sm">
                  <strong>Complete KYC verification</strong> to unlock all trading features and increase your limits.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Coming Soon Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Trade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Real-time trading interface coming soon.</p>
                <Button disabled>Open Trade</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">View your open positions and history.</p>
                <Button disabled>View Portfolio</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
