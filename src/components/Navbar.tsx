import { Link } from 'react-router-dom';
import { ShoppingCart, User, UtensilsCrossed, Shield, ChefHat, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { getItemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const count = getItemCount();

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">Food Zen</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          <Link to="/restaurants" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Restaurants</Link>
          {isAuthenticated && (
            <Link to="/orders" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Orders</Link>
          )}
          <Link to="/owner" className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ChefHat className="h-3.5 w-3.5" /> Owner
          </Link>
          <Link to="/admin" className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <Shield className="h-3.5 w-3.5" /> Admin
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-xs text-primary-foreground">
                  {count}
                </Badge>
              )}
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="hidden text-sm text-muted-foreground sm:block">
                Hi, {user?.name}
              </span>
              <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="gap-1.5">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
