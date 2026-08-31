'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Users, 
  Plus, 
  ArrowRight,
  History,
  FileText,
  BookmarkCheck,
  Languages,
  PlusCircle,
  FolderOpen,
  Calendar,
  CheckCircle,
  AlertCircle,
  GraduationCap,
  School,
  Loader2
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'

interface Stats {
  totalLessons: number
  totalStudents: number
  assignedLessons: number
  pendingReviews: number
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

interface Student {
  id: string
  full_name: string
  grade_level: number
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
  const { user, profile } = useAuth()
  const [stats, setStats] = useState<Stats>({
    totalLessons: 0,
    totalStudents: 0,
    assignedLessons: 0,
    pendingReviews: 0
  })
  const [recentLessons, setRecentLessons] = useState<Lesson[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [activity, setActivity] = useState<StudentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboardData = async () => {
    if (!user) return
    try {
      setLoading(true)
      setError('')

      // 1. Fetch Lessons
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, title_en, title_ta, subject, grade_level, status, created_at')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

      if (lessonsError) throw lessonsError

      const totalLessons = lessons?.length || 0
      const recentLessonsList = lessons?.slice(0, 5) || []

      // 2. Fetch Mapped Students
      const { data: mappings, error: mappingsError } = await supabase
        .from('student_teacher_map')
        .select('student_id')
        .eq('teacher_id', user.id)

      if (mappingsError) throw mappingsError

      const studentIds = mappings?.map(m => m.student_id) || []
      const totalStudents = studentIds.length

      // Fetch Student profiles for preview
      let studentList: Student[] = []
      if (studentIds.length > 0) {
        const { data: studentProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, full_name, grade_level')
          .in('id', studentIds)
          .limit(5)

        if (profilesError) throw profilesError
        studentList = (studentProfiles || []) as Student[]
      }

      // 3. Fetch Lesson Assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('lesson_assignments')
        .select('id')
        .eq('assigned_by', user.id)

      if (assignmentsError) throw assignmentsError
      const assignedLessons = assignments?.length || 0

      // 4. Fetch Pending Translation Reviews (RLS restricts to teacher's lessons automatically)
      const { data: reviews, error: reviewsError } = await supabase
        .from('translation_reviews')
        .select('id')
        .eq('status', 'pending')

      if (reviewsError) throw reviewsError
      const pendingReviews = reviews?.length || 0

      // 5. Fetch Recent Student Quiz Activity
      let recentQuizAttempts: StudentActivity[] = []
      if (studentIds.length > 0) {
        const { data: attempts, error: attemptsError } = await supabase
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
          .limit(5)

        if (attemptsError) throw attemptsError

        if (attempts && attempts.length > 0) {
          // Resolve student names and lesson titles
          const { data: studentNames } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', studentIds)

          const lessonIds = [...new Set(attempts.map(a => a.lesson_id))]
          const { data: lessonTitles } = await supabase
            .from('lessons')
            .select('id, title_en')
            .in('id', lessonIds)

          recentQuizAttempts = attempts.map(attempt => {
            const studentObj = studentNames?.find(s => s.id === attempt.student_id)
            const lessonObj = lessonTitles?.find(l => l.id === attempt.lesson_id)
            return {
              id: attempt.id,
              student_name: studentObj?.full_name || 'Anonymous Student',
              lesson_title: lessonObj?.title_en || 'Demo Lesson',
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
        totalStudents,
        assignedLessons,
        pendingReviews
      })
      setRecentLessons(recentLessonsList)
      setStudents(studentList)
      setActivity(recentQuizAttempts)

    } catch (err: any) {
      console.error('Error fetching dashboard data:', err)
      setError('Unable to load dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    document.title = 'Teacher Dashboard | MozhiLearn'
    fetchDashboardData()
  }, [user])

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center p-8">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="mt-4 text-sm text-muted-foreground font-medium">Loading dashboard data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-destructive/8 border border-destructive/20 rounded-3xl p-6 flex items-start gap-4 shadow-sm max-w-2xl mx-auto my-8">
        <AlertCircle className="size-6 text-destructive shrink-0 mt-0.5" />
        <div>
          <h3 className="font-bold text-destructive text-lg">Failed to Load Dashboard</h3>
          <p className="text-destructive/80 text-sm mt-1">{error}</p>
          <button onClick={fetchDashboardData} className="mt-4 px-4 py-2 text-sm font-semibold bg-destructive text-white rounded-xl hover:bg-destructive/90 transition">
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const statCards = [
    { label: 'Total Lessons', value: stats.totalLessons, icon: BookOpen, iconBg: 'bg-primary/10 text-primary', border: 'border-border' },
    { label: 'Total Students', value: stats.totalStudents, icon: Users, iconBg: 'bg-secondary text-primary', border: 'border-border' },
    { label: 'Assigned Lessons', value: stats.assignedLessons, icon: BookmarkCheck, iconBg: 'bg-success/10 text-success', border: 'border-border' },
    { label: 'Pending Reviews', value: stats.pendingReviews, icon: Languages, iconBg: 'bg-accent/10 text-accent', border: 'border-border' },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-secondary/60 via-secondary/20 to-background p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome, {profile?.full_name || 'Teacher'}!
          </h1>
          <p className="text-muted-foreground mt-2 text-base leading-relaxed">
            Create lessons, manage students, and track learning progress.
          </p>
          {profile?.school_name && (
            <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-bold text-foreground shadow-sm">
              <School className="size-4 text-primary" />
              <span>{profile.school_name}</span>
            </div>
          )}
        </div>
        <Link
          href="/teacher/lessons/create"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg shrink-0"
        >
          <Plus className="size-5" />
          Create New Lesson
        </Link>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className={`bg-card p-6 rounded-3xl border ${card.border} shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow`}>
            <div className={`p-4 rounded-2xl ${card.iconBg}`}>
              <card.icon className="size-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.label}</p>
              <h4 className="text-3xl font-extrabold text-foreground mt-1">{card.value}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Main Dashboard Layout Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        
        {/* Left Hand Column: Recent Lessons & Quick Actions */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Recent Lessons */}
          <div className="bg-card rounded-3xl border border-border shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FileText className="size-5 text-muted-foreground" />
                Recent Lessons
              </h3>
              <Link href="/teacher/lessons" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                View all lessons
                <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {recentLessons.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10">
                  <FolderOpen className="size-12 text-border mb-2" />
                  <p className="text-muted-foreground font-medium">No lessons created yet.</p>
                  <Link
                    href="/teacher/lessons/create"
                    className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold bg-primary/10 text-primary px-4 py-2 rounded-xl hover:bg-primary/20 transition"
                  >
                    <Plus className="size-4" />
                    Create Your First Lesson
                  </Link>
                </div>
              ) : (
                recentLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center justify-between p-4 rounded-2xl border border-border hover:border-border hover:bg-secondary/30 transition-all">
                    <div className="min-w-0 pr-4">
                      <p className="font-bold text-foreground truncate text-base">{lesson.title_en}</p>
                      {lesson.title_ta && (
                        <p className="font-tamil text-sm text-muted-foreground mt-0.5 truncate">{lesson.title_ta}</p>
                      )}
                      <div className="text-xs text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-semibold text-primary/80 bg-primary/5 px-2 py-0.5 rounded-md">Grade {lesson.grade_level}</span>
                        <span>•</span>
                        <span>{lesson.subject}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(lesson.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        lesson.status === 'published'
                          ? 'bg-success/10 text-success border border-success/20'
                          : 'bg-accent/10 text-accent border border-accent/20'
                      }`}>
                        {lesson.status}
                      </span>
                      <Link
                        href={`/teacher/lessons/${lesson.id}`}
                        className="p-1.5 rounded-lg border border-border hover:border-primary hover:text-primary transition bg-card"
                      >
                        <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-3xl border border-border shadow-sm p-6">
            <h3 className="text-lg font-bold text-foreground mb-5">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Link
                href="/teacher/lessons/create"
                className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border hover:border-primary hover:bg-primary/5 transition text-center gap-2 group"
              >
                <PlusCircle className="size-7 text-primary group-hover:scale-105 transition" />
                <span className="text-xs font-bold text-foreground">Create Lesson</span>
              </Link>
              <Link
                href="/teacher/analytics"
                className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border hover:border-primary hover:bg-primary/5 transition text-center gap-2 group"
              >
                <Users className="size-7 text-primary group-hover:scale-105 transition" />
                <span className="text-xs font-bold text-foreground">View Students</span>
              </Link>
              <Link
                href="/teacher/lessons"
                className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border hover:border-primary hover:bg-primary/5 transition text-center gap-2 group"
              >
                <FileText className="size-7 text-primary group-hover:scale-105 transition" />
                <span className="text-xs font-bold text-foreground">Manage Lessons</span>
              </Link>
              <Link
                href="/teacher/lessons"
                className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border hover:border-primary hover:bg-primary/5 transition text-center gap-2 group"
              >
                <BookmarkCheck className="size-7 text-success group-hover:scale-105 transition" />
                <span className="text-xs font-bold text-foreground">Assign Lesson</span>
              </Link>
              <Link
                href="/teacher/reviews"
                className="flex flex-col items-center justify-center p-4 rounded-2xl border border-border hover:border-primary hover:bg-primary/5 transition text-center gap-2 group"
              >
                <Languages className="size-7 text-accent group-hover:scale-105 transition" />
                <span className="text-xs font-bold text-foreground">Review Translations</span>
              </Link>
            </div>
          </div>

        </div>

        {/* Right Hand Column: Mapped Students & Activity Feed */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Mapped Students Preview */}
          <div className="bg-card rounded-3xl border border-border shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <GraduationCap className="size-5 text-muted-foreground" />
                My Students
              </h3>
              <Link href="/teacher/analytics" className="text-sm font-semibold text-primary hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {students.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="font-medium text-sm">No students assigned yet.</p>
                </div>
              ) : (
                students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/40 border border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                        {student.full_name ? student.full_name[0].toUpperCase() : 'S'}
                      </div>
                      <div>
                        <p className="font-bold text-foreground text-sm leading-none">{student.full_name}</p>
                        <p className="text-xs text-muted-foreground mt-1.5">Grade Level: {student.grade_level || '3'}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Student Progress Activity */}
          <div className="bg-card rounded-3xl border border-border shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <History className="size-5 text-muted-foreground" />
                Student Activity
              </h3>
              <Link href="/teacher/analytics" className="text-sm font-semibold text-primary hover:underline">
                View Analytics
              </Link>
            </div>

            <div className="space-y-3">
              {activity.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground leading-relaxed">
                  <p className="font-medium text-sm">No student activity logged yet.</p>
                  <p className="text-xs mt-1">Activity will appear here once students submit quizzes.</p>
                </div>
              ) : (
                activity.map((act) => (
                  <div key={act.id} className="flex items-center justify-between p-3.5 rounded-2xl border border-border hover:bg-secondary/30 transition-colors">
                    <div className="min-w-0 pr-3">
                      <p className="font-bold text-foreground text-sm truncate">{act.student_name}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        Completed quiz: <span className="font-medium">{act.lesson_title}</span>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        act.percentage >= 70
                          ? 'bg-success/10 text-success'
                          : act.percentage >= 40
                          ? 'bg-accent/10 text-accent'
                          : 'bg-destructive/10 text-destructive'
                      }`}>
                        {act.score}/{act.total_questions} ({act.percentage}%)
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">
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
    </div>
  )
}
