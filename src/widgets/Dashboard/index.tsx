'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  AdminTeamMemberDTO,
  CreateTeamMemberDTO,
  UpdateTeamMemberDTO,
} from '@/modules/team/application/dtos/TeamMemberDTO';
import MemberModal from './MemberModal';
import DashboardSkeleton from './Skeleton';

const Dashboard: FC = () => {
  const router = useRouter();
  const [members, setMembers] = useState<AdminTeamMemberDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ mode: 'create' } | { mode: 'edit'; member: AdminTeamMemberDTO } | null>(null);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch('/api/team/admin');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      setMembers(await res.json());
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const handleToggleStatus = async (member: AdminTeamMemberDTO) => {
    setTogglingId(member.id);
    const action = member.isActive ? 'deactivate' : 'reactivate';
    await fetch(`/api/team/${member.id}/${action}`, { method: 'PATCH' });
    await fetchMembers();
    setTogglingId(null);
  };

  const handleCreate = async (data: CreateTeamMemberDTO) => {
    await fetch('/api/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setModal(null);
    fetchMembers();
  };

  const handleUpdate = async (id: string, data: UpdateTeamMemberDTO) => {
    await fetch(`/api/team/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setModal(null);
    fetchMembers();
  };

  return (
    <div className="min-h-screen bg-bg-1 p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-widest text-primary">Pyramid</h1>
            <p className="mt-1 text-sm text-text-1/50">Team Management</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setModal({ mode: 'create' })}
              className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-bg-1"
            >
              + Add Member
            </button>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg border border-stroke px-4 py-2 text-sm text-text-1/60 transition hover:border-text-1/40 hover:text-text-1 disabled:opacity-50"
            >
              {loggingOut ? 'Logging out…' : 'Logout'}
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <DashboardSkeleton rows={5} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-stroke bg-bg-2">
            {members.length === 0 ? (
              <div className="py-16 text-center text-text-1/40">No members yet.</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-stroke text-left text-xs uppercase tracking-widest text-text-1/40">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Job Title</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Order</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m, i) => (
                    <tr
                      key={m.id}
                      className={`border-b border-stroke/50 transition hover:bg-bg-1/40 ${i === members.length - 1 ? 'border-b-0' : ''}`}
                    >
                      <td className="px-6 py-4 font-medium text-text-1">{m.name}</td>
                      <td className="px-6 py-4 text-text-1/70">{m.jobTitle}</td>
                      <td className="px-6 py-4 text-text-1/70">{m.email}</td>
                      <td className="px-6 py-4 text-text-1/50">{m.displayOrder}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${m.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}
                        >
                          {m.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setModal({ mode: 'edit', member: m })}
                            className="rounded-md px-3 py-1.5 text-xs text-primary transition hover:bg-primary/10"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(m)}
                            disabled={togglingId === m.id}
                            className={`rounded-md px-3 py-1.5 text-xs transition disabled:opacity-50 ${m.isActive ? 'text-red-400 hover:bg-red-500/10' : 'text-green-400 hover:bg-green-500/10'}`}
                          >
                            {togglingId === m.id ? '…' : m.isActive ? 'Deactivate' : 'Reactivate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
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
