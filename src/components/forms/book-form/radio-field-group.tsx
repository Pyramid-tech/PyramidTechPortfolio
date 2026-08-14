'use client';

import { FC, useId } from 'react';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface RadioField {
  title: string;
  classes: string;
  required: boolean;
  radioArray: { name: string; value: string }[];
}

interface Props {
  field: RadioField;
  onChange: (value: string) => void;
}

const RadioFieldGroup: FC<Props> = ({ field, onChange }) => {
  const labelId = useId();

  return (
    <div className="flex flex-col gap-3">
      <p id={labelId} className="text-balance text-sm font-semibold text-text-1">
        {field.title}
        {field.required && (
          <span className="ml-1 text-danger" aria-hidden>
            *
          </span>
        )}
      </p>
      <RadioGroup
        onValueChange={onChange}
        aria-labelledby={labelId}
        aria-required={field.required}
        className="flex flex-wrap gap-2"
        required
      >
        {field.radioArray.map((radio) => (
          <label
            key={radio.value}
            htmlFor={`${labelId}-${radio.value.trim()}`}
            className="group flex min-h-11 cursor-pointer items-center gap-2.5 rounded-full border border-stroke bg-bg-1/40 px-4 text-sm text-text-2 transition hover:border-text-3 hover:text-text-1 has-[button[data-state=checked]]:border-primary has-[button[data-state=checked]]:bg-primary/10 has-[button[data-state=checked]]:text-text-1"
          >
            <RadioGroupItem value={radio.value} id={`${labelId}-${radio.value.trim()}`} required />
            <span>{radio.name.trim()}</span>
          </label>
        ))}
      </RadioGroup>
    </div>
  );
};

export default RadioFieldGroup;
