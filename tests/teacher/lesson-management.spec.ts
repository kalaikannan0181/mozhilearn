import { test, expect } from '@playwright/test'

test.describe('Teacher Lesson Management', () => {
  test.beforeEach(async ({ context, page }) => {
    await context.clearCookies()
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })
  test('should create, edit, publish, and delete a lesson', async ({ page }) => {
    test.setTimeout(60000)
    const email = process.env.TEST_TEACHER_EMAIL
    const password = process.env.TEST_TEACHER_PASSWORD

    if (!email || !password) {
      test.skip(true, 'Test credentials missing')
      return
    }

    // 1. Log in
    await page.goto('/teacher/login')
    await page.locator('input[type="email"]').fill(email)
    await page.locator('input[type="password"]').fill(password)
    await page.getByRole('button', { name: 'Sign In as Teacher' }).click()
    await page.waitForURL('**/teacher/dashboard')

    // 2. Go to Lesson Creation Page
    await page.goto('/teacher/lessons/create')
    await expect(page.getByRole('heading', { name: 'Create Lesson' })).toBeVisible()

    // 3. Fill Lesson form
    const testTitle = 'PLAYWRIGHT TEST LESSON ' + Date.now()
    await page.locator('#title').fill(testTitle)
    await page.locator('#grade').selectOption('3')
    await page.locator('#subject').fill('Science')
    await page.locator('#content').fill('This is a test lesson content about stars and space.')

    // Choose 'draft' status
    await page.locator('#status').selectOption('draft')

    // Trigger AI translation mock to populate required fields
    await page.getByText('Generate Mother Tongue Adaptation (DEMO MODE)').click()
    await expect(page.locator('#title_ta')).not.toHaveValue('', { timeout: 10000 })

    // Save Lesson
    await page.getByRole('button', { name: 'Save Lesson' }).click()

    // Debug check for database error messages on the page
    const errorBox = page.locator('.bg-red-50')
    await page.waitForTimeout(3000) // wait for database call to return
    if (await errorBox.isVisible()) {
      console.error('DATABASE SAVE ERROR:', await errorBox.textContent())
    }

    // 4. Verify redirected and draft lesson exists in catalog
    await page.waitForURL('**/teacher/lessons')
    await expect(page).toHaveURL(/.*\/teacher\/lessons/)
    await expect(page.getByRole('heading', { name: testTitle, exact: true })).toBeVisible()

    // 5. Open Lesson to Edit / Publish
    await page.locator('div.bg-white', { has: page.getByRole('heading', { name: testTitle, exact: true }) }).getByRole('link', { name: 'Manage Lesson' }).click()
    await page.waitForURL(/\/teacher\/lessons\/.+/)

    // Fill in required Tamil fields for publishing
    await page.locator('#title_ta').fill('விண்மீன்கள் (Stars)')
    await page.locator('#translated').fill('விண்மீன்கள் என்பவை விண்வெளியில் ஒளிரும் வாயு உருண்டைகள் ஆகும்.')
    await page.locator('#simplified').fill('நட்சத்திரங்கள் என்பவை வானத்தில் ஒளிரும் அழகான விளக்குகள் ஆகும்.')

    // Toggle status to Published
    await page.locator('#status').selectOption('published')

    // Save changes
    await page.getByRole('button', { name: 'Save Changes' }).click()
    await expect(page.getByText('Lesson and quiz questions saved successfully!')).toBeVisible()

    // 6. Delete Lesson to clean up
    await page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Are you sure you want to delete this lesson?')
      await dialog.accept()
    })
    await page.getByRole('button', { name: 'Delete Lesson' }).click()

    // Verify redirected back to lessons catalog page and the test title is gone
    await page.waitForURL('**/teacher/lessons')
    await expect(page.getByRole('heading', { name: testTitle, exact: true })).not.toBeVisible()
  })

  test('should display error UI for non-existent teacher edit lesson ID', async ({ page }) => {
    test.setTimeout(60000)
    const email = process.env.TEST_TEACHER_EMAIL
    const password = process.env.TEST_TEACHER_PASSWORD

    if (!email || !password) {
      test.skip(true, 'Test credentials missing')
      return
    }

    // Log in
    await page.goto('/teacher/login')
    await page.locator('input[type="email"]').fill(email)
    await page.locator('input[type="password"]').fill(password)
    await page.getByRole('button', { name: 'Sign In as Teacher' }).click()
    await page.waitForURL('**/teacher/dashboard')

    // Navigate to non-existent edit page
    await page.goto('/teacher/lessons/e1111111-1111-1111-1111-111111111111')
    
    // Expect error block to show up
    const errorBox = page.locator('.bg-red-50')
    await expect(errorBox).toBeVisible({ timeout: 20000 })
  })

  test('should validate empty fields on lesson creation', async ({ page }) => {
    test.setTimeout(60000)
    const email = process.env.TEST_TEACHER_EMAIL
    const password = process.env.TEST_TEACHER_PASSWORD

    if (!email || !password) {
      test.skip(true, 'Test credentials missing')
      return
    }

    // Log in
    await page.goto('/teacher/login')
    await page.locator('input[type="email"]').fill(email)
    await page.locator('input[type="password"]').fill(password)
    await page.getByRole('button', { name: 'Sign In as Teacher' }).click()
    await page.waitForURL('**/teacher/dashboard')

    // Go to Create page and click save without filling required fields
    await page.goto('/teacher/lessons/create')
    await page.getByRole('button', { name: 'Save Lesson' }).click()

    // Form shouldn't submit, page should still be on /create
    await expect(page.getByRole('heading', { name: 'Create Lesson' })).toBeVisible()
    await expect(page).toHaveURL(/.*\/teacher\/lessons\/create/)
  })
})
