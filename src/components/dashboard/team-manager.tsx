'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';

import type {
  AdminTeamMemberDTO,
  CreateTeamMemberDTO,
  UpdateTeamMemberDTO,
  MemberMutationResult,
} from '@/types/team';
import {
  createTeamMemberAction,
  deactivateTeamMemberAction,
  reactivateTeamMemberAction,
  updateTeamMemberAction,
  approveTeamMemberAction,
  rejectTeamMemberAction,
} from '@/lib/actions/team';
import MemberModal from '@/components/forms/member-form';

import DashboardHeader from './dashboard-header';
import DashboardNav from './dashboard-nav';
import MembersTable from './members-table';

type ModalState = { mode: 'create' } | { mode: 'edit'; member: AdminTeamMemberDTO } | null;

interface Props {
  members: AdminTeamMemberDTO[];
  isApprover: boolean;
}

const TeamManager: FC<Props> = ({ members, isApprover }) => {
  const router = useRouter();
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState>(null);

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
    <>
      <DashboardHeader
        actions={
          <button
            onClick={() => setModal({ mode: 'create' })}
            className="rounded-lg border border-primary px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-bg-1 sm:px-4 sm:text-sm"
          >
            + Add Member
          </button>
        }
      />
      <DashboardNav />

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

      {modal && (
        <MemberModal
          mode={modal.mode}
          member={modal.mode === 'edit' ? modal.member : undefined}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
};

export default TeamManager;
