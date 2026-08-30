'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Filter, BookOpen, ArrowRight, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'

interface Lesson {
  id: string
  title_en: string
  title_ta: string
  subject: string
  grade_level: number
  status: string
  created_at: string
}

export default function TeacherLessons() {
  const { user } = useAuth()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [gradeFilter, setGradeFilter] = useState('all')

  useEffect(() => {
    if (!user) return

    const fetchLessons = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('lessons')
          .select('*')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setLessons(data || [])
      } catch (err) {
        console.error('Error fetching lessons:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchLessons()
  }, [user])

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title_en.toLowerCase().includes(search.toLowerCase()) || 
                          (lesson.title_ta && lesson.title_ta.toLowerCase().includes(search.toLowerCase())) ||
                          lesson.subject.toLowerCase().includes(search.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || lesson.status === statusFilter
    const matchesGrade = gradeFilter === 'all' || lesson.grade_level.toString() === gradeFilter

    return matchesSearch && matchesStatus && matchesGrade
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Lessons Catalog</h1>
          <p className="text-gray-500 mt-1">Manage and adapt mother-tongue lessons for your classes.</p>
        </div>
        <Link
          href="/teacher/lessons/create"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg shrink-0"
        >
          <Plus className="size-4" />
          Create New Lesson
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search lessons by title or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 pl-11 pr-4 py-2.5 text-sm focus:border-primary focus:ring-primary focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="size-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="review">In Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="rounded-2xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Grades</option>
            <option value="1">Grade 1</option>
            <option value="2">Grade 2</option>
            <option value="3">Grade 3</option>
            <option value="4">Grade 4</option>
            <option value="5">Grade 5</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
          <BookOpen className="mx-auto size-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-bold text-gray-900">No lessons found</h3>
          <p className="text-gray-500 mt-1">Try adjusting your filters, or create a new lesson.</p>
          <Link
            href="/teacher/lessons/create"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Create New Lesson
            <ArrowRight className="size-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => (
            <div
              key={lesson.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col hover:border-gray-200 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                  Grade {lesson.grade_level}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  lesson.status === 'published'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-yellow-50 text-yellow-700'
                }`}>
                  {lesson.status}
                </span>
              </div>

              <h4 className="text-lg font-bold text-gray-900 line-clamp-1">{lesson.title_en}</h4>
              {lesson.title_ta && (
                <h5 className="font-tamil text-sm text-gray-600 mt-1 line-clamp-1">{lesson.title_ta}</h5>
              )}

              <p className="text-sm text-gray-500 mt-3 flex-1">{lesson.subject}</p>

              <div className="border-t border-gray-50 pt-4 mt-6 flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  {new Date(lesson.created_at).toLocaleDateString()}
                </span>
                <Link
                  href={`/teacher/lessons/${lesson.id}`}
                  className="inline-flex items-center gap-1 font-bold text-primary hover:text-primary/85"
                >
                  Manage Lesson
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
