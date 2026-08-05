export const PROJECT_ORIGINS = [
  'client-work',
  'pyramid-product',
  'demo',
  'open-source',
  'other',
] as const;
export type ProjectOrigin = (typeof PROJECT_ORIGINS)[number];

export const PROJECT_LIFECYCLES = [
  'concept',
  'in-development',
  'launched',
  'maintained',
  'archived',
] as const;
export type ProjectLifecycle = (typeof PROJECT_LIFECYCLES)[number];

export const PROJECT_AVAILABILITIES = ['public', 'limited', 'private'] as const;
export type ProjectAvailability = (typeof PROJECT_AVAILABILITIES)[number];

export const PROJECT_PLATFORMS = [
  'web',
  'ios',
  'android',
  'macos',
  'windows',
  'linux',
  'api',
  'ai',
  'embedded',
  'design',
  'cross-platform',
  'other',
] as const;
export type ProjectPlatform = (typeof PROJECT_PLATFORMS)[number];

export const PROJECT_SERVICES = [
  'product-strategy',
  'product-design',
  'ux-research',
  'ui-design',
  'brand-identity',
  'mobile-development',
  'web-development',
  'desktop-development',
  'backend-development',
  'ai-integration',
  'infrastructure',
  'maintenance',
] as const;
export type ProjectService = (typeof PROJECT_SERVICES)[number];

export const MEDIA_KINDS = [
  'image',
  'capture',
  'mockup',
  'video',
  'animation',
  'diagram',
  'embed',
  'graphic',
] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

export const ACTION_KINDS = [
  'website',
  'web-demo',
  'app-store',
  'google-play',
  'download',
  'watch-demo',
  'source-code',
  'documentation',
  'request-access',
  'contact',
] as const;
export type ActionKind = (typeof ACTION_KINDS)[number];

export const SECTION_TYPES = [
  'rich-text',
  'full-media',
  'split',
  'gallery',
  'video',
  'features',
  'metrics',
  'quote',
  'tech',
  'diagram',
  'embed',
] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export type CaptureStatus = 'pending' | 'succeeded' | 'failed';

export const CAPTURE_SOURCE_TYPES = ['website', 'store-listing', 'docs', 'repo-social'] as const;
export type CaptureSourceType = (typeof CAPTURE_SOURCE_TYPES)[number];

export interface CaptureViewport {
  width: number;
  height: number;
}

export interface CaptureJob {
  projectId: string;
  mediaId: string;
  sourceType: CaptureSourceType;
  sourceUrl: string;
  viewport: CaptureViewport;
  requestedAt: string;
  idempotencyKey: string;
}

export interface CaptureBytes {
  body: Buffer;
  contentType: string;
  extension: string;
}

export type CaptureOutcome =
  | { ok: true; capture: CaptureBytes; provider: string }
  | { ok: false; reason: string; retryable: boolean };

export interface CaptureAdapter {
  sourceType: CaptureSourceType;
  capture(job: CaptureJob): Promise<CaptureOutcome>;
}

export interface CaptureProvider {
  name: string;
  available(): boolean;
  screenshot(url: string, viewport: CaptureViewport): Promise<CaptureBytes>;
}

export interface ProjectMediaDTO {
  id: string;
  kind: MediaKind;
  url: string | null;
  posterUrl: string | null;
  sourceUrl: string | null;
  provider: string | null;
  altText: string | null;
  caption: string | null;
  platform: ProjectPlatform | null;
  isFeatured: boolean;
  displayOrder: number;
  captureStatus: CaptureStatus | null;
  capturedAt: Date | null;
  captureError: string | null;
}

export interface ProjectActionDTO {
  id: string;
  kind: ActionKind;
  label: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface MediaRef {
  url: string;
  altText: string | null;
  caption?: string | null;
}

export interface MetricEntry {
  value: string;
  label: string;
}

export type SectionPayload =
  | { type: 'rich-text'; paragraphs: string[] }
  | { type: 'full-media'; media: MediaRef }
  | { type: 'split'; paragraphs: string[]; media: MediaRef; mediaSide: 'left' | 'right' }
  | { type: 'gallery'; items: MediaRef[] }
  | { type: 'video'; url: string; posterUrl: string; altText: string | null }
  | { type: 'features'; items: { title: string; description?: string | null }[] }
  | { type: 'metrics'; items: MetricEntry[] }
  | { type: 'quote'; quote: string; attribution?: string | null; role?: string | null }
  | { type: 'tech'; items: string[] }
  | { type: 'diagram'; media: MediaRef }
  | { type: 'embed'; provider: string; url: string; title: string };

export interface ProjectSectionDTO {
  id: string;
  heading: string | null;
  displayOrder: number;
  payload: SectionPayload;
}

export interface ProjectCardDTO {
  id: string;
  slug: string;
  title: string;
  summary: string;
  origin: ProjectOrigin;
  lifecycle: ProjectLifecycle;
  availability: ProjectAvailability;
  client: string | null;
  timeframe: string | null;
  platforms: ProjectPlatform[];
  services: ProjectService[];
  featuredMedia: ProjectMediaDTO | null;
  primaryAction: ProjectActionDTO | null;
}

export interface ProjectDetailDTO extends ProjectCardDTO {
  overview: string;
  industry: string | null;
  media: ProjectMediaDTO[];
  actions: ProjectActionDTO[];
  sections: ProjectSectionDTO[];
}

export interface AdminProjectDTO {
  id: string;
  slug: string;
  title: string;
  summary: string;
  overview: string;
  origin: ProjectOrigin;
  lifecycle: ProjectLifecycle;
  availability: ProjectAvailability;
  client: string | null;
  industry: string | null;
  timeframe: string | null;
  platforms: ProjectPlatform[];
  services: ProjectService[];
  featured: boolean;
  displayOrder: number;
  isActive: boolean;
  deactivatedAt: Date | null;
  reactivatedAt: Date | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  media: ProjectMediaDTO[];
  actions: ProjectActionDTO[];
  sections: ProjectSectionDTO[];
}

export interface AdminProjectListItemDTO {
  id: string;
  slug: string;
  title: string;
  client: string | null;
  origin: ProjectOrigin;
  platforms: ProjectPlatform[];
  featured: boolean;
  displayOrder: number;
  isActive: boolean;
  updatedAt: Date | null;
}

export interface MediaInput {
  id?: string;
  kind: MediaKind;
  url?: string | null;
  posterUrl?: string | null;
  sourceUrl?: string | null;
  provider?: string | null;
  altText?: string | null;
  caption?: string | null;
  platform?: ProjectPlatform | null;
  isFeatured: boolean;
  displayOrder: number;
}

export interface ActionInput {
  id?: string;
  kind: ActionKind;
  label: string;
  url: string;
  isPrimary: boolean;
  displayOrder: number;
}

export interface SectionInput {
  id?: string;
  heading?: string | null;
  displayOrder: number;
  payload: SectionPayload;
}

export interface CreateProjectInput {
  slug: string;
  title: string;
  summary: string;
  overview: string;
  origin: ProjectOrigin;
  lifecycle: ProjectLifecycle;
  availability: ProjectAvailability;
  client?: string | null;
  industry?: string | null;
  timeframe?: string | null;
  platforms: ProjectPlatform[];
  services: ProjectService[];
  featured: boolean;
  displayOrder: number;
  media: MediaInput[];
  actions: ActionInput[];
  sections: SectionInput[];
}

export type UpdateProjectInput = CreateProjectInput;

export type ProjectMutationResult =
  | { ok: true; id: string; slug: string }
  | { ok: false; error: string; field?: string };

export const ORIGIN_LABELS: Record<ProjectOrigin, string> = {
  'client-work': 'Client work',
  'pyramid-product': 'Pyramid product',
  demo: 'Demo',
  'open-source': 'Open source',
  other: 'Project',
};

export const LIFECYCLE_LABELS: Record<ProjectLifecycle, string> = {
  concept: 'Concept',
  'in-development': 'In development',
  launched: 'Launched',
  maintained: 'Maintained',
  archived: 'Archived',
};

export const AVAILABILITY_LABELS: Record<ProjectAvailability, string> = {
  public: 'Public',
  limited: 'Limited',
  private: 'Private',
};

export const PLATFORM_LABELS: Record<ProjectPlatform, string> = {
  web: 'Web',
  ios: 'iOS',
  android: 'Android',
  macos: 'macOS',
  windows: 'Windows',
  linux: 'Linux',
  api: 'API',
  ai: 'AI',
  embedded: 'Embedded',
  design: 'Design',
  'cross-platform': 'Cross-platform',
  other: 'Other',
};

export const SERVICE_LABELS: Record<ProjectService, string> = {
  'product-strategy': 'Product strategy',
  'product-design': 'Product design',
  'ux-research': 'UX research',
  'ui-design': 'UI design',
  'brand-identity': 'Brand identity',
  'mobile-development': 'Mobile development',
  'web-development': 'Web development',
  'desktop-development': 'Desktop development',
  'backend-development': 'Backend & API',
  'ai-integration': 'AI integration',
  infrastructure: 'Infrastructure',
  maintenance: 'Maintenance',
};

export const MEDIA_KIND_LABELS: Record<MediaKind, string> = {
  image: 'Image',
  capture: 'Generated capture',
  mockup: 'Device mockup',
  video: 'Video',
  animation: 'Animation',
  diagram: 'Diagram',
  embed: 'Embed',
  graphic: 'Branded graphic',
};

export const ACTION_KIND_LABELS: Record<ActionKind, string> = {
  website: 'Visit website',
  'web-demo': 'Open web demo',
  'app-store': 'View on App Store',
  'google-play': 'View on Google Play',
  download: 'Download application',
  'watch-demo': 'Watch demo',
  'source-code': 'View source code',
  documentation: 'Read documentation',
  'request-access': 'Request access',
  contact: 'Contact Pyramid',
};

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  'rich-text': 'Rich text',
  'full-media': 'Full-width media',
  split: 'Text and media',
  gallery: 'Image gallery',
  video: 'Video',
  features: 'Feature list',
  metrics: 'Metrics or results',
  quote: 'Quote or testimonial',
  tech: 'Technology list',
  diagram: 'Diagram',
  embed: 'Embed',
};
