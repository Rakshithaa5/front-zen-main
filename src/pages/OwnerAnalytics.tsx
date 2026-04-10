import { Link } from 'react-router-dom';
import { ChefHat, IndianRupee, ShoppingBag, TrendingUp, Settings } from 'lucide-react';
import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const OwnerAnalytics = () => {
  const { restaurants, menuItems } = useApp();
  const { orders } = useCart();
  const { user } = useAuth();

  const restaurant = restaurants.find(r => r.id === user?.restaurantId);
  const items = menuItems.filter(m => m.restaurantId === restaurant?.id);
  const restaurantOrders = orders.filter(o => o.restaurantId === restaurant?.id || o.restaurantName === restaurant?.name);

  const totalRevenue = restaurantOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = restaurantOrders.filter(o => o.status !== 'delivered').length;

  const orderStatusData = useMemo(() => {
    const statuses = ['placed', 'accepted', 'preparing', 'out_for_delivery', 'delivered'] as const;
    return statuses.map((status) => ({
      status: status.replace(/_/g, ' '),
      count: restaurantOrders.filter(order => order.status === status).length,
    }));
  }, [restaurantOrders]);

  const revenueTrendData = useMemo(() => {
    return restaurantOrders
      .slice(0, 8)
      .map((order, index) => ({
        label: `Order ${index + 1}`,
        revenue: Number(order.total),
      }))
      .reverse();
  }, [restaurantOrders]);

  const menuMixData = useMemo(() => {
    const vegCount = items.filter(item => item.isVeg).length;
    const nonVegCount = Math.max(items.length - vegCount, 0);
    return [
      { name: 'Veg', value: vegCount, fill: 'var(--color-veg)' },
      { name: 'Non-Veg', value: nonVegCount, fill: 'var(--color-nonVeg)' },
    ].filter(entry => entry.value > 0);
  }, [items]);

  const chartConfig = {
    count: { label: 'Orders', color: 'hsl(var(--primary))' },
    revenue: { label: 'Revenue', color: 'hsl(var(--warning))' },
    veg: { label: 'Veg', color: 'hsl(var(--success))' },
    nonVeg: { label: 'Non-Veg', color: 'hsl(var(--destructive))' },
  };

  if (!restaurant) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <ChefHat className="mx-auto mb-4 h-16 w-16 text-muted-foreground/40" />
          <h2 className="mb-2 text-2xl font-bold text-foreground">No Restaurant Assigned</h2>
          <p className="text-muted-foreground">Please contact admin to assign a restaurant to your account.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Dashboard Analytics</h1>
              <p className="text-sm text-muted-foreground">{restaurant.name}</p>
            </div>
          </div>
          <p className="text-muted-foreground">Charts and insights for your restaurant performance</p>
        </div>
        <Link to="/owner">
          <Button className="gap-2" variant="outline">
            <Settings className="h-4 w-4" /> Go to Owner Home
          </Button>
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <ShoppingBag className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{restaurantOrders.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
              <IndianRupee className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Revenue</p>
              <p className="text-2xl font-bold text-foreground">₹{totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Orders</p>
              <p className="text-2xl font-bold text-foreground">{pendingOrders}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">Order Status</h2>
            <p className="text-sm text-muted-foreground">Distribution of orders by current status</p>
          </div>
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <BarChart data={orderStatusData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={8}>
                <LabelList dataKey="count" position="top" />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">Revenue Trend</h2>
            <p className="text-sm text-muted-foreground">Latest order totals for this restaurant</p>
          </div>
          <ChartContainer config={chartConfig} className="h-[280px] w-full">
            <LineChart data={revenueTrendData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">Menu Mix</h2>
            <p className="text-sm text-muted-foreground">Veg versus non-veg item distribution</p>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={menuMixData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={3}>
                {menuMixData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </div>
      </div>

      <div>
        <h2 className="mb-4 font-display text-xl font-bold text-foreground">Order Analytics ({restaurantOrders.length})</h2>
        <div className="space-y-3">
          {restaurantOrders.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No orders for this restaurant yet</p>
          ) : (
            restaurantOrders.map(order => (
              <div key={order.id} className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-semibold text-foreground">{order.id}</span>
                  <Badge>{order.status.replace(/_/g, ' ')}</Badge>
                </div>
                <div className="mb-3 text-sm text-muted-foreground">
                  {order.items.map(i => `${i.menuItem.name} ×${i.quantity}`).join(', ')}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">₹{order.total.toFixed(2)}</span>
                  {order.status === 'delivered' && (
                    <Badge className="bg-success/10 text-success">Completed</Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerAnalytics;
