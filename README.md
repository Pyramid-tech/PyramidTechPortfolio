# Agency Website

A single-page **agency / marketing website** built with the **Next.js 14 App Router**, React 18, TypeScript and Tailwind CSS, with rich scroll-based animations (GSAP, Framer Motion, Lenis smooth scroll).

> **Frontend-only.** This is _not_ a full-stack project. There is no backend: no API routes (`src/app/api`), no route handlers (`route.ts`), no server actions and no database. The whole UI is client-rendered (`layout.tsx` is a Client Component), and the booking form currently only logs its data to the console. Next.js _can_ run backend code, but this codebase doesn't yet — see [How to improve it](#how-to-improve-it).

---

## Tech stack

| Concern       | Choice                                                                    |
| ------------- | ------------------------------------------------------------------------- |
| Framework     | Next.js 14 (App Router)                                                   |
| Language      | TypeScript (a few legacy `.js` util files)                                |
| Styling       | Tailwind CSS + SCSS, `class-variance-authority`, `clsx`, `tailwind-merge` |
| UI primitives | Radix UI (`@radix-ui/react-radio-group`)                                  |
| Animation     | GSAP, Framer Motion, Lenis (smooth scroll), `react-intersection-observer` |
| Images        | `next/image` + `plaiceholder` (blur placeholders, uses `sharp`)           |
| Tooling       | ESLint (`eslint-config-next`), Prettier + Tailwind plugin                 |

---

## Getting started

Requires **Node ≥ 18.17** (Next.js 14). Node 20 LTS recommended.

```bash
npm install
npm run dev          # http://localhost:3400
```

### Scripts

| Script           | What it does                           |
| ---------------- | -------------------------------------- |
| `npm run dev`    | Dev server with hot reload (port 3400) |
| `npm run build`  | Production build                       |
| `npm run start`  | Serve the production build             |
| `npm run lint`   | ESLint                                 |
| `npm run format` | Prettier write across the repo         |

### Docker

A production image (multi-stage, Next.js `standalone` output) is included:

```bash
docker compose up --build    # http://localhost:3400
docker compose down
```

See [`Dockerfile`](./Dockerfile) and [`docker-compose.yml`](./docker-compose.yml).

---

## Folder structure

The project uses a **layered architecture inspired by Feature-Sliced Design (FSD)** — code is organized by _role/abstraction level_ rather than by file type. Each component lives in its own folder with an `index.tsx` entry point. Imports use the `@/` path alias (mapped to `src/` in `tsconfig.json`).

```
src/
├── app/                 # Next.js App Router — routes, pages, root layout
│   ├── layout.tsx       #   Root layout (Lenis smooth-scroll setup)
│   ├── page.tsx         #   Home page ("/")
│   └── book/page.tsx    #   Booking page ("/book")
│
├── widgets/             # Large, page-level sections (composed of components)
│   ├── Hero/            #   Landing hero + floating images
│   ├── About/
│   ├── Services/
│   ├── Approach/
│   ├── CallToAction/
│   ├── Navigation/
│   └── BookForm/        #   The request/booking form
│
├── components/          # Reusable UI building blocks
│   ├── ui/              #   Generic primitives (Button, RadioGroup, AuroraBg,
│   │                    #   HoverCards, SectionTitle, ShadowCursor, …)
│   ├── ServiceCard/
│   └── SidebarMenu/
│
├── composables/         # React hooks (e.g. useFloatingImages)
│
├── shared/              # Cross-cutting, app-agnostic code
│   ├── styles/          #   Global SCSS (globals.scss)
│   └── utils/           #   Helpers + animation utilities
│
├── data/                # Static content & config (nav items, form fields, copy)
│   └── index.ts
│
└── icons/               # SVG components (ApproachIcons, LogoIcon, …)
```

**Layering rule of thumb (high → low level):** `app` → `widgets` → `components` → `shared`. Higher layers may import from lower ones, not the reverse. `data` and `icons` are leaf modules consumed anywhere.

Other notable files:

- `public/` — static assets served as-is (`/images/...`).
- `tailwind.config.ts`, `postcss.config.js` — styling config.
- `components.json` — shadcn/ui-style component config.
- `next.config.mjs` — Next config (`output: "standalone"` for Docker).

---

## Best practices already in place

- **Clear, consistent layering** (FSD-style) makes it easy to find and place code.
- **Component-per-folder** with an `index.tsx` keeps imports clean (`@/components/ui/Button`).
- **Path aliases** (`@/…`) instead of brittle `../../..` relative paths.
- **Type-safe styling utilities** — `cva` + `clsx` + `tailwind-merge` for variant-driven, conflict-free Tailwind classes.
- **Centralized static content** in `src/data` rather than hard-coded throughout JSX.
- **Consistent formatting** via Prettier + the Tailwind class-sorting plugin.

---

## How to improve it

Concrete, high-value next steps (roughly ordered by impact):

1. **Don't make the root layout a Client Component.**
   [`src/app/layout.tsx`](src/app/layout.tsx) is `'use client'`, which opts the _entire_ app out of React Server Components and SSR benefits. Move the Lenis smooth-scroll logic into a small `"use client"` wrapper (e.g. `<SmoothScroll>`), and keep `layout.tsx` as a Server Component.

2. **Add SEO metadata.** Because the layout is a client component, it can't export Next's `metadata`. Once #1 is fixed, add a `metadata` export (title, description, Open Graph / Twitter cards, canonical URL, favicon) — essential for a public marketing site.

3. **Make the booking form actually do something.** [`BookForm`](src/widgets/BookForm/index.tsx) only runs `console.log(form)`. Add real submission (a Next.js **route handler** / **server action** or a 3rd-party form/email service), proper validation (e.g. `zod` + `react-hook-form`), and success/error UI. _This is the point where a real "backend" would be introduced._

4. **Tighten TypeScript.** Replace `handleSubmit = (e: any)` and empty `interface Props {}` with real types (`FormEvent<HTMLFormElement>`, drop unused props). Convert the remaining JS utilities (`shared/utils/animations.js`, `shared/utils/useShadowCursor.js`) to `.ts`.

5. **Rename `composables/` → `hooks/`.** "Composables" is Vue terminology; in React these are **hooks**. Renaming reduces confusion for React developers.

6. **Fix the `lang` attribute.** `layout.tsx` sets `<html lang="ru">` while the content is English — set the correct language for accessibility/SEO.

7. **Accessibility & responsiveness.** Sizing relies heavily on `vw` units (including font sizes), which breaks user zoom/text-scaling and hurts a11y. Consider `rem`/`clamp()` for typography, and audit color contrast, focus states, and `alt` text.

8. **Modernize `next/image` usage.** The legacy `objectFit` prop triggers warnings — switch to `style={{ objectFit: 'cover' }}` or the `fill` + `object-cover` pattern.

9. **Add automated quality gates.** No tests or CI exist. Consider Vitest/Testing Library for components, Playwright for a couple of smoke tests, and a GitHub Actions workflow running `lint` + `build` (+ tests) on every PR.

10. **Environment & config hygiene.** Add `.env.example` and read runtime config from env vars once a backend/integration (analytics, form endpoint) is added.
