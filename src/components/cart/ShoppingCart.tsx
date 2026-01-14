"use client";

import { useApp } from '@/hooks/useApp';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { CartItemCard } from './CartItemCard';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function ShoppingCart() {
  const { cart, isCartOpen, closeCart, checkout, resetDeck } = useApp();

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
            {cart.length > 0 && (
                <Button variant="ghost" size="sm" onClick={() => {}} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-hidden flex flex-col px-8">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center opacity-50">
                <ShoppingBag className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold tracking-tight">Your bag is empty</h3>
                <p className="text-muted-foreground font-medium max-w-[250px]">
                  Swipe right on items you love to add them to your collection.
                </p>
              </div>
              <Button onClick={closeCart} className="rounded-xl font-bold px-8">
                Start Swiping
              </Button>
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
              
              <div className="py-8 space-y-6">
                <Separator className="bg-foreground/5" />
                <div className="space-y-2">
                    <div className="flex justify-between text-muted-foreground font-bold uppercase text-xs tracking-widest">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground font-bold uppercase text-xs tracking-widest">
                        <span>Shipping</span>
                        <span className="text-green-500">FREE</span>
                    </div>
                    <div className="flex justify-between items-end pt-2">
                        <span className="text-xl font-black tracking-tighter">TOTAL</span>
                        <span className="text-3xl font-black tracking-tighter text-primary">${total.toFixed(2)}</span>
                    </div>
                </div>
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="p-8 pt-0">
            <Button 
                onClick={checkout} 
                className="w-full h-16 rounded-2xl text-xl font-black shadow-xl shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] transition-all group"
            >
              CHECKOUT
              <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
