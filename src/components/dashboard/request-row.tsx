'use client';

import { FC, Fragment } from 'react';

import type { PyramidRequestDTO } from '@/types/book';
import { SERVICE_LABELS } from '@/lib/constants';
import { Td } from '@/components/ui/table';

interface Props {
  request: PyramidRequestDTO;
  expanded: boolean;
  isLast: boolean;
  onToggle: () => void;
}

const RequestRow: FC<Props> = ({ request: r, expanded, isLast, onToggle }) => (
  <Fragment>
    <tr
      className={`border-b border-stroke/50 transition hover:bg-bg-1/40 ${expanded ? 'bg-bg-1/40' : ''} ${
        isLast && !expanded ? 'border-b-0' : ''
      }`}
    >
      <Td className="font-medium text-text-1">{r.name}</Td>
      <Td className="hidden text-text-1/70 md:table-cell">{r.email}</Td>
      <Td className="hidden text-text-1/70 md:table-cell">{r.company}</Td>
      <Td className="text-text-1/70">{SERVICE_LABELS[r.service] ?? r.service}</Td>
      <Td className="hidden text-text-1/50 lg:table-cell">{r.budget}</Td>
      <Td className="hidden text-text-1/50 sm:table-cell">
        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}
      </Td>
      <Td className="text-right">
        <button
          onClick={onToggle}
          className="rounded-md px-2 py-1.5 text-xs text-primary transition hover:bg-primary/10 sm:px-3"
        >
          {expanded ? 'Hide' : 'View'}
        </button>
      </Td>
    </tr>
    {expanded && (
      <tr className={`border-b border-stroke/50 bg-bg-1/60 ${isLast ? 'border-b-0' : ''}`}>
        <td colSpan={7} className="px-4 pb-4 pt-2 sm:px-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-1.5 text-xs text-text-1/60 sm:grid-cols-2">
            <span>
              <strong className="text-text-1/80">Email:</strong> {r.email}
            </span>
            <span>
              <strong className="text-text-1/80">Company:</strong> {r.company}
            </span>
            <span>
              <strong className="text-text-1/80">Phone:</strong> {r.phone}
            </span>
            <span>
              <strong className="text-text-1/80">Pages:</strong> {r.pages}
            </span>
            <span>
              <strong className="text-text-1/80">Budget:</strong> {r.budget}
            </span>
            <span>
              <strong className="text-text-1/80">Timeline:</strong> {r.quickness}
            </span>
            {r.websiteUrl && (
              <span className="sm:col-span-2">
                <strong className="text-text-1/80">Website:</strong> {r.websiteUrl}
              </span>
            )}
            {r.message && (
              <span className="mt-1 sm:col-span-2">
                <strong className="text-text-1/80">Message:</strong> {r.message}
              </span>
            )}
          </div>
        </td>
      </tr>
    )}
  </Fragment>
);

export default RequestRow;
