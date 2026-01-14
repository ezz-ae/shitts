"use client";

import React, { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { Product, CartItem } from '@/types';
import { products as productManager } from '@/lib/products';
import { fetchRecommendations } from '@/actions/getRecommendations';
import { useToast } from "@/hooks/use-toast";

type SwipeAction = 'swipeLeft' | 'swipeRight' | 'swipeUp';
type SwipeHistoryItem = { productId: string; action: SwipeAction; };
type SwipeHistory = SwipeHistoryItem[];

interface AppContextType {
  deck: Product[];
  cart: CartItem[];
  swipeHistory: SwipeHistory;
  currentIndex: number;
  isDetailsOpen: boolean;
  isCartOpen: boolean;
  isLoading: boolean;
  handleSwipe: (productId: string, action: 'swipeLeft' | 'swipeRight') => void;
  openDetails: () => void;
  closeDetails: () => void;
  openCart: () => void;
  closeCart: () => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getNewRecommendations: () => Promise<void>;
  resetDeck: () => void;
  checkout: () => void;
  undoLastSwipe: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const shuffleArray = (array: any[]) => {
  if (!Array.isArray(array)) return [];
  return [...array].sort(() => Math.random() - 0.5);
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deck, setDeck] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [swipeHistory, setSwipeHistory] = useState<SwipeHistory>([]);
  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setDeck(shuffleArray(productManager.getAllProducts()));
    setIsLoading(false);
  }, []);

  const handleSwipe = useCallback((productId: string, action: 'swipeLeft' | 'swipeRight') => {
    setCurrentIndex(prev => prev + 1);
    setSwipeHistory(prev => [...prev, { productId, action: action as SwipeAction }]);

    if (action === 'swipeRight') {
      const product = productManager.getProductById(productId);
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
  
  const openCart = () => setCartOpen(true);
  const closeCart = () => setCartOpen(false);

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
  
  const undoLastSwipe = useCallback(() => {
    if (currentIndex > 0) {
      const lastAction = swipeHistory[swipeHistory.length - 1];
      if (lastAction && lastAction.action === 'swipeLeft') {
          setCurrentIndex(prev => prev - 1);
          setSwipeHistory(prev => prev.slice(0, -1));
          toast({
            title: "Reconsidering?",
            description: "Here's the last item you swiped left on.",
          });
      } else {
         toast({
          variant: "destructive",
          title: "Undo not available",
          description: "Can only undo a 'dislike' swipe.",
        });
      }
    }
  }, [currentIndex, swipeHistory, toast]);

  const getNewRecommendations = async () => {
    setIsLoading(true);
    try {
      const recommendedIds = await fetchRecommendations({ 
        swipingHistory: swipeHistory.map(h => ({...h, action: h.action as any })), // Ensure enum values
        purchaseHistory: cart.map(c => c.product.id),
      });
      const allProds = productManager.getAllProducts();
      const recommendedProducts = allProds.filter(p => recommendedIds.includes(p.id));
      const otherProducts = allProds.filter(p => !recommendedIds.includes(p.id) && !deck.slice(0, currentIndex).find(dp => dp.id === p.id));
      
      const newDeck = [...shuffleArray(recommendedProducts), ...shuffleArray(otherProducts)];
      setDeck(newDeck);
      setCurrentIndex(0);
      setSwipeHistory([]);
      toast({
        title: "New Recommendations!",
        description: "We've curated a new stack for you based on your preferences.",
      });
    } catch (error) {
      console.error(error);
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
    setIsLoading(true);
    setDeck(shuffleArray(productManager.getAllProducts()));
    setCurrentIndex(0);
    setSwipeHistory([]);
    setIsLoading(false);
    toast({
      title: "Deck Reset",
      description: "Enjoy a fresh stack of styles!",
    });
  }

  const checkout = () => {
    setCart([]);
    setCartOpen(false);
    toast({
      title: "Thank You!",
      description: "Your order has been placed.",
    })
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
    openCart,
    closeCart,
    removeFromCart,
    updateQuantity,
    getNewRecommendations,
    resetDeck,
    checkout,
    undoLastSwipe
  }), [deck, cart, swipeHistory, currentIndex, isDetailsOpen, isCartOpen, isLoading, handleSwipe, openCart, closeCart, undoLastSwipe]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
