'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, ArrowRight } from 'lucide-react'
import { MozhiLogo } from '@/components/logo'
import { supabase } from '@/lib/supabaseClient'

export default function OnboardingPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'teacher' | 'student'>('student')
  const [schoolName, setSchoolName] = useState('')
  const [gradeLevel, setGradeLevel] = useState<number>(3)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUserId(session.user.id)
      
      // Check if profile exists and prefill
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
        
      if (profile) {
        setFullName(profile.full_name || '')
        setRole(profile.role as 'teacher' | 'student' || 'student')
        setSchoolName(profile.school_name || '')
        if (profile.grade_level) {
          setGradeLevel(profile.grade_level)
        }
      }
      setLoading(false)
    }
    fetchUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setError(null)
    setSaving(true)

    try {
      // 1. Update Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          role: role,
          school_name: schoolName,
          grade_level: role === 'student' ? gradeLevel : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (profileError) {
        setError(profileError.message)
        setSaving(false)
        return
      }

      // 2. Setup School and Mappings
      if (schoolName.trim()) {
        // Find or create school
        let schoolId: string | null = null
        const { data: existingSchool } = await supabase
          .from('schools')
          .select('id')
          .eq('name', schoolName.trim())
          .maybeSingle()

        if (existingSchool) {
          schoolId = existingSchool.id
        } else {
          const { data: newSchool, error: schoolError } = await supabase
            .from('schools')
            .insert({
              name: schoolName.trim(),
              district: 'Erode',
              state: 'Tamil Nadu',
              created_by: userId
            })
            .select('id')
            .single()

          if (!schoolError && newSchool) {
            schoolId = newSchool.id
          }
        }

        // Map teacher to school
        if (role === 'teacher' && schoolId) {
          await supabase
            .from('teacher_schools')
            .upsert({
              teacher_id: userId,
              school_id: schoolId
            }, { onConflict: 'teacher_id,school_id' })
        }

        // Map student to school and automatically map to teachers for demo convenience
        if (role === 'student' && schoolId) {
          // Find teachers in this school or demo teachers
          const { data: teachers } = await supabase
            .from('profiles')
            .select('id')
            .eq('role', 'teacher')

          if (teachers && teachers.length > 0) {
            // Map student to teachers in the school to populate the teacher's student roster
            const mappings = teachers.map(t => ({
              teacher_id: t.id,
              student_id: userId
            }))
            await supabase.from('student_teacher_map').upsert(mappings, { onConflict: 'teacher_id,student_id' })
          }
        }
      }

      // 3. Redirect to dashboard
      if (role === 'teacher') {
        router.push('/teacher/dashboard')
      } else {
        router.push('/student/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during profile setup.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-gray-500">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gradient-to-br from-blue-50 via-white to-orange-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex items-center justify-center">
          <MozhiLogo href="/" subtext="மொழி கற்றல்" size="lg" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Tell us a bit more about yourself to set up your learning space.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl border border-gray-100 rounded-3xl sm:px-10">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-primary focus:ring-primary focus:outline-none sm:text-sm"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex items-center justify-center rounded-2xl py-3 px-4 text-sm font-semibold border-2 transition-all ${
                    role === 'student'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Student (மாணவர்)
                </button>
                <button
                  type="button"
                  onClick={() => setRole('teacher')}
                  className={`flex items-center justify-center rounded-2xl py-3 px-4 text-sm font-semibold border-2 transition-all ${
                    role === 'teacher'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Teacher (ஆசிரியர்)
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="school" className="block text-sm font-semibold text-gray-700">
                School Name
              </label>
              <input
                id="school"
                type="text"
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-primary focus:ring-primary focus:outline-none sm:text-sm"
                placeholder="e.g. Govt Primary School, Erode"
              />
            </div>

            {role === 'student' && (
              <div>
                <label htmlFor="grade" className="block text-sm font-semibold text-gray-700">
                  Grade / Class (வகுப்பு)
                </label>
                <select
                  id="grade"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-2xl border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-primary focus:ring-primary focus:outline-none sm:text-sm"
                >
                  <option value={1}>Grade 1 (முதல் வகுப்பு)</option>
                  <option value={2}>Grade 2 (இரண்டாம் வகுப்பு)</option>
                  <option value={3}>Grade 3 (மூன்றாம் வகுப்பு)</option>
                  <option value={4}>Grade 4 (நான்காம் வகுப்பு)</option>
                  <option value={5}>Grade 5 (ஐந்தாம் வகுப்பு)</option>
                </select>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={saving}
                className="flex w-full min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-4 text-base font-semibold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    Save & Continue
                    <ArrowRight className="size-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
