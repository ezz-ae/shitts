"use client";

import React, { useEffect, useState } from 'react';
import { getMasterAdminData, updateOrderLogistics, manageUserCredit, askInventoryBrain } from '@/actions/master-admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, Package, DollarSign, Activity, 
  Truck, Star, Sparkles, Loader2, ChevronRight, TrendingUp
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function MasterDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [asking, setAsking] = useState(false);
  const { toast } = useToast();

  const refreshData = async () => {
    setLoading(true);
    const res = await getMasterAdminData();
    if (res.success) {
        setData(res.data);
    } else {
        toast({ 
            variant: "destructive", 
            title: "Admin Access Required", 
            description: "Please ensure your session has admin privileges." 
        });
    }
    setLoading(false);
  };

  useEffect(() => { refreshData(); }, []);

  const handleAction = async (fn: Promise<any>, successMsg: string) => {
      const res = await fn;
      if (res.success) {
          toast({ title: successMsg });
          refreshData();
      } else {
          toast({ variant: "destructive", title: "Action Failed", description: res.error });
      }
  };

  const handleAsk = async () => {
      if (!question) return;
      setAsking(true);
      const res = await askInventoryBrain(question);
      if (res.success) setAnswer(res.data.answer);
      setAsking(false);
  };

  if (loading && !data) return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-white gap-4">
        <Loader2 className="animate-spin w-10 h-10 text-pink-500"/>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Syncing Master Systems</p>
    </div>
  );

  if (!data) return (
    <div className="h-screen flex flex-col items-center justify-center bg-zinc-950 text-white p-8 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Access Denied</h2>
        <p className="text-zinc-500 text-sm max-w-xs">You do not have the required permissions to access the Command Center.</p>
        <Button onClick={() => window.location.href = '/'} variant="outline" className="rounded-xl border-zinc-800 text-white font-bold">Return Home</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-body">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end mb-10 max-w-7xl mx-auto">
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase mb-1">Command Center</h1>
          <div className="flex items-center gap-3">
            <Badge className="bg-pink-500 text-white border-none font-black text-[10px] px-3">MASTER LIVE</Badge>
            <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-[0.3em]">ENGINE v2.4 ALPHA</p>
          </div>
        </div>
        <div className="flex gap-4">
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-5 rounded-3xl flex items-center gap-5 shadow-2xl">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center">
                    <Activity className="text-green-500 w-6 h-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Global Health</p>
                    <p className="text-2xl font-black">{data.summary.conversionRate}%</p>
                </div>
            </div>
            <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-5 rounded-3xl flex items-center gap-5 shadow-2xl">
                <div className="w-12 h-12 bg-pink-500/10 rounded-2xl flex items-center justify-center">
                    <DollarSign className="text-pink-500 w-6 h-6" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Revenue</p>
                    <p className="text-2xl font-black">${data.summary.revenue.toFixed(0)}</p>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8 max-w-7xl mx-auto">
        {/* LEFT COLUMN: Intelligence & Urgency */}
        <div className="col-span-4 space-y-8">
            <Card className="bg-zinc-900 border-zinc-800 text-white rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="bg-zinc-800/30 border-b border-zinc-800 pb-4">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-pink-500" /> Urgency Brain
                        </CardTitle>
                        <Badge variant="outline" className="text-[9px] font-black border-zinc-700">{data.notifications.length} Alerts</Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <ScrollArea className="h-[350px]">
                        {data.notifications.map((n: any) => (
                            <div key={n.id} className="p-6 border-b border-zinc-800 hover:bg-zinc-800/40 transition-all group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-black text-sm uppercase tracking-tight group-hover:text-pink-500 transition-colors">{n.title}</h4>
                                    <Badge className={cn(
                                        "text-[8px] font-black uppercase border-none px-2",
                                        n.type === 'CRITICAL' ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-zinc-800 text-zinc-400"
                                    )}>{n.type}</Badge>
                                </div>
                                <p className="text-xs text-zinc-500 font-medium leading-relaxed">{n.message}</p>
                            </div>
                        ))}
                    </ScrollArea>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-600 to-purple-700 border-none text-white rounded-[2.5rem] shadow-2xl shadow-pink-500/20 p-1">
                <div className="bg-zinc-950/20 rounded-[2.4rem] p-6 h-full">
                    <CardHeader className="px-0 pt-0">
                        <CardTitle className="flex items-center gap-3 font-black uppercase italic text-xl tracking-tighter">
                            <Sparkles className="w-6 h-6 text-pink-300" /> Inventory Oracle
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0 space-y-4">
                        <textarea 
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Query the system state..."
                            className="w-full h-28 bg-white/5 rounded-2xl p-4 text-sm font-bold placeholder:text-white/20 focus:outline-none border border-white/10 focus:border-white/30 transition-all"
                        />
                        <Button 
                            onClick={handleAsk}
                            disabled={asking}
                            className="w-full h-14 bg-white text-black font-black rounded-2xl hover:bg-pink-50 shadow-xl transition-all active:scale-95"
                        >
                            {asking ? <Loader2 className="animate-spin w-5 h-5"/> : "CONSULT BRAIN"}
                        </Button>
                        {answer && (
                            <div className="p-5 bg-black/40 rounded-2xl text-[13px] font-medium leading-relaxed border border-white/5 animate-in fade-in zoom-in-95">
                                {answer}
                            </div>
                        )}
                    </CardContent>
                </div>
            </Card>
        </div>

        {/* RIGHT COLUMN: Operational Nerve Center */}
        <div className="col-span-8">
            <Tabs defaultValue="logistics" className="w-full">
                <TabsList className="bg-zinc-900 border border-zinc-800 rounded-2xl p-1.5 mb-8 h-14 w-full justify-start gap-2">
                    <TabsTrigger value="logistics" className="rounded-xl px-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-pink-500 h-full transition-all">Logistics</TabsTrigger>
                    <TabsTrigger value="conversion" className="rounded-xl px-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-pink-500 h-full transition-all">Performance</TabsTrigger>
                    <TabsTrigger value="financial" className="rounded-xl px-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-pink-500 h-full transition-all">Balance Sheet</TabsTrigger>
                    <TabsTrigger value="users" className="rounded-xl px-10 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-pink-500 h-full transition-all">Users</TabsTrigger>
                </TabsList>

                <TabsContent value="logistics" className="space-y-4">
                    {data.orders.length === 0 ? (
                        <div className="bg-zinc-900 border border-zinc-800 p-20 rounded-[2.5rem] text-center italic text-zinc-600">No orders recorded in the system.</div>
                    ) : (
                        data.orders.map((o: any) => (
                            <div key={o.id} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-zinc-700 transition-colors shadow-xl">
                                <div className="flex items-center gap-8">
                                    <div className="w-16 h-16 bg-zinc-800 rounded-3xl flex items-center justify-center shadow-inner">
                                        <Package className="w-8 h-8 text-zinc-600" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{o.date}</span>
                                            <Badge className={cn(
                                                "text-[9px] uppercase font-black px-2 border-none",
                                                o.status === 'processing' ? "bg-blue-500 text-white" : 
                                                o.status === 'shipped' ? "bg-orange-500 text-white" : "bg-green-500 text-white"
                                            )}>{o.status}</Badge>
                                        </div>
                                        <h4 className="text-xl font-black tracking-tighter">{o.id}</h4>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    {o.status === 'processing' && (
                                        <Button onClick={() => handleAction(updateOrderLogistics(o.id, 'ship'), 'Order Dispatched')} variant="ghost" className="bg-white text-black hover:bg-zinc-200 rounded-2xl text-[10px] font-black uppercase px-8 h-14 transition-all active:scale-95">
                                            <Truck className="w-4 h-4 mr-2"/> Ship Now
                                        </Button>
                                    )}
                                    {o.status === 'shipped' && (
                                        <Button onClick={() => handleAction(updateOrderLogistics(o.id, 'deliver'), 'Order Delivered')} variant="ghost" className="bg-green-600 text-white hover:bg-green-700 rounded-2xl text-[10px] font-black uppercase px-8 h-14 transition-all active:scale-95">
                                            Confirm Arrival
                                        </Button>
                                    )}
                                    <Button onClick={() => handleAction(updateOrderLogistics(o.id, 'return'), 'Return Logged')} variant="ghost" className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 rounded-2xl text-[10px] font-black uppercase px-6 h-14 transition-all">
                                        Issue Return
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="conversion" className="space-y-8">
                    <div className="grid grid-cols-1 gap-4">
                        {data.conversion.funnel.map((item: any) => (
                            <div key={item.name} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-zinc-700 transition-all">
                                <div className="space-y-3 flex-1">
                                    <div className="flex items-center gap-3">
                                        <h4 className="font-black uppercase text-lg tracking-tight">{item.name}</h4>
                                        {item.isBestSeller && <Badge className="bg-pink-500/10 text-pink-500 border border-pink-500/20 text-[8px] font-black uppercase">Best Seller</Badge>}
                                    </div>
                                    <div className="flex gap-8">
                                        <div className="space-y-0.5"><p className="text-[9px] font-black text-zinc-500 uppercase">Likes</p><p className="font-black">{item.picks}</p></div>
                                        <div className="space-y-0.5"><p className="text-[9px] font-black text-zinc-500 uppercase">Views</p><p className="font-black">{item.views}</p></div>
                                        <div className="space-y-0.5"><p className="text-[9px] font-black text-zinc-500 uppercase">Sales</p><p className="font-black">{item.cashes}</p></div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-12">
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Display</p>
                                        <div className="flex items-center gap-1 text-pink-500 bg-pink-500/10 px-3 py-1.5 rounded-xl border border-pink-500/20">
                                            <Star className="w-4 h-4 fill-current"/>
                                            <span className="font-black text-sm">{item.displayRating}</span>
                                        </div>
                                    </div>
                                    <div className="text-right w-32">
                                        <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Conversion</p>
                                        <p className="text-3xl font-black text-green-500 tracking-tighter">{item.conversionRate.toFixed(1)}%</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="financial" className="space-y-8">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] space-y-4 shadow-2xl">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Pending (In Carts)</p>
                            <p className="text-4xl font-black tracking-tighter">${data.financial.overview.totalPendingRevenue.toFixed(0)}</p>
                            <div className="flex items-center text-green-500 gap-1 text-[10px] font-bold"><TrendingUp className="w-3 h-3"/> Potential Growth</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] space-y-4 shadow-2xl">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Credit Liability</p>
                            <p className="text-4xl font-black tracking-tighter text-red-500">${data.financial.overview.totalCreditLiability.toFixed(0)}</p>
                            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">User Wallet Balance</div>
                        </div>
                        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] space-y-4 shadow-2xl">
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Lost Opportunity</p>
                            <p className="text-4xl font-black tracking-tighter opacity-30">${data.financial.overview.totalLostOpportunity.toFixed(0)}</p>
                            <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">Rejected Value</div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="users" className="space-y-4">
                    {data.users.map((u: any) => (
                        <div key={u.uid} className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] flex items-center justify-between hover:border-zinc-700 transition-all shadow-xl">
                             <div className="flex items-center gap-6">
                                <Avatar className="w-16 h-16 border-4 border-zinc-800 shadow-xl">
                                    <AvatarFallback className="bg-zinc-800 text-zinc-500 font-black text-xl">{u.name ? u.name[0] : '?'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="font-black uppercase text-lg tracking-tight">{u.name || 'Anonymous User'}</h4>
                                    <div className="flex items-center gap-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                        <span>{u.phone || 'No Phone'}</span>
                                        <span>•</span>
                                        <span className="text-pink-500">{u.role || 'user'}</span>
                                    </div>
                                </div>
                             </div>
                             <div className="flex items-center gap-10">
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-zinc-500 uppercase mb-1">Balance</p>
                                    <p className="text-2xl font-black text-green-500 tracking-tighter">${u.credit || 0}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button onClick={() => handleAction(manageUserCredit(u.uid, 'grant', 10, 'Engagement bonus'), 'Credit Granted')} variant="ghost" className="h-14 w-14 bg-zinc-800 border border-zinc-700 rounded-2xl text-green-500 hover:bg-green-500 hover:text-white transition-all active:scale-95 p-0 flex items-center justify-center">
                                        <Activity className="w-5 h-5"/>
                                    </Button>
                                    <Button onClick={() => handleAction(manageUserCredit(u.uid, 'revoke', 5, 'Correction'), 'Credit Revoked')} variant="ghost" className="h-14 w-14 bg-zinc-800 border border-zinc-700 rounded-2xl text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 p-0 flex items-center justify-center">
                                        <Activity className="w-5 h-5 rotate-180"/>
                                    </Button>
                                </div>
                             </div>
                        </div>
                    ))}
                </TabsContent>
            </Tabs>
        </div>
      </div>
    </div>
  );
}
