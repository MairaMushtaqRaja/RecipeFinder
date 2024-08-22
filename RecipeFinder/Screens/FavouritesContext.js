import React, { createContext, useState, useContext } from 'react';

// Create a context
const FavouritesContext = createContext();

// Create a provider component
export const FavouritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const addFavorite = (recipe) => {
    setFavorites([...favorites, recipe]);
  };

  const removeFavorite = (label) => {
    setFavorites(favorites.filter(fav => fav.label !== label));
  };

  return (
    <FavouritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavouritesContext.Provider>
  );
};

// Create a custom hook to use the Favorites context
export const useFavorites = () => useContext(FavouritesContext);
