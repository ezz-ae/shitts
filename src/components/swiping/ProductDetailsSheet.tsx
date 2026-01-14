"use client";

import Image from 'next/image';
import { useApp } from '@/hooks/useApp';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { ShoppingBag, Star, ShieldCheck, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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
      <SheetContent side="bottom" className="h-[92svh] rounded-t-[2.5rem] p-0 overflow-hidden border-t-0 flex flex-col">
        <div className="relative h-[45%] w-full">
           <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            data-ai-hint={product.imageHint}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/30 rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-8 pt-2 pb-32">
          <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-bold">PREMIUM STYLE</Badge>
                    <div className="flex items-center gap-1 text-sm font-bold text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span>4.9 (124 reviews)</span>
                    </div>
                </div>
                <SheetHeader className="text-left space-y-0">
                    <SheetTitle className="text-4xl font-black tracking-tighter leading-tight">
                        {product.name}
                    </SheetTitle>
                    <div className="text-3xl font-bold text-primary mt-1">
                        ${product.price.toFixed(2)}
                    </div>
                </SheetHeader>
            </div>

            <Separator className="bg-foreground/5" />

            <div className="space-y-3">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">About this piece</h3>
                <SheetDescription className="text-lg leading-relaxed text-foreground/80">
                {product.description}
                </SheetDescription>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/50">
                    <Truck className="w-5 h-5 text-primary" />
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase">Shipping</p>
                        <p className="text-sm font-bold">Free Delivery</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/50">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase">Warranty</p>
                        <p className="text-sm font-bold">2 Year Quality</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 pt-4 glass border-t border-white/5">
          <Button 
            onClick={addToCartAndClose} 
            size="lg" 
            className="w-full h-16 rounded-2xl text-xl font-black shadow-xl shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <ShoppingBag className="mr-3 w-6 h-6" />
            ADD TO BAG
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
