import { FC } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Download } from 'lucide-react';

import type { ActionKind, ProjectActionDTO } from '@/types/project';
import { cn } from '@/lib/utils';

export const STORE_KINDS = ['app-store', 'google-play', 'download'] as const;
export type StoreKind = (typeof STORE_KINDS)[number];

export type OfficialStore = Exclude<StoreKind, 'download'>;

export function isStoreKind(kind: ActionKind): kind is StoreKind {
  return (STORE_KINDS as readonly ActionKind[]).includes(kind);
}

export function storeActions(actions: ProjectActionDTO[]): ProjectActionDTO[] {
  return actions
    .filter((action) => isStoreKind(action.kind))
    .sort(
      (a, b) => STORE_KINDS.indexOf(a.kind as StoreKind) - STORE_KINDS.indexOf(b.kind as StoreKind),
    );
}

interface OfficialBadge {
  src: string;
  alt: string;
  width: number;
  height: number;
  credit: string;
}

export const OFFICIAL_BADGES: Record<OfficialStore, OfficialBadge> = {
  'app-store': {
    src: '/badges/download-on-the-app-store.svg',
    alt: 'Download on the App Store',
    width: 120,
    height: 40,
    credit:
      'Apple and the Apple logo are trademarks of Apple Inc., registered in the U.S. and other countries. App Store is a service mark of Apple Inc.',
  },
  'google-play': {
    src: '/badges/get-it-on-google-play.svg',
    alt: 'Get it on Google Play',
    width: 135,
    height: 40,
    credit: 'Google Play and the Google Play logo are trademarks of Google LLC.',
  },
};

export type StoreBadgeSize = 'md' | 'lg';

const HEIGHT: Record<StoreBadgeSize, string> = {
  md: 'h-12',
  lg: 'h-14',
};

const FOCUS =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-bg-1';

interface Props {
  action: ProjectActionDTO;
  size?: StoreBadgeSize;
  emphasized?: boolean;
}

const StoreBadge: FC<Props> = ({ action, size = 'md', emphasized = false }) => {
  if (!isStoreKind(action.kind)) return null;

  if (action.kind !== 'download') {
    const badge = OFFICIAL_BADGES[action.kind];

    return (
      <a
        href={action.url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn('inline-flex rounded-lg', FOCUS)}
      >
        <Image
          src={badge.src}
          alt={badge.alt}
          width={badge.width}
          height={badge.height}
          unoptimized
          className={cn('w-auto', HEIGHT[size])}
        />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    );
  }

  return (
    <a
      href={action.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group/badge inline-flex min-w-44 items-center gap-3 rounded-lg border px-4 transition duration-300',
        HEIGHT[size],
        FOCUS,
        emphasized
          ? 'border-text-strong bg-text-strong text-bg-1 hover:border-primary hover:bg-primary'
          : 'border-stroke text-text-1 hover:border-primary hover:text-primary',
      )}
    >
      <Download aria-hidden className="size-6 shrink-0" />
      <span className="flex min-w-0 flex-col text-left">
        <span className="text-[0.625rem] uppercase leading-none tracking-[0.08em] opacity-75">
          Direct download
        </span>
        <span className="mt-1 max-w-56 truncate font-display text-base font-semibold leading-none tracking-tight">
          {action.label}
        </span>
      </span>
      <ArrowUpRight
        aria-hidden
        className="ml-auto size-4 shrink-0 opacity-50 transition duration-300 group-hover/badge:opacity-100"
      />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
};

export default StoreBadge;
