export const SITE = {
  name: 'Pyramid',
  tagline: 'Web, mobile, and desktop software studio in Beirut',
  description:
    'Pyramid is a Beirut-based studio that designs and builds custom web applications, mobile apps, and desktop software — from first concept to production.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3400',
  location: 'Beirut, Lebanon',
  email: 'pyramidtechdev@gmail.com',
} as const;
