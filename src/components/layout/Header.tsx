"use client";

import React from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 py-6 px-8 flex items-center justify-between bg-transparent">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-2xl font-black tracking-tighter text-pink-500">
          SHITTS
        </span>
      </Link>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="text-pink-500 hover:bg-pink-50 rounded-full"
      >
        <User className="w-6 h-6" />
      </Button>
    </header>
  );
};
