'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase-client'

export default function SignIn(){
  const [email,setEmail]=useState('')
  const [sent,setSent]=useState(false)
  async function magic(){
    const { error } = await supabase.auth.signInWithOtp({ email, options:{ emailRedirectTo: `${location.origin}/auth/callback` } })
    if (!error) setSent(true)
  }
  async function google(){ await supabase.auth.signInWithOAuth({ provider:'google', options:{ redirectTo: `${location.origin}/auth/callback` } }) }
  return (
    <div className="max-w-sm mx-auto space-y-3">
      <h1 className="text-xl font-semibold">Sign in</h1>
      {sent ? <p>Check your email for the magic link.</p> : <>
        <input className="border p-2 w-full rounded-2xl" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="px-3 py-2 rounded-2xl border shadow w-full" onClick={magic}>Send magic link</button>
        <button className="px-3 py-2 rounded-2xl border shadow w-full" onClick={google}>Continue with Google</button>
      </>}
    </div>
  )
}
