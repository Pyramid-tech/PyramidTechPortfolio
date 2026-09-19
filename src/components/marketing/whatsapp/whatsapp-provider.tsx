'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface WhatsAppContextValue {
  project: string | null;
  setProject: (project: string | null) => void;
}

const WhatsAppContext = createContext<WhatsAppContextValue | null>(null);

const WhatsAppProvider = ({ children }: { children: ReactNode }) => {
  const [project, setProject] = useState<string | null>(null);
  const value = useMemo(() => ({ project, setProject }), [project]);

  return <WhatsAppContext.Provider value={value}>{children}</WhatsAppContext.Provider>;
};

export const useWhatsApp = () => {
  const context = useContext(WhatsAppContext);
  if (!context) throw new Error('useWhatsApp must be used within a WhatsAppProvider');
  return context;
};

export default WhatsAppProvider;
