import { Page, expect } from '@playwright/test';
import path from 'path';
import { BasePage } from './BasePage';
import { PracticeFormLocators as L } from '../locators/practiceForm.locators';

export interface StudentData {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  mobile: string;
  dateOfBirth: { day: string; month: string; year: string };
  subjects: string[];
  hobbies: string[];
  picture: string;
  currentAddress: string;
  state: string;
  city: string;
}

export class PracticeFormPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto(): Promise<void> {
    await this.open('/automation-practice-form');
    await expect(this.page.locator(L.firstNameInput)).toBeVisible();
  }

  async fillName(firstName: string, lastName: string): Promise<void> {
    await this.page.locator(L.firstNameInput).fill(firstName);
    await this.page.locator(L.lastNameInput).fill(lastName);
  }

  async fillEmail(email: string): Promise<void> {
    await this.page.locator(L.emailInput).fill(email);
  }

  async selectGender(gender: string): Promise<void> {
    await this.page.locator(L.genderLabel(gender)).click();
  }

  async fillMobile(mobile: string): Promise<void> {
    await this.page.locator(L.mobileInput).fill(mobile);
  }

  async selectDateOfBirth(day: string, month: string, year: string): Promise<void> {
    await this.page.locator(L.dateOfBirthInput).click();
    await this.page.locator(L.monthSelect).selectOption({ label: month });
    await this.page.locator(L.yearSelect).selectOption(year);
    await this.page.locator(L.dayOption(day)).click();
  }

  private async chooseFromReactSelect(inputSelector: string, value: string): Promise<void> {
    const input = this.page.locator(inputSelector);
    await input.click();
    // jangan pakai Enter, form bisa ke-submit
    await input.pressSequentially(value, { delay: 30 });
    const option = this.page.locator(L.selectOption(value)).first();
    await expect(option).toBeVisible();
    await option.click();
  }

  async addSubjects(subjects: string[]): Promise<void> {
    for (const subject of subjects) {
      await this.chooseFromReactSelect(L.subjectsInput, subject);
    }
  }

  async selectHobbies(hobbies: string[]): Promise<void> {
    for (const hobby of hobbies) {
      await this.page.locator(L.hobbyLabel(hobby)).click();
    }
  }

  async uploadPicture(fileName: string): Promise<void> {
    const filePath = path.resolve(__dirname, '../data', fileName);
    await this.page.locator(L.uploadPictureInput).setInputFiles(filePath);
  }

  async fillAddress(address: string): Promise<void> {
    await this.page.locator(L.currentAddressInput).fill(address);
  }

  async selectStateAndCity(state: string, city: string): Promise<void> {
    await this.chooseFromReactSelect(L.stateInput, state);
    await this.chooseFromReactSelect(L.cityInput, city);
  }

  async submit(): Promise<void> {
    const button = this.page.locator(L.submitButton);
    await button.scrollIntoViewIfNeeded();
    await button.click();
  }

  async fillForm(data: StudentData): Promise<void> {
    await this.fillName(data.firstName, data.lastName);
    await this.fillEmail(data.email);
    await this.selectGender(data.gender);
    await this.fillMobile(data.mobile);
    await this.selectDateOfBirth(data.dateOfBirth.day, data.dateOfBirth.month, data.dateOfBirth.year);
    await this.addSubjects(data.subjects);
    await this.selectHobbies(data.hobbies);
    await this.uploadPicture(data.picture);
    await this.fillAddress(data.currentAddress);
    await this.selectStateAndCity(data.state, data.city);
  }

  async getConfirmationData(): Promise<Record<string, string>> {
    await expect(this.page.locator(L.modalTitle)).toHaveText('Thanks for submitting the form');
    const rows = this.page.locator(L.modalTableRows);
    const result: Record<string, string> = {};
    for (const row of await rows.all()) {
      const cells = row.locator('td');
      const label = (await cells.nth(0).innerText()).trim();
      const value = (await cells.nth(1).innerText()).trim();
      result[label] = value;
    }
    return result;
  }

  static expectedConfirmation(data: StudentData): Record<string, string> {
    const { day, month, year } = data.dateOfBirth;
    return {
      'Student Name': `${data.firstName} ${data.lastName}`,
      'Student Email': data.email,
      Gender: data.gender,
      Mobile: data.mobile,
      'Date of Birth': `${day.padStart(2, '0')} ${month},${year}`,
      Subjects: data.subjects.join(', '),
      Hobbies: data.hobbies.join(', '),
      Picture: data.picture,
      Address: data.currentAddress,
      'State and City': `${data.state} ${data.city}`,
    };
  }
}
