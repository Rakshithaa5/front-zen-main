import { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Save, Package, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Link } from 'react-router-dom';

const CustomerProfile = () => {
  const { user } = useAuth();
  const { orders } = useCart();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 234 567 8900',
    address: '123 Example Street, City, State 12345'
  });

  const handleSave = () => {
    setEditing(false);
    // TODO: Call API to update profile
  };

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="container max-w-6xl py-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-foreground">My Profile</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Personal Information</h2>
              {!editing ? (
                <Button variant="outline" size="sm" onClick={() => setEditing(true)} className="gap-2">
                  <Edit2 className="h-4 w-4" /> Edit
                </Button>
              ) : (
                <Button size="sm" onClick={handleSave} className="gap-2 bg-primary text-primary-foreground">
                  <Save className="h-4 w-4" /> Save
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <div className="mt-1.5 flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!editing}
                    className={!editing ? 'border-0 bg-transparent px-0' : ''}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <div className="mt-1.5 flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!editing}
                    className={!editing ? 'border-0 bg-transparent px-0' : ''}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <div className="mt-1.5 flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!editing}
                    className={!editing ? 'border-0 bg-transparent px-0' : ''}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address" className="text-sm font-medium">Default Address</Label>
                <div className="mt-1.5 flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-2 text-muted-foreground flex-shrink-0" />
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    disabled={!editing}
                    className={!editing ? 'border-0 bg-transparent px-0' : ''}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Recent Orders</h2>
              <Link to="/orders">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="py-8 text-center">
                <Package className="mx-auto h-12 w-12 text-muted-foreground/40 mb-3" />
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <Link key={order.id} to={`/order/${order.id}`}>
                    <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-foreground">{order.id}</span>
                          <Badge variant="outline" className="text-xs">
                            {order.status.replace(/_/g, ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {order.restaurantName} • {order.items.length} items
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">₹{order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-foreground">Account Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Orders</span>
                <span className="text-2xl font-bold text-foreground">{orders.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Spent</span>
                <span className="text-2xl font-bold text-primary">₹{totalSpent.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-primary/5 p-6">
            <h3 className="mb-2 font-semibold text-foreground">🎉 Loyalty Rewards</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Order 3 more times to unlock free delivery!
            </p>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min((orders.length / 10) * 100, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {orders.length} / 10 orders
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfile;