'use client';

import { ReactLenis } from 'lenis/react';
import { Montserrat } from 'next/font/google';

import './globals.scss';

const montserrat = Montserrat({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <ReactLenis root>
          <main>{children}</main>
        </ReactLenis>
      </body>
    </html>
  );
}
