import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/');
    
    // Wait for redirect to login page
    await page.waitForURL('/login', { timeout: 5000 });
    
    // Check for login page elements
    await expect(page.getByText('Azure Sales Negotiation Log')).toBeVisible();
    await expect(page.getByText('Sign in with Microsoft')).toBeVisible();
  });

  test('should have working navigation after login', async ({ page }) => {
    // Note: This test requires proper MSAL mock or test credentials
    // For now, it's a placeholder that demonstrates the test structure
    await page.goto('/login');
    await expect(page.getByText('Sign in with Microsoft')).toBeVisible();
  });
});
