"use client";

import React, { useState, useRef, useMemo } from 'react';
import Image from 'next/image';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
  dragX: number;
  onDrag?: (x: number) => void;
  topDragX: number; // Current drag distance of the card on top
}

export function ProductCard({ product, isTop, onSwipe, dragX, onDrag, topDragX }: ProductCardProps) {
  const [style, setStyle] = useState({ transform: '', opacity: 1 });
  const [overlayStyle, setOverlayStyle] = useState({ opacity: 0 });
  const [overlayText, setOverlayText] = useState('');
  
  const cardRef = useRef<HTMLDivElement>(null);
  const startPoint = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const SWIPE_THRESHOLD = 110;

  // Smart Background Motion Logic:
  // Progress goes from 0 to 1 as the top card is swiped away
  const progress = useMemo(() => {
    if (isTop) return 0;
    return Math.min(Math.abs(topDragX) / (screenWidth * 0.7), 1);
  }, [isTop, topDragX, screenWidth]);

  const bottomCardEffect = useMemo(() => {
    if (isTop) return {};
    
    // Bottom card starts slightly zoomed in and blurred
    const scale = 1.1 - (progress * 0.1); // 1.1 down to 1.0
    const blur = 20 - (progress * 20); // 20px down to 0px
    const opacity = 0.4 + (progress * 0.6); // 0.4 up to 1.0
    
    return {
        transform: `scale(${scale})`,
        filter: `blur(${blur}px)`,
        opacity
    };
  }, [isTop, progress]);

  // Info (Text) should only be fully visible when it's the top card
  // For the bottom card, we fade it in as the top card leaves
  const infoOpacity = isTop ? 1 : progress;

  const animateAndSwipe = (direction: 'left' | 'right') => {
    const endX = direction === 'right' ? screenWidth * 1.5 : -screenWidth * 1.5;
    setStyle({
      transform: `translateX(${endX}px) rotate(${direction === 'right' ? 20 : -20}deg)`,
      opacity: 0,
    });
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
    const deltaY = e.clientY - startPoint.current.y;
    
    if (onDrag) onDrag(deltaX);

    const rotation = (deltaX / screenWidth) * 12;
    setStyle({ 
        transform: `translate(${deltaX}px, ${deltaY * 0.05}px) rotate(${rotation}deg)`, 
        opacity: 1 
    });
    
    if (Math.abs(deltaX) > 25) {
      setOverlayStyle({ opacity: Math.min(Math.abs(deltaX) / 150, 0.6) });
      setOverlayText(deltaX > 0 ? 'LIKE' : 'NOPE');
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
      setStyle({ transform: 'translate(0px, 0px) rotate(0deg)', opacity: 1 });
      setOverlayStyle({ opacity: 0 });
      if (onDrag) onDrag(0);
    }
  };
  
  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "absolute inset-0 overflow-hidden bg-black select-none",
        isTop ? "z-20 shadow-2xl" : "z-10"
      )}
      style={
        isTop 
        ? { ...style, transition: isDragging.current ? 'none' : 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)' }
        : { ...(bottomCardEffect as any), transition: 'all 0.1s linear' }
      }
    >
      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        sizes="100vw"
        priority={isTop}
        className="object-cover pointer-events-none"
      />
      
      {/* Swipe Feedback Overlay - Only on top card */}
      {isTop && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 transition-opacity"
          style={{ 
            backgroundColor: overlayText === 'LIKE' ? 'rgba(255,105,180,0.1)' : 'rgba(0,0,0,0.1)',
            opacity: overlayStyle.opacity 
          }}
        >
          <span className={cn(
            "text-3xl font-black px-5 py-2 border-2 rounded-xl tracking-[0.3em] backdrop-blur-sm",
            overlayText === 'LIKE' ? "text-pink-500 border-pink-500" : "text-white border-white"
          )}>
            {overlayText}
          </span>
        </div>
      )}

      {/* Cinematic Shadow Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10" />
      
      {/* Product Info - Animated to avoid overlap noise */}
      <div 
        className="absolute bottom-0 left-0 right-0 p-12 text-white z-20 pointer-events-none transition-opacity duration-300"
        style={{ opacity: infoOpacity }}
      >
        <h2 className="text-4xl font-black tracking-tighter leading-none mb-1 drop-shadow-lg">
          {product.name}
        </h2>
        <p className="text-lg font-bold opacity-80 drop-shadow-md">
          ${product.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
