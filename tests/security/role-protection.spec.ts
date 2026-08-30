import { test, expect } from '@playwright/test'

test.describe('Role Based Access Security', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })
  test('should redirect unauthenticated users to login page', async ({ page }) => {
    await page.goto('/teacher/dashboard')
    await page.waitForURL('**/login')
    await expect(page).toHaveURL(/.*\/login/)

    await page.goto('/student/dashboard')
    await page.waitForURL('**/login')
    await expect(page).toHaveURL(/.*\/login/)
  })

  test('should redirect student away from teacher dashboard', async ({ page }) => {
    const studentEmail = process.env.TEST_STUDENT_EMAIL
    const studentPassword = process.env.TEST_STUDENT_PASSWORD

    if (!studentEmail || !studentPassword) {
      test.skip(true, 'Student credentials missing')
      return
    }

    // Log in as student
    await page.goto('/student/login')
    await page.locator('input[type="email"]').fill(studentEmail)
    await page.locator('input[type="password"]').fill(studentPassword)
    await page.getByRole('button', { name: 'Sign In as Student' }).click()
    await page.waitForURL('**/student/dashboard')

    // Attempt to open teacher dashboard
    await page.goto('/teacher/dashboard')
    
    // Should redirect back to student dashboard
    await page.waitForURL('**/student/dashboard')
    await expect(page).toHaveURL(/.*\/student\/dashboard/)
  })

  test('should redirect teacher away from student dashboard', async ({ page }) => {
    const teacherEmail = process.env.TEST_TEACHER_EMAIL
    const teacherPassword = process.env.TEST_TEACHER_PASSWORD

    if (!teacherEmail || !teacherPassword) {
      test.skip(true, 'Teacher credentials missing')
      return
    }

    // Log in as teacher
    await page.goto('/teacher/login')
    await page.locator('input[type="email"]').fill(teacherEmail)
    await page.locator('input[type="password"]').fill(teacherPassword)
    await page.getByRole('button', { name: 'Sign In as Teacher' }).click()
    await page.waitForURL('**/teacher/dashboard')

    // Attempt to open student dashboard
    await page.goto('/student/dashboard')
    
    // Should redirect back to teacher dashboard
    await page.waitForURL('**/teacher/dashboard')
    await expect(page).toHaveURL(/.*\/teacher\/dashboard/)
  })

  test('student logout should invalidate session and block dashboard access', async ({ page }) => {
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

    // Click logout
    await page.locator('button[title="Sign Out"]').click()
    await page.waitForURL('**/login')

    // Verify trying to navigate directly back redirects to login
    await page.goto('/student/dashboard')
    await page.waitForURL('**/login')
    await expect(page).toHaveURL(/.*\/login/)
  })

  test('teacher logout should invalidate session and block dashboard access', async ({ page }) => {
    test.setTimeout(60000)
    const teacherEmail = process.env.TEST_TEACHER_EMAIL
    const teacherPassword = process.env.TEST_TEACHER_PASSWORD

    if (!teacherEmail || !teacherPassword) {
      test.skip(true, 'Teacher credentials missing')
      return
    }

    // Log in
    await page.goto('/teacher/login')
    await page.locator('input[type="email"]').fill(teacherEmail)
    await page.locator('input[type="password"]').fill(teacherPassword)
    await page.getByRole('button', { name: 'Sign In as Teacher' }).click()
    await page.waitForURL('**/teacher/dashboard')

    // Click logout
    await page.getByRole('button', { name: 'Sign Out' }).click()
    await page.waitForURL('**/login')

    // Verify trying to navigate directly back redirects to login
    await page.goto('/teacher/dashboard')
    await page.waitForURL('**/login')
    await expect(page).toHaveURL(/.*\/login/)
  })
})
