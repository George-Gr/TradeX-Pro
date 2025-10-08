import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, LogOut, Users } from "lucide-react";

interface Lead {
  id: string;
  lead_id: string;
  status: string;
  created_at: string;
  profiles: {
    email: string;
    full_name: string;
    balance: number;
    account_status: string;
  };
}

const Admin = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/login");
      return;
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    if (roleError || roleData?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page",
        variant: "destructive",
      });
      navigate("/dashboard");
      return;
    }

    // Fetch leads
    const { data: leadsData, error: leadsError } = await supabase
      .from("leads")
      .select(`
        id,
        lead_id,
        status,
        created_at,
        profiles (
          email,
          full_name,
          balance,
          account_status
        )
      `)
      .order("created_at", { ascending: false });

    if (leadsError) {
      toast({
        title: "Error",
        description: "Could not load leads",
        variant: "destructive",
      });
    } else {
      setLeads(leadsData as any);
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
            <span className="text-2xl font-bold">TradePro Admin</span>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Lead Management</h1>
              <p className="text-muted-foreground">View and manage user registrations</p>
            </div>
            <Card className="w-48">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{leads.length}</p>
                    <p className="text-xs text-muted-foreground">Total Leads</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leads Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Leads</CardTitle>
            </CardHeader>
            <CardContent>
              {leads.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No leads yet</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lead ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Balance</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell className="font-mono text-sm">{lead.lead_id}</TableCell>
                        <TableCell>{lead.profiles?.full_name || "N/A"}</TableCell>
                        <TableCell>{lead.profiles?.email}</TableCell>
                        <TableCell>${lead.profiles?.balance.toFixed(2) || "0.00"}</TableCell>
                        <TableCell>
                          <Badge variant={lead.profiles?.account_status === "active" ? "default" : "secondary"}>
                            {lead.profiles?.account_status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Admin;
