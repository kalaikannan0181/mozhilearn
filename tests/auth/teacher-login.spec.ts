import { test, expect } from '@playwright/test'

test.describe('Teacher Authentication', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })
  test('should successfully log in as a teacher', async ({ page }) => {
    test.setTimeout(60000)
    const email = process.env.TEST_TEACHER_EMAIL
    const password = process.env.TEST_TEACHER_PASSWORD

    if (!email || !password) {
      test.skip(true, 'Test credentials missing')
      return
    }

    await page.goto('/teacher/login')
    await expect(page.getByText('Teacher Login')).toBeVisible()

    await page.locator('input[type="email"]').fill(email)
    await page.locator('input[type="password"]').fill(password)
    await page.getByRole('button', { name: 'Sign In as Teacher' }).click()

    await page.waitForURL('**/teacher/dashboard')
    await expect(page).toHaveURL(/.*\/teacher\/dashboard/)
    await expect(page.getByText('Welcome,')).toBeVisible({ timeout: 20000 })
  })

  test('should fail login with invalid teacher password', async ({ page }) => {
    test.setTimeout(60000)
    await page.goto('/teacher/login')
    await page.locator('input[type="email"]').fill('teacher@test.com')
    await page.locator('input[type="password"]').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign In as Teacher' }).click()

    // Wait for the alert/error display
    await expect(page.locator('form').getByText('Invalid email or password')).toBeVisible({ timeout: 20000 })
  })

  test('should validate empty teacher credentials', async ({ page }) => {
    test.setTimeout(60000)
    await page.goto('/teacher/login')
    
    // Attempt sign in with empty fields
    await page.getByRole('button', { name: 'Sign In as Teacher' }).click()

    // The browser native validation blocks it, so we should stay on teacher login page
    await expect(page.getByRole('heading', { name: 'Teacher Login' })).toBeVisible()
    await expect(page).toHaveURL(/.*\/teacher\/login/)
  })
})
