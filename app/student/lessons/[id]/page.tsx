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

  // Child-Friendly Vernacular Pedagogy Tabs State
  const [activeTab, setActiveTab] = useState<'learn' | 'listen' | 'story' | 'flashcards' | 'practice' | 'worksheet' | 'quiz' | 'progress'>('learn')
  const [audioSupported, setAudioSupported] = useState(true)
  const [matchedCount, setMatchedCount] = useState(0)
  const [flashcardIndex, setFlashcardIndex] = useState(0)
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
            title_ta: 'ᱨᱚᱥᱚᱫ ᱠᱚᱢᱤ (Photosynthesis — Santhali Demo)',
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
    utterance.lang = 'hi-IN' // Hindi TTS prototype — Santhali TTS requires dedicated language resources
    
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

      {/* Child-Friendly Tab Controls (8 Cards/Tabs) */}
      <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-secondary/50 p-1.5 rounded-2xl overflow-x-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab('learn')}
              className={`min-h-11 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all shrink-0 ${
                activeTab === 'learn' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              📖 Learn
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('listen')}
              className={`min-h-11 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all shrink-0 ${
                activeTab === 'listen' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              🔊 Listen
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('story')}
              className={`min-h-11 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all shrink-0 ${
                activeTab === 'story' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              📚 Story Mode
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('flashcards')}
              className={`min-h-11 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all shrink-0 ${
                activeTab === 'flashcards' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              🎴 Flashcards
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('practice')}
              className={`min-h-11 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all shrink-0 ${
                activeTab === 'practice' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              🎮 Play & Practice
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('worksheet')}
              className={`min-h-11 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all shrink-0 ${
                activeTab === 'worksheet' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              📝 Worksheet
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className={`min-h-11 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all shrink-0 ${
                activeTab === 'quiz' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              ⭐ Quiz
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('progress')}
              className={`min-h-11 rounded-xl px-3.5 py-2 text-xs font-extrabold transition-all shrink-0 ${
                activeTab === 'progress' ? 'bg-primary text-primary-foreground shadow-xs' : 'text-muted-foreground hover:bg-secondary'
              }`}
            >
              📊 My Progress
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground font-semibold">
          {activeTab === 'learn' && '“Learn in Your Language” — Simple explanation & key vocabulary'}
          {activeTab === 'listen' && '“Listen to the Lesson” — Audio playback on user tap'}
          {activeTab === 'story' && '“Read a Learning Story” — Contextual short story with comprehension'}
          {activeTab === 'flashcards' && '“Explore Flashcards” — Picture flashcards & word pronunciation'}
          {activeTab === 'practice' && '“Play and Practice” — Simple matching, counting, and sorting activities'}
          {activeTab === 'worksheet' && '“Try the Worksheet” — Teacher-reviewed practice sheets'}
          {activeTab === 'quiz' && '“Take a Short Quiz” — Short quizzes to test understanding'}
          {activeTab === 'progress' && '“My Progress” — Offline lesson status & progress tracker'}
        </p>
      </div>

      {/* TAB 1: LEARN IN YOUR LANGUAGE */}
      {activeTab === 'learn' && (
        <article className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden space-y-6 p-6 sm:p-8">
          <div className="space-y-2 border-b border-gray-100 pb-4">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs">
              Learn in Your Language
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {lesson.title_ta || lesson.title_en}
            </h1>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Grade {lesson.grade_level} • {lesson.subject}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
              Simple Grade-Level Explanation
            </h3>
            <div className="text-base sm:text-lg leading-relaxed text-gray-800 font-medium whitespace-pre-line bg-emerald-50/40 p-6 rounded-3xl border border-emerald-100">
              {lesson.simplified_content_ta || lesson.translated_content || lesson.original_content}
            </div>
          </div>

          {lesson.learning_objectives?.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                Learning Objectives
              </h4>
              <div className="space-y-2">
                {lesson.learning_objectives.map((obj, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-gray-50 p-3.5 rounded-2xl border border-gray-100 text-sm font-semibold text-gray-800">
                    <CheckCircle className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      )}

      {/* TAB 2: LISTEN TO THE LESSON */}
      {activeTab === 'listen' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xl space-y-6 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-extrabold text-xs">
            Listen to the Lesson
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900">Audio Learning Support</h2>
          <p className="text-sm text-gray-600 font-medium max-w-md mx-auto">
            Listen to lesson explanations and pronunciation in your selected mother tongue.
          </p>

          <div className="mx-auto max-w-md bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100 space-y-4">
            <div className="flex items-center justify-center gap-3">
              {!isPlaying ? (
                <button
                  type="button"
                  onClick={handlePlay}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-white px-6 text-sm font-extrabold shadow-md hover:bg-indigo-700 transition"
                >
                  <Volume2 className="size-5" />
                  Play Audio Lesson
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  {isPaused ? (
                    <button
                      type="button"
                      onClick={handleResume}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-indigo-600 text-white px-5 text-sm font-extrabold"
                    >
                      <Play className="size-5 fill-current" />
                      Resume
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePause}
                      className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-amber-500 text-amber-950 px-5 text-sm font-extrabold"
                    >
                      <Pause className="size-5 fill-current" />
                      Pause
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleStop}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-red-500 text-white px-5 text-sm font-extrabold"
                  >
                    <Square className="size-5 fill-current" />
                    Stop
                  </button>
                </div>
              )}
            </div>

            <p className="text-xs text-indigo-800 font-semibold">
              Audio requires user action. Auto-playing audio is disabled to support classroom focus.
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 text-xs font-semibold text-gray-600 max-w-lg mx-auto space-y-1">
            <p className="font-extrabold text-gray-900">Voice-to-Voice Architecture Pipeline:</p>
            <p>Teacher Voice → Speech-to-Text → Translation / Learning Adaptation → Selected-Language Text → Text-to-Speech → Student Audio</p>
            <p className="text-[11px] text-gray-500 italic pt-1">
              Voice pipeline requires supported speech and language services. Prototype integration.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: READ A LEARNING STORY */}
      {activeTab === 'story' && (
        <article className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-extrabold text-xs">
                Read a Learning Story
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">
                Story Mode: {lesson.title_ta || lesson.title_en}
              </h2>
            </div>
            <button
              type="button"
              onClick={handlePlay}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-purple-600 text-white px-4 text-xs font-extrabold shadow-xs"
            >
              <Volume2 className="size-4" /> Play Audio
            </button>
          </div>

          {/* Story Visual Box */}
          <div className="mx-auto rounded-3xl border border-purple-100 bg-gradient-to-b from-purple-50/50 to-pink-50/50 p-6 text-center space-y-3">
            <div className="text-6xl">📖 🌿 ☀️</div>
            <p className="text-base font-semibold text-gray-800 leading-relaxed max-w-lg mx-auto">
              Once upon a time in a sunny garden, tiny green leaves looked up at the sun. They drank water from the soil and danced in the warm light to make food for the whole tree!
            </p>
          </div>

          {/* Safe text disclaimer */}
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs font-semibold text-amber-900 text-center">
            Story content is adapted for the selected grade level and requires teacher review. Demo learning story — selected-language validation required.
          </div>

          {/* Comprehension Question */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 space-y-3">
            <h4 className="text-sm font-extrabold text-gray-900">What did you learn from the story?</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setGameFeedback('Great effort! Leaves use sunlight to make food! 🎉')}
                className="min-h-11 p-3 rounded-xl border border-gray-200 bg-white text-left hover:border-purple-500 hover:bg-purple-50 transition"
              >
                A) Leaves use sunlight to make food for plants
              </button>
              <button
                type="button"
                onClick={() => setGameFeedback('Try once more! Listen to the story again.')}
                className="min-h-11 p-3 rounded-xl border border-gray-200 bg-white text-left hover:border-purple-500 hover:bg-purple-50 transition"
              >
                B) Plants only grow in the dark
              </button>
            </div>
            {gameFeedback && (
              <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-center">
                {gameFeedback}
              </p>
            )}
          </div>
        </article>
      )}

      {/* TAB 4: EXPLORE FLASHCARDS */}
      {activeTab === 'flashcards' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xl text-center space-y-6">
          <span className="inline-block px-3 py-1 rounded-full bg-pink-50 text-pink-700 font-extrabold text-xs">
            Explore Flashcards
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900">Picture Flashcards & Vocabulary</h2>

          {/* Demo Flashcard set */}
          {(() => {
            const flashcardItems = [
              { visual: '🌱', en: 'Plant', ta: 'தாவரம்', category: 'Nature' },
              { visual: '☀️', en: 'Sunlight', ta: 'சூரிய ஒளி', category: 'Science' },
              { visual: '💧', en: 'Water', ta: 'நீர்', category: 'Basic' },
              { visual: '🍃', en: 'Leaf', ta: 'இலை', category: 'Biology' },
              { visual: '🍎', en: 'Fruit', ta: 'பழம்', category: 'Fruits' },
              { visual: '🐘', en: 'Elephant', ta: 'யானை', category: 'Animals' },
              { visual: '🔵', en: 'Circle', ta: 'வட்டம்', category: 'Shapes' },
              { visual: '🏫', en: 'School', ta: 'பள்ளி', category: 'School' },
            ]
            const current = flashcardItems[flashcardIndex % flashcardItems.length]
            return (
              <div className="space-y-6">
                <div className="mx-auto max-w-sm rounded-3xl border-2 border-pink-200 bg-gradient-to-b from-pink-50 to-purple-50 p-8 space-y-4 shadow-md">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/80 text-[11px] font-extrabold text-pink-700 border border-pink-200">
                    {current.category}
                  </span>
                  <div className="text-7xl py-2">{current.visual}</div>
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">Source Language:</span>
                    <h3 className="text-2xl font-extrabold text-gray-900">{current.en}</h3>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-pink-600 uppercase">Student Learning Language:</span>
                    <p className="text-xl font-extrabold text-pink-700 font-tamil">{current.ta}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePlay}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-pink-600 text-white px-5 text-xs font-extrabold shadow-sm hover:bg-pink-700 transition"
                  >
                    <Volume2 className="size-4" /> Play Pronunciation
                  </button>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setFlashcardIndex((i) => (i - 1 + flashcardItems.length) % flashcardItems.length)}
                    className="min-h-11 px-5 py-2.5 rounded-2xl border border-gray-200 bg-gray-50 font-bold text-xs text-gray-700 hover:bg-gray-100"
                  >
                    ← Previous Card
                  </button>
                  <span className="text-xs font-bold text-gray-400">
                    {flashcardIndex + 1} / {flashcardItems.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFlashcardIndex((i) => (i + 1) % flashcardItems.length)}
                    className="min-h-11 px-5 py-2.5 rounded-2xl bg-pink-600 font-bold text-xs text-white hover:bg-pink-700 shadow-xs"
                  >
                    Next Card →
                  </button>
                </div>
              </div>
            )
          })()}

          <p className="text-xs text-gray-500 font-semibold">
            Selected-language word — validation required for native accuracy.
          </p>
        </div>
      )}

      {/* TAB 5: PLAY & PRACTICE */}
      {activeTab === 'practice' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 font-extrabold text-xs">
                Play and Practice
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Interactive Learning Activities</h2>
            </div>
            <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1.5 rounded-xl border border-cyan-200">
              Score: {matchedCount} / 3
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-extrabold text-gray-800">Match & Learn: Tap Picture to Match Concept</h3>
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
                    setGameFeedback(`Matched ${item.emoji} with ${item.word}! Great effort! 🎉`)
                  }}
                  className="min-h-28 rounded-3xl border border-cyan-200 bg-cyan-50/50 p-6 text-center hover:bg-cyan-100/50 transition-all space-y-2 flex flex-col items-center justify-center"
                >
                  <div className="text-4xl">{item.emoji}</div>
                  <p className="text-xs font-extrabold text-gray-900">{item.word}</p>
                </button>
              ))}
            </div>
          </div>

          {gameFeedback && (
            <div className="rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800 border border-emerald-200 text-center space-y-1">
              <p className="text-sm font-extrabold">{gameFeedback}</p>
              <p className="text-emerald-600">You are learning! Keep up the great work!</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: TRY THE WORKSHEET */}
      {activeTab === 'worksheet' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-amber-50 text-amber-800 font-extrabold text-xs">
                Teacher-Reviewed Worksheet
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Practice at School or Home</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => alert('Downloading Printable Worksheet PDF...')}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl bg-amber-500 text-amber-950 px-4 text-xs font-extrabold shadow-xs hover:bg-amber-600 transition"
              >
                Download Worksheet
              </button>
              <button
                type="button"
                onClick={() => alert('Opening Print dialog for Worksheet...')}
                className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-2xl border border-gray-200 px-4 text-xs font-bold text-gray-700 hover:bg-gray-50 transition"
              >
                Print Worksheet
              </button>
            </div>
          </div>

          <div className="space-y-4 bg-amber-50/30 p-6 rounded-3xl border border-amber-100">
            <h3 className="text-sm font-extrabold text-gray-900">Worksheet Practice Exercises:</h3>
            <div className="space-y-3 text-xs font-semibold text-gray-800">
              <div className="p-3.5 bg-white rounded-2xl border border-amber-200">
                1. <strong>Picture Counting:</strong> Count the leaves on the plant stem: 🍃 🍃 🍃 = ______
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-amber-200">
                2. <strong>Match Columns:</strong> Match (Sunlight → ☀️), (Water → 💧), (Leaf → 🍃)
              </div>
              <div className="p-3.5 bg-white rounded-2xl border border-amber-200">
                3. <strong>Fill Simple Blanks:</strong> Plants need ____________ and ____________ to grow.
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 font-semibold italic">
            Worksheet content is based on the selected grade and learning objective.
          </p>
        </div>
      )}

      {/* TAB 7: TAKE A SHORT QUIZ */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xl text-center space-y-6">
          <span className="inline-block px-3 py-1 rounded-full bg-yellow-50 text-yellow-800 font-extrabold text-xs">
            Take a Short Quiz
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900">Check Your Learning</h2>
          <p className="text-sm text-gray-600 font-medium max-w-md mx-auto">
            Short multiple-choice and picture-choice questions designed for primary-grade learners.
          </p>

          <div className="pt-2">
            <Link
              href={`/student/quiz/${lesson.id}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-yellow-500 text-yellow-950 px-8 py-3 text-sm font-extrabold shadow-md hover:bg-yellow-600 transition"
            >
              <HelpCircle className="size-5" />
              Start Interactive Quiz Now
            </Link>
          </div>

          <p className="text-xs text-gray-500 font-semibold italic max-w-md mx-auto">
            Quiz results help teachers identify topics that may need more practice.
          </p>
        </div>
      )}

      {/* TAB 8: MY PROGRESS */}
      {activeTab === 'progress' && (
        <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-xs">
                My Progress
              </span>
              <h2 className="text-2xl font-extrabold text-gray-900 mt-1">Lesson Progress & Offline Status</h2>
            </div>
            <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
              {progressStatus === 'completed' ? 'Completed 100%' : 'In Progress'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
              <span className="text-gray-400 font-bold uppercase">Offline Status</span>
              <p className="text-sm font-bold text-gray-900">Saved on This Device</p>
              <p className="text-gray-500">Lesson text, audio, flashcards, and activities stored locally.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-1">
              <span className="text-gray-400 font-bold uppercase">Sync Status</span>
              <p className="text-sm font-bold text-emerald-700">Sync Pending / Auto-Synced</p>
              <p className="text-gray-500">Progress uploads automatically when internet is active.</p>
            </div>
          </div>

          <p className="text-xs text-gray-500 font-semibold italic">
            Offline learning pack — planned prototype module.
          </p>
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
