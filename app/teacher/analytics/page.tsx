'use client'

import React, { useEffect, useState } from 'react'
import { 
  BarChart3, 
  Users, 
  Award, 
  CheckSquare, 
  TrendingUp, 
  TrendingDown, 
  UserCheck 
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/hooks/useAuth'

interface StudentProgress {
  id: string
  name: string
  grade_level: number
  school_name: string
  completed_lessons: number
  avg_score: number
  last_active: string
}

interface LessonMetric {
  id: string
  title: string
  subject: string
  grade_level: number
  completions: number
  avg_percentage: number
}

export default function TeacherAnalytics() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<StudentProgress[]>([])
  const [lessons, setLessons] = useState<LessonMetric[]>([])
  const [overallAvg, setOverallAvg] = useState(0)
  const [completionRate, setCompletionRate] = useState(0)

  useEffect(() => {
    if (!user) return

    const fetchAnalytics = async () => {
      try {
        setLoading(true)

        // 1. Fetch Mapped Students
        const { data: mappings } = await supabase
          .from('student_teacher_map')
          .select('student_id')
          .eq('teacher_id', user.id)

        const studentIds = mappings?.map(m => m.student_id) || []

        if (studentIds.length === 0) {
          setLoading(false)
          return
        }

        // Fetch student profiles
        const { data: studentProfiles } = await supabase
          .from('profiles')
          .select('id, full_name, school_name, grade_level')
          .in('id', studentIds)

        // Fetch lessons created by this teacher
        const { data: teacherLessons } = await supabase
          .from('lessons')
          .select('id, title_en, subject, grade_level')
          .eq('created_by', user.id)

        const lessonIds = teacherLessons?.map(l => l.id) || []

        // 2. Fetch progress & attempts
        const { data: progress } = await supabase
          .from('lesson_progress')
          .select('*')
          .in('student_id', studentIds)

        const { data: attempts } = await supabase
          .from('quiz_attempts')
          .select('*')
          .in('student_id', studentIds)

        // 3. Compile Student Progress
        const studentProgressData = (studentProfiles || []).map(student => {
          const studentAttempts = attempts?.filter(a => a.student_id === student.id) || []
          const studentProgress = progress?.filter(p => p.student_id === student.id && p.status === 'completed') || []
          
          let sumScore = 0
          studentAttempts.forEach(a => {
            sumScore += Number(a.percentage)
          })
          
          const avgScore = studentAttempts.length > 0 ? Math.round(sumScore / studentAttempts.length) : 0
          
          // Get last active timestamp
          const studentProgressTimes = progress?.filter(p => p.student_id === student.id).map(p => new Date(p.last_accessed_at).getTime()) || []
          const studentAttemptsTimes = studentAttempts.map(a => new Date(a.submitted_at).getTime())
          const allTimes = [...studentProgressTimes, ...studentAttemptsTimes]
          const lastActive = allTimes.length > 0 ? new Date(Math.max(...allTimes)).toLocaleDateString() : 'Never'

          return {
            id: student.id,
            name: student.full_name,
            grade_level: student.grade_level,
            school_name: student.school_name,
            completed_lessons: studentProgress.length,
            avg_score: avgScore,
            last_active: lastActive
          }
        })

        // 4. Compile Lesson Metrics
        const lessonMetricsData = (teacherLessons || []).map(lesson => {
          const lessonAttempts = attempts?.filter(a => a.lesson_id === lesson.id) || []
          const lessonProgress = progress?.filter(p => p.lesson_id === lesson.id && p.status === 'completed') || []

          let sumPercentage = 0
          lessonAttempts.forEach(a => {
            sumPercentage += Number(a.percentage)
          })

          const avgPercentage = lessonAttempts.length > 0 ? Math.round(sumPercentage / lessonAttempts.length) : 0

          return {
            id: lesson.id,
            title: lesson.title_en,
            subject: lesson.subject,
            grade_level: lesson.grade_level,
            completions: lessonProgress.length,
            avg_percentage: avgPercentage
          }
        })

        // 5. Overall Class stats
        let totalSumScore = 0
        let totalAttemptsCount = attempts?.length || 0
        attempts?.forEach(a => {
          totalSumScore += Number(a.percentage)
        })
        const totalAvg = totalAttemptsCount > 0 ? Math.round(totalSumScore / totalAttemptsCount) : 0

        // Completion percent = (completed progress rows / total assigned assignments)
        const completedCount = progress?.filter(p => p.status === 'completed').length || 0
        const totalProgressAssigned = progress?.length || 0
        const completionRatePercent = totalProgressAssigned > 0 ? Math.round((completedCount / totalProgressAssigned) * 100) : 0

        setStudents(studentProgressData)
        setLessons(lessonMetricsData)
        setOverallAvg(totalAvg)
        setCompletionRate(completionRatePercent)

      } catch (err) {
        console.error('Error fetching analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Learning Analytics</h1>
        <p className="text-gray-500 mt-1">Track student engagement, lesson completions, and quiz performance.</p>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
          <Users className="mx-auto size-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-bold text-gray-900">No student roster mapped</h3>
          <p className="text-gray-500 mt-1">Once students onboard and are mapped to you, class-wide analytics will populate here.</p>
        </div>
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-purple-500/10 text-purple-600">
                <Users className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Roster</p>
                <h4 className="text-2xl font-bold text-gray-900 mt-1">{students.length} Students</h4>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-600">
                <Award className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Class Average</p>
                <h4 className="text-2xl font-bold text-gray-900 mt-1">{overallAvg}% Score</h4>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-green-500/10 text-green-600">
                <CheckSquare className="size-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Completion Rate</p>
                <h4 className="text-2xl font-bold text-gray-900 mt-1">{completionRate}% Done</h4>
              </div>
            </div>
          </div>

          {/* Student Progress Table */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-5">
              <UserCheck className="size-5 text-gray-400" />
              Student Performance List
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead>
                  <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <th className="pb-3">Student Name</th>
                    <th className="pb-3">Grade</th>
                    <th className="pb-3">Completed Lessons</th>
                    <th className="pb-3 font-semibold text-center">Avg Quiz Score</th>
                    <th className="pb-3 text-right">Last Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50/55 transition-colors">
                      <td className="py-4 font-semibold text-gray-900">{student.name}</td>
                      <td className="py-4 text-gray-500">Grade {student.grade_level}</td>
                      <td className="py-4 text-gray-500">{student.completed_lessons} lessons</td>
                      <td className="py-4 text-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                          student.avg_score >= 70
                            ? 'bg-green-50 text-green-700'
                            : student.avg_score >= 40
                            ? 'bg-yellow-50 text-yellow-700'
                            : student.avg_score > 0
                            ? 'bg-red-50 text-red-700'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {student.avg_score > 0 ? `${student.avg_score}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="py-4 text-right text-gray-400">{student.last_active}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lesson Completion Rate Table */}
          {lessons.length > 0 && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 overflow-hidden">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-5">
                <BarChart3 className="size-5 text-gray-400" />
                Lesson Stats
              </h3>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="pb-3">Lesson Title</th>
                      <th className="pb-3">Subject</th>
                      <th className="pb-3">Grade</th>
                      <th className="pb-3 text-center">Completions</th>
                      <th className="pb-3 text-right">Avg Quiz Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {lessons.map((lesson) => (
                      <tr key={lesson.id} className="hover:bg-gray-50/55 transition-colors">
                        <td className="py-4 font-semibold text-gray-900">{lesson.title}</td>
                        <td className="py-4 text-gray-500">{lesson.subject}</td>
                        <td className="py-4 text-gray-500">Grade {lesson.grade_level}</td>
                        <td className="py-4 text-center text-gray-500">{lesson.completions} students</td>
                        <td className="py-4 text-right font-bold text-gray-700">
                          {lesson.avg_percentage > 0 ? `${lesson.avg_percentage}%` : 'No attempts'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
