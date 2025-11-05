const fmt = (d: Date) => new Date(d).toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z'
export function googleCalendarLink(show: any){
  const start = fmt(new Date(show.start_at))
  const end = fmt(new Date(show.end_at ?? new Date(new Date(show.start_at).getTime()+2*60*60*1000)))
  const params = new URLSearchParams({
    action:'TEMPLATE', text: show.artist, dates: `${start}/${end}`,
    location: [show.venue_name, show.city].filter(Boolean).join(', '),
    details: show.source_url || ''
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
export function singleEventICS(show: any){
  const dt = (d: string|Date) => new Date(d).toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z'
  const start = dt(show.start_at)
  const end = dt(show.end_at ?? new Date(new Date(show.start_at).getTime()+2*60*60*1000))
  const body = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//ConcertTracker//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',
    `UID:show-${show.id||'new'}@concert-tracker`,`DTSTAMP:${dt(new Date())}`,`DTSTART:${start}`,`DTEND:${end}`,
    `SUMMARY:${show.artist}`,`LOCATION:${[show.venue_name, show.city].filter(Boolean).join(', ')}`,
    `DESCRIPTION:${show.source_url||''}`,'END:VEVENT','END:VCALENDAR'
  ].join('\n'); return body
}
