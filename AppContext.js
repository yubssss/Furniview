import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);

  return (
    <AppContext.Provider value={{ cartItems, setCartItems, favorites, setFavorites }}>
      {children}
    </AppContext.Provider>
  );
};
