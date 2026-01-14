"use client";

import React, { createContext, useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { Product, CartItem, Order, UserProfileData, UserIntent, LedgerEntry } from '@/types';
import { products as productManager } from '@/lib/products';
import { fetchRecommendations } from '@/actions/getRecommendations';
import { processCheckoutAction } from '@/actions/payments';
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
  
  const loadingMore = useRef(false);

  const [userProfile, setUserProfile] = useState<UserProfileData>({
    uid: 'user_123', role: 'user', name: 'Jane Doe', phone: '+1 234 567 8900', locations: ['123 Fashion Ave, NY'],
    paymentCards: [{ last4: '4242', brand: 'Visa' }],
    credit: 10, picked: [], orderHistory: [], creditHistory: []
  });

  const [isDetailsOpen, setDetailsOpen] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const calculateProductScore = useCallback((product: Product, affinities: Record<string, number>) => {
    if (product.isCreditCard) return 1000;
    let score = 0;
    if (product.category) score += (affinities[product.category] || 0) * 5;
    product.tags?.forEach(tag => { score += (affinities[tag] || 0) * 2; });
    return score;
  }, []);

  const reorderDeck = useCallback((currentDeck: Product[], affinities: Record<string, number>, startIndex: number) => {
    const swiped = currentDeck.slice(0, startIndex);
    const remaining = currentDeck.slice(startIndex);
    const reordered = [...remaining].sort((a, b) => calculateProductScore(b, affinities) - calculateProductScore(a, affinities));
    return [...swiped, ...reordered];
  }, [calculateProductScore]);

  const loadMoreProducts = useCallback(async (currentAffinities: Record<string, number> = traitAffinities) => {
    if (loadingMore.current) return;
    loadingMore.current = true;

    try {
        const rawProducts = allProducts.length > 0 ? allProducts : productManager.getAllProducts();
        
        setDeck(prevDeck => {
            const inDeckIds = new Set(prevDeck.map(p => p.id));
            const freshProducts = rawProducts.filter(p => !seenProductIds.has(p.id) && !inDeckIds.has(p.id));
            
            if (freshProducts.length < 2) {
                loadingMore.current = false;
                return prevDeck;
            }

            const baseProducts = shuffleArray(freshProducts).map((p, idx) => {
                if (idx > 0 && idx % 10 === 0) {
                    return {
                        id: `credit-${Date.now()}-${idx}`,
                        name: 'Mystery Style Credit',
                        price: 0,
                        imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
                        isCreditCard: true,
                        creditAmount: Math.floor(Math.random() * 5) + 1,
                        description: 'A special gift for your style journey.'
                    } as Product;
                }
                return p;
            });

            const finalProducts = [...baseProducts].sort((a, b) => calculateProductScore(b, currentAffinities) - calculateProductScore(a, currentAffinities));
            const uniqueAppend = finalProducts.filter(p => !inDeckIds.has(p.id));
            loadingMore.current = false;
            return [...prevDeck, ...uniqueAppend];
        });
    } catch (e) {
        loadingMore.current = false;
    }
  }, [allProducts, seenProductIds, traitAffinities, calculateProductScore]);

  useEffect(() => {
    const initialize = async () => {
        setIsLoading(true);
        try {
            const firestoreProds = await getProductsFromFirestore();
            const finalProducts = firestoreProds.length > 0 ? firestoreProds : productManager.getAllProducts();
            setAllProducts(finalProducts);

            const savedSeen = localStorage.getItem(STORAGE_KEYS.SEEN);
            const seenSet = savedSeen ? new Set<string>(JSON.parse(savedSeen)) : new Set<string>();
            setSeenProductIds(seenSet);
            
            const savedIntents = localStorage.getItem(STORAGE_KEYS.INTENTS);
            const initialAffinities: Record<string, number> = {};
            if (savedIntents) {
                const intents: UserIntent[] = JSON.parse(savedIntents);
                setUserIntents(intents);
                intents.forEach(intent => {
                    const weight = intent.type === 'LIKE' ? 10 : (intent.type === 'DETAIL_VIEW' ? 3 : -5);
                    intent.traits.forEach(t => { initialAffinities[t] = (initialAffinities[t] || 0) + weight; });
                });
                setTraitAffinities(initialAffinities);
            }
            
            const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
            if (savedCart) setCart(JSON.parse(savedCart));
            
            const savedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);
            if (savedProfile) setUserProfile(JSON.parse(savedProfile));

            const savedPersona = localStorage.getItem(STORAGE_KEYS.PERSONA);
            if (savedPersona) setStylePersona(savedPersona);

            const freshProducts = finalProducts.filter(p => !seenSet.has(p.id));
            const baseProducts = shuffleArray(freshProducts);
            const initialDeck = [...baseProducts].sort((a, b) => calculateProductScore(b, initialAffinities) - calculateProductScore(a, initialAffinities));
            
            const uniqueDeck: Product[] = [];
            const ids = new Set();
            initialDeck.forEach(p => { if (!ids.has(p.id)) { ids.add(p.id); uniqueDeck.push(p); } });
            setDeck(uniqueDeck);

        } catch (e) {
            console.error("Init failed", e);
        } finally {
            setIsLoading(false);
        }
    };
    initialize();
  }, [calculateProductScore]);

  useEffect(() => { localStorage.setItem(STORAGE_KEYS.SEEN, JSON.stringify(Array.from(seenProductIds))); }, [seenProductIds]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.INTENTS, JSON.stringify(userIntents)); }, [userIntents]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.PERSONA, stylePersona); }, [stylePersona]);

  const handleSwipe = useCallback((productId: string, action: 'swipeLeft' | 'swipeRight') => {
    const product = deck.find(p => p.id === productId);
    if (!product) return;

    const traits = [...(product.tags || []), ...(product.category ? [product.category] : [])];
    const newIntent: UserIntent = { type: action === 'swipeRight' ? 'LIKE' : 'DISLIKE', productId, timestamp: Date.now(), traits };
    
    const weight = newIntent.type === 'LIKE' ? 10 : -5;
    const nextAffinities = { ...traitAffinities };
    traits.forEach(t => { nextAffinities[t] = (nextAffinities[t] || 0) + weight; });
    
    setUserIntents(prev => [...prev, newIntent]);
    setTraitAffinities(nextAffinities);
    setSeenProductIds(prev => new Set(prev).add(productId));

    if (product.isCreditCard && action === 'swipeRight') {
        const amount = product.creditAmount || 0;
        const historyEntry: LedgerEntry = {
            id: `entry-${Date.now()}`,
            type: 'CREDIT',
            amount,
            userId: userProfile.uid,
            description: 'Claimed Mystery Credit',
            metadata: { source: 'swipe' },
            timestamp: Date.now()
        };
        setUserProfile(prev => ({ 
            ...prev, 
            credit: prev.credit + amount,
            creditHistory: [historyEntry, ...(prev.creditHistory || [])]
        }));
        toast({ title: "Credits Claimed!", description: `$${amount} added to your wallet.` });
    } else if (action === 'swipeRight') {
        setCart(prev => [...prev, { product, quantity: 1 }]);
    }

    setDeck(prev => reorderDeck(prev, nextAffinities, currentIndex + 1));
    setCurrentIndex(prev => prev + 1);

    if (currentIndex > deck.length - 5) {
        loadMoreProducts(nextAffinities);
    }
  }, [deck, currentIndex, traitAffinities, reorderDeck, loadMoreProducts, toast, userProfile.uid]);

  const undoLastSwipe = useCallback(() => {
    if (currentIndex === 0) return;
    const lastAction = userIntents[userIntents.length - 1];
    if (!lastAction) return;

    const lastProduct = deck[currentIndex - 1];
    const weight = lastAction.type === 'LIKE' ? 10 : -5;
    const revertedAffinities = { ...traitAffinities };
    lastAction.traits.forEach(t => { revertedAffinities[t] = (revertedAffinities[t] || 0) - weight; });

    setTraitAffinities(revertedAffinities);
    setUserIntents(prev => prev.slice(0, -1));
    setSeenProductIds(prev => { const next = new Set(prev); next.delete(lastAction.productId); return next; });
    setCurrentIndex(prev => prev - 1);

    if (lastAction.type === 'LIKE') {
        if (lastProduct?.isCreditCard) {
            setUserProfile(prev => ({ 
                ...prev, 
                credit: Math.max(0, prev.credit - (lastProduct.creditAmount || 0)),
                creditHistory: (prev.creditHistory || []).slice(1) // Remove latest entry
            }));
        } else {
            setCart(prev => prev.filter(i => i.product.id !== lastAction.productId));
        }
    }
    setDeck(prev => reorderDeck(prev, revertedAffinities, currentIndex - 1));
  }, [currentIndex, userIntents, traitAffinities, deck, reorderDeck]);

  const checkout = async (method: 'paypal' | 'ziina') => {
    setIsLoading(true);
    try {
        const response = await processCheckoutAction(cart, method);
        if (response.success && response.approvalUrl) {
            // Log the use of credits if any
            const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
            const creditUsed = Math.min(userProfile.credit, total);
            if (creditUsed > 0) {
                const historyEntry: LedgerEntry = {
                    id: `used-${Date.now()}`,
                    type: 'DEBIT',
                    amount: creditUsed,
                    userId: userProfile.uid,
                    description: 'Used on checkout',
                    metadata: { method },
                    timestamp: Date.now()
                };
                setUserProfile(prev => ({
                    ...prev,
                    credit: prev.credit - creditUsed,
                    creditHistory: [historyEntry, ...(prev.creditHistory || [])]
                }));
            }
            window.location.href = response.approvalUrl;
        } else {
            toast({ variant: "destructive", title: "Checkout Failed", description: response.error });
        }
    } catch (e) {
        toast({ variant: "destructive", title: "System Error" });
    } finally {
        setIsLoading(false);
    }
  };

  const removeFromCart = useCallback((productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    if (item) {
        setUserProfile(prev => ({ ...prev, picked: [...prev.picked, item.product] }));
        setCart(prev => prev.filter(i => i.product.id !== productId));
        toast({ title: "Moved to Picked" });
    }
  }, [cart, toast]);

  const value = useMemo(() => ({
    deck, cart, userProfile, userIntents, currentIndex, stylePersona, isDetailsOpen, isCartOpen, isProfileOpen, isLoading,
    handleSwipe, openDetails: () => setDetailsOpen(true), closeDetails: () => setDetailsOpen(false),
    openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false),
    openProfile: () => setProfileOpen(true), closeProfile: () => setProfileOpen(false),
    removeFromCart, updateQuantity: () => {}, resetDeck: () => { localStorage.clear(); window.location.reload(); },
    checkout, undoLastSwipe
  }), [deck, cart, userProfile, userIntents, currentIndex, stylePersona, isDetailsOpen, isCartOpen, isProfileOpen, isLoading, handleSwipe, undoLastSwipe, checkout, removeFromCart]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
