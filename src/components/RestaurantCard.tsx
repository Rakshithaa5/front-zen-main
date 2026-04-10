import { Link } from 'react-router-dom';
import { Star, Clock, Leaf } from 'lucide-react';
import { Restaurant } from '@/data/types';
import { Badge } from '@/components/ui/badge';

const priceLabel = (p: number) => '₹'.repeat(p);

const RestaurantCard = ({ restaurant }: { restaurant: Restaurant }) => {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="group">
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg">
        <div className="relative h-48 overflow-hidden">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {restaurant.isVeg && (
            <Badge className="absolute left-3 top-3 gap-1 bg-success text-success-foreground">
              <Leaf className="h-3 w-3" /> Pure Veg
            </Badge>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <h3 className="font-display text-lg font-semibold text-foreground">{restaurant.name}</h3>
            <span className="flex items-center gap-1 rounded-md bg-success/10 px-2 py-0.5 text-sm font-semibold text-success">
              <Star className="h-3.5 w-3.5 fill-current" /> {restaurant.rating}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{restaurant.cuisine.join(' • ')}</p>
          <div className="mt-3 flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {restaurant.deliveryTime}</span>
            <span className="font-medium">{priceLabel(restaurant.priceRange)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
