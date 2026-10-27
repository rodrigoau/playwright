import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('');
});

test.describe('Klauders', async () => {
  test('Should have the correct title', { tag: '@smoke' }, async ({ page }) => {
    await expect(page).toHaveTitle('Automation Playground for Selenium, Cypress & Playwright | Klauders');
  });

  test('Fill login form', { tag: ['@regression', '@smoke'] },async ({ page }) => {
    await page.locator('#login-username').fill('qa.engineer');
    await page.locator('#login-password').fill('Klauders#2026');
    await page.locator('#login-submit').click();
    await expect(page.locator('#session-name'), "The banner should display the correct user name").toHaveText('admin');
  });


});