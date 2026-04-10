import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MoodSelector from '@/components/MoodSelector';
import RestaurantCard from '@/components/RestaurantCard';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Mood } from '@/data/types';

const Index = () => {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const { restaurants } = useApp();
  const { user, isAuthenticated } = useAuth();

  if (isAuthenticated && user?.role === 'restaurant_owner') {
    return <Navigate to="/owner" replace />;
  }

  const filteredRestaurants = selectedMood
    ? restaurants.filter(r => r.cuisine.some(c => selectedMood.categories.includes(c)))
    : restaurants;

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/5 py-20">
        <div className="container text-center">
          <h1 className="font-display text-4xl font-extrabold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Food that matches<br />your <span className="text-primary">mood</span> 🍽️
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Tell us how you&apos;re feeling and we&apos;ll find the perfect meal for you. Fast delivery, great taste, zero hassle.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/restaurants">
              <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                <Search className="h-4 w-4" /> Browse Restaurants
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container -mt-8 pb-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {restaurants.slice(0, 4).map((restaurant) => (
            <Link key={restaurant.id} to={`/restaurant/${restaurant.id}`} className="group relative overflow-hidden rounded-2xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="relative h-40">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
                  <p className="text-sm font-medium text-white/80">Featured restaurant</p>
                  <h3 className="font-display text-xl font-bold text-white">{restaurant.name}</h3>
                  <p className="mt-1 text-xs text-white/75 line-clamp-1">{restaurant.cuisine.join(' • ')}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="container">
        <MoodSelector onSelect={setSelectedMood} selected={selectedMood} />
      </div>

      <section className="container pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {selectedMood ? `Recommended for "${selectedMood.label}" mood` : 'Popular Restaurants'}
          </h2>
          <Link to="/restaurants" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {filteredRestaurants.length === 0 ? (
          <p className="py-12 text-center text-muted-foreground">No restaurants match this mood. Try another!</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredRestaurants.map(r => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
