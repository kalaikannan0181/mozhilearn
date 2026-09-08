import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL ||
  ''

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  ''

// Startup validation logging (Checklist #3)
if (typeof window !== 'undefined') {
  console.log("Supabase URL exists:", Boolean(supabaseUrl))
  console.log("Supabase anon key exists:", Boolean(supabaseAnonKey))
}

// Checklist #4 & #5: Format & Placeholder Validation
export const isUrlValid = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('https://') &&
  supabaseUrl.includes('.supabase.co') &&
  !supabaseUrl.includes('YOUR_PROJECT_REF') &&
  !supabaseUrl.includes('your-project-url') &&
  !supabaseUrl.includes('placeholder')
)

export const isKeyValid = Boolean(
  supabaseAnonKey &&
  !supabaseAnonKey.includes('placeholder') &&
  !supabaseAnonKey.includes('your-anon-key')
)

export const isConfigValid = isUrlValid && isKeyValid

if (!isConfigValid) {
  console.error(
    'Supabase Configuration Error: Invalid or missing Supabase URL / Anon Key. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set correctly.'
  )
}

export const supabase = createClient(
  isConfigValid ? supabaseUrl : 'https://dummy-placeholder-project.supabase.co',
  isConfigValid ? supabaseAnonKey : 'dummy-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: isConfigValid,
      detectSessionInUrl: isConfigValid,
    },
    global: {
      fetch: async (url, options) => {
        try {
          return await fetch(url, options)
        } catch (error) {
          if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            console.warn('[Supabase Client] Network fetch failed (offline or unreachable endpoint):', (error as Error).message)
          }
          throw error
        }
      },
    },
  }
)