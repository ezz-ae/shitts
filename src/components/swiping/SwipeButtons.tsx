"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/useApp';
import { X, Circle, ChevronUp } from 'lucide-react';

interface SwipeButtonsProps {
  onSwipe: (direction: 'left' | 'right') => void;
}

export function SwipeButtons({ onSwipe }: SwipeButtonsProps) {
  const { openDetails, openCart, undoLastSwipe } = useApp();

  const buttonClass = "transform hover:scale-110 transition-transform duration-200 ease-in-out";

  return (
    <div className="flex items-center justify-evenly w-full max-w-sm py-6 px-4 z-10">
      <Button
        onClick={undoLastSwipe}
        variant="ghost"
        className={buttonClass}
        aria-label="Undo Dislike"
      >
        <X size={48} strokeWidth={2.5} className="text-white" />
      </Button>
      <Button
        onClick={openDetails}
        variant="ghost"
        className={buttonClass}
        aria-label="More Info"
      >
        <Circle size={42} strokeWidth={2.5} className="text-white" />
      </Button>
      <Button
        onClick={openCart}
        variant="ghost"
        className={buttonClass}
        aria-label="Open Cart"
      >
        <ChevronUp size={48} strokeWidth={2.5} className="text-white" />
      </Button>
    </div>
  );
}
