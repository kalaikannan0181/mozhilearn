'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Award, 
  Clock, 
  CheckCircle2, 
  Play, 
  HelpCircle,
  Sparkles,
  BookOpenCheck
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'

interface LessonItem {
  id: string
  title_en: string
  title_ta: string
  subject: string
  grade_level: number
  progress_status: 'not_started' | 'in_progress' | 'completed'
  quiz_percentage: number | null
}

export default function StudentDashboard() {
  const { user, profile } = useAuth()
  const [lessons, setLessons] = useState<LessonItem[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    completed: 0,
    inProgress: 0,
    badges: 0
  })

  useEffect(() => {
    if (!user) return

    const fetchStudentData = async () => {
      try {
        setLoading(true)

        // 1. Fetch assigned lessons & public lessons
        const { data: assignments } = await supabase
          .from('lesson_assignments')
          .select('lesson_id')
          .eq('student_id', user.id)

        const assignedIds = assignments?.map(a => a.lesson_id) || []

        // Fetch lessons (assigned + public demo lessons where created_by is null)
        let query = supabase
          .from('lessons')
          .select('id, title_en, title_ta, subject, grade_level, status, created_by')
          .eq('status', 'published')

        const { data: allLessons } = await query

        // Filter: keep if created_by is null (public demo) OR in assignedIds list
        const studentLessons = allLessons?.filter(l => l.created_by === null || assignedIds.includes(l.id)) || []

        // 2. Fetch student progress
        const { data: progress } = await supabase
          .from('lesson_progress')
          .select('lesson_id, status')
          .eq('student_id', user.id)

        // 3. Fetch quiz attempts for scoring
        const { data: attempts } = await supabase
          .from('quiz_attempts')
          .select('lesson_id, percentage')
          .eq('student_id', user.id)

        // Map everything together
        const mappedLessons: LessonItem[] = studentLessons.map(lesson => {
          const prog = progress?.find(p => p.lesson_id === lesson.id)
          const attempt = attempts?.filter(a => a.lesson_id === lesson.id) || []
          
          let maxPercent: number | null = null
          if (attempt.length > 0) {
            maxPercent = Math.max(...attempt.map(a => Number(a.percentage)))
          }

          return {
            id: lesson.id,
            title_en: lesson.title_en,
            title_ta: lesson.title_ta || '',
            subject: lesson.subject,
            grade_level: lesson.grade_level,
            progress_status: (prog?.status || 'not_started') as 'not_started' | 'in_progress' | 'completed',
            quiz_percentage: maxPercent
          }
        })

        // Stats calculation
        const completed = mappedLessons.filter(l => l.progress_status === 'completed').length
        const inProgress = mappedLessons.filter(l => l.progress_status === 'in_progress').length
        // Badges: 1 badge for each quiz score >= 70%
        const badges = mappedLessons.filter(l => l.quiz_percentage !== null && l.quiz_percentage >= 70).length

        setLessons(mappedLessons)
        setStats({ completed, inProgress, badges })

      } catch (err) {
        console.error('Error fetching student dashboard:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [user])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 md:p-8 text-white shadow-lg shadow-green-100">
        <div className="absolute top-0 right-0 translate-x-8 -translate-y-8 opacity-10">
          <BookOpen className="size-48" />
        </div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
            <Sparkles className="size-3.5 text-yellow-300 fill-yellow-300" />
            Active Student
          </span>
          <h1 className="text-3xl font-extrabold md:text-4xl">Hello, {profile?.full_name}!</h1>
          <p className="text-green-50/90 text-sm md:text-base font-semibold max-w-xl font-tamil">
            இன்று நாம் என்ன படிக்கப் போகிறோம்? தாய்மொழியில் கற்போம்!
          </p>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-green-100 text-green-600 shrink-0">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Completed (முடித்தவை)</p>
            <h4 className="text-2xl font-extrabold text-gray-900 mt-0.5">{stats.completed} Lessons</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-100 text-blue-600 shrink-0">
            <Clock className="size-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">In Progress (படிப்பவை)</p>
            <h4 className="text-2xl font-extrabold text-gray-900 mt-0.5">{stats.inProgress} Lessons</h4>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-yellow-100 text-yellow-600 shrink-0">
            <Award className="size-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-500">Badges Won (பதக்கங்கள்)</p>
            <h4 className="text-2xl font-extrabold text-gray-900 mt-0.5">{stats.badges} Badges</h4>
          </div>
        </div>
      </div>

      {/* Lessons List Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <BookOpenCheck className="size-6 text-green-500" />
          My Lessons (எனது பாடங்கள்)
        </h2>

        {lessons.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
            <BookOpen className="mx-auto size-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-bold text-gray-900">No lessons assigned yet</h3>
            <p className="text-gray-500 mt-1">Once your teacher assigns lessons, they will show up here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <div 
                key={lesson.id} 
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col hover:border-green-200 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                    {lesson.subject}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                    lesson.progress_status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : lesson.progress_status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {lesson.progress_status === 'completed' ? 'Completed' : lesson.progress_status === 'in_progress' ? 'Reading' : 'Not Started'}
                  </span>
                </div>

                <div className="flex-1 space-y-1.5">
                  <h4 className="text-lg font-extrabold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-1">
                    {lesson.title_en}
                  </h4>
                  {lesson.title_ta && (
                    <h5 className="font-tamil font-bold text-sm text-gray-600 line-clamp-1">
                      {lesson.title_ta}
                    </h5>
                  )}
                </div>

                {lesson.quiz_percentage !== null && (
                  <div className="mt-4 bg-yellow-50/50 rounded-2xl p-2.5 border border-yellow-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-yellow-800 flex items-center gap-1">
                      <Award className="size-4 text-yellow-600 fill-yellow-600" />
                      Best Score:
                    </span>
                    <span className="text-sm font-extrabold text-yellow-900">
                      {lesson.quiz_percentage}%
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-50 pt-4 mt-6 flex items-center justify-between gap-2">
                  <Link
                    href={`/student/lessons/${lesson.id}`}
                    className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-2xl bg-green-500 text-white text-xs font-bold shadow-sm shadow-green-100 hover:bg-green-600 transition-colors"
                  >
                    <Play className="size-3.5 fill-current" />
                    Learn (படி)
                  </Link>
                  {lesson.progress_status !== 'not_started' && (
                    <Link
                      href={`/student/quiz/${lesson.id}`}
                      className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-2xl border border-green-200 text-green-600 text-xs font-bold hover:bg-green-50 transition-colors"
                    >
                      <HelpCircle className="size-3.5" />
                      Quiz (தேர்வு)
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
