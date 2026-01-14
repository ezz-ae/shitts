import type {Metadata} from 'next';
import {Toaster} from '@/components/ui/toaster';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { ShoppingCart } from '@/components/cart/ShoppingCart';
import { AppProvider } from '@/context/AppProvider';

export const metadata: Metadata = {
  title: 'StyleSwipe',
  description: 'Find your next look',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-muted/40">
        <AppProvider>
          <div className="flex flex-col h-svh">
            <Header />
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
            <ShoppingCart />
            <Toaster />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
