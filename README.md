# 🍽️ MoodByte

> Order food that matches your mood — fast delivery, great taste, zero hassle.



---

## 📌 About

**MoodByte** is a full-stack food delivery platform that recommends restaurants and dishes based on how you're feeling. Built with React, Node.js, and Supabase.

---

## ✨ Features

### 👤 Customer
- Mood-based dish recommendations (Happy, Sad, Tired, Angry, Sick, Celebration)
- Browse 28+ restaurants with filters
- Add to cart with live cart preview
- Checkout with UPI, Card, Net Banking, Wallet, COD
- Real-time order tracking with live delivery map
- Order history and customer profile
-customer reviews

### 🍴 Restaurant Owner
- Dedicated owner dashboard (login per restaurant)
- Add / delete / toggle menu items
- View restaurant-specific orders and analytics
- Update order status in real time

### 🛡️ Admin
- Platform-wide analytics (revenue, orders, restaurants)
- Add / remove restaurants
- Approve / verify restaurants
- Reset owner passwords
- View all orders across platform

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL) |
| Auth | JWT |
| Maps | Leaflet + OpenStreetMap |
| CI/CD | GitHub Actions + GitHub Pages |

---

## 🏃 Running Locally

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`  
Frontend runs on `http://localhost:8080`

---

## 🔑 Environment Variables

Create `backend/.env`:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret
PORT=5000
```

---

## 🐳 Docker

```bash
docker compose up --build
```

---

## 👥 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@moodbyte.com | Admin@123 |
| Sushi Harbor Owner | owner.sushiharbor@moodbyte.com | Owner@123 |
| Customer | Register on the app | — |

---

## 📁 Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # React context (Auth, Cart, App)
│   ├── pages/          # Route pages
│   ├── services/       # API service layer
│   └── data/           # Types and static data
├── backend/
│   ├── routes/         # Express API routes
│   ├── middleware/      # Auth middleware
│   ├── schema.sql       # Supabase database schema
│   └── seed.js         # Database seed script
└── .github/workflows/  # CI/CD pipelines
```

---

## 📄 License

MIT
