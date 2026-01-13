import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in. Redirecting to dashboard...',
      });

      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent relative flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md animate-fade-in">
            <div className="text-center mb-10">
              <Link to="/" className="inline-flex items-center gap-2 mb-8 group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-110">
                  <span className="text-primary-foreground font-bold text-xl">G</span>
                </div>
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 animate-slide-up">
                {t.auth.signIn}
              </h1>
              <p className="text-muted-foreground animate-slide-up stagger-1">
                Welcome back! Please sign in to continue.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="animate-slide-up stagger-2">
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t.auth.email}
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="glass border-border/50 hover:border-primary/50 transition-all duration-300"
                  required
                />
              </div>

              <div className="animate-slide-up stagger-3">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-foreground">
                    {t.auth.password}
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    {t.auth.forgotPassword}
                  </Link>
                </div>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="••••••••"
                  className="glass border-border/50 hover:border-primary/50 transition-all duration-300"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !formData.email || !formData.password}
                className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-xl hover:shadow-primary/50 text-primary-foreground py-6 font-semibold transition-all duration-300 hover:scale-105 animate-slide-up stagger-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    {t.auth.signIn}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-muted-foreground mt-8 animate-fade-in stagger-5">
              {t.auth.noAccount}{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline transition-all duration-300">
                {t.auth.signUp}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Visual */}
      <div
        className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 opacity-60 animate-gradient" style={{ background: 'var(--gradient-hero)' }} />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-glow-pulse" />

        <div className="max-w-md text-center relative z-10">
          <div className="w-24 h-24 rounded-2xl glass border border-primary/30 flex items-center justify-center mx-auto mb-8 glow-primary animate-float">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent animate-gradient" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 gradient-text animate-gradient">
            Welcome Back to Gladiator Jobs
          </h2>
          <p className="text-muted-foreground text-lg">
            Access your account and continue building your professional network.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
