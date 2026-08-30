'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { AuthShell, Message, inputClass } from '@/components/auth/AuthShell'
import { supabase } from '@/lib/supabaseClient'

export default function ResetPasswordPage() {
  const router = useRouter(); const [password, setPassword] = useState(''); const [confirm, setConfirm] = useState(''); const [error, setError] = useState(''); const [done, setDone] = useState(false); const [loading, setLoading] = useState(false)
  const submit = async (event: FormEvent) => { event.preventDefault(); if (password.length < 8) return setError('Password must be at least 8 characters.'); if (password !== confirm) return setError('Passwords do not match.'); setLoading(true); const { error: updateError } = await supabase.auth.updateUser({ password }); setLoading(false); if (updateError) setError(updateError.message); else setDone(true) }
  return <AuthShell title="Choose a new password" subtitle="Keep your learning space secure."><form onSubmit={submit} className="space-y-5">{error && <Message error>{error}</Message>}{done ? <><Message>Password updated successfully.</Message><button type="button" onClick={() => router.replace('/login')} className="min-h-12 w-full rounded-xl bg-primary font-semibold text-primary-foreground">Return to login</button></> : <><label className="block text-sm font-semibold">New Password<input className={inputClass} type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label><label className="block text-sm font-semibold">Confirm Password<input className={inputClass} type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} /></label><button disabled={loading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground disabled:opacity-60">{loading ? <Loader2 className="size-5 animate-spin" /> : 'Update Password'}</button></>}</form></AuthShell>
}
