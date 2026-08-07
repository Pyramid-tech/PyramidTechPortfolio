'use client';

import { ChangeEvent, FC, useRef, useState } from 'react';

import { uploadProjectMediaAction } from '@/lib/actions/upload';
import Field from '@/components/ui/field';
import Input from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';

interface Props {
  label: string;
  value: string;
  projectId?: string;
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

const ImageField: FC<Props> = ({ label, value, projectId, onChange, onUploadingChange }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const setUploadingState = (next: boolean) => {
    setUploading(next);
    onUploadingChange?.(next);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadingState(true);
    try {
      const body = new FormData();
      body.append('file', file);
      if (projectId) body.append('projectId', projectId);
      const res = await uploadProjectMediaAction(body);
      if (!res.ok) throw new Error(res.error);
      onChange(res.url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploadingState(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <Field label={label}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-stroke bg-bg-1">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-widest text-text-1/20">
              None
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-scrim">
              <Spinner />
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://…"
            aria-label={`${label} URL`}
          />
          <div className="flex items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className="rounded-lg border border-stroke px-3 py-1.5 text-xs text-text-1/60 transition hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
            >
              {uploading ? 'Uploading…' : value ? 'Replace image' : 'Upload image'}
            </button>
            {value && !uploading && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-xs text-danger/70 transition hover:text-danger"
              >
                Clear
              </button>
            )}
          </div>
          {uploadError && <p className="text-xs text-danger">{uploadError}</p>}
        </div>
      </div>
    </Field>
  );
};

export default ImageField;
