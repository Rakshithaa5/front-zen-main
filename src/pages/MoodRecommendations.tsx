import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { MOODS, MenuItem, Restaurant } from '@/data/types';
import { Plus, Minus, Sparkles, Leaf, Beef } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const FALLBACK_FOOD_IMAGE = 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800';

type MoodRecommendation = {
  restaurant: Restaurant;
  item: MenuItem;
  score: number;
};

const MoodRecommendations = () => {
  const [searchParams] = useSearchParams();
  const [selectedMood, setSelectedMood] = useState(MOODS[0]);
  const { restaurants, fetchMenuItems } = useApp();
  const { addItem, items: cartItems, updateQuantity } = useCart();
  const { user } = useAuth();
  const canOrder = user?.role === 'customer';
  const [recommendedItems, setRecommendedItems] = useState<MoodRecommendation[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    const moodLabel = searchParams.get('mood');
    if (!moodLabel) return;

    const matchedMood = MOODS.find(mood => mood.label.toLowerCase() === moodLabel.toLowerCase());
    if (matchedMood) {
      setSelectedMood(matchedMood);
    }
  }, [searchParams]);

  useEffect(() => {
    let isActive = true;

    const loadRecommendedItems = async () => {
      if (restaurants.length === 0) {
        if (isActive) {
          setRecommendedItems([]);
        }
        return;
      }

      setLoadingItems(true);
      try {
        const itemsByRestaurant = await Promise.all(
          restaurants.map(async (restaurant) => {
            const items = await fetchMenuItems(restaurant.id, false);
            return { restaurant, items };
          })
        );

        const moodTerms = selectedMood.categories.map(term => term.toLowerCase());

        const scoredByRestaurant = itemsByRestaurant
          .map(({ restaurant, items }) => {
            return items
              .filter(item => item.isAvailable)
              .map((item) => {
                const text = `${item.name} ${item.category} ${item.description}`.toLowerCase();
                const keywordScore = moodTerms.reduce((sum, term) => sum + (text.includes(term) ? 3 : 0), 0);
                const cuisineBonus = restaurant.cuisine.some(c => moodTerms.some(term => c.toLowerCase().includes(term))) ? 1 : 0;

                return {
                  restaurant,
                  item,
                  score: keywordScore + cuisineBonus,
                };
              })
              .filter(entry => entry.score > 0)
              .sort((a, b) => b.score - a.score || a.item.name.localeCompare(b.item.name));
          })
          .filter(entries => entries.length > 0);

        const maxResults = 18;
        const maxPerRestaurant = 3;
        const perRestaurantCount = new Map<string, number>();
        const usedItems = new Set<string>();
        const diversified: MoodRecommendation[] = [];

        while (diversified.length < maxResults) {
          let addedInRound = false;

          for (const restaurantEntries of scoredByRestaurant) {
            const candidate = restaurantEntries.find((entry) => {
              const used = usedItems.has(entry.item.id);
              const usedCount = perRestaurantCount.get(entry.restaurant.id) || 0;
              return !used && usedCount < maxPerRestaurant;
            });

            if (!candidate) continue;

            diversified.push(candidate);
            usedItems.add(candidate.item.id);
            perRestaurantCount.set(candidate.restaurant.id, (perRestaurantCount.get(candidate.restaurant.id) || 0) + 1);
            addedInRound = true;

            if (diversified.length >= maxResults) {
              break;
            }
          }

          if (!addedInRound) {
            break;
          }
        }

        if (isActive) {
          setRecommendedItems(diversified);
        }
      } finally {
        if (isActive) {
          setLoadingItems(false);
        }
      }
    };

    void loadRecommendedItems();

    return () => {
      isActive = false;
    };
  }, [fetchMenuItems, restaurants, selectedMood.categories]);

  const getCartQuantity = (itemId: string) =>
    cartItems.find(c => c.menuItem.id === itemId)?.quantity || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/5 py-8">
      <div className="container max-w-6xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Mood-Based Recommendations</span>
          </div>
          <h1 className="mb-3 font-display text-4xl font-bold text-foreground">
            How are you feeling today?
          </h1>
          <p className="text-muted-foreground">
            Select your mood and we&apos;ll recommend the perfect dishes for you
          </p>
        </div>

        <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {MOODS.map(mood => (
            <button
              key={mood.label}
              onClick={() => setSelectedMood(mood)}
              className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-center transition-all ${
                selectedMood.label === mood.label
                  ? 'scale-105 border-primary bg-primary/5 shadow-lg'
                  : 'border-border hover:border-primary/50 hover:bg-accent/5'
              }`}
            >
              <div className="mb-3 text-5xl transition-transform group-hover:scale-110">
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

        <div className={`mb-8 rounded-xl border p-6 ${selectedMood.color}`}>
          <div className="mb-2 flex items-center gap-3">
            <span className="text-3xl">{selectedMood.emoji}</span>
            <h2 className="text-2xl font-bold">
              Perfect for when you&apos;re feeling {selectedMood.label.toLowerCase()}
            </h2>
          </div>
          <p className="text-sm opacity-80">
            We recommend: {selectedMood.categories.join(', ')}
          </p>
        </div>

        <div>
          <h3 className="mb-6 text-2xl font-bold text-foreground">
            Recommended Dishes ({recommendedItems.length})
          </h3>
          {recommendedItems.length > 0 && (
            <p className="mb-6 text-sm text-muted-foreground">
              Picked from {new Set(recommendedItems.map(entry => entry.restaurant.id)).size} restaurants for better variety
            </p>
          )}

          {loadingItems ? (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">Loading mood-matched menu items...</p>
            </div>
          ) : recommendedItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-muted-foreground">
                No dishes found for this mood. Try another mood!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {recommendedItems.map(({ restaurant, item }) => {
                const qty = getCartQuantity(item.id);

                return (
                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform group-hover:scale-110"
                        onError={(event) => {
                          const target = event.currentTarget;
                          if (target.src !== FALLBACK_FOOD_IMAGE) {
                            target.src = FALLBACK_FOOD_IMAGE;
                          }
                        }}
                      />
                      <Badge
                        className={`absolute right-3 top-3 gap-1 ${item.isVeg ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'}`}
                      >
                        {item.isVeg ? <Leaf className="h-3 w-3" /> : <Beef className="h-3 w-3" />}
                        {item.isVeg ? 'Veg' : 'Non-Veg'}
                      </Badge>
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <h4 className="line-clamp-1 font-semibold text-foreground">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">{restaurant.name}</p>
                      </div>

                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{item.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{'\u20B9'}{item.price.toFixed(2)}</span>

                        {!canOrder ? (
                          <Badge variant="outline" className="text-xs">Customer Only</Badge>
                        ) : qty === 0 ? (
                          <Button
                            size="sm"
                            onClick={() => addItem(item, item.restaurantId, restaurant.name)}
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
                              onClick={() => addItem(item, item.restaurantId, restaurant.name)}
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
