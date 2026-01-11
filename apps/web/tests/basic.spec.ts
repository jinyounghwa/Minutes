import { test, expect } from '@playwright/test';

test.describe('Basic Navigation', () => {
  test('should load the landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/MeetingNotes/);
    await expect(page.getByText('회의록 관리,')).toBeVisible();
  });

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '로그인' }).click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: '다시 오셨군요' })).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: '시작하기' }).click();
    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: '계정 만들기' })).toBeVisible();
  });
});

test.describe('Authentication', () => {
  const randomEmail = `test-${Math.random().toString(36).substring(7)}@example.com`;

  test('should register a new user and login', async ({ page }) => {
    page.on('console', msg => console.log('BROWSER:', msg.text()));

    // Register
    await page.goto('/register');
    await page.getByPlaceholder('홍길동').fill('테스트 유저');
    await page.getByPlaceholder('name@example.com').fill(randomEmail);
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: '계정 만들기' }).click();

    // If registration fails, let's see why
    try {
      await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
    } catch (e) {
      const errorMsg = await page.locator('.text-red-500').textContent();
      console.log('Registration error:', errorMsg);
      throw e;
    }
    
    // After registration, it should redirect to login page
    await expect(page).toHaveURL(/\/login/);
    
    // Login
    await page.getByPlaceholder('name@example.com').fill(randomEmail);
    await page.getByPlaceholder('••••••••').fill('password123');
    await page.getByRole('button', { name: '로그인', exact: true }).click();

    // After login, it should redirect to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/환영합니다/)).toBeVisible();
  });
});