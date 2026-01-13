"use client";

import React, { useState } from 'react';
import { useApp } from '@/hooks/useApp';
import { ProductCard } from './ProductCard';
import { SwipeButtons } from './SwipeButtons';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function SwipeArea() {
  const { deck, currentIndex, handleSwipe, isLoading, getNewRecommendations, resetDeck } = useApp();
  const [swipeTrigger, setSwipeTrigger] = useState<{ direction: 'left' | 'right', key: number } | null>(null);

  const activeCards = deck.slice(currentIndex, currentIndex + 4).reverse();

  const triggerSwipe = (direction: 'left' | 'right') => {
    setSwipeTrigger({ direction, key: Date.now() });
  };

  const onCardSwipe = (direction: 'left'| 'right') => {
    const swipedProduct = deck[currentIndex];
    handleSwipe(swipedProduct.id, direction === 'right' ? 'swipeRight' : 'swipeLeft');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-4 p-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <h2 className="text-2xl font-headline font-bold tracking-tight">Curating your style...</h2>
        <p className="text-muted-foreground font-body">Our AI is picking out fresh looks just for you!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <div className="relative flex-1 flex items-center justify-center w-full max-w-sm aspect-[3/4] my-4">
        {activeCards.length > 0 ? (
          activeCards.map((product, index) => {
            const isTop = index === activeCards.length - 1;
            return (
              <ProductCard
                key={product.id}
                product={product}
                isTop={isTop}
                onSwipe={onCardSwipe}
                swipeTrigger={isTop ? swipeTrigger : null}
              />
            );
          })
        ) : (
          <div className="text-center p-8 bg-card rounded-lg shadow-md">
            <h2 className="text-2xl font-headline font-bold tracking-tight">That's all for now!</h2>
            <p className="text-muted-foreground font-body mt-2 mb-6">Want to see more? Get personalized recommendations from our AI stylist.</p>
            <div className="flex flex-col gap-4">
              <Button onClick={getNewRecommendations} className="bg-accent hover:bg-accent/90" size="lg">
                Get AI Recommendations
              </Button>
              <Button onClick={resetDeck} variant="outline" size="lg">
                Start Over
              </Button>
            </div>
          </div>
        )}
      </div>
      {activeCards.length > 0 && <SwipeButtons onSwipe={triggerSwipe} />}
    </div>
  );
}
