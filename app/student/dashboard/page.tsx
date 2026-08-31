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
    document.title = 'Student Dashboard | MozhiLearn'
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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-secondary/70 via-secondary/30 to-background p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center gap-5">
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="size-3.5 text-accent" />
            Active Student
          </span>
          <h1 className="text-3xl font-extrabold md:text-4xl text-foreground">Hello, {profile?.full_name}!</h1>
          <p className="text-muted-foreground text-sm md:text-base font-semibold max-w-xl">
            Welcome to your learning space! Learn concepts in your familiar language.
          </p>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-success/10 text-success shrink-0">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Completed (முடித்தவை)</p>
            <h4 className="text-2xl font-extrabold text-foreground mt-0.5">{stats.completed} Lessons</h4>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-primary/10 text-primary shrink-0">
            <Clock className="size-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">In Progress (படிப்பவை)</p>
            <h4 className="text-2xl font-extrabold text-foreground mt-0.5">{stats.inProgress} Lessons</h4>
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-border shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-accent/10 text-accent shrink-0">
            <Award className="size-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">Badges Won (பதக்கங்கள்)</p>
            <h4 className="text-2xl font-extrabold text-foreground mt-0.5">{stats.badges} Badges</h4>
          </div>
        </div>
      </div>

      {/* Lessons List Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
          <BookOpenCheck className="size-6 text-success" />
          My Lessons (எனது பாடங்கள்)
        </h2>

        {lessons.length === 0 ? (
          <div className="bg-card rounded-3xl border border-border shadow-sm p-12 text-center">
            <BookOpen className="mx-auto size-16 text-border" />
            <h3 className="mt-4 text-lg font-bold text-foreground">No lessons assigned yet</h3>
            <p className="text-muted-foreground mt-1">Once your teacher assigns lessons, they will show up here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <div 
                key={lesson.id} 
                className="bg-card rounded-3xl border border-border shadow-sm p-6 flex flex-col hover:border-success/30 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-xs font-bold text-success bg-success/10 px-2.5 py-1 rounded-full">
                    {lesson.subject}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                    lesson.progress_status === 'completed'
                      ? 'bg-success/10 text-success'
                      : lesson.progress_status === 'in_progress'
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {lesson.progress_status === 'completed' ? 'Completed' : lesson.progress_status === 'in_progress' ? 'Reading' : 'Not Started'}
                  </span>
                </div>

                <div className="flex-1 space-y-1.5">
                  <h4 className="text-lg font-extrabold text-foreground group-hover:text-success transition-colors line-clamp-1">
                    {lesson.title_en}
                  </h4>
                  {lesson.title_ta && (
                    <h5 className="font-bold text-sm text-muted-foreground line-clamp-1">
                      {lesson.title_ta}
                    </h5>
                  )}
                </div>

                {lesson.quiz_percentage !== null && (
                  <div className="mt-4 bg-accent/6 rounded-2xl p-2.5 border border-accent/15 flex items-center justify-between">
                    <span className="text-xs font-semibold text-accent flex items-center gap-1">
                      <Award className="size-4 text-accent" />
                      Best Score:
                    </span>
                    <span className="text-sm font-extrabold text-foreground">
                      {lesson.quiz_percentage}%
                    </span>
                  </div>
                )}

                <div className="border-t border-border pt-4 mt-6 flex items-center justify-between gap-2">
                  <Link
                    href={`/student/lessons/${lesson.id}`}
                    className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-2xl bg-success text-success-foreground text-xs font-bold shadow-sm hover:bg-success/90 transition-colors"
                  >
                    <Play className="size-3.5 fill-current" />
                    Learn (படி)
                  </Link>
                  {lesson.progress_status !== 'not_started' && (
                    <Link
                      href={`/student/quiz/${lesson.id}`}
                      className="flex-1 inline-flex h-10 items-center justify-center gap-1.5 rounded-2xl border border-success/25 text-success text-xs font-bold hover:bg-success/8 transition-colors"
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
