'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { 
  BookOpenText, 
  Sparkles, 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  Home,
  Plus
} from 'lucide-react'

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)

  const isAuthPage = pathname === '/teacher/login' || pathname === '/teacher/signup'

  useEffect(() => {
    if (isAuthPage) return
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (!profile) {
        setProfileError('Your account profile could not be found. Please contact the administrator.')
      } else if (profile.role !== 'teacher') {
        if (profile.role === 'student') {
          router.push('/student/dashboard')
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

  if (loading || !user || !profile || profile.role !== 'teacher') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">Checking authorization...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { label: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'My Lessons', href: '/teacher/lessons', icon: BookOpen },
    { label: 'Create Lesson', href: '/teacher/lessons/create', icon: Plus },
    { label: 'Student Progress', href: '/teacher/analytics', icon: BarChart3 },
    { label: 'Translation Reviews', href: '/teacher/reviews', icon: BookOpenText },
  ]

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-border bg-card shadow-sm z-20">
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center h-20 px-6 border-b border-border gap-2.5">
            <span className="relative flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shrink-0">
              <BookOpenText className="size-5" />
              <Sparkles className="absolute -top-1 -right-1 size-4 text-accent" />
            </span>
            <div className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                MozhiLearn
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                Teacher Portal
              </span>
            </div>
          </div>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 px-4 space-y-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-semibold rounded-2xl transition-all ${
                      isActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex flex-col p-4 border-t border-border gap-2">
            <div className="flex items-center px-4 py-2 gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                {profile.full_name ? profile.full_name[0].toUpperCase() : 'T'}
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="text-sm font-semibold text-foreground truncate">{profile.full_name}</span>
                <span className="text-xs text-muted-foreground capitalize">{profile.role}</span>
              </div>
            </div>
            <Link
              href="/"
              className="flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Home className="mr-3 h-4 w-4 text-muted-foreground" />
              Main Site
            </Link>
            <button
              onClick={() => logout()}
              className="flex items-center w-full px-4 py-2.5 text-sm font-semibold rounded-xl text-destructive hover:bg-destructive/8"
            >
              <LogOut className="mr-3 h-4 w-4 text-destructive/70" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full md:pl-64">
        {/* Mobile Header */}
        <header className="flex items-center justify-between h-16 bg-card border-b border-border px-4 md:hidden">
          <Link href="/teacher/dashboard" className="flex items-center gap-2">
            <span className="relative flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BookOpenText className="size-4" />
            </span>
            <span className="font-display font-bold text-base text-foreground">
              MozhiLearn
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-lg border border-border text-muted-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Mobile Menu Backdrop & Panel */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <nav className="fixed top-0 bottom-0 right-0 w-64 bg-card border-l border-border flex flex-col p-6 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <span className="font-semibold text-foreground">Navigation</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg border border-border text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 space-y-1.5">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-4 py-3 text-sm font-semibold rounded-2xl transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                      }`}
                    >
                      <item.icon className="mr-3 h-5 w-5 shrink-0" />
                      {item.label}
                    </Link>
                  )
                })}
              </div>
              <div className="border-t border-border pt-4 mt-auto space-y-2">
                <div className="flex items-center px-2 py-2 gap-3 mb-2">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {profile.full_name ? profile.full_name[0].toUpperCase() : 'T'}
                  </div>
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="text-sm font-semibold text-foreground truncate">{profile.full_name}</span>
                    <span className="text-xs text-muted-foreground capitalize">{profile.role}</span>
                  </div>
                </div>
                <Link
                  href="/"
                  className="flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <Home className="mr-3 h-4 w-4" />
                  Main Site
                </Link>
                <button
                  onClick={() => logout()}
                  className="flex items-center w-full px-4 py-2.5 text-sm font-semibold rounded-xl text-destructive hover:bg-destructive/8"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        )}

        {/* Content Wrapper */}
        <main className="flex-1 overflow-y-auto focus:outline-none p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
