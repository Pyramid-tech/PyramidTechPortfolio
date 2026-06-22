'use client';

import { ChangeEvent, FC } from 'react';

import Field from '@/components/ui/field';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import type { MemberFormState } from '@/hooks/use-member-form';

interface Props {
  mode: 'create' | 'edit';
  form: MemberFormState;
  setField: (key: keyof MemberFormState) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const MemberFormFields: FC<Props> = ({ mode, form, setField }) => (
  <>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label="Name">
        <Input value={form.name} onChange={setField('name')} required />
      </Field>
      <Field label="Job Title">
        <Input value={form.jobTitle} onChange={setField('jobTitle')} required />
      </Field>
    </div>

    {mode === 'create' && (
      <Field label="Email">
        <Input type="email" value={form.email} onChange={setField('email')} required />
      </Field>
    )}

    <Field label="Description">
      <Textarea rows={2} value={form.description} onChange={setField('description')} />
    </Field>

    <Field label="LinkedIn URL">
      <Input value={form.linkedinUrl} onChange={setField('linkedinUrl')} />
    </Field>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field label={mode === 'create' ? 'Password' : 'New Password (leave blank to keep)'}>
        <Input type="password" value={form.password} onChange={setField('password')} required={mode === 'create'} />
      </Field>
      <Field label="Display Order">
        <Input type="number" value={form.displayOrder} onChange={setField('displayOrder')} />
      </Field>
    </div>
  </>
);

export default MemberFormFields;
