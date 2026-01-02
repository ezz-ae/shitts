"use client";

import Image from 'next/image';
import { useApp } from '@/hooks/useApp';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';

interface ProductDetailsSheetProps {
  product: Product;
}

export function ProductDetailsSheet({ product }: ProductDetailsSheetProps) {
  const { isDetailsOpen, closeDetails, handleSwipe } = useApp();

  const addToCartAndClose = () => {
    handleSwipe(product.id, 'swipeRight');
    closeDetails();
  }

  return (
    <Sheet open={isDetailsOpen} onOpenChange={closeDetails}>
      <SheetContent side="bottom" className="h-[90svh] rounded-t-2xl flex flex-col">
        <div className="relative h-1/2 -mx-6 -mt-6">
           <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            data-ai-hint={product.imageHint}
            className="object-cover rounded-t-2xl"
          />
        </div>
        <SheetHeader className="text-left pt-6">
          <SheetTitle className="text-3xl font-bold">{product.name}</SheetTitle>
          <p className="text-2xl font-semibold text-primary">${product.price.toFixed(2)}</p>
        </SheetHeader>
        <SheetDescription className="text-base py-4 flex-1 overflow-y-auto">
          {product.description}
        </SheetDescription>
        <SheetFooter>
          <Button onClick={addToCartAndClose} size="lg" className="w-full text-lg font-semibold">
            Add to Cart
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
