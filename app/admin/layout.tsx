'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { MozhiLogo } from '@/components/logo'
import { LogOut, ShieldAlert } from 'lucide-react'

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
          <MozhiLogo href="/admin/dashboard" subtext="Admin Console" size="sm" />

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
