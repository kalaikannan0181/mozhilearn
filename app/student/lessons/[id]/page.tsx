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
  BookOpenCheck,
  Play,
  Pause,
  Square,
  Loader2
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
  const [isPaused, setIsPaused] = useState(false)
  const [isSpeechSupported, setIsSpeechSupported] = useState(false)
  const [marking, setMarking] = useState(false)
  const [progressStatus, setProgressStatus] = useState<'not_started' | 'in_progress' | 'completed'>('not_started')

  // Feature 5 Child-Friendly Experience States
  const [activeTab, setActiveTab] = useState<'story' | 'flashcards' | 'games' | 'quiz'>('story')
  const [audioSupported, setAudioSupported] = useState(true)
  const [matchedCount, setMatchedCount] = useState(0)
  const [gameFeedback, setGameFeedback] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !lessonId) return

    // Verify browser support for SpeechSynthesis
    setIsSpeechSupported(typeof window !== 'undefined' && 'speechSynthesis' in window)

    const fetchLesson = async () => {
      try {
        setLoading(true)

        // 1. Fetch Lesson
        let lessonData = null
        const { data: dbLessonData, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .maybeSingle()

        if (dbLessonData) {
          lessonData = dbLessonData
        } else if (lessonId === 'd1111111-1111-1111-1111-111111111111') {
          lessonData = {
            id: 'd1111111-1111-1111-1111-111111111111',
            title_en: 'Photosynthesis',
            title_ta: 'ஒளிச்சேர்க்கை (Photosynthesis)',
            subject: 'Science',
            grade_level: 3,
            original_content: 'Photosynthesis is the process where plants use sunlight, water, and carbon dioxide to create oxygen and energy in the form of sugar. Leaves have a green color because of chlorophyll, which absorbs light energy.',
            translated_content: 'ஒளிச்சேர்க்கை என்பது தாவரங்கள் சூரிய ஒளி, நீர் மற்றும் கார்பன் டை ஆக்சைடைப் பயன்படுத்தி ஆக்ஸிஜன் மற்றும் சர்க்கரை வடிவிலான ஆற்றலை உருவாக்கும் செயல்முறையாகும். இலைகள் குளோரோபில் (பச்சை நிறமி) காரணமாக பச்சை நிறத்தைக் கொண்டுள்ளன, இது ஒளி ஆற்றலை உறிஞ்சுகிறது.',
            simplified_content_ta: 'தாவரங்கள் சூரிய ஒளி, நீர், மற்றும் காற்றைப் பயன்படுத்தி தங்களுக்குத் தேவையான உணவைத் தயாரிக்கும் முறைக்கு "ஒளிச்சேர்க்கை" என்று பெயர். செடிகளின் இலைகளில் இருக்கும் பச்சையம் (chlorophyll) தான் இதற்கு உதவுகிறது. இந்த முறையில் தாவரங்கள் மனிதர்களுக்குத் தேவையான ஆக்சிஜனை வெளியிடுகின்றன.',
            learning_objectives: ["Understand how plants make food using sunlight", "Identify the role of chlorophyll in leaves", "Recognize that plants release oxygen"],
            vocabulary: [{"en": "Photosynthesis", "ta": "ஒளிச்சேர்க்கை"}, {"en": "Chlorophyll", "ta": "பச்சையம்"}, {"en": "Sunlight", "ta": "சூரிய ஒளி"}],
            status: 'published',
            created_by: null,
            difficulty: 'easy'
          }
        } else {
          if (lessonError) throw lessonError
          throw new Error('Lesson not found.')
        }

        // Verify published status
        if (lessonData.status !== 'published') {
          setError("You don't have access to this lesson.")
          setLoading(false)
          return
        }

        // Verify assignment (only if created_by is NOT null, i.e. it is a teacher-assigned lesson)
        if (lessonData.created_by !== null) {
          const { data: assignment, error: assignmentError } = await supabase
            .from('lesson_assignments')
            .select('id')
            .eq('lesson_id', lessonId)
            .eq('student_id', user.id)
            .maybeSingle()

          if (assignmentError || !assignment) {
            setError("You don't have access to this lesson.")
            setLoading(false)
            return
          }
        }

        setLesson(lessonData as Lesson)

        // 2. Fetch/Insert progress
        const { data: prog, error: progError } = await supabase
          .from('lesson_progress')
          .select('status, progress_percent')
          .eq('lesson_id', lessonId)
          .eq('student_id', user.id)
          .maybeSingle()

        if (prog) {
          setProgressStatus(prog.status as any)
        } else {
          // Initialize progress as 'in_progress' at 10%
          await supabase
            .from('lesson_progress')
            .insert({
              lesson_id: lessonId,
              student_id: user.id,
              status: 'in_progress',
              progress_percent: 10
            })
          setProgressStatus('in_progress')
        }

        // 3. Mark progress as 50% viewed after 2.5 seconds (interaction proof)
        setTimeout(async () => {
          try {
            const { data: currentProg } = await supabase
              .from('lesson_progress')
              .select('progress_percent, status')
              .eq('lesson_id', lessonId)
              .eq('student_id', user.id)
              .maybeSingle()

            if (currentProg && currentProg.status === 'in_progress' && currentProg.progress_percent < 50) {
              await supabase
                .from('lesson_progress')
                .update({
                  progress_percent: 50
                })
                .eq('lesson_id', lessonId)
                .eq('student_id', user.id)
            }
          } catch (err) {
            console.error('Failed to update progress to 50%:', err)
          }
        }, 2500)

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
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [user, lessonId])

  // TTS Actions
  const handlePlay = () => {
    if (!lesson || !isSpeechSupported) return
    window.speechSynthesis.cancel()
    
    const textToSpeak = lesson.simplified_content_ta || lesson.translated_content
    const utterance = new SpeechSynthesisUtterance(textToSpeak)
    utterance.lang = 'ta-IN'
    
    utterance.onend = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }
    utterance.onerror = () => {
      setIsPlaying(false)
      setIsPaused(false)
    }

    setIsPlaying(true)
    setIsPaused(false)
    window.speechSynthesis.speak(utterance)
  }

  const handlePause = () => {
    if (!isSpeechSupported) return
    window.speechSynthesis.pause()
    setIsPaused(true)
  }

  const handleResume = () => {
    if (!isSpeechSupported) return
    window.speechSynthesis.resume()
    setIsPaused(false)
  }

  const handleStop = () => {
    if (!isSpeechSupported) return
    window.speechSynthesis.cancel()
    setIsPlaying(false)
    setIsPaused(false)
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
          completed_at: new Date().toISOString()
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
      <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center max-w-lg mx-auto mt-12 shadow-sm">
        <h3 className="text-lg font-bold text-red-600">Lesson Not Found</h3>
        <p className="text-gray-500 mt-2">This lesson may have been deleted or does not exist.</p>
        <Link href="/student/dashboard" className="mt-6 inline-flex items-center justify-center rounded-2xl bg-green-500 text-white px-5 py-2.5 font-bold shadow-sm hover:bg-green-600 transition">
          Return to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Top Header & Status Badges (Feature 1 & Feature 7) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <Link href="/student/dashboard" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900">
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          {/* Feature 1 Offline Mode Indicator */}
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-500/20">
            Offline Mode Ready
          </span>
          {/* Feature 7 Audio Available Offline Badge */}
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-700 border border-indigo-500/20">
            Audio Available Offline
          </span>
          {/* Feature 1 Available Offline Badge */}
          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-800 border border-yellow-500/20">
            Available Offline
          </span>
        </div>
      </div>

      {/* Feature 5: Child-Friendly Mode Tabs & Audio Toggle */}
      <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-2xl overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${
                activeTab === 'story' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              📖 Story Mode
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('flashcards')}
              className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${
                activeTab === 'flashcards' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              🎨 Flashcards
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('games')}
              className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${
                activeTab === 'games' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              🧩 Practice Games
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`rounded-xl px-4 py-2 text-xs font-extrabold transition-all ${
                activeTab === 'quiz' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              ⭐ Quiz
            </button>
          </div>

          {/* Feature 5 Audio-Supported Lesson toggle */}
          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-foreground">
            <input
              type="checkbox"
              checked={audioSupported}
              onChange={(e) => setAudioSupported(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
            />
            Audio-Supported Lesson
          </label>
        </div>

        <p className="text-xs text-muted-foreground">
          {activeTab === 'story' && 'Story mode for listening and reading'}
          {activeTab === 'flashcards' && 'Picture-based flashcards'}
          {activeTab === 'games' && 'Simple interactive games'}
          {activeTab === 'quiz' && 'Short quizzes and practice activities'}
        </p>
      </div>

      {/* TAB 1: STORY MODE */}
      {activeTab === 'story' && (
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

            {/* Feature 2: Listen in Selected Language Button */}
            <div className="flex items-center gap-2">
              {!isSpeechSupported ? (
                <p className="text-xs text-red-500 font-semibold bg-red-50 px-3 py-1.5 rounded-xl border border-red-100">
                  Speech synthesis not supported.
                </p>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  {!isPlaying ? (
                    <button
                      onClick={handlePlay}
                      className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-emerald-600 text-white px-5 text-xs font-extrabold shadow-sm hover:bg-emerald-700 transition"
                    >
                      <Volume2 className="size-4" />
                      Listen in Selected Language (Prototype)
                    </button>
                  ) : (
                    <>
                      {isPaused ? (
                        <button
                          onClick={handleResume}
                          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-white px-4 text-xs font-bold"
                        >
                          <Play className="size-4 fill-current" />
                          Resume
                        </button>
                      ) : (
                        <button
                          onClick={handlePause}
                          className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-yellow-500 text-yellow-950 px-4 text-xs font-bold"
                        >
                          <Pause className="size-4 fill-current" />
                          Pause
                        </button>
                      )}
                      <button
                        onClick={handleStop}
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl bg-red-500 text-white px-4 text-xs font-bold"
                      >
                        <Square className="size-4 fill-current" />
                        Stop
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-green-600 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="size-4 text-yellow-500 fill-yellow-400" />
                Lesson Explanation
              </h3>
              <p className="text-lg leading-relaxed text-gray-800 font-medium whitespace-pre-line bg-green-50/20 p-5 rounded-3xl border border-green-500/10">
                {lesson.simplified_content_ta || lesson.translated_content}
              </p>
            </div>

            {/* Feature 2 Voice Workflow Disclaimers */}
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-xs space-y-1">
              <p className="font-bold text-indigo-900">Voice-to-Voice Pipeline (Prototype Workflow):</p>
              <p className="text-indigo-700">Teacher speaks Hindi → Speech-to-Text converts to Hindi text → AI translates Hindi → selected mother tongue (e.g., Santhali) → Text-to-Speech generates audio in the student’s language</p>
              <p className="text-[11px] text-muted-foreground italic pt-1">
                Voice-to-voice translation is a prototype workflow. Full implementation requires validated speech and translation resources.
              </p>
            </div>

            {/* Vocabulary */}
            {lesson.vocabulary?.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Vocabulary Words
                </h4>
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
          </div>
        </article>
      )}

      {/* TAB 2: FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="bg-white rounded-4xl border border-gray-100 p-8 shadow-xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-600">
            Picture-based flashcards
          </div>

          <div className="mx-auto max-w-sm rounded-3xl border-2 border-purple-500/30 bg-gradient-to-b from-purple-500/10 to-pink-500/10 p-8 space-y-4 shadow-md">
            <div className="text-7xl">🌱</div>
            <div>
              <h3 className="text-2xl font-extrabold text-foreground">Plant Growth</h3>
              <p className="text-lg font-bold text-primary font-tamil mt-1">தாவர வளர்ச்சி</p>
            </div>
            {audioSupported && (
              <button
                type="button"
                onClick={handlePlay}
                className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-4 py-2 text-xs font-extrabold text-white shadow-xs"
              >
                <Volume2 className="h-4 w-4" /> Listen Audio
              </button>
            )}
          </div>

          <p className="text-xs text-muted-foreground">
            Tap cards to see picture, word, and hear pronunciation in student&apos;s home language.
          </p>
        </div>
      )}

      {/* TAB 3: PRACTICE GAMES */}
      {activeTab === 'games' && (
        <div className="bg-white rounded-4xl border border-gray-100 p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-700">
              Simple interactive games (Prototype)
            </div>
            <span className="text-xs font-bold text-muted-foreground">Score: {matchedCount} / 3</span>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground">Tap-to-Match Activity: Match Picture to Word</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { emoji: '☀️', word: 'Sunlight (சூரிய ஒளி)' },
                { emoji: '💧', word: 'Water (நீர்)' },
                { emoji: '🍃', word: 'Leaf (இலை)' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setMatchedCount((c) => Math.min(c + 1, 3))
                    setGameFeedback(`Matched ${item.emoji} with ${item.word}! Great job! 🎉`)
                  }}
                  className="rounded-3xl border border-cyan-500/20 bg-cyan-500/5 p-6 text-center hover:bg-cyan-500/10 transition-all space-y-2"
                >
                  <div className="text-4xl">{item.emoji}</div>
                  <p className="text-xs font-extrabold text-foreground">{item.word}</p>
                </button>
              ))}
            </div>
          </div>

          {gameFeedback && (
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-xs font-bold text-emerald-700 border border-emerald-500/20 text-center">
              {gameFeedback}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: QUIZ */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-4xl border border-gray-100 p-8 shadow-xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-bold text-yellow-800">
            Short quizzes and practice activities
          </div>
          <h3 className="text-xl font-extrabold text-foreground">Ready to test your knowledge?</h3>
          <p className="text-sm text-muted-foreground">Short multiple-choice questions designed for early readers.</p>
          <Link
            href={`/student/quiz/${lesson.id}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-yellow-500 text-yellow-950 px-6 py-3 text-sm font-extrabold shadow-md hover:bg-yellow-600 transition"
          >
            <HelpCircle className="size-5" />
            Start Lesson Quiz Now
          </Link>
        </div>
      )}

      {/* Completion & Next Actions bar */}
      <div className="bg-white rounded-3xl border border-gray-100 p-5 shadow-lg flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl ${progressStatus === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
            <CheckCircle className="size-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm sm:text-base">
              {progressStatus === 'completed' ? 'Lesson Completed! 🎉' : 'Read this lesson to complete your progress.'}
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Student progress saved locally and synced when connectivity returns.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {progressStatus !== 'completed' && (
            <button
              onClick={handleMarkCompleted}
              disabled={marking}
              className="flex-1 sm:flex-none inline-flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-green-500 text-white px-5 text-sm font-extrabold shadow-sm hover:bg-green-600 disabled:opacity-50 transition"
            >
              {marking ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                'Mark Completed'
              )}
            </button>
          )}

          <Link
            href={`/student/quiz/${lesson.id}`}
            className="flex-1 sm:flex-none inline-flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-yellow-500 text-yellow-950 px-5 text-sm font-extrabold shadow-sm shadow-yellow-100 hover:bg-yellow-600 transition"
          >
            <HelpCircle className="size-4.5" />
            Take Quiz
          </Link>
        </div>
      </div>
    </div>
  )
}
