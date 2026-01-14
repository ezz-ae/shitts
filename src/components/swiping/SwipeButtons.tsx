"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/useApp';
import { X, Circle } from 'lucide-react';

interface SwipeButtonsProps {
  onSwipe: (direction: 'left' | 'right') => void;
}

const UpTriangle = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="white"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 5l-7 14h14z" />
  </svg>
);


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
        <X size={64} strokeWidth={2.5} className="text-white" />
      </Button>
      <Button
        onClick={openDetails}
        variant="ghost"
        className={buttonClass}
        aria-label="More Info"
      >
        <Circle size={56} strokeWidth={2.5} className="text-white" />
      </Button>
      <Button
        onClick={openCart}
        variant="ghost"
        className={buttonClass}
        aria-label="Open Cart"
      >
        <UpTriangle />
      </Button>
    </div>
  );
}
