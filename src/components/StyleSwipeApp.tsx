"use client";

import { useApp } from '@/hooks/useApp';
import { SwipeArea } from '@/components/swiping/SwipeArea';
import { ProductDetailsSheet } from '@/components/swiping/ProductDetailsSheet';

export function StyleSwipeApp() {
  const { deck, currentIndex } = useApp();
  const currentProduct = deck[currentIndex];

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden bg-background font-body">
        <SwipeArea />
      {currentProduct && <ProductDetailsSheet product={currentProduct} />}
    </div>
  );
}
