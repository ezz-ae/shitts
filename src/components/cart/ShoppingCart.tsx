"use client";

import { useApp } from '@/hooks/useApp';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import CartItemCard from './CartItemCard';

export function ShoppingCart() {
  const { cart, isCartOpen, closeCart, checkout } = useApp();
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold">My Cart</SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        {cart.length > 0 ? (
          <>
            <ScrollArea className="flex-1 -mx-6">
              <div className="px-6 space-y-6">
                {cart.map(item => (
                  <CartItemCard key={item.product.id} item={item} />
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="mt-auto pt-6 border-t">
              <div className="w-full space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button size="lg" className="w-full text-lg" onClick={checkout}>
                  Checkout
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <p className="text-lg font-medium text-muted-foreground">Your cart is empty</p>
            <p className="text-sm text-muted-foreground mt-1">Swipe right on items to add them!</p>
            <SheetClose asChild>
                <Button variant="outline" className="mt-6">Continue Swiping</Button>
            </SheetClose>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
