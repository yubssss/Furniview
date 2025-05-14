// CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Named exports for context and provider
export const CartContext = createContext({
  cartItems: [], setCartItems: () => {},
  favoriteItems: [], setFavoriteItems: () => {},
  addToCart: () => {}, removeFromCart: () => {},
  clearCart: () => {}, getTotal: () => 0
});

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [favoriteItems, setFavoriteItems] = useState([]);

  // Load cart and favorite items from storage on mount
  useEffect(() => {
    const loadCartData = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        if (storedCart) {
          setCartItems(JSON.parse(storedCart));
        }
        
        const storedFavorites = await AsyncStorage.getItem('favorites');
        if (storedFavorites) {
          setFavoriteItems(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Error loading cart/favorites from AsyncStorage:", error);
      }
    };

    loadCartData();
  }, []);

  // Persist cart and favorite items whenever they change
  useEffect(() => {
    const saveCartData = async () => {
      try {
        await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
        await AsyncStorage.setItem('favorites', JSON.stringify(favoriteItems));
      } catch (error) {
        console.error("Error saving cart/favorites to AsyncStorage:", error);
      }
    };

    saveCartData();
  }, [cartItems, favoriteItems]);

  // Function to add an item to the cart
  const addToCart = (item) => setCartItems(prev => {
    const exists = prev.find(i => i.id === item.id);
    return exists
      ? prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      : [...prev, { ...item, quantity: 1 }];
  });

  // Function to remove an item from the cart
  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));

  // Function to clear the cart
  const clearCart = () => setCartItems([]);

  // Function to calculate the total price of items in the cart
  const getTotal = () => cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, setCartItems, favoriteItems, setFavoriteItems, addToCart, removeFromCart, clearCart, getTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
