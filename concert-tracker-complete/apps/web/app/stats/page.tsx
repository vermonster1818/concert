'use client'
import useSWR from 'swr'
const fetcher=(u:string)=>fetch(u).then(r=>r.json())
export default function Stats(){
  const { data } = useSWR('/api/stats', fetcher)
  const byMonth = data?.byMonth ?? []
  const artists = data?.topArtists ?? []
  const venues = data?.topVenues ?? []
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold mb-2">Shows by month</h2>
        <div className="grid grid-cols-2 gap-2">
          {byMonth.map((r:any)=> (
            <div key={r.month} className="border rounded-2xl p-3 flex justify-between">
              <span>{new Date(r.month).toLocaleDateString(undefined,{ year:'numeric', month:'short'})}</span>
              <span className="font-semibold">{r.shows}</span>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Top artists</h2>
        <ol className="list-decimal ml-5 space-y-1">
          {artists.map((a:any)=><li key={a.artist} className="flex justify-between"><span>{a.artist}</span><span className="font-semibold">{a.cnt}</span></li>)}
        </ol>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-2">Top venues</h2>
        <ol className="list-decimal ml-5 space-y-1">
          {venues.map((v:any)=><li key={v.venue} className="flex justify-between"><span>{v.venue}</span><span className="font-semibold">{v.cnt}</span></li>)}
        </ol>
      </section>
    </div>
  )
}
