import { createContext, useContext, useEffect, useState } from 'react';

const MarketplaceContext = createContext(null);
const readStored = (key) => { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; } };

export function MarketplaceProvider({ children }) {
    const [cart, setCart] = useState(() => readStored('onefi-cart'));
    const [favorites, setFavorites] = useState(() => readStored('onefi-favorites'));
    useEffect(() => localStorage.setItem('onefi-cart', JSON.stringify(cart)), [cart]);
    useEffect(() => localStorage.setItem('onefi-favorites', JSON.stringify(favorites)), [favorites]);
    const toggleFavorite = (product) => setFavorites((items) => items.some((item) => item.id === product.id) ? items.filter((item) => item.id !== product.id) : [...items, product]);
    const addToCart = (product) => setCart((items) => items.some((item) => item.id === product.id) ? items : [...items, product]);
    const removeFromCart = (id) => setCart((items) => items.filter((item) => item.id !== id));
    return <MarketplaceContext.Provider value={{ cart, favorites, toggleFavorite, addToCart, removeFromCart }}>{children}</MarketplaceContext.Provider>;
}

export const useMarketplace = () => useContext(MarketplaceContext);
