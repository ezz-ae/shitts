"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/useApp';
import { RotateCcw, Info, ShoppingBag } from 'lucide-react';

export function SwipeButtons() {
  const { openDetails, undoLastSwipe, openCart, cart } = useApp();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const buttonBaseClass = "text-white transition-all duration-500 active:scale-90 rounded-full hover:scale-110";

  return (
    <div className="flex items-center justify-center gap-14 w-full z-30 px-6">
      <Button
        onClick={undoLastSwipe}
        variant="ghost"
        size="icon"
        className={`${buttonBaseClass} w-12 h-12 opacity-40 hover:opacity-100 bg-white/5 backdrop-blur-lg border border-white/5`}
        aria-label="Undo"
      >
        <RotateCcw className="w-6 h-6 stroke-[1.5]" />
      </Button>

      <Button
        onClick={openDetails}
        variant="ghost"
        size="icon"
        className={`${buttonBaseClass} w-20 h-20 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_0_50px_-12px_rgba(255,255,255,0.3)] group`}
        aria-label="More Info"
      >
        <div className="relative">
            <Info className="w-10 h-10 stroke-[1.2] group-hover:rotate-12 transition-transform duration-500" />
            <div className="absolute inset-0 blur-lg bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Button>

      <div className="relative">
        <Button
          onClick={openCart}
          variant="ghost"
          size="icon"
          className={`${buttonBaseClass} w-12 h-12 opacity-40 hover:opacity-100 bg-white/5 backdrop-blur-lg border border-white/5`}
          aria-label="Open Cart"
        >
          <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
        </Button>
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-black animate-in zoom-in shadow-lg">
            {cartCount}
          </span>
        )}
      </div>
    </div>
  );
}
