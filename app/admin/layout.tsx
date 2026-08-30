'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { BookOpenText, Sparkles, LogOut, Home, ShieldAlert } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (profile && profile.role !== 'admin') {
        if (profile.role === 'teacher') {
          router.push('/teacher/dashboard')
        } else if (profile.role === 'student') {
          router.push('/student/dashboard')
        } else {
          router.push('/onboarding')
        }
      }
    }
  }, [user, profile, loading, router])

  if (loading || !user || !profile || profile.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Checking authorization...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="relative flex size-9 items-center justify-center rounded-xl bg-orange-600 text-white shadow-sm">
              <BookOpenText className="size-4.5" />
              <ShieldAlert className="absolute -top-1 -right-1 size-3.5 text-yellow-300 fill-yellow-300" />
            </span>
            <div className="flex flex-col leading-none text-left">
              <span className="font-display font-bold text-base text-gray-900 tracking-tight">
                MozhiLearn Admin
              </span>
              <span className="text-[10px] text-orange-600 font-semibold uppercase">
                Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">{profile.full_name}</span>
            </div>
            <button
              onClick={() => logout()}
              className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="size-4.5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
