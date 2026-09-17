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
  keywords: ['AI agents', 'RAG', 'LLM integration', 'web development', 'mobile apps', 'Lebanon', 'Beirut'],
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
      { url: '/icon.png?v=2', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.ico?v=2', sizes: 'any' },
    ],
    apple: [{ url: '/apple-icon.png?v=2', sizes: '180x180' }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#141218' },
    { media: '(prefers-color-scheme: light)', color: '#f6f4f9' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={fontVariables} data-theme="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="icon" href="/icon.png?v=2" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-icon.png?v=2" />
      </head>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
