'use client';

import { FC, useState } from 'react';

import type { PyramidRequestDTO } from '@/types/book';
import { EmptyState, HeadRow, Table, TableCard, Th } from '@/components/ui/table';

import RequestRow from './request-row';

const RequestsTable: FC<{ requests: PyramidRequestDTO[] }> = ({ requests }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <TableCard>
      {requests.length === 0 ? (
        <EmptyState>No requests yet.</EmptyState>
      ) : (
        <Table>
          <thead>
            <HeadRow>
              <Th>Name</Th>
              <Th className="hidden md:table-cell">Email</Th>
              <Th className="hidden md:table-cell">Company</Th>
              <Th>Service</Th>
              <Th className="hidden lg:table-cell">Budget</Th>
              <Th className="hidden sm:table-cell">Date</Th>
              <Th className="text-right">Details</Th>
            </HeadRow>
          </thead>
          <tbody>
            {requests.map((r, i) => (
              <RequestRow
                key={r.id}
                request={r}
                expanded={expandedId === r.id}
                isLast={i === requests.length - 1}
                onToggle={() => setExpandedId(expandedId === r.id ? null : r.id)}
              />
            ))}
          </tbody>
        </Table>
      )}
    </TableCard>
  );
};

export default RequestsTable;
