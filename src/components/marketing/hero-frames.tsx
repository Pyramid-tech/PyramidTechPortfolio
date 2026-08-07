import { FC, SVGProps } from 'react';

const base = 'h-full w-full';

const blobStops = (id: string) => (
  <linearGradient id={id} x1="0.5" y1="0" x2="0.5" y2="1">
    <stop stopColor="var(--hero-blob-from)" />
    <stop offset="1" stopColor="var(--hero-blob-to)" />
  </linearGradient>
);

const accentStops = (id: string) => (
  <linearGradient id={id} x1="0.5" y1="0" x2="0.5" y2="1">
    <stop stopColor="var(--hero-accent)" />
    <stop offset="1" stopColor="var(--hero-accent)" stopOpacity="0" />
  </linearGradient>
);

export const HeroFrameOne: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 1440 860" preserveAspectRatio="xMidYMid slice" fill="none" className={base} aria-hidden {...props}>
    <path
      d="M1050 450C1050 632.254 902.254 780 720 780C537.746 780 390 632.254 390 450C390 267.746 537.746 120 720 120C902.254 120 1050 267.746 1050 450Z"
      fill="url(#hero-f1-blob)"
    />
    <defs>{blobStops('hero-f1-blob')}</defs>
  </svg>
);

export const HeroFrameTwo: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 1440 817" preserveAspectRatio="xMidYMid slice" fill="none" className={base} aria-hidden {...props}>
    <g fill="url(#hero-f2-accent)" fillOpacity="0.6">
      <path d="M210 399C210 421.091 192.091 439 170 439C147.909 439 130 421.091 130 399C130 376.909 147.909 359 170 359C192.091 359 210 376.909 210 399Z" />
      <path d="M938 155C938 177.091 920.091 195 898 195C875.909 195 858 177.091 858 155C858 132.909 875.909 115 898 115C920.091 115 938 132.909 938 155Z" />
      <path d="M1407 569C1407 629.751 1357.75 679 1297 679C1236.25 679 1187 629.751 1187 569C1187 508.249 1236.25 459 1297 459C1357.75 459 1407 508.249 1407 569Z" />
      <path d="M567 579C567 645.274 513.274 699 447 699C380.726 699 327 645.274 327 579C327 512.726 380.726 459 447 459C513.274 459 567 512.726 567 579Z" />
    </g>
    <defs>{accentStops('hero-f2-accent')}</defs>
  </svg>
);

export const HeroFrameThree: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 1440 817" preserveAspectRatio="xMidYMid slice" fill="none" className={base} aria-hidden {...props}>
    <g fill="url(#hero-f3-accent)" fillOpacity="0.6">
      <path d="M285.017 222C285.017 271.706 245.838 312 197.508 312C149.179 312 110 271.706 110 222C110 172.294 149.179 132 197.508 132C245.838 132 285.017 172.294 285.017 222Z" />
      <path d="M1392.8 279C1392.8 350.797 1336.21 409 1266.4 409C1196.59 409 1140 350.797 1140 279C1140 207.203 1196.59 149 1266.4 149C1336.21 149 1392.8 207.203 1392.8 279Z" />
      <path d="M1119.23 629C1119.23 656.614 1097.47 679 1070.62 679C1043.77 679 1022 656.614 1022 629C1022 601.386 1043.77 579 1070.62 579C1097.47 579 1119.23 601.386 1119.23 629Z" />
    </g>
    <defs>{accentStops('hero-f3-accent')}</defs>
  </svg>
);

export const HeroFrameMobile: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 430 880" preserveAspectRatio="xMidYMid slice" fill="none" className={base} aria-hidden {...props}>
    <circle cx="215" cy="430" r="200" fill="url(#hero-fm-blob)" />
    <g fill="url(#hero-fm-accent)" fillOpacity="0.6">
      <circle cx="62" cy="180" r="34" />
      <circle cx="372" cy="150" r="28" />
      <circle cx="350" cy="430" r="40" />
      <circle cx="58" cy="650" r="66" />
      <circle cx="388" cy="690" r="78" />
      <circle cx="120" cy="800" r="30" />
    </g>
    <defs>
      {blobStops('hero-fm-blob')}
      {accentStops('hero-fm-accent')}
    </defs>
  </svg>
);
