'use client';

import { FC, ReactNode, useState } from 'react';

import { logoutAction } from '@/lib/actions/auth';
import { ThemeToggle } from '@/components/theme';

const DashboardHeader: FC<{ actions?: ReactNode }> = ({ actions }) => {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutAction();
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold uppercase tracking-widest text-primary sm:text-3xl">
          Pyramid
        </h1>
        <p className="mt-1 text-xs text-text-3 sm:text-sm">Admin Dashboard</p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {actions}
        <ThemeToggle className="rounded-lg" />
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="rounded-lg border border-stroke px-3 py-2 text-xs text-text-3 transition hover:border-text-1/40 hover:text-text-1 disabled:opacity-50 sm:px-4 sm:text-sm"
        >
          {loggingOut ? 'Logging out…' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
