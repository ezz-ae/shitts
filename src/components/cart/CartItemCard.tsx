"use client";

import Image from 'next/image';
import type { CartItem } from '@/types';
import { useApp } from '@/hooks/useApp';
import { Button } from '@/components/ui/button';
import { Minus, Plus, X } from 'lucide-react';

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { removeFromCart, updateQuantity } = useApp();

  return (
    <div className="flex gap-4 p-4 rounded-2xl bg-secondary/30 border border-white/5 transition-all hover:bg-secondary/50 group">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-white/5">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          className="object-cover transition-transform group-hover:scale-110 duration-500"
        />
      </div>

      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-black tracking-tight text-lg leading-none mb-1">{item.product.name}</h3>
            <p className="text-primary font-bold">${item.product.price.toFixed(2)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeFromCart(item.product.id)}
            className="h-8 w-8 -mr-2 text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 bg-background/50 rounded-lg border border-white/5 p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md hover:bg-primary/10 hover:text-primary"
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md hover:bg-primary/10 hover:text-primary"
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <p className="font-black text-sm">
            ${(item.product.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
