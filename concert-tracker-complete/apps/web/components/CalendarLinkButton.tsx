'use client'
import { googleCalendarLink, singleEventICS } from '@/lib/calendar'
export default function CalendarLinkButton({ show }: { show: any }){
  function downloadICS(){
    const ics = singleEventICS(show)
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href=url
    a.download=`${show.artist}-${new Date(show.start_at).toISOString().slice(0,10)}.ics`
    a.click(); URL.revokeObjectURL(url)
  }
  return (<div className="flex gap-2">
    <a className="px-3 py-2 rounded-2xl shadow text-sm border" href={googleCalendarLink(show)} target="_blank">Add to Google</a>
    <button className="px-3 py-2 rounded-2xl shadow text-sm border" onClick={downloadICS}>Download .ics</button>
  </div>)
}
