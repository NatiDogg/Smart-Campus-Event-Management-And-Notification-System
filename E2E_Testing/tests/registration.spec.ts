import { test, expect } from '@playwright/test'

test.describe('Event Registration Flow', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login')
        await page.waitForSelector('input[name="email"]', { timeout: 60000 })
        await page.fill('input[name="email"]', 'teststudent@gmail.com')
        await page.fill('input[name="password"]', 'TestPass123')
        await page.waitForSelector('button[type="submit"]', { timeout: 60000 })
        await page.click('button[type="submit"]')
        await expect(page).toHaveURL(/\/student/, { timeout: 60000 })
    })

    test('student can find event on events page', async ({ page }) => {
        await page.goto('/student/events')
        await page.waitForSelector('text=test event 12', { timeout: 30000 })
        await expect(page.getByText('test event 12', { exact: false })).toBeVisible()
    })

    test('student can click event card and see event details', async ({ page }) => {
        await page.goto('/student/events')
        await page.waitForSelector('text=test event 12', { timeout: 30000 })
        await page.getByText('test event 12', { exact: false }).first().click()
        await expect(page).toHaveURL(/\/student\/details\//, { timeout: 15000 })
        await expect(page.getByRole('heading', { name: /test event 12/i })).toBeVisible({ timeout: 10000 })
    })

    test('event details page shows register button', async ({ page }) => {
        await page.goto('/student/events')
        await page.waitForSelector('text=test event 12', { timeout: 30000 })
        await page.getByText('test event 12', { exact: false }).first().click()
        await expect(page).toHaveURL(/\/student\/details\//, { timeout: 15000 })

        const registerBtn = page.locator('button', { hasText: /register now/i })
        const registeredBtn = page.locator('button', { hasText: /registered/i })

        await expect(registerBtn.or(registeredBtn).first()).toBeVisible({ timeout: 10000 })
    })

    test('student can register for an event', async ({ page }) => {
        await page.goto('/student/events')
        await page.waitForSelector('text=test event 12', { timeout: 30000 })
        await page.getByText('test event 12', { exact: false }).first().click()
        await expect(page).toHaveURL(/\/student\/details\//, { timeout: 15000 })
        await page.waitForTimeout(2000)

        const registerBtn = page.locator('button', { hasText: /register now/i })
        const registeredBtn = page.locator('button', { hasText: /registered/i })

        if (await registerBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await registerBtn.click()
            await expect(registeredBtn).toBeVisible({ timeout: 15000 })
        } else {
            await expect(registeredBtn).toBeVisible({ timeout: 10000 })
        }
    })

    test('student can mark interest in an event', async ({ page }) => {
        await page.goto('/student/events')
        await page.waitForSelector('text=test event 12', { timeout: 30000 })
        await page.getByText('test event 12', { exact: false }).first().click()
        await expect(page).toHaveURL(/\/student\/details\//, { timeout: 15000 })
        await page.waitForTimeout(2000)

        const markInterestBtn = page.locator('button', { hasText: /mark interest/i })
        const interestedBtn = page.locator('button', { hasText: /interested/i })

        if (await markInterestBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
            await markInterestBtn.click()
            await expect(interestedBtn).toBeVisible({ timeout: 15000 })
        } else {
            await expect(interestedBtn).toBeVisible({ timeout: 10000 })
        }
    })
})





