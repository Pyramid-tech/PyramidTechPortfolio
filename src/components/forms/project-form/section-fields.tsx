'use client';

import { FC } from 'react';

import type { SectionInput, SectionType } from '@/types/project';
import { SECTION_TYPES, SECTION_TYPE_LABELS } from '@/types/project';
import { emptyPayload } from '@/hooks/use-project-form';
import Field from '@/components/ui/field';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

import RepeatableRow from './repeatable-row';
import SectionPayloadFields from './section-payload-fields';

interface Props {
  sections: SectionInput[];
  projectId?: string;
  onChange: (sections: SectionInput[]) => void;
  onMove: (index: number, delta: number) => void;
  onAdd: () => void;
  onUploadingChange: (uploading: boolean) => void;
}

const SectionFields: FC<Props> = ({
  sections,
  projectId,
  onChange,
  onMove,
  onAdd,
  onUploadingChange,
}) => {
  const patch = (index: number, changes: Partial<SectionInput>) =>
    onChange(sections.map((s, i) => (i === index ? { ...s, ...changes } : s)));

  const remove = (index: number) => onChange(sections.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section, index) => (
        <RepeatableRow
          key={section.id ?? index}
          label="Module"
          index={index}
          total={sections.length}
          onMove={onMove}
          onRemove={remove}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Module type">
              <Select
                value={section.payload.type}
                onChange={(e) =>
                  patch(index, { payload: emptyPayload(e.target.value as SectionType) })
                }
              >
                {SECTION_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {SECTION_TYPE_LABELS[type]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Heading (optional)">
              <Input
                value={section.heading ?? ''}
                onChange={(e) => patch(index, { heading: e.target.value })}
              />
            </Field>
          </div>

          <SectionPayloadFields
            payload={section.payload}
            projectId={projectId}
            onChange={(payload) => patch(index, { payload })}
            onUploadingChange={onUploadingChange}
          />
        </RepeatableRow>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="w-fit rounded-lg border border-stroke px-4 py-2 text-xs text-text-1/60 transition hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        + Add module
      </button>
    </div>
  );
};

export default SectionFields;
