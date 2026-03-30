import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import SiteErrorBanner from "./components/SiteErrorBanner";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/CartPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-white">
          <SiteErrorBanner />
          <Navbar />
          <CartDrawer />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
