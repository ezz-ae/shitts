"use client";

import { useApp } from '@/hooks/useApp';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import CartItemCard from './CartItemCard';

export function ShoppingCart() {
  const { cart, isCartOpen, closeCart } = useApp();
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <Sheet open={isCartOpen} onOpenChange={closeCart}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl">My Cart</SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        {cart.length > 0 ? (
          <>
            <ScrollArea className="flex-1 -mx-6">
              <div className="px-6 space-y-4">
                {cart.map(item => (
                  <CartItemCard key={item.product.id} item={item} />
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto pt-4 border-t">
              <div className="w-full space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button size="lg" className="w-full bg-accent hover:bg-accent/90">
                  Checkout
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-lg font-medium">Your cart is empty</p>
            <p className="text-sm text-muted-foreground">Swipe right on items to add them!</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
