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
