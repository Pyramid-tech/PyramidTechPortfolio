import { FC } from 'react';

import { EMBED_PROVIDERS } from '@/lib/validations/project';

interface Props {
  provider: string;
  url: string;
  title: string;
}

function isAllowed(provider: string): boolean {
  return (EMBED_PROVIDERS as readonly string[]).includes(provider);
}

const ProjectEmbed: FC<Props> = ({ provider, url, title }) => {
  if (!isAllowed(provider)) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-stroke bg-bg-2">
      <iframe
        src={url}
        title={title}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
};

export default ProjectEmbed;
