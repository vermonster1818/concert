'use client'
import { useState } from 'react'
import Papa from 'papaparse'
export default function ImportPage(){
  const [rows,setRows]=useState<any[]>([])
  const [imported,setImported]=useState<number|null>(null)
  return (<div className="space-y-4">
    <h1 className="text-xl font-semibold">Import CSV</h1>
    <input type="file" accept=".csv" onChange={e=>{
      const file=e.target.files?.[0]; if(!file) return
      Papa.parse(file,{ header:true, skipEmptyLines:true, complete:(res)=>setRows(res.data as any[]) })
    }}/>
    {rows.length>0 && <div className="space-y-2">
      <p className="text-sm opacity-70">Previewing {rows.length} rows</p>
      <button className="px-3 py-2 border rounded-2xl" onClick={async()=>{
        const r = await fetch('/api/import',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(rows) })
        const j = await r.json(); setImported(j.imported)
      }}>Import</button>
    </div>}
    {imported!==null && <p className="text-sm">Imported {imported} shows.</p>}
  </div>)
}
