// src/context/Cart.js
import { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

// Hook for easy access
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart in localStorage
  useEffect(() => {
    if (!isAdmin) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isAdmin]);

  // Clear cart if admin
  useEffect(() => {
    if (isAdmin) {
      setCartItems([]);
      localStorage.removeItem("cart");
    }
  }, [isAdmin]);

  // ✅ Add item to cart (capped to available stock, blocked for admin)
  const addToCart = (product, quantity = 1) => {
    if (isAdmin) return;
    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === product._id);
      const maxStock = product.stock ?? Infinity;
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, maxStock);
        return prev.map((item) =>
          item._id === product._id ? { ...item, quantity: newQty } : item
        );
      } else {
        return [...prev, { ...product, quantity: Math.min(quantity, maxStock) }];
      }
    });
  };

  // ✅ Remove an item
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== productId));
  };

  // ✅ Update quantity manually (capped to stock)
  const updateQuantity = (productId, quantity) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item._id !== productId) return item;
        const maxQty = item.stock ?? Infinity;
        return { ...item, quantity: Math.max(1, Math.min(quantity, maxQty)) };
      })
    );
  };

  // ✅ Clear all items
  const clearCart = () => setCartItems([]);

  // ✅ Derived values (auto-calculated)
  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
        0
      ),
    [cartItems]
  );

  const totalItems = useMemo(
    () => cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems, // 👈 use this for navbar badge
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
