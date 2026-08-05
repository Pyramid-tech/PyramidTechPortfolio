'use server';

import { requireUser } from '@/lib/auth';
import { uploadObject, StorageError } from '@/lib/storage/supabaseStorage';

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
  'image/gif': 'gif',
};

function uniquePath(prefix: string, ext: string): string {
  return `${prefix}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
}

export async function uploadAvatarAction(formData: FormData): Promise<UploadResult> {
  await requireUser();

  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false, error: 'No file provided' };

  const ext = file.name.split('.').pop() ?? 'jpg';
  const path = `avatars/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const url = await uploadObject(path, buffer, file.type || 'application/octet-stream');
    return { ok: true, url };
  } catch (e) {
    return { ok: false, error: e instanceof StorageError ? e.message : 'Upload failed' };
  }
}

export async function uploadProjectMediaAction(formData: FormData): Promise<UploadResult> {
  await requireUser();

  const file = formData.get('file');
  if (!(file instanceof File)) return { ok: false, error: 'No file provided' };

  if (!IMAGE_TYPES.includes(file.type)) {
    return { ok: false, error: 'Only JPEG, PNG, WebP, AVIF or GIF images are accepted' };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { ok: false, error: 'Image must be 8 MB or smaller' };
  }

  const rawProjectId = formData.get('projectId');
  const projectId = typeof rawProjectId === 'string' && rawProjectId ? rawProjectId : 'drafts';
  const path = uniquePath(`projects/${projectId}`, EXTENSIONS[file.type] ?? 'bin');
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const url = await uploadObject(path, buffer, file.type);
    return { ok: true, url };
  } catch (e) {
    return { ok: false, error: e instanceof StorageError ? e.message : 'Upload failed' };
  }
}
