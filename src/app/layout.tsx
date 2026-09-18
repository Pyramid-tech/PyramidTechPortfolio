import type { Metadata, Viewport } from 'next';

import { fontVariables } from '@/lib/fonts';
import { AppShell, ThemeScript } from '@/components/theme';
import { SITE } from '@/lib/site';

import './globals.scss';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} - ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'software development',
    'web development',
    'mobile apps',
    'desktop applications',
    'Beirut',
    'Lebanon',
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} - ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [
      { url: '/icon-nobg.png?v=3', type: 'image/png' },
      { url: '/favicon.ico?v=3', sizes: 'any' },
    ],
    apple: [{ url: '/icon-nobg.png?v=3' }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#141218' },
    { media: '(prefers-color-scheme: light)', color: '#f4f7fc' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables} data-theme="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="icon" href="/icon-nobg.png?v=3" type="image/png" />
        <link rel="icon" href="/favicon.ico?v=3" sizes="any" />
        <link rel="apple-touch-icon" href="/icon-nobg.png?v=3" />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
