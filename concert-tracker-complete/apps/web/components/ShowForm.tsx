'use client'
import { useState } from 'react'
export default function ShowForm(){
  const [form,setForm]=useState({ artist:'', date:'', time:'19:00', venue_name:'', city:'', source_url:'' })
  async function submit(){
    const start = new Date(`${form.date}T${form.time}:00`)
    const res = await fetch('/api/events',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({
      artist: form.artist, start_at: start.toISOString(),
      venue_name: form.venue_name, city: form.city, source_url: form.source_url, status:'Planned'
    })})
    if (res.ok) location.href='/'
  }
  return (<div className="space-y-3">
    <input className="border p-2 w-full rounded-2xl" placeholder="Artist" value={form.artist} onChange={e=>setForm({...form,artist:e.target.value})}/>
    <div className="flex gap-2">
      <input type="date" className="border p-2 rounded-2xl" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/>
      <input type="time" className="border p-2 rounded-2xl" value={form.time} onChange={e=>setForm({...form,time:e.target.value})}/>
    </div>
    <input className="border p-2 w-full rounded-2xl" placeholder="Venue" value={form.venue_name} onChange={e=>setForm({...form,venue_name:e.target.value})}/>
    <input className="border p-2 w-full rounded-2xl" placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/>
    <input className="border p-2 w-full rounded-2xl" placeholder="Ticket/Source URL" value={form.source_url} onChange={e=>setForm({...form,source_url:e.target.value})}/>
    <button className="px-4 py-2 rounded-2xl border shadow" onClick={submit}>Save</button>
  </div>)
}
