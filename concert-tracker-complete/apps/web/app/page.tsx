'use client'
import useSWR from 'swr'
import ShowCard from '@/components/ShowCard'
const fetcher = (u:string)=>fetch(u).then(r=>r.json())
export default function Upcoming(){
  const { data } = useSWR('/api/events?status=Planned', fetcher)
  return <div className="grid gap-3">{(data??[]).map((s:any)=><ShowCard key={s.id} show={s}/>)}</div>
}
