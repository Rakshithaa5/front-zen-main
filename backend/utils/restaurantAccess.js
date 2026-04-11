const supabase = require('../supabase');

const DISABLED_STATUSES = new Set(['disabled', 'inactive', 'blocked', 'suspended']);

const evaluateRestaurantOperationalState = (restaurant) => {
  const isVerified = restaurant?.is_verified !== false;
  const isActive = restaurant?.is_active !== false;
  const normalizedStatus = String(restaurant?.status || '').trim().toLowerCase();
  const disabledByStatus = normalizedStatus ? DISABLED_STATUSES.has(normalizedStatus) : false;

  return {
    isOperational: isVerified && isActive && !disabledByStatus,
    isVerified,
    isActive,
    disabledByStatus,
  };
};

const getRestaurantById = async (restaurantId) => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', restaurantId)
    .single();

  if (error || !data) {
    return { restaurant: null, error: error || new Error('Restaurant not found') };
  }

  return { restaurant: data, error: null };
};

module.exports = {
  evaluateRestaurantOperationalState,
  getRestaurantById,
};