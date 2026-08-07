'use client';

import { FC } from 'react';
import { Moon, Sun } from 'lucide-react';

import { cn } from '@/lib/utils';

import { useTheme } from './theme-provider';

interface Props {
  className?: string;
  iconClassName?: string;
}

const iconBase =
  'absolute h-5 w-5 transition duration-200 ease-out motion-reduce:transition-none motion-reduce:duration-0';

const ThemeToggle: FC<Props> = ({ className, iconClassName }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      suppressHydrationWarning
      className="group flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none md:h-12 md:w-12"
    >
      <span
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-full border border-stroke bg-bg-2/70 text-text-1 backdrop-blur transition duration-200 ease-out group-hover:border-primary group-hover:bg-bg-3 group-focus-visible:ring-2 group-focus-visible:ring-primary group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-bg-1 group-active:scale-[0.97] motion-reduce:transition-none md:h-10 md:w-10',
          className,
        )}
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          <Sun
            aria-hidden="true"
            className={cn(
              iconBase,
              'rotate-90 scale-0 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100',
              iconClassName,
            )}
          />
          <Moon
            aria-hidden="true"
            className={cn(
              iconBase,
              'rotate-0 scale-100 opacity-100 dark:-rotate-90 dark:scale-0 dark:opacity-0',
              iconClassName,
            )}
          />
        </span>
      </span>
      <span className="sr-only hidden dark:block">Switch to light theme</span>
      <span className="sr-only dark:hidden">Switch to dark theme</span>
    </button>
  );
};

export default ThemeToggle;
