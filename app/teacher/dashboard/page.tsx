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
  Loader2,
  Mic,
  FileSpreadsheet,
  Layers,
  CheckSquare,
  Download,
  Sparkles,
  Wifi,
  WifiOff,
  RefreshCw,
  Volume2,
  BookOpenCheck,
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'
import { LanguageSelector } from '@/components/LanguageSelector'
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguageCode,
  getLanguageByCode,
} from '@/config/languages'
import {
  MULTILINGUAL_LESSONS,
  getLessonContentForLanguage,
} from '@/data/multilingualLessons'

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
  
  // Multilingual State Settings
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguageCode>('sat')
  const [selectedClass, setSelectedClass] = useState<number>(1)
  const [selectedSubject, setSelectedSubject] = useState<string>('mathematics_fln')
  const [selectedSchool, setSelectedSchool] = useState<string>('Nandha Tribal Primary School')
  const [syncStatus, setSyncStatus] = useState<'online' | 'offline_ready' | 'syncing'>('online')

  const [stats, setStats] = useState<Stats>({
    totalLessons: 3,
    totalStudents: 24,
    assignedLessons: 8,
    pendingReviews: 2,
  })
  const [recentLessons, setRecentLessons] = useState<Lesson[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [activity, setActivity] = useState<StudentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const activeLangConfig = getLanguageByCode(targetLanguage)
  const featuredLesson = MULTILINGUAL_LESSONS[0]
  const currentContent = getLessonContentForLanguage(featuredLesson, targetLanguage)

  const fetchDashboardData = async () => {
    if (!user) return
    try {
      setLoading(true)
      setError('')

      // 1. Fetch Lessons
      const { data: lessons, error: lessonsError } = await supabase
        .from('lessons')
        .select('id, title_en, title_ta, subject, grade_level, status, created_at')
        .order('created_at', { ascending: false })

      if (!lessonsError && lessons) {
        setRecentLessons(lessons.slice(0, 5))
      }

      // 2. Fetch Mapped Students
      const { data: mappings } = await supabase
        .from('student_teacher_map')
        .select('student_id')

      const studentIds = mappings?.map((m) => m.student_id) || []
      if (studentIds.length > 0) {
        const { data: studentProfiles } = await supabase
          .from('profiles')
          .select('id, full_name, grade_level')
          .in('id', studentIds)
          .limit(5)

        if (studentProfiles) setStudents(studentProfiles as Student[])
      }

    } catch (err: any) {
      console.warn('Dashboard live data fetch notice:', err.message)
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
        <p className="mt-4 text-sm text-muted-foreground font-medium">Loading Multilingual Dashboard...</p>
      </div>
    )
  }

  const quickActionCards = [
    {
      title: 'Live Voice Translation',
      subtitle: `Speak Hindi ↔ ${activeLangConfig.name}`,
      icon: Mic,
      badge: activeLangConfig.status === 'active' ? 'Live Latency < 3s' : 'Beta Preview',
      color: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
      href: '/teacher/lessons',
    },
    {
      title: 'Translate FLN Lesson',
      subtitle: `Hindi → ${activeLangConfig.name} Script`,
      icon: BookOpenCheck,
      badge: 'FLN / NIPUN',
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      href: '/teacher/lessons/create',
    },
    {
      title: 'Bilingual Worksheet',
      subtitle: `Hindi + ${activeLangConfig.name} Printables`,
      icon: FileSpreadsheet,
      badge: 'Print / Offline',
      color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400',
      href: '/teacher/lessons',
    },
    {
      title: 'Visual Flashcards',
      subtitle: 'Picture + Word + Audio',
      icon: Layers,
      badge: 'Audio-First',
      color: 'from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
      href: '/teacher/lessons',
    },
    {
      title: 'Assessment Builder',
      subtitle: 'Mother-tongue Questions',
      icon: CheckSquare,
      badge: 'Oral & Visual',
      color: 'from-rose-500/10 to-red-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400',
      href: '/teacher/analytics',
    },
    {
      title: 'Language & Offline Packs',
      subtitle: `Download ${activeLangConfig.name} Pack`,
      icon: Download,
      badge: activeLangConfig.offlinePackAvailable ? 'Ready' : 'Draft',
      color: 'from-cyan-500/10 to-sky-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-400',
      href: '/teacher/lessons',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Top Multilingual Control Bar */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* School Selector */}
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold">
              <School className="h-4 w-4 text-primary" />
              <select
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                className="bg-transparent font-bold text-foreground focus:outline-none"
              >
                <option value="Nandha Tribal Primary School">Nandha Tribal Primary School (Erode)</option>
                <option value="Government Primary School, Dumka">Government Primary School, Dumka</option>
                <option value="Ranchi Primary Model School">Ranchi Primary Model School</option>
              </select>
            </div>

            {/* Class Selector */}
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold">
              <span className="text-muted-foreground">Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(Number(e.target.value))}
                className="bg-transparent font-bold text-foreground focus:outline-none"
              >
                {[1, 2, 3, 4, 5].map((cls) => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
            </div>

            {/* Subject Selector */}
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-secondary/40 px-3 py-1.5 text-xs font-semibold">
              <span className="text-muted-foreground">Subject:</span>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-transparent font-bold text-foreground focus:outline-none"
              >
                <option value="mathematics_fln">Mathematics FLN</option>
                <option value="literacy_fln">Literacy FLN</option>
                <option value="evs">Environmental Studies (EVS)</option>
              </select>
            </div>
          </div>

          {/* Sync & Connection Status */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600 dark:text-emerald-400">
              <Wifi className="h-3.5 w-3.5" />
              Online (Sync OK)
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-blue-600 dark:text-blue-400">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Auto-Synced
            </span>
          </div>
        </div>

        {/* Global Target Language Switcher */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <LanguageSelector
            value={targetLanguage}
            onChange={setTargetLanguage}
            showSourceSelector={true}
            label="Teach In Target Tribal Language:"
          />
          <div className="text-xs text-muted-foreground italic">
            SIH26042 Multi-Language Pedagogy Support
          </div>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-primary/10 via-secondary/40 to-background p-6 sm:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            AI Multilingual Vernacular Pedagogy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Teach every child in their mother tongue
          </h1>
          <p className="text-muted-foreground mt-2 text-base leading-relaxed">
            Convert Hindi FLN lessons into clear <strong>{activeLangConfig.name} ({activeLangConfig.nativeName})</strong>, Ho, Mundari, and Santhali learning content for primary school children.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => alert(`Launching Live Classroom Voice Translation (Hindi ↔ ${activeLangConfig.name})`)}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-extrabold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
          >
            <Mic className="h-5 w-5" />
            Start Live Translation
          </button>
          <Link
            href="/teacher/lessons/create"
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-3 text-sm font-extrabold text-foreground shadow-sm transition-all hover:bg-secondary"
          >
            <Plus className="h-5 w-5" />
            Create Lesson
          </Link>
        </div>
      </div>

      {/* 6 Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {quickActionCards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              href={card.href}
              className={`group relative flex flex-col justify-between rounded-3xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${card.color}`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="rounded-2xl bg-card p-3 shadow-sm group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-card px-2.5 py-1 text-[11px] font-extrabold shadow-xs">
                    {card.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground">{card.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{card.subtitle}</p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-xs font-extrabold text-primary group-hover:translate-x-1 transition-transform">
                <span>Open Tool</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Language-Aware Today's Lesson Card */}
      <div className="rounded-3xl border border-primary/20 bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-primary">
              Today’s Featured FLN Lesson
            </span>
            <h2 className="text-2xl font-extrabold text-foreground mt-1">
              Class {featuredLesson.classLevel} • {featuredLesson.subjectLabel}
            </h2>
            <p className="text-sm text-muted-foreground font-semibold">
              Topic: {featuredLesson.topic}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-secondary px-3 py-1.5 text-xs font-bold">
              Source: <strong>Hindi (हिन्दी)</strong>
            </span>
            <span className="rounded-xl bg-primary/10 px-3 py-1.5 text-xs font-extrabold text-primary">
              Teach In: <strong>{activeLangConfig.name} ({activeLangConfig.nativeName})</strong>
            </span>
          </div>
        </div>

        {/* Dynamic Content Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-secondary/20 p-5 rounded-2xl border border-border">
          <div>
            <h4 className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider mb-2">
              Hindi Source Content
            </h4>
            <p className="text-base font-bold text-foreground">
              {featuredLesson.content.hi.title}
            </p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {featuredLesson.content.hi.instructions}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-extrabold text-primary uppercase tracking-wider">
                {activeLangConfig.name} Translation ({activeLangConfig.script})
              </h4>
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                activeLangConfig.status === 'active'
                  ? 'bg-emerald-500/15 text-emerald-600'
                  : 'bg-amber-500/15 text-amber-600'
              }`}>
                {activeLangConfig.status === 'active' ? 'Active Verified' : 'Beta Mode'}
              </span>
            </div>
            <p className="text-base font-bold text-foreground">
              {currentContent.title}
            </p>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              {currentContent.instructions}
            </p>
          </div>
        </div>

        {/* Outcome and Action Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <div className="text-xs text-muted-foreground">
            <strong>NIPUN Outcome:</strong> {featuredLesson.nipunOutcome}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {targetLanguage !== 'sat' && (
              <button
                type="button"
                onClick={() => alert(`Requesting ${activeLangConfig.name} Voice Pack from Language Expert Pipeline.`)}
                aria-label={`Request ${activeLangConfig.name} Voice Pack`}
                className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-extrabold text-amber-700 dark:text-amber-400 hover:bg-amber-500/20"
              >
                Request {activeLangConfig.name} Voice Pack
              </button>
            )}

            <button
              type="button"
              onClick={() => alert(`Generating ${activeLangConfig.name} Classroom Lesson Plan`)}
              aria-label={`Generate ${activeLangConfig.name} Lesson`}
              className="rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-foreground hover:bg-secondary/80"
            >
              Generate {activeLangConfig.name} Lesson
            </button>

            <button
              type="button"
              onClick={() => alert(`Launching Teach Now mode in ${activeLangConfig.name}`)}
              aria-label={`Teach Now in ${activeLangConfig.name}`}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-extrabold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              Teach Now in {activeLangConfig.name}
            </button>
          </div>
        </div>
      </div>

      {/* Language Availability & Offline Pack Status Panel */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Languages className="h-5 w-5 text-primary" />
          Tribal Language Availability & Offline Packs
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SUPPORTED_LANGUAGES.filter((l) => l.code !== 'hi').map((lang) => (
            <div
              key={lang.code}
              className={`rounded-2xl border p-4 transition-all ${
                targetLanguage === lang.code
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-secondary/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-foreground">{lang.nativeName} ({lang.name})</span>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                  lang.status === 'active'
                    ? 'bg-emerald-500/15 text-emerald-600'
                    : 'bg-amber-500/15 text-amber-600'
                }`}>
                  {lang.status}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">Script: {lang.script}</p>
              <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                <span className={lang.voiceAvailable ? 'text-emerald-600' : 'text-slate-400'}>
                  {lang.voiceAvailable ? '✓ Voice Pack Ready' : '○ Voice Pending'}
                </span>
                <button
                  type="button"
                  onClick={() => setTargetLanguage(lang.code)}
                  className="text-primary font-bold hover:underline"
                >
                  Select Language
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Dashboard Layout Split */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Recent Lessons */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-3xl border border-border shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <FileText className="size-5 text-muted-foreground" />
                Recent FLN Lessons
              </h3>
              <Link href="/teacher/lessons" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
                View all lessons <ArrowRight className="size-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {MULTILINGUAL_LESSONS.map((lesson) => {
                const content = getLessonContentForLanguage(lesson, targetLanguage)
                return (
                  <div key={lesson.id} className="flex items-center justify-between p-4 rounded-2xl border border-border hover:bg-secondary/30 transition-all">
                    <div className="min-w-0 pr-4">
                      <p className="font-bold text-foreground truncate text-base">{content.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">Hindi: {lesson.content.hi.title}</p>
                      <div className="text-xs text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span className="font-semibold text-primary/80 bg-primary/5 px-2 py-0.5 rounded-md">Class {lesson.classLevel}</span>
                        <span>•</span>
                        <span>{lesson.subjectLabel}</span>
                        <span>•</span>
                        <span className="text-primary font-bold">{activeLangConfig.name}</span>
                      </div>
                    </div>
                    <Link href="/teacher/lessons" className="p-2 rounded-xl border border-border hover:border-primary text-primary font-bold text-xs shrink-0">
                      Open
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Student Learning Snapshot */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card rounded-3xl border border-border shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Users className="size-5 text-muted-foreground" />
                Student Learning Snapshot
              </h3>
              <Link href="/teacher/analytics" className="text-sm font-semibold text-primary hover:underline">
                Analytics
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center mb-4">
              <div className="p-3 bg-secondary/40 rounded-2xl border border-border">
                <span className="text-2xl font-extrabold text-foreground">24</span>
                <p className="text-[11px] text-muted-foreground font-semibold mt-0.5">Active Students</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <span className="text-2xl font-extrabold text-emerald-600">18</span>
                <p className="text-[11px] text-emerald-600/80 font-semibold mt-0.5">Completed Today</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                <span className="text-2xl font-extrabold text-amber-600">6</span>
                <p className="text-[11px] text-amber-600/80 font-semibold mt-0.5">Need Support</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              Mother-tongue audio instructions in <strong>{activeLangConfig.name}</strong> improved class comprehension by 42% this week.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
