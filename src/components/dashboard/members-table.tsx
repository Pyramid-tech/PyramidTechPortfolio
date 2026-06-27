'use client';

import { FC } from 'react';

import type { AdminTeamMemberDTO } from '@/types/team';
import Badge from '@/components/ui/badge';
import { EmptyState, HeadRow, Table, TableCard, Td, Th } from '@/components/ui/table';

interface Props {
  members: AdminTeamMemberDTO[];
  togglingId: string | null;
  reviewingId: string | null;
  isApprover: boolean;
  onEdit: (member: AdminTeamMemberDTO) => void;
  onToggleStatus: (member: AdminTeamMemberDTO) => void;
  onApprove: (member: AdminTeamMemberDTO) => void;
  onReject: (member: AdminTeamMemberDTO) => void;
}

function StatusBadge({ member }: { member: AdminTeamMemberDTO }) {
  if (member.approvalStatus === 'pending') return <Badge tone="amber">Pending review</Badge>;
  if (member.approvalStatus === 'rejected') return <Badge tone="red">Rejected</Badge>;
  return (
    <Badge tone={member.isActive ? 'green' : 'red'}>{member.isActive ? 'Active' : 'Inactive'}</Badge>
  );
}

const MembersTable: FC<Props> = ({
  members,
  togglingId,
  reviewingId,
  isApprover,
  onEdit,
  onToggleStatus,
  onApprove,
  onReject,
}) => (
  <TableCard>
    {members.length === 0 ? (
      <EmptyState>No members yet.</EmptyState>
    ) : (
      <Table>
        <thead>
          <HeadRow>
            <Th>Name</Th>
            <Th className="hidden sm:table-cell">Job Title</Th>
            <Th className="hidden md:table-cell">Email</Th>
            <Th className="hidden lg:table-cell">Order</Th>
            <Th className="hidden lg:table-cell">Confidence</Th>
            <Th>Status</Th>
            <Th className="text-right">Actions</Th>
          </HeadRow>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <tr
              key={m.id}
              className={`border-b border-stroke/50 transition hover:bg-bg-1/40 ${
                i === members.length - 1 ? 'border-b-0' : ''
              }`}
            >
              <Td className="font-medium text-text-1">{m.name}</Td>
              <Td className="hidden text-text-1/70 sm:table-cell">{m.jobTitle}</Td>
              <Td className="hidden text-text-1/70 md:table-cell">{m.email}</Td>
              <Td className="hidden text-text-1/50 lg:table-cell">{m.displayOrder}</Td>
              <Td className="hidden text-text-1/70 lg:table-cell">
                {m.confidenceScore === null ? '—' : `${m.confidenceScore}/100`}
              </Td>
              <Td>
                <StatusBadge member={m} />
              </Td>
              <Td className="text-right">
                <div className="flex items-center justify-end gap-1 sm:gap-2">
                  <button
                    onClick={() => onEdit(m)}
                    className="rounded-md px-2 py-1.5 text-xs text-primary transition hover:bg-primary/10 sm:px-3"
                  >
                    Edit
                  </button>

                  {m.approvalStatus === 'approved' ? (
                    <button
                      onClick={() => onToggleStatus(m)}
                      disabled={togglingId === m.id}
                      className={`rounded-md px-2 py-1.5 text-xs transition disabled:opacity-50 sm:px-3 ${
                        m.isActive
                          ? 'text-red-400 hover:bg-red-500/10'
                          : 'text-green-400 hover:bg-green-500/10'
                      }`}
                    >
                      {togglingId === m.id ? '…' : m.isActive ? 'Deactivate' : 'Reactivate'}
                    </button>
                  ) : isApprover ? (
                    <>
                      <button
                        onClick={() => onApprove(m)}
                        disabled={reviewingId === m.id}
                        className="rounded-md px-2 py-1.5 text-xs text-green-400 transition hover:bg-green-500/10 disabled:opacity-50 sm:px-3"
                      >
                        {reviewingId === m.id ? '…' : 'Approve'}
                      </button>
                      {m.approvalStatus === 'pending' && (
                        <button
                          onClick={() => onReject(m)}
                          disabled={reviewingId === m.id}
                          className="rounded-md px-2 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-50 sm:px-3"
                        >
                          Reject
                        </button>
                      )}
                    </>
                  ) : null}
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
  </TableCard>
);

export default MembersTable;
