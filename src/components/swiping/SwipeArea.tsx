"use client";

import React, { useState, useCallback } from 'react';
import { useApp } from '@/hooks/useApp';
import { ProductCard } from './ProductCard';
import { SwipeButtons } from './SwipeButtons';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, User } from 'lucide-react';

export function SwipeArea() {
  const { deck, currentIndex, handleSwipe, isLoading, getNewRecommendations, resetDeck } = useApp();
  const [dragX, setDragX] = useState(0);

  const activeCards = deck.slice(currentIndex, currentIndex + 2);
  // Bottom card is at index 1 (if exists), Top card is at index 0.
  // We reverse them to render bottom first.
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
      <div className="flex flex-col items-center justify-center text-center gap-6 p-8 h-full bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-pink-500 opacity-30" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
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
                // Pass the drag progress of the TOP card to the BOTTOM card
                topDragX={isTop ? 0 : dragX}
              />
            );
          })
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center p-12 bg-white space-y-8">
            <Sparkles className="w-12 h-12 text-pink-200" />
            <div className="space-y-3">
              <h2 className="text-3xl font-black tracking-tighter">THE END</h2>
              <p className="text-gray-400 font-medium">Want to see more?</p>
            </div>
            <Button onClick={getNewRecommendations} className="w-full h-14 bg-pink-500 rounded-2xl font-bold text-lg">Refresh</Button>
            <Button onClick={resetDeck} variant="ghost" className="w-full text-pink-300 font-bold">Restart</Button>
          </div>
        )}
      </div>
      
      {/* Overlay UI */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50 pointer-events-none">
        <span className="text-2xl font-black tracking-tighter text-white drop-shadow-md pointer-events-auto">
          SHITTS
        </span>
        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full bg-black/10 backdrop-blur-md text-white border border-white/20 pointer-events-auto">
           <User className="w-5 h-5" />
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 pb-12 pt-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-50 pointer-events-none">
          <div className="pointer-events-auto flex justify-center">
            <SwipeButtons />
          </div>
      </div>
    </div>
  );
}
