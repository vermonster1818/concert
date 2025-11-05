import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
export async function POST(req: NextRequest){
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error:'unauthorized' }, { status:401 })
  const { calendarId } = await req.json()
  await supabase.from('google_credentials').update({ calendar_id: calendarId }).eq('user_id', user.id)
  return NextResponse.json({ ok:true })
}
