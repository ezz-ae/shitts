import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="bg-background border-b border-border py-3 px-4 flex items-center justify-between sticky top-0 z-50">
      <Link href="/" className="text-xl font-headline font-bold text-foreground">
        StyleSwipe
      </Link>
      <nav className="flex items-center space-x-2">
        <Button variant="ghost" asChild size="sm">
          <Link href="/cart">Cart</Link>
        </Button>
        <Button variant="ghost" asChild size="sm">
          <Link href="/admin">Admin</Link>
        </Button>
      </nav>
    </header>
  );
};
