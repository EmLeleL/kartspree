// contexts/CartContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import {
  getKart as getCart,
  addToKart as apiAddToCart,
  removeFromKart as apiRemoveFromCart,
  updateKartItem as apiUpdateCartItem,
} from "../../api/kart.js";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));

  // This effect listens for changes in localStorage from other tabs/windows
  // and updates the token state, triggering a cart refresh.
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Load cart items from the backend on mount or when the token state changes
  useEffect(() => {
    if (!token) {
      setCartItems([]);
      return;
    }
    async function fetchCart() {
      try {
        const data = await getCart(token);
        setCartItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch cart:", err.message);
      }
    }
    fetchCart();
  }, [token]);
 

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    if (!token) {
      console.error("User not authenticated. Please log in.");
      return;
    }
    try {
      const cartItem = await apiAddToCart(product._id, quantity, token);
      setCartItems((prev) => {
        // If backend returns full array sometimes adjust here — defensive:
        if (Array.isArray(cartItem)) return cartItem;
        const exists = prev.find((item) => item._id === cartItem._id);
        if (exists) {
          return prev.map((it) => (it._id === cartItem._id ? cartItem : it));
        }
        return [...prev, cartItem];
      });
    } catch (err) {
      console.error("Add to cart failed:", err.message);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    if (!token) {
      console.error("User not authenticated. Please log in.");
      return;
    }
    try {
      await apiRemoveFromCart(itemId, token);
      setCartItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error("Remove from cart failed:", err.message);
    }
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      return removeFromCart(itemId);
    }
    if (!token) {
      console.error("User not authenticated. Please log in.");
      return;
    }
    try {
      const updatedItem = await apiUpdateCartItem(itemId, newQuantity, token);
      setCartItems((prev) =>
        prev.map((item) => (item._id === itemId ? updatedItem : item))
      );
    } catch (err) {
      console.error("Update cart item failed:", err.message);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price ?? item.product?.price ?? 0;
      const qty = Number(item.quantity) || 0;
      return total + price * qty;
    }, 0);
  };
  const value = {
    cartItems,
    addToCart,
    setCartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};