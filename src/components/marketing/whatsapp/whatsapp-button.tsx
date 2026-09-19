'use client';

import { FC } from 'react';

import { WhatsAppIcon } from '@/components/icons';
import { WHATSAPP_MESSAGES, whatsappUrl } from '@/lib/whatsapp';

import { useWhatsApp } from './whatsapp-provider';

const WhatsAppButton: FC = () => {
  const { project } = useWhatsApp();
  const message = project ? WHATSAPP_MESSAGES.project(project) : WHATSAPP_MESSAGES.default;

  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      className="group fixed bottom-[calc(1rem_+_env(safe-area-inset-bottom))] right-4 z-floating flex overflow-hidden rounded-full p-0.5 shadow-[0_12px_32px_-12px_rgb(var(--c-overlay)/0.55)] transition-transform duration-150 [-webkit-tap-highlight-color:transparent] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-1 active:scale-[0.96] motion-reduce:transition-none md:bottom-[calc(1.5rem_+_env(safe-area-inset-bottom))] md:right-6 print:hidden"
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -ml-24 -mt-24 h-48 w-48 animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_0deg,rgb(var(--c-primary))_0%,rgb(var(--c-stroke))_50%,rgb(var(--c-primary))_100%)] [animation-play-state:paused] group-focus-visible:[animation-play-state:running] motion-reduce:animate-none [@media(hover:hover)]:group-hover:[animation-play-state:running]"
      />
      <span className="relative flex h-[52px] items-center rounded-full bg-bg-2 px-3 text-text-1 transition-colors duration-300 group-focus-visible:bg-bg-2/85 group-focus-visible:text-text-strong motion-reduce:transition-none md:h-11 md:px-2.5 [@media(hover:hover)]:group-hover:bg-bg-2/85 [@media(hover:hover)]:group-hover:text-text-strong">
        <span
          aria-hidden="true"
          className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium uppercase tracking-wide opacity-0 transition-[max-width,opacity,margin] duration-300 motion-reduce:transition-none md:group-focus-visible:ml-2.5 md:group-focus-visible:mr-2 md:group-focus-visible:max-w-40 md:group-focus-visible:opacity-100 md:[@media(hover:hover)]:group-hover:ml-2.5 md:[@media(hover:hover)]:group-hover:mr-2 md:[@media(hover:hover)]:group-hover:max-w-40 md:[@media(hover:hover)]:group-hover:opacity-100"
        >
          Chat with us
        </span>
        <WhatsAppIcon className="h-7 w-7 shrink-0 md:h-6 md:w-6" />
      </span>
    </a>
  );
};

export default WhatsAppButton;
