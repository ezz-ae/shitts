import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="bg-card border-b border-border py-4 px-6 flex items-center justify-between shadow-sm">
      <Link href="/" className="text-2xl font-headline font-bold text-foreground">
        StyleSwipe
      </Link>
      <nav className="flex items-center space-x-4">
        <Button variant="ghost" asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/left">Left</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/right">Right</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/admin">Admin</Link>
        </Button>
      </nav>
    </header>
  );
};
