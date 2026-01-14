"use client";

import React, { useState } from 'react';
import { useApp } from '@/hooks/useApp';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { 
  Package, Heart, CreditCard, MapPin, 
  ArrowLeft, RefreshCw, AlertCircle, ShoppingBag, 
  TrendingUp, TrendingDown, Clock, Sparkles
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';

type ProfileTab = 'main' | 'orders' | 'delivery' | 'wallet';

export function UserProfile() {
  const { isProfileOpen, closeProfile } = useApp();
  const [activeTab, setActiveTab] = useState<ProfileTab>('main');

  const renderContent = () => {
    switch (activeTab) {
      case 'orders': return <OrdersTab onBack={() => setActiveTab('main')} />;
      case 'delivery': return <DeliveryTab onBack={() => setActiveTab('main')} />;
      case 'wallet': return <WalletTab onBack={() => setActiveTab('main')} />;
      default: return <MainProfileTab onSelect={setActiveTab} />;
    }
  };

  return (
    <Sheet open={isProfileOpen} onOpenChange={closeProfile}>
      <SheetContent side="right" className="w-full sm:max-w-md border-l-0 p-0 flex flex-col bg-white overflow-hidden">
        {renderContent()}
      </SheetContent>
    </Sheet>
  );
}

function MainProfileTab({ onSelect }: { onSelect: (tab: ProfileTab) => void }) {
  const { userProfile, stylePersona } = useApp();
  
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 pt-16 flex justify-between items-start">
        <div className="space-y-1">
            <h3 className="text-3xl font-black tracking-tighter uppercase leading-none">{userProfile.name}</h3>
            <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.3em]">{stylePersona}</p>
        </div>
        <Badge className="bg-zinc-100 text-zinc-400 border-none font-black text-[9px] px-3 py-1 uppercase">Beta v1</Badge>
      </div>

      <div className="px-8 mb-4">
        <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-300">Your Picked Items</h4>
      </div>

      <div className="flex-1 overflow-hidden px-8">
        <ScrollArea className="h-full pr-4">
            <div className="space-y-4 pb-32">
                {userProfile.picked.length === 0 ? (
                    <div className="h-40 flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-50 rounded-[2rem] opacity-20 italic">
                        <ShoppingBag className="w-8 h-8 mb-2" />
                        <p className="text-xs">No items picked yet</p>
                    </div>
                ) : (
                    userProfile.picked.map(p => (
                        <div key={p.id} className="group relative aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden bg-zinc-100 shadow-sm border border-zinc-50 transition-transform active:scale-[0.98]">
                            <Image src={p.imageUrl} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h5 className="font-black text-sm uppercase tracking-tight">{p.name}</h5>
                                <p className="text-xs font-bold opacity-70">${p.price}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </ScrollArea>
      </div>

      <div className="p-8 pt-4 bg-white border-t border-zinc-50 space-y-3">
        <div className="grid grid-cols-3 gap-3">
            <Button onClick={() => onSelect('orders')} variant="ghost" className="flex flex-col gap-2 h-20 bg-zinc-50 rounded-2xl hover:bg-pink-50 hover:text-pink-500 transition-all border border-transparent">
                <Package className="w-5 h-5" />
                <span className="text-[8px] font-black uppercase tracking-widest leading-none">Orders</span>
            </Button>
            <Button onClick={() => onSelect('delivery')} variant="ghost" className="flex flex-col gap-2 h-20 bg-zinc-50 rounded-2xl hover:bg-pink-50 hover:text-pink-500 transition-all border border-transparent">
                <MapPin className="w-5 h-5" />
                <span className="text-[8px] font-black uppercase tracking-widest leading-none">Delivery</span>
            </Button>
            <Button onClick={() => onSelect('wallet')} variant="ghost" className="flex flex-col gap-2 h-20 bg-zinc-50 rounded-2xl hover:bg-pink-50 hover:text-pink-500 transition-all border border-transparent">
                <CreditCard className="w-5 h-5" />
                <span className="text-[8px] font-black uppercase tracking-widest leading-none">Credit</span>
            </Button>
        </div>
      </div>
    </div>
  );
}

function OrdersTab({ onBack }: { onBack: () => void }) {
  const { userProfile } = useApp();
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 pt-16 flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="icon" className="rounded-full bg-zinc-50"><ArrowLeft className="w-5 h-5"/></Button>
        <h3 className="text-2xl font-black uppercase tracking-tighter">Orders</h3>
      </div>
      <ScrollArea className="flex-1 px-8">
        <div className="space-y-6 pb-12">
            {userProfile.orderHistory.map(order => (
                <div key={order.id} className="p-6 rounded-[2rem] border border-zinc-100 bg-white shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400">{order.date}</p>
                            <h4 className="font-black text-sm tracking-tight uppercase">{order.id}</h4>
                        </div>
                        <Badge className="bg-pink-500 text-white border-none uppercase font-black text-[8px]">{order.status}</Badge>
                    </div>
                    <div className="flex gap-2">
                        {order.items.map(i => (
                            <div key={i.product.id} className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-50">
                                <Image src={i.product.imageUrl} alt={i.product.name} fill className="object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </ScrollArea>
    </div>
  );
}

function DeliveryTab({ onBack }: { onBack: () => void }) {
  const { userProfile } = useApp();
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 pt-16 flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="icon" className="rounded-full bg-zinc-50"><ArrowLeft className="w-5 h-5"/></Button>
        <h3 className="text-2xl font-black uppercase tracking-tighter">Delivery</h3>
      </div>
      <div className="flex-1 px-8 space-y-6">
        <div className="p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100">
            <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-3">Saved Locations</h4>
            <div className="space-y-4">
                {userProfile.locations.map((loc, i) => (
                    <div key={i} className="flex gap-4 items-center">
                        <MapPin className="w-4 h-4 text-pink-500" />
                        <span className="text-xs font-bold text-zinc-700">{loc}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}

function WalletTab({ onBack }: { onBack: () => void }) {
  const { userProfile } = useApp();
  
  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-8 pt-16 flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="icon" className="rounded-full bg-zinc-50"><ArrowLeft className="w-5 h-5"/></Button>
        <h3 className="text-2xl font-black uppercase tracking-tighter">Wallet</h3>
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="px-8 mb-10">
            <div className="p-10 rounded-[3rem] bg-black text-white flex flex-col items-center justify-center space-y-2 shadow-2xl shadow-zinc-200">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Style Balance</span>
                <span className="text-5xl font-black tracking-tighter">${userProfile.credit}</span>
                <div className="pt-4 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-pink-500" />
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Premium Credits</p>
                </div>
            </div>
        </div>

        <div className="px-8 flex-1 flex flex-col overflow-hidden">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-300 mb-4">Transaction History</h4>
            <ScrollArea className="flex-1 pr-4">
                <div className="space-y-3 pb-8">
                    {(!userProfile.creditHistory || userProfile.creditHistory.length === 0) ? (
                        <div className="h-40 flex items-center justify-center text-center text-zinc-300 italic text-xs">
                            No transactions yet
                        </div>
                    ) : (
                        userProfile.creditHistory.map(entry => (
                            <div key={entry.id} className="flex items-center justify-between p-5 bg-zinc-50 rounded-2xl border border-zinc-100">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                                        entry.type === 'CREDIT' ? "bg-green-50 text-green-500" : "bg-zinc-200 text-zinc-600"
                                    )}>
                                        {entry.type === 'CREDIT' ? <TrendingUp className="w-5 h-5"/> : <TrendingDown className="w-5 h-5"/>}
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-black uppercase tracking-tight text-zinc-900">{entry.description}</p>
                                        <div className="flex items-center gap-2 text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                                            <Clock className="w-3 h-3"/>
                                            {new Date(entry.timestamp).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className={cn(
                                    "font-black text-sm",
                                    entry.type === 'CREDIT' ? "text-green-500" : "text-zinc-400"
                                )}>
                                    {entry.type === 'CREDIT' ? '+' : '-'}${entry.amount}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>
        </div>
      </div>
    </div>
  );
}
