<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Standar Wajib E2E Testing, Screenshot Verification & Login (MANDATORI - SETIAP FITUR / PERBAIKAN)

## 🧪 Aturan Wajib Pengujian Otomatis E2E (`tester-army/e2e`)

Untuk menjamin seluruh fitur baru dan perbaikan bug (fix) berfungsi secara nyata dari perspektif pengguna (*real-browser verified*) dan bebas dari regresi:

### 1. Eksekusi E2E Otomatis pada Setiap Pembuatan & Perbaikan Fitur
* **WAJIB HUKUMNYA** menjalankan pengujian E2E (`npx e2e run` atau `npm run test:e2e`) setelah menyelesaikan pembuatan fitur baru maupun perbaikan (fix) bug:
  ```bash
  npx e2e run tests/<feature>.e2e.ts
  # Atau jalankan seluruh suite e2e
  npm run test:e2e
  ```
* Dilarang menganggap pekerjaan selesai hanya berdasarkan unit test atau build pass semata tanpa bukti eksekusi E2E pada alur antarmuka yang bersangkutan.

### 2. Kredensial Otentikasi Baku untuk Pengujian HERO
Jika skenario pengetesan membutuhkan akses login ke dalam HERO, **WAJIB** menggunakan akun kredensial standar sistem berikut:
* **Username / NIK / SN**: `71261`
* **Password**: `Chitra#71261`
* Helper reusable dapat diimpor langsung dari `tests/e2e-auth-helper.ts`:
  ```typescript
  import { loginToHero } from '@/tests/e2e-auth-helper';
  // atau import { loginToHero } from '../tests/e2e-auth-helper';
  
  await loginToHero(app, screen, browser);
  ```

### 3. Wajib Pengambilan Tangkapan Layar (Screenshot / SS)
* Di setiap tes E2E fitur baru atau perbaikan, **WAJIB** mengambil screenshot pada momen kritis (kondisi form terisi, sesudah submit/aksi, atau pratinjau halaman hasil):
  ```typescript
  await app.screenshot('nama-momen-fitur');
  ```
* File tangkapan layar otomatis tersimpan di `.e2e/artifacts/web/.../screenshots/` dan dicatat dalam `.e2e/report.json`.

### 4. Wajib Memberikan Ringkasan & Lampiran Screenshot ke User
* Di akhir pengerjaan setiap fitur / perbaikan, Agent **WAJIB** menyajikan:
  1. **Summary Hasil Tes E2E**: Menampilkan status PASS/FAIL, durasi run, token AI yang terpakai, dan file tes yang dieksekusi.
  2. **Tangkapan Layar (Screenshot)**: Menampilkan/merujuk bukti visual UI hasil tangkapan layar E2E yang membuktikan alur fitur berjalan sesuai harapan.

