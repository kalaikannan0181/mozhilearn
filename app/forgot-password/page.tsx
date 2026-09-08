'use client'

import { Mail, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { FormEvent, useState, useEffect } from 'react'
import { AuthShell, Message, inputClass } from '@/components/auth/AuthShell'
import { handleAuthError } from '@/lib/authError'
import { isConfigValid, supabase } from '@/lib/supabaseClient'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'Forgot Password | MozhiLearn'
  }, [])

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (loading) return
    setError('')
    setSuccess(false)

    if (!isConfigValid) {
      setError(handleAuthError(null))
      return
    }

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!emailPattern.test(email.trim())) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      const redirectTo = `${window.location.origin}/reset-password`
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo,
      })

      setLoading(false)

      if (resetError) {
        setError(handleAuthError(resetError))
        return
      }

      setSuccess(true)
    } catch (err: any) {
      setLoading(false)
      setError(handleAuthError(err))
    }
  }

  return (
    <AuthShell
      title="Reset Password"
      subtitle="Enter your account email and we'll send you a password reset link."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div aria-live="polite">
            <Message error>{error}</Message>
          </div>
        )}

        {success && (
          <div aria-live="polite">
            <Message>
              Password reset link sent! Please check your email inbox to update your password.
            </Message>
          </div>
        )}

        <div>
          <label htmlFor="forgot-email" className="block text-sm font-semibold">
            Email Address
          </label>
          <div className="relative mt-2">
            <Mail className="absolute top-4 left-3 size-5 text-muted-foreground" aria-hidden="true" />
            <input
              id="forgot-email"
              className={`${inputClass} pl-11`}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setError('')
              }}
              placeholder="you@example.com…"
              disabled={loading || success}
            />
          </div>
        </div>

        <button
          disabled={loading || success}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-semibold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-60 focus-visible:ring-3 focus-visible:ring-primary/40"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Sending Link…
            </>
          ) : (
            'Send Reset Link'
          )}
        </button>

        <div className="text-center pt-2">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to Sign In
          </Link>
        </div>
      </form>
    </AuthShell>
  )
}
