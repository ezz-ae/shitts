"use client";

import Image from 'next/image';
import { X, Plus, Minus } from 'lucide-react';
import type { CartItem } from '@/types';
import { useApp } from '@/hooks/useApp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useApp();

  return (
    <div className="flex items-start space-x-4">
      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          data-ai-hint={item.product.imageHint}
          className="object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium line-clamp-2">{item.product.name}</h3>
        <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
        <div className="flex items-center mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
            className="h-8 w-12 text-center mx-2"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => removeFromCart(item.product.id)}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CartItemCard;
