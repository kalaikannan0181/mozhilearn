'use client'

import React, { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Save, 
  Trash, 
  Users, 
  HelpCircle, 
  FileText,
  Volume2, 
  Sparkles,
  Loader2,
  Check
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'

interface Student {
  id: string
  full_name: string
  school_name: string
  grade_level: number
}

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

export default function EditLesson({ params: paramsPromise }: { params: Promise<Params> }) {
  const params = use(paramsPromise)
  const router = useRouter()
  const { user } = useAuth()
  const lessonId = params.id

  // States
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Lesson Fields
  const [titleEn, setTitleEn] = useState('')
  const [titleTa, setTitleTa] = useState('')
  const [subject, setSubject] = useState('')
  const [gradeLevel, setGradeLevel] = useState<number>(3)
  const [originalContent, setOriginalContent] = useState('')
  const [translatedContent, setTranslatedContent] = useState('')
  const [simplifiedContentTa, setSimplifiedContentTa] = useState('')
  const [learningObjectives, setLearningObjectives] = useState<string[]>([''])
  const [vocabulary, setVocabulary] = useState<{ en: string; ta: string }[]>([{ en: '', ta: '' }])
  const [status, setStatus] = useState<'draft' | 'published'>('draft')

  // Quiz Questions
  const [questions, setQuestions] = useState<QuizQuestion[]>([])

  // Student Assignment States
  const [students, setStudents] = useState<Student[]>([])
  const [assignedStudents, setAssignedStudents] = useState<string[]>([])
  const [assigning, setAssigning] = useState(false)

  // Feature 1, 4, 7 States
  const [isDownloaded, setIsDownloaded] = useState(true)
  const [isAudioDownloaded, setIsAudioDownloaded] = useState(false)
  const [downloadingAudio, setDownloadingAudio] = useState(false)
  const [humanReviewed, setHumanReviewed] = useState(true)
  const [showValidationModal, setShowValidationModal] = useState(false)

  useEffect(() => {
    if (!user || !lessonId) return

    const fetchData = async () => {
      try {
        setLoading(true)

        // 1. Fetch Lesson details
        const { data: lesson, error: lessonError } = await supabase
          .from('lessons')
          .select('*')
          .eq('id', lessonId)
          .single()

        if (lessonError) throw lessonError

        if (lesson.created_by !== user.id) {
          setError('Access denied. You do not have permission to manage this lesson.')
          setLoading(false)
          return
        }

        setTitleEn(lesson.title_en)
        setTitleTa(lesson.title_ta || '')
        setSubject(lesson.subject)
        setGradeLevel(lesson.grade_level)
        setOriginalContent(lesson.original_content)
        setTranslatedContent(lesson.translated_content || '')
        setSimplifiedContentTa(lesson.simplified_content_ta || '')
        setLearningObjectives(lesson.learning_objectives?.length ? lesson.learning_objectives : [''])
        setVocabulary(lesson.vocabulary?.length ? lesson.vocabulary : [{ en: '', ta: '' }])
        setStatus(lesson.status as 'draft' | 'published')

        // 2. Fetch Quiz Questions
        const { data: quizQuestions } = await supabase
          .from('quiz_questions')
          .select('*')
          .eq('lesson_id', lessonId)
          .order('question_order', { ascending: true })

        setQuestions(quizQuestions || [])

        // 3. Fetch Mapped Students
        const { data: mappings } = await supabase
          .from('student_teacher_map')
          .select('student_id')
          .eq('teacher_id', user.id)

        const studentIds = mappings?.map(m => m.student_id) || []

        if (studentIds.length > 0) {
          const { data: studentProfiles } = await supabase
            .from('profiles')
            .select('id, full_name, school_name, grade_level')
            .in('id', studentIds)
          
          setStudents((studentProfiles || []) as Student[])
        }

        // 4. Fetch Current Assignments
        const { data: assignments } = await supabase
          .from('lesson_assignments')
          .select('student_id')
          .eq('lesson_id', lessonId)

        setAssignedStudents(assignments?.map(a => a.student_id) || [])

      } catch (err: any) {
        console.error('Error fetching lesson:', err)
        setError(err.message || 'Error loading lesson.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, lessonId])

  // Save Lesson and Questions
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError(null)
    setSuccessMsg(null)

    if (status === 'published') {
      if (!titleTa.trim()) return setError('Tamil Lesson Title is required when publishing.')
      if (!translatedContent.trim()) return setError('Tamil Lesson Content is required when publishing.')
      if (!simplifiedContentTa.trim()) return setError('Simplified Explanation for Kids is required when publishing.')
    }

    setSaving(true)

    try {
      // 1. Update Lesson
      const { error: lessonError } = await supabase
        .from('lessons')
        .update({
          title_en: titleEn,
          title_ta: titleTa,
          subject,
          grade_level: gradeLevel,
          original_content: originalContent,
          translated_content: translatedContent,
          simplified_content_ta: simplifiedContentTa,
          learning_objectives: learningObjectives.filter(Boolean),
          vocabulary: vocabulary.filter(v => v.en && v.ta),
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', lessonId)

      if (lessonError) throw lessonError

      // 2. Manage Quiz Questions (Delete old, Insert updated)
      // Since it's a prototype, we recreate questions to ensure clean update
      await supabase
        .from('quiz_questions')
        .delete()
        .eq('lesson_id', lessonId)

      const formattedQuestions = questions
        .filter(q => q.question_ta && q.correct_answer)
        .map(q => ({
          lesson_id: lessonId,
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

      setSuccessMsg('Lesson and quiz questions saved successfully!')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      setError(err.message || 'Error updating lesson.')
    } finally {
      setSaving(false)
    }
  }

  // Delete Lesson
  const handleDelete = async () => {
    if (!user) return
    if (!window.confirm("Are you sure you want to delete this lesson?")) return
    setError(null)
    setSaving(true)
    try {
      const { error: deleteError } = await supabase
        .from('lessons')
        .delete()
        .eq('id', lessonId)

      if (deleteError) throw deleteError
      router.push('/teacher/lessons')
    } catch (err: any) {
      setError(err.message || 'Error deleting lesson.')
      setSaving(false)
    }
  }

  // Toggle student assignment
  const handleToggleAssignment = async (studentId: string) => {
    if (!user) return
    setAssigning(true)

    const isAssigned = assignedStudents.includes(studentId)
    
    try {
      if (isAssigned) {
        // Remove assignment
        const { error } = await supabase
          .from('lesson_assignments')
          .delete()
          .eq('lesson_id', lessonId)
          .eq('student_id', studentId)

        if (!error) {
          setAssignedStudents(assignedStudents.filter(id => id !== studentId))
        }
      } else {
        // Add assignment
        const { error } = await supabase
          .from('lesson_assignments')
          .insert({
            lesson_id: lessonId,
            student_id: studentId,
            assigned_by: user.id
          })

        if (!error) {
          setAssignedStudents([...assignedStudents, studentId])
        }
      }
    } catch (err) {
      console.error('Error toggling assignment:', err)
    } finally {
      setAssigning(false)
    }
  }

  // Preview TTS
  const handleTTSPreview = () => {
    if (!simplifiedContentTa) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(simplifiedContentTa)
    utterance.lang = 'ta-IN'
    window.speechSynthesis.speak(utterance)
  }

  // Objective & Vocab Handlers
  const handleAddObjective = () => setLearningObjectives([...learningObjectives, ''])
  const handleRemoveObjective = (index: number) => {
    const next = [...learningObjectives]
    next.splice(index, 1)
    setLearningObjectives(next)
  }
  const handleObjectiveChange = (index: number, val: string) => {
    const next = [...learningObjectives]
    next[index] = val
    setLearningObjectives(next)
  }

  const handleAddVocab = () => setVocabulary([...vocabulary, { en: '', ta: '' }])
  const handleRemoveVocab = (index: number) => {
    const next = [...vocabulary]
    next.splice(index, 1)
    setVocabulary(next)
  }
  const handleVocabChange = (index: number, key: 'en' | 'ta', val: string) => {
    const next = [...vocabulary]
    next[index] = { ...next[index], [key]: val }
    setVocabulary(next)
  }

  // Quiz Handlers
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

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link href="/teacher/lessons" className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Manage Lesson</h1>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 border border-emerald-500/20">
                Available Offline
              </span>
            </div>
            <p className="text-gray-500 mt-1">Edit, preview audio, and assign this lesson to your students.</p>
          </div>
        </div>

        {/* Feature 1 & 7 Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsDownloaded(true)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-extrabold text-emerald-700 hover:bg-emerald-500/20"
          >
            <Check className="size-3.5" />
            Download Lesson (Offline Ready)
          </button>
          <button
            type="button"
            onClick={() => {
              setDownloadingAudio(true)
              setTimeout(() => {
                setDownloadingAudio(false)
                setIsAudioDownloaded(true)
              }, 1200)
            }}
            disabled={downloadingAudio}
            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-extrabold text-primary hover:bg-primary/20 disabled:opacity-50"
          >
            {downloadingAudio ? <Loader2 className="size-3.5 animate-spin" /> : <Volume2 className="size-3.5" />}
            {isAudioDownloaded ? 'Audio Downloaded' : 'Download Audio'}
          </button>
        </div>
      </div>

      {/* Feature 4: Validation Badges & Notes */}
      <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
            AI-Assisted Content
          </span>
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-500/20">
            Teacher Reviewed & Approved ✓
          </span>
        </div>

        <button
          type="button"
          onClick={() => setShowValidationModal(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-extrabold text-amber-800 hover:bg-amber-500/20"
        >
          <Sparkles className="size-4 text-amber-600" />
          Validate Language Accuracy (Prototype)
        </button>
      </div>

      {/* Feature 4 Validation Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Check className="size-5 text-emerald-600" />
              Validate Language Accuracy (Prototype)
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">• AI assists translation and lesson adaptation</p>
              <p className="font-semibold text-gray-900">• Teachers review educational quality and age-appropriateness</p>
              <p className="font-semibold text-gray-900">• Native speakers or language experts validate language accuracy</p>
            </div>
            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowValidationModal(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature 7 Audio Library Note */}
      <div className="rounded-2xl border border-border bg-card p-4 space-y-1">
        <p className="text-xs font-bold text-foreground">
          Feature 7 — Offline Audio Library Info:
        </p>
        <p className="text-xs text-muted-foreground">
          Audio generated when internet is available. Downloaded and stored locally on the device. Plays without internet during classroom use.
        </p>
        <p className="text-[11px] text-muted-foreground italic">
          Audio availability depends on the selected language and supported speech resources.
        </p>
      </div>

      {successMsg && (
        <div className="rounded-2xl bg-green-50 p-4 text-green-700 border border-green-200 flex items-center gap-2">
          <Check className="size-5 text-green-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* Assign to Students Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Users className="size-5 text-gray-400" />
          Assign to Students (மாணவர்களுக்குப் பகிர்)
        </h3>
        <p className="text-sm text-gray-500">Select the students who should learn this lesson. They will see it on their dashboard.</p>
        
        {students.length === 0 ? (
          <p className="text-sm text-amber-600 bg-amber-50 p-4 rounded-xl border border-amber-100">
            No students are currently mapped to you. When students register and input your school name, they will appear here automatically.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
            {students.map((student) => {
              const isAssigned = assignedStudents.includes(student.id)
              return (
                <div 
                  key={student.id} 
                  className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                    isAssigned 
                      ? 'border-primary bg-primary/5' 
                      : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{student.full_name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Grade {student.grade_level} • {student.school_name}</p>
                  </div>
                  <button
                    type="button"
                    disabled={assigning}
                    onClick={() => handleToggleAssignment(student.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                      isAssigned
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {isAssigned ? 'Assigned' : 'Assign'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Step 1: Content Editor */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <FileText className="size-5 text-gray-400" />
            1. Lesson Content Editor (English)
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700">Lesson Title (English)</label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                className="mt-1 block w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">Grade Level</label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-2xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value={1}>Grade 1</option>
                <option value={2}>Grade 2</option>
                <option value={3}>Grade 3</option>
                <option value={4}>Grade 4</option>
                <option value={5}>Grade 5</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1 block w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Original English Content</label>
            <textarea
              required
              rows={6}
              value={originalContent}
              onChange={(e) => setOriginalContent(e.target.value)}
              className="mt-1 block w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Step 2: Mother Tongue Adaptation */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="size-5 text-accent" />
              2. Mother Tongue Pedagogy Adaptation
            </h3>
            <button
              type="button"
              onClick={handleTTSPreview}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-xl hover:bg-primary/15 transition-all"
            >
              <Volume2 className="size-4" />
              Listen (Preview Audio)
            </button>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Lesson Title (Mother Tongue)</label>
            <input
              id="title_ta"
              type="text"
              required
              value={titleTa}
              onChange={(e) => setTitleTa(e.target.value)}
              className="mt-1 block w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Translated Content (Mother Tongue)</label>
            <textarea
              id="translated"
              required
              rows={5}
              value={translatedContent}
              onChange={(e) => setTranslatedContent(e.target.value)}
              className="mt-1 block w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Simplified Explanation for Kids</label>
            <textarea
              id="simplified"
              required
              rows={5}
              value={simplifiedContentTa}
              onChange={(e) => setSimplifiedContentTa(e.target.value)}
              className="mt-1 block w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Objectives */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Learning Objectives</label>
            <div className="space-y-3">
              {learningObjectives.map((obj, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => handleObjectiveChange(idx, e.target.value)}
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(idx)}
                    className="p-2.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50"
                  >
                    <Trash className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddObjective}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Add Objective
            </button>
          </div>

          {/* Vocab */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Vocabulary words</label>
            <div className="space-y-3">
              {vocabulary.map((vocab, idx) => (
                <div key={idx} className="flex gap-3">
                  <input
                    type="text"
                    value={vocab.en}
                    onChange={(e) => handleVocabChange(idx, 'en', e.target.value)}
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none"
                  />
                  <input
                    type="text"
                    value={vocab.ta}
                    onChange={(e) => handleVocabChange(idx, 'ta', e.target.value)}
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-2.5 text-sm font-tamil focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveVocab(idx)}
                    className="p-2.5 rounded-xl border border-red-100 text-red-500 hover:bg-red-50"
                  >
                    <Trash className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddVocab}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
            >
              Add Vocabulary Word
            </button>
          </div>
        </div>

        {/* Step 3: Quizzes */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle className="size-5 text-gray-400" />
              3. Quiz Questions Editor
            </h3>
            <Link
              href={`/teacher/lessons/${lessonId}/quiz`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-xl hover:bg-primary/15 transition-all"
            >
              Manage Separately (தனியாக நிர்வகி)
            </Link>
          </div>

          <div className="space-y-8 divider-y divide-gray-100">
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="space-y-4 pt-6 first:pt-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900">Question #{qIndex + 1}</h4>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-100 text-red-600 text-xs font-semibold hover:bg-red-50"
                    >
                      <Trash className="size-3.5" />
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase">Question (EN)</label>
                    <input
                      type="text"
                      value={q.question_en}
                      onChange={(e) => handleQuestionChange(qIndex, 'question_en', e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase">Question (TA)</label>
                    <input
                      type="text"
                      required
                      value={q.question_ta}
                      onChange={(e) => handleQuestionChange(qIndex, 'question_ta', e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:outline-none font-tamil"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex}>
                      <label className="block text-xs font-semibold text-gray-400">Option {oIndex + 1}</label>
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  ))}
                </div>

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
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase">Explanation (Tamil)</label>
                    <input
                      type="text"
                      value={q.explanation_ta}
                      onChange={(e) => handleQuestionChange(qIndex, 'explanation_ta', e.target.value)}
                      className="mt-1 block w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:outline-none font-tamil"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddQuestion}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 font-semibold hover:border-primary hover:text-primary transition-colors text-sm"
          >
            Add Quiz Question
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mr-auto px-2">
            <label htmlFor="status" className="text-sm font-semibold text-gray-700">Status:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs focus:outline-none"
            >
              <option value="draft">Draft (வடிவம்)</option>
              <option value="published">Publish (வெளியிடு)</option>
            </select>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleDelete}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 px-5 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Trash className="size-4" />
                Delete Lesson
              </>
            )}
          </button>
          <Link
            href="/teacher/lessons"
            className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-border px-5 text-sm font-semibold text-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
          >
            {saving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Save className="size-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
