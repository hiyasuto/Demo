import { test, expect } from '@playwright/test';

test.describe('Dashboard', () => {
  test.skip('should display dashboard stats', async ({ page }) => {
    // This test requires authentication setup
    // Skip for now until proper test authentication is configured
    await page.goto('/dashboard');
    
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Total Customers')).toBeVisible();
    await expect(page.getByText('Active Deals')).toBeVisible();
    await expect(page.getByText('Total Interactions')).toBeVisible();
  });
});
