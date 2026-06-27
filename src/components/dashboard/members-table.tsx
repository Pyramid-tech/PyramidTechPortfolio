'use client';

import { FC } from 'react';

import type { AdminTeamMemberDTO } from '@/types/team';
import Badge from '@/components/ui/badge';
import { EmptyState, HeadRow, Table, TableCard, Td, Th } from '@/components/ui/table';

interface RowProps {
  member: AdminTeamMemberDTO;
  togglingId: string | null;
  reviewingId: string | null;
  isApprover: boolean;
  onEdit: (member: AdminTeamMemberDTO) => void;
  onToggleStatus: (member: AdminTeamMemberDTO) => void;
  onApprove: (member: AdminTeamMemberDTO) => void;
  onReject: (member: AdminTeamMemberDTO) => void;
}

interface Props extends Omit<RowProps, 'member'> {
  members: AdminTeamMemberDTO[];
}

function StatusBadge({ member, className }: { member: AdminTeamMemberDTO; className?: string }) {
  if (member.approvalStatus === 'pending')
    return (
      <Badge tone="amber" className={className}>
        Pending review
      </Badge>
    );
  if (member.approvalStatus === 'rejected')
    return (
      <Badge tone="red" className={className}>
        Rejected
      </Badge>
    );
  return (
    <Badge tone={member.isActive ? 'green' : 'red'} className={className}>
      {member.isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
}

// Confidence is only meaningful while a member is awaiting (or was denied) review;
// once approved we don't surface the score.
function showsConfidence(member: AdminTeamMemberDTO): boolean {
  return member.approvalStatus !== 'approved' && member.confidenceScore !== null;
}

function confidenceLabel(member: AdminTeamMemberDTO): string {
  return showsConfidence(member) ? `${member.confidenceScore}/100` : '—';
}

// Action buttons shared by the desktop table row and the mobile card.
const MemberActions: FC<RowProps> = ({
  member,
  togglingId,
  reviewingId,
  isApprover,
  onEdit,
  onToggleStatus,
  onApprove,
  onReject,
}) => (
  <>
    <button
      onClick={() => onEdit(member)}
      className="rounded-md px-2 py-1.5 text-xs text-primary transition hover:bg-primary/10 sm:px-3"
    >
      Edit
    </button>

    {member.approvalStatus === 'approved' ? (
      <button
        onClick={() => onToggleStatus(member)}
        disabled={togglingId === member.id}
        className={`rounded-md px-2 py-1.5 text-xs transition disabled:opacity-50 sm:px-3 ${
          member.isActive
            ? 'text-red-400 hover:bg-red-500/10'
            : 'text-green-400 hover:bg-green-500/10'
        }`}
      >
        {togglingId === member.id ? '…' : member.isActive ? 'Deactivate' : 'Reactivate'}
      </button>
    ) : isApprover ? (
      <>
        <button
          onClick={() => onApprove(member)}
          disabled={reviewingId === member.id}
          className="rounded-md px-2 py-1.5 text-xs text-green-400 transition hover:bg-green-500/10 disabled:opacity-50 sm:px-3"
        >
          {reviewingId === member.id ? '…' : 'Approve'}
        </button>
        {member.approvalStatus === 'pending' && (
          <button
            onClick={() => onReject(member)}
            disabled={reviewingId === member.id}
            className="rounded-md px-2 py-1.5 text-xs text-red-400 transition hover:bg-red-500/10 disabled:opacity-50 sm:px-3"
          >
            Reject
          </button>
        )}
      </>
    ) : null}
  </>
);

// Mobile (<sm) card — avoids the horizontally scrolling table on small screens.
const MemberCard: FC<RowProps> = (props) => {
  const { member } = props;
  return (
    <div className="rounded-2xl border border-stroke bg-bg-2 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-text-1">{member.name}</p>
          <p className="truncate text-sm text-text-1/60">{member.jobTitle}</p>
        </div>
        <StatusBadge member={member} className="shrink-0" />
      </div>

      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-text-1/50">
        <div className="flex min-w-0 items-center gap-1">
          <dt className="shrink-0">Email:</dt>
          <dd className="truncate text-text-1/70">{member.email}</dd>
        </div>
        {showsConfidence(member) && (
          <div className="flex items-center gap-1">
            <dt className="shrink-0">Confidence:</dt>
            <dd className="text-text-1/70">{confidenceLabel(member)}</dd>
          </div>
        )}
      </dl>

      <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-stroke/50 pt-3">
        <MemberActions {...props} />
      </div>
    </div>
  );
};

const MembersTable: FC<Props> = ({ members, ...handlers }) => {
  if (members.length === 0) {
    return (
      <TableCard>
        <EmptyState>No members yet.</EmptyState>
      </TableCard>
    );
  }

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="flex flex-col gap-3 sm:hidden">
        {members.map((m) => (
          <MemberCard key={m.id} member={m} {...handlers} />
        ))}
      </div>

      {/* Desktop / tablet: table */}
      <div className="hidden sm:block">
        <TableCard>
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
                  <Td className="hidden text-text-1/70 lg:table-cell">{confidenceLabel(m)}</Td>
                  <Td>
                    <StatusBadge member={m} />
                  </Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1 whitespace-nowrap sm:gap-2">
                      <MemberActions member={m} {...handlers} />
                    </div>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableCard>
      </div>
    </>
  );
};

export default MembersTable;
