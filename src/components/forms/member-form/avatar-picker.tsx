'use client';

import { ChangeEvent, FC, useRef, useState } from 'react';

import { uploadAvatarAction } from '@/lib/actions/upload';
import Spinner from '@/components/ui/spinner';

interface Props {
  name: string;
  avatarUrl: string;
  onChange: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

const AvatarPicker: FC<Props> = ({ name, avatarUrl, onChange, onUploadingChange }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const setUploadingState = (value: boolean) => {
    setUploading(value);
    onUploadingChange?.(value);
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadingState(true);
    try {
      const body = new FormData();
      body.append('file', file);
      const res = await uploadAvatarAction(body);
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
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border border-stroke bg-bg-1">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar preview" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl text-text-1/20">
            {name?.[0]?.toUpperCase() ?? '?'}
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <Spinner />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className="rounded-lg border border-stroke px-3 py-1.5 text-xs text-text-1/60 transition hover:border-primary/60 hover:text-primary disabled:opacity-50"
        >
          {uploading ? 'Uploading…' : avatarUrl ? 'Change photo' : 'Upload photo'}
        </button>
        {avatarUrl && !uploading && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-left text-xs text-red-400/70 transition hover:text-red-400"
          >
            Remove
          </button>
        )}
        {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}
      </div>
    </div>
  );
};

export default AvatarPicker;
