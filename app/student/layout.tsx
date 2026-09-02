'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { MozhiLogo } from '@/components/logo'
import { LogOut, Home, Award, Layout, X } from 'lucide-react'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [profileError, setProfileError] = useState<string | null>(null)

  const isAuthPage = pathname === '/student/login' || pathname === '/student/signup'

  useEffect(() => {
    if (isAuthPage) return
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (!profile) {
        setProfileError('Your account profile could not be found. Please contact the administrator.')
      } else if (profile.role !== 'student') {
        if (profile.role === 'teacher') {
          router.push('/teacher/dashboard')
        } else if (profile.role === 'admin') {
          router.push('/admin/dashboard')
        } else {
          router.push('/onboarding')
        }
      }
    }
  }, [user, profile, loading, router, isAuthPage])

  if (profileError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="bg-card p-8 rounded-3xl border border-border shadow-sm max-w-md w-full text-center">
          <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto mb-4">
            <X className="size-6" />
          </div>
          <h3 className="font-bold text-foreground text-lg">Profile Load Error</h3>
          <p className="mt-2 text-sm text-muted-foreground">{profileError}</p>
          <button onClick={() => logout()} className="mt-6 w-full py-2.5 bg-destructive hover:bg-destructive/90 text-white rounded-xl font-semibold transition">
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  if (isAuthPage) {
    return <>{children}</>
  }

  if (loading || !user || !profile || profile.role !== 'student') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">Checking authorization...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Student Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <MozhiLogo href="/student/dashboard" subtext="Student Space" size="sm" />

          <div className="flex items-center gap-4">
            <Link
              href="/student/dashboard"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                pathname === '/student/dashboard'
                  ? 'bg-success/10 text-success'
                  : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              <Layout className="size-4" />
              <span>Lessons (பாடங்கள்)</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 border-l border-border pl-4">
              <div className="h-8 w-8 rounded-full bg-success/10 flex items-center justify-center text-success font-bold text-sm">
                {profile.full_name ? profile.full_name[0].toUpperCase() : 'S'}
              </div>
              <span className="text-sm font-semibold text-foreground max-w-[120px] truncate">
                {profile.full_name}
              </span>
              <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold">
                Grade {profile.grade_level || '3'}
              </span>
            </div>

            <button
              onClick={() => logout()}
              title="Sign Out"
              className="p-2 rounded-xl text-destructive hover:bg-destructive/8 transition-colors"
            >
              <LogOut className="size-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Student Page Content */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
