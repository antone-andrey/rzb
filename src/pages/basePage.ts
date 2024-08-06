import { Page } from '@playwright/test';

export class BasePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = '') {
    const baseURL = process.env.BASE_URL || '';
    await this.page.goto(`${baseURL}${path}`);
  }

  async getTitle(): Promise<string> {
    return this.page.title();
  }
}
