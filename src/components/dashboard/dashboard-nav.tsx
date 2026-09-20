'use client';

import { FC } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { label: 'Team', href: '/dashboard' },
  { label: 'Requests', href: '/dashboard/requests' },
  { label: 'Projects', href: '/dashboard/projects' },
];

function isCurrent(pathname: string, href: string): boolean {
  if (href === '/dashboard') return pathname === '/dashboard';
  return pathname === href || pathname.startsWith(`${href}/`);
}

const DashboardNav: FC = () => {
  const pathname = usePathname();

  return (
    <nav aria-label="Dashboard sections" className="mb-6 flex gap-1 border-b border-stroke">
      {LINKS.map((link) => {
        const current = isCurrent(pathname, link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={current ? 'page' : undefined}
            className={`px-4 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-5 ${
              current ? 'border-b-2 border-primary text-primary' : 'text-text-3 hover:text-text-2'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default DashboardNav;
