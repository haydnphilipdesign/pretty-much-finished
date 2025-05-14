import { test, expect } from '@playwright/test';

test.describe('Transaction Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/agent-portal');
  });

  test('submits form with valid data', async ({ page }) => {
    // Fill in property data
    await page.fill('[data-testid="mls-number"]', '123456');
    await page.fill('[data-testid="property-address"]', '123 Main St');
    await page.fill('[data-testid="sale-price"]', '500000');

    // Fill in agent role
    await page.selectOption('[data-testid="agent-role"]', 'Listing Agent');

    // Fill in client information
    await page.fill('[data-testid="client-name"]', 'John Doe');
    await page.fill('[data-testid="client-email"]', 'john@example.com');

    // Submit form
    await page.click('[data-testid="submit-button"]');

    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test('validates required fields', async ({ page }) => {
    // Try to submit without filling required fields
    await page.click('[data-testid="submit-button"]');

    // Verify error messages
    await expect(page.locator('[data-testid="mls-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="address-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="price-error"]')).toBeVisible();
  });

  test('handles multiple clients', async ({ page }) => {
    // Fill in property data
    await page.fill('[data-testid="mls-number"]', '123456');
    await page.fill('[data-testid="property-address"]', '123 Main St');
    await page.fill('[data-testid="sale-price"]', '500000');

    // Add first client
    await page.fill('[data-testid="client-name"]', 'John Doe');
    await page.fill('[data-testid="client-email"]', 'john@example.com');

    // Click add client button
    await page.click('[data-testid="add-client"]');

    // Add second client
    await page.fill('[data-testid="client-name-2"]', 'Jane Doe');
    await page.fill('[data-testid="client-email-2"]', 'jane@example.com');

    // Submit form
    await page.click('[data-testid="submit-button"]');

    // Verify success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test('handles form validation errors', async ({ page }) => {
    // Fill in invalid data
    await page.fill('[data-testid="mls-number"]', 'invalid');
    await page.fill('[data-testid="sale-price"]', '-100');
    await page.fill('[data-testid="client-email"]', 'invalid-email');

    // Submit form
    await page.click('[data-testid="submit-button"]');

    // Verify validation error messages
    await expect(page.locator('[data-testid="mls-error"]')).toContainText('Invalid MLS number');
    await expect(page.locator('[data-testid="price-error"]')).toContainText('Invalid price');
    await expect(page.locator('[data-testid="email-error"]')).toContainText('Invalid email');
  });
});