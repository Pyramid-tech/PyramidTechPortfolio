'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import type {
  AdminProjectDTO,
  CreateProjectInput,
  MediaInput,
  ActionInput,
  SectionInput,
  ProjectMutationResult,
  ProjectOrigin,
  ProjectLifecycle,
  ProjectAvailability,
  ProjectPlatform,
  ProjectService,
  SectionType,
  SectionPayload,
} from '@/types/project';
import { normalizeSlug } from '@/lib/validations/project';

export interface ProjectFormState {
  slug: string;
  title: string;
  summary: string;
  overview: string;
  origin: ProjectOrigin;
  lifecycle: ProjectLifecycle;
  availability: ProjectAvailability;
  client: string;
  industry: string;
  timeframe: string;
  platforms: ProjectPlatform[];
  services: ProjectService[];
  featured: boolean;
  displayOrder: number | string;
  media: MediaInput[];
  actions: ActionInput[];
  sections: SectionInput[];
}

export function emptyPayload(type: SectionType): SectionPayload {
  switch (type) {
    case 'rich-text':
      return { type, paragraphs: [''] };
    case 'full-media':
      return { type, media: { url: '', altText: '' } };
    case 'split':
      return { type, paragraphs: [''], media: { url: '', altText: '' }, mediaSide: 'right' };
    case 'gallery':
      return { type, items: [{ url: '', altText: '' }] };
    case 'video':
      return { type, url: '', posterUrl: '', altText: '' };
    case 'features':
      return { type, items: [{ title: '', description: '' }] };
    case 'metrics':
      return { type, items: [{ value: '', label: '' }] };
    case 'quote':
      return { type, quote: '', attribution: '', role: '' };
    case 'tech':
      return { type, items: [''] };
    case 'diagram':
      return { type, media: { url: '', altText: '' } };
    case 'embed':
      return { type, provider: 'youtube', url: '', title: '' };
  }
}

export function emptyMedia(displayOrder: number): MediaInput {
  return {
    kind: 'image',
    url: '',
    posterUrl: '',
    sourceUrl: '',
    provider: '',
    altText: '',
    caption: '',
    platform: null,
    isFeatured: false,
    displayOrder,
  };
}

export function emptyAction(displayOrder: number): ActionInput {
  return { kind: 'website', label: 'Visit website', url: '', isPrimary: false, displayOrder };
}

export function emptySection(displayOrder: number): SectionInput {
  return { heading: '', displayOrder, payload: emptyPayload('rich-text') };
}

function initialState(project?: AdminProjectDTO): ProjectFormState {
  return {
    slug: project?.slug ?? '',
    title: project?.title ?? '',
    summary: project?.summary ?? '',
    overview: project?.overview ?? '',
    origin: project?.origin ?? 'client-work',
    lifecycle: project?.lifecycle ?? 'launched',
    availability: project?.availability ?? 'public',
    client: project?.client ?? '',
    industry: project?.industry ?? '',
    timeframe: project?.timeframe ?? '',
    platforms: project?.platforms ?? [],
    services: project?.services ?? [],
    featured: project?.featured ?? false,
    displayOrder: project?.displayOrder ?? 0,
    media:
      project?.media.map((m) => ({
        id: m.id,
        kind: m.kind,
        url: m.url ?? '',
        posterUrl: m.posterUrl ?? '',
        sourceUrl: m.sourceUrl ?? '',
        provider: m.provider ?? '',
        altText: m.altText ?? '',
        caption: m.caption ?? '',
        platform: m.platform,
        isFeatured: m.isFeatured,
        displayOrder: m.displayOrder,
      })) ?? [],
    actions:
      project?.actions.map((a) => ({
        id: a.id,
        kind: a.kind,
        label: a.label,
        url: a.url,
        isPrimary: a.isPrimary,
        displayOrder: a.displayOrder,
      })) ?? [],
    sections:
      project?.sections.map((s) => ({
        id: s.id,
        heading: s.heading ?? '',
        displayOrder: s.displayOrder,
        payload: s.payload,
      })) ?? [],
  };
}

function move<T>(items: T[], index: number, delta: number): T[] {
  const target = index + delta;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function reindex<T extends { displayOrder: number }>(items: T[]): T[] {
  return items.map((item, i) => ({ ...item, displayOrder: i }));
}

function toInput(form: ProjectFormState): CreateProjectInput {
  return {
    slug: form.slug,
    title: form.title.trim(),
    summary: form.summary.trim(),
    overview: form.overview.trim(),
    origin: form.origin,
    lifecycle: form.lifecycle,
    availability: form.availability,
    client: form.client.trim() || null,
    industry: form.industry.trim() || null,
    timeframe: form.timeframe.trim() || null,
    platforms: form.platforms,
    services: form.services,
    featured: form.featured,
    displayOrder: Number(form.displayOrder) || 0,
    media: reindex(form.media),
    actions: reindex(form.actions),
    sections: reindex(form.sections),
  };
}

interface Args {
  mode: 'create' | 'edit';
  project?: AdminProjectDTO;
  onSubmit: (input: CreateProjectInput) => Promise<ProjectMutationResult>;
}

export function useProjectForm({ mode, project, onSubmit }: Args) {
  const [form, setForm] = useState<ProjectFormState>(() => initialState(project));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = useCallback(
    <K extends keyof ProjectFormState>(key: K, value: ProjectFormState[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setDirty(true);
      setSaved(false);
    },
    [],
  );

  const slugTouched = useMemo(() => mode === 'edit' || form.slug.length > 0, [mode, form.slug]);

  const setTitle = useCallback(
    (title: string) => {
      setForm((prev) => ({
        ...prev,
        title,
        slug: slugTouched ? prev.slug : normalizeSlug(title),
      }));
      setDirty(true);
      setSaved(false);
    },
    [slugTouched],
  );

  const toggleInList = useCallback(<T>(key: 'platforms' | 'services', value: T) => {
    setForm((prev) => {
      const list = prev[key] as unknown as T[];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...prev, [key]: next };
    });
    setDirty(true);
    setSaved(false);
  }, []);

  const setMedia = useCallback((media: MediaInput[]) => update('media', reindex(media)), [update]);
  const setActions = useCallback(
    (actions: ActionInput[]) => update('actions', reindex(actions)),
    [update],
  );
  const setSections = useCallback(
    (sections: SectionInput[]) => update('sections', reindex(sections)),
    [update],
  );

  const moveMedia = useCallback(
    (index: number, delta: number) => setMedia(move(form.media, index, delta)),
    [form.media, setMedia],
  );
  const moveAction = useCallback(
    (index: number, delta: number) => setActions(move(form.actions, index, delta)),
    [form.actions, setActions],
  );
  const moveSection = useCallback(
    (index: number, delta: number) => setSections(move(form.sections, index, delta)),
    [form.sections, setSections],
  );

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await onSubmit(toInput(form));
      if (res.ok) {
        setDirty(false);
        setSaved(true);
      } else {
        setError(res.error);
      }
      return res;
    } catch {
      setError('Something went wrong. Please try again.');
      return { ok: false as const, error: 'Something went wrong. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  return {
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
    dirty,
    saved,
    handleSubmit,
  };
}
