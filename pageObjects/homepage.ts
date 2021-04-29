import { Page } from 'playwright';
import { LoggedInHomePage } from './loggedHomePage';

export class HomePage {
  page: Page;
  URL: string = 'https://infura.io'
  SIGN_UP_SELECTOR: string = 'text="Sign Up"'
  // TODO: Extract all selectors in const

  constructor(page) {
    this.page = page;
  }
  async navigate(): Promise<void> {
    await this.page.goto(this.URL);
  }

  async openSignUpMenu(): Promise<void> {
    await this.page.click(this.SIGN_UP_SELECTOR);
  }

  async clickLogIn(): Promise<void> {
    await this.page.click('text=Login');
  }

  async fillLoginForm(username: string, password: string): Promise<void> {
    await this.page.fill("#email", username);
    await this.page.fill("#password", password);
  }

  async submitLogInForm(): Promise<LoggedInHomePage> {
    await this.page.click('text="Submit"')
    return new LoggedInHomePage(this.page)
  }
}
