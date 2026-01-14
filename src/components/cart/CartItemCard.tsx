"use client";

import Image from 'next/image';
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
      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-md border">
        <Image
          src={item.product.imageUrl}
          alt={item.product.name}
          fill
          data-ai-hint={item.product.imageHint}
          className="object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col justify-between h-24">
        <div>
            <h3 className="font-semibold line-clamp-2 leading-tight">{item.product.name}</h3>
            <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)}</p>
        </div>
        <div className="flex items-center justify-between mt-2">
           <div className="flex items-center">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                >
                    -
                </Button>
                <Input
                    type="text"
                    value={item.quantity}
                    readOnly
                    className="h-7 w-10 text-center border-0"
                />
                <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                >
                    +
                </Button>
           </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={() => removeFromCart(item.product.id)}>
                Remove
            </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
