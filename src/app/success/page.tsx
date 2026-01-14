"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/hooks/useApp';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ShoppingBag, Sparkles } from 'lucide-react';

export default function SuccessPage() {
  const { resetDeck } = useApp();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center space-y-8 bg-white">
      <div className="relative">
        <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center animate-in zoom-in duration-500">
          <CheckCircle2 className="w-12 h-12 text-pink-500" />
        </div>
        <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-pink-300 animate-pulse" />
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-black tracking-tighter uppercase">Order Confirmed</h1>
        <p className="text-gray-500 font-medium max-w-[280px] mx-auto leading-relaxed">
          Your daily edit is secured. We've updated your Style DNA with these choices.
        </p>
      </div>

      <div className="w-full max-w-xs pt-8 space-y-4">
        <Button asChild className="w-full h-14 bg-black text-white rounded-2xl font-bold text-lg shadow-xl shadow-gray-200">
          <Link href="/">Back to Daily Feed</Link>
        </Button>
        <Button variant="ghost" asChild className="w-full h-14 rounded-2xl font-bold text-pink-500">
          <Link href="/">View My Style Profile</Link>
        </Button>
      </div>
    </div>
  );
}
