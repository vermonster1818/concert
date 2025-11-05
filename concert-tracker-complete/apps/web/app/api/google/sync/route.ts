import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { clientFromRefreshToken } from '@/lib/google'

function isOurs(e:any){ return e?.extendedProperties?.private?.concertTracker==='1' || (e?.iCalUID||'').includes('@concert-tracker') }

export async function GET(){
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error:'unauthorized' }, { status:401 })
  const { data: cred } = await supabase.from('google_credentials').select('*').eq('user_id', user.id).single()
  if (!cred?.refresh_token || !cred.calendar_id) return NextResponse.json({ ok:true, skipped:true })
  const cal = await clientFromRefreshToken(cred.refresh_token)
  let items:any[] = []; let pageToken:string|undefined
  const params:any = { calendarId: cred.calendar_id, showDeleted:false, singleEvents:true, maxResults:2500 }
  if (cred.sync_token) params.syncToken = cred.sync_token; else params.timeMin = new Date(Date.now()-1000*60*60*24*365).toISOString()
  do {
    const { data } = await (await cal).events.list({ ...params, pageToken })
    items.push(...(data.items||[])); pageToken = data.nextPageToken || undefined
    if (data.nextSyncToken) await supabase.from('google_credentials').update({ sync_token: data.nextSyncToken }).eq('user_id', user.id)
  } while(pageToken)
  for (const e of items){
    if (!isOurs(e)) continue
    const { data: map } = await supabase.from('show_google_events').select('*').eq('user_id', user.id).eq('event_id', e.id).maybeSingle()
    const start = e.start?.dateTime ?? e.start?.date
    const end = e.end?.dateTime ?? e.end?.date
    if (map){
      await supabase.from('shows').update({ artist: e.summary ?? undefined, start_at: start ?? undefined, end_at: end ?? undefined, venue_name: e.location ?? undefined }).eq('id', map.show_id)
    }
  }
  return NextResponse.json({ ok:true, imported: items.length })
}
