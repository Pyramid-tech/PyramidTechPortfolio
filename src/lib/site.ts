export const SITE = {
  name: 'Pyramid',
  tagline: 'AI and full-stack product studio in Beirut',
  description:
    'Pyramid is a Beirut-based studio building AI agents, RAG pipelines and full-stack web and mobile products — from first concept to production.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3400',
  location: 'Beirut, Lebanon',
  email: 'pyramidtechdev@gmail.com',
} as const;
