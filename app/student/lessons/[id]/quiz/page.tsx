'use client'

import React, { use } from 'react'
import StudentQuiz from '../../../quiz/[lessonId]/page'

interface Params {
  id: string
}

export default function StudentLessonQuizWrapper({ params: paramsPromise }: { params: Promise<Params> }) {
  const params = use(paramsPromise)
  
  const mappedParams = Promise.resolve({
    lessonId: params.id
  })

  return <StudentQuiz params={mappedParams} />
}
