import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import crypto from 'crypto'

export async function POST(){
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const token = crypto.randomBytes(24).toString('base64url')
  await supabase.from('ics_tokens').upsert({ user_id: user.id, token })
  return NextResponse.json({ url: `${process.env.APP_URL}/api/ics?u=${user.id}&t=${token}` })
}
