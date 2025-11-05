import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
export async function GET(){
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error:'unauthorized' }, { status:401 })
  const [{ data: byMonth }, { data: topArtists }, { data: topVenues }] = await Promise.all([
    supabase.from('stats_shows_by_month').select('*').eq('user_id', user.id),
    supabase.from('stats_top_artists').select('*').eq('user_id', user.id).limit(10),
    supabase.from('stats_top_venues').select('*').eq('user_id', user.id).limit(10)
  ])
  return NextResponse.json({ byMonth, topArtists, topVenues })
}
