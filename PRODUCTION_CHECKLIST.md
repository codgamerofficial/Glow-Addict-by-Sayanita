# Glow Addict Production Checklist

## 1) Pre-Launch Quality Gates

- Run `npm ci`
- Run `npm run typecheck`
- Run `npm run lint`
- Run `npm run build`
- Run `npm run start` and test key pages manually:
  - `/`
  - `/products`
  - `/cart`
  - `/checkout`
  - `/admin`

## 2) Environment Setup

Set these variables in hosting:

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NVIDIA_API_KEY` (optional)
- `OPENAI_API_KEY` (optional)

Use `.env.example` as source of truth for required keys.

## 3) Database and Content

- Apply schema from `supabase/schema.sql`
- Apply seeds if needed:
  - `supabase/seed.sql`
  - `supabase/seed_cms.sql`
- Validate admin authentication and CRUD flows.

## 4) Runtime Monitoring

- Verify health endpoint: `/api/health`
- Confirm logs in hosting dashboard for:
  - 5xx errors
  - failed API requests
  - auth/session failures

## 5) Security and Compliance

- Never commit real secrets into repository.
- Restrict `SUPABASE_SERVICE_ROLE_KEY` to server-side usage only.
- Confirm CORS and redirect URLs in Supabase auth settings.
- Review privacy, terms, shipping, and returns pages before launch.

## 6) Performance and UX Checks

- Confirm all key images are optimized with Next Image.
- Validate desktop and mobile flows for:
  - Home to product to checkout
  - Login to profile to orders
  - Admin dashboard and orders management

## 7) Go-Live Sequence

1. Deploy to preview.
2. Complete smoke test on preview.
3. Promote preview to production.
4. Run live smoke test.
5. Monitor logs and health endpoint for 30-60 minutes.

## 8) Post-Launch

- Create weekly release checklist.
- Enable branch protection requiring CI checks.
- Track conversion funnel from home -> product -> checkout.
