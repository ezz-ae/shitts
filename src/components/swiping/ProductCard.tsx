"use client";

import React, { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';
import { Sparkles, DollarSign } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
  dragX: number;
  onDrag?: (x: number) => void;
  topDragX: number;
}

export function ProductCard({ product, isTop, onSwipe, dragX, onDrag, topDragX }: ProductCardProps) {
  const [style, setStyle] = useState({ transform: '', opacity: 1 });
  const [overlayStyle, setOverlayStyle] = useState({ opacity: 0 });
  const [overlayText, setOverlayText] = useState('');
  
  const cardRef = useRef<HTMLDivElement>(null);
  const startPoint = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const SWIPE_THRESHOLD = screenWidth * 0.4; 

  const progress = useMemo(() => {
    if (isTop) return 0;
    return Math.min(Math.max(0, Math.abs(topDragX) - 20) / (screenWidth * 0.6), 1);
  }, [isTop, topDragX, screenWidth]);

  const bottomCardEffect = useMemo(() => {
    if (isTop) return {};
    const scale = 1.08 - (progress * 0.08); 
    const opacity = progress;
    const blur = 30 - (progress * 30); 
    return { transform: `scale(${scale})`, filter: `blur(${blur}px)`, opacity, visibility: opacity > 0 ? 'visible' : 'hidden' };
  }, [isTop, progress]);

  const infoOpacity = isTop ? 1 : progress;

  const animateAndSwipe = (direction: 'left' | 'right') => {
    const endX = direction === 'right' ? screenWidth * 1.5 : -screenWidth * 1.5;
    setStyle({ transform: `translateX(${endX}px) rotate(${direction === 'right' ? 15 : -15}deg)`, opacity: 0 });
    setTimeout(() => onSwipe(direction), 200);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isTop) return;
    isDragging.current = true;
    startPoint.current = { x: e.clientX, y: e.clientY };
    cardRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !isTop) return;
    const deltaX = e.clientX - startPoint.current.x;
    if (onDrag) onDrag(deltaX);
    const rotation = (deltaX / screenWidth) * 12;
    setStyle({ transform: `translateX(${deltaX}px) rotate(${rotation}deg)`, opacity: 1 });
    
    if (Math.abs(deltaX) > 30) {
      setOverlayStyle({ opacity: Math.min(Math.abs(deltaX) / (screenWidth * 0.4), 0.8) });
      setOverlayText(deltaX > 0 ? (product.isCreditCard ? 'CLAIM' : 'LIKE') : 'NOPE');
    } else {
      setOverlayStyle({ opacity: 0 });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !isTop) return;
    isDragging.current = false;
    cardRef.current?.releasePointerCapture(e.pointerId);

    const deltaX = e.clientX - startPoint.current.x;
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      animateAndSwipe(deltaX > 0 ? 'right' : 'left');
    } else {
      setStyle({ transform: 'translateX(0px) rotate(0deg)', opacity: 1 });
      setOverlayStyle({ opacity: 0 });
      if (onDrag) onDrag(0);
    }
  };

  // Support for both .mp4 and .mov
  const isVideoProduct = product.imageUrl.toLowerCase().endsWith('.mp4') || product.imageUrl.toLowerCase().includes('.mov');
  
  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "absolute inset-0 overflow-hidden bg-black touch-none",
        isTop ? "z-20" : "z-10"
      )}
      style={
        isTop 
        ? { ...style, transition: isDragging.current ? 'none' : 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)' }
        : { ...(bottomCardEffect as any), transition: 'all 0.1s linear' }
      }
    >
      {isVideoProduct ? (
          <video 
            src={product.imageUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
      ) : (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="100vw"
            priority={isTop}
            className="object-cover pointer-events-none select-none"
            unoptimized={product.imageUrl.includes('firebasestorage')} // Ensures storage PNGs render correctly
          />
      )}
      
      {isTop && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 transition-opacity"
          style={{ 
            backgroundColor: overlayText === 'LIKE' || overlayText === 'CLAIM' ? 'rgba(255,105,180,0.1)' : 'rgba(0,0,0,0.1)',
            opacity: overlayStyle.opacity 
          }}
        >
          <span className={cn(
            "text-3xl font-black px-6 py-2 border-2 rounded-xl tracking-[0.4em] backdrop-blur-md",
            overlayText === 'LIKE' || overlayText === 'CLAIM' ? "text-pink-500 border-pink-500" : "text-white border-white"
          )}>
            {overlayText}
          </span>
        </div>
      )}

      {product.isCreditCard && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-12 bg-black/40 backdrop-blur-sm">
             <div className="w-32 h-32 bg-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-pink-500/50 mb-6 animate-bounce">
                <DollarSign className="w-16 h-16 text-white" />
             </div>
             <div className="text-center space-y-2">
                 <h3 className="text-3xl font-black text-white tracking-tight leading-none uppercase">Bonus Style Credit</h3>
                 <p className="text-pink-200 font-bold uppercase tracking-widest text-xs">Unlock ${product.creditAmount} Instantly</p>
             </div>
          </div>
      )}

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />
      
      <div 
        className="absolute bottom-0 left-0 right-0 p-12 pb-32 text-white z-20 pointer-events-none"
        style={{ opacity: infoOpacity }}
      >
        <h2 className="text-4xl font-black tracking-tighter leading-none mb-2 drop-shadow-2xl uppercase">
          {product.name}
        </h2>
        <p className="text-xl font-bold opacity-70 drop-shadow-xl">
          {product.isCreditCard ? `WORTH $${product.creditAmount}` : `$${product.price.toFixed(2)}`}
        </p>
      </div>
    </div>
  );
}
