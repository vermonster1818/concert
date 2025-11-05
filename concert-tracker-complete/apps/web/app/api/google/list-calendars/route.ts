import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { clientFromRefreshToken } from '@/lib/google'
export async function GET(){
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error:'unauthorized' }, { status: 401 })
  const { data: cred } = await supabase.from('google_credentials').select('*').eq('user_id', user.id).single()
  if (!cred) return NextResponse.json({ items: [] })
  const cal = await clientFromRefreshToken(cred.refresh_token)
  const { data } = await (await cal).calendarList.list()
  return NextResponse.json({ items: data.items?.map(i=>({ id: i.id, summary: i.summary })) })
}
