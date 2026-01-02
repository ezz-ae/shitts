"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import type { Product } from '@/types';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
  swipeTrigger: { direction: 'left' | 'right', key: number } | null;
}

export function ProductCard({ product, isTop, onSwipe, swipeTrigger }: ProductCardProps) {
  const [style, setStyle] = useState({ transform: '', opacity: 1 });
  const [overlayStyle, setOverlayStyle] = useState({ opacity: 0, color: '' });
  const [overlayText, setOverlayText] = useState('');
  
  const cardRef = useRef<HTMLDivElement>(null);
  const startPoint = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 0;
  const SWIPE_THRESHOLD = screenWidth / 4;

  const animateAndSwipe = (direction: 'left' | 'right') => {
    const endX = direction === 'right' ? screenWidth : -screenWidth;
    const rotation = (endX / screenWidth) * 20;
    
    setStyle({
      transform: `translateX(${endX}px) rotate(${rotation}deg)`,
      opacity: 0,
    });
    
    setTimeout(() => {
      onSwipe(direction);
    }, 300);
  };
  
  useEffect(() => {
    if (swipeTrigger) {
      animateAndSwipe(swipeTrigger.direction);
    }
  }, [swipeTrigger]);


  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isTop) return;
    isDragging.current = true;
    startPoint.current = { x: e.clientX, y: e.clientY };
    cardRef.current?.setPointerCapture(e.pointerId);
    cardRef.current?.style.setProperty('transition', 'none');
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !isTop) return;

    const deltaX = e.clientX - startPoint.current.x;
    const deltaY = e.clientY - startPoint.current.y;
    const rotation = (deltaX / screenWidth) * 20; // Rotate up to 20 degrees

    setStyle({ transform: `translate(${deltaX}px, ${deltaY}px) rotate(${rotation}deg)`, opacity: 1 });
    
    const opacity = Math.min(Math.abs(deltaX) / SWIPE_THRESHOLD, 1);
    if (deltaX > 0) {
      setOverlayStyle({ opacity, color: 'rgba(10, 200, 110, 0.7)' });
      setOverlayText('LIKE');
    } else {
      setOverlayStyle({ opacity, color: 'rgba(255, 77, 77, 0.7)' });
      setOverlayText('NOPE');
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !isTop) return;
    isDragging.current = false;
    cardRef.current?.releasePointerCapture(e.pointerId);
    cardRef.current?.style.removeProperty('transition');

    const deltaX = e.clientX - startPoint.current.x;

    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      animateAndSwipe(deltaX > 0 ? 'right' : 'left');
    } else {
      // Animate back to center
      setStyle({ transform: 'translate(0px, 0px) rotate(0deg)', opacity: 1 });
    }
    setOverlayStyle({ opacity: 0, color: '' });
  };
  
  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn(
        "absolute w-full h-full rounded-2xl overflow-hidden bg-card shadow-2xl transition-transform duration-300 ease-in-out",
        isTop ? "cursor-grab active:cursor-grabbing" : "touch-none"
      )}
      style={{
        ...style,
        transformOrigin: 'center',
        willChange: 'transform, opacity',
      }}
    >
      <Image
        src={product.imageUrl}
        alt={product.name}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        priority={isTop}
        className="object-cover pointer-events-none"
        data-ai-hint={product.imageHint}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white pointer-events-none">
        <h2 className="text-3xl font-bold">{product.name}</h2>
        <p className="text-xl font-medium">${product.price.toFixed(2)}</p>
      </div>

      {/* Swipe Overlay */}
      <div
        className="absolute inset-0 flex items-center justify-center transition-opacity pointer-events-none"
        style={{ ...overlayStyle }}
      >
        <p className="text-5xl font-extrabold text-white tracking-widest border-4 border-white px-4 py-2 rounded-xl"
           style={{ transform: overlayText === 'NOPE' ? 'rotate(-15deg)' : 'rotate(15deg)' }}>
          {overlayText}
        </p>
      </div>
    </div>
  );
}
