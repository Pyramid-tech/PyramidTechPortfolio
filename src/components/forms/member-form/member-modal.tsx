'use client';

import { FC, useState } from 'react';

import type { AdminTeamMemberDTO, CreateTeamMemberDTO, UpdateTeamMemberDTO, MemberMutationResult } from '@/types/team';
import { useMemberForm } from '@/hooks/use-member-form';
import Modal from '@/components/ui/modal';

import AvatarPicker from './avatar-picker';
import MemberFormFields from './member-form-fields';

interface Props {
  mode: 'create' | 'edit';
  member?: AdminTeamMemberDTO;
  onCreate: (data: CreateTeamMemberDTO) => Promise<MemberMutationResult>;
  onUpdate: (id: string, data: UpdateTeamMemberDTO) => Promise<MemberMutationResult>;
  onClose: () => void;
}

const MemberModal: FC<Props> = ({ mode, member, onCreate, onUpdate, onClose }) => {
  const { form, setField, setAvatarUrl, loading, error, result, handleSubmit } = useMemberForm({
    mode,
    member,
    onCreate,
    onUpdate,
  });
  const [uploading, setUploading] = useState(false);

  // After a successful save, show the AI verdict instead of the form.
  if (result) {
    const published = result.status === 'approved';
    return (
      <Modal onClose={onClose}>
        <h2 className="mb-4 font-display text-xl font-bold uppercase tracking-widest text-primary">
          {published ? 'Published' : 'Pending approval'}
        </h2>

        <div className="flex flex-col gap-4">
          <p
            className={`rounded-lg px-4 py-3 text-sm ${
              published ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
            }`}
          >
            {published
              ? 'Passed the AI check — this member is now live on the team page.'
              : 'Did not pass the AI check — this member is hidden from the team page until the owner approves it.'}
          </p>

          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-text-1/50">Confidence score</dt>
              <dd className="font-medium text-text-1">
                {result.confidence === null ? '—' : `${result.confidence}/100`}
              </dd>
            </div>
            {result.reason && (
              <div className="flex flex-col gap-1">
                <dt className="text-text-1/50">Reason</dt>
                <dd className="text-text-1">{result.reason}</dd>
              </div>
            )}
          </dl>

          <div className="mt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-primary bg-primary/10 px-6 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-bg-1"
            >
              Done
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-6 font-display text-xl font-bold uppercase tracking-widest text-primary">
        {mode === 'create' ? 'Add Member' : 'Edit Member'}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <AvatarPicker
          name={form.name}
          avatarUrl={form.avatarUrl}
          onChange={setAvatarUrl}
          onUploadingChange={setUploading}
        />
        <MemberFormFields mode={mode} form={form} setField={setField} />

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
            {loading ? 'Checking…' : mode === 'create' ? 'Create' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MemberModal;
