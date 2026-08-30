'use client'

import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { AuthShell, Message, inputClass } from '@/components/auth/AuthShell'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function StudentLoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const getFriendlyError = (message: string) => {
    const text = message.toLowerCase()

    if (text.includes('invalid login credentials') || text.includes('invalid email or password')) {
      return 'Invalid email or password.'
    }
    if (text.includes('email not confirmed')) {
      return 'Please confirm your email before signing in.'
    }
    if (text.includes('network') || text.includes('fetch') || text.includes('failed to fetch')) {
      return 'The connection to Supabase failed. Please try again.'
    }

    return 'Unable to sign in right now. Please try again.'
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault()
    if (loading) return
    setError('')

    if (!email.trim()) return setError('Please enter your email address.')
    if (!emailPattern.test(email.trim())) return setError('Please enter a valid email address.')
    if (!password) return setError('Please enter your password.')

    setLoading(true)
    try {
      const { data, error: authError } = await signIn({ email: email.trim(), password })

      if (authError) {
        setLoading(false)
        setError(getFriendlyError(authError.message))
        return
      }

      const userId = data.user?.id
      if (!userId) {
        setLoading(false)
        setError('Your session could not be loaded. Please try again.')
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle()

      if (profileError) {
        setLoading(false)
        setError('Your account profile could not be loaded. Please try again.')
        return
      }

      const role = profileData?.role
      if (!role) {
        setLoading(false)
        setError('Your account profile could not be found. Please contact the administrator.')
        await supabase.auth.signOut()
        return
      }

      if (role !== 'student') {
        setLoading(false)
        if (role === 'teacher') {
          setError('This account is registered as a Teacher. Please use Teacher Login.')
        } else {
          setError('These credentials are not registered as a student account.')
        }
        await supabase.auth.signOut()
        return
      }

      setLoading(false)
      router.push('/student/dashboard')
    } catch (err) {
      setLoading(false)
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <AuthShell title="Student Login" subtitle="Continue your learning journey.">
      <form onSubmit={handleLogin} className="space-y-5">
        {error && <Message error>{error}</Message>}

        <label className="block text-sm font-semibold">
          Email
          <div className="relative">
            <Mail className="absolute top-4 left-3 size-5 text-muted-foreground" />
            <input className={`${inputClass} pl-11`} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </label>

        <label className="block text-sm font-semibold">
          Password
          <div className="relative">
            <Lock className="absolute top-4 left-3 size-5 text-muted-foreground" />
            <input className={`${inputClass} pr-11 pl-11`} type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(!showPassword)} className="absolute top-3 right-2 rounded-lg p-2 text-muted-foreground hover:text-primary">
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </label>

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="size-4 accent-primary" />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-semibold text-primary hover:underline">Forgot password?</Link>
        </div>

        <button disabled={loading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-semibold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-60">
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign In as Student'
          )}
        </button>

        <div className="space-y-2 text-center text-sm text-muted-foreground">
          <p>
            New student? <Link href="/student/signup" className="font-semibold text-primary hover:underline">Create an account</Link>
          </p>
          <p>
            Are you a teacher? <Link href="/teacher/login" className="font-semibold text-primary hover:underline">Teacher Login</Link>
          </p>
        </div>
      </form>
    </AuthShell>
  )
}
