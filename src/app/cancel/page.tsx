"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function CancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center space-y-8 bg-white">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
        <XCircle className="w-12 h-12 text-red-400" />
      </div>

      <div className="space-y-3">
        <h1 className="text-4xl font-black tracking-tighter uppercase">Payment Cancelled</h1>
        <p className="text-gray-500 font-medium max-w-[280px] mx-auto leading-relaxed">
          No worries! Your bag is still saved. You can try again whenever you're ready.
        </p>
      </div>

      <div className="w-full max-w-xs pt-8">
        <Button asChild className="w-full h-14 bg-black text-white rounded-2xl font-bold text-lg">
          <Link href="/">
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back to Bag
          </Link>
        </Button>
      </div>
    </div>
  );
}
