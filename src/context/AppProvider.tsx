"use client";

import React, { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { Product, CartItem, Order, UserProfileData, UserIntent } from '@/types';
import { products as productManager } from '@/lib/products';
import { fetchRecommendations } from '@/actions/getRecommendations';
import { processPaymentAction } from '@/actions/payments';
import { getProductsFromFirestore, syncInitialProducts } from '@/actions/inventory';
import { useToast } from "@/hooks/use-toast";

interface AppContextType {
  deck: Product[];
  cart: CartItem[];
  userProfile: UserProfileData;
  userIntents: UserIntent[];
  currentIndex: number;
  stylePersona: string;
  isDetailsOpen: boolean;
  isCartOpen: boolean;
  isProfileOpen: boolean;
  isLoading: boolean;
  handleSwipe: (productId: string, action: 'swipeLeft' | 'swipeRight') => void;
  openDetails: () => void;
  closeDetails: () => void;
  openCart: () => void;
  closeCart: () => void;
  openProfile: () => void;
  closeProfile: () => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  resetDeck: () => void;
  checkout: (method: 'paypal' | 'ziina') => Promise<void>;
  undoLastSwipe: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SEEN: 'style_swipe_seen_products',
  CART: 'style_swipe_cart',
  INTENTS: 'style_swipe_intents',
  PERSONA: 'style_swipe_persona',
  PROFILE: 'style_swipe_profile'
};

const shuffleArray = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [deck, setDeck] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userIntents, setUserIntents] = useState<UserIntent[]>([]);
  const [stylePersona, setStylePersona] = useState('Style Pioneer');
  const [seenProductIds, setSeenProductIds] = useState<Set<string>>(new Set());
  const [traitAffinities, setTraitAffinities] = useState<Record<string, number>>({});
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const [userProfile, setUserProfile] = useState<UserProfileData>({
    name: 'Jane Doe', phone: '+1 234 567 8900', locations: ['123 Fashion Ave, NY'],
    paymentCards: [{ last4: '4242', brand: 'Visa' }],
    credit: 10, wishlist: [], orderHistory: []
  });

  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const calculateProductScore = useCallback((product: Product, affinities: Record<string, number>) => {
    if (product.isCreditCard) return 1000;
    let score = 0;
    if (product.category) score += (affinities[product.category] || 0) * 2;
    product.tags?.forEach(tag => { score += (affinities[tag] || 0); });
    return score;
  }, []);

  const reorderDeck = useCallback((currentDeck: Product[], affinities: Record<string, number>) => {
    const swiped = currentDeck.slice(0, currentIndex + 1);
    const remaining = currentDeck.slice(currentIndex + 1);
    const reordered = [...remaining].sort((a, b) => calculateProductScore(b, affinities) - calculateProductScore(a, affinities));
    return [...swiped, ...reordered];
  }, [currentIndex, calculateProductScore]);

  const loadDeck = useCallback(async (isInitial = false, productsToUse: Product[] = allProducts) => {
    if (productsToUse.length === 0) return;
    
    const currentSeen = isInitial ? new Set<string>(JSON.parse(localStorage.getItem(STORAGE_KEYS.SEEN) || '[]')) : seenProductIds;
    let freshProducts = productsToUse.filter(p => !currentSeen.has(p.id));
    if (freshProducts.length < 5) { freshProducts = productsToUse; setSeenProductIds(new Set()); }
    
    const baseProducts = shuffleArray(freshProducts).map((p, idx) => {
        if (idx > 0 && idx % 12 === 0) {
            return { id: `credit-${Date.now()}-${idx}`, name: 'Style Credit', price: 0, imageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80', isCreditCard: true, creditAmount: Math.floor(Math.random() * 5) + 1 } as Product;
        }
        return p;
    });
    
    const finalProducts = reorderDeck(baseProducts, traitAffinities);
    setDeck(isInitial ? finalProducts : prev => [...prev, ...finalProducts]);
  }, [seenProductIds, traitAffinities, reorderDeck, allProducts]);

  useEffect(() => {
    const initialize = async () => {
        setIsLoading(true);
        // Sync & Fetch from Firestore
        const initialProds = productManager.getAllProducts();
        await syncInitialProducts(initialProds);
        const firestoreProds = await getProductsFromFirestore();
        const finalProducts = firestoreProds.length > 0 ? firestoreProds : initialProds;
        setAllProducts(finalProducts);

        const savedSeen = localStorage.getItem(STORAGE_KEYS.SEEN);
        if (savedSeen) setSeenProductIds(new Set(JSON.parse(savedSeen)));
        
        const savedIntents = localStorage.getItem(STORAGE_KEYS.INTENTS);
        if (savedIntents) {
            const intents: UserIntent[] = JSON.parse(savedIntents);
            setUserIntents(intents);
            const newAffinities: Record<string, number> = {};
            intents.forEach(intent => {
                const weight = intent.type === 'LIKE' ? 5 : (intent.type === 'DETAIL_VIEW' ? 2 : -3);
                intent.traits.forEach(trait => { newAffinities[trait] = (newAffinities[trait] || 0) + weight; });
            });
            setTraitAffinities(newAffinities);
        }
        
        const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
        if (savedCart) setCart(JSON.parse(savedCart));
        
        const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
        if (savedProfile) setUserProfile(JSON.parse(savedProfile));
        
        await loadDeck(true, finalProducts);
        setIsLoading(false);
    };
    initialize();
  }, []);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SEEN, JSON.stringify(Array.from(seenProductIds))); }, [seenProductIds]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INTENTS, JSON.stringify(userIntents)); }, [userIntents]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile)); }, [userProfile]);

  const handleSwipe = useCallback((productId: string, action: 'swipeLeft' | 'swipeRight') => {
    const product = deck.find(p => p.id === productId);
    if (!product) return;
    const traits = [...(product.tags || []), ...(product.category ? [product.category] : [])];
    const newIntent: UserIntent = { type: action === 'swipeRight' ? 'LIKE' : 'DISLIKE', productId, timestamp: Date.now(), traits };
    setUserIntents(prev => [...prev, newIntent]);
    const weight = newIntent.type === 'LIKE' ? 5 : -3;
    const newAffinities = { ...traitAffinities };
    traits.forEach(t => { newAffinities[t] = (newAffinities[t] || 0) + weight; });
    setTraitAffinities(newAffinities);
    setDeck(prev => reorderDeck(prev, newAffinities));
    setCurrentIndex(prev => prev + 1);
    setSeenProductIds(prev => new Set(prev).add(productId));
    if (product.isCreditCard && action === 'swipeRight') {
        setUserProfile(prev => ({ ...prev, credit: prev.credit + (product.creditAmount || 0) }));
    } else if (action === 'swipeRight') {
        setCart(prev => [...prev, { product, quantity: 1 }]);
    }
  }, [deck, currentIndex, traitAffinities, reorderDeck]);

  const checkout = async (method: 'paypal' | 'ziina') => {
    setIsLoading(true);
    try {
        const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
        const orderId = `ORD-${Date.now()}`;
        const response = await processPaymentAction(total, method, orderId);
        if (response.success && response.approvalUrl) {
            const newOrder: Order = { id: orderId, date: new Date().toLocaleDateString(), items: [...cart], total, status: 'processing' };
            setUserProfile(prev => ({ ...prev, orderHistory: [newOrder, ...prev.orderHistory] }));
            setCart([]);
            setCartOpen(false);
            window.location.href = response.approvalUrl;
        } else {
            toast({ variant: "destructive", title: "Payment Failed", description: response.error });
        }
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Something went wrong during checkout." });
    } finally {
        setIsLoading(false);
    }
  };

  const value = useMemo(() => ({
    deck, cart, userProfile, userIntents, currentIndex, stylePersona, isDetailsOpen, isCartOpen, isProfileOpen, isLoading,
    handleSwipe, openDetails: () => setDetailsOpen(true), closeDetails: () => setDetailsOpen(false),
    openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false),
    openProfile: () => setProfileOpen(true), closeProfile: () => setProfileOpen(false),
    removeFromCart: (id: string) => {}, updateQuantity: (id: string, q: number) => {}, 
    resetDeck: () => { localStorage.clear(); window.location.reload(); },
    checkout, undoLastSwipe: () => {}
  }), [deck, cart, userProfile, userIntents, currentIndex, stylePersona, isDetailsOpen, isCartOpen, isProfileOpen, isLoading, handleSwipe]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
