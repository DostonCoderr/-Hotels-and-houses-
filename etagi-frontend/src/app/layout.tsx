import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import './globals.css';
import { SiteProviders } from '@/providers/site-providers';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Etagi',
  description: 'Ko\'chmas mulk platformasi',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const langCookie = cookieStore.get('site-lang')?.value;
  const lang = ['ru', 'en', 'uz'].includes(langCookie || '') ? langCookie : 'ru';

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className}>
        <SiteProviders>{children}</SiteProviders>
      </body>
    </html>
  );
}