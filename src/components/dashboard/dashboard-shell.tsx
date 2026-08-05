import { FC, ReactNode } from 'react';

const DashboardShell: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-bg-1 p-4 sm:p-8">
    <div className="mx-auto max-w-6xl">{children}</div>
  </div>
);

export default DashboardShell;
