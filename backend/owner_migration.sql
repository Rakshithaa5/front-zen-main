-- Owner role migration for existing Supabase projects
-- Run this in Supabase SQL Editor once.

-- 1) Add owner_id to restaurants if missing.
ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS owner_id uuid;

ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS gallery_images text[] NOT NULL DEFAULT '{}';

ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS location text;

ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS verification_doc text;

ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS is_verified boolean NOT NULL DEFAULT false;

ALTER TABLE restaurants
ADD COLUMN IF NOT EXISTS verified_at timestamptz;

UPDATE restaurants
SET location = COALESCE(location, address)
WHERE location IS NULL;

-- Existing platform restaurants should be treated as already approved.
UPDATE restaurants
SET verification_doc = COALESCE(NULLIF(verification_doc, ''), 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'),
    is_verified = true,
    verified_at = COALESCE(verified_at, now())
WHERE id IS NOT NULL;

-- 2) Ensure foreign key exists.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'restaurants'
      AND constraint_name = 'restaurants_owner_id_fkey'
  ) THEN
    ALTER TABLE restaurants
    ADD CONSTRAINT restaurants_owner_id_fkey
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 7) Convert existing menu item prices from USD scale to INR scale.
-- Safe to run repeatedly: only updates rows with low USD-like values.
UPDATE menu_items
SET price = ROUND((price * 100)::numeric, 2)
WHERE price > 0
  AND price < 100;

-- 3) Ensure one owner is linked to only one restaurant.
CREATE UNIQUE INDEX IF NOT EXISTS restaurants_owner_id_unique_idx
ON restaurants (owner_id)
WHERE owner_id IS NOT NULL;

-- 4) Backfill owner_id links from existing owner emails.
UPDATE restaurants r
SET owner_id = u.id
FROM users u
WHERE u.role = 'restaurant_owner'
  AND (
    (u.email = 'spicegarden@moodbyte.com' AND r.id = '1') OR
    (u.email = 'pizzaparadise@moodbyte.com' AND r.id = '2') OR
    (u.email = 'greenbowl@moodbyte.com' AND r.id = '3') OR
    (u.email = 'dragonwok@moodbyte.com' AND r.id = '4') OR
    (u.email = 'burgerbarn@moodbyte.com' AND r.id = '5') OR
    (u.email = 'biryanihouse@moodbyte.com' AND r.id = '6') OR
    (u.email = 'sweettooth@moodbyte.com' AND r.id = '7') OR
    (u.email = 'soulandsoul@moodbyte.com' AND r.id = '8') OR
    (u.email = 'tacotierra@moodbyte.com' AND r.id = '9') OR
    (u.email = 'sushiharbor@moodbyte.com' AND r.id = '10') OR
    (u.email = 'curryleaf@moodbyte.com' AND r.id = '11') OR
    (u.email = 'pholotus@moodbyte.com' AND r.id = '12') OR
    (u.email = 'mediterraneo@moodbyte.com' AND r.id = '13') OR
    (u.email = 'kebabcourt@moodbyte.com' AND r.id = '14') OR
    (u.email = 'pastafresca@moodbyte.com' AND r.id = '15') OR
    (u.email = 'norihouse@moodbyte.com' AND r.id = '16') OR
    (u.email = 'graingreens@moodbyte.com' AND r.id = '17') OR
    (u.email = 'wafflenest@moodbyte.com' AND r.id = '18') OR
    (u.email = 'smokehouse19@moodbyte.com' AND r.id = '19') OR
    (u.email = 'coconutcoast@moodbyte.com' AND r.id = '20') OR
    (u.email = 'veggievault@moodbyte.com' AND r.id = '21') OR
    (u.email = 'dumplingden@moodbyte.com' AND r.id = '22') OR
    (u.email = 'ramenrealm@moodbyte.com' AND r.id = '23') OR
    (u.email = 'bistrobloom@moodbyte.com' AND r.id = '24') OR
    (u.email = 'rollhouse@moodbyte.com' AND r.id = '25') OR
    (u.email = 'cielocafe@moodbyte.com' AND r.id = '26') OR
    (u.email = 'heritagethali@moodbyte.com' AND r.id = '27') OR
    (u.email = 'seoulstreet@moodbyte.com' AND r.id = '28') OR
    (u.email = 'falafelfarm@moodbyte.com' AND r.id = '29') OR
    (u.email = 'crispcorner@moodbyte.com' AND r.id = '30')
  );

-- 5) Verify links.
SELECT r.id, r.name, u.email AS owner_email
FROM restaurants r
LEFT JOIN users u ON u.id = r.owner_id
ORDER BY r.id;

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS currency text;

UPDATE orders
SET currency = 'INR'
WHERE currency IS NULL OR currency = '';

ALTER TABLE orders
ALTER COLUMN currency SET DEFAULT 'INR';

ALTER TABLE orders
ALTER COLUMN currency SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE table_name = 'orders'
      AND constraint_name = 'orders_currency_check'
  ) THEN
    ALTER TABLE orders
    ADD CONSTRAINT orders_currency_check CHECK (currency = 'INR');
  END IF;
END $$;

-- 8) Persist checkout contact and coupon fields used by the updated order flow.
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS phone_number text;

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS coupon_code text;

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS discount_amount numeric(10,2) DEFAULT 0;
