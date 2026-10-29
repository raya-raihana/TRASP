# TRASP — Trust & Scam Protection Workbench
> **Guardians of the Digital Space: Navigating Digital Deception**  
> *Karya Web Development Competition — MIT-WEEK 2026 Universitas Mulawarman*

[![Live Deployment](https://img.shields.io/badge/Demo-Live%20Deployment-emerald?style=flat-square&logo=vercel)](https://github.com/raya-raihana/TRASP)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1-blue?style=flat-square&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Database](https://img.shields.io/badge/Neon-PostgreSQL%2018-00e599?style=flat-square&logo=postgresql)](https://neon.tech/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=flat-square)](LICENSE)

---

## 📌 Latar Belakang & Visi Produk

Setiap hari, generasi muda dan masyarakat Indonesia berhadapan langsung dengan manipulasi digital yang semakin licik: mulai dari modus lowongan kerja fiktif bersyarat deposit (*task fraud*), undangan pernikahan atau resi kurir palsu berformat `.APK` pencuri OTP/SMS perbankan, hingga penipuan berkedok akun resmi institusi publik.

**TRASP** (*Trust & Scam Protection Workbench*) hadir sebagai platform interaktif berbasis web yang memberdayakan masyarakat agar tidak lagi menjadi korban pasif, melainkan menjadi **Digital Guardians** yang berdaya. Dibangun dengan memegang teguh prinsip **"Kedalaman dan Efektivitas Solusi > Kuantitas Fitur"**, TRASP mengintegrasikan tiga tahapan proteksi dalam satu alur terpadu:
1. **Recognize (Mengenali):** Deteksi dini manipulasi pesan dan tautan berbasis heuristik linguistik dan multi-vektor tanpa risiko lag.
2. **Learn (Belajar) — [Hero Feature]:** Melatih ketahanan psikologis lewat simulasi obrolan layar terbelah (*Split-Screen*) dengan fitur inovatif **Live Scammer Telemetry X-Ray**.
3. **Act (Bertindak):** Panduan darurat 15 menit pertama (*containment checklist*) dan generator laporan resmi yang siap disalin.

---

## ⚠️ Pernyataan Batasan & Disclaimer Edukasi (Kepatuhan Juknis No. 29)

> [!IMPORTANT]
> **Pemberitahuan Transparansi Sistem:**
> - **TRASP** dirancang murni sebagai **media edukasi, simulasi interaktif, dan panduan mitigasi awal risiko penipuan digital**.
> - Sistem ini **tidak memberikan jaminan 100% mutlak** atas keabsahan atau keamanan suatu entitas digital, dan tidak pernah mengeluarkan vonis pasti ("100% Aman" atau "Pasti Penipuan"). Hasil evaluasi disajikan dalam bentuk indikator kecurigaan probabilistik (*Tingkat Indikator Kecurigaan Tinggi*, *Waspada*, atau *Indikator Rendah*).
> - Seluruh data pribadi diproses secara lokal di browser pengguna (*Zero Server Data Retention*). Pengguna sangat disarankan untuk selalu melakukan verifikasi silang langsung ke kanal resmi institusi terkait.

---

## 🌟 Fitur Utama (Alur Single-Pipeline)

### 1. 🔍 Mesin Recognize (Linguistic Normalizer & Multi-Vector Heuristics)
- **Normalisasi Linguistik (Anti-Evasion):** Mengurai manipulasi teks yang disengaja penipu, seperti *leetspeak* (`d4p4tk4n` $\rightarrow$ `dapatkan`), spasi jebakan (`t . e . l . e . g . r . a . m`), serta leksikon modus khas Indonesia (*cuan harian, tugas like-subscribe, deposit awal*).
- **Multi-Vector Threat Matrix:** Penilaian berbasis irisan 3 vektor risiko:
  - *Vektor Urgensi Waktu:* Batas waktu palsu dan ancaman pemblokiran mendesak.
  - *Vektor Permintaan Aset:* Permintaan transfer dana, pengiriman kode OTP, atau instalasi berkas asing.
  - *Vektor Saluran Mencurigakan:* Tautan domain tidak resmi, typosquatting, atau pemendek tautan anonim.
- **Interactive Canvas Privacy Redactor:** Alat penyensoran data sensitif (nomor HP, nama, rekening) langsung di browser pengguna sebelum diproses.

### 2. 🧠 Mesin Learn — [HERO FEATURE] Split-Screen "Inside the Scammer's Mind"
- **Dual-View Interaktif:**
  - *Sisi Kiri:* Simulasi antarmuka perpesanan instan tempat pengguna mencoba membalas pesan penipu dengan berbagai pilihan respons.
  - *Sisi Kanan (Live Scammer Telemetry X-Ray):* Menyingkap isi kepala penipu secara real-time (taktik manipulasi aktif yang sedang dilancarkan, serta indikator kerentanan korban yang naik-turun berdasarkan jawaban pengguna).
- **Post-Mortem Review:** Evaluasi mendalam di akhir sesi simulasi yang menunjukkan keputusan mana yang efektif mematahkan manipulasi penipu.

### 3. 🚨 Mesin Act — 15-Minute Emergency Containment & Official Report
- **Golden Hour Triage Checklist:** Panduan mitigasi langkah demi langkah untuk korban yang panik:
  - Penanganan darurat file `.APK` (mode pesawat, pencabutan izin aksesibilitas, isolasi malware).
  - Penanganan kebocoran OTP/PIN (langkah pemblokiran kartu dan direct-call bank resmi).
- **Official Report Draft Generator:** Menghasilkan draf kronologi insiden rapi yang siap di-*copy-paste* langsung ke portal aduan resmi pemerintah dan perbankan (IASC OJK, Patroli Siber Polri, CekRekening.id).

---

## 🏛️ Arsitektur & Teknologi

Aplikasi ini dibangun dengan arsitektur **Zero-Crash Client-First** untuk menjamin kestabilan mutlak saat dinilai juri pada live deployment:

- **Frontend Framework:** Next.js 15 (App Router with Turbopack) & React 19
- **Bahasa:** TypeScript (Strict Type Safety)
- **Styling & UI:** Tailwind CSS v4 & Radix UI primitives
- **Ikonografi:** Lucide React & Tabler Icons
- **Database Backend:** Neon Serverless PostgreSQL 18 & Drizzle ORM
- **Visualisasi & Canvas:** Recharts & HTML5 Canvas API
- **Deployment:** Vercel Edge Network

---

## 🚀 Panduan Instalasi & Menjalankan Lokal

### Prasyarat
- Node.js versi 18.18 atau lebih baru
- npm / pnpm / yarn
- Akun Git

### Langkah Instalasi
1. **Clone Repositori:**
   ```bash
   git clone https://github.com/raya-raihana/TRASP.git
   cd TRASP
   ```

2. **Instalasi Dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**
   Salin berkas `.env.example` menjadi `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Sesuaikan konfigurasi `DATABASE_URL` dengan database PostgreSQL kamu (misalnya Neon PostgreSQL).

4. **Migrasi Database:**
   ```bash
   npm run db:push
   ```

5. **Jalankan Development Server:**
   ```bash
   npm run dev
   ```
   Buka peramban di `http://localhost:3000`.

6. **Pengujian Build Produksi:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🧪 Panduan Pengujian untuk Juri (Panduan 60 Detik)

Untuk mempermudah dewan juri dalam menguji fungsionalitas aplikasi tanpa perlu menyiapkan sampel penipuan sendiri:

1. **Langkah 1 (Beranda):** Buka beranda aplikasi, perhatikan *Educational Disclaimer Banner* di bagian atas.
2. **Langkah 2 (Preset Demo):** Klik salah satu dari 4 tombol **Preset Kasus Fiktif** (misal: *Modus Undangan Pernikahan .APK* atau *Modus Loker BUMN Palsu*).
3. **Langkah 3 (Mesin Recognize):** Amati bagaimana sistem membedah 3 vektor ancaman secara transparan dan menyensor data pribadi pada canvas visual.
4. **Langkah 4 (Mesin Learn - Sandbox):** Klik tombol **[Uji Modus di Simulator Sandbox]**. Coba balas chat penipu di panel kiri dan saksikan respons taktik manipulasi di panel kanan (*Live X-Ray*).
5. **Langkah 5 (Mesin Act):** Buka menu **Mode Darurat**, coba simulasi kondisi *"Telanjur Klik APK"*, lalu tekan tombol salin pada draf laporan insiden resmi.

---

## 📜 Lisensi & Atribusi Pustaka Pihak Ketiga

Proyek ini menggunakan pustaka pihak ketiga berlisensi open-source resmi:
- **Next.js** — MIT License (© Vercel, Inc.)
- **React** — MIT License (© Meta Platforms, Inc.)
- **Tailwind CSS** — MIT License (© Tailwind Labs, Inc.)
- **Radix UI** — MIT License (© WorkOS)
- **Lucide React** — ISC License (© Lucide Contributors)
- **Drizzle ORM** — Apache 2.0 License (© Drizzle Team)
- **pg (node-postgres)** — MIT License (© Brianc)
- **Recharts** — MIT License (© Recharts Group)

---
*Dibuat dengan dedikasi penuh untuk ekosistem siber Indonesia yang lebih aman — MIT-WEEK 2026 UNMUL.*
