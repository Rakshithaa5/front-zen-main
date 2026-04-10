import { ChangeEvent, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Eye, EyeOff, ChefHat, Pencil, MapPin, Loader2, Leaf, Beef, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import apiService from '@/services/api';
import { MenuItem } from '@/data/types';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const OwnerDashboard = () => {
  const { restaurants, menuItems, addMenuItem, updateMenuItem, deleteMenuItem, toggleMenuItemAvailability } = useApp();
  const { user } = useAuth();
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category: '', image: '', isVeg: false });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editItem, setEditItem] = useState({ name: '', description: '', price: '', category: '', image: '', isVeg: false });
  const [isUploadingNewImage, setIsUploadingNewImage] = useState(false);
  const [isUploadingEditImage, setIsUploadingEditImage] = useState(false);
  const newImageInputRef = useRef<HTMLInputElement | null>(null);
  const editImageInputRef = useRef<HTMLInputElement | null>(null);
  const defaultMenuImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400';

  const restaurant = restaurants.find(r => r.id === user?.restaurantId);
  const items = menuItems.filter(m => m.restaurantId === restaurant?.id);

  const handleAddItem = async () => {
    if (!newItem.name.trim() || !newItem.price || !restaurant) return;
    const item: MenuItem = {
      id: `mi-${Date.now()}`,
      restaurantId: restaurant.id,
      name: newItem.name.trim(),
      description: newItem.description.trim(),
      price: parseFloat(newItem.price),
      category: newItem.category.trim() || 'General',
      image: newItem.image.trim() || defaultMenuImage,
      isVeg: newItem.isVeg,
      isAvailable: true,
    };
    await addMenuItem(item);
    setNewItem({ name: '', description: '', price: '', category: '', image: '', isVeg: false });
    setShowAdd(false);
  };

  const startEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setEditItem({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
      image: item.image,
      isVeg: item.isVeg,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingItem || !editItem.name.trim() || !editItem.price) return;

    await updateMenuItem({
      ...editingItem,
      name: editItem.name.trim(),
      description: editItem.description.trim(),
      price: parseFloat(editItem.price),
      category: editItem.category.trim() || 'General',
      image: editItem.image.trim() || defaultMenuImage,
      isVeg: editItem.isVeg,
    });

    setEditingItem(null);
  };

  const uploadImageFile = async (file: File) => {
    const { imageUrl } = await apiService.uploadMenuImage(file);
    return imageUrl;
  };

  const handleNewImageFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingNewImage(true);
      const imageUrl = await uploadImageFile(file);
      setNewItem(prev => ({ ...prev, image: imageUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploadingNewImage(false);
      event.target.value = '';
    }
  };

  const openNewImagePicker = () => {
    newImageInputRef.current?.click();
  };

  const handleEditImageFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingEditImage(true);
      const imageUrl = await uploadImageFile(file);
      setEditItem(prev => ({ ...prev, image: imageUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload image');
    } finally {
      setIsUploadingEditImage(false);
      event.target.value = '';
    }
  };

  const openEditImagePicker = () => {
    editImageInputRef.current?.click();
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
              <ChefHat className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">{restaurant.name}</h1>
              <p className="text-sm text-muted-foreground">Owner Home - {user?.name}</p>
            </div>
          </div>
          <p className="text-muted-foreground">Restaurant details, images, and menu CRUD</p>
        </div>
        <Link to="/owner/dashboard">
          <Button className="gap-2" variant="outline">
            <BarChart3 className="h-4 w-4" /> Go to Dashboard
          </Button>
        </Link>
      </div>

      <div className="mb-8 overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="relative h-52">
          <img src={restaurant.image} alt={restaurant.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
          <div className="absolute bottom-0 p-4">
            <h2 className="font-display text-2xl font-bold text-white">{restaurant.name}</h2>
            <p className="text-sm text-white/80">{restaurant.cuisine.join(' • ')}</p>
          </div>
        </div>
        <div className="grid gap-4 p-4 sm:grid-cols-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Type</p>
            <p className="mt-1 text-sm font-semibold text-foreground">{restaurant.cuisine[0] || 'General'}</p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Location</p>
            <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-foreground">
              <MapPin className="h-3.5 w-3.5" /> {restaurant.address}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">About</p>
            <p className="mt-1 line-clamp-2 text-sm text-foreground">{restaurant.description}</p>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-foreground">Menu Items ({items.length})</h2>
          <Dialog open={showAdd} onOpenChange={setShowAdd}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90">
                <Plus className="h-4 w-4" /> Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Menu Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input placeholder="Item Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} />
                <Input placeholder="Description" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                <Input placeholder="Price" type="number" step="0.01" value={newItem.price} onChange={e => setNewItem({ ...newItem, price: e.target.value })} />
                <Input placeholder="Category" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} />
                <Input placeholder="Image URL" value={newItem.image} onChange={e => setNewItem({ ...newItem, image: e.target.value })} />
                <input
                  ref={newImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => void handleNewImageFileChange(e)}
                  disabled={isUploadingNewImage}
                />
                <div className="space-y-2 rounded-lg border border-dashed p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">Upload image from your computer</p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                    <Button type="button" variant="outline" onClick={openNewImagePicker} disabled={isUploadingNewImage}>
                      Choose File
                    </Button>
                  </div>
                  {newItem.image && (
                    <div className="overflow-hidden rounded-lg border bg-muted/30">
                      <img src={newItem.image} alt="Selected menu item preview" className="h-40 w-full object-cover" />
                    </div>
                  )}
                  {isUploadingNewImage && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading image...
                    </div>
                  )}
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={newItem.isVeg} onCheckedChange={v => setNewItem({ ...newItem, isVeg: v })} />
                  Vegetarian
                </label>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => void handleAddItem()}>Add Item</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No menu items. Add your first item!</p>
          ) : (
            items.map(item => (
              <div key={item.id} className={`flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm ${!item.isAvailable ? 'opacity-60' : ''}`}>
                <img src={item.image} alt={item.name} className="h-12 w-12 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="truncate text-sm font-semibold text-foreground">{item.name}</h3>
                    <Badge
                      variant="outline"
                      className={`gap-1 text-[11px] leading-none ${item.isVeg ? 'border-success/40 text-success' : 'border-destructive/40 text-destructive'}`}
                    >
                      {item.isVeg ? <Leaf className="h-3 w-3" /> : <Beef className="h-3 w-3" />}
                      {item.isVeg ? 'Veg' : 'Non-Veg'}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.category} • ₹{item.price.toFixed(2)}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => void toggleMenuItemAvailability(item.id)} title={item.isAvailable ? 'Mark unavailable' : 'Mark available'}>
                  {item.isAvailable ? <Eye className="h-4 w-4 text-success" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => startEditItem(item)}>
                  <Pencil className="h-4 w-4 text-primary" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => void deleteMenuItem(item.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>

        <Dialog open={!!editingItem} onOpenChange={(open) => { if (!open) setEditingItem(null); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Menu Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input placeholder="Item Name" value={editItem.name} onChange={e => setEditItem({ ...editItem, name: e.target.value })} />
              <Input placeholder="Description" value={editItem.description} onChange={e => setEditItem({ ...editItem, description: e.target.value })} />
              <Input placeholder="Price" type="number" step="0.01" value={editItem.price} onChange={e => setEditItem({ ...editItem, price: e.target.value })} />
              <Input placeholder="Category" value={editItem.category} onChange={e => setEditItem({ ...editItem, category: e.target.value })} />
              <Input placeholder="Image URL" value={editItem.image} onChange={e => setEditItem({ ...editItem, image: e.target.value })} />
              <input
                ref={editImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void handleEditImageFileChange(e)}
                disabled={isUploadingEditImage}
              />
              <div className="space-y-2 rounded-lg border border-dashed p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">Upload replacement image</p>
                    <p className="text-xs text-muted-foreground">The chosen file will replace the current image URL</p>
                  </div>
                  <Button type="button" variant="outline" onClick={openEditImagePicker} disabled={isUploadingEditImage}>
                    Choose File
                  </Button>
                </div>
                {editItem.image && (
                  <div className="overflow-hidden rounded-lg border bg-muted/30">
                    <img src={editItem.image} alt="Selected menu item preview" className="h-40 w-full object-cover" />
                  </div>
                )}
                {isUploadingEditImage && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" /> Uploading image...
                  </div>
                )}
              </div>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={editItem.isVeg} onCheckedChange={v => setEditItem({ ...editItem, isVeg: v })} />
                Vegetarian
              </label>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => void handleSaveEdit()}>
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default OwnerDashboard;
