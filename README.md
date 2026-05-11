# Glow Addict by Sayanita

Glow Addict is a production-grade beauty commerce platform built with Next.js App Router, Supabase, Zustand, and Framer Motion.

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Supabase (auth + data)
- Zustand (state)
- Framer Motion (animations)
- Tailwind CSS 4

## Project Scripts

- `npm run dev` - start development server
- `npm run typecheck` - run TypeScript checks
- `npm run lint` - run ESLint
- `npm run build` - production build
- `npm run start` - start production server
- `npm run check` - full pre-deploy check (`typecheck + lint + build`)

## Local Setup

1. Install dependencies:

```bash
npm ci
```

2. Create environment file:

```bash
cp .env.example .env.local
```

3. Fill all required keys in `.env.local`.

4. Start development server:

```bash
npm run dev
```

## Required Environment Variables

See `.env.example` for full template.

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Optional AI keys:

- `NVIDIA_API_KEY`
- `OPENAI_API_KEY`

## Health Endpoint

Production health check endpoint:

- `/api/health`

Returns JSON status for uptime and monitoring checks.

## CI Pipeline

GitHub Actions workflow is included in `.github/workflows/ci.yml`.

It runs on push/PR:

1. `npm ci`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run build`

## Deployment (Vercel Recommended)

1. Import repository in Vercel.
2. Set all environment variables from `.env.example`.
3. Deploy preview branch.
4. Run smoke tests on preview.
5. Promote to production.

## Release Readiness

Use the full production runbook:

- `PRODUCTION_CHECKLIST.md`

## Repository Structure

- `src/app/(shop)` - storefront routes
- `src/app/admin` - admin dashboard routes
- `src/components` - UI components
- `src/features` - Zustand stores and feature state
- `src/actions` - server actions
- `supabase` - schema and seed scripts
