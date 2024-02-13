import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { ruRU } from '@clerk/localizations';

import ModalProvider from '@/providers/modal-provider';

import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jou-B-Jou Admin dashboard',
  description: 'Admin dashboard for e-commerce project Jou-B-Jou',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={ruRU}>
      <html lang='ru'>
        <body className={inter.className}>
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
