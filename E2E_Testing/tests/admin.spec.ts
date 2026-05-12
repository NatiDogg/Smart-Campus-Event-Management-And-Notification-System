import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login')
        await page.waitForSelector('input[name="email"]', { timeout: 30000 })
        await page.fill('input[name="email"]', 'admin@gmail.com')
        await page.fill('input[name="password"]', '123456')
        await page.click('button[type="submit"]')
        await expect(page).toHaveURL(/\/admin/, { timeout: 30000 })
    })

    test('admin dashboard loads successfully', async ({ page }) => {
        await page.waitForURL(/\/admin/, { timeout: 30000 })
        await expect(page.getByText('CampusEvents')).toBeVisible({ timeout: 10000 })
    })

    test('admin can navigate to users page', async ({ page }) => {
        await page.goto('/admin/users')
        await expect(page).toHaveURL(/\/admin\/users/, { timeout: 10000 })
    })

    test('admin can navigate to approvals page', async ({ page }) => {
        await page.goto('/admin/approvals')
        await expect(page).toHaveURL(/\/admin\/approvals/, { timeout: 10000 })
    })

    test('admin can navigate to analytics page', async ({ page }) => {
        await page.goto('/admin/analytics')
        await expect(page).toHaveURL(/\/admin\/analytics/, { timeout: 10000 })
    })

    test('admin can navigate to audit log page', async ({ page }) => {
        await page.goto('/admin/audit-log')
        await expect(page).toHaveURL(/\/admin\/audit-log/, { timeout: 10000 })
    })

    test('admin can navigate to categories page', async ({ page }) => {
        await page.goto('/admin/categories')
        await expect(page).toHaveURL(/\/admin\/categories/, { timeout: 10000 })
    })

    test('student cannot access admin dashboard', async ({ page }) => {
        // logout first
        await page.locator('img[alt="user"]').click()
        await page.getByRole('button', { name: /log out/i }).first().click()
        await expect(page).toHaveURL(/\/login/, { timeout: 15000 })

        // login as student
        await page.waitForSelector('input[name="email"]', { timeout: 30000 })
        await page.fill('input[name="email"]', 'teststudent@gmail.com')
        await page.fill('input[name="password"]', 'TestPass123')
        await page.click('button[type="submit"]')
        await expect(page).toHaveURL(/\/student/, { timeout: 30000 })

        // try to access admin dashboard
        await page.goto('/admin')

        // should redirect to student dashboard
        await expect(page).toHaveURL(/\/student/, { timeout: 10000 })
    })
})
