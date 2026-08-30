'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Sparkles, 
  Save, 
  BookOpen, 
  HelpCircle, 
  Plus, 
  Trash, 
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/hooks/useAuth'

interface QuizQuestionInput {
  question_en: string
  question_ta: string
  options: string[]
  correct_answer: string
  explanation_ta: string
  difficulty: 'easy' | 'medium' | 'hard'
  question_order: number
}

export default function NewLesson() {
  const router = useRouter()
  const { user, profile } = useAuth()
  
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

  // Quiz Builder
  const [questions, setQuestions] = useState<QuizQuestionInput[]>([
    {
      question_en: '',
      question_ta: '',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation_ta: '',
      difficulty: 'easy',
      question_order: 1
    }
  ])

  const [translating, setTranslating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showDemoAlert, setShowDemoAlert] = useState(false)

  // Mock Translation Database
  const getMockTranslation = (title: string, content: string) => {
    const text = content.toLowerCase()
    
    if (text.includes('photosynthesis') || title.toLowerCase().includes('photosynthesis')) {
      return {
        title_ta: 'ஒளிச்சேர்க்கை (Photosynthesis)',
        translated: 'ஒளிச்சேர்க்கை என்பது தாவரங்கள் சூரிய ஒளி, நீர் மற்றும் கார்பன் டை ஆக்சைடைப் பயன்படுத்தி ஆக்ஸிஜன் மற்றும் சர்க்கரை வடிவிலான ஆற்றலை உருவாக்கும் செயல்முறையாகும். இலைகள் குளோரோபில் (பச்சை நிறமி) காரணமாக பச்சை நிறத்தைக் கொண்டுள்ளன, இது ஒளி ஆற்றலை உறிஞ்சுகிறது.',
        simplified: 'தாவரங்கள் சூரிய ஒளி, நீர், மற்றும் காற்றைப் பயன்படுத்தி தங்களுக்குத் தேவையான உணவைத் தயாரிக்கும் முறைக்கு "ஒளிச்சேர்க்கை" என்று பெயர். செடிகளின் இலைகளில் இருக்கும் பச்சையம் (chlorophyll) தான் இதற்கு உதவுகிறது. இந்த முறையில் தாவரங்கள் மனிதர்களுக்குத் தேவையான ஆக்சிஜனை வெளியிடுகின்றன.',
        objectives: [
          'Understand how plants make food using sunlight',
          'Identify the role of chlorophyll in leaves',
          'Recognize that plants release oxygen'
        ],
        vocab: [
          { en: 'Photosynthesis', ta: 'ஒளிச்சேர்க்கை' },
          { en: 'Chlorophyll', ta: 'பச்சையம்' },
          { en: 'Sunlight', ta: 'சூரிய ஒளி' }
        ],
        quizzes: [
          {
            question_en: 'What gas do plants release during photosynthesis?',
            question_ta: 'ஒளிச்சேர்க்கையின் போது தாவரங்கள் எந்த வாயுவை வெளியிடுகின்றன?',
            options: ['Oxygen (ஆக்ஸிஜன்)', 'Carbon Dioxide (கார்பன் டை ஆக்சைடு)', 'Nitrogen (நைட்ரஜன்)', 'Hydrogen (ஹைட்ரஜன்)'],
            correct_answer: 'Oxygen (ஆக்ஸிஜன்)',
            explanation_ta: 'ஒளிச்சேர்க்கையின் போது தாவரங்கள் ஆக்சிஜனை (Oxygen) வெளியிடுகின்றன, இது நாம் சுவாசிக்க உதவுகிறது.',
            difficulty: 'easy' as const,
            question_order: 1
          },
          {
            question_en: 'What gives leaves their green color?',
            question_ta: 'இலைகளுக்கு பச்சை நிறத்தை கொடுப்பது எது?',
            options: ['Water (நீர்)', 'Chlorophyll (பச்சையம்)', 'Sunlight (சூரிய ஒளி)', 'Soil (மண்)'],
            correct_answer: 'Chlorophyll (பச்சையம்)',
            explanation_ta: 'பச்சையம் (Chlorophyll) தான் இலைகளுக்கு பச்சை நிறத்தைக் கொடுக்கிறது மற்றும் சூரிய ஒளியை உறிஞ்ச உதவுகிறது.',
            difficulty: 'easy' as const,
            question_order: 2
          }
        ]
      }
    } else if (text.includes('addition') || title.toLowerCase().includes('addition')) {
      return {
        title_ta: 'அடிப்படை கூட்டல் (Basic Addition)',
        translated: 'கூட்டல் என்பது புதிய மொத்தத்தை உருவாக்க இரண்டு அல்லது அதற்கு மேற்பட்ட எண்களை ஒன்றாக இணைப்பதாகும். கூட்டலின் குறியீடு + (பிளஸ்) ஆகும். உதாரணமாக, 3 + 2 என்பது 5 ஆகும்.',
        simplified: 'கூட்டல் என்றால் இரண்டு அல்லது அதற்கு மேற்பட்ட எண்களை ஒன்றாகச் சேர்த்து மொத்த மதிப்பைக் காண்பது ஆகும். கூட்டலைக் குறிக்க நாம் "+" என்ற குறியீட்டைப் பயன்படுத்துகிறோம். உதாரணமாக, உங்களிடம் 3 ஆப்பிள்கள் உள்ளன, அம்மா மேலும் 2 தருகிறார் என்றால் மொத்தம் 5 ஆப்பிள்கள்.',
        objectives: [
          'Learn to combine two numbers',
          'Understand the + addition sign',
          'Perform simple double-digit sum additions'
        ],
        vocab: [
          { en: 'Addition', ta: 'கூட்டல்' },
          { en: 'Total', ta: 'மொத்தம்' },
          { en: 'Plus Sign', ta: 'கூட்டல் குறி (+)' }
        ],
        quizzes: [
          {
            question_en: 'What is 5 + 4?',
            question_ta: '5 + 4-ன் மதிப்பு என்ன?',
            options: ['7', '8', '9', '10'],
            correct_answer: '9',
            explanation_ta: '5 உடன் 4-ஐக் கூட்டினால் 9 கிடைக்கும்.',
            difficulty: 'easy' as const,
            question_order: 1
          }
        ]
      }
    }
    
    // Default fallback
    return {
      title_ta: `${title} - தமிழ்`,
      translated: `[DEMO MOCK] இது ஒரு தமிழ் மொழிபெயர்ப்பு மாதிரி ஆகும். உங்களின் பாட உள்ளடக்கத்தின் தலைப்பு: ${title}.`,
      simplified: `[DEMO MOCK] இது எளிய வடிவில் விளக்கப்பட்ட பாட உள்ளடக்கம் ஆகும்.`,
      objectives: ['Learn core concepts about ' + title],
      vocab: [{ en: 'Term 1', ta: 'சொல் 1' }],
      quizzes: [
        {
          question_en: `What is the main topic of ${title}?`,
          question_ta: `${title}-ன் முக்கிய தலைப்பு என்ன?`,
          options: [title, 'Something else', 'None of these', 'All of these'],
          correct_answer: title,
          explanation_ta: `இந்த பாடத்தின் முக்கிய தலைப்பு ${title} ஆகும்.`,
          difficulty: 'easy' as const,
          question_order: 1
        }
      ]
    }
  }

  const triggerMockTranslation = () => {
    if (!titleEn || !originalContent) {
      setError('Please provide a lesson title and English content first.')
      return
    }

    setTranslating(true)
    setError(null)
    setShowDemoAlert(true)

    setTimeout(() => {
      const result = getMockTranslation(titleEn, originalContent)
      setTitleTa(result.title_ta)
      setTranslatedContent(result.translated)
      setSimplifiedContentTa(result.simplified)
      setLearningObjectives(result.objectives)
      setVocabulary(result.vocab)
      setQuestions(result.quizzes)
      setTranslating(false)
    }, 1500)
  }

  // Objective Handlers
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

  // Vocab Handlers
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

  // Quiz Question Handlers
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
    // Recalculate order
    const reordered = next.map((q, idx) => ({ ...q, question_order: idx + 1 }))
    setQuestions(reordered)
  }

  const handleQuestionChange = (index: number, key: keyof QuizQuestionInput, val: any) => {
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

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setError(null)

    if (status === 'published') {
      if (!titleTa.trim()) return setError('Tamil Lesson Title is required when publishing.')
      if (!translatedContent.trim()) return setError('Tamil Lesson Content is required when publishing.')
      if (!simplifiedContentTa.trim()) return setError('Simplified Explanation for Kids is required when publishing.')
    }

    setSaving(true)

    try {
      // Find school ID for the teacher
      const { data: teacherSchool } = await supabase
        .from('teacher_schools')
        .select('school_id')
        .eq('teacher_id', user.id)
        .maybeSingle()

      // 1. Insert Lesson
      const { data: newLesson, error: lessonError } = await supabase
        .from('lessons')
        .insert({
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
          created_by: user.id,
          school_id: teacherSchool?.school_id || null
        })
        .select('id')
        .single()

      if (lessonError) {
        setError(lessonError.message)
        setSaving(false)
        return
      }

      // 2. Insert Quiz Questions
      const formattedQuestions = questions
        .filter(q => q.question_ta && q.correct_answer)
        .map(q => ({
          lesson_id: newLesson.id,
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

        if (quizError) {
          setError(quizError.message)
          setSaving(false)
          return
        }
      }

      router.push('/teacher/lessons')
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the lesson.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/teacher/lessons" className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50">
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create Lesson</h1>
          <p className="text-gray-500 mt-1">Upload English lesson content and adapt it to Tamil.</p>
        </div>
      </div>

      {showDemoAlert && (
        <div className="rounded-2xl bg-amber-50 p-4 text-amber-800 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Demo Mode / Mock Translation Disclaimer</h4>
            <p className="text-sm mt-1 text-amber-700">
              The AI translation and content simplification generated below is simulated for the hackathon prototype. 
              Always review, edit, and verify the translation accuracy before publishing to students.
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSaveLesson} className="space-y-6">
        {/* Step 1: English Content */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="size-5 text-gray-400" />
            1. English Lesson Details
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
                Lesson Title (English)
              </label>
              <input
                id="title"
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Photosynthesis"
                className="mt-1 block w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:ring-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="grade" className="block text-sm font-semibold text-gray-700">
                Grade / Class
              </label>
              <select
                id="grade"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(parseInt(e.target.value))}
                className="mt-1 block w-full rounded-2xl border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:ring-primary focus:outline-none"
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
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-700">
                Subject
              </label>
              <input
                id="subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Science"
                className="mt-1 block w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
              Original English Content
            </label>
            <textarea
              id="content"
              required
              rows={6}
              value={originalContent}
              onChange={(e) => setOriginalContent(e.target.value)}
              placeholder="Paste or write the original English lesson content here..."
              className="mt-1 block w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:ring-primary focus:outline-none"
            />
          </div>

          <button
            type="button"
            disabled={translating}
            onClick={triggerMockTranslation}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm hover:shadow-md transition-all disabled:opacity-50"
          >
            {translating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Adapting content...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate Tamil Adaptation (DEMO MODE)
              </>
            )}
          </button>
        </div>

        {/* Step 2: Tamil Adaptation */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="size-5 text-accent" />
            2. Tamil Pedagogy Adaptation (மொழிபெயர்ப்பு & எளிமைப்படுத்துதல்)
          </h3>

          <div>
            <label htmlFor="title_ta" className="block text-sm font-semibold text-gray-700">
              Lesson Title (Tamil)
            </label>
            <input
              id="title_ta"
              type="text"
              required
              value={titleTa}
              onChange={(e) => setTitleTa(e.target.value)}
              placeholder="பாடத்தின் தமிழ் தலைப்பு"
              className="mt-1 block w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:border-primary focus:ring-primary focus:outline-none font-tamil"
            />
          </div>

          <div>
            <label htmlFor="translated" className="block text-sm font-semibold text-gray-700">
              Translated Content (Tamil)
            </label>
            <textarea
              id="translated"
              required
              rows={5}
              value={translatedContent}
              onChange={(e) => setTranslatedContent(e.target.value)}
              placeholder="மொழிபெயர்க்கப்பட்ட பாட உள்ளடக்கம்..."
              className="mt-1 block w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:ring-primary focus:outline-none font-tamil"
            />
          </div>

          <div>
            <label htmlFor="simplified" className="block text-sm font-semibold text-gray-700">
              Simplified Explanation for Kids (தமிழ் எளிய விளக்கம்)
            </label>
            <textarea
              id="simplified"
              required
              rows={5}
              value={simplifiedContentTa}
              onChange={(e) => setSimplifiedContentTa(e.target.value)}
              placeholder="குழந்தைகளுக்குப் புரியும் வகையில் எளிமைப்படுத்தப்பட்ட விளக்கம்..."
              className="mt-1 block w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:border-primary focus:ring-primary focus:outline-none font-tamil"
            />
          </div>

          {/* Learning Objectives */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Learning Objectives (கற்றல் நோக்கங்கள்)
            </label>
            <div className="space-y-3">
              {learningObjectives.map((obj, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={obj}
                    onChange={(e) => handleObjectiveChange(idx, e.target.value)}
                    placeholder={`Objective ${idx + 1}`}
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
              <Plus className="size-4" />
              Add Learning Objective
            </button>
          </div>

          {/* Vocabulary Builder */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Vocabulary (அறிமுகச் சொற்கள்)
            </label>
            <div className="space-y-3">
              {vocabulary.map((vocab, idx) => (
                <div key={idx} className="flex gap-3">
                  <input
                    type="text"
                    value={vocab.en}
                    onChange={(e) => handleVocabChange(idx, 'en', e.target.value)}
                    placeholder="English word"
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input
                    type="text"
                    value={vocab.ta}
                    onChange={(e) => handleVocabChange(idx, 'ta', e.target.value)}
                    placeholder="தமிழ் சொல்"
                    className="flex-1 rounded-2xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-tamil"
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
              <Plus className="size-4" />
              Add Vocabulary Word
            </button>
          </div>
        </div>

        {/* Step 3: Quiz Builder */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="size-5 text-gray-400" />
            3. Quiz Questions Editor (வினாடி வினா எடிட்டர்)
          </h3>

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
                    <label className="block text-xs font-semibold text-gray-500 uppercase">Question in English</label>
                    <input
                      type="text"
                      value={q.question_en}
                      onChange={(e) => handleQuestionChange(qIndex, 'question_en', e.target.value)}
                      placeholder="Question text in English"
                      className="mt-1 block w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase">Question in Tamil</label>
                    <input
                      type="text"
                      required
                      value={q.question_ta}
                      onChange={(e) => handleQuestionChange(qIndex, 'question_ta', e.target.value)}
                      placeholder="கேள்வி உரை"
                      className="mt-1 block w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-tamil"
                    />
                  </div>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {q.options.map((opt, oIndex) => (
                    <div key={oIndex}>
                      <label className="block text-xs font-semibold text-gray-400">Option {oIndex + 1}</label>
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                        placeholder={`Option ${oIndex + 1} text`}
                        className="mt-1 block w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Answer & Explanation */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase">Correct Option Text</label>
                    <select
                      value={q.correct_answer}
                      onChange={(e) => handleQuestionChange(qIndex, 'correct_answer', e.target.value)}
                      required
                      className="mt-1 block w-full rounded-xl border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
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
                    <label className="block text-xs font-semibold text-gray-500 uppercase">Explanation in Tamil</label>
                    <input
                      type="text"
                      value={q.explanation_ta}
                      onChange={(e) => handleQuestionChange(qIndex, 'explanation_ta', e.target.value)}
                      placeholder="சரியான விடைக்கான தமிழ் விளக்கம்"
                      className="mt-1 block w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary font-tamil"
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
            <Plus className="size-4" />
            Add Quiz Question
          </button>
        </div>

        {/* Submit Controls */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-3 bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mr-auto px-2">
            <label htmlFor="status" className="text-sm font-semibold text-gray-700">Status:</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
              className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="draft">Draft (வடிவம்)</option>
              <option value="published">Publish (வெளியிடு)</option>
            </select>
          </div>

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
                Save Lesson
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
