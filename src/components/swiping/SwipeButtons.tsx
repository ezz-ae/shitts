"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/useApp';

interface SwipeButtonsProps {
  onSwipe: (direction: 'left' | 'right') => void;
}

export function SwipeButtons({ onSwipe }: SwipeButtonsProps) {
  const { openDetails } = useApp();

  const buttonClass = "h-14 rounded-full shadow-lg transform hover:scale-105 transition-transform text-lg font-bold w-28";

  return (
    <div className="flex items-center justify-evenly w-full max-w-sm pb-8 z-10">
      <Button
        onClick={() => onSwipe('left')}
        variant="outline"
        className={`${buttonClass} border-destructive text-destructive hover:bg-destructive hover:text-white`}
        aria-label="Dislike"
      >
        Nope
      </Button>
      <Button
        onClick={openDetails}
        variant="outline"
        className="h-12 w-24 rounded-full shadow-md text-base font-semibold border-accent text-accent hover:bg-accent hover:text-white"
        aria-label="More Info"
      >
        Info
      </Button>
      <Button
        onClick={() => onSwipe('right')}
        variant="outline"
        className={`${buttonClass} border-primary text-primary hover:bg-primary hover:text-white`}
        aria-label="Like"
      >
        Like
      </Button>
    </div>
  );
}
