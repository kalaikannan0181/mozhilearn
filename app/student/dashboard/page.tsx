'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Volume2,
  VolumeX,
  Play,
  Sparkles,
  Star,
  Flame,
  Award,
  Download,
  Wifi,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Smile,
  BookOpen,
  HelpCircle,
  Headphones,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguageCode,
  getLanguageByCode,
} from '@/config/languages'
import {
  MULTILINGUAL_LESSONS,
  getLessonContentForLanguage,
} from '@/data/multilingualLessons'

export default function StudentDashboard() {
  const { user, profile } = useAuth()

  // Assigned Language for Student (Default: Santhali 'sat')
  const [assignedLang, setAssignedLang] = useState<SupportedLanguageCode>('sat')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('numbers')

  // Flashcard carousel index
  const [flashcardIndex, setFlashcardIndex] = useState(0)

  // Feature 1 & 8 Sync Progress States
  const [syncStatus, setSyncStatus] = useState<'synced' | 'pending_sync' | 'syncing'>('synced')
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now')
  const [playingTrack, setPlayingTrack] = useState<string | null>(null)

  const activeLangConfig = getLanguageByCode(assignedLang)
  const featuredLesson = MULTILINGUAL_LESSONS[0]
  const currentContent = getLessonContentForLanguage(featuredLesson, assignedLang)

  useEffect(() => {
    document.title = 'Student Learning Space | MozhiLearn'
    // Map profile language if set
    if (profile?.preferred_language && ['sat', 'hoc', 'unr', 'hi'].includes(profile.preferred_language)) {
      setAssignedLang(profile.preferred_language as SupportedLanguageCode)
    }
  }, [profile])

  const flashcards = [
    {
      img: '🥭',
      hi: 'आम (Mango)',
      sat: 'ᱩᱞ (Ul)',
      hoc: 'Uli (Ho)',
      unr: 'Uli (Mundari)',
      bg: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    },
    {
      img: '☀️',
      hi: 'सूरज (Sun)',
      sat: 'ᱥᱤᱧ ᱪᱟᱸᱫᱚ (Sin Chando)',
      hoc: 'Sing Bonga (Ho)',
      unr: 'Sing Bonga (Mundari)',
      bg: 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30',
    },
    {
      img: '🐟',
      hi: 'मछली (Fish)',
      sat: 'ᱦᱟᱹᱠᱩ (Haku)',
      hoc: 'Hako (Ho)',
      unr: 'Haku (Mundari)',
      bg: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
    },
    {
      img: '🌺',
      hi: 'फूल (Flower)',
      sat: 'ᱵᱟᱦᱟ (Baha)',
      hoc: 'Baha (Ho)',
      unr: 'Baha (Mundari)',
      bg: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
    },
  ]

  const categories = [
    { id: 'numbers', title: 'Numbers', icon: '🔢', color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' },
    { id: 'letters', title: 'Letters', icon: '🔤', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    { id: 'colours', title: 'Colours', icon: '🎨', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    { id: 'animals', title: 'Animals', icon: '🐘', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20' },
    { id: 'stories', title: 'Stories', icon: '📖', color: 'bg-rose-500/10 text-rose-600 border-rose-500/20' },
    { id: 'listen', title: 'Listen & Repeat', icon: '🎵', color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20' },
    { id: 'match', title: 'Match Picture', icon: '🧩', color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20' },
    { id: 'stars', title: 'My Stars', icon: '⭐', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  ]

  const playInstructionAudio = () => {
    if (!soundEnabled) return
    setIsPlayingAudio(true)
    setTimeout(() => {
      setIsPlayingAudio(false)
    }, 2500)
  }

  const currentFlashcard = flashcards[flashcardIndex]

  return (
    <div className="space-y-8">
      {/* Student Top Control Bar */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Child Profile Info */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shadow-xs">
            👧
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-foreground text-lg">
                {profile?.full_name || 'Rani'}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600">
                Grade 1
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-semibold">
              Learning Language: <strong className="text-primary">{activeLangConfig.name} ({activeLangConfig.nativeName})</strong>
            </p>
          </div>
        </div>

        {/* Controls: Audio Toggle & Language Preview */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Language Switcher for Student Preview */}
          <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-secondary/40 p-1">
            <span className="px-2 text-[11px] font-bold text-muted-foreground uppercase">Language:</span>
            {SUPPORTED_LANGUAGES.filter(l => l.code !== 'hi').map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setAssignedLang(lang.code)}
                className={`rounded-xl px-2.5 py-1 text-xs font-extrabold transition-all ${
                  assignedLang === lang.code
                    ? 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`inline-flex items-center gap-1.5 rounded-2xl border px-3 py-2 text-xs font-bold transition-all ${
              soundEnabled
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600'
                : 'border-slate-300 bg-slate-100 text-slate-500 dark:bg-slate-800'
            }`}
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span>Sound: {soundEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Feature 1 & 8: Connection Badge & Sync Progress Button */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-500/20">
              <Wifi className="h-3.5 w-3.5" />
              Offline Mode
            </span>

            <button
              type="button"
              onClick={() => {
                setSyncStatus('syncing')
                setTimeout(() => {
                  setSyncStatus('synced')
                  setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
                }, 1000)
              }}
              className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-3.5 py-1.5 text-xs font-extrabold text-primary-foreground shadow-xs hover:bg-primary/90 transition-all"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Sync Progress'}</span>
            </button>
          </div>
        </div>

        {/* Feature 1 & 8 Sync Notice Bar */}
        <div className="mt-3 flex items-center justify-between gap-2 border-t border-border/50 pt-2 text-xs text-muted-foreground">
          <span>
            {syncStatus === 'synced' ? '✓ Student progress recorded locally & synced to server.' : '⚠️ Pending Sync: Offline progress waiting to auto-sync.'}
          </span>
          <span className="font-semibold text-foreground">Last Synced: {lastSyncedTime}</span>
        </div>
      </div>

      {/* Child-Friendly Welcome Hero Card */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/40 to-background p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold text-primary">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Mother-Tongue Learning Space
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Hello, {profile?.full_name || 'Rani'}! 👋
          </h1>
          <p className="text-base text-muted-foreground font-semibold leading-relaxed">
            Let’s learn with pictures, stories, and sounds in <strong>{activeLangConfig.name} ({activeLangConfig.nativeName})</strong>.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <button
              type="button"
              onClick={playInstructionAudio}
              className="inline-flex items-center gap-2 rounded-2xl bg-secondary px-4 py-2.5 text-xs font-extrabold text-foreground hover:bg-secondary/80"
            >
              <Volume2 className={`h-4 w-4 ${isPlayingAudio ? 'animate-bounce text-primary' : ''}`} />
              <span>{isPlayingAudio ? 'Playing Audio...' : `🔊 Listen in ${activeLangConfig.name}`}</span>
            </button>
          </div>
        </div>

        {/* Continue Learning Action Box */}
        <div className="rounded-3xl border border-primary/30 bg-card p-6 shadow-md w-full md:w-80 shrink-0 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-primary uppercase tracking-wider">
              Continue Learning
            </span>
            <span className="text-xs font-bold text-muted-foreground">45% Completed</span>
          </div>

          <div>
            <h3 className="font-extrabold text-foreground text-lg">
              {featuredLesson.topic}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Class {featuredLesson.classLevel} • {featuredLesson.subjectLabel}
            </p>
          </div>

          <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full w-[45%]" />
          </div>

          <Link
            href={`/student/lessons/${featuredLesson.id}`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-extrabold text-primary-foreground shadow-md hover:bg-primary/90 transition-transform active:scale-95"
          >
            <Play className="h-5 w-5 fill-current" />
            <span>▶ Continue Learning</span>
          </Link>
        </div>
      </div>

      {/* 8 Large Touch-Friendly Activity Categories */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
          <span>Choose an Activity</span>
          <span className="text-xs font-normal text-muted-foreground">(Tap any button to start)</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex flex-col items-center justify-center p-5 rounded-3xl border transition-all hover:scale-105 active:scale-95 ${cat.color} ${
                activeCategory === cat.id ? 'ring-2 ring-primary shadow-md' : 'shadow-xs'
              }`}
            >
              <span className="text-4xl mb-2">{cat.icon}</span>
              <span className="font-extrabold text-sm">{cat.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Activity Card */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600">
              Today’s Interactive Activity
            </span>
            <h3 className="text-2xl font-extrabold text-foreground mt-1">
              Count the Mangoes (आम गिनो)
            </h3>
          </div>

          <button
            type="button"
            onClick={playInstructionAudio}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-500/10 px-4 py-2 text-xs font-extrabold text-emerald-600 hover:bg-emerald-500/20"
          >
            <Volume2 className={`h-4 w-4 ${isPlayingAudio ? 'animate-spin' : ''}`} />
            <span>{isPlayingAudio ? 'Playing...' : `🔊 Listen in ${activeLangConfig.name}`}</span>
          </button>
        </div>

        {/* Visual Mango Counter */}
        <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-secondary/30 border border-border text-center space-y-4">
          <div className="text-6xl tracking-widest flex items-center justify-center gap-3">
            <span>🥭</span>
            <span>🥭</span>
            <span>🥭</span>
            <span>🥭</span>
            <span>🥭</span>
          </div>

          <div className="max-w-md space-y-1">
            <p className="text-xs font-bold text-muted-foreground uppercase">Hindi Teacher Context:</p>
            <p className="text-sm font-semibold text-foreground">आम गिनो और सही संख्या चुनो।</p>
            <p className="text-xs font-bold text-primary uppercase pt-2">{activeLangConfig.name} Instruction:</p>
            <p className="text-base font-extrabold text-foreground">
              {currentContent.instructions}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {[3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  if (num === 5) {
                    alert('🎉 Correct! Well done! You earned a Star! ⭐')
                  } else {
                    alert('Try again! Count carefully 😊')
                  }
                }}
                className="h-14 w-14 rounded-2xl border-2 border-primary bg-card text-2xl font-extrabold text-primary hover:bg-primary hover:text-primary-foreground shadow-sm transition-all active:scale-95 flex items-center justify-center"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Visual Flashcard Preview */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span>🃏</span>
            <span>Visual Flashcard ({activeLangConfig.name})</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1))}
              className="p-2 rounded-xl border border-border bg-secondary/50 hover:bg-secondary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-muted-foreground">
              {flashcardIndex + 1} / {flashcards.length}
            </span>
            <button
              type="button"
              onClick={() => setFlashcardIndex((prev) => (prev < flashcards.length - 1 ? prev + 1 : 0))}
              className="p-2 rounded-xl border border-border bg-secondary/50 hover:bg-secondary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className={`flex flex-col sm:flex-row items-center justify-between p-6 rounded-3xl border bg-gradient-to-r ${currentFlashcard.bg} gap-6`}>
          <div className="text-7xl">{currentFlashcard.img}</div>
          <div className="text-center sm:text-left space-y-1">
            <span className="text-xs font-bold uppercase text-muted-foreground">Hindi Word:</span>
            <h4 className="text-xl font-bold text-foreground">{currentFlashcard.hi}</h4>
            <span className="text-xs font-bold uppercase text-primary pt-2 block">{activeLangConfig.name} Word:</span>
            <h3 className="text-2xl font-extrabold text-foreground">
              {assignedLang === 'sat'
                ? currentFlashcard.sat
                : assignedLang === 'hoc'
                ? currentFlashcard.hoc
                : currentFlashcard.unr}
            </h3>
          </div>
          <button
            type="button"
            onClick={playInstructionAudio}
            className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground shadow-md hover:bg-primary/90 shrink-0"
          >
            <Volume2 className="h-5 w-5" />
            <span>🔊 Listen Word</span>
          </button>
        </div>
      </div>

      {/* Stars, Badges & Offline Readiness */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Progress & Encouragement */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <span>My Learning Stars & Streaks</span>
          </h3>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
              <span className="text-3xl font-extrabold text-amber-600">⭐ 12</span>
              <p className="text-xs font-extrabold text-amber-600/90 mt-1">Stars Earned</p>
            </div>
            <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20">
              <span className="text-3xl font-extrabold text-rose-600">🔥 3</span>
              <p className="text-xs font-extrabold text-rose-600/90 mt-1">Day Streak</p>
            </div>
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <span className="text-3xl font-extrabold text-emerald-600">📚 4</span>
              <p className="text-xs font-extrabold text-emerald-600/90 mt-1">Lessons Done</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-secondary/40 border border-border text-center">
            <p className="text-sm font-bold text-foreground">🎉 "Well done! Keep learning every day!"</p>
          </div>
        </div>

        {/* Downloaded Offline Content Card */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            <span>Offline Classroom Storage</span>
          </h3>

          <p className="text-sm text-muted-foreground leading-relaxed">
            Your lessons and audio packs are saved locally on this tablet. Your work will automatically sync with your teacher when internet connects.
          </p>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-secondary/40 border border-border text-xs font-bold">
            <span>Downloaded Lessons: <strong>5 Lessons Ready</strong></span>
            <span className="text-emerald-600">✓ Offline Ready</span>
          </div>

          <button
            type="button"
            onClick={() => alert('Opening Offline Saved Lessons Library')}
            className="w-full rounded-2xl border border-border bg-secondary p-3 text-xs font-extrabold text-foreground hover:bg-secondary/80"
          >
            My Downloaded Lessons
          </button>
        </div>
      </div>

      {/* Feature 7: Local Audio Library Section */}
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-indigo-600">
              <Headphones className="h-4 w-4" /> Feature 7
            </div>
            <h3 className="text-xl font-extrabold text-foreground mt-0.5">
              Local Audio Library
            </h3>
          </div>
          <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 border border-indigo-500/20">
            Audio Available Offline
          </span>
        </div>

        <p className="text-xs text-muted-foreground">
          Audio generated when internet is available. Downloaded and stored locally on the device. Plays without internet during classroom use.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { title: 'Photosynthesis & Plant Growth', lang: activeLangConfig.name, duration: '2 min 15 sec' },
            { title: 'Basic Addition & Double Digit Sums', lang: activeLangConfig.name, duration: '1 min 45 sec' },
          ].map((track, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-secondary/30">
              <div>
                <p className="text-xs font-extrabold text-foreground">{track.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{track.lang} Audio • {track.duration}</p>
              </div>
              <button
                type="button"
                onClick={() => setPlayingTrack(playingTrack === track.title ? null : track.title)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-extrabold text-white shadow-xs hover:bg-indigo-700"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>{playingTrack === track.title ? 'Playing' : 'Play Audio'}</span>
              </button>
            </div>
          ))}
        </div>

        <p className="text-[11px] text-muted-foreground italic pt-1">
          Note: Audio availability depends on the selected language and supported speech resources.
        </p>
      </section>
    </div>
  )
}
