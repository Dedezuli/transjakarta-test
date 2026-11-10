import { test } from '@playwright/test';
import { WebTablesPage } from '../pages/WebTablesPage';
import { readUsers } from '../data/csvReader';

const users = readUsers();

test.describe('Soal 1 - Bulk Insert User di Web Tables', () => {
  test(`menambahkan ${users.length} user dari CSV dan semuanya tampil di tabel`, async ({ page }) => {
    const webTables = new WebTablesPage(page);

    await test.step('Buka halaman Web Tables', async () => {
      await webTables.goto();
    });

    await test.step(`Bulk insert ${users.length} user dari data/users.csv`, async () => {
      await webTables.addUsers(users);
    });

    await test.step('Verifikasi semua user tampil di tabel', async () => {
      for (const user of users) {
        await test.step(`${user.firstName} ${user.lastName} (${user.email})`, async () => {
          await webTables.expectUserInTable(user);
          await webTables.screenshot(`user ${user.firstName} ${user.lastName}`);
        });
      }
      await webTables.clearSearch();
      await webTables.screenshot('tabel semua user');
    });
  });
});
