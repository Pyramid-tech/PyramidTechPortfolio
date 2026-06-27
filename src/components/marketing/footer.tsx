import { FC } from 'react';
import Link from 'next/link';
import { LogoIcon } from '@/components/icons';

const CONTACT_EMAIL = 'aliassii2025@gmail.com';

const Footer: FC = () => {
  return (
    <footer className="overflow-hidden border-t border-t-gray-800 px-6 pt-12 md:px-12">
      {/* Utility row — tagline + contact (left), location + CTA (right) */}
      <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
        <div className="max-w-xs">
          <p className="text-sm leading-relaxed text-gray-400 md:text-base">
            Smart, scalable products from first concept to production.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            aria-label="Email us"
            className="group mt-4 inline-flex items-center gap-1.5 text-sm text-text-1 transition hover:text-white md:text-base"
          >
            email
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </a>
        </div>

        <div className="flex flex-col gap-3 text-sm sm:items-end sm:text-right md:text-base">
          <span className="text-gray-400">Beirut, Lebanon</span>
          <Link
            href="/book"
            className="group inline-flex items-center gap-1.5 text-text-1 transition hover:text-white"
          >
            Start a project
            <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>

      {/* Typography-as-hero — SVG wordmark scales to the container width on every
          screen (no overflow), fading into the page via a vertical gradient. */}
      <svg
        aria-hidden
        viewBox="0 0 1000 175"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto mt-10 block w-full max-w-5xl select-none"
      >
        <defs>
          <linearGradient id="footer-wordmark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#E6E0E9" stopOpacity="0.9" />
            <stop offset="1" stopColor="#E6E0E9" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        <text
          x="500"
          y="150"
          textAnchor="middle"
          textLength="1000"
          lengthAdjust="spacingAndGlyphs"
          fill="url(#footer-wordmark)"
          style={{ fontFamily: 'var(--font-display), system-ui, sans-serif', fontSize: 200, fontWeight: 800 }}
        >
          PYRAMID
        </text>
      </svg>

      {/* Slim legal / back-to-top bar */}
      <div className="mt-8 flex items-center justify-between border-t border-t-gray-800/60 py-6 text-xs text-gray-500 md:text-sm">
        <span className="flex items-center gap-2">
          <LogoIcon className="h-4 w-4" />© {new Date().getFullYear()} Pyramid.
        </span>
        <a href="#main" className="inline-flex items-center gap-1 transition hover:text-text-1">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
};
export default Footer;
