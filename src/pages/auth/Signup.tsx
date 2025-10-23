import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/utils/toast';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Globe,
  Target,
  BarChart3,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
});

const Signup = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Step 1: Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Step 2: Profile
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');

  // Step 3: Risk Assessment
  const [riskTolerance, setRiskTolerance] = useState('');
  const [tradingExperience, setTradingExperience] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    try {
      const validatedData = signupSchema.parse({
        email,
        password,
        fullName,
        phone,
        country,
      });

      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          data: {
            full_name: validatedData.fullName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;

      // Update profile with additional info
      if (data.user) {
        await supabase
          .from('profiles')
          .update({
            phone: validatedData.phone,
            country: validatedData.country,
            risk_tolerance: riskTolerance,
            trading_experience: tradingExperience,
          })
          .eq('id', data.user.id);
      }

      toast({
        title: 'Account Created!',
        description: 'Welcome to TradePro. Your account starts with $0 balance.',
      });

      navigate('/dashboard');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Signup Failed',
          description: error instanceof Error ? error.message : 'Could not create account',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const progressValue = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-radial opacity-30"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-2xl animate-float"
        style={{ animationDelay: '2s' }}
      ></div>

      <Card className="w-full max-w-md shadow-elevation-high border border-primary/20 backdrop-blur-sm bg-card/95 animate-slide-up-fade relative z-10">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <TrendingUp className="h-8 w-8 text-primary animate-pulse-glow" />
            </div>
            <span className="text-2xl font-bold text-gradient-premium font-display">TradePro</span>
          </div>
          <div className="space-y-3 text-center">
            <CardTitle className="text-xl font-semibold">Create Your Account</CardTitle>
            <CardDescription className="text-muted-foreground">
              Join thousands of traders on our platform
            </CardDescription>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Step {step} of 3</span>
                <span>{Math.round(progressValue)}% Complete</span>
              </div>
              <Progress value={progressValue} className="h-2" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <form onSubmit={handleSignup} className="space-y-4">
            {step === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 border-input/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a strong password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 border-input/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 h-11 border-input/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number (Optional)
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-10 h-11 border-input/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium">
                    Country
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="country"
                      type="text"
                      placeholder="Enter your country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="pl-10 h-11 border-input/50 focus:border-primary focus:ring-primary/20 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Risk Tolerance
                  </Label>
                  <RadioGroup value={riskTolerance} onValueChange={setRiskTolerance} required>
                    <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="conservative" id="conservative" />
                      <Label htmlFor="conservative" className="font-normal cursor-pointer flex-1">
                        Conservative - Prefer stable, low-risk investments
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="moderate" id="moderate" />
                      <Label htmlFor="moderate" className="font-normal cursor-pointer flex-1">
                        Moderate - Balance between risk and potential returns
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="aggressive" id="aggressive" />
                      <Label htmlFor="aggressive" className="font-normal cursor-pointer flex-1">
                        Aggressive - Seek higher returns, comfortable with volatility
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Trading Experience
                  </Label>
                  <RadioGroup
                    value={tradingExperience}
                    onValueChange={setTradingExperience}
                    required
                  >
                    <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="beginner" id="beginner" />
                      <Label htmlFor="beginner" className="font-normal cursor-pointer flex-1">
                        Beginner - New to trading, learning the basics
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="intermediate" id="intermediate" />
                      <Label htmlFor="intermediate" className="font-normal cursor-pointer flex-1">
                        Intermediate - Some experience, understand market dynamics
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value="advanced" id="advanced" />
                      <Label htmlFor="advanced" className="font-normal cursor-pointer flex-1">
                        Advanced - Experienced trader with deep market knowledge
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </>
            )}

            <div className="flex gap-2 pt-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  disabled={loading}
                  className="flex-1 h-11 border-input/50 hover:bg-muted/50 transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              <Button
                type="submit"
                className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-glow-primary transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : step < 3 ? (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  'Complete Signup'
                )}
              </Button>
            </div>
          </form>
          <div className="pt-2 border-t border-border/50">
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link
                to="/login"
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign in here
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
