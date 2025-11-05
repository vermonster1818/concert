import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const user = url.searchParams.get('u')
  const token = url.searchParams.get('t')
  if (!user || !token) return new NextResponse('Not found', { status: 404 })

  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { data: tok } = await supa.from('ics_tokens').select('token').eq('user_id', user).single()
  if (!tok || tok.token !== token) return new NextResponse('Not found', { status: 404 })

  const { data: shows } = await supa.from('shows').select('*').eq('user_id', user).eq('status', 'Planned').order('start_at', { ascending: true })

  const dt = (d: string|Date) => new Date(d).toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z'
  const lines = [ 'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//ConcertTracker//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH' ]
  for (const s of (shows||[])) {
    const end = s.end_at ?? new Date(new Date(s.start_at).getTime()+2*60*60*1000).toISOString()
    lines.push('BEGIN:VEVENT')
    lines.push(`UID:show-${s.id}@concert-tracker`)
    lines.push(`DTSTAMP:${dt(new Date())}`)
    lines.push(`DTSTART:${dt(s.start_at)}`)
    lines.push(`DTEND:${dt(end)}`)
    lines.push(`SUMMARY:${s.artist}`)
    lines.push(`LOCATION:${[s.venue_name, s.city].filter(Boolean).join(', ')}`)
    lines.push(`DESCRIPTION:${s.source_url ?? ''}`)
    lines.push('END:VEVENT')
  }
  lines.push('END:VCALENDAR')
  return new NextResponse(lines.join('\n'), { headers: { 'Content-Type': 'text/calendar; charset=utf-8', 'Cache-Control': 'private, max-age=300' } })
}
