'use client';

import { FC } from 'react';

import type { ActionInput, ActionKind } from '@/types/project';
import { ACTION_KINDS, ACTION_KIND_LABELS } from '@/types/project';
import Field from '@/components/ui/field';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

import RepeatableRow from './repeatable-row';

interface Props {
  actions: ActionInput[];
  onChange: (actions: ActionInput[]) => void;
  onMove: (index: number, delta: number) => void;
  onAdd: () => void;
}

const ActionFields: FC<Props> = ({ actions, onChange, onMove, onAdd }) => {
  const patch = (index: number, changes: Partial<ActionInput>) =>
    onChange(actions.map((a, i) => (i === index ? { ...a, ...changes } : a)));

  const setPrimary = (index: number) =>
    onChange(actions.map((a, i) => ({ ...a, isPrimary: i === index })));

  const remove = (index: number) => onChange(actions.filter((_, i) => i !== index));

  const changeKind = (index: number, kind: ActionKind) => {
    const current = actions[index];
    const wasDefaultLabel = ACTION_KIND_LABELS[current.kind] === current.label;
    patch(index, { kind, label: wasDefaultLabel ? ACTION_KIND_LABELS[kind] : current.label });
  };

  return (
    <div className="flex flex-col gap-4">
      {actions.map((action, index) => (
        <RepeatableRow
          key={action.id ?? index}
          label="Action"
          index={index}
          total={actions.length}
          onMove={onMove}
          onRemove={remove}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Destination type">
              <Select
                value={action.kind}
                onChange={(e) => changeKind(index, e.target.value as ActionKind)}
              >
                {ACTION_KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {ACTION_KIND_LABELS[kind]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Button label">
              <Input value={action.label} onChange={(e) => patch(index, { label: e.target.value })} />
            </Field>
          </div>

          <Field label="URL">
            <Input
              value={action.url}
              onChange={(e) => patch(index, { url: e.target.value })}
              placeholder={action.kind === 'contact' ? 'mailto:… or https://…' : 'https://…'}
            />
          </Field>

          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-text-1/70">
            <input
              type="radio"
              name="primary-action"
              checked={action.isPrimary}
              onChange={() => setPrimary(index)}
              className="accent-[#CCC2DC]"
            />
            Primary action
          </label>
        </RepeatableRow>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="w-fit rounded-lg border border-stroke px-4 py-2 text-xs text-text-1/60 transition hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        + Add action
      </button>
    </div>
  );
};

export default ActionFields;
