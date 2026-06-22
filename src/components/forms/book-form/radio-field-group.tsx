'use client';

import { FC } from 'react';

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

const RadioFieldGroup: FC<Props> = ({ field, onChange }) => (
  <fieldset className="flex flex-col rounded-xl border border-stroke/60 bg-bg-1/40 p-4 sm:p-5">
    <legend className="px-1 text-sm font-semibold text-text-1">
      {field.title}
      {field.required && <span className="ml-1 text-red-400">*</span>}
    </legend>
    <RadioGroup onValueChange={onChange} className="mt-3 gap-1" required>
      {field.radioArray.map((radio) => (
        <label
          key={radio.value}
          htmlFor={radio.name}
          className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm text-text-1/80 transition hover:bg-bg-2/70 hover:text-text-1"
        >
          <RadioGroupItem value={radio.value} id={radio.name} required />
          <span>{radio.name.trim()}</span>
        </label>
      ))}
    </RadioGroup>
  </fieldset>
);

export default RadioFieldGroup;
