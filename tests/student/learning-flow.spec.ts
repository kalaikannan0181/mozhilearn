import { test, expect } from '@playwright/test'

test.describe('Student Learning Flow', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })
  test('should view lesson, check TTS UI, complete quiz, and view results', async ({ page }) => {
    test.setTimeout(60000)
    const email = process.env.TEST_STUDENT_EMAIL
    const password = process.env.TEST_STUDENT_PASSWORD

    if (!email || !password) {
      test.skip(true, 'Test credentials missing')
      return
    }

    // 1. Log in
    await page.goto('/student/login')
    await page.locator('input[type="email"]').fill(email)
    await page.locator('input[type="password"]').fill(password)
    await page.getByRole('button', { name: 'Sign In as Student' }).click()
    await page.waitForURL('**/student/dashboard')

    // 2. Open seeded public demo lesson (Photosynthesis)
    const demoLessonId = 'd1111111-1111-1111-1111-111111111111'
    await page.goto(`/student/lessons/${demoLessonId}`)

    // 3. Verify lesson contents
    await expect(page.getByText('Grade 3 Lesson')).toBeVisible()
    await expect(page.getByText('Easy Lesson')).toBeVisible()

    // 4. Verify TTS Audio buttons
    const ttsButton = page.getByRole('button', { name: 'Listen (கேள்)' })
    await expect(ttsButton).toBeVisible()
    await ttsButton.click() // Click to play

    // Verify Pause button is now visible
    const pauseButton = page.getByRole('button', { name: 'Pause (நிறுத்து)' })
    await expect(pauseButton).toBeVisible()
    await pauseButton.click() // Click to pause

    // Verify Resume button is now visible
    const resumeButton = page.getByRole('button', { name: 'Resume (தொடர்)' })
    await expect(resumeButton).toBeVisible()

    // Click Stop button to cancel
    const stopButton = page.getByRole('button', { name: 'Stop (முடி)' })
    await expect(stopButton).toBeVisible()
    await stopButton.click()

    // 5. Open Quiz
    await page.getByRole('link', { name: 'Start Quiz (தேர்வு எழுது)' }).click()
    await page.waitForURL(`**/student/quiz/${demoLessonId}`)

    // 6. Answer quiz questions (seeded questions)
    // Question 1: What gas do plants release during photosynthesis?
    // Options: Oxygen (ஆக்ஸிஜன்), Carbon Dioxide (கார்பன் டை ஆக்சைடு), Nitrogen (நைட்ரஜன்), Hydrogen (ஹைட்ரஜன்)
    await page.getByRole('button', { name: 'Oxygen (ஆக்ஸிஜன்)' }).click()
    await page.getByRole('button', { name: 'Next Question' }).click()

    // Question 2: What gives leaves their green color?
    // Options: Water (நீர்), Chlorophyll (பச்சையம்), Sunlight (சூரிய ஒளி), Soil (மண்)
    await page.getByRole('button', { name: 'Chlorophyll (பச்சையம்)' }).click()
    await page.getByRole('button', { name: 'Submit Quiz (முடி)' }).click()

    // 7. Verify result screen metrics
    await page.waitForSelector('text=Quiz Completed!')
    await expect(page.getByText('Your Score:')).toBeVisible()
    await expect(page.getByText('Retake Quiz (மீண்டும் எழுது)')).toBeVisible()
  })

  test('should display error UI for non-existent lesson ID', async ({ page }) => {
    test.setTimeout(60000)
    const studentEmail = process.env.TEST_STUDENT_EMAIL
    const studentPassword = process.env.TEST_STUDENT_PASSWORD

    if (!studentEmail || !studentPassword) {
      test.skip(true, 'Student credentials missing')
      return
    }

    // Log in
    await page.goto('/student/login')
    await page.locator('input[type="email"]').fill(studentEmail)
    await page.locator('input[type="password"]').fill(studentPassword)
    await page.getByRole('button', { name: 'Sign In as Student' }).click()
    await page.waitForURL('**/student/dashboard')

    // Navigate to invalid lesson UUID
    await page.goto('/student/lessons/e1111111-1111-1111-1111-111111111111')
    await expect(page.getByRole('heading', { name: 'Lesson Not Found', exact: true })).toBeVisible({ timeout: 20000 })
    await expect(page.getByRole('link', { name: 'Return to Dashboard' })).toBeVisible()
  })

  test('should display error UI for non-existent quiz ID', async ({ page }) => {
    test.setTimeout(60000)
    const studentEmail = process.env.TEST_STUDENT_EMAIL
    const studentPassword = process.env.TEST_STUDENT_PASSWORD

    if (!studentEmail || !studentPassword) {
      test.skip(true, 'Student credentials missing')
      return
    }

    // Log in
    await page.goto('/student/login')
    await page.locator('input[type="email"]').fill(studentEmail)
    await page.locator('input[type="password"]').fill(studentPassword)
    await page.getByRole('button', { name: 'Sign In as Student' }).click()
    await page.waitForURL('**/student/dashboard')

    // Navigate to invalid quiz UUID
    await page.goto('/student/quiz/e1111111-1111-1111-1111-111111111111')
    await expect(page.getByRole('heading', { name: 'Quiz Not Found', exact: true })).toBeVisible({ timeout: 20000 })
    await expect(page.getByRole('link', { name: 'Return to Dashboard' })).toBeVisible()
  })
})
