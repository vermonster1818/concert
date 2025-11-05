# Vercel + Monorepo Setup

1) In Vercel, create a new **Project** and select your GitHub repo.
2) In **Project Settings → General → Root Directory**, set: `apps/web`.
3) In **Environment Variables**, add at least:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY (Server)
   - APP_URL
   - ICS_SIGNING_SECRET
   - (optional) GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET

### Optional: GitHub Actions → Vercel Deploy
If you want GitHub Actions to deploy for you, add these **Repo Secrets**:
- `VERCEL_TOKEN` — from your Vercel account tokens
- `VERCEL_ORG_ID` — from your Vercel org (Project Settings → General → System Environment Variables)
- `VERCEL_PROJECT_ID` — from your project (same place)

The workflow `Vercel Deploy (optional)` will only run if those three are present.
