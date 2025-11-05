import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export async function GET(req: NextRequest) {
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  let q = supabase.from('shows').select('*').eq('user_id', user.id).order('start_at', { ascending: true })
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json()
  const payload = { ...body, user_id: user.id, dedupe_key: `${(body.artist||'').toLowerCase()}|${new Date(body.start_at).toISOString().slice(0,16)}|${(body.venue_name||'').toLowerCase()}` }
  const { data, error } = await supabase.from('shows').upsert(payload, { onConflict: 'user_id,dedupe_key' }).select('*').single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  // If Google Calendar is connected, insert an event and map it (best-effort)
  const { data: cred } = await supabase.from('google_credentials').select('*').eq('user_id', user.id).maybeSingle()
  if (cred?.refresh_token && cred?.calendar_id){
    const cal = await (await import('@/lib/google')).clientFromRefreshToken(cred.refresh_token)
    const start = new Date(data.start_at).toISOString()
    const end = new Date(data.end_at ?? new Date(new Date(data.start_at).getTime()+2*60*60*1000)).toISOString()
    const ev = await cal.events.insert({ calendarId: cred.calendar_id, requestBody: {
      summary: data.artist, description: data.source_url || undefined,
      location: [data.venue_name, data.city].filter(Boolean).join(', ') || undefined,
      extendedProperties: { private: { concertTracker: '1', showId: data.id } },
      start: { dateTime: start }, end: { dateTime: end }
    }})
    await supabase.from('show_google_events').upsert({ show_id: data.id, user_id: user.id, calendar_id: cred.calendar_id, event_id: ev.data.id! })
  }

  return NextResponse.json(data, { status: 201 })
}
