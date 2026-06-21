'use client';

import { FC, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type {
  AdminTeamMemberDTO,
  CreateTeamMemberDTO,
  UpdateTeamMemberDTO,
} from '@/modules/team/application/dtos/TeamMemberDTO';
import type { PyramidRequestRow } from '@/modules/book/infrastructure/models/PyramidRequest';
import MemberModal from './MemberModal';
import DashboardSkeleton from './Skeleton';

type Tab = 'team' | 'requests';

const SERVICE_LABELS: Record<string, string> = {
  'ai-solutions': 'AI Solutions',
  fullstack: 'Fullstack',
  'mobile-dev': 'Mobile',
  'all-types': 'All services',
  'other-service': 'Other',
};

const Dashboard: FC = () => {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('team');

  const [members, setMembers] = useState<AdminTeamMemberDTO[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [modal, setModal] = useState<{ mode: 'create' } | { mode: 'edit'; member: AdminTeamMemberDTO } | null>(null);

  const [requests, setRequests] = useState<PyramidRequestRow[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [loggingOut, setLoggingOut] = useState(false);

  const fetchMembers = useCallback(async () => {
    try {
      const res = await fetch('/api/team/admin');
      if (res.status === 401) { router.push('/login'); return; }
      setMembers(await res.json());
    } finally {
      setLoadingTeam(false);
    }
  }, [router]);

  const fetchRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const res = await fetch('/api/book');
      if (res.status === 401) { router.push('/login'); return; }
      setRequests(await res.json());
    } finally {
      setLoadingRequests(false);
    }
  }, [router]);

  useEffect(() => { fetchMembers(); }, [fetchMembers]);
  useEffect(() => {
    if (tab === 'requests' && requests.length === 0) fetchRequests();
  }, [tab, fetchRequests, requests.length]);

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
    <div className="min-h-screen bg-bg-1 p-4 sm:p-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold uppercase tracking-widest text-primary sm:text-3xl">Pyramid</h1>
            <p className="mt-1 text-xs text-text-1/50 sm:text-sm">Admin Dashboard</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {tab === 'team' && (
              <button
                onClick={() => setModal({ mode: 'create' })}
                className="rounded-lg border border-primary px-3 py-2 text-xs font-medium text-primary transition hover:bg-primary hover:text-bg-1 sm:px-4 sm:text-sm"
              >
                + Add Member
              </button>
            )}
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="rounded-lg border border-stroke px-3 py-2 text-xs text-text-1/60 transition hover:border-text-1/40 hover:text-text-1 disabled:opacity-50 sm:px-4 sm:text-sm"
            >
              {loggingOut ? 'Logging out…' : 'Logout'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b border-stroke">
          {(['team', 'requests'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2.5 text-sm font-medium capitalize transition sm:px-5 ${
                tab === t
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-text-1/40 hover:text-text-1/70'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Team tab ─────────────────────────────────────────────── */}
        {tab === 'team' && (
          loadingTeam ? (
            <DashboardSkeleton rows={5} tab="team" />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-stroke bg-bg-2">
              {members.length === 0 ? (
                <div className="py-16 text-center text-text-1/40">No members yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-sm">
                    <thead>
                      <tr className="border-b border-stroke text-left text-xs uppercase tracking-widest text-text-1/40">
                        <th className="px-4 py-4 sm:px-6">Name</th>
                        <th className="hidden px-4 py-4 sm:table-cell sm:px-6">Job Title</th>
                        <th className="hidden px-4 py-4 md:table-cell sm:px-6">Email</th>
                        <th className="hidden px-4 py-4 lg:table-cell sm:px-6">Order</th>
                        <th className="px-4 py-4 sm:px-6">Status</th>
                        <th className="px-4 py-4 text-right sm:px-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.map((m, i) => (
                        <tr
                          key={m.id}
                          className={`border-b border-stroke/50 transition hover:bg-bg-1/40 ${i === members.length - 1 ? 'border-b-0' : ''}`}
                        >
                          <td className="px-4 py-4 font-medium text-text-1 sm:px-6">{m.name}</td>
                          <td className="hidden px-4 py-4 text-text-1/70 sm:table-cell sm:px-6">{m.jobTitle}</td>
                          <td className="hidden px-4 py-4 text-text-1/70 md:table-cell sm:px-6">{m.email}</td>
                          <td className="hidden px-4 py-4 text-text-1/50 lg:table-cell sm:px-6">{m.displayOrder}</td>
                          <td className="px-4 py-4 sm:px-6">
                            <span className={`rounded-full px-2 py-1 text-xs font-medium sm:px-3 ${m.isActive ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                              {m.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right sm:px-6">
                            <div className="flex items-center justify-end gap-1 sm:gap-2">
                              <button
                                onClick={() => setModal({ mode: 'edit', member: m })}
                                className="rounded-md px-2 py-1.5 text-xs text-primary transition hover:bg-primary/10 sm:px-3"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleToggleStatus(m)}
                                disabled={togglingId === m.id}
                                className={`rounded-md px-2 py-1.5 text-xs transition disabled:opacity-50 sm:px-3 ${m.isActive ? 'text-red-400 hover:bg-red-500/10' : 'text-green-400 hover:bg-green-500/10'}`}
                              >
                                {togglingId === m.id ? '…' : m.isActive ? 'Deactivate' : 'Reactivate'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        )}

        {/* ── Requests tab ─────────────────────────────────────────── */}
        {tab === 'requests' && (
          loadingRequests ? (
            <DashboardSkeleton rows={5} tab="requests" />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-stroke bg-bg-2">
              {requests.length === 0 ? (
                <div className="py-16 text-center text-text-1/40">No requests yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-sm">
                    <thead>
                      <tr className="border-b border-stroke text-left text-xs uppercase tracking-widest text-text-1/40">
                        <th className="px-4 py-4 sm:px-6">Name</th>
                        <th className="hidden px-4 py-4 md:table-cell sm:px-6">Email</th>
                        <th className="hidden px-4 py-4 md:table-cell sm:px-6">Company</th>
                        <th className="px-4 py-4 sm:px-6">Service</th>
                        <th className="hidden px-4 py-4 lg:table-cell sm:px-6">Budget</th>
                        <th className="hidden px-4 py-4 sm:table-cell sm:px-6">Date</th>
                        <th className="px-4 py-4 text-right sm:px-6">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((r, i) => (
                        <>
                          <tr
                            key={r.id}
                            className={`border-b border-stroke/50 transition hover:bg-bg-1/40 ${expandedId === r.id ? 'bg-bg-1/40' : ''} ${i === requests.length - 1 && expandedId !== r.id ? 'border-b-0' : ''}`}
                          >
                            <td className="px-4 py-4 font-medium text-text-1 sm:px-6">{r.name}</td>
                            <td className="hidden px-4 py-4 text-text-1/70 md:table-cell sm:px-6">{r.email}</td>
                            <td className="hidden px-4 py-4 text-text-1/70 md:table-cell sm:px-6">{r.company}</td>
                            <td className="px-4 py-4 text-text-1/70 sm:px-6">{SERVICE_LABELS[r.service] ?? r.service}</td>
                            <td className="hidden px-4 py-4 text-text-1/50 lg:table-cell sm:px-6">{r.budget}</td>
                            <td className="hidden px-4 py-4 text-text-1/50 sm:table-cell sm:px-6">
                              {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '—'}
                            </td>
                            <td className="px-4 py-4 text-right sm:px-6">
                              <button
                                onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                                className="rounded-md px-2 py-1.5 text-xs text-primary transition hover:bg-primary/10 sm:px-3"
                              >
                                {expandedId === r.id ? 'Hide' : 'View'}
                              </button>
                            </td>
                          </tr>
                          {expandedId === r.id && (
                            <tr key={`${r.id}-detail`} className={`border-b border-stroke/50 bg-bg-1/60 ${i === requests.length - 1 ? 'border-b-0' : ''}`}>
                              <td colSpan={7} className="px-4 pb-4 pt-2 sm:px-6">
                                <div className="grid grid-cols-1 gap-x-8 gap-y-1.5 text-xs text-text-1/60 sm:grid-cols-2">
                                  <span><strong className="text-text-1/80">Email:</strong> {r.email}</span>
                                  <span><strong className="text-text-1/80">Company:</strong> {r.company}</span>
                                  <span><strong className="text-text-1/80">Phone:</strong> {r.phone}</span>
                                  <span><strong className="text-text-1/80">Pages:</strong> {r.pages}</span>
                                  <span><strong className="text-text-1/80">Budget:</strong> {r.budget}</span>
                                  <span><strong className="text-text-1/80">Timeline:</strong> {r.quickness}</span>
                                  {r.websiteUrl && <span className="sm:col-span-2"><strong className="text-text-1/80">Website:</strong> {r.websiteUrl}</span>}
                                  {r.message && (
                                    <span className="sm:col-span-2 mt-1">
                                      <strong className="text-text-1/80">Message:</strong> {r.message}
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
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
