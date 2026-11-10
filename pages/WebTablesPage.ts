import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { WebTablesLocators as L } from '../locators/webTables.locators';
import { WebTableUser } from '../data/csvReader';

export class WebTablesPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open('/webtables');
    await expect(this.page.locator(L.addButton)).toBeVisible();
  }

  async addUser(user: WebTableUser): Promise<void> {
    await this.page.locator(L.addButton).click();
    const modal = this.page.locator(L.modal);
    await expect(modal).toBeVisible();

    await this.page.locator(L.firstNameInput).fill(user.firstName);
    await this.page.locator(L.lastNameInput).fill(user.lastName);
    await this.page.locator(L.emailInput).fill(user.email);
    await this.page.locator(L.ageInput).fill(user.age);
    await this.page.locator(L.salaryInput).fill(user.salary);
    await this.page.locator(L.departmentInput).fill(user.department);
    await this.page.locator(L.submitButton).click();

    await expect(modal).toBeHidden();
  }

  async addUsers(users: WebTableUser[]): Promise<void> {
    for (const user of users) {
      await this.addUser(user);
    }
  }

  async search(keyword: string): Promise<void> {
    await this.page.locator(L.searchBox).fill(keyword);
  }

  async clearSearch(): Promise<void> {
    await this.page.locator(L.searchBox).fill('');
  }

  rowByEmail(email: string): Locator {
    return this.page.locator(L.tableRow).filter({ hasText: email });
  }

  async expectUserInTable(user: WebTableUser): Promise<void> {
    await this.search(user.email);
    const row = this.rowByEmail(user.email);
    await expect(row).toHaveCount(1);

    for (const value of [user.firstName, user.lastName, user.age, user.email, user.salary, user.department]) {
      await expect(row).toContainText(value);
    }
  }
}
