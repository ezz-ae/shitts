"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/useApp';
import { X, Heart, Info } from 'lucide-react';

interface SwipeButtonsProps {
  onSwipe: (direction: 'left' | 'right') => void;
}

export function SwipeButtons({ onSwipe }: SwipeButtonsProps) {
  const { openDetails } = useApp();

  const buttonClass = "h-20 w-20 rounded-full shadow-lg transform hover:scale-110 transition-transform duration-200 ease-in-out flex items-center justify-center backdrop-blur-sm border-2";

  return (
    <div className="flex items-center justify-evenly w-full max-w-sm py-6 px-4 z-10">
      <Button
        onClick={() => onSwipe('left')}
        variant="outline"
        className={`${buttonClass} border-red-500/50 bg-red-950/20 text-red-400 hover:bg-red-950/50 hover:text-red-300`}
        aria-label="Dislike"
      >
        <X size={40} strokeWidth={2.5} />
      </Button>
      <Button
        onClick={openDetails}
        variant="outline"
        className="h-12 w-12 rounded-full shadow-md text-base font-semibold border-neutral-600/80 bg-neutral-800/30 text-neutral-300 hover:bg-neutral-700/50 flex items-center justify-center backdrop-blur-sm"
        aria-label="More Info"
      >
        <Info size={24} />
      </Button>
      <Button
        onClick={() => onSwipe('right')}
        variant="outline"
        className={`${buttonClass} border-green-500/50 bg-green-950/20 text-green-400 hover:bg-green-950/50 hover:text-green-300`}
        aria-label="Like"
      >
        <Heart size={40} strokeWidth={2.5} />
      </Button>
    </div>
  );
}
