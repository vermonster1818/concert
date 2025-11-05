import { NextRequest, NextResponse } from 'next/server'
import { getOAuth2Client } from '@/lib/google'
export async function GET(req: NextRequest){
  const o = getOAuth2Client()
  const url = o.generateAuthUrl({ access_type:'offline', prompt:'consent', scope:['https://www.googleapis.com/auth/calendar'] })
  return NextResponse.redirect(url)
}
