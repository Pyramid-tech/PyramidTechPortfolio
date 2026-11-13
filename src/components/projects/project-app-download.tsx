import { FC } from 'react';

import type { ProjectActionDTO } from '@/types/project';

import { OFFICIAL_BADGES, storeActions, type OfficialStore } from './store-badge';
import StoreBadges from './store-badges';

function availability(actions: ProjectActionDTO[]): string {
  const has = (kind: ProjectActionDTO['kind']) => actions.some((action) => action.kind === kind);

  const stores = [
    has('app-store') ? 'the App Store' : null,
    has('google-play') ? 'Google Play' : null,
  ].filter(Boolean);

  const parts = [
    stores.length > 0 ? `on ${stores.join(' and ')}` : null,
    has('download') ? 'as a direct download' : null,
  ].filter(Boolean);

  return `Available ${parts.join(' and ')}.`;
}

interface Props {
  title: string;
  actions: ProjectActionDTO[];
}

const ProjectAppDownload: FC<Props> = ({ title, actions }) => {
  const badges = storeActions(actions);
  if (badges.length === 0) return null;

  const credits = (Object.keys(OFFICIAL_BADGES) as OfficialStore[])
    .filter((store) => badges.some((action) => action.kind === store))
    .map((store) => OFFICIAL_BADGES[store].credit);

  return (
    <section
      aria-labelledby="get-the-app"
      className="border-t border-gray-1 px-6 py-14 md:px-12 md:py-20"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 rounded-2xl border border-stroke bg-bg-2 p-6 sm:p-8 md:p-12 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.14em] text-primary">Get the app</p>
          <h2
            id="get-the-app"
            className="font-display text-3xl font-semibold leading-tight text-text-1 md:text-5xl"
          >
            Download {title}
          </h2>
          <p className="max-w-xl text-base leading-relaxed text-text-2 md:text-lg">
            {availability(badges)} Install it and see the work first-hand.
          </p>
        </div>

        <StoreBadges actions={badges} size="lg" className="lg:justify-end" />
      </div>

      {credits.length > 0 && (
        <p className="mx-auto mt-5 max-w-6xl text-xs leading-relaxed text-text-3">
          {credits.join(' ')}
        </p>
      )}
    </section>
  );
};

export default ProjectAppDownload;
