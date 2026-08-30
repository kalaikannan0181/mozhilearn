'use client'

import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { AuthShell, Message, inputClass } from '@/components/auth/AuthShell'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function StudentSignupPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [grade, setGrade] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const getFriendlyError = (message: string) => {
    const text = message.toLowerCase()

    if (text.includes('already registered') || text.includes('already exists') || text.includes('user already')) {
      return 'An account with this email already exists. Please sign in instead.'
    }
    if (text.includes('invalid email')) {
      return 'Please enter a valid email address.'
    }
    if (text.includes('weak password') || text.includes('password should be') || text.includes('password is too short')) {
      return 'Please choose a stronger password with at least 8 characters.'
    }
    if (text.includes('network') || text.includes('fetch') || text.includes('failed to fetch')) {
      return 'The connection to Supabase failed. Please try again.'
    }

    return 'Something went wrong while creating your account. Please try again.'
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (loading) return
    setError('')
    setSuccess(false)

    if (!fullName.trim()) return setError('Please enter your full name.')
    if (!email.trim()) return setError('Please enter your email address.')
    if (!emailPattern.test(email.trim())) return setError('Please enter a valid email address.')
    if (!password) return setError('Please enter a password.')
    if (password.length < 8) return setError('Password must be at least 8 characters long.')
    if (!confirmPassword) return setError('Please confirm your password.')
    if (password !== confirmPassword) return setError('Passwords do not match.')
    if (!grade) return setError('Please choose a grade level.')

    setLoading(true)

    const metadata: Record<string, string | number | null> = {
      full_name: fullName.trim(),
      role: 'student',
      school_name: null,
      grade_level: Number(grade),
      preferred_language: 'ta',
    }

    try {
      const { data, error: authError } = await signUp({
        email: email.trim(),
        password,
        options: { data: metadata },
      })

      setLoading(false)

      if (authError) {
        const isRateLimit = authError.status === 429 || authError.message?.toLowerCase().includes('rate limit exceeded')
        if (isRateLimit) {
          setError('Too many signup attempts were made recently. Please wait and try again later.')
        } else {
          setError(getFriendlyError(authError.message))
        }
        return
      }

      if (data?.session) {
        router.push('/student/dashboard')
        return
      }

      setSuccess(true)
    } catch (err) {
      setLoading(false)
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <AuthShell title="Create Student Account" subtitle="Continue your learning journey.">
      <form onSubmit={submit} className="space-y-5">
        {error && <Message error>{error}</Message>}
        {success && <Message>Account created. Please check your email to confirm your account.</Message>}

        <label className="block text-sm font-semibold">
          Full Name
          <input className={inputClass} required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </label>

        <label className="block text-sm font-semibold">
          Email
          <input className={inputClass} type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Password
            <div className="relative">
              <input className={`${inputClass} pr-11`} type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" aria-label="Toggle password visibility" onClick={() => setShowPassword(!showPassword)} className="absolute top-3 right-2 p-2 text-muted-foreground">
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </label>

          <label className="block text-sm font-semibold">
            Confirm Password
            <input className={inputClass} type={showPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </label>
        </div>

        <label className="block text-sm font-semibold">
          Grade Level
          <select className={inputClass} required value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="">Choose grade</option>
            {[1, 2, 3, 4, 5].map((value) => (
              <option key={value} value={value}>Grade {value}</option>
            ))}
          </select>
        </label>

        <button disabled={loading || success} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-semibold text-primary-foreground shadow-md disabled:opacity-60">
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Creating account...
            </>
          ) : (
            'Create Student Account'
          )}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account? <Link href="/student/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  )
}
