'use client';

import { FC, ReactNode } from 'react';

interface Props {
  label: string;
  index: number;
  total: number;
  onMove: (index: number, delta: number) => void;
  onRemove: (index: number) => void;
  children: ReactNode;
}

const RepeatableRow: FC<Props> = ({ label, index, total, onMove, onRemove, children }) => (
  <div className="rounded-xl border border-stroke/70 bg-bg-1/40 p-4">
    <div className="mb-3 flex items-center justify-between gap-3">
      <p className="text-xs uppercase tracking-widest text-text-1/40">
        {label} {index + 1}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onMove(index, -1)}
          disabled={index === 0}
          aria-label={`Move ${label} ${index + 1} up`}
          className="rounded-md border border-stroke px-2 py-1 text-xs text-text-1/60 transition hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-30"
        >
          ↑
        </button>
        <button
          type="button"
          onClick={() => onMove(index, 1)}
          disabled={index === total - 1}
          aria-label={`Move ${label} ${index + 1} down`}
          className="rounded-md border border-stroke px-2 py-1 text-xs text-text-1/60 transition hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-30"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={() => onRemove(index)}
          aria-label={`Remove ${label} ${index + 1}`}
          className="rounded-md border border-stroke px-2 py-1 text-xs text-red-400/80 transition hover:border-red-400/60 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Remove
        </button>
      </div>
    </div>
    <div className="flex flex-col gap-3">{children}</div>
  </div>
);

export default RepeatableRow;
