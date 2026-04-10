import { Link } from 'react-router-dom';
import { ShoppingCart, User, UtensilsCrossed, Shield, ChefHat, LogOut, Sparkles, UserCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { getItemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const count = getItemCount();

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <UtensilsCrossed className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold text-foreground">MoodByte</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          <Link to="/restaurants" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Restaurants</Link>
          
          {isAuthenticated && user?.role === 'customer' && (
            <>
              <Link to="/mood-recommendations" className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                <Sparkles className="h-3.5 w-3.5" /> Mood Picks
              </Link>
              <Link to="/orders" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Orders</Link>
            </>
          )}
          
          {isAuthenticated && user?.role === 'restaurant_owner' && (
            <Link to="/owner" className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <ChefHat className="h-3.5 w-3.5" /> Dashboard
            </Link>
          )}
          
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <Shield className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated && user?.role === 'customer' && (
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
          )}
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user?.role.replace('_', ' ')}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user?.role === 'customer' && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                        <UserCircle className="h-4 w-4" />
                        My Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders" className="flex items-center gap-2 cursor-pointer">
                        <ShoppingCart className="h-4 w-4" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={logout} className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
