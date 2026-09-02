import { isConfigValid } from '@/lib/supabaseClient'

export function handleAuthError(error: any): string {
  if (!isConfigValid) {
    console.error('Supabase Configuration Error: Missing or invalid URL/Key configuration.')
    return 'Configuration Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing or invalid in environment variables.'
  }

  if (!error) {
    return 'An unexpected authentication error occurred. Please try again.'
  }

  // Checklist Step 5 & 8: Log message, status, code, name, and full error object
  console.error('Supabase Auth Error Details:', {
    message: error.message,
    status: error.status,
    code: error.code,
    name: error.name,
    fullError: error,
  })

  const message = (error.message || '').toLowerCase()
  const code = (error.code || '').toLowerCase()
  const status = error.status

  if (code === 'invalid_credentials' || message.includes('invalid login credentials') || message.includes('invalid credentials') || message.includes('invalid email or password')) {
    return 'Incorrect email address or password.'
  }

  if (code === 'email_not_confirmed' || message.includes('email not confirmed')) {
    return 'Please verify your email address before signing in.'
  }

  if (code === 'user_already_exists' || message.includes('already registered') || message.includes('already exists') || message.includes('user already')) {
    return 'An account with this email address is already registered. Please sign in instead.'
  }

  if (code === 'signup_disabled' || code === 'provider_disabled' || message.includes('signup is disabled') || message.includes('provider is disabled')) {
    return 'Email and password authentication is disabled in your Supabase project settings.'
  }

  if (status === 503 || status === 502 || message.includes('paused') || message.includes('service unavailable')) {
    return 'The Supabase project is currently paused, deleted, or unavailable. Please check your Supabase project status.'
  }

  if (message.includes('network') || message.includes('fetch') || message.includes('failed to fetch')) {
    return 'We could not reach the sign-in service. Check your internet connection and try again.'
  }

  if (status === 429 || message.includes('rate limit')) {
    return 'Too many attempts. Please wait a few minutes and try again.'
  }

  return error.message || 'Unable to sign in right now. Please try again.'
}
