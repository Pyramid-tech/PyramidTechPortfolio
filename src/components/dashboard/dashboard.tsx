'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';

import type {
  AdminTeamMemberDTO,
  CreateTeamMemberDTO,
  UpdateTeamMemberDTO,
  MemberMutationResult,
} from '@/types/team';
import type { PyramidRequestDTO } from '@/types/book';
import {
  createTeamMemberAction,
  deactivateTeamMemberAction,
  reactivateTeamMemberAction,
  updateTeamMemberAction,
  approveTeamMemberAction,
  rejectTeamMemberAction,
} from '@/lib/actions/team';
import { logoutAction } from '@/lib/actions/auth';
import MemberModal from '@/components/forms/member-form';

import DashboardHeader from './dashboard-header';
import DashboardTabs, { DashboardTab } from './dashboard-tabs';
import MembersTable from './members-table';
import RequestsTable from './requests-table';

type ModalState = { mode: 'create' } | { mode: 'edit'; member: AdminTeamMemberDTO } | null;

interface Props {
  initialMembers: AdminTeamMemberDTO[];
  initialRequests: PyramidRequestDTO[];
  /** True only for the earliest-created member, who may approve/reject pending members. */
  isApprover: boolean;
}

const Dashboard: FC<Props> = ({ initialMembers, initialRequests, isApprover }) => {
  const router = useRouter();
  const [tab, setTab] = useState<DashboardTab>('team');
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  // Data comes from the server (RSC); mutations call Server Actions and
  // router.refresh() re-pulls fresh props.
  const members = initialMembers;
  const requests = initialRequests;

  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutAction();
  };

  const handleToggleStatus = async (member: AdminTeamMemberDTO) => {
    setTogglingId(member.id);
    try {
      const res = member.isActive
        ? await deactivateTeamMemberAction(member.id)
        : await reactivateTeamMemberAction(member.id);
      if (res.ok) router.refresh();
    } finally {
      setTogglingId(null);
    }
  };

  const handleReview = async (member: AdminTeamMemberDTO, action: 'approve' | 'reject') => {
    setReviewingId(member.id);
    try {
      const res =
        action === 'approve'
          ? await approveTeamMemberAction(member.id)
          : await rejectTeamMemberAction(member.id);
      if (res.ok) router.refresh();
    } finally {
      setReviewingId(null);
    }
  };

  // The modal keeps itself open to show the AI verdict; we just refresh the table
  // behind it so the new/edited row reflects its approval status.
  const handleCreate = async (data: CreateTeamMemberDTO): Promise<MemberMutationResult> => {
    const res = await createTeamMemberAction(data);
    if (res.ok) router.refresh();
    return res;
  };

  const handleUpdate = async (
    id: string,
    data: UpdateTeamMemberDTO,
  ): Promise<MemberMutationResult> => {
    const res = await updateTeamMemberAction(id, data);
    if (res.ok) router.refresh();
    return res;
  };

  return (
    <div className="min-h-screen bg-bg-1 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">
        <DashboardHeader
          showAdd={tab === 'team'}
          onAdd={() => setModal({ mode: 'create' })}
          onLogout={handleLogout}
          loggingOut={loggingOut}
        />
        <DashboardTabs active={tab} onChange={setTab} />

        {tab === 'team' ? (
          <MembersTable
            members={members}
            togglingId={togglingId}
            reviewingId={reviewingId}
            isApprover={isApprover}
            onEdit={(member) => setModal({ mode: 'edit', member })}
            onToggleStatus={handleToggleStatus}
            onApprove={(member) => handleReview(member, 'approve')}
            onReject={(member) => handleReview(member, 'reject')}
          />
        ) : (
          <RequestsTable requests={requests} />
        )}
      </div>

      {modal && (
        <MemberModal
          mode={modal.mode}
          member={modal.mode === 'edit' ? modal.member : undefined}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
