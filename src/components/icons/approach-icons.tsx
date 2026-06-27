import { SVGProps, FC } from 'react';

// Decorative step markers for the Approach section.

export const First: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="32"
    height="33"
    className="h-6 w-6 md:h-8 md:w-8"
    viewBox="0 0 32 33"
    fill="none"
    {...props}
  >
    <circle cx="8" cy="8.41406" r="8" fill="#E6E0E9" />
    <circle cx="24" cy="24.4141" r="8" fill="#E6E0E9" />
  </svg>
);

export const Second: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="37"
    height="37"
    className="h-7 w-7 md:h-8 md:w-8"
    viewBox="0 0 37 37"
    fill="none"
    {...props}
  >
    <path
      d="M9.5 19.9141C6.2 19.9141 3.5 22.6141 3.5 25.9141C3.5 29.2141 6.2 31.9141 9.5 31.9141C12.8 31.9141 15.5 29.2141 15.5 25.9141C15.5 22.6141 12.8 19.9141 9.5 19.9141ZM18.5 4.91406C15.2 4.91406 12.5 7.61406 12.5 10.9141C12.5 14.2141 15.2 16.9141 18.5 16.9141C21.8 16.9141 24.5 14.2141 24.5 10.9141C24.5 7.61406 21.8 4.91406 18.5 4.91406ZM27.5 19.9141C24.2 19.9141 21.5 22.6141 21.5 25.9141C21.5 29.2141 24.2 31.9141 27.5 31.9141C30.8 31.9141 33.5 29.2141 33.5 25.9141C33.5 22.6141 30.8 19.9141 27.5 19.9141Z"
      fill="#E6E0E9"
    />
  </svg>
);

export const Third: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="36" height="36" className="h-7 w-7 md:h-8 md:w-8" viewBox="0 0 36 36" {...props}>
    <g clipPath="url(#clip0_250_11)">
      <rect x="3" y="20.6855" width="18" height="18" rx="2" transform="rotate(-25 3 20.6855)" fill="#E6E0E9" />
      <rect x="22.9592" y="-1" width="10" height="10" rx="1" fill="#E6E0E9" />
    </g>
    <defs>
      <clipPath id="clip0_250_11">
        <rect width="36" height="36" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const Fourth: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg width="48" height="49" className="h-8 w-8 md:h-10 md:w-10" viewBox="0 0 48 49" {...props}>
    <path
      d="M14.638 10.6988C14.9953 10.08 15.6556 9.69879 16.3701 9.69879L31.6299 9.69879C32.3444 9.69879 33.0047 10.08 33.362 10.6988L40.9919 23.9142C41.3491 24.533 41.3491 25.2954 40.9919 25.9142L33.362 39.1296C33.0047 39.7484 32.3444 40.1296 31.6299 40.1296L16.3701 40.1296C15.6556 40.1296 14.9953 39.7484 14.638 39.1296L7.00813 25.9142C6.65086 25.2954 6.65086 24.533 7.00813 23.9142L14.638 10.6988Z"
      fill="#E6E0E9"
    />
  </svg>
);

export const Fifth: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="36"
    height="36"
    className="h-7 w-7 md:h-8 md:w-8"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse cx="12" cy="24" rx="8.99998" ry="8.99998" fill="#E6E0E9" />
    <path d="M33 28L9.00002 4H33V28Z" fill="#E6E0E9" />
  </svg>
);
