import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { AppProvider } from "@/context/AppContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import CustomerProfile from "./pages/CustomerProfile";
import MoodRecommendations from "./pages/MoodRecommendations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/restaurants" element={<Restaurants />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/mood-recommendations" element={<MoodRecommendations />} />
                
                {/* Protected Routes - Require Authentication */}
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/order/:id" element={
                  <ProtectedRoute>
                    <OrderTracking />
                  </ProtectedRoute>
                } />
                <Route path="/orders" element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute allowedRoles={['customer']}>
                    <CustomerProfile />
                  </ProtectedRoute>
                } />
                
                {/* Admin Only Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Restaurant Owner Routes */}
                <Route path="/owner" element={
                  <ProtectedRoute allowedRoles={['restaurant_owner']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
