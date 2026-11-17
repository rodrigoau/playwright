import { test, expect } from '@fixtures';

test.describe('Register', () => {
    test.beforeEach(async ({ registerPage }) => {
        await registerPage.goto();
    });

    test('Register new user', async ({ registerPage, page }) => {
        const email = `rodrigo+${Date.now()}@klauders.com`;

        await registerPage.register(
            'Rodrigo Ayala',
            email,
            'Klauders#2026',
            'Mexico',
            '1990-01-01'
        );

        await expect(page.getByTestId('register-flash')).toContainText(
            `Account created for ${email}`
        );
    });
});
