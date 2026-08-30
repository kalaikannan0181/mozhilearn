'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  CheckCircle, 
  Users, 
  Award, 
  Plus, 
  ArrowRight,
  TrendingUp,
  History,
  FileText
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'

interface Stats {
  totalLessons: number
  publishedLessons: number
  totalStudents: number
  avgScore: number
}

interface Lesson {
  id: string
  title_en: string
  title_ta: string
  subject: string
  grade_level: number
  status: string
  created_at: string
}

interface StudentActivity {
  id: string
  student_name: string
  lesson_title: string
  score: number
  total_questions: number
  percentage: number
  submitted_at: string
}

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<Stats>({
    totalLessons: 0,
    publishedLessons: 0,
    totalStudents: 0,
    avgScore: 0
  })
  const [recentLessons, setRecentLessons] = useState<Lesson[]>([])
  const [activity, setActivity] = useState<StudentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // 1. Fetch Lessons
        const { data: lessons } = await supabase
          .from('lessons')
          .select('*')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false })

        const totalLessons = lessons?.length || 0
        const publishedLessons = lessons?.filter(l => l.status === 'published').length || 0
        
        if (lessons) {
          setRecentLessons(lessons.slice(0, 5))
        }

        // 2. Fetch Students Mapped
        const { data: mappings } = await supabase
          .from('student_teacher_map')
          .select('student_id')
          .eq('teacher_id', user.id)

        const studentIds = mappings?.map(m => m.student_id) || []
        const totalStudents = studentIds.length

        // 3. Fetch Quiz Results & Activity
        let avgScore = 0
        let recentActivity: StudentActivity[] = []

        if (studentIds.length > 0) {
          const { data: attempts } = await supabase
            .from('quiz_attempts')
            .select(`
              id,
              score,
              total_questions,
              percentage,
              submitted_at,
              student_id,
              lesson_id
            `)
            .in('student_id', studentIds)
            .order('submitted_at', { ascending: false })

          if (attempts && attempts.length > 0) {
            const sumPercent = attempts.reduce((acc, curr) => acc + Number(curr.percentage), 0)
            avgScore = Math.round(sumPercent / attempts.length)

            // Resolve student names and lesson titles for activity
            // Query student profiles
            const { data: studentProfiles } = await supabase
              .from('profiles')
              .select('id, full_name')
              .in('id', studentIds)

            // Query lesson titles
            const lessonIds = [...new Set(attempts.map(a => a.lesson_id))]
            const { data: lessonTitles } = await supabase
              .from('lessons')
              .select('id, title_en')
              .in('id', lessonIds)

            recentActivity = attempts.slice(0, 5).map(attempt => {
              const student = studentProfiles?.find(s => s.id === attempt.student_id)
              const lesson = lessonTitles?.find(l => l.id === attempt.lesson_id)
              return {
                id: attempt.id,
                student_name: student?.full_name || 'Anonymous Student',
                lesson_title: lesson?.title_en || 'Demo Lesson',
                score: Number(attempt.score),
                total_questions: attempt.total_questions,
                percentage: Number(attempt.percentage),
                submitted_at: attempt.submitted_at
              }
            })
          }
        }

        setStats({
          totalLessons,
          publishedLessons,
          totalStudents,
          avgScore
        })
        setActivity(recentActivity)

      } catch (err) {
        console.error('Error fetching dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Lessons', value: stats.totalLessons, icon: BookOpen, color: 'bg-blue-500 text-blue-500' },
    { label: 'Published', value: stats.publishedLessons, icon: CheckCircle, color: 'bg-green-500 text-green-500' },
    { label: 'My Students', value: stats.totalStudents, icon: Users, color: 'bg-purple-500 text-purple-500' },
    { label: 'Avg Quiz Score', value: `${stats.avgScore}%`, icon: Award, color: 'bg-orange-500 text-orange-500' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back!</h1>
          <p className="text-gray-500 mt-1">Here is how your classes are progressing today.</p>
        </div>
        <Link
          href="/teacher/lessons/new"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg shrink-0"
        >
          <Plus className="size-4" />
          Create New Lesson
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`p-3.5 rounded-2xl ${card.color.split(' ')[0]}/10 ${card.color.split(' ')[1]}`}>
              <card.icon className="size-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <h4 className="text-2xl font-bold text-gray-900 mt-1">{card.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Lessons */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <FileText className="size-5 text-gray-400" />
              Recent Lessons
            </h3>
            <Link href="/teacher/lessons" className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
              View all
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="flex-1 space-y-3.5">
            {recentLessons.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10">
                <p className="text-gray-400 font-medium">No lessons created yet.</p>
                <Link href="/teacher/lessons/new" className="mt-2 text-sm text-primary font-semibold hover:underline">
                  Create your first lesson now
                </Link>
              </div>
            ) : (
              recentLessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-50 hover:border-gray-100 transition-colors">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{lesson.title_en}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span>Grade {lesson.grade_level}</span>
                      <span>•</span>
                      <span>{lesson.subject}</span>
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    lesson.status === 'published'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {lesson.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Student Activity */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <History className="size-5 text-gray-400" />
              Recent Student Activity
            </h3>
            <Link href="/teacher/analytics" className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
              View Analytics
              <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="flex-1 space-y-3.5">
            {activity.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 text-gray-400">
                <p className="font-medium">No student activity logged yet.</p>
                <p className="text-xs mt-1">Activity will appear here once students submit quizzes.</p>
              </div>
            ) : (
              activity.map((act) => (
                <div key={act.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-50 hover:border-gray-100 transition-colors">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{act.student_name}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">
                      Completed quiz for: <span className="font-medium">{act.lesson_title}</span>
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                      act.percentage >= 70
                        ? 'bg-green-50 text-green-700'
                        : act.percentage >= 40
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-red-50 text-red-700'
                    }`}>
                      {act.score}/{act.total_questions} ({act.percentage}%)
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(act.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
