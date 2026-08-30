'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX,
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle,
  HelpCircle,
  Award,
  Sparkles,
  BookOpenCheck
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'

interface Lesson {
  id: string
  title_en: string
  title_ta: string
  subject: string
  grade_level: number
  original_content: string
  translated_content: string
  simplified_content_ta: string
  learning_objectives: string[]
  vocabulary: { en: string; ta: string }[]
}

interface Params {
  id: string
}

export default function StudentLessonViewer({ params: paramsPromise }: { params: Promise<Params> }) {
  const params = use(paramsPromise)
  const router = useRouter()
  const { user } = useAuth()
  const lessonId = params.id

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEnglish, setShowEnglish] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [marking, setMarking] = useState(false)
  const [progressStatus, setProgressStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started')

  useEffect(() => {
    if (!user || !lessonId) return

    const fetchLesson = async () => {
      try {
        setLoading(true)

        // 1. Fetch Lesson
        const { data: lessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .single()

        if (lessonError) throw lessonError
        setLesson(lessonData as Lesson)

        // 2. Fetch/Insert progress
        const { data: prog, error: progError } = await supabase
          .from('lesson_progress')
          .select('status')
          .eq('lesson_id', lessonId)
          .eq('student_id', user.id)
          .maybeSingle()

        if (prog) {
          setProgressStatus(prog.status as any)
        } else {
          // Initialize progress as 'in_progress' once they open the lesson
          await supabase
            .from('lesson_progress')
            .insert({
              lesson_id: lessonId,
              student_id: user.id,
              status: 'in_progress',
              progress_percent: 50,
              last_accessed_at: new Date().toISOString()
            })
          setProgressStatus('in_progress')
        }

      } catch (err: any) {
        console.error('Error fetching lesson:', err)
        setError(err.message || 'Error loading lesson.')
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()

    // Stop speaking when leaving page
    return () => {
      window.speechSynthesis.cancel()
    }
  }, [user, lessonId])

  // TTS Narration
  const handleToggleNarration = () => {
    if (!lesson) return

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    } else {
      window.speechSynthesis.cancel()
      
      // Use simplified content if available, fallback to translation
      const textToSpeak = lesson.simplified_content_ta || lesson.translated_content
      const utterance = new SpeechSynthesisUtterance(textToSpeak)
      utterance.lang = 'ta-IN'
      
      utterance.onend = () => {
        setIsPlaying(false)
      }
      utterance.onerror = () => {
        setIsPlaying(false)
      }

      setIsPlaying(true)
      window.speechSynthesis.speak(utterance)
    }
  }

  // Mark lesson as completed
  const handleMarkCompleted = async () => {
    if (!user || !lesson) return
    setMarking(true)

    try {
      const { error } = await supabase
        .from('lesson_progress')
        .upsert({
          lesson_id: lessonId,
          student_id: user.id,
          status: 'completed',
          progress_percent: 100,
          completed_at: new Date().toISOString(),
          last_accessed_at: new Date().toISOString()
        }, { onConflict: 'lesson_id,student_id' })

      if (!error) {
        setProgressStatus('completed')
      }
    } catch (err) {
      console.error('Error marking completed:', err)
    } finally {
      setMarking(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center max-w-lg mx-auto mt-12">
        <h3 className="text-lg font-bold text-red-600">Error Loading Lesson</h3>
        <p className="text-gray-500 mt-2">{error || 'Lesson not found.'}</p>
        <Link href="/student/dashboard" className="mt-4 inline-flex items-center justify-center rounded-2xl bg-green-500 text-white px-5 py-2.5 font-bold shadow-sm">
          Return to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-12">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link href="/student/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900">
          <ArrowLeft className="size-4" />
          Dashboard (முகப்பு)
        </Link>
        <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded-full uppercase tracking-wider">
          {lesson.subject}
        </span>
      </div>

      {/* Main Story Book Card */}
      <article className="bg-white rounded-4xl border border-gray-100 shadow-xl overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100/50 px-6 py-8 sm:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl leading-tight font-tamil">
              {lesson.title_ta || lesson.title_en}
            </h1>
            <p className="text-sm font-semibold text-green-600 mt-1 uppercase tracking-wider">
              Grade {lesson.grade_level} Lesson
            </p>
          </div>
          <button
            onClick={handleToggleNarration}
            className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-6 font-extrabold shadow-sm transition-all shrink-0 ${
              isPlaying
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-green-500 text-white hover:bg-green-600 shadow-green-100'
            }`}
          >
            {isPlaying ? (
              <>
                <VolumeX className="size-5" />
                Stop Listening (நிறுத்து)
              </>
            ) : (
              <>
                <Volume2 className="size-5" />
                Listen Lesson (ஒலி வடிவில் கேள்)
              </>
            )}
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Simplified Tamil Text */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-green-600 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="size-4.5 text-yellow-500 fill-yellow-400" />
              Easy Lesson (பாட விளக்கம்)
            </h3>
            <p className="text-lg leading-relaxed text-gray-800 font-medium font-tamil whitespace-pre-line bg-green-50/20 p-5 rounded-3xl border border-green-500/10">
              {lesson.simplified_content_ta || lesson.translated_content}
            </p>
          </div>

          {/* Learning Objectives */}
          {lesson.learning_objectives?.length > 0 && (
            <div className="bg-yellow-50/20 border border-yellow-500/10 rounded-3xl p-6 space-y-3">
              <h4 className="font-extrabold text-gray-900 flex items-center gap-2">
                <BookOpenCheck className="size-5 text-yellow-600" />
                What we will learn (நோக்கங்கள்):
              </h4>
              <ul className="list-disc pl-5 text-sm font-semibold text-gray-600 space-y-1.5">
                {lesson.learning_objectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Vocabulary Section */}
          {lesson.vocabulary?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                New Words (அறிமுகச் சொற்கள்)
              </h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {lesson.vocabulary.map((vocab, idx) => (
                  <div key={idx} className="bg-gray-50 border border-gray-100 rounded-2xl p-3.5 text-center">
                    <p className="font-bold text-gray-800 text-sm">{vocab.en}</p>
                    <p className="font-tamil font-bold text-green-600 text-sm mt-1">{vocab.ta}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Collapsible English Original */}
          <div className="border-t border-gray-100 pt-6">
            <button
              onClick={() => setShowEnglish(!showEnglish)}
              className="w-full flex items-center justify-between py-2 text-sm font-bold text-gray-500 hover:text-gray-900"
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="size-4" />
                Show English Original (ஆங்கில வடிவம்)
              </span>
              {showEnglish ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            
            {showEnglish && (
              <div className="mt-4 p-5 bg-gray-50/50 border border-gray-100 rounded-3xl text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                {lesson.original_content}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Completion & Next Actions bar */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-lg flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${progressStatus === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            <CheckCircle className="size-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm sm:text-base">
              {progressStatus === 'completed' ? 'You completed this lesson!' : 'Read this lesson to take the quiz.'}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              {progressStatus === 'completed' ? 'வெற்றிகரமாக முடித்துவிட்டீர்கள்!' : 'பாடத்தைப் படித்து முடித்து தேர்வை எழுதுங்கள்.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {progressStatus !== 'completed' && (
            <button
              onClick={handleMarkCompleted}
              disabled={marking}
              className="flex-1 sm:flex-none inline-flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-green-500 text-white px-5 text-sm font-extrabold shadow-sm hover:bg-green-600 disabled:opacity-50"
            >
              {marking ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'I Finished Reading (முடித்துவிட்டேன்)'
              )}
            </button>
          )}

          <Link
            href={`/student/quiz/${lesson.id}`}
            className="flex-1 sm:flex-none inline-flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-yellow-500 text-yellow-950 px-5 text-sm font-extrabold shadow-sm shadow-yellow-100 hover:bg-yellow-600"
          >
            <HelpCircle className="size-4.5" />
            Start Quiz (தேர்வு எழுது)
          </Link>
        </div>
      </div>
    </div>
  )
}
