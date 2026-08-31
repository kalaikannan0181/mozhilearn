'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/context/AuthContext'
import { MessageSquare, Check, X, Loader2, AlertCircle } from 'lucide-react'

interface Lesson {
  id: string
  title_en: string
  title_ta: string
  original_content: string
  translated_content: string
  simplified_content_ta: string
}

interface TranslationReview {
  id: string
  lesson_id: string
  reviewer_id: string | null
  status: 'pending' | 'approved' | 'needs_changes'
  comments: string | null
  created_at: string
  reviewed_at: string | null
  lesson: Lesson
}

export default function TranslationReviewsPage() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<TranslationReview[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>({})

  const fetchReviews = async () => {
    if (!user) return
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('translation_reviews')
        .select(`
          id,
          lesson_id,
          reviewer_id,
          status,
          comments,
          created_at,
          reviewed_at,
          lesson:lessons (
            id,
            title_en,
            title_ta,
            original_content,
            translated_content,
            simplified_content_ta
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching reviews:', error)
      } else {
        setReviews((data || []) as unknown as TranslationReview[])
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [user])

  const handleUpdateStatus = async (reviewId: string, newStatus: 'approved' | 'needs_changes') => {
    setUpdatingId(reviewId)
    const comment = commentInput[reviewId] || ''
    try {
      const { error } = await supabase
        .from('translation_reviews')
        .update({
          status: newStatus,
          comments: comment.trim() || null,
          reviewer_id: user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reviewId)

      if (error) {
        alert('Failed to update review status: ' + error.message)
      } else {
        await fetchReviews()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Translation Reviews</h1>
        <p className="text-gray-500 mt-1">Review and approve mother-tongue translations for your authored lessons.</p>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center text-gray-500">
          <AlertCircle className="size-12 text-gray-300 mx-auto mb-4" />
          <p className="font-semibold text-lg">No reviews found</p>
          <p className="text-sm mt-1">Translation reviews will appear here once translation requests are submitted.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-50 pb-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {review.lesson?.title_en || 'Untitled Lesson'}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Submitted: {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    review.status === 'approved'
                      ? 'bg-green-50 text-green-700'
                      : review.status === 'needs_changes'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-yellow-50 text-yellow-700'
                  }`}>
                    {review.status}
                  </span>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Hindi Content</span>
                  <div className="bg-gray-50 p-4 rounded-2xl text-sm text-gray-800 leading-relaxed min-h-[100px]">
                    {review.lesson?.original_content}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mother Tongue Translation</span>
                  <div className="bg-primary/5 p-4 rounded-2xl text-sm text-primary leading-relaxed min-h-[100px]">
                    {review.lesson?.translated_content}
                  </div>
                </div>
              </div>

              {review.comments && (
                <div className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-2xl flex gap-3 text-sm text-yellow-800">
                  <MessageSquare className="size-5 shrink-0 text-yellow-600 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Previous comments:</span>
                    <span>{review.comments}</span>
                  </div>
                </div>
              )}

              {review.status === 'pending' && (
                <div className="pt-2 border-t border-gray-50 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Add review comment / change requests (optional)
                    </label>
                    <textarea
                      placeholder="Specify what needs to be changed, or leave blank to approve..."
                      value={commentInput[review.id] || ''}
                      onChange={(e) => setCommentInput({ ...commentInput, [review.id]: e.target.value })}
                      className="w-full text-sm border border-gray-100 rounded-2xl p-3 outline-none focus:border-primary transition min-h-[60px]"
                    />
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      disabled={updatingId !== null}
                      onClick={() => handleUpdateStatus(review.id, 'needs_changes')}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {updatingId === review.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <X className="size-4" />
                      )}
                      Request Changes
                    </button>
                    <button
                      disabled={updatingId !== null}
                      onClick={() => handleUpdateStatus(review.id, 'approved')}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {updatingId === review.id ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      Approve Translation
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
