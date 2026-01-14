"use client";

import Image from 'next/image';
import { useApp } from '@/hooks/useApp';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { ShoppingBag, Star, RefreshCcw, Truck } from 'lucide-react';
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
      <SheetContent side="bottom" className="h-[92svh] rounded-t-[2.5rem] p-0 overflow-hidden border-t-0 flex flex-col bg-white">
        <div className="relative h-[45%] w-full">
           <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            data-ai-hint={product.imageHint}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-white/30 rounded-full" />
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-8 pt-2 pb-32">
          <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="font-bold bg-pink-50 text-pink-500 border-none uppercase tracking-widest text-[10px]">{product.category || 'Premium Selection'}</Badge>
                    <div className="flex items-center gap-1 text-sm font-bold text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span>4.9</span>
                    </div>
                </div>
                <SheetHeader className="text-left space-y-0">
                    <SheetTitle className="text-4xl font-black tracking-tighter leading-tight uppercase">
                        {product.name}
                    </SheetTitle>
                    <div className="text-3xl font-bold text-pink-500 mt-1 tracking-tighter">
                        ${product.price.toFixed(2)}
                    </div>
                </SheetHeader>
            </div>

            <Separator className="bg-gray-100" />

            {/* Dynamic Attributes (Accessories vs Clothes) */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                    {Object.entries(product.attributes).map(([key, value]) => (
                        <div key={key} className="space-y-1">
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">{key}</p>
                            <p className="text-sm font-bold uppercase">{value}</p>
                        </div>
                    ))}
                </div>
            )}

            <div className="space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">The Story</h3>
                <SheetDescription className="text-lg leading-relaxed text-black/80 font-medium">
                {product.description}
                </SheetDescription>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3 p-5 rounded-3xl bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <Truck className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Delivery</p>
                        <p className="text-[11px] font-black uppercase">Free</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-5 rounded-3xl bg-gray-50 border border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                        <RefreshCcw className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Returns</p>
                        <p className="text-[11px] font-black uppercase">Refundable</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-8 pt-4 bg-white/80 backdrop-blur-xl border-t border-gray-100">
          <Button 
            onClick={addToCartAndClose} 
            size="lg" 
            className="w-full h-16 rounded-2xl text-xl font-black shadow-2xl shadow-pink-100 transition-all bg-black text-white active:scale-95"
          >
            <ShoppingBag className="mr-3 w-6 h-6" />
            ADD TO BAG
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
