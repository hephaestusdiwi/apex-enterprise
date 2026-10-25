import { test, expect, Page } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'

test.describe('Admin Panel', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    await seedTestUser()

    const context = await browser.newContext()
    page = await context.newPage()

    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('can navigate to dashboard', async () => {
    await page.goto('http://localhost:3000/admin')
    await expect(page).toHaveURL('http://localhost:3000/admin')
    const dashboardArtifact = page.locator('span[title="Dashboard"]').first()
    await expect(dashboardArtifact).toBeVisible()
  })

  test('can navigate to list view', async () => {
    await page.goto('http://localhost:3000/admin/collections/users')
    await expect(page).toHaveURL('http://localhost:3000/admin/collections/users')
    const listViewArtifact = page.locator('h1', { hasText: 'Users' }).first()
    await expect(listViewArtifact).toBeVisible()
  })

  test('can open the invite form from the list view', async () => {
    // User baru hanya lewat undangan email (tidak ada Create New dan tidak ada password sementara).
    await page.goto('http://localhost:3000/admin/collections/users')
    await page.getByRole('button', { name: 'Undang user' }).click()
    await expect(page.locator('form[aria-label="Undang user"] input[name="email"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toHaveCount(0)
  })

  test('can navigate to edit view', async () => {
    await page.goto('http://localhost:3000/admin/collections/users')
    await page.getByRole('link', { name: testUser.email }).first().click()
    await expect(page).toHaveURL(/\/admin\/collections\/users\/[a-zA-Z0-9-_]+/)
    await expect(page.locator('input[name="email"]')).toBeVisible()
    await expect(page.locator('section[aria-label="Akun user"]')).toBeVisible()
  })
})
