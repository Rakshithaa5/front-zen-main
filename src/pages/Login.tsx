import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        await register(formData.name, formData.email, formData.password, formData.role);
        toast.success('Account created successfully!');
      } else {
        await login(formData.email, formData.password);
        toast.success('Welcome back!');
      }
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
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
          <Input 
            name="password"
            type="password" 
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange}
            required
          />
          {isRegister && (
            <select 
              name="role"
              value={formData.role}
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
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isRegister ? 'Sign Up' : 'Login')}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsRegister(!isRegister)} className="font-medium text-primary hover:underline">
            {isRegister ? 'Login' : 'Sign Up'}
          </button>
        </p>

        <div className="mt-4 text-center text-xs text-muted-foreground">
          <p>Test admin login:</p>
          <p>admin@moodbyte.com / Admin@123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
