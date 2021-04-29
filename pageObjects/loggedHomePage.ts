import { Page } from 'playwright';
import { ProjectDetailsPage } from './projectDetailsPage';

export class LoggedInHomePage {
  page: Page;

  constructor(page) {
    this.page = page;
  }

  async clickEthereum(): Promise<void> {
    await this.page.click(`a[href='/dashboard/ethereum']`)
  }

  async clickCreateNewProject(): Promise<void> {
    await this.page.click(`[data-testid="create-project"]`)
  }

  async fillNewProjectNameForm(projectName: string): Promise<void> {
    await this.page.fill(`[data-testid="name"]`, projectName)
  }

  async submitNewProjectNameForm(): Promise<ProjectDetailsPage> {
    await this.page.click(`[data-testid="create-project-submit"]`)
    return new ProjectDetailsPage(this.page)
  }
}
