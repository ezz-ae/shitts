"use client";

import React, { useState, useCallback } from 'react';
import { useApp } from '@/hooks/useApp';
import { ProductCard } from './ProductCard';
import { SwipeButtons } from './SwipeButtons';
import { Button } from '@/components/ui/button';
import { Loader2, User, RefreshCw } from 'lucide-react';

export function SwipeArea() {
  const { deck, currentIndex, handleSwipe, isLoading, resetDeck, openProfile } = useApp();
  const [dragX, setDragX] = useState(0);

  const activeCards = deck.slice(currentIndex, currentIndex + 2);
  const cardsToRender = [...activeCards].reverse();

  const onSwipe = useCallback((direction: 'left' | 'right') => {
    const swipedProduct = deck[currentIndex];
    handleSwipe(swipedProduct.id, direction === 'right' ? 'swipeRight' : 'swipeLeft');
    setDragX(0);
  }, [deck, currentIndex, handleSwipe]);

  const handleDrag = useCallback((x: number) => {
    setDragX(x);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-6 p-8 h-full bg-black">
        <Loader2 className="h-6 w-6 animate-spin text-pink-500 opacity-40" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-black touch-none">
      {/* Product Deck Area */}
      <div className="absolute inset-0">
        {activeCards.length > 0 ? (
          cardsToRender.map((product, index) => {
            const isTop = index === cardsToRender.length - 1;
            return (
              <ProductCard
                key={product.id}
                product={product}
                isTop={isTop}
                onSwipe={onSwipe}
                dragX={isTop ? dragX : 0}
                onDrag={isTop ? handleDrag : undefined}
                topDragX={isTop ? 0 : dragX}
              />
            );
          })
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center p-12 bg-black space-y-6">
            <h2 className="text-xl font-black tracking-[0.5em] text-white/20 uppercase">End of feed</h2>
            <Button 
                onClick={resetDeck} 
                variant="ghost" 
                className="group flex flex-col items-center gap-4 hover:bg-transparent"
            >
                <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center group-active:scale-90 transition-all">
                    <RefreshCw className="w-6 h-6 text-white opacity-40 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Discover More</span>
            </Button>
          </div>
        )}
      </div>
      
      <div className="absolute top-0 left-0 right-0 pt-10 pb-4 px-8 flex justify-between items-center z-50 pointer-events-none">
        <span className="text-2xl font-black tracking-tighter text-white drop-shadow-2xl pointer-events-auto select-none">
          SHITTS
        </span>
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={openProfile}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl text-white border border-white/20 pointer-events-auto active:scale-90 transition-transform shadow-2xl"
        >
           <User className="w-6 h-6" />
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pb-16 pt-24 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-50 pointer-events-none">
          <div className="pointer-events-auto flex justify-center items-center">
            <SwipeButtons />
          </div>
      </div>
    </div>
  );
}
