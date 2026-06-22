'use client';

import { FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface Props {
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

// Fixed overlay + centered panel + close button. Panel content is passed in.
const Modal: FC<Props> = ({ onClose, children, className }) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm sm:items-center">
    <div className={cn('relative w-full max-w-lg rounded-2xl border border-stroke bg-bg-2 p-6 shadow-2xl sm:p-8', className)}>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute right-5 top-5 text-text-1/40 transition hover:text-text-1"
      >
        ✕
      </button>
      {children}
    </div>
  </div>
);

export default Modal;
