import { describe, it, expect } from 'vitest';
import { MOODS } from '@/data/types';

// ── Cart calculations ────────────────────────────────────────────────────────

describe('Cart total calculation', () => {
  const mockItems = [
    { menuItem: { id: '1', name: 'Butter Chicken', price: 299, category: 'Indian', description: '', image: '', isVeg: false, isAvailable: true, restaurantId: '1' }, quantity: 2, restaurantId: '1', restaurantName: 'Spice Garden' },
    { menuItem: { id: '2', name: 'Garlic Naan', price: 49, category: 'Breads', description: '', image: '', isVeg: true, isAvailable: true, restaurantId: '1' }, quantity: 3, restaurantId: '1', restaurantName: 'Spice Garden' },
  ];

  it('calculates subtotal correctly', () => {
    const total = mockItems.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
    expect(total).toBe(745); // 299*2 + 49*3
  });

  it('calculates item count correctly', () => {
    const count = mockItems.reduce((sum, i) => sum + i.quantity, 0);
    expect(count).toBe(5);
  });

  it('applies percentage coupon correctly', () => {
    const subtotal = 745;
    const discount = subtotal * (10 / 100);
    expect(discount).toBe(74.5);
    expect(subtotal - discount).toBe(670.5);
  });

  it('applies flat coupon correctly', () => {
    const subtotal = 745;
    const discount = 50;
    expect(subtotal - discount).toBe(695);
  });

  it('total does not go below zero with large coupon', () => {
    const subtotal = 100;
    const discount = 200;
    expect(Math.max(subtotal - discount, 0)).toBe(0);
  });
});

// ── Mood recommendations ─────────────────────────────────────────────────────

describe('Mood-based recommendations', () => {
  it('has 6 moods defined', () => {
    expect(MOODS).toHaveLength(6);
  });

  it('every mood has emoji, label, categories and color', () => {
    MOODS.forEach(mood => {
      expect(mood.emoji).toBeTruthy();
      expect(mood.label).toBeTruthy();
      expect(mood.categories.length).toBeGreaterThan(0);
      expect(mood.color).toBeTruthy();
    });
  });

  it('Happy mood recommends Pizza, Burgers, Desserts', () => {
    const happy = MOODS.find(m => m.label === 'Happy');
    expect(happy?.categories).toContain('Pizza');
    expect(happy?.categories).toContain('Burgers');
    expect(happy?.categories).toContain('Desserts');
  });

  it('Sick mood recommends Soups and Healthy food', () => {
    const sick = MOODS.find(m => m.label === 'Sick');
    expect(sick?.categories).toContain('Soups');
    expect(sick?.categories).toContain('Healthy');
  });

  it('filters restaurants by mood categories', () => {
    const restaurants = [
      { id: '1', name: 'Pizza Paradise', cuisine: ['Pizza', 'Italian'] },
      { id: '2', name: 'Spice Garden', cuisine: ['Indian', 'Spicy'] },
    ];
    const happyMood = MOODS.find(m => m.label === 'Happy')!;
    const filtered = restaurants.filter(r =>
      r.cuisine.some(c => happyMood.categories.includes(c))
    );
    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Pizza Paradise');
  });
});

// ── Order status flow ────────────────────────────────────────────────────────

describe('Order status progression', () => {
  const statusOrder = ['placed', 'accepted', 'preparing', 'out_for_delivery', 'delivered'];

  it('has correct number of statuses', () => {
    expect(statusOrder).toHaveLength(5);
  });

  it('placed comes before delivered', () => {
    expect(statusOrder.indexOf('placed')).toBeLessThan(statusOrder.indexOf('delivered'));
  });

  it('out_for_delivery comes after preparing', () => {
    expect(statusOrder.indexOf('out_for_delivery')).toBeGreaterThan(statusOrder.indexOf('preparing'));
  });

  it('formats status label correctly', () => {
    const format = (s: string) => s.replace(/_/g, ' ');
    expect(format('out_for_delivery')).toBe('out for delivery');
    expect(format('placed')).toBe('placed');
  });
});

// ── Payment validation ───────────────────────────────────────────────────────

describe('Payment validation', () => {
  const validateUpi = (id: string) => /^[\w.-]{2,256}@[a-zA-Z]{2,64}$/.test(id.trim());

  const validateCard = (num: string) => {
    const digits = num.replace(/\s/g, '');
    if (digits.length < 13 || digits.length > 19) return false;
    let sum = 0, alt = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let n = parseInt(digits[i], 10);
      if (alt) { n *= 2; if (n > 9) n -= 9; }
      sum += n; alt = !alt;
    }
    return sum % 10 === 0;
  };

  const validatePhone = (p: string) => /^[6-9]\d{9}$/.test(p);

  it('validates correct UPI ID', () => {
    expect(validateUpi('raksh@okaxis')).toBe(true);
    expect(validateUpi('user.name@ybl')).toBe(true);
  });

  it('rejects invalid UPI ID', () => {
    expect(validateUpi('notaupiid')).toBe(false);
    expect(validateUpi('@okaxis')).toBe(false);
    expect(validateUpi('')).toBe(false);
  });

  it('validates correct card number (Luhn)', () => {
    expect(validateCard('4532015112830366')).toBe(true); // valid Visa test number
  });

  it('rejects invalid card number', () => {
    expect(validateCard('1234567890123456')).toBe(false);
    expect(validateCard('123')).toBe(false);
  });

  it('validates Indian phone numbers', () => {
    expect(validatePhone('9876543210')).toBe(true);
    expect(validatePhone('6543210987')).toBe(true);
  });

  it('rejects invalid phone numbers', () => {
    expect(validatePhone('1234567890')).toBe(false); // starts with 1
    expect(validatePhone('98765')).toBe(false);       // too short
    expect(validatePhone('abcdefghij')).toBe(false);  // not digits
  });
});

// ── Price formatting ─────────────────────────────────────────────────────────

describe('Price formatting', () => {
  it('formats price to 2 decimal places', () => {
    expect((299).toFixed(2)).toBe('299.00');
    expect((49.5).toFixed(2)).toBe('49.50');
  });

  it('calculates delivery fee and tax correctly', () => {
    const subtotal = 500;
    const deliveryFee = 49;
    const tax = subtotal * 0.05;
    const total = subtotal + deliveryFee + tax;
    expect(tax).toBe(25);
    expect(total).toBe(574);
  });
});

// ── Restaurant filtering ─────────────────────────────────────────────────────

describe('Restaurant filtering', () => {
  const restaurants = [
    { id: '1', name: 'Spice Garden',  cuisine: ['Indian', 'Spicy'],   isVeg: false, rating: 4.5, priceRange: 2 },
    { id: '2', name: 'Green Bowl',    cuisine: ['Healthy', 'Salads'], isVeg: true,  rating: 4.7, priceRange: 2 },
    { id: '3', name: 'Dragon Wok',    cuisine: ['Chinese', 'Spicy'],  isVeg: false, rating: 4.0, priceRange: 1 },
    { id: '4', name: 'Sweet Tooth',   cuisine: ['Desserts'],          isVeg: true,  rating: 4.8, priceRange: 2 },
    { id: '5', name: 'Burger Barn',   cuisine: ['Burgers'],           isVeg: false, rating: 4.3, priceRange: 1 },
  ];

  it('filters veg-only restaurants', () => {
    const veg = restaurants.filter(r => r.isVeg);
    expect(veg).toHaveLength(2);
    expect(veg.map(r => r.name)).toContain('Green Bowl');
    expect(veg.map(r => r.name)).toContain('Sweet Tooth');
  });

  it('filters by cuisine type', () => {
    const spicy = restaurants.filter(r => r.cuisine.includes('Spicy'));
    expect(spicy).toHaveLength(2);
  });

  it('filters by search term (case insensitive)', () => {
    const search = (term: string) =>
      restaurants.filter(r => r.name.toLowerCase().includes(term.toLowerCase()));
    expect(search('bowl')).toHaveLength(1);
    expect(search('BURGER')).toHaveLength(1);
    expect(search('xyz')).toHaveLength(0);
  });

  it('sorts by rating descending', () => {
    const sorted = [...restaurants].sort((a, b) => b.rating - a.rating);
    expect(sorted[0].name).toBe('Sweet Tooth');   // 4.8
    expect(sorted[1].name).toBe('Green Bowl');    // 4.7
    expect(sorted[sorted.length - 1].name).toBe('Dragon Wok'); // 4.0
  });

  it('filters by price range', () => {
    const budget = restaurants.filter(r => r.priceRange === 1);
    expect(budget).toHaveLength(2);
    expect(budget.map(r => r.name)).toContain('Dragon Wok');
    expect(budget.map(r => r.name)).toContain('Burger Barn');
  });
});

// ── Order ID generation ──────────────────────────────────────────────────────

describe('Order ID format', () => {
  it('order ID starts with ORD-', () => {
    const id = `ORD-${Date.now().toString(36).toUpperCase()}`;
    expect(id.startsWith('ORD-')).toBe(true);
  });

  it('transaction ID starts with TXN-', () => {
    const txn = `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    expect(txn.startsWith('TXN-')).toBe(true);
  });

  it('two generated order IDs are unique', () => {
    const id1 = `ORD-${Date.now().toString(36).toUpperCase()}`;
    const id2 = `ORD-${(Date.now() + 1).toString(36).toUpperCase()}`;
    expect(id1).not.toBe(id2);
  });
});

// ── Card formatting ──────────────────────────────────────────────────────────

describe('Card number formatting', () => {
  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const getCardType = (num: string) => {
    const n = num.replace(/\s/g, '');
    if (/^4/.test(n)) return 'Visa';
    if (/^5[1-5]/.test(n)) return 'Mastercard';
    if (/^3[47]/.test(n)) return 'Amex';
    if (/^6/.test(n)) return 'RuPay';
    return '';
  };

  it('formats card number with spaces every 4 digits', () => {
    expect(formatCardNumber('4532015112830366')).toBe('4532 0151 1283 0366');
  });

  it('strips non-numeric characters from card number', () => {
    expect(formatCardNumber('4532-0151-1283-0366')).toBe('4532 0151 1283 0366');
  });

  it('limits card number to 16 digits', () => {
    const result = formatCardNumber('12345678901234567890');
    expect(result.replace(/\s/g, '').length).toBe(16);
  });

  it('formats expiry as MM/YY', () => {
    expect(formatExpiry('1225')).toBe('12/25');
    expect(formatExpiry('0128')).toBe('01/28');
  });

  it('detects Visa card', () => {
    expect(getCardType('4532015112830366')).toBe('Visa');
  });

  it('detects Mastercard', () => {
    expect(getCardType('5412345678901234')).toBe('Mastercard');
  });

  it('detects Amex card', () => {
    expect(getCardType('371449635398431')).toBe('Amex');
  });

  it('detects RuPay card', () => {
    expect(getCardType('6521234567890123')).toBe('RuPay');
  });
});

// ── Rating system ────────────────────────────────────────────────────────────

describe('Rating system', () => {
  const ratings = [4, 5, 3, 5, 4];

  it('calculates average rating correctly', () => {
    const avg = ratings.reduce((s, r) => s + r, 0) / ratings.length;
    expect(avg).toBe(4.2);
  });

  it('rounds rating to 1 decimal place', () => {
    const avg = 4.166666;
    expect(Math.round(avg * 10) / 10).toBe(4.2);
  });

  it('rating label maps correctly', () => {
    const labels: Record<number, string> = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
    expect(labels[1]).toBe('Poor');
    expect(labels[3]).toBe('Good');
    expect(labels[5]).toBe('Excellent');
  });

  it('rating must be between 1 and 5', () => {
    const isValid = (r: number) => r >= 1 && r <= 5;
    expect(isValid(1)).toBe(true);
    expect(isValid(5)).toBe(true);
    expect(isValid(0)).toBe(false);
    expect(isValid(6)).toBe(false);
  });
});
