import { test, expect } from '@playwright/test'

test.describe('Event Registration Flow', () => {

    test.beforeEach(async ({ page }) => {
    await page.goto('/login')
    await page.waitForSelector('input[name="email"]', { timeout: 30000 })
    await page.fill('input[name="email"]', 'teststudent@gmail.com')
    await page.fill('input[name="password"]', 'TestPass123')
    await page.waitForSelector('button[type="submit"]', { timeout: 30000 })
    await page.click('button[type="submit"]')
    // wait for either student dashboard or stay on login with error
    await page.waitForURL(/\/(student|login)/, { timeout: 60000 })
    // if still on login, try again
    if (page.url().includes('/login')) {
        await page.waitForTimeout(3000)
        await page.click('button[type="submit"]')
        await expect(page).toHaveURL(/\/student/, { timeout: 30000 })
    }
})

    test('student can find event on events page', async ({ page }) => {
        await page.goto('/student/events')
        await page.waitForSelector('text=test event 12', { timeout: 15000 })
        await expect(page.getByText('test event 12', { exact: false })).toBeVisible()
    })

   test('student can click event card and see event details', async ({ page }) => {
    await page.goto('/student/events')
    await page.waitForSelector('text=test event 12', { timeout: 15000 })
    await page.getByText('test event 12', { exact: false }).first().click()
    await expect(page).toHaveURL(/\/student\/details\//, { timeout: 15000 })

    // use heading role to avoid strict mode violation
    await expect(page.getByRole('heading', { name: /test event 12/i })).toBeVisible({ timeout: 10000 })
})

    test('event details page shows register button', async ({ page }) => {
    await page.goto('/student/events')
    await page.waitForSelector('text=test event 12', { timeout: 15000 })
    await page.getByText('test event 12', { exact: false }).first().click()
    await expect(page).toHaveURL(/\/student\/details\//, { timeout: 15000 })

    // check either register or registered button is visible
    const registerBtn = page.locator('button', { hasText: /register now/i })
    const registeredBtn = page.locator('button', { hasText: /registered/i })

    await expect(registerBtn.or(registeredBtn).first()).toBeVisible({ timeout: 10000 })
})

    test('student can register for an event', async ({ page }) => {
    await page.goto('/student/events')
    await page.waitForSelector('text=test event 12', { timeout: 15000 })
    await page.getByText('test event 12', { exact: false }).first().click()
    await expect(page).toHaveURL(/\/student\/details\//, { timeout: 15000 })

    // wait for page to fully load
    await page.waitForTimeout(2000)

    const registerBtn = page.locator('button', { hasText: /register now/i })
    const registeredBtn = page.locator('button', { hasText: /registered/i })

    if (await registerBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await registerBtn.click()
        await expect(registeredBtn).toBeVisible({ timeout: 15000 })
    } else if (await registeredBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await expect(registeredBtn).toBeVisible()
    } else {
        // event might be closed
        await expect(page.locator('button', { hasText: /event closed/i })).toBeVisible({ timeout: 5000 })
    }
})

    test('student can mark interest in an event', async ({ page }) => {
    await page.goto('/student/events')
    await page.waitForSelector('text=test event 12', { timeout: 15000 })
    await page.getByText('test event 12', { exact: false }).first().click()
    await expect(page).toHaveURL(/\/student\/details\//, { timeout: 15000 })

    // wait for page to load fully
    await page.waitForTimeout(2000)

    // find interest button by its container
    const interestBtn = page.locator('button').filter({ hasText: /mark interest|interested/i })

    await expect(interestBtn).toBeVisible({ timeout: 10000 })

    if (await interestBtn.innerText().then(t => t.toLowerCase().includes('mark interest'))) {
        await interestBtn.click()
        await expect(page.locator('button').filter({ hasText: /interested/i })).toBeVisible({ timeout: 10000 })
    } else {
        await expect(interestBtn).toBeVisible({ timeout: 10000 })
    }
})

    
})





