import { test, expect } from '@playwright/test'

test.describe('Student Authentication', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })
  test('should successfully log in as a student', async ({ page }) => {
    const email = process.env.TEST_STUDENT_EMAIL
    const password = process.env.TEST_STUDENT_PASSWORD

    if (!email || !password) {
      test.skip(true, 'Test credentials missing')
      return
    }

    await page.goto('/student/login')
    await expect(page.getByText('Student Login')).toBeVisible()

    await page.locator('input[type="email"]').fill(email)
    await page.locator('input[type="password"]').fill(password)
    await page.getByRole('button', { name: 'Sign In as Student' }).click()

    await page.waitForURL('**/student/dashboard')
    await expect(page).toHaveURL(/.*\/student\/dashboard/)
    await expect(page.getByText('Hello,')).toBeVisible({ timeout: 20000 })
  })

  test('should fail login with invalid student credentials', async ({ page }) => {
    test.setTimeout(60000)
    await page.goto('/student/login')
    await page.locator('input[type="email"]').fill('student@test.com')
    await page.locator('input[type="password"]').fill('wrongpassword')
    await page.getByRole('button', { name: 'Sign In as Student' }).click()

    // Wait for the alert/error display
    await expect(page.locator('form').getByText('Invalid email or password')).toBeVisible({ timeout: 20000 })
  })

  test('should validate empty student credentials', async ({ page }) => {
    test.setTimeout(60000)
    await page.goto('/student/login')
    
    // Attempt sign in with empty fields
    await page.getByRole('button', { name: 'Sign In as Student' }).click()

    // The browser native validation blocks it, so we should stay on student login page
    await expect(page.getByRole('heading', { name: 'Student Login' })).toBeVisible()
    await expect(page).toHaveURL(/.*\/student\/login/)
  })
})
