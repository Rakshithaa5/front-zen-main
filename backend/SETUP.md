# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → "New project"
3. Choose your organization
4. Fill in:
   - **Name**: `food-zen` (or any name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for setup to complete

## Step 2: Get Your Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Service Role Key** (starts with `eyJ...` - this is the secret one)

## Step 3: Configure Backend Environment

1. Open `backend/.env` file
2. Replace the placeholder values:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
PORT=5000
```

**Important**: 
- Use the **Service Role Key**, not the **anon public** key
- Make JWT_SECRET a long random string (at least 32 characters)

## Step 4: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `backend/schema.sql`
4. Paste it into the SQL editor
5. Click **"Run"** button
6. You should see a success message and a count table showing:
   - Restaurants: 8
   - Menu Items: 20
   - Users: 1

## Step 5: Verify Database Setup

In the SQL Editor, run this query to check everything worked:

```sql
-- Check tables exist and have data
SELECT 
  schemaname,
  tablename,
  (SELECT count(*) FROM restaurants) as restaurants_count,
  (SELECT count(*) FROM menu_items) as menu_items_count,
  (SELECT count(*) FROM users) as users_count
FROM pg_tables 
WHERE tablename IN ('restaurants', 'menu_items', 'orders', 'users');
```

## Step 6: Test Backend Connection

1. Open terminal in the `backend` folder:
```bash
cd backend
npm install
npm run dev
```

2. You should see:
```
Server running on http://localhost:5000
```

3. Test the API:
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test restaurants endpoint
curl http://localhost:5000/api/restaurants
```

## Step 7: Test User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "password123"
  }'
```

You should get back a user object and JWT token.

## Troubleshooting

### Error: "Invalid API key"
- Double-check you're using the **Service Role Key**, not the anon key
- Make sure there are no extra spaces in your .env file

### Error: "relation does not exist"
- The schema.sql didn't run properly
- Go back to SQL Editor and run it again
- Check for any error messages in the SQL Editor

### Error: "connect ECONNREFUSED"
- Your SUPABASE_URL is wrong
- Check the URL format: `https://xxxxx.supabase.co` (no trailing slash)

### Error: "JWT malformed"
- Your JWT_SECRET is missing or too short
- Generate a new random string at least 32 characters long

## Default Admin User

The schema creates an admin user:
- **Email**: `admin@foodzen.com`
- **Password**: `admin123`
- **Role**: `admin`

Use this to test admin features.

## Next Steps

Once everything is working:
1. Start your frontend: `npm run dev` (in the main project folder)
2. Update frontend API calls to use `http://localhost:5000/api`
3. Test the full flow: register → login → browse restaurants → place order

## Database Schema Overview

```
users
├── id (uuid, primary key)
├── name, email, password_hash
├── role (customer/restaurant_owner/admin)
└── created_at

restaurants
├── id (text, primary key)
├── name, cuisine[], rating, price_range
├── image, delivery_time, is_veg
├── address, description
└── created_at

menu_items
├── id (text, primary key)
├── restaurant_id → restaurants(id)
├── name, description, price, category
├── image, is_veg, is_available
└── created_at

orders
├── id (text, auto-generated ORD-XXXXX)
├── user_id → users(id)
├── restaurant_id → restaurants(id)
├── restaurant_name, items (jsonb)
├── total, status, payment_method
├── transaction_id, delivery_address
└── created_at
```