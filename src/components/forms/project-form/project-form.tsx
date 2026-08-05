'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import type { AdminProjectDTO, CreateProjectInput, ProjectMutationResult } from '@/types/project';
import {
  PROJECT_ORIGINS,
  PROJECT_LIFECYCLES,
  PROJECT_AVAILABILITIES,
  PROJECT_PLATFORMS,
  PROJECT_SERVICES,
  ORIGIN_LABELS,
  LIFECYCLE_LABELS,
  AVAILABILITY_LABELS,
  PLATFORM_LABELS,
  SERVICE_LABELS,
} from '@/types/project';
import {
  useProjectForm,
  emptyMedia,
  emptyAction,
  emptySection,
} from '@/hooks/use-project-form';
import { requestProjectCaptureAction } from '@/lib/actions/project';
import { normalizeSlug } from '@/lib/validations/project';
import Field from '@/components/ui/field';
import Input from '@/components/ui/input';
import Textarea from '@/components/ui/textarea';
import Select from '@/components/ui/select';

import FormSection from './form-section';
import CheckboxGroup from './checkbox-group';
import MediaFields from './media-fields';
import ActionFields from './action-fields';
import SectionFields from './section-fields';

interface Props {
  mode: 'create' | 'edit';
  project?: AdminProjectDTO;
  onSubmit: (input: CreateProjectInput) => Promise<ProjectMutationResult>;
}

const ProjectForm: FC<Props> = ({ mode, project, onSubmit }) => {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [capturingId, setCapturingId] = useState<string | null>(null);
  const [captureNote, setCaptureNote] = useState<string | null>(null);

  const {
    form,
    update,
    setTitle,
    toggleInList,
    setMedia,
    setActions,
    setSections,
    moveMedia,
    moveAction,
    moveSection,
    loading,
    error,
    saved,
    handleSubmit,
  } = useProjectForm({ mode, project, onSubmit });

  const handleRequestCapture = async (mediaId: string) => {
    setCaptureNote(null);
    setCapturingId(mediaId);
    try {
      const res = await requestProjectCaptureAction(mediaId);
      setCaptureNote(
        res.ok ? 'Capture queued. It will appear here once the worker finishes.' : res.error,
      );
      if (res.ok) router.refresh();
    } finally {
      setCapturingId(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <FormSection title="Identity">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Title">
            <Input value={form.title} onChange={(e) => setTitle(e.target.value)} required />
          </Field>
          <Field label="Slug">
            <Input
              value={form.slug}
              onChange={(e) => update('slug', e.target.value)}
              onBlur={(e) => update('slug', normalizeSlug(e.target.value))}
              required
            />
          </Field>
        </div>

        <Field label="Summary">
          <Textarea
            rows={2}
            value={form.summary}
            onChange={(e) => update('summary', e.target.value)}
            placeholder="One or two lines for the project card and search results."
            required
          />
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Client (optional)">
            <Input value={form.client} onChange={(e) => update('client', e.target.value)} />
          </Field>
          <Field label="Industry (optional)">
            <Input value={form.industry} onChange={(e) => update('industry', e.target.value)} />
          </Field>
          <Field label="Timeframe (optional)">
            <Input
              value={form.timeframe}
              onChange={(e) => update('timeframe', e.target.value)}
              placeholder="2025 — 2026"
            />
          </Field>
        </div>
      </FormSection>

      <FormSection title="Classification">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Origin">
            <Select
              value={form.origin}
              onChange={(e) => update('origin', e.target.value as typeof form.origin)}
            >
              {PROJECT_ORIGINS.map((origin) => (
                <option key={origin} value={origin}>
                  {ORIGIN_LABELS[origin]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Lifecycle">
            <Select
              value={form.lifecycle}
              onChange={(e) => update('lifecycle', e.target.value as typeof form.lifecycle)}
            >
              {PROJECT_LIFECYCLES.map((lifecycle) => (
                <option key={lifecycle} value={lifecycle}>
                  {LIFECYCLE_LABELS[lifecycle]}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Public availability">
            <Select
              value={form.availability}
              onChange={(e) => update('availability', e.target.value as typeof form.availability)}
            >
              {PROJECT_AVAILABILITIES.map((availability) => (
                <option key={availability} value={availability}>
                  {AVAILABILITY_LABELS[availability]}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <CheckboxGroup
          legend="Platforms"
          options={PROJECT_PLATFORMS}
          labels={PLATFORM_LABELS}
          selected={form.platforms}
          onToggle={(value) => toggleInList('platforms', value)}
        />

        <CheckboxGroup
          legend="Pyramid services"
          options={PROJECT_SERVICES}
          labels={SERVICE_LABELS}
          selected={form.services}
          onToggle={(value) => toggleInList('services', value)}
        />
      </FormSection>

      <FormSection
        title="Showcase media"
        description="One asset can be marked as the featured visual. Without one, the first usable asset is used, then the Pyramid fallback."
      >
        <MediaFields
          media={form.media}
          projectId={project?.id}
          onChange={setMedia}
          onMove={moveMedia}
          onAdd={() => setMedia([...form.media, emptyMedia(form.media.length)])}
          onUploadingChange={setUploading}
          onRequestCapture={handleRequestCapture}
          capturingId={capturingId}
        />
        {captureNote && <p className="text-xs text-text-1/60">{captureNote}</p>}
      </FormSection>

      <FormSection
        title="Actions"
        description="Optional. A project with no external destination still links to its case study."
      >
        <ActionFields
          actions={form.actions}
          onChange={setActions}
          onMove={moveAction}
          onAdd={() => setActions([...form.actions, emptyAction(form.actions.length)])}
        />
      </FormSection>

      <FormSection title="Case study">
        <Field label="Overview">
          <Textarea
            rows={5}
            value={form.overview}
            onChange={(e) => update('overview', e.target.value)}
            placeholder="Separate paragraphs with a blank line."
            required
          />
        </Field>

        <SectionFields
          sections={form.sections}
          projectId={project?.id}
          onChange={setSections}
          onMove={moveSection}
          onAdd={() => setSections([...form.sections, emptySection(form.sections.length)])}
          onUploadingChange={setUploading}
        />
      </FormSection>

      <FormSection title="Display">
        <div className="flex flex-wrap items-end gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-text-1/70">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update('featured', e.target.checked)}
              className="accent-[#CCC2DC]"
            />
            Show in Selected Work on the homepage
          </label>
          <Field label="Display order">
            <Input
              type="number"
              value={form.displayOrder}
              onChange={(e) => update('displayOrder', e.target.value)}
              className="w-28"
            />
          </Field>
        </div>
      </FormSection>

      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      {saved && (
        <p className="rounded-lg bg-green-500/10 px-4 py-2 text-sm text-green-400" role="status">
          Saved.
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-3">
        <Link
          href="/dashboard/projects"
          className="rounded-lg px-4 py-2 text-sm text-text-1/50 transition hover:text-text-1"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading || uploading}
          className="rounded-lg border border-primary bg-primary/10 px-6 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-bg-1 disabled:opacity-50"
        >
          {loading ? 'Saving…' : mode === 'create' ? 'Create project' : 'Save changes'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
