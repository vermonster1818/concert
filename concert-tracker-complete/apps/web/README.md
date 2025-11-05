## Web App (Next.js)

### Env
Copy `.env.local.example` to `.env.local` and set:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server only)
- APP_URL
- ICS_SIGNING_SECRET
- (optional) GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET

### Run
```bash
pnpm install
pnpm dev
```

### Deploy (Vercel)
Add the env vars above in Vercel. Optionally set Cron Jobs:
- GET /api/cron/rollover (daily)
- GET /api/google/sync (hourly)
