import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { getOAuth2Client } from '@/lib/google'

export async function GET(req: NextRequest){
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/signin', req.url))
  const url = new URL(req.url); const code = url.searchParams.get('code')
  const o = getOAuth2Client(); const { tokens } = await o.getToken(code!)
  if (!tokens.refresh_token) return NextResponse.redirect(new URL('/settings?error=no_refresh', req.url))
  await supabase.from('google_credentials').upsert({ user_id: user.id, refresh_token: tokens.refresh_token })
  return NextResponse.redirect(new URL('/settings', req.url))
}
