import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api, { siteConfigError } from "../api";

const CartContext = createContext(null);

const emptyCart = {
  total_amount: "0",
  total_items: 0,
  currency_symbol: "$",
  cart_items: [],
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState(emptyCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (siteConfigError) return;
    setLoading(true);
    try {
      const result = await api.getCart();
      if (result.success) {
        setCart(result.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!siteConfigError) {
      refreshCart();
    }
  }, [refreshCart]);

  async function addToCart(id, quantity) {
    if (siteConfigError) return;
    setLoading(true);
    try {
      await api.addToCart(String(id), String(quantity));
      await refreshCart();
    } finally {
      setLoading(false);
    }
  }

  async function updateItem(item_key, quantity) {
    if (siteConfigError) return;
    setLoading(true);
    try {
      await api.updateItem(item_key, String(quantity));
      await refreshCart();
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(item_key) {
    if (siteConfigError) return;
    setLoading(true);
    try {
      await api.removeItem(item_key);
      await refreshCart();
    } finally {
      setLoading(false);
    }
  }

  async function clearCart() {
    if (siteConfigError) return;
    setLoading(true);
    try {
      await api.clearCart();
      setCart(emptyCart);
    } finally {
      setLoading(false);
    }
  }

  function checkout() {
    if (siteConfigError) return;
    const url = api.getCheckoutUrl();
    window.location.href = url;
  }

  function toggleCart() {
    setCartOpen((prev) => !prev);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        loading,
        refreshCart,
        addToCart,
        updateItem,
        removeItem,
        clearCart,
        checkout,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
