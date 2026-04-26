import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import RealtimeProvider from '@/lib/realtime/RealtimeProvider';
import StyledRegistry from '@/lib/styledRegistry';

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
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <StyledRegistry>
          <RealtimeProvider>{children}</RealtimeProvider>
        </StyledRegistry>
      </body>
    </html>
  );
}
