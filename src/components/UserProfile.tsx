"use client";

import React, { useState } from 'react';
import { useApp } from '@/hooks/useApp';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { 
  Package, Heart, CreditCard, ChevronRight, Sparkles, MapPin, 
  Phone, LogOut, ArrowLeft, RefreshCw, AlertCircle, Trash2 
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type ProfileTab = 'main' | 'wishlist' | 'orders' | 'delivery' | 'wallet';

export function UserProfile() {
  const { isProfileOpen, closeProfile, userProfile, stylePersona } = useApp();
  const [activeTab, setActiveTab] = useState<ProfileTab>('main');

  const renderContent = () => {
    switch (activeTab) {
      case 'wishlist': return <WishlistTab onBack={() => setActiveTab('main')} />;
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
    <div className="flex flex-col h-full">
      <div className="bg-pink-50/50 p-10 pt-16 flex flex-col items-center text-center space-y-4">
        <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
          <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="text-2xl font-black tracking-tight uppercase">{userProfile.name}</h3>
          <div className="inline-flex items-center px-3 py-1 bg-pink-500 rounded-full">
              <Sparkles className="w-3 h-3 text-white mr-2" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{stylePersona}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 px-8 py-10 space-y-6 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-2 gap-4">
            <Button 
                variant="ghost" 
                onClick={() => onSelect('wishlist')}
                className="h-32 flex flex-col items-center justify-center gap-2 bg-gray-50/50 rounded-[2rem] border border-transparent hover:border-pink-100 hover:bg-pink-50 transition-all group"
            >
                <div className="p-3 bg-white rounded-2xl shadow-sm text-pink-500 group-hover:scale-110 transition-transform">
                    <Heart className="w-6 h-6 fill-current" />
                </div>
                <span className="font-black text-xs uppercase tracking-widest">Wishlist</span>
                <span className="text-[10px] font-bold opacity-40">{userProfile.wishlist.length} Items</span>
            </Button>
            <Button 
                variant="ghost" 
                onClick={() => onSelect('orders')}
                className="h-32 flex flex-col items-center justify-center gap-2 bg-gray-50/50 rounded-[2rem] border border-transparent hover:border-blue-100 hover:bg-blue-50 transition-all group"
            >
                <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-500 group-hover:scale-110 transition-transform">
                    <Package className="w-6 h-6" />
                </div>
                <span className="font-black text-xs uppercase tracking-widest">Orders</span>
                <span className="text-[10px] font-bold opacity-40">{userProfile.orderHistory.length} Total</span>
            </Button>
        </div>

        <div className="space-y-3">
            <Button onClick={() => onSelect('wallet')} variant="ghost" className="w-full h-16 justify-between px-6 bg-gray-50/50 rounded-2xl">
                <div className="flex items-center gap-4">
                    <CreditCard className="w-5 h-5 text-emerald-500" />
                    <span className="font-bold">Wallet & Credits</span>
                </div>
                <Badge className="bg-emerald-500 text-white border-none">${userProfile.credit}</Badge>
            </Button>
            <Button onClick={() => onSelect('delivery')} variant="ghost" className="w-full h-16 justify-between px-6 bg-gray-50/50 rounded-2xl">
                <div className="flex items-center gap-4">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <span className="font-bold">Delivery Info</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-20" />
            </Button>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-black text-white space-y-4">
            <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-pink-500" />
                <h5 className="font-black tracking-tighter uppercase">Style Balance</h5>
            </div>
            <p className="text-xs font-medium opacity-60 leading-relaxed">
                You have <b>${userProfile.credit}</b> in credits to use on your next daily obsession.
            </p>
        </div>
      </div>

      <div className="p-8">
        <Button variant="ghost" className="w-full h-14 rounded-2xl text-red-500 hover:bg-red-50 font-bold">
            <LogOut className="mr-2 w-5 h-5" /> Sign Out
        </Button>
      </div>
    </div>
  );
}

function WishlistTab({ onBack }: { onBack: () => void }) {
  const { userProfile } = useApp();
  return (
    <div className="flex flex-col h-full">
      <div className="p-8 pt-16 flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="icon" className="rounded-full bg-gray-50"><ArrowLeft className="w-5 h-5"/></Button>
        <h3 className="text-2xl font-black uppercase tracking-tighter">Wishlist</h3>
      </div>
      <div className="flex-1 px-8 overflow-y-auto no-scrollbar space-y-4">
        {userProfile.wishlist.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center opacity-30 italic">
                <Heart className="w-12 h-12 mb-4" />
                <p>Removed items from cart appear here</p>
            </div>
        ) : (
            userProfile.wishlist.map(p => (
                <div key={p.id} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden">
                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h4 className="font-black text-sm uppercase leading-tight">{p.name}</h4>
                        <p className="text-pink-500 font-bold">${p.price}</p>
                        <Button variant="link" className="p-0 h-auto text-[10px] uppercase font-black tracking-widest text-gray-400 justify-start">Add back to cart</Button>
                    </div>
                </div>
            ))
        )}
      </div>
    </div>
  );
}

function OrdersTab({ onBack }: { onBack: () => void }) {
  const { userProfile } = useApp();
  return (
    <div className="flex flex-col h-full">
      <div className="p-8 pt-16 flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="icon" className="rounded-full bg-gray-50"><ArrowLeft className="w-5 h-5"/></Button>
        <h3 className="text-2xl font-black uppercase tracking-tighter">Orders</h3>
      </div>
      <div className="flex-1 px-8 overflow-y-auto no-scrollbar space-y-6">
        {userProfile.orderHistory.map(order => (
            <div key={order.id} className="space-y-4 p-6 rounded-[2rem] border border-gray-100 bg-white shadow-sm">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{order.date}</p>
                        <h4 className="font-black text-lg tracking-tighter">{order.id}</h4>
                    </div>
                    <Badge className="bg-blue-50 text-blue-500 border-none uppercase font-black text-[9px]">{order.status}</Badge>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {order.items.map(i => (
                        <div key={i.product.id} className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                            <Image src={i.product.imageUrl} alt={i.product.name} fill className="object-cover" />
                        </div>
                    ))}
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="font-black text-sm uppercase">Total: ${order.total.toFixed(2)}</span>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-gray-50"><RefreshCw className="w-4 h-4"/></Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full bg-gray-50"><AlertCircle className="w-4 h-4"/></Button>
                    </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-gray-50">
                    <Button variant="ghost" className="flex-1 text-[9px] font-black uppercase tracking-widest h-8">Return</Button>
                    <Button variant="ghost" className="flex-1 text-[9px] font-black uppercase tracking-widest h-8">Support</Button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}

function DeliveryTab({ onBack }: { onBack: () => void }) {
  const { userProfile } = useApp();
  return (
    <div className="flex flex-col h-full">
      <div className="p-8 pt-16 flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="icon" className="rounded-full bg-gray-50"><ArrowLeft className="w-5 h-5"/></Button>
        <h3 className="text-2xl font-black uppercase tracking-tighter">Delivery</h3>
      </div>
      <div className="flex-1 px-8 space-y-8">
        <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Main Phone</h4>
            <div className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="font-bold">{userProfile.phone}</span>
            </div>
        </div>
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Addresses</h4>
                <Button variant="link" className="text-[10px] font-black uppercase p-0 h-auto">+ Add New</Button>
            </div>
            {userProfile.locations.map((loc, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="font-bold text-sm">{loc}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}

function WalletTab({ onBack }: { onBack: () => void }) {
  const { userProfile } = useApp();
  return (
    <div className="flex flex-col h-full">
      <div className="p-8 pt-16 flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" size="icon" className="rounded-full bg-gray-50"><ArrowLeft className="w-5 h-5"/></Button>
        <h3 className="text-2xl font-black uppercase tracking-tighter">Wallet</h3>
      </div>
      <div className="flex-1 px-8 space-y-8">
        <div className="p-10 rounded-[2.5rem] bg-emerald-500 text-white flex flex-col items-center text-center space-y-2 shadow-xl shadow-emerald-100">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Store Credit</span>
            <span className="text-5xl font-black tracking-tighter">${userProfile.credit}</span>
            <p className="text-[10px] font-bold opacity-60 pt-4 uppercase tracking-widest">No expiry on your credits</p>
        </div>
        <div className="space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Payment Cards</h4>
            {userProfile.paymentCards.map((card, i) => (
                <div key={i} className="flex justify-between items-center p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4">
                        <CreditCard className="w-6 h-6 text-gray-400" />
                        <div className="flex flex-col">
                            <span className="font-black text-sm uppercase tracking-tighter">{card.brand}</span>
                            <span className="text-xs font-bold opacity-40">•••• {card.last4}</span>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-red-400"><Trash2 className="w-4 h-4"/></Button>
                </div>
            ))}
            <Button variant="outline" className="w-full h-16 border-2 border-dashed border-gray-200 rounded-2xl font-bold text-gray-400 hover:border-emerald-500 hover:text-emerald-500 transition-all">+ Add Card</Button>
        </div>
      </div>
    </div>
  );
}
