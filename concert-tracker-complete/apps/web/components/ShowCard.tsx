'use client'
import CalendarLinkButton from './CalendarLinkButton'
export default function ShowCard({ show }: { show: any }){
  const d = new Date(show.start_at)
  return (<div className="rounded-2xl border p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold">{show.artist}</h3>
      <span className="text-xs opacity-60">{d.toLocaleDateString()} {d.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
    </div>
    <p className="text-sm mt-1">{[show.venue_name, show.city].filter(Boolean).join(', ')}</p>
    <div className="mt-3 flex items-center justify-between">
      <CalendarLinkButton show={show}/>
    </div>
  </div>)
}
