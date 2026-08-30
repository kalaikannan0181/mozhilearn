'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  HelpCircle, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Award, 
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'

interface Question {
  id: string
  question_en: string
  question_ta: string
  options: string[]
  difficulty: string
  question_order: number
}

interface SubmittedAnswer {
  question_id: string
  selected_option: string
}

interface Params {
  lessonId: string
}

export default function StudentQuiz({ params: paramsPromise }: { params: Promise<Params> }) {
  const params = use(paramsPromise)
  const router = useRouter()
  const { user, profile } = useAuth()
  const lessonId = params.lessonId

  // Loading states
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Quiz States
  const [lessonTitle, setLessonTitle] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [answers, setAnswers] = useState<SubmittedAnswer[]>([])

  // Results State
  const [completed, setCompleted] = useState(false)
  const [results, setResults] = useState<{
    score: number
    total_questions: number
    percentage: number
    correct_count: number
  } | null>(null)

  useEffect(() => {
    if (!user || !lessonId) return

    // Verify role = student
    if (profile && profile.role !== 'student') {
      router.push('/teacher/dashboard')
      return
    }

    const fetchQuiz = async () => {
      try {
        setLoading(true)

        // 1. Fetch lesson title and validation fields
        const { data: lesson, error: lessonError } = await supabase
          .from('lessons')
          .select('title_en, title_ta, status, created_by')
          .eq('id', lessonId)
          .single()
        
        if (lessonError) throw lessonError

        // Verify published status
        if (lesson.status !== 'published') {
          setError("You don't have access to this quiz.")
          setLoading(false)
          return
        }

        // Verify assignment (only if created_by is NOT null, i.e. it is a teacher-assigned lesson)
        if (lesson.created_by !== null) {
          const { data: assignment, error: assignmentError } = await supabase
            .from('lesson_assignments')
            .select('id')
            .eq('lesson_id', lessonId)
            .eq('student_id', user.id)
            .maybeSingle()

          if (assignmentError || !assignment) {
            setError("You don't have access to this quiz.")
            setLoading(false)
            return
          }
        }

        setLessonTitle(lesson.title_ta || lesson.title_en)

        // 2. Fetch quiz questions (omitting correct_answer column for cheating prevention)
        const { data: qData, error: qError } = await supabase
          .from('quiz_questions')
          .select('id, question_en, question_ta, options, difficulty, question_order')
          .eq('lesson_id', lessonId)
          .order('question_order', { ascending: true })

        if (qError) throw qError
        setQuestions(qData || [])

      } catch (err: any) {
        console.error('Error fetching quiz:', err)
        setError(err.message || 'Error loading quiz.')
      } finally {
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [user, profile, lessonId, router])

  const handleSelectOption = (opt: string) => {
    setSelectedOption(opt)
  }

  const handleNext = () => {
    if (!selectedOption) return

    const currentQuestion = questions[currentIdx]
    const updatedAnswers = [
      ...answers.filter(a => a.question_id !== currentQuestion.id),
      { question_id: currentQuestion.id, selected_option: selectedOption }
    ]
    setAnswers(updatedAnswers)

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1)
      // If already answered before, prefill it, else null
      const nextQ = questions[currentIdx + 1]
      const existingAns = updatedAnswers.find(a => a.question_id === nextQ.id)
      setSelectedOption(existingAns ? existingAns.selected_option : null)
    } else {
      // Submit Quiz
      submitQuiz(updatedAnswers)
    }
  }

  const submitQuiz = async (finalAnswers: SubmittedAnswer[]) => {
    setSubmitting(true)
    setError(null)

    try {
      // Call secure database RPC
      const { data, error: submitError } = await supabase.rpc('submit_quiz_attempt', {
        p_lesson_id: lessonId,
        p_answers: finalAnswers
      })

      if (submitError) throw submitError

      setResults(data)
      setCompleted(true)
    } catch (err: any) {
      console.error('Error submitting quiz:', err)
      setError(err.message || 'Error submitting quiz results.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetake = () => {
    setCompleted(false)
    setResults(null)
    setCurrentIdx(0)
    setSelectedOption(null)
    setAnswers([])
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error || questions.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center max-w-lg mx-auto mt-12 shadow-sm">
        <HelpCircle className="mx-auto size-12 text-gray-300" />
        <h3 className="text-lg font-bold text-gray-900 mt-4">No Quiz Available</h3>
        <p className="text-gray-500 mt-2">{error || 'This lesson does not have any quiz questions configured.'}</p>
        <Link href={`/student/lessons/${lessonId}`} className="mt-6 inline-flex items-center justify-center rounded-2xl bg-green-500 text-white px-5 py-2.5 font-bold shadow-sm hover:bg-green-600 transition">
          Return to Lesson
        </Link>
      </div>
    )
  }

  const currentQuestion = questions[currentIdx]

  return (
    <div className="max-w-2xl mx-auto pb-12 space-y-6">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href={`/student/lessons/${lessonId}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900">
          <ArrowLeft className="size-4" />
          Back to Lesson (பாடம் திரும்புக)
        </Link>
        <span className="text-xs font-bold text-gray-400">
          Question {currentIdx + 1} of {questions.length}
        </span>
      </div>

      {!completed ? (
        /* Quiz Panel */
        <div className="bg-white rounded-4xl border border-gray-100 shadow-xl overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 w-full bg-gray-100">
            <div 
              className="h-full bg-yellow-500 transition-all duration-300" 
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div>
              <span className="text-xs font-bold bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Quiz Panel
              </span>
              <h2 className="text-base font-semibold text-gray-500 mt-2 line-clamp-1">
                Lesson: {lessonTitle}
              </h2>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-gray-900 font-tamil leading-snug">
                {currentQuestion.question_ta}
              </h3>
              {currentQuestion.question_en && (
                <p className="text-sm font-medium text-gray-500">
                  {currentQuestion.question_en}
                </p>
              )}
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, oIdx) => {
                const isSelected = selectedOption === opt
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center justify-between font-tamil font-bold ${
                      isSelected
                        ? 'border-yellow-500 bg-yellow-50/50 text-yellow-900 shadow-sm'
                        : 'border-gray-100 bg-gray-50/50 hover:bg-gray-50 text-gray-700 hover:border-gray-200'
                    }`}
                  >
                    <span>{opt}</span>
                    <span className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'border-yellow-500 bg-yellow-500 text-white'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <span className="size-2 rounded-full bg-white"></span>}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-gray-50 flex items-center justify-end">
              <button
                onClick={handleNext}
                disabled={!selectedOption || submitting}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-yellow-500 text-yellow-950 px-6 font-extrabold shadow-md hover:bg-yellow-600 disabled:opacity-50 transition-all w-full sm:w-auto"
              >
                {submitting ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    {currentIdx === questions.length - 1 ? 'Submit Quiz (முடி)' : 'Next Question'}
                    <ArrowRight className="size-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="bg-white rounded-4xl border border-gray-100 shadow-xl p-8 text-center space-y-6">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 shadow-md">
            <Award className="size-10" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 text-green-700 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="size-3.5" />
              Quiz Completed!
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Your Score: {results?.percentage}%
            </h2>
            <p className="text-gray-500 font-semibold font-tamil">
              உங்களின் மதிப்பெண்: {results?.correct_count} / {results?.total_questions}
            </p>
          </div>

          {/* Child friendly encouragement */}
          <div className="p-5 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-3xl border border-yellow-200/30 text-sm font-bold text-yellow-800">
            {results && results.percentage >= 70 ? (
              <>🎉 Amazing job! You earned a learning badge! (சிறந்த முயற்சி! வாழ்த்துகள்!) 🎉</>
            ) : results && results.percentage >= 40 ? (
              <>👍 Good effort! You are reading very well! (நல்ல முயற்சி! தொடருங்கள்!) 👍</>
            ) : (
              <>💪 Keep learning! Read the lesson again and try again. (முயற்சி திருவினையாக்கும்!) 💪</>
            )}
          </div>

          <div className="flex flex-wrap gap-3 justify-center pt-4">
            <button
              type="button"
              onClick={handleRetake}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-yellow-500 text-yellow-950 px-6 font-extrabold shadow-md hover:bg-yellow-600 transition-all"
            >
              Retake Quiz (மீண்டும் எழுது)
            </button>

            <Link
              href={`/student/lessons/${lessonId}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-green-200 text-green-600 px-6 font-extrabold hover:bg-green-50 transition-all"
            >
              <BookOpen className="size-5" />
              Read Lesson Again
            </Link>
            
            <Link
              href="/student/dashboard"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-green-500 text-white px-6 font-extrabold shadow-md hover:bg-green-600 transition-all"
            >
              Go to Dashboard (முகப்பு)
              <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
