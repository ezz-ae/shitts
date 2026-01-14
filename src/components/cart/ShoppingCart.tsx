"use client";

import { useApp } from '@/hooks/useApp';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { CartItemCard } from './CartItemCard';
import { ShoppingBag, ArrowRight, Trash2, CreditCard } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

export function ShoppingCart() {
  const { cart, isCartOpen, closeCart, checkout, isLoading } = useApp();
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'ziina'>('paypal');

  const total = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col border-l-0 rounded-l-[2rem] overflow-hidden">
        <SheetHeader className="p-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <SheetTitle className="text-3xl font-black tracking-tighter">Your Bag</SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col px-8">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center opacity-50">
                <ShoppingBag className="w-12 h-12" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">Your bag is empty</h3>
              <Button onClick={closeCart} className="rounded-xl font-bold px-8">Start Swiping</Button>
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
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Payment Method</h4>
                <div className="grid grid-cols-2 gap-3">
                    <Button 
                        onClick={() => setPaymentMethod('paypal')}
                        variant="ghost" 
                        className={cn("h-16 flex-col gap-1 rounded-2xl border-2 transition-all", paymentMethod === 'paypal' ? "border-pink-500 bg-pink-50" : "border-gray-100 bg-gray-50/50")}
                    >
                        <span className="font-black text-xs uppercase italic text-blue-800">PayPal</span>
                    </Button>
                    <Button 
                        onClick={() => setPaymentMethod('ziina')}
                        variant="ghost" 
                        className={cn("h-16 flex-col gap-1 rounded-2xl border-2 transition-all", paymentMethod === 'ziina' ? "border-pink-500 bg-pink-50" : "border-gray-100 bg-gray-50/50")}
                    >
                        <span className="font-black text-xs uppercase text-black">Ziina</span>
                    </Button>
                </div>

                <Separator className="bg-foreground/5" />
                <div className="flex justify-between items-end pt-2">
                    <span className="text-xl font-black tracking-tighter uppercase">Total</span>
                    <span className="text-3xl font-black tracking-tighter text-pink-500">${total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="p-8 pt-0">
            <Button 
                onClick={() => checkout(paymentMethod)} 
                disabled={isLoading}
                className="w-full h-16 rounded-2xl text-xl font-black shadow-xl shadow-pink-200 transition-all group bg-black text-white hover:bg-black/90"
            >
              {isLoading ? "Processing..." : "PAY & SECURE"}
              {!isLoading && <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />}
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}

import { cn } from '@/lib/utils';
