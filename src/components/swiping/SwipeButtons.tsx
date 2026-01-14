"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/useApp';
import { RotateCcw, Info, ShoppingBag } from 'lucide-react';

export function SwipeButtons() {
  const { openDetails, undoLastSwipe, openCart, cart } = useApp();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Ghost buttons that work perfectly on top of any image
  const buttonBaseClass = "text-white transition-all duration-300 active:scale-90 rounded-full";

  return (
    <div className="flex items-center justify-center gap-16 w-full z-30">
      <Button
        onClick={undoLastSwipe}
        variant="ghost"
        size="icon"
        className={`${buttonBaseClass} w-10 h-10 opacity-50 hover:opacity-100 bg-white/5 backdrop-blur-md`}
        aria-label="Undo"
      >
        <RotateCcw className="w-5 h-5" />
      </Button>

      <Button
        onClick={openDetails}
        variant="ghost"
        size="icon"
        className={`${buttonBaseClass} w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl`}
        aria-label="More Info"
      >
        <Info className="w-8 h-8" />
      </Button>

      <div className="relative">
        <Button
          onClick={openCart}
          variant="ghost"
          size="icon"
          className={`${buttonBaseClass} w-10 h-10 opacity-50 hover:opacity-100 bg-white/5 backdrop-blur-md`}
          aria-label="Open Cart"
        >
          <ShoppingBag className="w-5 h-5" />
        </Button>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white animate-in zoom-in">
            {cartCount}
          </span>
        )}
      </div>
    </div>
  );
}
