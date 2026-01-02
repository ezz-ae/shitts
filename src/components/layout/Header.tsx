"use client";

import { ShoppingCart as CartIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/hooks/useApp';

const Header = () => {
  const { openCart, cart } = useApp();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-transparent">
      <h1 className="text-2xl font-extrabold text-primary tracking-tighter">
        StyleSwipe
      </h1>
      <Button onClick={openCart} variant="ghost" size="icon" className="relative text-foreground/80 hover:text-primary hover:bg-primary/10">
        <CartIcon className="h-6 w-6" />
        {cartItemCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            {cartItemCount}
          </span>
        )}
        <span className="sr-only">Open shopping cart</span>
      </Button>
    </header>
  );
};

export default Header;
