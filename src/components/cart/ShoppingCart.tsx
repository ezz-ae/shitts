"use client";

import { useApp } from '@/hooks/useApp';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { CartItemCard } from './CartItemCard';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function ShoppingCart() {
  const { cart, isCartOpen, closeCart, checkout, isLoading, userProfile } = useApp();

  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const creditToApply = Math.min(userProfile.credit, total);
  const finalTotal = total - creditToApply;

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col border-l-0 rounded-l-[2rem] overflow-hidden bg-white">
        <SheetHeader className="p-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-pink-500" />
                </div>
                <SheetTitle className="text-3xl font-black tracking-tighter uppercase">Your Bag</SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col px-8">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center opacity-50">
                <ShoppingBag className="w-12 h-12 text-pink-300" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight uppercase">Bag is empty</h3>
              <Button onClick={closeCart} className="rounded-xl font-black px-8 bg-black text-white">Start Swiping</Button>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-2 px-2">
                <div className="space-y-4 py-4">
                  {cart.map((item) => (
                    <CartItemCard key={item.product.id} item={item} />
                  ))}
                </div>
              </ScrollArea>
              
              <div className="py-6 space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    
                    {userProfile.credit > 0 && (
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-emerald-500">
                            <span>Style Credit Applied</span>
                            <span>-${creditToApply.toFixed(2)}</span>
                        </div>
                    )}

                    <Separator className="bg-gray-100 my-2" />
                    
                    <div className="flex justify-between items-end">
                        <span className="text-xl font-black tracking-tighter uppercase">Total</span>
                        <div className="text-right">
                            <span className="text-3xl font-black tracking-tighter text-pink-500">${finalTotal.toFixed(2)}</span>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">VAT Included</p>
                        </div>
                    </div>
                </div>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="p-8 pt-0">
            {/* The choice of payment method is now pushed to the next logic step */}
            <Button 
                onClick={() => checkout('ziina')} // Defaulting to the best local/mobile experience
                disabled={isLoading}
                className="w-full h-16 rounded-2xl text-xl font-black shadow-2xl shadow-pink-100 transition-all group bg-black text-white hover:bg-black/90 active:scale-95"
            >
              {isLoading ? "PREPARING..." : "PROCEED TO SECURE"}
              {!isLoading && <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
