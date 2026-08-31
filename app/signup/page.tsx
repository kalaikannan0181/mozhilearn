'use client'

import { Backpack, Eye, EyeOff, GraduationCap, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { AuthShell, Message, inputClass } from '@/components/auth/AuthShell'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Role = 'teacher' | 'student'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function SignupPage() {
  const router = useRouter()
  const { signUp } = useAuth()
  const [role, setRole] = useState<Role>('student')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [grade, setGrade] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'Create Account | MozhiLearn'
  }, [])

  useEffect(() => {
    const requestedRole = new URLSearchParams(window.location.search).get('role')
    if (requestedRole === 'teacher' || requestedRole === 'student') setRole(requestedRole)
  }, [])

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
    if (role === 'teacher' && !schoolName.trim()) return setError('Please enter your school name.')
    if (role === 'student' && !grade) return setError('Please choose a grade level.')

    setLoading(true)

    const metadata: Record<string, string | number | null> = {
      full_name: fullName.trim(),
      role,
      school_name: schoolName.trim() || null,
      preferred_language: 'ta',
    }

    if (role === 'student') {
      metadata.grade_level = Number(grade)
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
        router.push(role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard')
        return
      }

      setSuccess(true)
    } catch (err) {
      setLoading(false)
      setError('Something went wrong. Please try again.')
    }
  }

  const roleCard = (value: Role, title: string, text: string, Icon: typeof GraduationCap) => {
    const isSelected = role === value
    return (
      <button
        type="button"
        onClick={() => setRole(value)}
        aria-pressed={isSelected}
        className={`relative flex flex-col rounded-2xl border-2 p-5 text-left transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 ${
          isSelected
            ? 'border-primary bg-primary/5 shadow-sm'
            : 'border-border hover:border-primary/40'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <Icon className={`size-7 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} aria-hidden="true" />
          <div
            className={`size-5 rounded-full border flex items-center justify-center transition-colors ${
              isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30 bg-transparent'
            }`}
          >
            {isSelected && (
              <span className="block size-2 rounded-full bg-white" />
            )}
          </div>
        </div>
        <span className="mt-4 block font-display font-bold text-foreground">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{text}</span>
      </button>
    )
  }

  return (
    <AuthShell title="Create Your Account" subtitle="Choose how you will use MozhiLearn.">
      <form onSubmit={submit} className="space-y-5">
        {error && (
          <div aria-live="polite">
            <Message error>{error}</Message>
          </div>
        )}
        {success && (
          <div aria-live="polite">
            <Message>Account created. Please check your email to confirm your account.</Message>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {roleCard('teacher', 'Teacher', 'Create lessons, review translations, and track learner progress.', GraduationCap)}
          {roleCard('student', 'Student', 'Learn in Tamil, listen to lessons, and take fun quizzes.', Backpack)}
        </div>

        <div>
          <label htmlFor="signup-name" className="block text-sm font-semibold text-foreground">
            Full Name
          </label>
          <input
            id="signup-name"
            className={`${inputClass} mt-2`}
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g., Kalaikannan J…"
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-sm font-semibold text-foreground">
            Email
          </label>
          <input
            id="signup-email"
            className={`${inputClass} mt-2`}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com…"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="signup-password" className="block text-sm font-semibold text-foreground">
              Password
            </label>
            <div className="relative mt-2">
              <input
                id="signup-password"
                className={`${inputClass} pr-11 !mt-0`}
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Choose password…"
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-3 right-2 p-2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="signup-confirm-password" className="block text-sm font-semibold text-foreground">
              Confirm Password
            </label>
            <input
              id="signup-confirm-password"
              className={`${inputClass} mt-2`}
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password…"
            />
          </div>
        </div>

        {role === 'teacher' ? (
          <div>
            <label htmlFor="signup-school" className="block text-sm font-semibold text-foreground">
              School Name
            </label>
            <input
              id="signup-school"
              className={`${inputClass} mt-2`}
              autoComplete="organization"
              required
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="e.g., Nandha Engineering College…"
            />
          </div>
        ) : (
          <div>
            <label htmlFor="signup-grade" className="block text-sm font-semibold text-foreground">
              Grade Level
            </label>
            <select
              id="signup-grade"
              className={`${inputClass} mt-2`}
              required
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <option value="">Choose grade…</option>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  Grade {value}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          disabled={loading || success}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-semibold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-60 focus-visible:ring-3 focus-visible:ring-primary/40"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Creating Account…
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  )
}
