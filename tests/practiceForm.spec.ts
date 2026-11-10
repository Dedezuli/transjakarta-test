import { test, expect } from '@playwright/test';
import { PracticeFormPage, StudentData } from '../pages/PracticeFormPage';
import studentData from '../data/studentForm.json';

const student: StudentData = studentData;

test.describe('Soal 4 - Student Registration Form', () => {
  test('mengisi dan submit form, lalu data di popup konfirmasi sesuai', async ({ page }) => {
    const form = new PracticeFormPage(page);

    await test.step('Buka halaman Practice Form', async () => {
      await form.goto();
    });

    await test.step('Isi seluruh field form', async () => {
      await form.fillForm(student);
    });

    await test.step('Submit form', async () => {
      await form.submit();
    });

    await test.step('Verifikasi data di popup konfirmasi', async () => {
      const actual = await form.getConfirmationData();
      const expected = PracticeFormPage.expectedConfirmation(student);

      for (const [label, value] of Object.entries(expected)) {
        expect.soft(actual[label], `Field "${label}"`).toBe(value);
      }
    });
  });
});
