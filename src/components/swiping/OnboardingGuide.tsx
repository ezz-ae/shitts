"use client";

import React, { useState, useEffect } from 'react';
import { X, Heart, Smartphone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OnboardingGuide() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('style_swipe_onboarding_seen');
    if (!hasSeenGuide) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        handleDismiss();
      }, 20000); // 20 seconds
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('style_swipe_onboarding_seen', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
      <div className="relative w-full max-w-sm bg-white rounded-[3rem] overflow-hidden shadow-2xl p-10 space-y-8">
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDismiss}
            className="absolute top-6 right-6 text-zinc-300 hover:text-zinc-900"
        >
            <X className="w-6 h-6" />
        </Button>

        <div className="space-y-2 text-center">
            <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-200">
                <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Style Scan</h2>
            <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em]">Mastering Discovery</p>
        </div>

        <div className="space-y-6">
            <div className="flex items-center gap-5">
                <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-pink-500">
                    <Heart className="w-5 h-5 fill-current" />
                </div>
                <div className="space-y-0.5">
                    <p className="text-xs font-black uppercase tracking-tight text-zinc-900">Swipe Right</p>
                    <p className="text-[10px] font-bold text-zinc-400">Add item to your secure bag.</p>
                </div>
            </div>

            <div className="flex items-center gap-5">
                <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400">
                    <Smartphone className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                    <p className="text-xs font-black uppercase tracking-tight text-zinc-900">Swipe Left</p>
                    <p className="text-[10px] font-bold text-zinc-400">Skip to refine your Style DNA.</p>
                </div>
            </div>

            <div className="flex items-center gap-5">
                <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-blue-500">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                    <p className="text-xs font-black uppercase tracking-tight text-zinc-900">Claim Credits</p>
                    <p className="text-[10px] font-bold text-zinc-400">Look for bonus cards to earn rewards.</p>
                </div>
            </div>
        </div>

        <Button 
            onClick={handleDismiss}
            className="w-full h-14 bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-zinc-900 transition-all active:scale-95 shadow-xl"
        >
            Start Session
        </Button>
      </div>
    </div>
  );
}
