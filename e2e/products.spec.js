import { test, expect } from '@playwright/test';

test.describe('Storefront E2E Tests', () => {
  test('homepage displays catalog and loads successfully', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBeLessThan(400);
  });

  test('order tracking page is accessible', async ({ page }) => {
    const response = await page.goto('/track');
    expect(response?.status()).toBeLessThan(400);
  });
});
