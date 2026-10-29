// TRASP Emergency Containment & Incident Triage Protocols
// Built for MIT-WEEK 2026 UNMUL — Golden Hour Protection

export interface ContainmentStep {
  minute: string;
  title: string;
  action: string;
  commandOrTip?: string;
  isCritical: boolean;
}

export interface IncidentPlaybook {
  id: string;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  summary: string;
  steps: ContainmentStep[];
}

export interface OfficialHotline {
  name: string;
  type: "BANK" | "GOV";
  number: string;
  officialSite: string;
  serviceHours: string;
}

export const OFFICIAL_HOTLINES: OfficialHotline[] = [
  { name: "Halo BCA", type: "BANK", number: "1500888", officialSite: "bca.co.id", serviceHours: "24 Jam" },
  { name: "Kontak BRI", type: "BANK", number: "1500017", officialSite: "bri.co.id", serviceHours: "24 Jam" },
  { name: "Mandiri Call", type: "BANK", number: "14000", officialSite: "bankmandiri.co.id", serviceHours: "24 Jam" },
  { name: "BNI Call", type: "BANK", number: "1500046", officialSite: "bni.co.id", serviceHours: "24 Jam" },
  { name: "IASC OJK (Anti Scam Centre)", type: "GOV", number: "157", officialSite: "ojk.go.id", serviceHours: "08:00 - 17:00 WIB" },
  { name: "Patroli Siber POLRI", type: "GOV", number: "0851-7890-0010", officialSite: "patrolisiber.id", serviceHours: "24 Jam" },
  { name: "CekRekening.id (Kemkomdigi)", type: "GOV", number: "159", officialSite: "cekrekening.id", serviceHours: "Portal Online" },
];

export const CONTAINMENT_PLAYBOOKS: Record<string, IncidentPlaybook> = {
  "apk-installed": {
    id: "apk-installed",
    title: "Gawat: Saya Telanjur Klik / Pasang Berkas .APK!",
    severity: "CRITICAL",
    summary: "Segera lakukan isolasi perangkat sebelum sindikat penipu mengambil alih SMS OTP dan aplikasi m-Banking Anda.",
    steps: [
      {
        minute: "Menit ke-01",
        title: "Putus Koneksi Internet (Aktifkan Mode Pesawat)",
        action: "Tarik bilah notifikasi HP Anda ke bawah, lalu AKTIFKAN 'Mode Pesawat' (Airplane Mode) atau matikan WiFi dan Data Seluler sekarang juga. Ini memutus komunikasi malware dengan server penipu.",
        isCritical: true,
      },
      {
        minute: "Menit ke-03",
        title: "Cabut Izin Aksesibilitas (Accessibility Services)",
        action: "Buka menu Pengaturan HP > Aksesibilitas > Aplikasi yang Di-download. Jika ada nama aplikasi mencurigakan (Surat Undangan, Foto Paket, Cek Resi), segera ubah statusnya menjadi NONAKTIF.",
        commandOrTip: "Malware perbankan membutuhkan izin ini untuk mengklik layar HP Anda secara otomatis.",
        isCritical: true,
      },
      {
        minute: "Menit ke-07",
        title: "Copot Pemasangan (Uninstall) Aplikasi Liar",
        action: "Buka Pengaturan > Aplikasi > Kelola Aplikasi. Cari aplikasi berikon kosong atau berlogo kurir/undangan yang baru saja dipasang, lalu klik 'Paksa Berhenti' (Force Stop) dan 'Hapus Instalasi' (Uninstall).",
        isCritical: true,
      },
      {
        minute: "Menit ke-12",
        title: "Amankan m-Banking Lewat Perangkat Lain",
        action: "Gunakan HP keluarga atau laptop untuk masuk ke internet banking resmi, atau hubungi call center bank untuk memblokir sementara akses rekening jika saldo tampak berkurang.",
        isCritical: false,
      }
    ]
  },
  "otp-compromised": {
    id: "otp-compromised",
    title: "Gawat: Saya Telanjur Memberikan Kode OTP / PIN!",
    severity: "CRITICAL",
    summary: "Kode OTP adalah pintu gerbang pengesahan transaksi. Lakukan penguncian darurat dalam hitungan menit.",
    steps: [
      {
        minute: "Menit ke-01",
        title: "Hubungi Call Center Bank Resmi Detik Ini Juga",
        action: "Segera telepon call center resmi bank terkait (Halo BCA 1500888, BRI 1500017, Mandiri 14000). Minta petugas untuk 'BLOKIR SEMENTARA AKUN M-BANKING & KARTU DEBIT' karena terindikasi social engineering.",
        isCritical: true,
      },
      {
        minute: "Menit ke-05",
        title: "Ganti Password Email & Kunci Aplikasi",
        action: "Buka aplikasi email Anda (Gmail/Yahoo) dan ubah kata sandi akun, lalu pilih 'Keluar dari semua perangkat lain' (Log out other sessions).",
        isCritical: true,
      },
      {
        minute: "Menit ke-10",
        title: "Catat Mutasi & Buat Laporan Resmi",
        action: "Cetak atau screenshot mutasi rekening terakhir, catat jam saat Anda menyerahkan OTP, dan siapkan kronologi untuk laporan ke IASC OJK.",
        isCritical: false,
      }
    ]
  },
  "money-transferred": {
    id: "money-transferred",
    title: "Gawat: Saya Telanjur Transfer Uang ke Rekening Penipu!",
    severity: "HIGH",
    summary: "Sistem perbankan Indonesia kini memiliki IASC (Indonesia Anti-Scam Centre) yang dapat membantu pembekuan rekening penipu.",
    steps: [
      {
        minute: "Menit ke-01",
        title: "Hubungi Bank Pengirim & Bank Penerima",
        action: "Telepon bank tempat Anda membuka rekening dan sebutkan: 'Saya telah menjadi korban penipuan transfer ke rekening [Nama Bank] [Nomor Rekening Penipu]'. Minta bank Anda menerbitkan surat permintaan blokir antar-bank.",
        isCritical: true,
      },
      {
        minute: "Menit ke-08",
        title: "Laporkan ke IASC OJK (Anti Scam Centre)",
        action: "Kunjungi portal resmi IASC OJK atau hubungi kontak 157. OJK memiliki wewenang menginstruksikan seluruh bank di Indonesia untuk membekukan rekening penampung penipu.",
        isCritical: true,
      },
      {
        minute: "Menit ke-15",
        title: "Buat Laporan Polisi & Daftarkan ke CekRekening.id",
        action: "Buka portal cekrekening.id untuk mendaftarkan nomor rekening penipu agar ditandai merah di sistem nasional dan tidak memakan korban lain.",
        isCritical: false,
      }
    ]
  }
};

export function generateIncidentReport(formData: {
  victimName: string;
  incidentType: string;
  platform: string;
  scammerContact: string;
  scammerBankDetails?: string;
  lossAmount?: string;
  chronology: string;
}): string {
  const dateStr = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `=======================================================
LAPORAN KRONOLOGI INSIDEN KEJAHATAN SIBER & PENIPUAN DIGITAL
Dihasilkan secara aman via TRASP (Trust & Scam Protection Workbench)
Waktu Pembuatan: ${dateStr}
=======================================================

I. DATA IDENTIFIKASI KASUS
1. Kategori Insiden    : ${formData.incidentType}
2. Kanal / Media Komunikasi : ${formData.platform}
3. Kontak Terlapor (Penipu) : ${formData.scammerContact || "-"}
4. Rekening / Aset Tujuan   : ${formData.scammerBankDetails || "-"}
5. Estimasi Kerugian        : ${formData.lossAmount || "Tidak ada kerugian finansial langsung"}

II. KRONOLOGI KEJADIAN
${formData.chronology || "Korban menerima pesan rekayasa sosial yang mengandung manipulasi psikologis dan diarahkan untuk melakukan tindakan berisiko."}

III. TINDAKAN MITIGASI YANG TELAH DIAMBIL
- Perangkat telah diisolasi dari jaringan internet (jika insiden malware APK).
- Telah menghubungi layanan nasabah resmi bank terkait untuk pemblokiran darurat.
- Tautan / berkas bukti percakapan telah diamankan dalam tangkapan layar.

IV. TUJUAN PELAPORAN
Laporan ini disiapkan sebagai dokumen dasar kronologi untuk pelaporan resmi kepada:
1. Indonesia Anti-Scam Centre (IASC) - Otoritas Jasa Keuangan (OJK 157)
2. Direktorat Tindak Pidana Siber POLRI (patrolisiber.id)
3. Portal CekRekening.id (Kementerian Komunikasi dan Digital RI)

Demikian kronologi ini dibuat dengan sebenar-benarnya tanpa rekayasa untuk penyelidikan lebih lanjut.
=======================================================`;
}
