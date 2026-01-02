"use client";

import React, { createContext, useState, useMemo, useCallback } from 'react';
import type { Product, CartItem } from '@/types';
import { products as allProducts } from '@/lib/products';
import { fetchRecommendations } from '@/actions/getRecommendations';
import { useToast } from "@/hooks/use-toast";

type SwipeAction = 'swipeLeft' | 'swipeRight';
type SwipeHistory = { productId: string; action: SwipeAction; }[];

interface AppContextType {
  deck: Product[];
  cart: CartItem[];
  swipeHistory: SwipeHistory;
  currentIndex: number;
  isDetailsOpen: boolean;
  isCartOpen: boolean;
  isLoading: boolean;
  handleSwipe: (productId: string, action: SwipeAction) => void;
  openDetails: () => void;
  closeDetails: () => void;
  openCart: () => void;
  closeCart: () => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getNewRecommendations: () => Promise<void>;
  resetDeck: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const shuffleArray = (array: any[]) => {
  return [...array].sort(() => Math.random() - 0.5);
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deck, setDeck] = useState<Product[]>(() => shuffleArray(allProducts));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [swipeHistory, setSwipeHistory] = useState<SwipeHistory>([]);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSwipe = useCallback((productId: string, action: SwipeAction) => {
    setCurrentIndex(prev => prev + 1);
    setSwipeHistory(prev => [...prev, { productId, action }]);

    if (action === 'swipeRight') {
      const product = allProducts.find(p => p.id === productId);
      if (product) {
        setCart(prevCart => {
          const existingItem = prevCart.find(item => item.product.id === productId);
          if (existingItem) {
            return prevCart.map(item =>
              item.product.id === productId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          }
          return [...prevCart, { product, quantity: 1 }];
        });
        toast({
          title: "Added to cart!",
          description: product.name,
        });
      }
    }
  }, [toast]);

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prev =>
        prev.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const getNewRecommendations = async () => {
    setIsLoading(true);
    try {
      const recommendedIds = await fetchRecommendations({ 
        swipingHistory: swipeHistory.map(h => ({...h, action: h.action === 'swipeRight' ? 'swipeRight' : 'swipeLeft'} as any)), // Ensure enum values
      });
      const recommendedProducts = allProducts.filter(p => recommendedIds.includes(p.id));
      const otherProducts = allProducts.filter(p => !recommendedIds.includes(p.id));
      
      const newDeck = [...shuffleArray(recommendedProducts), ...shuffleArray(otherProducts)];
      setDeck(newDeck);
      setCurrentIndex(0);
      setSwipeHistory([]);
      toast({
        title: "New Recommendations!",
        description: "We've curated a new stack for you based on your preferences.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch recommendations. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetDeck = () => {
    setDeck(shuffleArray(allProducts));
    setCurrentIndex(0);
    setSwipeHistory([]);
    toast({
      title: "Deck Reset",
      description: "Enjoy a fresh stack of styles!",
    });
  }

  const value = useMemo(() => ({
    deck,
    cart,
    swipeHistory,
    currentIndex,
    isDetailsOpen,
    isCartOpen,
    isLoading,
    handleSwipe,
    openDetails: () => setDetailsOpen(true),
    closeDetails: () => setDetailsOpen(false),
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    removeFromCart,
    updateQuantity,
    getNewRecommendations,
    resetDeck,
  }), [deck, cart, swipeHistory, currentIndex, isDetailsOpen, isCartOpen, isLoading, handleSwipe]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
