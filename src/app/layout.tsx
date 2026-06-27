'use client';

import { ReactLenis } from 'lenis/react';

import { fontVariables } from '@/lib/fonts';

import './globals.scss';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <ReactLenis root>
          <main>{children}</main>
        </ReactLenis>
      </body>
    </html>
  );
}
