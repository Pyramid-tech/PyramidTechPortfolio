'use client';

import { usePathname } from 'next/navigation';
import { ReactLenis } from 'lenis/react';

import ThemeProvider from './theme-provider';

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const isStudio = usePathname().startsWith('/studio');

  if (isStudio) return children;

  return (
    <ThemeProvider>
      <ReactLenis root>
        <main>{children}</main>
      </ReactLenis>
    </ThemeProvider>
  );
};

export default AppShell;
