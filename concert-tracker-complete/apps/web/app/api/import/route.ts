import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
export async function POST(req: NextRequest){
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error:'unauthorized' }, { status:401 })
  const rows = await req.json() as any[]
  const toInsert = rows.map(r => ({
    user_id: user.id, artist: r.artist, start_at: r.start_at, end_at: r.end_at ?? null,
    venue_name: r.venue_name ?? null, city: r.city ?? null, source_url: r.source_url ?? null,
    status: r.status ?? 'Attended', notes: r.notes ?? null,
    dedupe_key: `${(r.artist||'').toLowerCase()}|${new Date(r.start_at).toISOString().slice(0,16)}|${(r.venue_name||'').toLowerCase()}`
  }))
  const { data, error } = await supabase.from('shows').upsert(toInsert, { onConflict: 'user_id,dedupe_key' }).select('id')
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ imported: data?.length ?? 0 })
}
