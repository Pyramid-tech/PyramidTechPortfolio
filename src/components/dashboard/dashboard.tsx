'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';

import type { AdminTeamMemberDTO, CreateTeamMemberDTO, UpdateTeamMemberDTO } from '@/types/team';
import type { PyramidRequestDTO } from '@/types/book';
import {
  createTeamMemberAction,
  deactivateTeamMemberAction,
  reactivateTeamMemberAction,
  updateTeamMemberAction,
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
}

const Dashboard: FC<Props> = ({ initialMembers, initialRequests }) => {
  const router = useRouter();
  const [tab, setTab] = useState<DashboardTab>('team');
  const [togglingId, setTogglingId] = useState<string | null>(null);
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

  const handleCreate = async (data: CreateTeamMemberDTO) => {
    const res = await createTeamMemberAction(data);
    if (!res.ok) throw new Error(res.error);
    setModal(null);
    router.refresh();
  };

  const handleUpdate = async (id: string, data: UpdateTeamMemberDTO) => {
    const res = await updateTeamMemberAction(id, data);
    if (!res.ok) throw new Error(res.error);
    setModal(null);
    router.refresh();
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
            onEdit={(member) => setModal({ mode: 'edit', member })}
            onToggleStatus={handleToggleStatus}
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
