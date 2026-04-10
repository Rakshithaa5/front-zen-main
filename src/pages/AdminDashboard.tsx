import { ChangeEvent, useMemo, useRef, useState } from 'react';
import { Trash2, Plus, TrendingUp, ShoppingBag, Store, IndianRupee, Shield, FileCheck2, CheckCircle2, XCircle, Loader2, FileBadge2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/context/AppContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Restaurant } from '@/data/types';
import { toast } from 'sonner';
import apiService from '@/services/api';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const AdminDashboard = () => {
  const { restaurants, deleteRestaurant, addRestaurant, updateRestaurant } = useApp();
  const { orders } = useCart();
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({
    name: '',
    cuisine: '',
    location: '',
    description: '',
    image: '',
    imageGallery: '',
    verificationDoc: '',
  });
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [savingRestaurant, setSavingRestaurant] = useState(false);
  const [isUploadingCoverImage, setIsUploadingCoverImage] = useState(false);
  const [isUploadingGalleryImage, setIsUploadingGalleryImage] = useState(false);
  const [isUploadingVerificationDoc, setIsUploadingVerificationDoc] = useState(false);
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);
  const galleryImageInputRef = useRef<HTMLInputElement | null>(null);
  const verificationDocInputRef = useRef<HTMLInputElement | null>(null);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);
  const [editRestaurant, setEditRestaurant] = useState({
    name: '',
    cuisine: '',
    location: '',
    description: '',
    image: '',
    imageGallery: '',
    verificationDoc: '',
  });
  const [savingEditRestaurant, setSavingEditRestaurant] = useState(false);
  const [isUploadingEditCoverImage, setIsUploadingEditCoverImage] = useState(false);
  const [isUploadingEditGalleryImage, setIsUploadingEditGalleryImage] = useState(false);
  const [isUploadingEditVerificationDoc, setIsUploadingEditVerificationDoc] = useState(false);
  const editCoverImageInputRef = useRef<HTMLInputElement | null>(null);
  const editGalleryImageInputRef = useRef<HTMLInputElement | null>(null);
  const editVerificationDocInputRef = useRef<HTMLInputElement | null>(null);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const filteredOrders = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);
  const verifiedCount = restaurants.filter(r => r.isVerified).length;
  const pendingVerificationCount = restaurants.length - verifiedCount;

  const orderStatusData = useMemo(() => {
    const statuses = ['placed', 'accepted', 'preparing', 'out_for_delivery', 'delivered'] as const;
    return statuses.map((status) => ({
      status: status.replace(/_/g, ' '),
      count: orders.filter(order => order.status === status).length,
    }));
  }, [orders]);

  const revenueTrendData = useMemo(() => {
    const grouped = new Map<string, number>();
    const sortedOrders = [...orders].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    sortedOrders.forEach(order => {
      const dateLabel = new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      grouped.set(dateLabel, (grouped.get(dateLabel) || 0) + Number(order.total));
    });

    return Array.from(grouped.entries()).map(([date, revenue]) => ({ date, revenue: Number(revenue.toFixed(2)) }));
  }, [orders]);

  const topRestaurantsData = useMemo(() => {
    const byRestaurant = new Map<string, number>();

    orders.forEach(order => {
      const key = order.restaurantName || 'Unknown';
      byRestaurant.set(key, (byRestaurant.get(key) || 0) + Number(order.total));
    });

    return Array.from(byRestaurant.entries())
      .map(([restaurant, revenue]) => ({ restaurant, revenue: Number(revenue.toFixed(2)) }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6);
  }, [orders]);

  const verificationData = useMemo(() => {
    return [
      { name: 'Verified', value: verifiedCount, fill: 'var(--color-verified)' },
      { name: 'Pending', value: pendingVerificationCount, fill: 'var(--color-pending)' },
    ].filter(entry => entry.value > 0);
  }, [pendingVerificationCount, verifiedCount]);

  const chartConfig = {
    orders: { label: 'Orders', color: 'hsl(var(--primary))' },
    revenue: { label: 'Revenue', color: 'hsl(var(--warning))' },
    verified: { label: 'Verified', color: 'hsl(var(--success))' },
    pending: { label: 'Pending', color: 'hsl(var(--destructive))' },
  };

  const parseList = (value: string) => value.split(',').map(v => v.trim()).filter(Boolean);

  const handleCoverImageFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCoverImage(true);
      const { assetUrl } = await apiService.uploadRestaurantAsset(file, 'image');
      setNewRestaurant(prev => ({ ...prev, image: assetUrl }));
      toast.success('Cover image uploaded');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cover image upload failed');
    } finally {
      setIsUploadingCoverImage(false);
      event.target.value = '';
    }
  };

  const handleGalleryImageFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingGalleryImage(true);
      const { assetUrl } = await apiService.uploadRestaurantAsset(file, 'image');
      setNewRestaurant(prev => {
        const list = parseList(prev.imageGallery);
        return { ...prev, imageGallery: [...list, assetUrl].join(', ') };
      });
      toast.success('Gallery image attached');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gallery image upload failed');
    } finally {
      setIsUploadingGalleryImage(false);
      event.target.value = '';
    }
  };

  const handleVerificationDocFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingVerificationDoc(true);
      const { assetUrl } = await apiService.uploadRestaurantAsset(file, 'document');
      setNewRestaurant(prev => ({ ...prev, verificationDoc: assetUrl }));
      toast.success('Verification document attached');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Document upload failed');
    } finally {
      setIsUploadingVerificationDoc(false);
      event.target.value = '';
    }
  };

  const openEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setEditRestaurant({
      name: restaurant.name,
      cuisine: restaurant.cuisine.join(', '),
      location: restaurant.location || restaurant.address,
      description: restaurant.description,
      image: restaurant.image,
      imageGallery: (restaurant.imageGallery || []).join(', '),
      verificationDoc: restaurant.verificationDoc || '',
    });
  };

  const handleEditCoverImageFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingEditCoverImage(true);
      const { assetUrl } = await apiService.uploadRestaurantAsset(file, 'image');
      setEditRestaurant(prev => ({ ...prev, image: assetUrl }));
      toast.success('Cover image uploaded');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Cover image upload failed');
    } finally {
      setIsUploadingEditCoverImage(false);
      event.target.value = '';
    }
  };

  const handleEditGalleryImageFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingEditGalleryImage(true);
      const { assetUrl } = await apiService.uploadRestaurantAsset(file, 'image');
      setEditRestaurant(prev => {
        const list = parseList(prev.imageGallery);
        return { ...prev, imageGallery: [...list, assetUrl].join(', ') };
      });
      toast.success('Gallery image attached');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gallery image upload failed');
    } finally {
      setIsUploadingEditGalleryImage(false);
      event.target.value = '';
    }
  };

  const handleEditVerificationDocFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingEditVerificationDoc(true);
      const { assetUrl } = await apiService.uploadRestaurantAsset(file, 'document');
      setEditRestaurant(prev => ({ ...prev, verificationDoc: assetUrl }));
      toast.success('Verification document attached');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Document upload failed');
    } finally {
      setIsUploadingEditVerificationDoc(false);
      event.target.value = '';
    }
  };

  const handleSaveEditedRestaurant = async () => {
    if (!editingRestaurant) return;

    if (!editRestaurant.name.trim() || !editRestaurant.cuisine.trim() || !editRestaurant.location.trim()) {
      toast.error('Name, cuisine and location are required');
      return;
    }

    setSavingEditRestaurant(true);
    await updateRestaurant({
      ...editingRestaurant,
      name: editRestaurant.name.trim(),
      cuisine: parseList(editRestaurant.cuisine),
      image: editRestaurant.image.trim() || editingRestaurant.image,
      imageGallery: parseList(editRestaurant.imageGallery),
      address: editRestaurant.location.trim(),
      location: editRestaurant.location.trim(),
      description: editRestaurant.description.trim() || `Welcome to ${editRestaurant.name.trim()}`,
      verificationDoc: editRestaurant.verificationDoc.trim(),
    });
    setSavingEditRestaurant(false);
    setEditingRestaurant(null);
  };

  const handleAddRestaurant = async () => {
    if (!newRestaurant.name.trim() || !newRestaurant.cuisine.trim() || !newRestaurant.location.trim()) {
      toast.error('Name, cuisine and location are required');
      return;
    }

    setSavingRestaurant(true);
    const restaurant: Restaurant = {
      id: `r-${Date.now()}`,
      name: newRestaurant.name.trim(),
      cuisine: parseList(newRestaurant.cuisine),
      rating: 4.0,
      priceRange: 2,
      image: newRestaurant.image.trim() || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600',
      imageGallery: parseList(newRestaurant.imageGallery),
      deliveryTime: '25-35 min',
      isVeg: false,
      address: newRestaurant.location.trim(),
      location: newRestaurant.location.trim(),
      description: newRestaurant.description.trim() || `Welcome to ${newRestaurant.name.trim()}`,
      verificationDoc: newRestaurant.verificationDoc.trim(),
      isVerified: false,
      verifiedAt: null,
    };

    await addRestaurant(restaurant);
    setNewRestaurant({
      name: '',
      cuisine: '',
      location: '',
      description: '',
      image: '',
      imageGallery: '',
      verificationDoc: '',
    });
    setShowAdd(false);
    setSavingRestaurant(false);
  };

  const toggleVerification = async (restaurant: Restaurant) => {
    await updateRestaurant({
      ...restaurant,
      isVerified: !restaurant.isVerified,
      verifiedAt: restaurant.isVerified ? null : new Date().toISOString(),
    });
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
        </div>
        <p className="text-muted-foreground">Manage restaurants, view orders & analytics</p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Store className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Restaurants</p>
              <p className="text-2xl font-bold text-foreground">{restaurants.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <ShoppingBag className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Orders</p>
              <p className="text-2xl font-bold text-foreground">{orders.length}</p>
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
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Order</p>
              <p className="text-2xl font-bold text-foreground">₹{orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0.00'}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
              <FileCheck2 className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold text-foreground">{verifiedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">Orders by Status</h2>
            <p className="text-sm text-muted-foreground">Current order pipeline across the platform</p>
          </div>
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart data={orderStatusData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="status" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="count" fill="var(--color-orders)" radius={8}>
                <LabelList dataKey="count" position="top" />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">Revenue Trend</h2>
            <p className="text-sm text-muted-foreground">Daily revenue progression for all restaurants</p>
          </div>
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <LineChart data={revenueTrendData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Line type="monotone" dataKey="revenue" stroke="var(--color-revenue)" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ChartContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">Top Restaurants</h2>
            <p className="text-sm text-muted-foreground">Highest grossing restaurants by revenue</p>
          </div>
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart data={topRestaurantsData} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid horizontal={false} strokeDasharray="3 3" />
              <XAxis type="number" tickLine={false} axisLine={false} />
              <YAxis dataKey="restaurant" type="category" tickLine={false} axisLine={false} width={110} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={8} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="font-display text-xl font-bold text-foreground">Verification Queue</h2>
            <p className="text-sm text-muted-foreground">Verified vs pending restaurants</p>
          </div>
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie data={verificationData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={4}>
                {verificationData.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent />} />
            </PieChart>
          </ChartContainer>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">Restaurants</h2>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Add Restaurant
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Restaurant</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input placeholder="Restaurant Name" value={newRestaurant.name} onChange={e => setNewRestaurant(prev => ({ ...prev, name: e.target.value }))} />
                <Input placeholder="Cuisines (comma-separated)" value={newRestaurant.cuisine} onChange={e => setNewRestaurant(prev => ({ ...prev, cuisine: e.target.value }))} />
                <Input placeholder="Location" value={newRestaurant.location} onChange={e => setNewRestaurant(prev => ({ ...prev, location: e.target.value }))} />
                <Textarea placeholder="Description" value={newRestaurant.description} onChange={e => setNewRestaurant(prev => ({ ...prev, description: e.target.value }))} />
                <Input placeholder="Cover Image URL" value={newRestaurant.image} onChange={e => setNewRestaurant(prev => ({ ...prev, image: e.target.value }))} />
                <input
                  ref={coverImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => void handleCoverImageFileChange(e)}
                />
                <Button type="button" variant="outline" onClick={() => coverImageInputRef.current?.click()} disabled={isUploadingCoverImage}>
                  {isUploadingCoverImage ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Attach Cover Image File
                </Button>
                <Input placeholder="Restaurant image URLs (comma-separated)" value={newRestaurant.imageGallery} onChange={e => setNewRestaurant(prev => ({ ...prev, imageGallery: e.target.value }))} />
                <input
                  ref={galleryImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => void handleGalleryImageFileChange(e)}
                />
                <Button type="button" variant="outline" onClick={() => galleryImageInputRef.current?.click()} disabled={isUploadingGalleryImage}>
                  {isUploadingGalleryImage ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Attach Gallery Image File
                </Button>
                <Input placeholder="Verification document URL" value={newRestaurant.verificationDoc} onChange={e => setNewRestaurant(prev => ({ ...prev, verificationDoc: e.target.value }))} />
                <input
                  ref={verificationDocInputRef}
                  type="file"
                  accept="application/pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => void handleVerificationDocFileChange(e)}
                />
                <Button type="button" variant="outline" onClick={() => verificationDocInputRef.current?.click()} disabled={isUploadingVerificationDoc}>
                  {isUploadingVerificationDoc ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Attach Verification Document File
                </Button>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => void handleAddRestaurant()} disabled={savingRestaurant}>
                  Add Restaurant
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-3">
          {restaurants.map(r => (
            <div key={r.id} className="flex items-start gap-4 rounded-xl border bg-card p-4 shadow-sm">
              <img src={r.image} alt={r.name} className="h-14 w-14 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-foreground">{r.name}</h3>
                  {r.isVerified ? (
                    <Badge className="gap-1 bg-success/10 text-success"><CheckCircle2 className="h-3.5 w-3.5" /> Verified</Badge>
                  ) : (
                    <Badge className="gap-1 bg-warning/10 text-warning"><XCircle className="h-3.5 w-3.5" /> Pending</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{r.cuisine.join(' • ')}</p>
                <p className="text-xs text-muted-foreground">Location: {r.location || r.address}</p>
                <p className="line-clamp-2 text-xs text-muted-foreground">{r.description}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {r.verificationDoc ? (
                    <>
                      <Badge variant="outline" className="gap-1 border-success/30 text-success">
                        <FileBadge2 className="h-3.5 w-3.5" /> Approved License
                      </Badge>
                      <a href={r.verificationDoc} target="_blank" rel="noreferrer" className="text-xs font-medium text-primary hover:underline">
                        Open License PDF
                      </a>
                    </>
                  ) : (
                    <Badge variant="outline" className="gap-1 border-warning/30 text-warning">
                      <XCircle className="h-3.5 w-3.5" /> License Missing
                    </Badge>
                  )}
                </div>
              </div>
              <Badge className="bg-success/10 text-success">{r.rating} ★</Badge>
              <Button size="sm" variant="outline" className="gap-1" onClick={() => void toggleVerification(r)}>
                <FileCheck2 className="h-4 w-4" /> {r.isVerified ? 'Unverify' : 'Verify'}
              </Button>
              <Button size="icon" variant="ghost" onClick={() => openEditRestaurant(r)} title="Edit restaurant">
                <Pencil className="h-4 w-4 text-primary" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => void deleteRestaurant(r.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        <Dialog open={!!editingRestaurant} onOpenChange={(open) => { if (!open) setEditingRestaurant(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Restaurant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input placeholder="Restaurant Name" value={editRestaurant.name} onChange={e => setEditRestaurant(prev => ({ ...prev, name: e.target.value }))} />
              <Input placeholder="Cuisines (comma-separated)" value={editRestaurant.cuisine} onChange={e => setEditRestaurant(prev => ({ ...prev, cuisine: e.target.value }))} />
              <Input placeholder="Location" value={editRestaurant.location} onChange={e => setEditRestaurant(prev => ({ ...prev, location: e.target.value }))} />
              <Textarea placeholder="Description" value={editRestaurant.description} onChange={e => setEditRestaurant(prev => ({ ...prev, description: e.target.value }))} />
              <Input placeholder="Cover Image URL" value={editRestaurant.image} onChange={e => setEditRestaurant(prev => ({ ...prev, image: e.target.value }))} />
              <input
                ref={editCoverImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void handleEditCoverImageFileChange(e)}
              />
              <Button type="button" variant="outline" onClick={() => editCoverImageInputRef.current?.click()} disabled={isUploadingEditCoverImage}>
                {isUploadingEditCoverImage ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Replace Cover Image File
              </Button>
              <Input placeholder="Restaurant image URLs (comma-separated)" value={editRestaurant.imageGallery} onChange={e => setEditRestaurant(prev => ({ ...prev, imageGallery: e.target.value }))} />
              <input
                ref={editGalleryImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void handleEditGalleryImageFileChange(e)}
              />
              <Button type="button" variant="outline" onClick={() => editGalleryImageInputRef.current?.click()} disabled={isUploadingEditGalleryImage}>
                {isUploadingEditGalleryImage ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Attach Gallery Image File
              </Button>
              <Input placeholder="Verification document URL" value={editRestaurant.verificationDoc} onChange={e => setEditRestaurant(prev => ({ ...prev, verificationDoc: e.target.value }))} />
              <input
                ref={editVerificationDocInputRef}
                type="file"
                accept="application/pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => void handleEditVerificationDocFileChange(e)}
              />
              <Button type="button" variant="outline" onClick={() => editVerificationDocInputRef.current?.click()} disabled={isUploadingEditVerificationDoc}>
                {isUploadingEditVerificationDoc ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Replace Verification Document File
              </Button>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => void handleSaveEditedRestaurant()} disabled={savingEditRestaurant}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <div className="mb-4 flex items-center gap-3">
          <h2 className="font-display text-xl font-bold text-foreground">All Orders</h2>
          <div className="flex gap-2">
            {['all', 'placed', 'accepted', 'preparing', 'out_for_delivery', 'delivered'].map(s => (
              <Badge key={s} variant={filterStatus === s ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setFilterStatus(s)}>
                {s === 'all' ? 'All' : s.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        </div>
        {filteredOrders.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">No orders yet</p>
        ) : (
          <div className="space-y-3">
            {filteredOrders.map(order => (
              <div key={order.id} className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-foreground">{order.id}</span>
                    <span className="ml-2 text-sm text-muted-foreground">{order.restaurantName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge>{order.status.replace(/_/g, ' ')}</Badge>
                    <span className="font-semibold text-foreground">₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
