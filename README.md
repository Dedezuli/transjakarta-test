# Technical Test – Playwright Automation (PT Transportasi Jakarta)

Automation test untuk 4 skenario di [demoqa.com](https://demoqa.com) menggunakan **Playwright + TypeScript** dengan pola **Page Object Model (POM)**.

| No | Skenario | URL | File test |
|----|----------|-----|-----------|
| 1 | Bulk insert user dari CSV ke Web Tables | https://demoqa.com/webtables | `tests/webTables.spec.ts` |
| 2 | Drag and Drop (Droppable) | https://demoqa.com/droppable | `tests/droppable.spec.ts` |
| 3 | Resize elemen menjadi 400 × 200 px | https://demoqa.com/resizable | `tests/resizable.spec.ts` |
| 4 | Student Registration Form + verifikasi popup | https://demoqa.com/automation-practice-form | `tests/practiceForm.spec.ts` |

## Struktur Project

```
transJakarta/
├── tests/                      # Skenario test
│   ├── webTables.spec.ts
│   ├── droppable.spec.ts
│   ├── resizable.spec.ts
│   └── practiceForm.spec.ts
├── pages/                      # Class per halaman berisi aksi (method)
│   ├── BasePage.ts             # open(), blokir iklan, sembunyikan overlay
│   ├── WebTablesPage.ts
│   ├── DroppablePage.ts
│   ├── ResizablePage.ts
│   └── PracticeFormPage.ts
├── locators/                   # Selector elemen per halaman
│   ├── webTables.locators.ts
│   ├── droppable.locators.ts
│   ├── resizable.locators.ts
│   └── practiceForm.locators.ts
├── data/                       # Data test
│   ├── users.csv               # 10 user untuk bulk insert
│   ├── csvReader.ts            # Parser CSV -> object
│   ├── studentForm.json        # Data Student Registration Form
│   ├── resizable.json          # Target ukuran 400 x 200
│   └── sample-picture.png      # File untuk upload picture
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

Pembagian tanggung jawab:
- **tests** hanya berisi alur skenario dan assertion, tanpa selector.
- **pages** berisi aksi per halaman (`addUser`, `dragAndDrop`, `resizeTo`, `fillForm`, dll.).
- **locators** berisi selector, sehingga jika UI berubah cukup diubah di satu tempat.
- **data** berisi data test yang terpisah dari kode.

## Prasyarat

- Node.js 18 atau lebih baru (`node -v`)
- npm

## Instalasi

```bash
npm install
npx playwright install chromium
```

## Menjalankan Test

```bash
# Semua test (headless)
npm test

# Semua test dengan browser terlihat (untuk rekaman video)
npm run test:headed

# Per soal
npm run test:webtables
npm run test:droppable
npm run test:resizable
npm run test:form

# Mode UI interaktif Playwright
npx playwright test --ui
```

## Laporan

```bash
npm run report
```

Laporan HTML dibuat di folder `playwright-report/`. Screenshot, video, dan trace otomatis disimpan di `test-results/` untuk test yang gagal.

## Catatan Implementasi

- **Soal 1**: data dibaca dari `data/users.csv` dengan `csv-parse`. Setelah semua user ditambahkan, setiap user diverifikasi lewat kotak search (berdasarkan email). Cara ini membuat verifikasi tidak terpengaruh pagination tabel (default 10 baris per halaman), dan setiap kolom (first name, last name, age, email, salary, department) dicek.
- **Soal 2**: drag and drop memakai gerakan mouse bertahap karena demoqa menggunakan jQuery UI. Verifikasi: teks target berubah menjadi `Dropped!`, class highlight muncul, dan posisi elemen berada di dalam area target. Ada juga skenario tambahan untuk tab **Accept** (elemen *Not Acceptable* ditolak, *Acceptable* diterima).
- **Soal 3**: handle kanan-bawah ditarik sebesar selisih ukuran saat ini dengan target, dengan koreksi otomatis untuk pembulatan sub-piksel. Verifikasi memakai `offsetWidth` dan `offsetHeight` = 400 × 200.
- **Soal 4**: semua field diisi dari `data/studentForm.json`, termasuk date picker, subjects (autocomplete), hobbies, upload gambar, serta State dan City. Setiap baris pada popup konfirmasi dibandingkan dengan data yang diharapkan.
- **Iklan demoqa** diblokir lewat `page.route` di `BasePage`, dan banner/footer disembunyikan agar tidak menutupi tombol.

## Mengubah Data Test

- Tambah atau ubah user: edit `data/users.csv` (header: `firstName,lastName,email,age,salary,department`).
- Ubah data form: edit `data/studentForm.json`.
- Ubah target ukuran resize: edit `data/resizable.json` (batas elemen di demoqa: min 150×150, max 500×300).
