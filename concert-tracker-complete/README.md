# Concert Tracker — Next.js (PWA) + Supabase (+ Expo) Starter Kit

Production-ready starter to track planned & attended concerts with calendar links, a personal ICS feed, optional two-way Google Calendar sync, CSV import, stats, and an optional native app via Expo.

## Quickstart
1) Create a Supabase project and copy URL + anon key.
2) Run `db/migration.sql` and `db/policies.sql` in Supabase SQL editor.
3) `cd apps/web && pnpm i` (or npm/yarn) and create `.env.local` from `.env.local.example`.
4) `pnpm dev` then open http://localhost:3000.
5) (Optional) `cd ../mobile && pnpm i && pnpm expo start`

See `apps/web/README.md` for details.
