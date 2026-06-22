'use client';

import { FC } from 'react';

export type DashboardTab = 'team' | 'requests';

const TABS: DashboardTab[] = ['team', 'requests'];

interface Props {
  active: DashboardTab;
  onChange: (tab: DashboardTab) => void;
}

const DashboardTabs: FC<Props> = ({ active, onChange }) => (
  <div className="mb-6 flex gap-1 border-b border-stroke">
    {TABS.map((tab) => (
      <button
        key={tab}
        onClick={() => onChange(tab)}
        className={`px-4 py-2.5 text-sm font-medium capitalize transition sm:px-5 ${
          active === tab ? 'border-b-2 border-primary text-primary' : 'text-text-1/40 hover:text-text-1/70'
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default DashboardTabs;
