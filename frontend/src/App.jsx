import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { DarkHorseProvider } from './context/DarkHorseContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute, SellerRoute } from './components/ProtectedRoute';

// Import pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import OrdersPage from './pages/OrdersPage';
import ProductDetailPage from './pages/ProductDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductUploadForm } from './pages/ProductUploadForm';

// Seller Pages
import SellerOnboarding from './pages/SellerOnboarding';
import SellerDashboardLayout from './pages/seller/SellerDashboardLayout';
import SellerOverview from './pages/seller/SellerOverview';
import SellerProducts from './pages/seller/SellerProducts';
import SellerOrders from './pages/seller/SellerOrders';
import SellerKYC from './pages/seller/SellerKYC';
import SellerNotifications from './pages/seller/SellerNotifications';

function App() {
  return (
    <Router>
      <DarkHorseProvider>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-white flex flex-col">
              <Navbar />

              <div className="flex-1">
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />

                  {/* Protected Routes */}
                  <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
                  <Route path="/upload" element={<ProtectedRoute><ProductUploadForm /></ProtectedRoute>} />

                  {/* Seller Onboarding Route */}
                  <Route path="/seller/onboarding" element={<ProtectedRoute><SellerOnboarding /></ProtectedRoute>} />

                  {/* Seller Dashboard Routes */}
                  <Route
                    path="/seller"
                    element={
                      <SellerRoute>
                        <SellerDashboardLayout />
                      </SellerRoute>
                    }
                  >
                    <Route path="dashboard" element={<SellerOverview />} />
                    <Route path="products" element={<SellerProducts />} />
                    <Route path="orders" element={<SellerOrders />} />
                    <Route path="kyc" element={<SellerKYC />} />
                    <Route path="notifications" element={<SellerNotifications />} />
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>

              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </DarkHorseProvider>
    </Router>
  );
}

export default App;
