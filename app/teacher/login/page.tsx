'use client'

import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useState, useEffect } from 'react'
import { AuthShell, Message, inputClass } from '@/components/auth/AuthShell'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function TeacherLoginPage() {
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

  const { user, profile, loading: authLoading } = useAuth()

  useEffect(() => {
    document.title = 'Sign In | MozhiLearn'
  }, [])

  useEffect(() => {
    if (!authLoading && user && profile) {
      if (profile.role === 'student') {
        router.replace('/student/dashboard')
      } else if (profile.role === 'teacher') {
        router.replace('/teacher/dashboard')
      }
    }
  }, [user, profile, authLoading, router])

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

      if (role !== 'teacher') {
        setLoading(false)
        if (role === 'student') {
          setError('This is a student account. Please use Student Login.')
        } else {
          setError('These credentials are not registered as a teacher account.')
        }
        await supabase.auth.signOut()
        return
      }

      setLoading(false)
      router.push('/teacher/dashboard')
    } catch (err) {
      setLoading(false)
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <AuthShell title="Teacher Login" subtitle="Manage your classroom and help students learn.">
      <form onSubmit={handleLogin} className="space-y-5">
        {error && (
          <div aria-live="polite">
            <Message error>{error}</Message>
          </div>
        )}

        <div>
          <label htmlFor="teacher-email" className="block text-sm font-semibold">
            Email
          </label>
          <div className="relative mt-2">
            <Mail className="absolute top-4 left-3 size-5 text-muted-foreground" aria-hidden="true" />
            <input
              id="teacher-email"
              className={`${inputClass} pl-11`}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com…"
            />
          </div>
        </div>

        <div>
          <label htmlFor="teacher-password" className="block text-sm font-semibold">
            Password
          </label>
          <div className="relative mt-2">
            <Lock className="absolute top-4 left-3 size-5 text-muted-foreground" aria-hidden="true" />
            <input
              id="teacher-password"
              className={`${inputClass} pr-11 pl-11`}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password…"
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-3 right-2 rounded-lg p-2 text-muted-foreground hover:text-primary focus-visible:ring-2 focus-visible:ring-primary/20"
            >
              {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 accent-primary rounded focus-visible:ring-2 focus-visible:ring-primary/20"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          disabled={loading}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-semibold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-60 focus-visible:ring-3 focus-visible:ring-primary/40"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Signing In…
            </>
          ) : (
            'Sign In as Teacher'
          )}
        </button>

        <div className="space-y-2 text-center text-sm text-muted-foreground">
          <p>
            New teacher?{' '}
            <Link href="/teacher/signup" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
          <p>
            Are you a student?{' '}
            <Link href="/student/login" className="font-semibold text-primary hover:underline">
              Student Login
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  )
}
