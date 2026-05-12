import { test, expect } from '@playwright/test'

test.describe('Login Flow', () => {

    test('should load the login page', async ({ page }) => {
        await page.goto('/login')
        await expect(page).toHaveURL(/\/login/)
    })

    test('shows error toast on invalid credentials', async ({ page }) => {
        await page.goto('/login')

        await page.fill('input[name="email"]', 'wrong@test.com')
        await page.fill('input[name="password"]', 'wrongpassword')
        await page.click('button[type="submit"]')

        await expect(page.getByText('Invalid Credentials!')).toBeVisible({ timeout: 8000 })
    })

    test('redirects student to student dashboard on successful login', async ({ page }) => {
        await page.goto('/login')

        await page.fill('input[name="email"]', 'teststudent@gmail.com')
        await page.fill('input[name="password"]', 'TestPass123')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL(/\/student/, { timeout: 10000 })
    })

    test('redirects admin to admin dashboard on successful login', async ({ page }) => {
        await page.goto('/login')

        await page.fill('input[name="email"]', 'admin@gmail.com')
        await page.fill('input[name="password"]', '123456')
        await page.click('button[type="submit"]')

        await expect(page).toHaveURL(/\/admin/, { timeout: 10000 })
    })

    test('shows login page elements correctly', async ({ page }) => {
        await page.goto('/login')

        await expect(page.getByPlaceholder('Email')).toBeVisible()
        await expect(page.getByPlaceholder('Password')).toBeVisible()
        await expect(page.getByText('Login with Google')).toBeVisible()
        await expect(page.getByText('Forgot password?')).toBeVisible()
        await expect(page.getByText('Sign Up')).toBeVisible()
    })
})