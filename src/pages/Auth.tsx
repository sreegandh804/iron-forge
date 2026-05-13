import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { NeuCard } from '@/components/ui/neu-card';
import { NeuButton } from '@/components/ui/neu-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const [rateLimitError, setRateLimitError] = useState(false);
  
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Cooldown timer
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = setInterval(() => {
      setCooldownSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownSeconds]);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const isRateLimitError = (message: string): boolean => {
    return message.includes('429') || 
           message.includes('rate limit') || 
           message.includes('rate_limit') ||
           message.includes('too many requests');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setRateLimitError(false);

    if (cooldownSeconds > 0) {
      toast.error(`Please wait ${cooldownSeconds}s before trying again.`);
      return;
    }

    // Validate
    const result = authSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === 'email') fieldErrors.email = err.message;
        if (err.path[0] === 'password') fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else if (isRateLimitError(error.message)) {
            setRateLimitError(true);
            setCooldownSeconds(60);
            toast.error('Too many attempts. Please wait 1 minute and try again.');
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success('Welcome back!');
          navigate('/');
        }
      } else {
        const { data, error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('This email is already registered. Try logging in.');
          } else if (isRateLimitError(error.message)) {
            setRateLimitError(true);
            setCooldownSeconds(60);
            toast.error('Email confirmation limit reached. Please wait 1 minute before trying again.');
          } else {
            toast.error(error.message);
          }
        } else {
          // Check if user needs email confirmation
          if (data?.user?.identities?.length === 0) {
            toast.success('Account already exists. Check your email or try logging in.');
          } else if (data?.session) {
            // Auto-confirmed (no email required)
            toast.success('Account created successfully!');
            navigate('/');
          } else {
            toast.success('Account created! Check your email to confirm.');
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-3 border-2 border-border shadow-sm">
              <Dumbbell className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold uppercase tracking-tight">GymForge</h1>
              <p className="text-muted-foreground font-mono text-sm">Track • Train • Transform</p>
            </div>
          </div>
        </div>

        {/* Auth Card */}
        <NeuCard variant="raised" className="p-6 sm:p-8">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-center mb-6">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>

          {rateLimitError && (
            <div className="mb-4 p-3 bg-destructive/10 border-2 border-destructive/30 rounded-sm flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div className="text-sm text-destructive">
                <p className="font-semibold">Too many attempts</p>
                <p className="text-xs mt-1">
                  Our email provider limits how many confirmation emails can be sent per hour. 
                  Please wait {cooldownSeconds > 0 ? `${cooldownSeconds}s` : 'a moment'} before trying again.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="uppercase text-xs font-bold">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-2 border-border"
                />
              </div>
              {errors.email && <p className="text-destructive text-xs font-mono">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="uppercase text-xs font-bold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-2 border-border"
                />
              </div>
              {errors.password && <p className="text-destructive text-xs font-mono">{errors.password}</p>}
            </div>

            <NeuButton
              type="submit"
              variant="default"
              size="lg"
              className="w-full h-12"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </NeuButton>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground font-mono transition-colors"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </NeuCard>

        <p className="text-center text-xs text-muted-foreground font-mono">
          Your workout data stays private and secure
        </p>
      </div>
    </main>
  );
}
