'use client';

import { FC } from 'react';

import { cn } from '@/lib/utils';
import Input from '@/components/ui/input';

interface InputField {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}

interface Props {
  field: InputField;
  className?: string;
  onChange: (name: string, value: string) => void;
}

const TextField: FC<Props> = ({ field, className, onChange }) => (
  <div className={cn('flex flex-col gap-1.5', className)}>
    <label htmlFor={field.name} className="text-sm font-medium text-text-1/80">
      {field.label}
      {field.required && <span className="ml-1 text-red-400">*</span>}
    </label>
    <Input
      variant="marketing"
      onChange={({ target: { name, value } }) => onChange(name, value)}
      type={field.type || 'text'}
      name={field.name}
      id={field.name}
      placeholder={field.placeholder}
      required={field.required}
    />
  </div>
);

export default TextField;
