'use client';

import { ChangeEvent, FormEvent, useState } from 'react';

import type { AdminTeamMemberDTO, CreateTeamMemberDTO, UpdateTeamMemberDTO } from '@/types/team';

export interface MemberFormState {
  name: string;
  jobTitle: string;
  description: string;
  email: string;
  linkedinUrl: string;
  avatarUrl: string;
  password: string;
  displayOrder: number | string;
}

interface Args {
  mode: 'create' | 'edit';
  member?: AdminTeamMemberDTO;
  onCreate: (data: CreateTeamMemberDTO) => Promise<void>;
  onUpdate: (id: string, data: UpdateTeamMemberDTO) => Promise<void>;
}

// Owns the team-member form's state, field binding and create/update mapping.
export function useMemberForm({ mode, member, onCreate, onUpdate }: Args) {
  const [form, setForm] = useState<MemberFormState>({
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
  const [error, setError] = useState<string | null>(null);

  const setField =
    (key: keyof MemberFormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const setAvatarUrl = (avatarUrl: string) => setForm((prev) => ({ ...prev, avatarUrl }));

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

  return { form, setField, setAvatarUrl, loading, error, handleSubmit };
}
