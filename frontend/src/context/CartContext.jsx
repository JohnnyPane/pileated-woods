import {createContext, useContext, useEffect, useState} from "react";
import { useFlash } from "./FlashContext.jsx";

import CartService from "../services/cartService.js";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const cartService = new CartService();
  const { showNotification } = useFlash();

  useEffect(() => {
    setInitialCart();
  }, []);

  const setInitialCart = async () => {
    if (!cartService.getGuestToken()) {
      return;
    }

    const response = await cartService.fetchCartFromServer();
    const total = cartService.cartTotal();
    setCart({ items: response?.cart_items || [], total });
  }

  const initCart = async () => {
    setLoading(true);
    await cartService.initializeCart();

    const items = await cartService.getCartItems();
    const total = cartService.cartTotal();

    setCart({ items, total });
    setLoading(false);
  }

  const addToCart = async (item, quantity) => {
    if (!cart) {
      await initCart();
    }

    setLoading(true);
    const udpatedItems = await cartService.addToCart(item, quantity);
    const total = cartService.cartTotal();

   showNotification({ message: `${item.name} added to cart`, title: "Success", color: "green" });

    setCart({ items: udpatedItems, total });
    setLoading(false);
  }

  const removeFromCart = async (itemId) => {
    setLoading(true);
    const updatedItems = await cartService.removeFromCart(itemId);
    const total = cartService.cartTotal();

    setCart({ items: updatedItems, total });
    setLoading(false);
  }

  const updateQuantity = async (itemId, quantity) => {
    setLoading(true);
    const updatedItems = cart.items.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity };
      }
      return item;
    });

    const updatedCart = await cartService.updateQuantity(itemId, quantity);
    cartService.saveCartItems(updatedCart);
    const total = cartService.cartTotal();
    setCart({ items: updatedItems, total });
    setLoading(false);
  }

  const clearCart = async () => {
    setLoading(true);
    await cartService.clearCart();
    setCart({ items: [], total: 0 });
    setLoading(false);
  }

  const syncCart = async () => {
    setLoading(true);
    try {
      const serverCart = await cartService.fetchCartFromServer();

      if (serverCart) {
        const { cart_items } = serverCart;
        const total = cart_items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        setCart({ items: cart_items, total });
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
    setLoading(false);
  }

  const getCartTokenForLogin = () => {
    return cartService.prepareCartForLogin();
  };

  const updateCartAfterLogin = async () => {
    setLoading(true);
    try {
      console.log("Updating cart after login...");
      const updatedCart = await cartService.updateCartOnLogin();
      if (updatedCart) {
        const { cart_items } = updatedCart;
        const total = cart_items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        setCart({ items: cart_items, total });
      }
    } catch (error) {
      console.error("Error updating cart after login:", error);
    }
    setLoading(false);
  }

  const cartTotal = () => {
    return cart.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncCart,
    getCartTokenForLogin,
    updateCartAfterLogin,
    cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default useCart;