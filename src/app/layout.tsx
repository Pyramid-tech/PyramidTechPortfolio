'use client';

import { usePathname } from 'next/navigation';
import { ReactLenis } from 'lenis/react';

import { fontVariables } from '@/lib/fonts';

import './globals.scss';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Lenis hijacks native scrolling, which breaks the Sanity Studio panes.
  const isStudio = usePathname().startsWith('/studio');

  return (
    <html lang="en" className={fontVariables}>
      <body>
        {isStudio ? children : (
          <ReactLenis root>
            <main>{children}</main>
          </ReactLenis>
        )}
      </body>
    </html>
  );
}
