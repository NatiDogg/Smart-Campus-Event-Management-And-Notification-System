import { test, expect } from '@playwright/test'

test.describe('Logout Flow', () => {

    test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    
    // wait for the form to be ready before filling
    await page.waitForSelector('input[name="email"]', { timeout: 30000 })
    
    await page.fill('input[name="email"]', 'teststudent@gmail.com')
    await page.fill('input[name="password"]', 'TestPass123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/student/, { timeout: 30000 })
})

    test('logs out and redirects to login page', async ({ page }) => {
        // click profile image to open dropdown
        await page.locator('img[alt="user"]').click()

        // wait for dropdown to appear then click Log Out
        await page.getByRole('button', { name: /log out/i }).first().click()

        // should redirect to login
        await expect(page).toHaveURL(/\/login/, { timeout: 15000 })
    })

    test('cannot access protected route after logout', async ({ page }) => {
        // logout
        await page.locator('img[alt="user"]').click()
        await page.getByRole('button', { name: /log out/i }).first().click()
        await expect(page).toHaveURL(/\/login/, { timeout: 15000 })

        // try to access student dashboard directly
        await page.goto('/student')

        // should redirect back to login
        await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
    })

    test('shows success toast on logout', async ({ page }) => {
        await page.locator('img[alt="user"]').click()
        await page.getByRole('button', { name: /log out/i }).first().click()

        await expect(page.getByText('Logged out Successfully!')).toBeVisible({ timeout: 8000 })
    })
})





