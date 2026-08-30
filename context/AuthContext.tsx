'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

export interface Profile {
  id: string
  full_name: string
  role: 'admin' | 'teacher' | 'student'
  school_name?: string
  grade_level?: number
  preferred_language: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Pick<Profile, 'full_name' | 'role' | 'school_name' | 'grade_level'> | null
  loading: boolean
  signUp: typeof supabase.auth.signUp
  signIn: typeof supabase.auth.signInWithPassword
  signOut: typeof supabase.auth.signOut
  resetPassword: typeof supabase.auth.resetPasswordForEmail
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function fetchUserProfile(userId: string, retries = 3, delay = 500): Promise<any> {
  for (let i = 0; i < retries; i++) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, role, school_name, grade_level, preferred_language')
      .eq('id', userId)
      .maybeSingle()

    if (!error && data) {
      return data
    }

    if (error) {
      console.warn(`Attempt ${i + 1} to load profile failed: ${error.message}`)
    }

    if (i < retries - 1) {
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  console.error('Failed to load user profile after all attempts.')
  return null
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Pick<Profile, 'full_name' | 'role' | 'school_name' | 'grade_level'> | null>(null)
  const [loading, setLoading] = useState(true)

  const syncAuthState = async (nextSession: Session | null) => {
    setSession(nextSession)
    const nextUser = nextSession?.user ?? null
    setUser(nextUser)

    if (!nextUser) {
      setProfile(null)
      setLoading(false)
      return
    }

    const nextProfile = await fetchUserProfile(nextUser.id)
    setProfile(nextProfile ? {
      full_name: nextProfile.full_name ?? '',
      role: nextProfile.role,
      school_name: nextProfile.school_name,
      grade_level: nextProfile.grade_level,
    } : null)
    setLoading(false)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    setProfile(null)
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        await syncAuthState(currentSession)
      } catch {
        setSession(null)
        setUser(null)
        setProfile(null)
        setLoading(false)
      }
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        void syncAuthState(nextSession)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp: (credentials) => supabase.auth.signUp(credentials),
        signIn: (credentials) => supabase.auth.signInWithPassword(credentials),
        signOut: (options) => supabase.auth.signOut(options),
        resetPassword: (email, options) => supabase.auth.resetPasswordForEmail(email, options),
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
