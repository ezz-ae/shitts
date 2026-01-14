"use client";

import React, { useState, useCallback } from 'react';
import { useApp } from '@/hooks/useApp';
import { ProductCard } from './ProductCard';
import { SwipeButtons } from './SwipeButtons';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, User } from 'lucide-react';

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
          <div className="flex h-full flex-col items-center justify-center text-center p-12 bg-white space-y-8">
            <Sparkles className="w-12 h-12 text-pink-200" />
            <div className="space-y-3">
              <h2 className="text-3xl font-black tracking-tighter text-black uppercase">Your Daily Edit is Complete</h2>
              <p className="text-gray-400 font-medium">See you tomorrow with a new selection.</p>
            </div>
            <Button onClick={resetDeck} variant="outline" className="w-full h-14 border-pink-200 text-pink-500 rounded-2xl font-bold text-lg">Restart Today's Session</Button>
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
