import { test, expect, type Page } from '@playwright/test';

const REGISTER_API = '**/automate-the-internet.php?api=register';

const uniqueEmail = () => `rodrigo+${Date.now()}@klauders.com`;

async function fillRegisterForm(page: Page, email: string) {
  await page.getByTestId('reg-fullname').fill('Rodrigo Ayala');
  await page.getByTestId('reg-email').fill(email);
  await page.getByTestId('reg-password').fill('Klauders#2026');
  await page.getByTestId('reg-country').selectOption({ label: 'Mexico' });
  await page.getByTestId('reg-birthdate').fill('1990-01-01');
  await page.getByTestId('plan-enterprise').check();
  await page.getByTestId('reg-terms').check();
}

test.beforeEach(async ({ page }) => {
  await page.goto('');
});

test.describe('Register', () => {

  test('Register new user - e2e and API validation', async ({ page }) => {
    const email = uniqueEmail();
    await test.step('Enter new user details', async () => {
      await fillRegisterForm(page, email);
    });

    const response = await test.step('Submit registration', async () => {
      const responsePromise = page.waitForResponse(
        r => r.url().includes('api=register') && r.request().method() === 'POST'
      );
      await page.getByTestId('register-submit').click();
      return responsePromise;
    });

    await test.step('Validate API request and response', async () => {
      expect(response.request().postDataJSON()).toMatchObject({
        fullName: 'Rodrigo Ayala',
        email,
        country: 'MX',
        birthdate: '1990-01-01',
        plan: 'enterprise',
        terms: true,
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body).toMatchObject({ message: 'Account created.', email, plan: 'enterprise' });
      expect(body.userId).toEqual(expect.any(Number));
    });

    await test.step('Validate success message in UI', async () => {
      const body = await response.json();
      await expect(page.getByTestId('register-flash')).toContainText(
        `Account created for ${email} (user #${body.userId}, enterprise plan).`
      );
    });
  });

  test('Register new user - mocked API success', async ({ page }) => {
    const email = uniqueEmail();

    await test.step('Mock register API', async () => {
      await page.route(REGISTER_API, route =>
        route.fulfill({
          status: 201,
          json: {
            message: 'Account created.',
            userId: 999,
            email,
            plan: 'enterprise',
            requestId: 'req_mock',
          },
        })
      );
    });

    await test.step('Enter new user details and submit', async () => {
      await fillRegisterForm(page, email);
      await page.getByTestId('register-submit').click();
    });

    await test.step('Validate UI shows mocked result', async () => {
      await expect(page.getByTestId('register-flash')).toContainText('user #999');
    });
  });
});
