"use client";

import React from 'react';
import { X, ArrowUp, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/useApp';

interface SwipeButtonsProps {
  onSwipe: (direction: 'left' | 'right') => void;
}

export function SwipeButtons({ onSwipe }: SwipeButtonsProps) {
  const { openDetails } = useApp();

  const buttonClass = "w-20 h-20 rounded-full shadow-2xl transform hover:scale-110 transition-transform";
  const iconSize = 36;

  return (
    <div className="flex items-center justify-evenly w-full max-w-sm pb-8 z-10">
      <Button
        onClick={() => onSwipe('left')}
        variant="destructive"
        className={`${buttonClass} bg-white text-destructive border-2 border-destructive hover:bg-destructive/10`}
        aria-label="Dislike"
      >
        <X size={iconSize} />
      </Button>
      <Button
        onClick={openDetails}
        variant="secondary"
        className={`${buttonClass} w-16 h-16 bg-white text-accent border-2 border-accent hover:bg-accent/10`}
        aria-label="More Info"
      >
        <ArrowUp size={30} />
      </Button>
      <Button
        onClick={() => onSwipe('right')}
        variant="default"
        className={`${buttonClass} bg-white text-primary border-2 border-primary hover:bg-primary/10`}
        aria-label="Like"
      >
        <Heart size={iconSize} className="fill-primary" />
      </Button>
    </div>
  );
}
