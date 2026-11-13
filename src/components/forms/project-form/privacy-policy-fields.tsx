'use client';

import { FC, useState } from 'react';

import { hasPolicyPlaceholders } from '@/lib/policy-markup';
import { privacyPolicyTemplate } from '@/lib/policy-template';
import { SITE } from '@/lib/site';
import Field from '@/components/ui/field';
import Textarea from '@/components/ui/textarea';

interface Props {
  value: string;
  slug: string;
  title: string;
  onChange: (value: string) => void;
}

const PrivacyPolicyFields: FC<Props> = ({ value, slug, title, onChange }) => {
  const [copied, setCopied] = useState(false);

  const filled = value.trim().length > 0;
  const url = `${SITE.url}/work/${slug || 'your-slug'}/privacy`;

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Field label="Policy text">
        <Textarea
          rows={filled ? 16 : 4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Leave empty if this project is not a store app."
          className="resize-y font-mono text-xs leading-relaxed"
        />
      </Field>

      <p className="text-xs leading-relaxed text-text-3">
        Start a line with ## for a heading or - for a bullet, wrap words in ** to make them bold,
        and leave a blank line between paragraphs. Web and email addresses become links.
      </p>

      {!filled && (
        <button
          type="button"
          onClick={() => onChange(privacyPolicyTemplate(title.trim() || 'This app'))}
          className="w-fit rounded-lg border border-stroke px-4 py-2 text-xs text-text-3 transition hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          Start from the template
        </button>
      )}

      {filled && hasPolicyPlaceholders(value) && (
        <p
          className="rounded-lg bg-warning-surface/10 px-4 py-2 text-xs text-warning"
          role="status"
        >
          Replace every [[placeholder]] with the real details of this app. The project cannot be
          saved until none are left.
        </p>
      )}

      {filled && (
        <div className="flex flex-col gap-2 rounded-lg border border-stroke/60 p-3">
          <p className="text-xs uppercase tracking-widest text-text-3">Public address</p>
          <div className="flex flex-wrap items-center gap-3">
            <code className="break-all text-xs text-text-1">{url}</code>
            <button
              type="button"
              onClick={copy}
              className="rounded-lg border border-stroke px-3 py-1 text-xs text-text-3 transition hover:border-primary/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="text-xs leading-relaxed text-text-3">
            Enter this address as the Privacy Policy URL in App Store Connect and Play Console, and
            link to it inside the app. It stays online even if the project is deactivated. Changing
            the slug changes this address, so update both stores if you do.
          </p>
        </div>
      )}
    </>
  );
};

export default PrivacyPolicyFields;
