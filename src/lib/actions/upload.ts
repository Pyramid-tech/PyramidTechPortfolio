'use server';

import { requireUser } from '@/lib/auth';
import { uploadObject, StorageError } from '@/lib/storage/supabaseStorage';

export type UploadResult = { ok: true; url: string } | { ok: false; error: string };

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
