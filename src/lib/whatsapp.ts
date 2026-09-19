import { SITE } from '@/lib/site';

export const WHATSAPP_MESSAGES = {
  default: "Hi Pyramid, I'd like to talk about a project.",
  project: (title: string) => `Hi Pyramid, I saw your work on ${title} and I'd like to talk about a project.`,
};

export function whatsappUrl(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}
