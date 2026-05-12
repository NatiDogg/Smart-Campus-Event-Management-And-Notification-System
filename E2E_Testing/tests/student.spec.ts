import { test, expect } from '@playwright/test'

test.describe('Student Dashboard', () => {

    test.beforeEach(async ({ page }) => {
        // login as student before each test
        await page.goto('/login')
        await page.waitForSelector('input[name="email"]', { timeout: 30000 })
        await page.fill('input[name="email"]', 'teststudent@gmail.com')
        await page.fill('input[name="password"]', 'TestPass123')
        await page.click('button[type="submit"]')
        await expect(page).toHaveURL(/\/student/, { timeout: 30000 })
    })

    test('student dashboard loads successfully', async ({ page }) => {
    
    await page.waitForURL(/\/student/, { timeout: 30000 })
    await expect(page.getByText('CampusEvents')).toBeVisible({ timeout: 10000 })
})

    test('student can navigate to events page', async ({ page }) => {
        await page.goto('/student/events')
        await expect(page).toHaveURL(/\/student\/events/, { timeout: 10000 })
    })

    test('student can navigate to calendar page', async ({ page }) => {
        await page.goto('/student/calendar')
        await expect(page).toHaveURL(/\/student\/calendar/, { timeout: 10000 })
    })

    test('student can navigate to my events page', async ({ page }) => {
        await page.goto('/student/my-events')
        await expect(page).toHaveURL(/\/student\/my-events/, { timeout: 10000 })
    })

    test('student can navigate to announcements page', async ({ page }) => {
        await page.goto('/student/announcements')
        await expect(page).toHaveURL(/\/student\/announcements/, { timeout: 10000 })
    })

    test('admin cannot access student dashboard', async ({ page }) => {
        // logout first
        await page.locator('img[alt="user"]').click()
        await page.getByRole('button', { name: /log out/i }).first().click()
        await expect(page).toHaveURL(/\/login/, { timeout: 15000 })

        // login as admin
        await page.waitForSelector('input[name="email"]', { timeout: 30000 })
        await page.fill('input[name="email"]', 'admin@gmail.com')
        await page.fill('input[name="password"]', '123456')
        await page.click('button[type="submit"]')
        await expect(page).toHaveURL(/\/admin/, { timeout: 30000 })

        // try to access student dashboard
        await page.goto('/student')

        // should redirect to admin dashboard
        await expect(page).toHaveURL(/\/admin/, { timeout: 10000 })
    })
})


