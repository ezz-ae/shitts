"use client";

import { useApp } from '@/hooks/useApp';
// Removed Header import as it's now in layout.tsx
import { SwipeArea } from '@/components/swiping/SwipeArea';
import { ProductDetailsSheet } from '@/components/swiping/ProductDetailsSheet';
import { ShoppingCart } from '@/components/cart/ShoppingCart';

export function StyleSwipeApp() {
  const { deck, currentIndex } = useApp();
  const currentProduct = deck[currentIndex];

  return (
    <div className="relative flex flex-col h-svh w-full overflow-hidden bg-background font-body">
      {/* Header removed from here to avoid duplication */}
      <main className="flex-1 flex flex-col items-center justify-center relative isolate">
        <SwipeArea />
      </main>
      {currentProduct && <ProductDetailsSheet product={currentProduct} />}
      <ShoppingCart />
    </div>
  );
}
