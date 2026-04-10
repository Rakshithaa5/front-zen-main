const API_BASE = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  }

  // Auth
  async register(userData) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: userData,
    });
    this.setToken(response.token);
    return response;
  }

  async login(credentials) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: credentials,
    });
    this.setToken(response.token);
    return response;
  }

  logout() {
    this.clearToken();
  }

  // Restaurants
  async getRestaurants(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/restaurants?${params}`);
  }

  async getRestaurant(id) {
    return this.request(`/restaurants/${id}`);
  }

  async createRestaurant(restaurantData) {
    return this.request('/restaurants', {
      method: 'POST',
      body: restaurantData,
    });
  }

  async updateRestaurant(id, restaurantData) {
    return this.request(`/restaurants/${id}`, {
      method: 'PUT',
      body: restaurantData,
    });
  }

  async deleteRestaurant(id) {
    return this.request(`/restaurants/${id}`, {
      method: 'DELETE',
    });
  }

  async getMenu(restaurantId, category) {
    const params = category ? `?category=${category}` : '';
    return this.request(`/restaurants/${restaurantId}/menu${params}`);
  }

  async createMenuItem(itemData) {
    return this.request('/menu', {
      method: 'POST',
      body: itemData,
    });
  }

  async updateMenuItem(id, itemData) {
    return this.request(`/menu/${id}`, {
      method: 'PUT',
      body: itemData,
    });
  }

  async updateMenuAvailability(id, isAvailable) {
    return this.request(`/menu/${id}/availability`, {
      method: 'PATCH',
      body: { isAvailable },
    });
  }

  async deleteMenuItem(id) {
    return this.request(`/menu/${id}`, {
      method: 'DELETE',
    });
  }

  async uploadMenuImage(file) {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE}/menu/upload-image`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Image upload failed');
    }

    return data;
  }

  async uploadRestaurantAsset(file, assetType = 'image') {
    const formData = new FormData();
    formData.append('asset', file);

    const response = await fetch(`${API_BASE}/restaurants/upload-asset?assetType=${encodeURIComponent(assetType)}`, {
      method: 'POST',
      headers: {
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Asset upload failed');
    }

    return data;
  }

  // Orders
  async placeOrder(orderData) {
    return this.request('/orders', {
      method: 'POST',
      body: orderData,
    });
  }

  async getOrders() {
    return this.request('/orders');
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PATCH',
      body: { status },
    });
  }
}

export default new ApiService();