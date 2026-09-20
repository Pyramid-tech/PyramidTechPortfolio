import { ImageResponse } from 'next/og';

import { SITE } from '@/lib/site';

export const runtime = 'edge';
export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#141218',
        padding: '72px 80px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -180,
          right: -140,
          width: 620,
          height: 620,
          borderRadius: 620,
          background: 'radial-gradient(circle at 50% 50%, #2d2d5d 0%, #1b1b38 55%, #141218 100%)',
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <svg width="56" height="56" viewBox="0 0 64 64">
          <path d="M32 11 53 51H11z" fill="#4f7cff" />
          <path d="M23.6 35h16.8l2.6 5H21z" fill="#141218" fillOpacity="0.72" />
          <path d="M27.9 26.8h8.2l2.6 5H25.3z" fill="#141218" fillOpacity="0.72" />
        </svg>
        <div
          style={{
            fontSize: 34,
            letterSpacing: 10,
            color: '#e6e0e9',
            fontWeight: 700,
          }}
        >
          PYRAMID
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            fontSize: 76,
            lineHeight: 1.05,
            color: '#ffffff',
            fontWeight: 700,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          AI agents, web and mobile products, shipped to production.
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 28, color: '#b3abbd' }}
        >
          <span>{SITE.location}</span>
          <span style={{ color: '#4f7cff' }}>·</span>
          <span>{new URL(SITE.url).host}</span>
        </div>
      </div>
    </div>,
    size,
  );
}
