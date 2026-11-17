import { test as base } from '@playwright/test';
import { RegisterPage } from '../pages/register.page';
export { expect } from '@playwright/test';


type Pages = {
    registerPage: RegisterPage;
};

export const test = base.extend<Pages>({
    registerPage: async ({ page }, use) => {
        await use(new RegisterPage(page));
    },
});
