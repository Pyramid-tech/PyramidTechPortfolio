'use client';

import { FC, FormEvent, useRef, useState } from 'react';
import type {
  AdminTeamMemberDTO,
  CreateTeamMemberDTO,
  UpdateTeamMemberDTO,
} from '@/types/team';
import { uploadAvatarAction } from '@/lib/actions/upload';

interface Props {
  mode: 'create' | 'edit';
  member?: AdminTeamMemberDTO;
  onCreate: (data: CreateTeamMemberDTO) => Promise<void>;
  onUpdate: (id: string, data: UpdateTeamMemberDTO) => Promise<void>;
  onClose: () => void;
}

const Field: FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs uppercase tracking-widest text-text-1/50">{label}</label>
    {children}
  </div>
);

const input =
  'rounded-lg border border-stroke bg-transparent px-3 py-2 text-sm text-text-1 outline-none transition focus:border-primary';

const MemberModal: FC<Props> = ({ mode, member, onCreate, onUpdate, onClose }) => {
  const [form, setForm] = useState({
    name: member?.name ?? '',
    jobTitle: member?.jobTitle ?? '',
    description: member?.description ?? '',
    email: member?.email ?? '',
    linkedinUrl: member?.linkedinUrl ?? '',
    avatarUrl: member?.avatarUrl ?? '',
    password: '',
    displayOrder: member?.displayOrder ?? 0,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await uploadAvatarAction(body);
      if (!res.ok) throw new Error(res.error);
      setForm((prev) => ({ ...prev, avatarUrl: res.url }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'create') {
        await onCreate({
          name: form.name,
          jobTitle: form.jobTitle,
          description: form.description || null,
          email: form.email,
          linkedinUrl: form.linkedinUrl || null,
          avatarUrl: form.avatarUrl || null,
          password: form.password,
          displayOrder: Number(form.displayOrder),
        });
      } else {
        const update: UpdateTeamMemberDTO = {
          name: form.name,
          jobTitle: form.jobTitle,
          description: form.description || null,
          linkedinUrl: form.linkedinUrl || null,
          avatarUrl: form.avatarUrl || null,
          displayOrder: Number(form.displayOrder),
        };
        if (form.password) update.password = form.password;
        await onUpdate(member!.id, update);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm sm:items-center">
      <div className="relative w-full max-w-lg rounded-2xl border border-stroke bg-bg-2 p-6 shadow-2xl sm:p-8">
        <button onClick={onClose} className="absolute right-5 top-5 text-text-1/40 transition hover:text-text-1">
          ✕
        </button>

        <h2 className="mb-6 text-xl font-bold uppercase tracking-widest text-primary">
          {mode === 'create' ? 'Add Member' : 'Edit Member'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Avatar picker */}
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-stroke bg-bg-1">
              {form.avatarUrl ? (
                <img src={form.avatarUrl} alt="Avatar preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-2xl text-text-1/20">
                  {form.name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <svg className="h-5 w-5 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="rounded-lg border border-stroke px-3 py-1.5 text-xs text-text-1/60 transition hover:border-primary/60 hover:text-primary disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : form.avatarUrl ? 'Change photo' : 'Upload photo'}
              </button>
              {form.avatarUrl && !uploading && (
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, avatarUrl: '' }))}
                  className="text-left text-xs text-red-400/70 transition hover:text-red-400"
                >
                  Remove
                </button>
              )}
              {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input className={input} value={form.name} onChange={set('name')} required />
            </Field>
            <Field label="Job Title">
              <input className={input} value={form.jobTitle} onChange={set('jobTitle')} required />
            </Field>
          </div>

          {mode === 'create' && (
            <Field label="Email">
              <input className={input} type="email" value={form.email} onChange={set('email')} required />
            </Field>
          )}

          <Field label="Description">
            <textarea
              className={`${input} resize-none`}
              rows={2}
              value={form.description}
              onChange={set('description')}
            />
          </Field>

          <Field label="LinkedIn URL">
            <input className={input} value={form.linkedinUrl} onChange={set('linkedinUrl')} />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={mode === 'create' ? 'Password' : 'New Password (leave blank to keep)'}>
              <input
                className={input}
                type="password"
                value={form.password}
                onChange={set('password')}
                required={mode === 'create'}
              />
            </Field>
            <Field label="Display Order">
              <input className={input} type="number" value={form.displayOrder} onChange={set('displayOrder')} />
            </Field>
          </div>

          {error && <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">{error}</p>}

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-text-1/50 transition hover:text-text-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || uploading}
              className="rounded-lg border border-primary bg-primary/10 px-6 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-bg-1 disabled:opacity-50"
            >
              {loading ? 'Saving…' : mode === 'create' ? 'Create' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberModal;
