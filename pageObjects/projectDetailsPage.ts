import { Page } from 'playwright'
import { sleep } from '../utils/wait'

export class ProjectDetailsPage {
  page: Page

  constructor(page) {
    this.page = page
  }

  async getProjectId(): Promise<string> {
    return this.page.innerText(`[data-testid="project-id"]`)
  }

  async getProjectSecret(): Promise<string> {
    return this.page.innerText(`[data-testid="project-private"]`)
  }

  async getCurrentNumOfRequests(): Promise<string> {
    // TODO: Remove this in favour of a more explicit wait!
    await sleep(500)
    const requests = await this.page.innerText(`h2.text-secondary`)
    return requests.replace(',','').slice(0,-2)
  }

  async clickRequestTab(): Promise<void> {
    return this.page.click(`//a[text()='Requests']`)
  }
}
