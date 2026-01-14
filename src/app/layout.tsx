import type { Metadata, Viewport } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { ShoppingCart } from '@/components/cart/ShoppingCart';
import { AppProvider } from '@/context/AppProvider';

export const metadata: Metadata = {
  title: 'SHITTS | Your Daily Style Edit',
  description: 'Uncover your Style DNA in 5 minutes. An endless, AI-curated fashion feed with real-time intent learning.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SHITTS',
  },
  openGraph: {
    title: 'SHITTS',
    description: 'The 5-minute daily style curation app.',
    url: 'https://shitts.style',
    siteName: 'SHITTS',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'SHITTS - Your Style DNA',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SHITTS',
    description: 'The future of fashion discovery.',
    images: ['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: 'dark' }} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-black overflow-hidden touch-none selection:bg-pink-500/30">
        <AppProvider>
          <div className="relative flex flex-col h-svh w-full overflow-hidden bg-black">
            <main className="flex-1 relative overflow-hidden">
              {children}
            </main>
            <ShoppingCart />
            <Toaster />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
