// TRASP Split-Screen Sandbox Data & Telemetry State Machine
// Flagship Hero Feature for MIT-WEEK 2026 UNMUL

export interface DialogueChoice {
  text: string;
  type: "VULNERABLE" | "NEUTRAL" | "CRITICAL";
  vulnerabilityDelta: number; // e.g. +25 or -30
  scammerResponse: string;
  nextTelemetry: {
    activeTactic: string;
    scammerMood: "CONFIDENT" | "PUSHING" | "DEFLECTING" | "PANICKED" | "BUSTED";
    internalThought: string;
  };
}

export interface DialogueStep {
  stepIndex: number;
  scammerMessage: string;
  timestamp: string;
  scammerTelemetry: {
    activeTactic: string;
    scammerMood: "CONFIDENT" | "PUSHING" | "DEFLECTING" | "PANICKED" | "BUSTED";
    internalThought: string;
  };
  userChoices: DialogueChoice[];
}

export interface SandboxScenario {
  id: string;
  title: string;
  scammerName: string;
  scammerNumber: string;
  scammerAvatar: string;
  initialVulnerability: number;
  steps: DialogueStep[];
  postMortem: {
    title: string;
    vulnerableConclusion: string;
    criticalConclusion: string;
    coreLesson: string;
  };
}

export const SANDBOX_SCENARIOS: Record<string, SandboxScenario> = {
  "apk-kurir": {
    id: "apk-kurir",
    title: "Modus File .APK Kurir Paket",
    scammerName: "Kurir J&T Budi Santoso",
    scammerNumber: "+62 812-9988-7711",
    scammerAvatar: "📦",
    initialVulnerability: 50,
    steps: [
      {
        stepIndex: 1,
        scammerMessage: "Halo sore kak, ini kurir J&T. Ada paket tertahan karena alamat kakak nggak lengkap. Tolong install aplikasi resi LIHAT_FOTO_PAKET.apk ini ya kak biar paket nggak hangus hari ini.",
        timestamp: "14:20",
        scammerTelemetry: {
          activeTactic: "Kepanikan Urgensi (Fear of Loss)",
          scammerMood: "CONFIDENT",
          internalThought: "Gue pasang batas waktu biar korban buru-buru klik tanpa mikir kenapa resi paket bentuknya .APK bukannya gambar atau PDF."
        },
        userChoices: [
          {
            text: "Waduh paket apa ya kak? Saya langsung pasang sekarang nih aplikasinya.",
            type: "VULNERABLE",
            vulnerabilityDelta: 35,
            scammerResponse: "Bagus kak, langsung buka aplikasinya, terus kalau ada pop-up minta izin baca SMS/Aksesibilitas di-klik 'Izinkan Semua' ya kak biar resinya kebuka.",
            nextTelemetry: {
              activeTactic: "Penyusupan Izin Aksesibilitas (Banking Trojan)",
              scammerMood: "CONFIDENT",
              internalThought: "Kena lo! Begitu dia klik Izinkan Aksesibilitas, malware gue langsung otomatis sedot isi SMS dan salin kode OTP m-Banking dia."
            }
          },
          {
            text: "Kok formatnya .APK kak? Bukannya kalau foto resi biasanya JPG atau cek lewat nomor resi di aplikasi resmi J&T?",
            type: "CRITICAL",
            vulnerabilityDelta: -30,
            scammerResponse: "Iya kak ini sistem baru kantor pusat kami untuk perlindungan data pelanggan. Makanya wajib pakai aplikasi ini kak, buruan kalau nggak paketnya dibalikin ke Jakarta lho!",
            nextTelemetry: {
              activeTactic: "Pengalihan Tekanan (Deflection & Gaslighting)",
              scammerMood: "DEFLECTING",
              internalThought: "Sial, korbannya paham ekstensi file! Harus gue tekan pakai ancaman paket dibalikin ke Jakarta biar dia goyah."
            }
          },
          {
            text: "Nama penerima siapa dan no resinya berapa? Biar saya cek sendiri di website resmi jnt.co.id.",
            type: "CRITICAL",
            vulnerabilityDelta: -40,
            scammerResponse: "Aduh ribet amat sih kak, saya cuma kurir lapangan disuruh kantor! Kalau nggak mau install yaudah paket kakak saya return!",
            nextTelemetry: {
              activeTactic: "Frustrasi & Taktik Gertak Sambal (Panic Bluff)",
              scammerMood: "PANICKED",
              internalThought: "Gawat, dia minta no resi beneran padahal gue cuma kirim blast massal. Gue pura-pura marah aja biar dia ngerasa bersalah."
            }
          }
        ]
      },
      {
        stepIndex: 2,
        scammerMessage: "Kak, gimana? Sudah di-install belum? Ini sudah jam 3 sore batas kurir lapor ke kantor cabang!",
        timestamp: "14:22",
        scammerTelemetry: {
          activeTactic: "Pemberian Batas Waktu Palsu",
          scammerMood: "PUSHING",
          internalThought: "Makin lama korban mikir, makin gede kemungkinan dia nanya temennya. Harus gue kejar detik ini juga."
        },
        userChoices: [
          {
            text: "HP saya bilang 'File berbahaya terdeteksi dan diblokir Play Protect', gimana dong?",
            type: "NEUTRAL",
            vulnerabilityDelta: 10,
            scammerResponse: "Itu biasa kak karena belum masuk Playstore, di-abaikan aja terus pilih 'Tetap Install'. 100% aman kok kak saya jamin!",
            nextTelemetry: {
              activeTactic: "Penipuan Otoritas Palsu & Melemahkan Proteksi HP",
              scammerMood: "PUSHING",
              internalThought: "Play Protect-nya nyala! Gue harus yakinin dia buat bypass proteksi bawaan Android-nya sendiri."
            }
          },
          {
            text: "Saya barusan telepon call center resmi J&T di 021-8066-1888, mereka bilang kurir resmi tidak pernah kirim file APK. Nomor kamu sudah saya laporkan ke CekRekening dan Patroli Siber!",
            type: "CRITICAL",
            vulnerabilityDelta: -50,
            scammerResponse: "*(Nomor ini telah memblokir Anda)*",
            nextTelemetry: {
              activeTactic: "Kekalahan Total (Scammer Busted & Abort)",
              scammerMood: "BUSTED",
              internalThought: "MAMPUS! Korban verifikasi langsung ke call center resmi. Operasi gagal total, hapus nomor dan blokir kontak sekarang juga!"
            }
          }
        ]
      }
    ],
    postMortem: {
      title: "Evaluasi Forensik Modus .APK Kurir",
      vulnerableConclusion: "Jika Anda mengklik atau mengizinkan instalasi file .APK, malware Android akan aktif di latar belakang, membaca SMS OTP perbankan Anda, dan memungkinkan sindikat menguras rekening Anda tanpa notifikasi.",
      criticalConclusion: "Langkah Anda luar biasa! Dengan menolak file .APK dan menuntut nomor resi resmi serta mengonfirmasi ke call center 021-8066-1888, sindikat penipuan langsung panik dan membatalkan aksinya.",
      coreLesson: "Ekstensi file .APK adalah program aplikasi Android, BUKAN foto atau dokumen. Kurir ekspedisi resmi (J&T, JNE, SiCepat, Pos) TIDAK PERNAH mengirimkan file instalasi kepada penerima paket."
    }
  },
  "loker-bumn": {
    id: "loker-bumn",
    title: "Modus Loker Freelance BUMN (Task Fraud)",
    scammerName: "HR Rekrutmen Talent BUMN",
    scammerNumber: "+62 857-4433-2211",
    scammerAvatar: "💼",
    initialVulnerability: 60,
    steps: [
      {
        stepIndex: 1,
        scammerMessage: "Halo kak! Selamat tugas like 2 video YouTube sudah selesai. Komisi Rp30.000 sudah kami transfer ya. Sekarang tugas ke-3 adalah Tugas VIP: Kakak deposit dulu Rp200.000 ke rekening bendahara, dalam 10 menit uang kembali jadi Rp350.000!",
        timestamp: "10:15",
        scammerTelemetry: {
          activeTactic: "Umpan Kepercayaan Awal (Reciprocity Bait)",
          scammerMood: "CONFIDENT",
          internalThought: "Gue udah kasih dia 30 ribu gratis buat bangun rasa percaya. Sekarang saatnya gue tarik uang aslinya 200 ribu!"
        },
        userChoices: [
          {
            text: "Wah lumayan untung 150 ribu! Saya langsung transfer Rp200.000 sekarang ke rekening yang mana kak?",
            type: "VULNERABLE",
            vulnerabilityDelta: 40,
            scammerResponse: "Transfer ke Rekening BCA 8820192318 a.n Rudi Hermanto ya kak. Habis transfer kirim struknya ke sini langsung kami cairkan!",
            nextTelemetry: {
              activeTactic: "Penjebakan Sunk Cost Fallacy",
              scammerMood: "CONFIDENT",
              internalThought: "Dapat 200 ribu! Nanti pas dia mau cairin, gue bilang 'Server error, harus deposit lagi 1 juta buat buka gembok saldo'."
            }
          },
          {
            text: "Loh katanya kerja freelance kak, kenapa saya yang mau kerja malah disuruh bayar uang deposit duluan?",
            type: "CRITICAL",
            vulnerabilityDelta: -35,
            scammerResponse: "Ini uang jaminan komitmen tugas VIP kak, nanti dikembalikan 100% plus untung! Jangan ragu kak banyak member grup yang sudah cair puluhan juta.",
            nextTelemetry: {
              activeTactic: "Bukti Sosial Palsu (Social Proof Fabrication)",
              scammerMood: "DEFLECTING",
              internalThought: "Dia curiga kenapa pelamar kerja bayar uang. Gue tunjukin testimoni editan di grup Telegram biar dia tergiur lagi."
            }
          },
          {
            text: "BUMN mana yang sistem penggajiannya pakai transfer deposit ke rekening pribadi orang? Boleh minta surat izin resmi OJK dan SK Kemenaker perusahaannya?",
            type: "CRITICAL",
            vulnerabilityDelta: -45,
            scammerResponse: "Kalau kakak nggak niat kerja nggak usah banyak tanya ya! Masih ribuan pelamar lain yang antre mau komisi ini!",
            nextTelemetry: {
              activeTactic: "Intimidasi Kehilangan Peluang (Scarcity Aggression)",
              scammerMood: "PANICKED",
              internalThought: "Aduh, dia tanya izin OJK dan Kemenaker! Gue harus bersikap sombong dan pura-pura banyak antrean biar dia minder."
            }
          }
        ]
      }
    ],
    postMortem: {
      title: "Evaluasi Forensik Modus Task Fraud",
      vulnerableConclusion: "Modus 'Task Fraud' selalu memberikan recehan (10-30 ribu) di awal agar korban merasa aman. Begitu korban menyetor uang deposit besar (ratusan ribu hingga puluhan juta), penipu akan kabur atau memeras terus-menerus.",
      criticalConclusion: "Analisis Anda sangat tajam! Di dunia kerja mana pun, pekerja dibayar oleh perusahaan, BUKAN pekerja yang menyetor deposit uang ke rekening pribadi.",
      coreLesson: "Tidak ada perusahaan resmi atau BUMN yang merekrut lewat WhatsApp tanpa interview resmi dan menuntut setoran uang muka dengan dalih misi komisi."
    }
  }
};
