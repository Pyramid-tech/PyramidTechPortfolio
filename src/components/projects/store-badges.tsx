import { FC } from 'react';

import type { ActionKind, ProjectActionDTO } from '@/types/project';
import { cn } from '@/lib/utils';

import StoreBadge, { storeActions, type StoreBadgeSize } from './store-badge';

const HIDDEN_ON_OTHER_DEVICE: Partial<Record<ActionKind, { rival: ActionKind; hide: string }>> = {
  'app-store': { rival: 'google-play', hide: 'android:hidden' },
  'google-play': { rival: 'app-store', hide: 'ios:hidden' },
};

interface Props {
  actions: ProjectActionDTO[];
  size?: StoreBadgeSize;
  matchDevice?: boolean;
  className?: string;
}

const StoreBadges: FC<Props> = ({ actions, size = 'md', matchDevice = false, className }) => {
  const badges = storeActions(actions);
  if (badges.length === 0) return null;

  const has = (kind: ActionKind) => badges.some((action) => action.kind === kind);
  const onlyDownloads = badges.every((action) => action.kind === 'download');

  return (
    <ul className={cn('flex flex-wrap items-center gap-4', className)}>
      {badges.map((action) => {
        const rule = matchDevice ? HIDDEN_ON_OTHER_DEVICE[action.kind] : undefined;
        return (
          <li key={action.id} className={cn('flex', rule && has(rule.rival) && rule.hide)}>
            <StoreBadge action={action} size={size} emphasized={onlyDownloads} />
          </li>
        );
      })}
    </ul>
  );
};

export default StoreBadges;
