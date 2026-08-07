'use client';

import { FC } from 'react';

import type { SectionPayload, MediaRef } from '@/types/project';
import { EMBED_PROVIDERS } from '@/lib/validations/project';
import Field from '@/components/ui/field';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Select from '@/components/ui/select';

import ImageField from './image-field';

interface Props {
  payload: SectionPayload;
  projectId?: string;
  onChange: (payload: SectionPayload) => void;
  onUploadingChange: (uploading: boolean) => void;
}

function paragraphsToText(paragraphs: string[]): string {
  return paragraphs.join('\n\n');
}

function textToParagraphs(text: string): string[] {
  const parts = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [''];
}

const ListEditor: FC<{
  label: string;
  values: string[];
  placeholder?: string;
  onChange: (values: string[]) => void;
}> = ({ label, values, placeholder, onChange }) => (
  <Field label={label}>
    <Textarea
      rows={4}
      value={values.join('\n')}
      placeholder={placeholder}
      onChange={(e) => {
        const next = e.target.value.split('\n').map((v) => v.trim());
        onChange(next.filter((v, i) => v.length > 0 || i === next.length - 1));
      }}
    />
    <p className="text-xs text-text-1/40">One per line.</p>
  </Field>
);

const MediaRefFields: FC<{
  label: string;
  media: MediaRef;
  projectId?: string;
  onChange: (media: MediaRef) => void;
  onUploadingChange: (uploading: boolean) => void;
}> = ({ label, media, projectId, onChange, onUploadingChange }) => (
  <>
    <ImageField
      label={label}
      value={media.url}
      projectId={projectId}
      onChange={(url) => onChange({ ...media, url })}
      onUploadingChange={onUploadingChange}
    />
    <Field label="Alternative text">
      <Input
        value={media.altText ?? ''}
        onChange={(e) => onChange({ ...media, altText: e.target.value })}
      />
    </Field>
  </>
);

const SectionPayloadFields: FC<Props> = ({ payload, projectId, onChange, onUploadingChange }) => {
  switch (payload.type) {
    case 'rich-text':
      return (
        <Field label="Text">
          <Textarea
            rows={6}
            value={paragraphsToText(payload.paragraphs)}
            onChange={(e) => onChange({ ...payload, paragraphs: textToParagraphs(e.target.value) })}
            placeholder="Separate paragraphs with a blank line."
          />
        </Field>
      );

    case 'full-media':
    case 'diagram':
      return (
        <MediaRefFields
          label="Image"
          media={payload.media}
          projectId={projectId}
          onChange={(media) => onChange({ ...payload, media })}
          onUploadingChange={onUploadingChange}
        />
      );

    case 'split':
      return (
        <>
          <Field label="Text">
            <Textarea
              rows={5}
              value={paragraphsToText(payload.paragraphs)}
              onChange={(e) =>
                onChange({ ...payload, paragraphs: textToParagraphs(e.target.value) })
              }
            />
          </Field>
          <MediaRefFields
            label="Image"
            media={payload.media}
            projectId={projectId}
            onChange={(media) => onChange({ ...payload, media })}
            onUploadingChange={onUploadingChange}
          />
          <Field label="Image side">
            <Select
              value={payload.mediaSide}
              onChange={(e) =>
                onChange({ ...payload, mediaSide: e.target.value as 'left' | 'right' })
              }
            >
              <option value="right">Right</option>
              <option value="left">Left</option>
            </Select>
          </Field>
        </>
      );

    case 'gallery':
      return (
        <div className="flex flex-col gap-3">
          {payload.items.map((item, i) => (
            <div key={i} className="rounded-lg border border-stroke/60 p-3">
              <MediaRefFields
                label={`Image ${i + 1}`}
                media={item}
                projectId={projectId}
                onChange={(media) =>
                  onChange({
                    ...payload,
                    items: payload.items.map((it, idx) => (idx === i ? media : it)),
                  })
                }
                onUploadingChange={onUploadingChange}
              />
              {payload.items.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    onChange({ ...payload, items: payload.items.filter((_, idx) => idx !== i) })
                  }
                  className="mt-2 text-xs text-danger/70 transition hover:text-danger"
                >
                  Remove image
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({ ...payload, items: [...payload.items, { url: '', altText: '' }] })
            }
            className="w-fit rounded-lg border border-stroke px-3 py-1.5 text-xs text-text-1/60 transition hover:border-primary/60 hover:text-primary"
          >
            + Add image
          </button>
        </div>
      );

    case 'video':
      return (
        <>
          <Field label="Video URL">
            <Input
              value={payload.url}
              onChange={(e) => onChange({ ...payload, url: e.target.value })}
              placeholder="https://…"
            />
          </Field>
          <ImageField
            label="Poster image"
            value={payload.posterUrl}
            projectId={projectId}
            onChange={(posterUrl) => onChange({ ...payload, posterUrl })}
            onUploadingChange={onUploadingChange}
          />
          <Field label="Description">
            <Input
              value={payload.altText ?? ''}
              onChange={(e) => onChange({ ...payload, altText: e.target.value })}
            />
          </Field>
        </>
      );

    case 'features':
      return (
        <div className="flex flex-col gap-3">
          {payload.items.map((item, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border border-stroke/60 p-3">
              <Field label={`Feature ${i + 1}`}>
                <Input
                  value={item.title}
                  onChange={(e) =>
                    onChange({
                      ...payload,
                      items: payload.items.map((it, idx) =>
                        idx === i ? { ...it, title: e.target.value } : it,
                      ),
                    })
                  }
                />
              </Field>
              <Field label="Description (optional)">
                <Textarea
                  rows={2}
                  value={item.description ?? ''}
                  onChange={(e) =>
                    onChange({
                      ...payload,
                      items: payload.items.map((it, idx) =>
                        idx === i ? { ...it, description: e.target.value } : it,
                      ),
                    })
                  }
                />
              </Field>
              {payload.items.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    onChange({ ...payload, items: payload.items.filter((_, idx) => idx !== i) })
                  }
                  className="w-fit text-xs text-danger/70 transition hover:text-danger"
                >
                  Remove feature
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({ ...payload, items: [...payload.items, { title: '', description: '' }] })
            }
            className="w-fit rounded-lg border border-stroke px-3 py-1.5 text-xs text-text-1/60 transition hover:border-primary/60 hover:text-primary"
          >
            + Add feature
          </button>
        </div>
      );

    case 'metrics':
      return (
        <div className="flex flex-col gap-3">
          {payload.items.map((item, i) => (
            <div key={i} className="grid grid-cols-1 gap-2 rounded-lg border border-stroke/60 p-3 sm:grid-cols-2">
              <Field label="Value">
                <Input
                  value={item.value}
                  placeholder="35%"
                  onChange={(e) =>
                    onChange({
                      ...payload,
                      items: payload.items.map((it, idx) =>
                        idx === i ? { ...it, value: e.target.value } : it,
                      ),
                    })
                  }
                />
              </Field>
              <Field label="What it measures">
                <Input
                  value={item.label}
                  placeholder="faster onboarding"
                  onChange={(e) =>
                    onChange({
                      ...payload,
                      items: payload.items.map((it, idx) =>
                        idx === i ? { ...it, label: e.target.value } : it,
                      ),
                    })
                  }
                />
              </Field>
              {payload.items.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    onChange({ ...payload, items: payload.items.filter((_, idx) => idx !== i) })
                  }
                  className="w-fit text-xs text-danger/70 transition hover:text-danger"
                >
                  Remove metric
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              onChange({ ...payload, items: [...payload.items, { value: '', label: '' }] })
            }
            className="w-fit rounded-lg border border-stroke px-3 py-1.5 text-xs text-text-1/60 transition hover:border-primary/60 hover:text-primary"
          >
            + Add metric
          </button>
        </div>
      );

    case 'quote':
      return (
        <>
          <Field label="Quote">
            <Textarea
              rows={3}
              value={payload.quote}
              onChange={(e) => onChange({ ...payload, quote: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Attribution (optional)">
              <Input
                value={payload.attribution ?? ''}
                onChange={(e) => onChange({ ...payload, attribution: e.target.value })}
              />
            </Field>
            <Field label="Role (optional)">
              <Input
                value={payload.role ?? ''}
                onChange={(e) => onChange({ ...payload, role: e.target.value })}
              />
            </Field>
          </div>
        </>
      );

    case 'tech':
      return (
        <ListEditor
          label="Technologies"
          values={payload.items}
          placeholder={'Next.js\nPostgres\nSupabase'}
          onChange={(items) => onChange({ ...payload, items })}
        />
      );

    case 'embed':
      return (
        <>
          <Field label="Provider">
            <Select
              value={payload.provider}
              onChange={(e) => onChange({ ...payload, provider: e.target.value })}
            >
              {EMBED_PROVIDERS.map((provider) => (
                <option key={provider} value={provider}>
                  {provider}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Embed URL">
            <Input
              value={payload.url}
              onChange={(e) => onChange({ ...payload, url: e.target.value })}
              placeholder="https://…"
            />
          </Field>
          <Field label="Title">
            <Input
              value={payload.title}
              onChange={(e) => onChange({ ...payload, title: e.target.value })}
            />
          </Field>
        </>
      );
  }
};

export default SectionPayloadFields;
