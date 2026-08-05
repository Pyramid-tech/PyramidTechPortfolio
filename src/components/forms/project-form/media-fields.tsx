'use client';

import { FC } from 'react';

import type { MediaInput, MediaKind, ProjectPlatform } from '@/types/project';
import {
  MEDIA_KINDS,
  MEDIA_KIND_LABELS,
  PROJECT_PLATFORMS,
  PLATFORM_LABELS,
} from '@/types/project';
import Field from '@/components/ui/field';
import Input from '@/components/ui/input';
import Select from '@/components/ui/select';

import ImageField from './image-field';
import RepeatableRow from './repeatable-row';

interface Props {
  media: MediaInput[];
  projectId?: string;
  onChange: (media: MediaInput[]) => void;
  onMove: (index: number, delta: number) => void;
  onAdd: () => void;
  onUploadingChange: (uploading: boolean) => void;
  onRequestCapture?: (mediaId: string) => void;
  capturingId?: string | null;
}

const NEEDS_ASSET: MediaKind[] = ['image', 'mockup', 'video', 'animation', 'diagram', 'graphic'];
const NEEDS_SOURCE: MediaKind[] = ['capture', 'embed'];
const NEEDS_POSTER: MediaKind[] = ['video', 'animation'];

const MediaFields: FC<Props> = ({
  media,
  projectId,
  onChange,
  onMove,
  onAdd,
  onUploadingChange,
  onRequestCapture,
  capturingId,
}) => {
  const patch = (index: number, changes: Partial<MediaInput>) =>
    onChange(media.map((m, i) => (i === index ? { ...m, ...changes } : m)));

  const setFeatured = (index: number) =>
    onChange(media.map((m, i) => ({ ...m, isFeatured: i === index })));

  const remove = (index: number) => onChange(media.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-4">
      {media.map((item, index) => (
        <RepeatableRow
          key={item.id ?? index}
          label="Asset"
          index={index}
          total={media.length}
          onMove={onMove}
          onRemove={remove}
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Type">
              <Select
                value={item.kind}
                onChange={(e) => patch(index, { kind: e.target.value as MediaKind })}
              >
                {MEDIA_KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {MEDIA_KIND_LABELS[kind]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Platform shown (optional)">
              <Select
                value={item.platform ?? ''}
                onChange={(e) =>
                  patch(index, { platform: (e.target.value || null) as ProjectPlatform | null })
                }
              >
                <option value="">Not specific</option>
                {PROJECT_PLATFORMS.map((platform) => (
                  <option key={platform} value={platform}>
                    {PLATFORM_LABELS[platform]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          {NEEDS_ASSET.includes(item.kind) && (
            <ImageField
              label={item.kind === 'video' || item.kind === 'animation' ? 'Video URL' : 'Asset'}
              value={item.url ?? ''}
              projectId={projectId}
              onChange={(url) => patch(index, { url })}
              onUploadingChange={onUploadingChange}
            />
          )}

          {NEEDS_POSTER.includes(item.kind) && (
            <ImageField
              label="Poster image"
              value={item.posterUrl ?? ''}
              projectId={projectId}
              onChange={(posterUrl) => patch(index, { posterUrl })}
              onUploadingChange={onUploadingChange}
            />
          )}

          {NEEDS_SOURCE.includes(item.kind) && (
            <Field label={item.kind === 'capture' ? 'Capture source URL' : 'Embed URL'}>
              <Input
                value={item.sourceUrl ?? ''}
                onChange={(e) => patch(index, { sourceUrl: e.target.value })}
                placeholder="https://…"
              />
            </Field>
          )}

          {item.kind === 'capture' && (
            <div className="flex flex-wrap items-center gap-3">
              {item.url ? (
                <img
                  src={item.url}
                  alt=""
                  className="h-16 w-24 rounded-lg border border-stroke object-cover"
                />
              ) : (
                <p className="text-xs text-text-1/40">No capture generated yet.</p>
              )}
              {item.id && onRequestCapture && (
                <button
                  type="button"
                  onClick={() => onRequestCapture(item.id!)}
                  disabled={capturingId === item.id}
                  className="rounded-lg border border-stroke px-3 py-1.5 text-xs text-text-1/60 transition hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
                >
                  {capturingId === item.id ? 'Requesting…' : 'Generate capture'}
                </button>
              )}
              {!item.id && (
                <p className="text-xs text-text-1/40">Save the project first to generate a capture.</p>
              )}
            </div>
          )}

          <Field label="Alternative text">
            <Input
              value={item.altText ?? ''}
              onChange={(e) => patch(index, { altText: e.target.value })}
              placeholder="What the image shows"
            />
          </Field>

          <Field label="Caption (optional)">
            <Input
              value={item.caption ?? ''}
              onChange={(e) => patch(index, { caption: e.target.value })}
            />
          </Field>

          <label className="flex w-fit cursor-pointer items-center gap-2 text-sm text-text-1/70">
            <input
              type="radio"
              name="featured-media"
              checked={item.isFeatured}
              onChange={() => setFeatured(index)}
              className="accent-[#CCC2DC]"
            />
            Featured visual
          </label>
        </RepeatableRow>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="w-fit rounded-lg border border-stroke px-4 py-2 text-xs text-text-1/60 transition hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        + Add asset
      </button>
    </div>
  );
};

export default MediaFields;
