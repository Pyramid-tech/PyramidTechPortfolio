'use client';

import { FC, useState } from 'react';

import type { AdminTeamMemberDTO, CreateTeamMemberDTO, UpdateTeamMemberDTO } from '@/types/team';
import { useMemberForm } from '@/hooks/use-member-form';
import Modal from '@/components/ui/modal';

import AvatarPicker from './avatar-picker';
import MemberFormFields from './member-form-fields';

interface Props {
  mode: 'create' | 'edit';
  member?: AdminTeamMemberDTO;
  onCreate: (data: CreateTeamMemberDTO) => Promise<void>;
  onUpdate: (id: string, data: UpdateTeamMemberDTO) => Promise<void>;
  onClose: () => void;
}

const MemberModal: FC<Props> = ({ mode, member, onCreate, onUpdate, onClose }) => {
  const { form, setField, setAvatarUrl, loading, error, handleSubmit } = useMemberForm({
    mode,
    member,
    onCreate,
    onUpdate,
  });
  const [uploading, setUploading] = useState(false);

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
            {loading ? 'Saving…' : mode === 'create' ? 'Create' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MemberModal;
