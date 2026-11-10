# TRASP — Trust & Scam Protection Workbench
> Guardians of the Digital Space: Navigating Digital Deception  
> Karya Web Development Competition — MIT-WEEK 2026 Universitas Mulawarman

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3%20(Turbopack)-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%205.x-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Architecture](https://img.shields.io/badge/Architecture-Zero--Crash%20Client--First-emerald?style=flat-square)](https://github.com/raya-raihana/TRASP)
[![YouTube Demo](https://img.shields.io/badge/YouTube-Video%20Demo%20Live-red?style=flat-square&logo=youtube)](https://youtu.be/4-OiCrQ8kHI)
[![License](https://img.shields.io/badge/License-MIT-amber?style=flat-square)](LICENSE)

---

### Identitas Tim Pengembang
* **Nomor Registrasi Tim:** MIT-010
* **Nama Tim:** Tiga Trio
* **Institusi:** SMK Negeri 6 Balikpapan, Kalimantan Timur
* **Susunan Tim:**
  1. Raya Raihana Yasmin — Ketua Tim / Full-Stack & System Architect
  2. Andi Rivelani Aurellah — Anggota / UI-UX Forensic Designer & Research
  3. Yelena Amanda — Anggota / QA, Security Testing & Content Research
* **Repositori Resmi:** https://github.com/raya-raihana/TRASP
* **Tautan Video Presentasi:** https://youtu.be/4-OiCrQ8kHI

---

## Daftar Isi
1. [Latar Belakang dan Urgensi](#latar-belakang-dan-urgensi)
2. [Batasan Sistem dan Disclaimer Edukasi](#batasan-sistem-dan-disclaimer-edukasi)
3. [Arsitektur Sistem](#arsitektur-sistem)
4. [Fitur Utama Aplikasi](#fitur-utama-aplikasi)
   - [Modul 1: Recognize](#modul-1-recognize-inspeksi-forensik--sensor-privasi)
   - [Modul 2: Learn](#modul-2-learn-cyber-quest-roadmap--simulator-percakapan)
   - [Modul 3: Act](#modul-3-act-sop-darurat-generator-laporan--tinjauan-yuridis)
   - [Navigasi Mobile Ergonomis](#navigasi-mobile-ergonomis)
5. [Matriks 8 Modus Kejahatan Siber Indonesia](#matriks-8-modus-kejahatan-siber-indonesia)
6. [Panduan Menjalankan Aplikasi](#panduan-menjalankan-aplikasi)
7. [Pengujian Otomatis (E2E Testing Suite)](#pengujian-otomatis-e2e-testing-suite)
8. [Panduan Pengujian Singkat Dewan Juri](#panduan-pengujian-singkat-dewan-juri)
9. [Video Demonstrasi](#video-demonstrasi)
10. [Lisensi dan Atribusi Pihak Ketiga](#lisensi-dan-atribusi-pihak-ketiga)

---

## Latar Belakang dan Urgensi

Di Indonesia, kejahatan siber yang menargetkan masyarakat umum didominasi oleh manipulasi psikologis (*social engineering*), bukan peretasan infrastruktur tingkat tinggi. Pelaku memanfaatkan rasa takut, urgensi palsu, atau kelengahan korban untuk menguras rekening perbankan dan mencuri data pribadi. Modus yang sering memakan korban antara lain:

* Pengiriman berkas malware berekstensi `.APK` yang disamarkan sebagai resi paket kurir, undangan pernikahan, atau surat tilang ETLE kepolisian untuk menyadap SMS OTP perbankan.
* Phishing berkedok portal resmi perpajakan (DJP Coretax) disertai ancaman pemblokiran rekening.
* Penipuan kerja paruh waktu (*task scam / loker fiktif*) dengan skema deposit berjenjang.
* Penipuan barcode QRIS palsu (*quishing*) serta pemalsuan identitas berbasis suara kecerdasan buatan (*AI voice cloning*).

Berdasarkan data Satgas PASTI OJK dan Bareskrim Polri, korban umumnya kehilangan akses dana pada **15 menit pertama** setelah insiden terjadi. Sebagian besar korban panik dan tidak memahami prosedur isolasi perangkat (seperti mencabut izin aksesibilitas atau mengaktifkan mode pesawat), lambat menghubungi *call center* bank, dan kesulitan merangkum kronologi resmi untuk laporan kepolisian.

TRASP (*Trust & Scam Protection Workbench*) dikembangkan untuk menjawab persoalan tersebut melalui pendekatan sistematis tiga pilar: **Recognize** (identifikasi dini dan sensor data pribadi), **Learn** (simulasi taktik manipulasi secara interaktif), dan **Act** (langkah darurat 15 menit, generator draf laporan, serta dasar hukum resmi).

---

## Batasan Sistem dan Disclaimer Edukasi

Kepatuhan terhadap aspek hukum dan privasi pengguna diterapkan secara ketat dalam arsitektur TRASP:

1. **Sifat Edukatif Probabilistik:** Analisis forensik yang disajikan sistem bersifat indikator edukatif dan probabilistik (*Indikator Tinggi*, *Indikator Sedang/Waspada*, *Indikator Rendah/Aman*). Sistem **tidak memberikan vonis mutlak 100%** terhadap suatu pesan atau tautan.
2. **Kepatuhan UU PDP No. 27/2022 (*On-Device Data Redaction*):** Fitur sensor gambar berjalan 100% di canvas peramban sisi klien (*client-side*). Nomor telepon, NIK, dan nomor rekening dapat disensor langsung oleh pengguna sebelum data diproses. Sistem tidak menyimpan data pribadi pengguna ke peladen (*zero server retention*).
3. **Verifikasi Jalur Resmi:** Seluruh temuan edukatif diarahkan untuk diverifikasi ke kanal otoritas berwenang, yaitu portal IASC OJK (telepon 157), CekRekening.id Komdigi, dan Patroli Siber Bareskrim Polri (patrolisiber.id).

---

## Arsitektur Sistem

TRASP dirancang menggunakan standar *Zero-Crash Resilient Architecture* berpatokan pada Google Developer Experience (Addy Osmani Codex):

```
+------------------------------------------------------------------------+
|                        TRASP WORKBENCH CLIENT                          |
|               Next.js 16.4.3 (App Router) + React 19.1                 |
+--------------------+---------------------+-----------------------------+
|     RECOGNIZE      |        LEARN        |             ACT             |
| Multi-Vector NLP   | Cyber Quest Roadmap | Katalog 8 Kasus Indonesia   |
| Canvas Redactor    | Simulator WhatsApp  | SOP Tanggap Darurat 15-Mnt  |
| Heuristic Parser   | Telemetry X-Ray     | Generator Draf Aduan Resmi  |
| Local Regex Shield | Debrief & Scorecard | Tinjauan Yuridis UU ITE/KUHP|
+---------+----------+----------+----------+--------------+--------------+
          |                     |                         |
          +---------------------+-------------------------+
                                |
                                v
+------------------------------------------------------------------------+
|                      LOCAL HEURISTIC ENGINE                            |
|       Mesin Penilai Mandiri di Sisi Klien (Respon < 5ms, Offline)      |
|           Menjamin zero-crash jika API eksternal offline               |
+-------------------------------+----------------------------------------+
                                | (Opsional / Jalur Online)
                                v
+------------------------------------------------------------------------+
|                   HYBRID AI ROUTER (SERVER ROUTE)                      |
|       Gemini 2.5 Flash / Flash-Lite dengan Timeout Abort 3.5s          |
+------------------------------------------------------------------------+
```

### Karakteristik Teknis:
* **Gaya Antarmuka Neo-Brutalist Cyber-Forensic:** Memprioritaskan kontras tinggi, tata letak padat data (*high-density forensic dashboard*), border tegas 1px–2px, dan menolak gradien generik berbasis AI.
* **Matriks 4-State pada Setiap Komponen:** Seluruh komponen memiliki penanganan terstruktur untuk *Empty State*, *Loading State* (skeleton halus anti-CLS), *Success State*, dan *Error/Fallback State* otomatis.
* **Target Kinerja Web Vitals:** LCP <= 2.5 detik, INP <= 200 ms, dan CLS <= 0.1 pada perangkat bergerak maupun desktop.

---

## Fitur Utama Aplikasi

### Modul 1: Recognize (Inspeksi Forensik & Sensor Privasi)
* **Linguistic Normalizer (Anti-Evasion):** Mendeteksi teknik penyamaran teks pelaku penipuan seperti leetspeak (`d4p4tk4n` -> `dapatkan`), pemecahan kata dengan tanda titik (`t.e.l.e.g.r.a.m`), serta kata kunci khas penipuan Indonesia (*resi kurir, apk, undian, denda pajak, komisi tugas, saldo tertahan*).
* **Multi-Vector Threat Matrix:** Membedah potensi ancaman ke dalam 3 vektor risiko utama:
  * *Vektor Urgensi Waktu:* Batas waktu semu yang memicu kepanikan (misal: "dalam 2 jam").
  * *Vektor Permintaan Aset:* Permintaan instalasi berkas liar, transfer dana, atau pembagian kode OTP.
  * *Vektor Saluran Mencurigakan:* Tautan domain tipuan (*typosquatting*), nomor ponsel tidak resmi, atau pemendek tautan gratisan.
* **Interactive Canvas Redactor:** Alat penyensor data visual berbasis Canvas HTML5. Pengguna dapat mengaburkan NIK, nomor kartu, atau wajah pada tangkapan layar bukti sebelum bukti dikirimkan ke mesin analisis.
* **Preset Kasus Riil:** Menyediakan 4 skenario awal siap uji (Undangan/Resi .APK, Loker Freelance BUMN, Tagihan Denda Pajak, dan Struk Transfer Editan).

### Modul 2: Learn (Cyber Quest Roadmap & Simulator Percakapan)
* **Cyber Quest Roadmap (10 Level Terstruktur):**
  * Jalur kurikulum interaktif yang terbagi ke dalam 3 sektor: *Social Engineering*, *Network & Phishing*, dan *Deepfake & AI Fraud*.
  * Mendukung dua mode permainan mandiri: **Defense Mode** (berperan sebagai target yang mempertahankan saldo dan data) serta **Offense Mode / Red Team** (membedah cara kerja pelaku untuk mengasah pemahaman protektif).
  * Dilengkapi checkpoint evaluasi taktis: *Mini-Quiz Forensik* (evaluasi izin sistem Android Accessibility Service) dan *Timed Incident Drill* (latihan kecepatan isolasi perangkat).
* **Split-Screen WhatsApp Mockup:**
  * Simulasi dialog realistis di dalam antarmuka ponsel pintar dengan dukungan respons cepat (*preset dialogue options*) dan pengetikan bebas (*freeform custom typing*).
* **Live Scammer Telemetry X-Ray:**
  * Panel pemantau taktik penipu secara transparan: menampilkan nama taktik manipulasi aktif, status psikologis musuh (*pushing, deflecting, coercing*), dan **monolog batin sindikat** (tujuan terselubung di balik pesan yang dikirim).
  * Meteran kerentanan (*vulnerability meter*) yang bereaksi secara real-time berdasarkan respons pengguna.
* **Debrief Forensik & Scorecard Pasca-Simulasi:**
  * Menampilkan skor ketahanan siber, audit keputusan per langkah dialog (*Tangkas*, *Netral*, atau *Terjebak*), ulasan yuridis berdasarkan UU ITE No. 1/2024, serta tombol navigasi instan ke level berikutnya.

### Modul 3: Act (SOP Darurat, Generator Laporan, & Tinjauan Yuridis)
* **Katalog 8 Modus Kejahatan Siber Indonesia:** Membedah 8 modus kejahatan digital nyata lengkap dengan ringkasan kasus, anatomis teknis, dan navigasi runut antar kasus.
* **Prosedur Tanggap Darurat 15 Menit:**
  1. *Putus Koneksi Ponsel:* Mengaktifkan Mode Pesawat dan mematikan Wi-Fi untuk mencegah pengiriman data SMS/OTP ke server Command & Control penipu.
  2. *Hapus Aplikasi Berbahaya:* Langkah mencabut izin *Accessibility Services* dan mencopot paket berkas `.apk` berbahaya via pengaturan Android.
  3. *Amankan Akun & Sandi:* Panduan mengganti PIN m-Banking dan kata sandi dari perangkat lain yang steril.
  4. *Hubungi Bank Resmi:* Akses cepat ke kanal pemblokiran darurat rekening penampung.
* **Direktori Kontak Cepat Bank Nasional:** Daftar kontak resmi 24 jam perbankan utama Indonesia yang dapat dihubungi langsung (BCA 1500888, BRI 1500017, Mandiri 14000, BNI 1500046).
* **Generator Draf Kronologi Laporan Resmi:**
  * Mengubah data insiden, identitas terduga penipu, nomor rekening penampung, dan kronologi kejadian menjadi draf formal siap salin (*copy-to-clipboard*) berformat standar laporan kepolisian dan perbankan.
* **Pesan Peringatan Grup Keluarga/WhatsApp:** Tombol satu kali klik untuk menyalin draf pesan edukasi singkat guna melindungi grup keluarga dari modus serupa.
* **Tinjauan Yuridis Tiga Babak:** Membedah konstruksi pasal UU ITE No. 1/2024 (Pasal 28, 30, 32, 35), Pasal 378 KUHP tentang penipuan, dan UU Tindak Pidana Pencucian Uang (TPPU) untuk rekening penampung.
* **Asisten Interaktif Tanya Ras:** Chatbot interaktif mini berbasis aturan lokal dan AI untuk konsultasi mitigasi cepat seputar kasus yang dihadapi.

### Navigasi Mobile Ergonomis
* **Fixed Bottom Navigation Bar:** Pada perangkat seluler, bilah navigasi utama (**Recognize**, **Learn**, dan **Act**) berada di bagian bawah layar (*thumb-friendly*), mematuhi standar ukuran sentuh minimal 44x44 piksel dengan dukungan safe-area iOS.

---

## Matriks 8 Modus Kejahatan Siber Indonesia

| No | Modus Kejahatan | Vektor Ancaman | Rujukan Regulasi | Tindakan Mitigasi Utama |
|:--:|:---|:---|:---|:---|
| 1 | Pencurian Kode SMS via Berkas `.APK` | Trojan Android, Penyadapan Aksesibilitas | Pasal 30 & 32 UU ITE, UU PDP | Aktifkan Mode Pesawat, cabut izin aksesibilitas, copot aplikasi. |
| 2 | Situs Tiruan Kantor Pajak (Coretax) | Phishing Web, Pencurian Kredensial NIK/Sandi | Pasal 35 UU ITE, Pasal 378 KUHP | Jangan isi data, verifikasi domain resmi djponline.pajak.go.id. |
| 3 | Penipuan Lowongan Kerja & Setor Modal | Skema Ponzi, Deposit Tugas Like/Subscribe | Pasal 28 ayat (1) UU ITE No. 1/2024 | Tolak transfer deposit, keluar dari grup obrolan tugas. |
| 4 | SMS Penipuan Mengatasnamakan Bank | Sender ID Spoofing, Tautan Phishing | Pasal 35 & 46 UU ITE | Abaikan tautan tarif, konfirmasi ke call center resmi bank. |
| 5 | Manipulasi Barcode QRIS (Quishing) | Rekening Penampung Fiktif pada Stiker QR | Pasal 378 KUHP, POJK No. 22/2023 | Periksa nama merchant sebelum membayar, hindari stiker timpaan. |
| 6 | Rekayasa Suara Kerabat (AI Voice Clone) | Deepfake Audio, Kepanikan Berita Darurat | Pasal 35 UU ITE, Pasal 378 KUHP | Terapkan kata sandi keluarga, telepon balik nomor asli kerabat. |
| 7 | Penipuan Romansa & Investasi Bodong | Social Engineering, Love Scamming | Pasal 28 ayat (1) UU ITE, UU TPPU | Jangan kirim uang ke kenalan virtual, lapor ke Satgas PASTI OJK. |
| 8 | Pemerasan Konten Pribadi (Sextortion) | Manipulasi Gambar, Teror Ancaman Viral | Pasal 27B & 45 ayat (10) UU ITE | Jangan transfer uang, simpan bukti obrolan, lapor patrolisiber.id. |

---

## Panduan Menjalankan Aplikasi

Aplikasi ini dibangun menggunakan Next.js 16 App Router dan dapat dijalankan di lingkungan lokal maupun disebarkan ke peladen produksi.

### Prasyarat Sistem
* **Node.js:** Versi 18.18 atau lebih baru (direkomendasikan Node.js 20 LTS atau Node.js 22).
* **Package Manager:** `npm` versi 9 ke atas (atau `pnpm` / `yarn`).
* **Git:** Versi 2.30 ke atas.

### Langkah Instalasi dan Eksekusi Lokal

1. **Clone Repositori dari GitHub:**
   ```bash
   git clone https://github.com/raya-raihana/TRASP.git
   cd TRASP
   ```

2. **Pasang Dependensi Proyek:**
   ```bash
   npm install
   ```

3. **Konfigurasi Berkas Lingkungan (*Environment Variables*):**
   Salin berkas konfigurasi contoh `.env.example` ke `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   *Catatan:* TRASP telah dilengkapi dengan *Deterministic Local Heuristic Engine*. Aplikasi dapat berjalan 100% fungsional tanpa API Key eksternal. Namun, jika ingin mengaktifkan respons asistensi berbasis Google Gemini, isi variabel `GEMINI_API_KEY` di dalam `.env.local`.

4. **Jalankan Server Mode Pengembangan (*Development Server*):**
   ```bash
   npm run dev
   ```
   Buka peramban di alamat: `http://localhost:3000`.

5. **Kompilasi dan Uji Build Produksi (*Production Build*):**
   Untuk memverifikasi keandalan kode sebelum deployment:
   ```bash
   npm run build
   npm run start
   ```

6. **Pengecekan Kualitas Kode (Lint & TypeScript):**
   ```bash
   npm run lint
   npx tsc --noEmit
   ```

---

## Pengujian Otomatis (E2E Testing Suite)

TRASP menggunakan pengujian otomatis berbasis peramban riil (*real-browser verification*) dengan framework `@e2e-dev/web` untuk memastikan tidak ada fitur atau tata letak yang mengalami regresi:

```bash
# Menjalankan seluruh skenario pengujian E2E
npm run test:e2e

# Atau jalankan berkas pengujian tertentu
npx e2e run tests/trasp-all-features.e2e.ts
npx e2e run tests/trasp-cyber-quest.e2e.ts
npx e2e run tests/trasp-canvas-reset.e2e.ts
npx e2e run tests/trasp-mitigasi-simplified.e2e.ts
npx e2e run tests/trasp-sidebar-clean.e2e.ts
```

Setiap pengujian E2E otomatis mendokumentasikan bukti tangkapan layar antarmuka pada direktori `.e2e/artifacts/` dan mencatat hasil evaluasi pada `.e2e/report.json`.

---

## Panduan Pengujian Singkat Dewan Juri

Bagi dewan juri yang ingin menguji keandalan fitur aplikasi secara langsung dalam waktu 1-2 menit:

1. **Uji Modul Recognize & Sensor Privasi:**
   * Buka beranda di `http://localhost:3000`.
   * Klik salah satu preset contoh kasus di kiri bawah, misalnya **"Undangan & Resi .APK"**.
   * Klik tombol **"Pindai & Analisis"** untuk melihat dekomposisi 3 Vektor Ancaman dan analisis forensik interaktif.
   * Klik tab **"Sensor Privasi"** untuk menguji penyensoran data gambar langsung di browser.
2. **Uji Modul Learn (Simulasi WhatsApp & Telemetry X-Ray):**
   * Pindah ke tab **"Learn"** via bilah navigasi.
   * Pilih level pada diagram jalur pohon, lalu masuk ke arena simulasi.
   * Ketik balasan di kolom percakapan atau pilih tombol respons cepat.
   * Perhatikan panel kanan: nama taktik manipulasi, monolog batin pelaku, dan meteran kerentanan bergerak secara dinamis.
   * Selesaikan simulasi dengan menekan **"Blokir & Laporkan Kasus"** untuk membuka layar evaluasi teknis (Debrief & Scorecard).
   * Klik tombol **"Lanjut ke Kasus Berikutnya"** untuk berpindah level secara runut.
3. **Uji Modul Act (SOP Tanggap Darurat & Laporan Resmi):**
   * Pindah ke tab **"Act"** via bilah navigasi.
   * Klik salah satu kartu kasus pada katalog untuk membaca 4 langkah darurat, daftar kontak perbankan, dan tinjauan pasal hukum.
   * Coba fitur **Generator Draf Laporan** dan klik tombol **"Salin Draf Laporan Siap Kirim"**.
4. **Uji Responsivitas Mobile:**
   * Perkecil lebar jendela browser ke ukuran ponsel (atau buka dari browser smartphone).
   * Perhatikan bilah navigasi bawah (*Bottom Navigation Bar*) yang muncul di bagian bawah layar untuk pengoperasian satu tangan.

---

## Video Demonstrasi

Video presentasi dan demonstrasi alur kerja sistem TRASP dapat disaksikan secara daring melalui YouTube:

* **Tautan Video Resmi:** https://youtu.be/4-OiCrQ8kHI
* **Durasi:** 02:49 Menit
* **Kualitas:** 1080p Full HD
* **Materi yang Didemonstrasikan:**
  1. Identifikasi dini dan sensor privasi data pada modul **Recognize**.
  2. Simulasi percakapan WhatsApp, pantauan taktik penipu secara real-time (*Telemetry X-Ray*), dan evaluasi skor ketahanan siber pada modul **Learn**.
  3. Protokol tanggap darurat 15 menit, panggilan cepat bank, dan generator draf laporan pada modul **Act**.
  4. Pengujian keandalan arsitektur *Zero-Crash* secara offline.

---

## Lisensi dan Atribusi Pihak Ketiga

Seluruh kode sumber pada repositori ini dilisensikan di bawah lisensi terbuka [MIT License](LICENSE).

Proyek ini dibangun menggunakan pustaka dan komponen sumber terbuka berikut:
* **Next.js 16 (Turbopack)** — MIT License (c) Vercel, Inc.
* **React 19** — MIT License (c) Meta Platforms, Inc.
* **Tailwind CSS v4** — MIT License (c) Tailwind Labs, Inc.
* **Radix UI Primitives** — MIT License (c) WorkOS, Inc.
* **Lucide Icons** — ISC License (c) Lucide Contributors
* **Tabler Icons React** — MIT License (c) Pawel Kuna
* **Drizzle ORM** — Apache 2.0 License (c) Drizzle Team
* **@e2e-dev/web & e2e** — MIT License (c) E2E Dev Team
* **Class Variance Authority & clsx** — MIT License (c) Joe Bell, Luke Edwards

---
*Dikembangkan oleh **Tim Tiga Trio (MIT-010)** — SMK Negeri 6 Balikpapan untuk **MIT-WEEK 2026 Universitas Mulawarman**.*
