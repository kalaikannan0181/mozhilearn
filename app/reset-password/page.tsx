'use client'

import { FormEvent, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff, Lock } from 'lucide-react'
import { AuthShell, Message, inputClass } from '@/components/auth/AuthShell'
import { handleAuthError } from '@/lib/authError'
import { isConfigValid, supabase } from '@/lib/supabaseClient'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    document.title = 'Choose New Password | MozhiLearn'
  }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (loading) return
    setError('')

    if (!isConfigValid) {
      setError(handleAuthError(null))
      return
    }

    if (!password) {
      setError('Please enter a new password.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      setLoading(false)

      if (updateError) {
        setError(handleAuthError(updateError))
        return
      }

      setDone(true)
    } catch (err: any) {
      setLoading(false)
      setError(handleAuthError(err))
    }
  }

  return (
    <AuthShell title="Choose a New Password" subtitle="Keep your learning space secure.">
      <form onSubmit={submit} className="space-y-5">
        {error && (
          <div aria-live="polite">
            <Message error>{error}</Message>
          </div>
        )}

        {done ? (
          <div className="space-y-4">
            <Message>Your password has been updated successfully.</Message>
            <button
              type="button"
              onClick={() => router.replace('/login')}
              className="flex min-h-12 w-full items-center justify-center rounded-xl bg-primary font-semibold text-primary-foreground shadow-md hover:bg-primary/90"
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <>
            <div>
              <label htmlFor="new-password" className="block text-sm font-semibold">
                New Password
              </label>
              <div className="relative mt-2">
                <Lock className="absolute top-4 left-3 size-5 text-muted-foreground" aria-hidden="true" />
                <input
                  id="new-password"
                  className={`${inputClass} pr-11 pl-11`}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter new password…"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-2 rounded-lg p-2 text-muted-foreground hover:text-primary"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-new-password" className="block text-sm font-semibold">
                Confirm New Password
              </label>
              <div className="relative mt-2">
                <Lock className="absolute top-4 left-3 size-5 text-muted-foreground" aria-hidden="true" />
                <input
                  id="confirm-new-password"
                  className={`${inputClass} pl-11`}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value)
                    setError('')
                  }}
                  placeholder="Confirm new password…"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 font-semibold text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-60 focus-visible:ring-3 focus-visible:ring-primary/40"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Updating Password…
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </>
        )}
      </form>
    </AuthShell>
  )
}
