import { google } from 'googleapis'
export function getOAuth2Client(){
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, APP_URL } = process.env as Record<string,string>
  const redirect = `${APP_URL}/api/google/oauth/callback`
  return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, redirect)
}
export async function clientFromRefreshToken(refreshToken: string){
  const o = getOAuth2Client(); o.setCredentials({ refresh_token: refreshToken })
  return google.calendar({ version: 'v3', auth: o })
}
