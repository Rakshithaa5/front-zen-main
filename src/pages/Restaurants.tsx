import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RestaurantCard from '@/components/RestaurantCard';
import { useApp } from '@/context/AppContext';

const Restaurants = () => {
  const { restaurants } = useApp();
  const allCuisines = [...new Set(restaurants.flatMap(r => r.cuisine))].sort();
  const [search, setSearch] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [vegOnly, setVegOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const toggleCuisine = (c: string) =>
    setSelectedCuisines(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);

  const filtered = useMemo(() => {
    return restaurants.filter(r => {
      if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (vegOnly && !r.isVeg) return false;
      if (selectedCuisines.length > 0 && !r.cuisine.some(c => selectedCuisines.includes(c))) return false;
      return true;
    });
  }, [search, selectedCuisines, vegOnly, restaurants]);

  return (
    <div className="container py-8">
      <h1 className="mb-6 font-display text-3xl font-bold text-foreground">All Restaurants</h1>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search restaurants..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Button variant="outline" className="gap-2" onClick={() => setShowFilters(!showFilters)}>
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
        <Button
          variant={vegOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => setVegOnly(!vegOnly)}
          className={vegOnly ? 'bg-success text-success-foreground hover:bg-success/90' : ''}
        >
          🌿 Veg Only
        </Button>
      </div>

      {showFilters && (
        <div className="mb-6 animate-fade-in rounded-xl border bg-card p-4">
          <p className="mb-2 text-sm font-semibold text-foreground">Cuisines</p>
          <div className="flex flex-wrap gap-2">
            {allCuisines.map(c => (
              <Badge key={c} variant={selectedCuisines.includes(c) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => toggleCuisine(c)}>{c}</Badge>
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">No restaurants found. Try different filters.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(r => <RestaurantCard key={r.id} restaurant={r} />)}
        </div>
      )}
    </div>
  );
};

export default Restaurants;
