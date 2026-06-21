import axios, { type AxiosError, type AxiosInstance } from 'axios';

/**
 * Server-side client for the Supabase Storage REST API.
 *
 * Used by the Next.js server (avatar upload action) and the worker (cleanup job).
 * Never import this from client components — it carries the service-role key.
 * Env is read lazily so scripts/worker that load `.env.local` after imports work.
 */

const BUCKET = 'public_pyramid';

/** Public base URL for objects in the bucket (trailing slash included). */
export function storagePublicBase(): string {
  return `${process.env.SUPABASE_URL}/storage/v1/object/public/${BUCKET}/`;
}

/** Error thrown when a storage operation fails, preserving the HTTP status. */
export class StorageError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

let _client: AxiosInstance | null = null;

function client(): AxiosInstance {
  if (_client) return _client;
  const instance = axios.create({
    baseURL: `${process.env.SUPABASE_URL}/storage/v1`,
    headers: { Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}` },
  });
  // Normalize upstream failures into a StorageError so callers stay provider-agnostic.
  instance.interceptors.response.use(
    (res) => res,
    (error: AxiosError) => {
      const status = error.response?.status ?? 500;
      const data = error.response?.data;
      const message =
        typeof data === 'string' ? data : ((data as { message?: string })?.message ?? error.message);
      return Promise.reject(new StorageError(message, status));
    },
  );
  _client = instance;
  return instance;
}

/** Public URL for an object at `path` within the bucket. */
function publicUrl(path: string): string {
  return `${storagePublicBase()}${path}`;
}

/** Upload raw bytes to `path` and return the object's public URL. */
export async function uploadObject(
  path: string,
  body: Buffer,
  contentType: string,
): Promise<string> {
  await client().post(`/object/${BUCKET}/${path}`, body, {
    headers: { 'Content-Type': contentType },
  });
  return publicUrl(path);
}

/** List object paths under `prefix` (paths include the prefix). */
export async function listObjects(prefix: string, limit = 1000): Promise<string[]> {
  const { data } = await client().post<{ name: string }[]>(`/object/list/${BUCKET}`, {
    prefix,
    limit,
  });
  return data.map((f) => `${prefix}${f.name}`);
}

/** Delete the objects at the given paths. */
export async function deleteObjects(paths: string[]): Promise<void> {
  await client().delete(`/object/${BUCKET}`, { data: { prefixes: paths } });
}
