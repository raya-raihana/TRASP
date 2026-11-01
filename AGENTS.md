<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 🏆 TRASP AGENTIC ENGINEERING & COMPETITION DIRECTIVE
> **Kompetisi:** Web Development MIT-WEEK 2026 Universitas Mulawarman  
> **Tema:** *“Guardians of the Digital Space – Empowering Today’s Generation Toward a Safer Cyber Ecosystem”*  
> **Misi:** Juara 1 Nasional — Web Cyber-Forensic Berstandar Google DX & Zero-Crash Resilient Architecture.

---

## 🎯 1. RUBRIK PENILAIAN JUKNIS MIT-WEEK 2026 (SCORE MAXIMIZER)

Setiap baris kode, fitur, dan dokumen yang dibuat oleh Agen **WAJIB** tunduk pada bobot penilaian dewan juri:

| Aspek Penilaian | Bobot Babak Awal | Bobot Babak Final | Kriteria Keberhasilan Mutlak |
| :--- | :---: | :---: | :--- |
| **Fungsionalitas** | **35%** | **25%** | **Zero-Crash & Live Verified:** Tidak boleh ada link 404, tidak ada tombol mati, seluruh fitur interaktif berjalan 100% di live Vercel. Wajib ada *deterministic local fallback* jika API eksternal timeout/offline. |
| **Kesesuaian Studi Kasus** | **25%** | **20%** | **Relevansi Nyata Indonesia:** Membedah modus riil (Trojan APK perbankan, Quishing QRIS, Task Scam/Deposit loker, Impersonasi OJK/Coretax). Menyajikan landasan hukum UU ITE No. 1/2024 & portal IASC OJK 157. |
| **UI / UX Experience** | **20%** | **15%** | **Mobile-First & Anti-AI Aesthetic:** 70%+ juri menguji dari HP. Tombol sentuh minimal 44px, no horizontal scroll, micro-interaction halus, dan 4-state matrix di setiap komponen. |
| **Kualitas Kode & Maintenance** | **10%** | **10%** | **Clean Architecture & Strict TS:** Zero lint error, modular components, guard clauses, dan STRIDE threat validation di setiap input. |
| **Dokumentasi & Video Demo** | **10%** | **10%** | **Transparan & Terstruktur:** README.md lengkap (arsitektur, panduan run, atribusi lisensi third-party) serta naskah video demo 5 menit. |
| **Presentasi & Q&A** | - | **20%** | Penguasaan arsitektur, alasan pemilihan tech stack, dan justifikasi keputusan teknis di hadapan dewan juri. |

---

## 🌐 2. ADDY OSMANI ENGINEERING CODEX (GOOGLE BENCHMARK)

Mengadopsi prinsip teknik dari Head of Chrome Developer Experience Google, Addy Osmani (`addyosmani/agent-skills`):

### A. Membasmi "AI Aesthetic" (Anti-Template Basi AI)
- **DILARANG:** Gradien ungu/indigo murahan di mana-mana, sudut bulat raksasa (`rounded-3xl` / `rounded-full`), padding berlebihan yang membuang layar HP, dan shadow bertumpuk yang membebani GPU perangkat.
- **GUNAKAN:** Estetika **Neo-Brutalist Cyber-Forensic**:
  - Palet warna tegas dan berbobot: Slate, Zinc, Emerald terminal, Crimson alert, Amber warning.
  - Border tajam 1px–2px dengan rasio kontras tinggi ($\ge 4.5:1$).
  - Tata letak padat data (*high-density forensic dashboard*) yang terlihat seperti karya senior engineer di industri keamanan siber, bukan template generatif.

### B. Matriks 4-State Wajib Setiap Komponen UI
Setiap komponen interaktif tidak boleh hanya memiliki tampilan sukses. Wajib mengimplementasikan 4 state:
1. **Empty State:** Panduan instruktif saat belum ada data (ikon relevan, teks ramah, dan tombol preset contoh kasus).
2. **Loading State:** Skeleton loader atau progress halus yang menjaga tata letak tetap stabil (Zero CLS).
3. **Success State:** Tampilan hasil analisis/percakapan yang terstruktur dan mudah dipindai mata.
4. **Error / Fallback State:** Tampilan ramah pengguna saat terjadi kegagalan jaringan, disertai tombol coba lagi (*Retry*).

### C. Web Performance & Core Web Vitals (Google Benchmarks)
- **LCP (Largest Contentful Paint) $\le$ 2.5 Detik:** Konten utama langsung tampil seketika saat juri membuka link Vercel.
- **INP (Interaction to Next Paint) $\le$ 200 Milidetik:** Klik tombol dan tab navigasi merespons instan tanpa lag di main thread.
- **CLS (Cumulative Layout Shift) $\le$ 0.1:** Tidak ada elemen yang melompat tiba-tiba saat data atau font termuat.
- **Mobile Touch Target:** Seluruh tombol dan elemen interaktif minimal berukuran **44x44px** untuk kemudahan navigasi jari di layar sentuh HP.

---

## 🛡️ 3. SECURITY & DEFENSE-IN-DEPTH (TEMA LOMBA)

1. **On-Device Data Redaction:** Sensor nomor telepon, NIK, nomor kartu, dan rekening bank di canvas sisi klien sebelum data diproses, sesuai UU Perlindungan Data Pribadi (UU PDP No. 27/2022).
2. **Zero XSS:** Dilarang keras menggunakan `dangerouslySetInnerHTML` tanpa sanitasi token parser internal yang aman.
3. **Input Sanitization:** Validasi ketat seluruh payload data antar-komponen dan API routes menggunakan skema Zod.
4. **Edu-Disclaimer:** Wajib menyertakan edukasi disclaimer bahwa sistem memberikan indikator forensik edukatif dan bukan jaminan mutlak 100%.

---

## 🧪 4. STANDAR WAJIB E2E TESTING & SCREENSHOT VERIFICATION (`tester-army/e2e`)

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

---

## 🐎 5. PRINSIP MINIMALIS PONYTAIL (SMALL COMPLETE CHANGES)

1. **Does it need to exist?** Jangan buat fitur/halaman yang tidak diminta oleh juknis lomba.
2. **Already in codebase?** Maksimalkan komponen yang sudah ada (`@/components/ui`, Lucide icons, Radix primitives).
3. **Platform API first:** Utamakan Canvas API, Regex, dan Web APIs sebelum menambah library baru.
4. **Flat Control Flow:** Gunakan guard clauses dan early return; hindari percabangan if-else bersarang.
5. **No Broken Deploys:** Selalu uji `npm run build` sebelum menyelesaikan pekerjaan agar live deployment Vercel tetap 100% stabil.


