'use client'

import React, { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Plus, 
  Trash, 
  HelpCircle, 
  Save, 
  Loader2, 
  Check, 
  AlertTriangle 
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'

interface QuizQuestion {
  id?: string
  question_en: string
  question_ta: string
  options: string[]
  correct_answer: string
  explanation_ta: string
  difficulty: 'easy' | 'medium' | 'hard'
  question_order: number
}

interface Params {
  id: string
}

export default function TeacherQuizEditor({ params: paramsPromise }: { params: Promise<Params> }) {
  const params = use(paramsPromise)
  const router = useRouter()
  const { user, profile } = useAuth()
  const lessonId = params.id

  // States
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [lessonTitle, setLessonTitle] = useState('')

  // Questions List
  const [questions, setQuestions] = useState<QuizQuestion[]>([])

  useEffect(() => {
    if (!user || !lessonId) return

    // Role protection check
    if (profile && profile.role !== 'teacher') {
      router.push('/student/dashboard')
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)

        // 1. Fetch Lesson to check ownership
        const { data: lesson, error: lessonError } = await supabase
          .from('lessons')
          .select('title_en, title_ta, created_by')
          .eq('id', lessonId)
          .single()

        if (lessonError) throw lessonError

        if (lesson.created_by !== user.id) {
          setError('Access denied. You do not have permission to manage quizzes for this lesson.')
          setLoading(false)
          return
        }

        setLessonTitle(lesson.title_ta || lesson.title_en)

        // 2. Fetch Quiz Questions
        const { data: quizQuestions } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('question_order', { ascending: true })

        setQuestions(quizQuestions || [])

      } catch (err: any) {
        console.error('Error fetching quiz details:', err)
        setError(err.message || 'Error loading quiz details.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, profile, lessonId, router])

  // Question handlers
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_en: '',
        question_ta: '',
        options: ['', '', '', ''],
        correct_answer: '',
        explanation_ta: '',
        difficulty: 'easy',
        question_order: questions.length + 1
      }
    ])
  }

  const handleRemoveQuestion = (index: number) => {
    const next = [...questions]
    next.splice(index, 1)
    const reordered = next.map((q, idx) => ({ ...q, question_order: idx + 1 }))
    setQuestions(reordered)
  }

  const handleQuestionChange = (index: number, key: keyof QuizQuestion, val: any) => {
    const next = [...questions]
    next[index] = { ...next[index], [key]: val }
    setQuestions(next)
  }

  const handleOptionChange = (qIndex: number, oIndex: number, val: string) => {
    const next = [...questions]
    const updatedOptions = [...next[qIndex].options]
    updatedOptions[oIndex] = val
    next[qIndex] = { ...next[qIndex], options: updatedOptions }
    setQuestions(next)
  }

  const handleSaveQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError(null)
    setSuccessMsg(null)

    // Form validations
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const num = i + 1
      if (!q.question_ta.trim()) {
        return setError(`Question #${num} requires a Tamil question text.`)
      }
      if (q.options.some(opt => !opt.trim())) {
        return setError(`Question #${num} requires all four option fields to be filled out.`)
      }
      if (!q.correct_answer) {
        return setError(`Question #${num} requires a correct answer selection.`)
      }
      if (!q.options.includes(q.correct_answer)) {
        return setError(`Question #${num}: Correct answer must match one of the active options.`)
      }
    }

    setSaving(true)

    try {
      // Delete old quiz questions
      const { error: deleteError } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('lesson_id', lessonId)

      if (deleteError) throw deleteError

      // Insert new questions
      const formattedQuestions = questions.map(q => ({
        lesson_id: lessonId,
        question_en: q.question_en,
        question_ta: q.question_ta,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation_ta: q.explanation_ta,
        difficulty: q.difficulty,
        question_order: q.question_order
      }))

      if (formattedQuestions.length > 0) {
        const { error: quizError } = await supabase
          .from('quiz_questions')
          .insert(formattedQuestions)

        if (quizError) throw quizError
      }

      setSuccessMsg('Quiz questions updated successfully!')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      setError(err.message || 'Error updating quiz questions.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/teacher/lessons/${lessonId}`} className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition">
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Lesson Quiz</h1>
          <p className="text-gray-500 mt-1">Lesson: {lessonTitle}</p>
        </div>
      </div>

      {successMsg && (
        <div className="rounded-2xl bg-green-50 p-4 text-green-700 border border-green-200 flex items-center gap-2">
          <Check className="size-5 text-green-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-700 border border-red-200 flex items-start gap-2">
          <AlertTriangle className="size-5 text-red-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSaveQuiz} className="space-y-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="size-5 text-gray-400" />
            Quiz Question Creator
          </h3>

          {questions.length === 0 ? (
            <div className="text-center p-8 border-2 border-dashed border-gray-100 rounded-3xl">
              <p className="text-gray-500 text-sm">No quiz questions added yet.</p>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-primary hover:underline"
              >
                + Add First Question
              </button>
            </div>
          ) : (
            <div className="space-y-8 divide-y divide-gray-100">
              {questions.map((q, qIndex) => (
                <div key={qIndex} className="space-y-4 pt-6 first:pt-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-800 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                      Question #{qIndex + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-red-500 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-xl transition"
                    >
                      <Trash className="size-3.5" />
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase">Question in Tamil</label>
                      <input
                        type="text"
                        required
                        value={q.question_ta}
                        onChange={(e) => handleQuestionChange(qIndex, 'question_ta', e.target.value)}
                        placeholder="தாவரங்கள் வளர என்ன தேவை?"
                        className="mt-1 block w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-tamil"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase">Question in English (Optional)</label>
                      <input
                        type="text"
                        value={q.question_en}
                        onChange={(e) => handleQuestionChange(qIndex, 'question_en', e.target.value)}
                        placeholder="What do plants need to grow?"
                        className="mt-1 block w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {/* Options Input */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {q.options.map((opt, oIndex) => (
                      <div key={oIndex}>
                        <label className="block text-xs font-semibold text-gray-400">Option {oIndex + 1}</label>
                        <input
                          type="text"
                          required
                          value={opt}
                          onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1} text`}
                          className="mt-1 block w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none font-tamil"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Correct Option & Details */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase">Correct Option</label>
                      <select
                        value={q.correct_answer}
                        onChange={(e) => handleQuestionChange(qIndex, 'correct_answer', e.target.value)}
                        required
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none"
                      >
                        <option value="">Select correct option</option>
                        {q.options.filter(Boolean).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase">Difficulty</label>
                      <select
                        value={q.difficulty}
                        onChange={(e) => handleQuestionChange(qIndex, 'difficulty', e.target.value)}
                        required
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none"
                      >
                        <option value="easy">Easy (எளிது)</option>
                        <option value="medium">Medium (சராசரி)</option>
                        <option value="hard">Hard (கடினம்)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase">Explanation (Tamil)</label>
                      <input
                        type="text"
                        value={q.explanation_ta}
                        onChange={(e) => handleQuestionChange(qIndex, 'explanation_ta', e.target.value)}
                        placeholder="சூரிய ஒளி தாவரங்களுக்கு உணவு தயாரிக்க உதவுகிறது."
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs focus:outline-none font-tamil"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {questions.length > 0 && (
            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 font-semibold hover:border-primary hover:text-primary transition text-sm"
            >
              <Plus className="size-4" />
              Add Question
            </button>
          )}
        </div>

        {/* Submit Bar */}
        <div className="flex justify-end gap-3 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
          <Link
            href={`/teacher/lessons/${lessonId}`}
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border px-5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || questions.length === 0}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg disabled:opacity-50 transition"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Save className="size-4" />
                Save Quiz questions
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
