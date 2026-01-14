"use client";

import { useApp } from '@/hooks/useApp';
import { SwipeArea } from '@/components/swiping/SwipeArea';
import { ProductDetailsSheet } from '@/components/swiping/ProductDetailsSheet';
import { UserProfile } from '@/components/UserProfile';
import { OnboardingGuide } from '@/components/swiping/OnboardingGuide';

export function StyleSwipeApp() {
  const { deck, currentIndex } = useApp();
  const currentProduct = deck[currentIndex];

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden bg-background font-body">
      <OnboardingGuide />
      <SwipeArea />
      {currentProduct && <ProductDetailsSheet product={currentProduct} />}
      <UserProfile />
    </div>
  );
}
