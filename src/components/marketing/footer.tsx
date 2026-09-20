import { FC } from 'react';
import Link from 'next/link';
import { LogoIcon } from '@/components/icons';
import BackToTop from '@/components/ui/back-to-top';
import { SITE } from '@/lib/site';

const Footer: FC = () => {
  return (
    <footer className="overflow-hidden border-t border-t-gray-1 px-6 pt-12 md:px-12">
      <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <p className="text-sm leading-relaxed text-text-2 md:text-base">
            Custom web, mobile, and desktop software from first concept to production.
          </p>
          <a
            href={`mailto:${SITE.email}`}
            className="group mt-2 inline-flex min-h-11 items-center gap-1.5 text-sm text-text-1 transition hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:text-base"
          >
            Email us
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </div>

        <div className="flex flex-col gap-1 text-sm sm:items-end sm:text-right md:text-base">
          <span className="flex min-h-11 items-center text-text-2">{SITE.location}</span>
          <Link
            href="/book"
            className="group inline-flex min-h-11 items-center gap-1.5 text-text-1 transition hover:text-text-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:justify-end"
          >
            Start a project
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-0.5"
            >
              →
            </span>
          </Link>
        </div>
      </div>

      <svg
        aria-hidden
        viewBox="0 0 1000 190"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto mt-10 block w-full max-w-5xl select-none"
      >
        <defs>
          <linearGradient id="footer-wordmark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0.85" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <text
          x="500"
          y="160"
          textAnchor="middle"
          fill="url(#footer-wordmark)"
          style={{
            fontFamily: 'var(--font-display), system-ui, sans-serif',
            fontSize: 200,
            fontWeight: 800,
            letterSpacing: '0.02em',
          }}
        >
          PYRAMID
        </text>
      </svg>

      <div className="mt-8 flex items-center justify-between border-t border-t-stroke/60 py-6 pr-[calc(var(--fab-clearance)_-_1.5rem)] text-xs text-text-3 md:pr-[calc(var(--fab-clearance)_-_3rem)] md:text-sm">
        <span className="flex items-center gap-2">
          <LogoIcon className="h-4 w-4" />© {new Date().getFullYear()} Pyramid.
        </span>
        <BackToTop />
      </div>
    </footer>
  );
};
export default Footer;
