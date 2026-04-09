import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info('Auth is UI-only for now. Backend coming soon!');
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
          {isRegister && <Input placeholder="Full Name" />}
          <Input type="email" placeholder="Email" />
          <Input type="password" placeholder="Password" />
          {isRegister && (
            <select className="w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground">
              <option value="customer">Customer</option>
              <option value="restaurant_owner">Restaurant Owner</option>
            </select>
          )}
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
            {isRegister ? 'Sign Up' : 'Login'}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsRegister(!isRegister)} className="font-medium text-primary hover:underline">
            {isRegister ? 'Login' : 'Sign Up'}
          </button>
        </p>

        <Link to="/" className="mt-4 block text-center text-xs text-muted-foreground hover:text-foreground">
          ← Back to home
        </Link>
      </div>
    </div>
  );
};

export default Login;
