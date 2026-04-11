import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface LoginLocationState {
  mode?: 'login' | 'register';
  redirectTo?: string;
}

const getPasswordChecks = (password: string) => ({
  minLength: password.length >= 8,
  hasUpper: /[A-Z]/.test(password),
  hasLower: /[a-z]/.test(password),
  hasNumber: /\d/.test(password),
  hasSymbol: /[^A-Za-z0-9]/.test(password),
});

const getPasswordStrength = (password: string) => {
  const checks = getPasswordChecks(password);
  const passed = Object.values(checks).filter(Boolean).length;

  if (password.length === 0) return { label: 'No password', color: 'text-muted-foreground', passed, checks };
  if (passed <= 2) return { label: 'Weak', color: 'text-destructive', passed, checks };
  if (passed <= 4) return { label: 'Medium', color: 'text-amber-500', passed, checks };
  return { label: 'Strong', color: 'text-emerald-600', passed, checks };
};

const Login = () => {
  const location = useLocation();
  const state = (location.state as LoginLocationState | null) ?? null;
  const [isRegister, setIsRegister] = useState(state?.mode === 'register');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    loginRole: 'customer'
  });
  const { login, register, logout } = useAuth();
  const navigate = useNavigate();
  const passwordStrength = getPasswordStrength(formData.password);
  const isPasswordMismatch = isRegister && formData.confirmPassword.length > 0 && formData.password !== formData.confirmPassword;
  const isPasswordPolicyMet = Object.values(passwordStrength.checks).every(Boolean);
  const isRegisterDisabled =
    loading ||
    !formData.name.trim() ||
    !formData.email.trim() ||
    !formData.password ||
    !formData.confirmPassword ||
    !isPasswordPolicyMet ||
    isPasswordMismatch;
  const strengthPercent = (passwordStrength.passed / 5) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegister && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        await register(formData.name, formData.email, formData.password, 'customer');
        toast.success('Account created successfully!');
      } else {
        await login(formData.email, formData.password);

        const userData = localStorage.getItem('user');
        const loggedInUser = userData ? JSON.parse(userData) as { role?: string } : null;
        if (loggedInUser?.role !== 'admin' && loggedInUser?.role !== formData.loginRole) {
          logout();
          toast.error(`This account is not a ${formData.loginRole === 'restaurant_owner' ? 'Restaurant Owner' : 'Customer'} account`);
          return;
        }

        toast.success('Welcome back!');
      }
      navigate(state?.redirectTo || '/');
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-lg">
        <div className="mb-6 flex flex-col items-center gap-2">
          <UtensilsCrossed className="h-10 w-10 text-primary" />
          <h1 className="font-display text-2xl font-bold text-foreground">{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
          <p className="text-sm text-muted-foreground">{isRegister ? 'Sign up to get started' : 'Login to your account'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <Input 
              name="name"
              placeholder="Full Name" 
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <Input 
            name="email"
            type="email" 
            placeholder="Email" 
            value={formData.email}
            onChange={handleChange}
            required
          />
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {isRegister && (
            <div className="space-y-1">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all ${
                    passwordStrength.label === 'Strong'
                      ? 'bg-emerald-600'
                      : passwordStrength.label === 'Medium'
                        ? 'bg-amber-500'
                        : passwordStrength.label === 'Weak'
                          ? 'bg-destructive'
                          : 'bg-muted-foreground/40'
                  }`}
                  style={{ width: `${strengthPercent}%` }}
                />
              </div>
              <p className={`text-xs ${passwordStrength.color}`}>
                Password strength: {passwordStrength.label}
              </p>
              <p className="text-xs text-muted-foreground">
                Use at least 8 characters with uppercase, lowercase, number, and symbol.
              </p>
            </div>
          )}
          {isRegister && (
            <div className="space-y-1">
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {isPasswordMismatch && (
                <p className="text-xs text-destructive">Passwords do not match.</p>
              )}
            </div>
          )}
          {!isRegister && (
            <select 
              name="loginRole"
              value={formData.loginRole}
              onChange={handleChange}
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="customer">Customer</option>
              <option value="restaurant_owner">Restaurant Owner</option>
            </select>
          )}
          <Button 
            type="submit" 
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isRegister ? isRegisterDisabled : loading}
          >
            {loading ? 'Please wait...' : (isRegister ? 'Sign Up' : 'Login')}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="font-medium text-primary hover:underline"
            type="button"
          >
            {isRegister ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
