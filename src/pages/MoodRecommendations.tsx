import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { useCart } from '@/context/CartContext';
import { MOODS } from '@/data/types';
import { Plus, Minus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const MoodRecommendations = () => {
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const { restaurants, menuItems } = useApp();
  const { addItem, items: cartItems, updateQuantity } = useCart();

  // Filter restaurants by mood categories
  const matchingRestaurants = restaurants.filter(r => 
    r.cuisine.some(c => selectedMood.categories.includes(c))
  );

  // Get menu items from matching restaurants
  const recommendedItems = menuItems.filter(item => 
    matchingRestaurants.some(r => r.id === item.restaurantId)
  ).slice(0, 12);

  const getCartQuantity = (itemId: string) => 
    cartItems.find(c => c.menuItem.id === itemId)?.quantity || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/5 py-8">
      <div className="container max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Mood-Based Recommendations</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-3">
            How are you feeling today?
          </h1>
          <p className="text-muted-foreground">
            Select your mood and we'll recommend the perfect dishes for you
          </p>
        </div>

        {/* Mood Selector */}
        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {MOODS.map(mood => (
            <button
              key={mood.label}
              onClick={() => setSelectedMood(mood)}
              className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-center transition-all ${
                selectedMood.label === mood.label
                  ? 'border-primary bg-primary/5 shadow-lg scale-105'
                  : 'border-border hover:border-primary/50 hover:bg-accent/5'
              }`}
            >
              <div className="text-5xl mb-3 transition-transform group-hover:scale-110">
                {mood.emoji}
              </div>
              <p className={`font-semibold transition-colors ${
                selectedMood.label === mood.label ? 'text-primary' : 'text-foreground'
              }`}>
                {mood.label}
              </p>
              {selectedMood.label === mood.label && (
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 to-transparent" />
              )}
            </button>
          ))}
        </div>

        {/* Selected Mood Info */}
        <div className={`mb-8 rounded-xl border p-6 ${selectedMood.color}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{selectedMood.emoji}</span>
            <h2 className="text-2xl font-bold">
              Perfect for when you're feeling {selectedMood.label.toLowerCase()}
            </h2>
          </div>
          <p className="text-sm opacity-80">
            We recommend: {selectedMood.categories.join(', ')}
          </p>
        </div>

        {/* Recommended Dishes */}
        <div>
          <h3 className="mb-6 text-2xl font-bold text-foreground">
            Recommended Dishes ({recommendedItems.length})
          </h3>

          {recommendedItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">
                No dishes found for this mood. Try another mood!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedItems.map(item => {
                const restaurant = restaurants.find(r => r.id === item.restaurantId);
                const qty = getCartQuantity(item.id);

                return (
                  <div
                    key={item.id}
                    className="group rounded-xl border bg-card overflow-hidden shadow-sm transition-all hover:shadow-lg"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                      />
                      {item.isVeg && (
                        <Badge className="absolute top-3 right-3 bg-success text-success-foreground">
                          Veg
                        </Badge>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <h4 className="font-semibold text-foreground line-clamp-1">
                          {item.name}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {restaurant?.name}
                        </p>
                      </div>

                      <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ₹{item.price.toFixed(2)}
                        </span>

                        {qty === 0 ? (
                          <Button
                            size="sm"
                            onClick={() => addItem(item, item.restaurantId, restaurant?.name || '')}
                            className="gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <Plus className="h-4 w-4" /> Add
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2 rounded-lg border bg-muted px-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, qty - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-6 text-center font-semibold">{qty}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => addItem(item, item.restaurantId, restaurant?.name || '')}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodRecommendations;