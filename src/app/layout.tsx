import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import RealtimeProvider from '@/lib/realtime/RealtimeProvider';
import StyledRegistry from '@/lib/styledRegistry';

import AppNav from './_components/AppNav';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'The Bosch Residence',
  description: 'Clyde — Home Assistant control surface',
  appleWebApp: { capable: true, title: 'Bosch Home', statusBarStyle: 'black-translucent' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#050507',
  colorScheme: 'dark',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <StyledRegistry>
          <RealtimeProvider>
            <AppNav />
            {children}
          </RealtimeProvider>
        </StyledRegistry>
      </body>
    </html>
  );
}
