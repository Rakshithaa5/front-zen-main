import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

interface CartPreviewProps {
  open: boolean;
  onClose: () => void;
}

const CartPreview = ({ open, onClose }: CartPreviewProps) => {
  const { items, getTotal, updateQuantity, removeItem } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Slide-in panel */}
      <div
        ref={panelRef}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-card shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Your Cart</h2>
            {items.length > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted transition-colors">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <ShoppingCart className="h-14 w-14 text-muted-foreground/30" />
              <p className="font-medium text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground/70">Add items from a restaurant to get started</p>
              <Button
                size="sm"
                className="mt-2 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={onClose}
                asChild
              >
                <Link to="/restaurants">Browse Restaurants</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Restaurant name */}
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {items[0].restaurantName}
              </p>

              {items.map(item => (
                <div key={item.menuItem.id} className="flex items-center gap-3 rounded-xl border bg-background p-3">
                  <img
                    src={item.menuItem.image}
                    alt={item.menuItem.name}
                    className="h-14 w-14 flex-shrink-0 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{item.menuItem.name}</p>
                    <p className="text-sm font-bold text-primary">₹{(item.menuItem.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeItem(item.menuItem.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <div className="flex items-center gap-1 rounded-lg border bg-muted px-1">
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded hover:bg-background transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded hover:bg-background transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="text-lg font-bold text-foreground">₹{getTotal().toFixed(2)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full" onClick={onClose} asChild>
                <Link to="/cart">View Cart</Link>
              </Button>
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" onClick={onClose} asChild>
                <Link to="/checkout">Checkout</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPreview;
