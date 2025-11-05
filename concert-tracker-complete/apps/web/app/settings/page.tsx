'use client'
import { useEffect, useState } from 'react'
export default function Settings(){
  const [calendars,setCalendars]=useState<any[]>([])
  const [calendarId,setCalendarId]=useState('')
  const [icsUrl,setIcsUrl]=useState<string>('')
  useEffect(()=>{(async()=>{
    const r = await fetch('/api/google/list-calendars')
    if (r.ok){ const { items } = await r.json(); setCalendars(items||[]) }
  })()},[])
  async function saveCal(){
    await fetch('/api/google/save-calendar',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ calendarId }) })
  }
  async function genICS(){
    const r = await fetch('/api/ics/token',{ method:'POST' })
    const j = await r.json(); setIcsUrl(j.url)
  }
  return (
    <div className="space-y-3">
      <a className="underline" href="/api/google/connect">Connect Google Calendar</a>
      <div>
        <label className="block text-sm mb-1">Calendar</label>
        <select className="border rounded-2xl p-2" value={calendarId} onChange={e=>setCalendarId(e.target.value)}>
          <option value="">Select…</option>
          {calendars.map(c=><option key={c.id} value={c.id}>{c.summary}</option>)}
        </select>
        <button className="ml-2 px-3 py-2 border rounded-2xl" onClick={saveCal}>Save</button>
      </div>
      <div className="space-x-2">
        <button className="px-3 py-2 border rounded-2xl" onClick={genICS}>Generate private ICS URL</button>
        {icsUrl && <a className="underline" href={icsUrl} target="_blank">Open ICS</a>}
      </div>
    </div>
  )
}
