'use client';

import { FC } from 'react';

interface Props {
  showAdd: boolean;
  onAdd: () => void;
  onLogout: () => void;
  loggingOut: boolean;
}

const DashboardHeader: FC<Props> = ({ showAdd, onAdd, onLogout, loggingOut }) => (
  <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-2xl font-bold uppercase tracking-widest text-primary sm:text-3xl">Pyramid</h1>
      <p className="mt-1 text-xs text-text-1/50 sm:text-sm">Admin Dashboard</p>
    </div>
    <div className="flex flex-wrap gap-2 sm:gap-3">
      {showAdd && (
        <button
          onClick={onAdd}
          className="rounded-lg border border-primary px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-bg-1 sm:px-4 sm:text-sm"
        >
          + Add Member
        </button>
      )}
      <button
        onClick={onLogout}
        disabled={loggingOut}
        className="rounded-lg border border-stroke px-3 py-2 text-xs text-text-1/60 transition hover:border-text-1/40 hover:text-text-1 disabled:opacity-50 sm:px-4 sm:text-sm"
      >
        {loggingOut ? 'Logging out…' : 'Logout'}
      </button>
    </div>
  </div>
);

export default DashboardHeader;
