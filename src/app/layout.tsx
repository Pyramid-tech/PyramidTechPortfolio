'use client';

import { usePathname } from 'next/navigation';
import { ReactLenis } from 'lenis/react';

import { fontVariables } from '@/lib/fonts';
import { ThemeProvider, ThemeScript } from '@/components/theme';

import './globals.scss';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Lenis hijacks native scrolling, which breaks the Sanity Studio panes.
  const isStudio = usePathname().startsWith('/studio');

  return (
    <html lang="en" className={fontVariables} data-theme="dark" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>
          {isStudio ? (
            children
          ) : (
            <ReactLenis root>
              <main>{children}</main>
            </ReactLenis>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
