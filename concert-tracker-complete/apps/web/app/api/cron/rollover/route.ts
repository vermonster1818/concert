import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
export async function GET(){
  const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const now = new Date().toISOString()
  const { error } = await supa.from('shows').update({ status:'Attended' }).lt('start_at', now).eq('status','Planned')
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 500 })
  return NextResponse.json({ ok:true })
}
