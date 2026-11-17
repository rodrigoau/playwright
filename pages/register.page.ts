import { Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
    readonly path = '/automate-the-internet.php?lang=en';
    readonly fullNameInput: Locator = this.page.getByTestId('reg-fullname');
    readonly emailInput: Locator = this.page.getByTestId('reg-email');
    readonly passwordInput: Locator = this.page.getByTestId('reg-password');
    readonly countrySelect: Locator = this.page.getByTestId('reg-country');
    readonly birthdateInput: Locator = this.page.getByTestId('reg-birthdate');
    readonly planEnterpriseRadio: Locator = this.page.getByTestId('plan-enterprise');
    readonly termsCheckbox: Locator = this.page.getByTestId('reg-terms');
    readonly submitButton: Locator = this.page.getByTestId('register-submit');


    async register(fullName: string, email: string, password: string, country: string, birthdate: string) {
        await this.fullNameInput.fill(fullName);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.countrySelect.selectOption({ label: country });
        await this.birthdateInput.fill(birthdate);
        await this.planEnterpriseRadio.check();
        await this.termsCheckbox.check();
        await this.submitButton.click();
    }
}