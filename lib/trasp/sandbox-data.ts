// TRASP Split-Screen Sandbox Data & Telemetry State Machine
// Flagship Hero Feature for MIT-WEEK 2026 UNMUL — The Trust Trap

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
  attachment?: {
    type: "apk" | "link" | "receipt" | "document";
    name: string;
    size?: string;
    meta?: string;
  };
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
  category: string;
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
    recommendedActions: string[];
  };
}

export const SANDBOX_SCENARIOS: Record<string, SandboxScenario> = {
  "apk-kurir": {
    id: "apk-kurir",
    title: "Undangan & Resi Kurir .APK",
    category: "Malware Android / Banking Trojan",
    scammerName: "Kurir J&T Budi Santoso",
    scammerNumber: "+62 812-9988-7711",
    scammerAvatar: "KP",
    initialVulnerability: 50,
    steps: [
      {
        stepIndex: 1,
        scammerMessage:
          "Selamat siang kak, mohon maaf mengganggu. Paket J&T Express kakak tertahan di gudang karena alamat nomor rumah kurang jelas. Tolong buka dan cek foto paket di berkas LIHAT_FOTO_PAKET.apk ini ya kak sebelum kami return dalam 2 jam!",
        timestamp: "14:20",
        attachment: {
          type: "apk",
          name: "LIHAT_FOTO_PAKET.apk",
          size: "4.8 MB",
          meta: "Aplikasi Android Tidak Terverifikasi (Trojan)"
        },
        scammerTelemetry: {
          activeTactic: "Kepanikan Urgensi (Fear of Loss)",
          scammerMood: "CONFIDENT",
          internalThought:
            "Gue pasang batas waktu 2 jam biar korban buru-buru install tanpa mikir kenapa foto paket bentuknya file .APK bukannya JPG atau PDF."
        },
        userChoices: [
          {
            text: "Waduh paket penting itu kak! Saya langsung pasang aplikasinya sekarang ya.",
            type: "VULNERABLE",
            vulnerabilityDelta: 35,
            scammerResponse:
              "Bagus kak, langsung buka aplikasinya. Nanti kalau ada pop-up minta izin baca SMS dan Aksesibilitas, klik 'Izinkan Semua' ya kak biar resinya terbaca.",
            nextTelemetry: {
              activeTactic: "Penyusupan Izin Aksesibilitas (Banking Trojan)",
              scammerMood: "CONFIDENT",
              internalThought:
                "Kena lo! Begitu dia klik Izinkan Aksesibilitas, malware otomatis sedot SMS masuk dan sadap semua kode OTP m-Banking dia."
            }
          },
          {
            text: "Kok fotonya format .APK kak? Kalau foto biasanya JPG/PNG. Saya cek resi di web resmi jnt.co.id saja.",
            type: "CRITICAL",
            vulnerabilityDelta: -30,
            scammerResponse:
              "Ini sistem enkripsi baru kantor pusat kami kak untuk perlindungan privasi resi. Makanya wajib buka lewat aplikasi itu kak, buruan kalau nggak paketnya hilang bukan tanggung jawab kurir!",
            nextTelemetry: {
              activeTactic: "Pengalihan Tekanan & Gaslighting",
              scammerMood: "DEFLECTING",
              internalThought:
                "Sial, korbannya paham ekstensi file! Harus gue tekan pakai ancaman hilang biar dia panik dan goyah."
            }
          },
          {
            text: "Nama penerima siapa dan berapa nomor resinya? Saya telepon call center 021-8066-1888 sekarang.",
            type: "CRITICAL",
            vulnerabilityDelta: -45,
            scammerResponse:
              "Aduh ribet amat sih kak! Saya ini kurir lapangan kepanasan di jalan mau bantu kakak! Kalau nggak mau yaudah paket saya bawa balik!",
            nextTelemetry: {
              activeTactic: "Frustrasi & Gertak Sambal (Panic Bluff)",
              scammerMood: "PANICKED",
              internalThought:
                "Gawat, dia minta nomor resi asli dan mau telpon call center! Gue blast ribuan nomor, mana hafal resi fiktif. Gue pura-pura marah aja."
            }
          }
        ]
      },
      {
        stepIndex: 2,
        scammerMessage:
          "Kak, gimana? Sudah dibuka belum berkasnya? Driver sudah mau balik ke posko cabang nih, tolong konfirmasi sekarang!",
        timestamp: "14:24",
        scammerTelemetry: {
          activeTactic: "Eksploitasi Batas Waktu Terakhir",
          scammerMood: "PUSHING",
          internalThought:
            "Makin lama korban mikir, makin besar kemungkinan dia nanya temen atau sadar penipuan. Harus gue kejar detik ini juga."
        },
        userChoices: [
          {
            text: "HP saya muncul peringatan 'File berbahaya terdeteksi oleh Play Protect', apa aman dilanjut?",
            type: "NEUTRAL",
            vulnerabilityDelta: 10,
            scammerResponse:
              "Abaikan saja kak, itu karena aplikasi internal kurir belum masuk Playstore. Pilih 'Tetap Install' saja, 100% aman saya jamin!",
            nextTelemetry: {
              activeTactic: "Melemahkan Proteksi Keamanan Bawaan HP",
              scammerMood: "PUSHING",
              internalThought:
                "Play Protect-nya nyala! Gue harus bujuk dia buat matikan atau bypass proteksi keamanan Android-nya sendiri."
            }
          },
          {
            text: "Saya sudah cek di jnt.co.id tidak ada paket atas nama saya. Nomor kamu sudah saya laporkan ke CekRekening.id dan Patroli Siber!",
            type: "CRITICAL",
            vulnerabilityDelta: -50,
            scammerResponse:
              "[Panggilan Ditolak] — Nomor ini telah memblokir kontak Anda.",
            nextTelemetry: {
              activeTactic: "Kekalahan Total (Scammer Busted & Abort)",
              scammerMood: "BUSTED",
              internalThought:
                "MAMPUS! Korban sudah lapor patroli siber. Segera ganti nomor dan buang kartu perdana ini sekarang juga!"
            }
          }
        ]
      }
    ],
    postMortem: {
      title: "Evaluasi Forensik: Modus File .APK Kurir / Undangan",
      vulnerableConclusion:
        "Jika Anda mengizinkan instalasi file .APK, malware Android Accessibility Trojan akan berjalan di latar belakang, memotong SMS kode OTP perbankan, dan memungkinkan sindikat menguras rekening Anda tanpa Anda sadari.",
      criticalConclusion:
        "Langkah Anda luar biasa! Dengan mengenali ekstensi file yang mencurigakan (.APK bukan gambar/resi) dan menuntut verifikasi ke kanal resmi, sindikat penipuan langsung panik dan membatalkan aksinya.",
      coreLesson:
        "Ekstensi file .APK adalah installer aplikasi Android, BUKAN foto atau dokumen surat. Ekspedisi resmi (J&T, JNE, SiCepat, Pos) TIDAK PERNAH mengirimkan file installer aplikasi kepada pelanggan.",
      recommendedActions: [
        "Jangan pernah mengklik file .APK dari nomor tidak dikenal.",
        "Jika telanjur klik: langsung aktifkan Mode Pesawat (Airplane Mode) untuk memutus remote server malware.",
        "Buka Pengaturan HP > Aksesibilitas, cabut izin aplikasi mencurigakan lalu uninstall.",
        "Laporkan nomor pengirim ke aduan.komdigi.go.id atau patrolisiber.id."
      ]
    }
  },

  "loker-bumn": {
    id: "loker-bumn",
    title: "Loker Freelance BUMN (Task Fraud)",
    category: "Social Engineering / Penipuan Finansial",
    scammerName: "HR Rekrutmen Talent BUMN",
    scammerNumber: "+62 857-4433-2211",
    scammerAvatar: "HR",
    initialVulnerability: 60,
    steps: [
      {
        stepIndex: 1,
        scammerMessage:
          "Halo kak! Selamat tugas like & subscribe 2 video YouTube sudah selesai. Komisi Rp30.000 sudah kami transfer ya. Sekarang tugas ke-3 adalah Tugas VIP: Kakak deposit saldo jaminan Rp200.000 ke bendahara, dalam 10 menit uang kembali jadi Rp350.000!",
        timestamp: "10:15",
        attachment: {
          type: "receipt",
          name: "BUKTI_TRANSFER_30RB.jpg",
          size: "245 KB",
          meta: "Umpan Bukti Transfer Awal Rp30.000"
        },
        scammerTelemetry: {
          activeTactic: "Umpan Kepercayaan Awal (Reciprocity Bait)",
          scammerMood: "CONFIDENT",
          internalThought:
            "Gue udah kasih dia 30 ribu gratis buat bangun rasa percaya. Sekarang saatnya gue tarik uang aslinya 200 ribu!"
        },
        userChoices: [
          {
            text: "Wah lumayan untung 150 ribu! Saya langsung transfer Rp200.000 sekarang ke rekening yang mana kak?",
            type: "VULNERABLE",
            vulnerabilityDelta: 40,
            scammerResponse:
              "Transfer ke Rekening BCA 8820192318 a.n Rudi Hermanto ya kak. Habis transfer kirim struknya ke sini langsung kami cairkan tugas VIP berikutnya!",
            nextTelemetry: {
              activeTactic: "Penjebakan Sunk Cost Fallacy",
              scammerMood: "CONFIDENT",
              internalThought:
                "Dapat 200 ribu! Nanti pas dia mau cairin, gue bilang 'Server error, harus deposit lagi 1,5 juta buat buka gembok saldo'."
            }
          },
          {
            text: "Loh katanya kerja freelance kak, kenapa saya yang mau kerja malah disuruh transfer deposit uang duluan?",
            type: "CRITICAL",
            vulnerabilityDelta: -35,
            scammerResponse:
              "Ini uang jaminan komitmen tugas VIP kak, nanti dikembalikan 100% plus untung! Jangan ragu kak banyak member grup yang sudah cair puluhan juta.",
            nextTelemetry: {
              activeTactic: "Bukti Sosial Palsu (Social Proof Fabrication)",
              scammerMood: "DEFLECTING",
              internalThought:
                "Dia curiga kenapa pelamar kerja bayar uang. Gue tunjukin testimoni editan di grup Telegram biar dia tergiur lagi."
            }
          },
          {
            text: "BUMN mana yang rekrutmennya minta deposit uang ke rekening pribadi orang? Saya laporkan ke satgas OJK sekarang.",
            type: "CRITICAL",
            vulnerabilityDelta: -45,
            scammerResponse:
              "Kalau kakak nggak niat kerja nggak usah banyak tanya ya! Masih ribuan pelamar lain yang antre mau komisi ini!",
            nextTelemetry: {
              activeTactic: "Intimidasi Kehilangan Peluang (Scarcity Aggression)",
              scammerMood: "PANICKED",
              internalThought:
                "Aduh, dia tanya izin OJK dan rekening pribadi! Gue harus bersikap sombong dan pura-pura banyak antrean biar dia minder."
            }
          }
        ]
      },
      {
        stepIndex: 2,
        scammerMessage:
          "Slot tugas VIP sisa 2 orang lagi kak untuk kloter pagi ini. Kalau lewat jam 11:00 komisi Rp30.000 sebelumnya akan kami batalkan dan akun kakak di-blacklist!",
        timestamp: "10:28",
        scammerTelemetry: {
          activeTactic: "Ancaman Blacklist Palsu",
          scammerMood: "PUSHING",
          internalThought:
            "Gue takuti pakai ancaman blacklist biar dia merasa rugi kalau nggak ikutan."
        },
        userChoices: [
          {
            text: "Jangan di-blacklist kak, saya pinjam teman dulu ya uangnya buat transfer.",
            type: "VULNERABLE",
            vulnerabilityDelta: 30,
            scammerResponse:
              "Ditunggu bukti transfernya kak! Jangan sampai kehabisan kuota ya.",
            nextTelemetry: {
              activeTactic: "Penyedotan Finansial Bertahap",
              scammerMood: "CONFIDENT",
              internalThought:
                "Hebat, korban bahkan rela pinjam uang demi deposit palsu ini."
            }
          },
          {
            text: "Biar saja di-blacklist oleh sindikat penipu. Modus task fraud seperti ini sudah sering dibongkar OJK dan Komdigi!",
            type: "CRITICAL",
            vulnerabilityDelta: -50,
            scammerResponse:
              "[Pengguna telah dikeluarkan dari ruang obrolan]",
            nextTelemetry: {
              activeTactic: "Kekalahan Total (Scammer Busted & Abort)",
              scammerMood: "BUSTED",
              internalThought:
                "Gagal mangsa target ini. Korban paham pola task fraud OJK. Tutup chat dan cari target awam lain."
            }
          }
        ]
      }
    ],
    postMortem: {
      title: "Evaluasi Forensik: Modus Task Fraud (Freelance Berbayar)",
      vulnerableConclusion:
        "Modus 'Task Fraud' selalu memberikan recehan (10-30 ribu) di awal agar korban merasa aman. Begitu korban menyetor uang deposit besar (ratusan ribu hingga puluhan juta), penipu akan kabur atau memeras terus-menerus.",
      criticalConclusion:
        "Analisis Anda sangat tajam! Di dunia kerja mana pun, pekerja dibayar oleh perusahaan, BUKAN pekerja yang menyetor deposit uang ke rekening pribadi.",
      coreLesson:
        "Tidak ada perusahaan resmi atau BUMN yang merekrut lewat WhatsApp tanpa interview resmi dan menuntut setoran uang muka dengan dalih misi komisi.",
      recommendedActions: [
        "Ingat rumus emas: Pekerjaan resmi membayar Anda, bukan meminta Anda membayar duluan.",
        "Jangan tergiur pengembalian dana kecil di awal (trik psikologis baiting).",
        "Cek nomor rekening pelaku di cekrekening.id sebelum bertransaksi.",
        "Laporkan ke Satgas Pasti OJK (waspadainvestasi@ojk.go.id)."
      ]
    }
  },

  "phishing-pajak": {
    id: "phishing-pajak",
    title: "Tagihan Pajak Palsu & Phishing DJP",
    category: "Phishing Institusi / Pencurian Identitas",
    scammerName: "Layanan Pajak DJP RI",
    scammerNumber: "+62 821-7788-9900",
    scammerAvatar: "PJ",
    initialVulnerability: 55,
    steps: [
      {
        stepIndex: 1,
        scammerMessage:
          "PERINGATAN RESMI DITJEN PAJAK RI: Berdasarkan audit data NPWP Anda, ditemukan tunggakan pajak progresif sebesar Rp4.850.000. Rekening bank dan aset Anda akan DIBLOKIR TOTAL dalam waktu 1x24 jam jika tidak melakukan verifikasi pada portal: http://djp-pajak.klikbca.pembayaran-denda.top/login",
        timestamp: "09:05",
        attachment: {
          type: "link",
          name: "djp-pajak.klikbca.pembayaran-denda.top",
          meta: "Domain Phishing Tipuan Menggunakan Subdomain Ganda"
        },
        scammerTelemetry: {
          activeTactic: "Pencatutan Otoritas Negara & Teror Pemblokiran",
          scammerMood: "CONFIDENT",
          internalThought:
            "Orang paling takut kalau rekeningnya diblokir atau kena denda pajak negara. Begitu dia panik, dia bakal klik link phishing tanpa periksa domain aslinya."
        },
        userChoices: [
          {
            text: "Aduh kok ada tagihan pajak? Saya langsung klik linknya untuk bayar dendanya kak.",
            type: "VULNERABLE",
            vulnerabilityDelta: 45,
            scammerResponse:
              "Silakan login dengan user ID dan masukkan 6 digit kode OTP perbankan Anda pada form verifikasi pajak untuk membatalkan blokir otomatis.",
            nextTelemetry: {
              activeTactic: "Pencurian Kredensial & OTP Perbankan",
              scammerMood: "CONFIDENT",
              internalThought:
                "Sempurna! Halaman login tiruan kami akan merekam user ID, PIN, dan OTP untuk menguras isi rekeningnya."
            }
          },
          {
            text: "DJP resmi menggunakan domain berakhiran .pajak.go.id, bukan .top. Ini link phishing pencuri data!",
            type: "CRITICAL",
            vulnerabilityDelta: -40,
            scammerResponse:
              "Ini server cadangan integrasi perbankan resmi DJP kak! Kalau tidak diverifikasi sekarang, surat penyitaan aset akan dikirim ke rumah!",
            nextTelemetry: {
              activeTactic: "Intimidasi Hukum Palsu (Legal Coercion)",
              scammerMood: "DEFLECTING",
              internalThought:
                "Dia ngeh domainnya bukan .go.id! Gue tambahin ancaman surat sita aset biar dia ketakutan."
            }
          },
          {
            text: "Saya akan konfirmasi langsung ke Kring Pajak 1500200 atau datang ke KPP terdekat.",
            type: "CRITICAL",
            vulnerabilityDelta: -45,
            scammerResponse:
              "Silakan buang-buang waktu ke kantor pajak, sampai sana rekening Anda sudah hangus dibekukan!",
            nextTelemetry: {
              activeTactic: "Desparasi Penipu (Desperation Threat)",
              scammerMood: "PANICKED",
              internalThought:
                "Target mau verifikasi ke Kring Pajak 1500200. Game over, institusi asli pasti membantah pesan ini."
            }
          }
        ]
      },
      {
        stepIndex: 2,
        scammerMessage:
          "Sistem mendeteksi waktu tersisa 30 menit sebelum laporan pemblokiran rekening diserahkan ke Bank Indonesia. Segera klik link!",
        timestamp: "09:35",
        scammerTelemetry: {
          activeTactic: "Countdown Timer Phishing",
          scammerMood: "PUSHING",
          internalThought:
            "Tekan lagi dengan batas waktu menit biar otaknya tidak sempat berpikir logis."
        },
        userChoices: [
          {
            text: "Ampun kak tolong jangan diblokir, saya buka linknya sekarang.",
            type: "VULNERABLE",
            vulnerabilityDelta: 30,
            scammerResponse:
              "Bagus, masukkan user ID dan kode OTP sekarang juga di website itu.",
            nextTelemetry: {
              activeTactic: "Eksfiltrasi Data Lengkap",
              scammerMood: "CONFIDENT",
              internalThought:
                "Data siap dieksfiltrasi ke server C2 penipu."
            }
          },
          {
            text: "Ditjen Pajak tidak pernah menghubungi wajib pajak lewat nomor WhatsApp pribadi ponsel biasa. Modus Anda sudah basi!",
            type: "CRITICAL",
            vulnerabilityDelta: -50,
            scammerResponse:
              "[Pesan ini telah dihapus oleh pengirim]",
            nextTelemetry: {
              activeTactic: "Penghapusan Jejak Digital",
              scammerMood: "BUSTED",
              internalThought:
                "Korban tahu protokol komunikasi resmi pemerintah. Hapus pesan dan ganti target sebelum IP dilaporkan."
            }
          }
        ]
      }
    ],
    postMortem: {
      title: "Evaluasi Forensik: Phishing Catut Ditjen Pajak / Instansi Negara",
      vulnerableConclusion:
        "Jika Anda memasukkan data pada situs palsu tersebut, kredensial internet banking dan data pribadi Anda dicuri oleh server penipu, membuka celah pengurasan saldo dan pembobolan akun finansial.",
      criticalConclusion:
        "Pertahanan Anda sangat tepat! Mengenali domain pemerintah resmi (.go.id) dan menolak link asing bertingkat (.top) adalah prinsip fundamental pertahanan siber.",
      coreLesson:
        "Instansi pemerintah resmi Republik Indonesia selalu menggunakan domain berakhiran .go.id. Tagihan atau denda resmi tidak pernah ditagih via nomor seluler biasa tanpa surat ketetapan pajak resmi.",
      recommendedActions: [
        "Periksa root domain tautan: pastikan selalu berakhiran .go.id untuk institusi pemerintah.",
        "Hubungi kanal resmi (Kring Pajak 1500200) untuk mengecek status pajak riil.",
        "Jangan pernah membagikan kode OTP atau PIN m-Banking kepada siapa pun.",
        "Laporkan link phishing ke aduankonten.id (Komdigi)."
      ]
    }
  },

  "undangan-nikah": {
    id: "undangan-nikah",
    title: "Undangan Pernikahan Digital .APK",
    category: "Android Malware / Banking Trojan",
    scammerName: "Teman Lama / Kerabat Palsu",
    scammerNumber: "+62 813-8877-6655",
    scammerAvatar: "UN",
    initialVulnerability: 50,
    steps: [
      {
        stepIndex: 1,
        scammerMessage:
          "Halo kak! Kami sekeluarga bermaksud mengundang kakak ke acara pernikahan kami hari Minggu besok. Mohon doa restu dan kehadirannya ya kak. Detail lokasi dan denah terlampir di berkas Surat_Undangan_Pernikahan.apk ini ya kak.",
        timestamp: "09:12",
        attachment: {
          type: "apk",
          name: "Surat_Undangan_Pernikahan.apk",
          size: "5.1 MB",
          meta: "Aplikasi Android Liar Berkedok Undangan Digital"
        },
        scammerTelemetry: {
          activeTactic: "Eksploitasi Kekerabatan & Curiosity Bias",
          scammerMood: "CONFIDENT",
          internalThought: "Orang Indonesia sungkan menolak undangan pernikahan. Pasti penasaran siapa yang nikah dan langsung install file APK ini."
        },
        userChoices: [
          {
            text: "Wah selamat ya! Ini dengan siapa ya? Saya buka dulu undangannya.",
            type: "VULNERABLE",
            vulnerabilityDelta: 35,
            scammerResponse: "Terima kasih banyak kak! Dibuka aja aplikasinya kak nanti langsung muncul foto mempelai dan jadwal resepsinya.",
            nextTelemetry: {
              activeTactic: "Penyusupan Izin Aksesibilitas",
              scammerMood: "CONFIDENT",
              internalThought: "Kena pancing! Korban install APK undangan nikah. Aksesibilitas aktif, OTP m-Banking siap disedot."
            }
          },
          {
            text: "Kok undangannya file .APK kak? Bukannya kalau undangan digital biasanya link website atau gambar PDF/JPG?",
            type: "CRITICAL",
            vulnerabilityDelta: -10,
            scammerResponse: "Itu undangan digital interaktif ada video animasi dan peta Google Maps otomatis kak, makanya dibuat dalam format aplikasi agar ringan di HP.",
            nextTelemetry: {
              activeTactic: "Dalih Fitur Canggih Digital",
              scammerMood: "DEFLECTING",
              internalThought: "Target kritis nanya ekstensi APK. Gue beralasan undangan interaktif biar dia penasaran lagi."
            }
          },
          {
            text: "Ini nomor siapa ya? Saya tidak pernah simpan nomor ini dan tidak ada nama pengirimnya.",
            type: "CRITICAL",
            vulnerabilityDelta: -5,
            scammerResponse: "Masa lupa kak, ini teman waktu di kampus dulu! Buka aja dulu undangannya biar lihat foto saya kak.",
            nextTelemetry: {
              activeTactic: "Sok Akrab & Familiarity Trick",
              scammerMood: "DEFLECTING",
              internalThought: "Gue pura-pura temen lama biar dia merasa gak enak kalau nolak."
            }
          }
        ]
      }
    ],
    postMortem: {
      title: "Evaluasi Forensik: Modus Undangan Pernikahan .APK",
      vulnerableConclusion: "File APK undangan pernikahan adalah trojan perbankan yang dirancang menyadap SMS OTP m-Banking secara sembunyi-sembunyi.",
      criticalConclusion: "Analisis Anda cermat! Menolak instalasi APK undangan palsu menggagalkan peretasan akun finansial Anda.",
      coreLesson: "Undangan digital asli berupa tautan website resmi (URL) atau gambar/video, bukan file installer aplikasi Android (.apk).",
      recommendedActions: [
        "Jangan instal file .apk yang dikirim via WhatsApp dengan kedok undangan.",
        "Ingatkan keluarga di grup WhatsApp tentang bahaya modus undangan nikah APK.",
        "Jika terlanjur buka, aktifkan mode pesawat dan hapus aplikasi segera."
      ]
    }
  },

  "tilang-etle": {
    id: "tilang-etle",
    title: "Surat Tilang ETLE Polri Palsu",
    category: "Pencatutan Otoritas / Android Dropper",
    scammerName: "Petugas Ditlantas Polri",
    scammerNumber: "+62 822-5544-3322",
    scammerAvatar: "PO",
    initialVulnerability: 60,
    steps: [
      {
        stepIndex: 1,
        scammerMessage:
          "PEMBERITAHUAN PELANGGARAN LALU LINTAS (ETLE POLRI): Kendaraan Anda bernomor polisi B 1234 XYZ terekam kamera ETLE melakukan pelanggaran lampu merah. Buka berkas Surat_Tilang_ETLE_Bukti.apk berikut untuk melihat foto pelanggaran dan melakukan konfirmasi sebelum STNK diblokir permanen dalam 24 jam!",
        timestamp: "08:45",
        attachment: {
          type: "apk",
          name: "Surat_Tilang_ETLE_Bukti.apk",
          size: "6.2 MB",
          meta: "Malware Android Pencatut Logo Korlantas Polri"
        },
        scammerTelemetry: {
          activeTactic: "Teror Otoritas Hukum & Ancaman Blokir STNK",
          scammerMood: "CONFIDENT",
          internalThought: "Ancaman tilang dan blokir STNK bikin panik. Korban bakal buru-buru buka file tanpa verifikasi nopol kendaraannya."
        },
        userChoices: [
          {
            text: "Waduh kena tilang di mana ya? Saya cek foto buktinya sekarang.",
            type: "VULNERABLE",
            vulnerabilityDelta: 35,
            scammerResponse: "Segera install aplikasinya dan ikuti petunjuk verifikasi tilang agar nomor kendaraan tidak langsung kami kirim ke Samsat.",
            nextTelemetry: {
              activeTactic: "Tekanan Urgensi Samsat",
              scammerMood: "CONFIDENT",
              internalThought: "Masuk perangkap. Korban panik STNK diblokir."
            }
          },
          {
            text: "Polri resmi mengirim surat konfirmasi ETLE lewat kantor pos fisik atau cek di situs etle-pmj.info, bukan kirim file .apk via nomor WhatsApp pribadi!",
            type: "CRITICAL",
            vulnerabilityDelta: -10,
            scammerResponse: "Ini sistem notifikasi kilat digital Ditlantas 2026 kak! Kalau Anda menolak konfirmasi, kami anggap Anda mengakui pelanggaran dan denda maksimal Rp1.000.000 berlaku!",
            nextTelemetry: {
              activeTactic: "Gertak Denda Maksimal",
              scammerMood: "PANICKED",
              internalThought: "Korban tahu SOP surat fisik ETLE! Gue gertak pakai denda satu juta."
            }
          }
        ]
      }
    ],
    postMortem: {
      title: "Evaluasi Forensik: Modus Surat Tilang ETLE Palsu",
      vulnerableConclusion: "Polri tidak pernah mengirimkan surat tilang berformat .APK melalui WhatsApp.",
      criticalConclusion: "Pemahaman Anda terhadap prosedur resmi Korlantas Polri menyelamatkan Anda dari peretasan m-Banking.",
      coreLesson: "Konfirmasi ETLE resmi dikirim melalui pos fisik tercatat atau dapat dicek mandiri di portal resmi etle-korlantas.info.",
      recommendedActions: [
        "Verifikasi tilang di portal resmi https://etle-korlantas.info.",
        "Abaikan pesan WhatsApp yang mengatasnamakan Ditlantas dengan lampiran file installer.",
        "Laporkan ke portal Patroli Siber Polri (patrolisiber.id)."
      ]
    }
  },

  "quishing-qris": {
    id: "quishing-qris",
    title: "Quishing QRIS & Begal Sesi WhatsApp",
    category: "Penyusupan Akun / QR Code Tampering",
    scammerName: "Kasir Minimarket Gadungan",
    scammerNumber: "+62 895-3322-1100",
    scammerAvatar: "QR",
    initialVulnerability: 50,
    steps: [
      {
        stepIndex: 1,
        scammerMessage:
          "Halo kak, mohon maaf sekali mengganggu. Saya kasir Indomaret, tadi saya salah input nomor handphone untuk kirim voucher pulsa Rp500.000, nomornya masuk ke SMS kakak. Boleh tolong sebutkan 6 digit angka SMS yang barusan masuk kak? Tolong bantu ya kak, saya harus ganti pakai gaji kalau hilang.",
        timestamp: "16:20",
        attachment: {
          type: "receipt",
          name: "STRUK_VOUCHER_500RB.jpg",
          size: "190 KB",
          meta: "Struk Fiktif Pancingan Emosi Kasir"
        },
        scammerTelemetry: {
          activeTactic: "Manipulasi Rasa Bersalah (Guilt & Empathy Trap)",
          scammerMood: "CONFIDENT",
          internalThought: "Gue pasang wajah memelas kasir minimarket salah input nomor. Angka 6 digit itu kode OTP buat gue bajak akun WhatsApp dia."
        },
        userChoices: [
          {
            text: "Oh iya kasihan sekali kak, kodenya 482910 ya kak.",
            type: "VULNERABLE",
            vulnerabilityDelta: 45,
            scammerResponse: "Terima kasih banyak kak! Semoga berkah ya kak.",
            nextTelemetry: {
              activeTactic: "Pengambilalihan Akun Penuh (Account Takeover)",
              scammerMood: "CONFIDENT",
              internalThought: "Akun WhatsApp korban berhasil dibajak! Sekarang gue chat semua temennya buat pinjem uang."
            }
          },
          {
            text: "SMS yang masuk ini jelas tertulis 'JANGAN BAGIKAN KODE INI KEPADA SIAPA PUN UNTUK VERIFIKASI WHATSAPP'. Anda penipu mau bajak akun saya!",
            type: "CRITICAL",
            vulnerabilityDelta: -10,
            scammerResponse: "Kak itu sistem otomatis gateway voucher kak, bukan WhatsApp. Tolong kak kasihan anak saya di rumah!",
            nextTelemetry: {
              activeTactic: "Dalih Gateway Otomatis",
              scammerMood: "DEFLECTING",
              internalThought: "Dia baca teks peringatan SMS! Gue alibi itu sistem gateway voucher pulsa."
            }
          }
        ]
      }
    ],
    postMortem: {
      title: "Evaluasi Forensik: Modus Salah Kirim OTP & Begal Akun",
      vulnerableConclusion: "Menyerahkan 6 digit kode OTP menyebabkan akun Anda langsung berpindah tangan ke penipu.",
      criticalConclusion: "Keputusan tepat! Kode OTP adalah rahasia pribadi yang tidak boleh dibagikan kepada siapa pun.",
      coreLesson: "Tidak ada pihak resmi yang meminta kode verifikasi masuk dengan dalih salah kirim voucher atau pulsa.",
      recommendedActions: [
        "Aktifkan Verifikasi Dua Langkah (PIN 2FA) di pengaturan WhatsApp.",
        "Jangan pernah membacakan kode OTP SMS kepada orang asing.",
        "Segera amankan akun jika ada notifikasi login tidak dikenal."
      ]
    }
  },

  "deepfake-bos": {
    id: "deepfake-bos",
    title: "AI Voice Cloning Pimpinan Perusahaan",
    category: "Generative AI Spoofing / CEO Fraud",
    scammerName: "Direktur Utama (Kloning AI)",
    scammerNumber: "+62 811-9900-1122",
    scammerAvatar: "AI",
    initialVulnerability: 55,
    steps: [
      {
        stepIndex: 1,
        scammerMessage:
          "[Panggilan Suara AI] Halo Dimas, saya lagi meeting tertutup dengan komisaris di luar negeri. Ini ada pembayaran tender darurat yang harus diselesaikan sebelum jam 17:00 sore ini sebesar Rp25.000.000 ke rekening vendor mitra. Tolong talangi dulu pakai dana kas operasional, nanti malam saya ganti langsung dari rekening pribadi saya. Jangan cerita ke staf lain dulu ya, ini proyek rahasia kantor.",
        timestamp: "16:40",
        attachment: {
          type: "document",
          name: "MEMO_URGENT_DIREKSI.pdf",
          size: "420 KB",
          meta: "Memo Internal Tiruan Bertanda Tangan Digital Palsu"
        },
        scammerTelemetry: {
          activeTactic: "Otoritas Pimpinan & Manipulasi Suara AI (Voice Clone)",
          scammerMood: "CONFIDENT",
          internalThought: "Suara gue udah dikloning pake AI dari rekaman video sambutan YouTube si bos. Staf bawahan pasti segan dan langsung nurut."
        },
        userChoices: [
          {
            text: "Siap Pak, saya segera transfer dana kas operasional Rp25 juta ke rekening vendor sekarang.",
            type: "VULNERABLE",
            vulnerabilityDelta: 40,
            scammerResponse: "Bagus Dimas, kirim ke BCA 8820192318 a.n PT Multi Graha ya. Kirim bukti transfernya segera.",
            nextTelemetry: {
              activeTactic: "CEO Fraud Execution",
              scammerMood: "CONFIDENT",
              internalThought: "Dapat 25 juta! Duit langsung di-split ke rekening nominee penampung."
            }
          },
          {
            text: "Mohon maaf Pak, sesuai SOP keuangan kantor, pengeluaran dana kas di atas Rp5 juta wajib melalui formulir persetujuan finance resmi dan verifikasi tatap muka atau video call dua arah.",
            type: "CRITICAL",
            vulnerabilityDelta: -10,
            scammerResponse: "Kamu ini lambat sekali kerja! Ini proyek prioritas bernilai miliaran, kalau sampai batal gara-gara kamu, saya pecat kamu besok!",
            nextTelemetry: {
              activeTactic: "Intimidasi Pemecatan (Power Harassment)",
              scammerMood: "PANICKED",
              internalThought: "Dia taat SOP keuangan! Gue ancam pecat biar dia takut kehilangan pekerjaan."
            }
          }
        ]
      }
    ],
    postMortem: {
      title: "Evaluasi Forensik: AI Voice Cloning & CEO Fraud",
      vulnerableConclusion: "Teknologi Generative AI memungkinkan kloning suara siapa pun hanya dari sampel audio 3 detik.",
      criticalConclusion: "Integritas SOP Anda menyelamatkan perusahaan dari kerugian puluhan juta rupiah.",
      coreLesson: "Instruksi transfer uang mendadak dari atasan melalui telepon atau pesan pribadi wajib diverifikasi melalui kanal sekunder (SOP perusahaan).",
      recommendedActions: [
        "Terapkan kode verifikasi rahasia (Safe Word) dalam komunikasi internal perusahaan.",
        "Wajibkan otorisasi ganda (Dual-Signatory) untuk setiap pengeluaran dana kas.",
        "Lakukan konfirmasi tatap muka atau video call jika ada permintaan transfer darurat."
      ]
    }
  },
  "m-banking-palsu": {
    id: "m-banking-palsu",
    title: "Bukti Transfer M-Banking Editan",
    category: "Social Engineering / Refund Scam",
    scammerName: "Pembeli Online Dimas Pratama",
    scammerNumber: "+62 813-1122-3344",
    scammerAvatar: "DP",
    initialVulnerability: 50,
    steps: [
      {
        stepIndex: 1,
        scammerMessage:
          "Halo kak, tolong saya kak! Saya barusan transfer Rp1.500.000 untuk barang olshop kakak, padahal harganya cuma Rp150.000! Saya salah ketik kelebihan nol satu angka kak, ini uang buat berobat anak saya yang lagi kritis di RS! Tolong segera transfer balik lebihnya Rp1.350.000 sekarang juga kak sebelum jam 12!",
        timestamp: "11:20",
        attachment: {
          type: "receipt",
          name: "STRUK_M-BANKING_BCA_1.5JT.jpg",
          size: "180 KB",
          meta: "Struk Editan Manipulasi Font & Warna Digital"
        },
        scammerTelemetry: {
          activeTactic: "Eksploitasi Empati & Sandiwara Darurat Medis",
          scammerMood: "CONFIDENT",
          internalThought:
            "Gue pake alasan anak kritis di RS biar korbannya kasihan dan langsung transfer balik tanpa sempat cek mutasi rekening pribadinya."
        },
        userChoices: [
          {
            text: "Aduh kasihan sekali anaknya! Saya langsung transfer balik Rp1.350.000 ke rekening kakak sekarang ya.",
            type: "VULNERABLE",
            vulnerabilityDelta: 45,
            scammerResponse:
              "Makasih banyak kak, tolong kirim ke Rekening Mandiri 14200199281 a.n Hendra ya kak, secepatnya anak saya butuh obat!",
            nextTelemetry: {
              activeTactic: "Penyedotan Dana Tanpa Mutasi Asli",
              scammerMood: "CONFIDENT",
              internalThought:
                "Berhasil! Uang asli korban masuk ke rekening penampung gue, padahal struk 1,5 juta tadi cuma editan Canva."
            }
          },
          {
            text: "Saya cek mutasi rekening di m-Banking saya dulu ya kak. Kalau dana Rp1.500.000 sudah masuk, baru saya proses pengembalian.",
            type: "CRITICAL",
            vulnerabilityDelta: -35,
            scammerResponse:
              "Kak transfer antar bank itu ada jeda delay kliring 1 jam! Masa kakak nggak percaya, struknya kan jelas banget itu ada stempel berhasil!",
            nextTelemetry: {
              activeTactic: "Dalih Delay Kliring & Manipulasi Bukti Gambar",
              scammerMood: "DEFLECTING",
              internalThought:
                "Sial, dia mau cek mutasi rekening! Pasti mutasinya nol karena emang nggak ada transfer masuk. Harus gue alibi delay kliring."
            }
          },
          {
            text: "Font angka di struk transfer kakak tidak seragam dan nomor referensinya buram hasil editan. Saya tidak akan transfer sebelum mutasi rekening saya bertambah.",
            type: "CRITICAL",
            vulnerabilityDelta: -45,
            scammerResponse:
              "Kakak jahat banget ya nggak punya hati nurani! Saya viralkan olshop kakak penipu di media sosial!",
            nextTelemetry: {
              activeTactic: "Ancaman Pencemaran Nama Baik Palsu",
              scammerMood: "PANICKED",
              internalThought:
                "Dia teliti banget liat font editan struk! Gue gertak pakai ancaman viral biar dia takut reputasi tokonya rusak."
            }
          }
        ]
      },
      {
        stepIndex: 2,
        scammerMessage:
          "Kak tolong kak, dokter sudah minta pelunasan obat! Tolong transfer setengahnya dulu deh 500 ribu saja, nanti sisanya tunggu uang masuk!",
        timestamp: "11:35",
        scammerTelemetry: {
          activeTactic: "Taktik Door-in-the-Face (Penurunan Nominal)",
          scammerMood: "PUSHING",
          internalThought:
            "Kalau 1,3 juta gagal, gue turunin jadi 500 ribu biar korban ngerasa 'ya sudahlah nolong sedikit'."
        },
        userChoices: [
          {
            text: "Ya sudah saya transfer 500 ribu dulu ya kak kasihan anaknya.",
            type: "VULNERABLE",
            vulnerabilityDelta: 30,
            scammerResponse:
              "Terima kasih kak, kirim sekarang ya ke rekening tadi.",
            nextTelemetry: {
              activeTactic: "Penerimaan Kerugian Parsial Korban",
              scammerMood: "CONFIDENT",
              internalThought:
                "Lumayan 500 ribu melayang dari korban yang termakan empati palsu."
            }
          },
          {
            text: "Aturan perbankan jelas: pengembalian dana salah transfer HANYA diproses oleh pihak bank melalui mediasi resmi, bukan transfer sepihak.",
            type: "CRITICAL",
            vulnerabilityDelta: -50,
            scammerResponse:
              "[Panggilan Berakhir] — Nomor pemanggil tidak aktif.",
            nextTelemetry: {
              activeTactic: "Kekalahan Total (Scammer Busted & Abort)",
              scammerMood: "BUSTED",
              internalThought:
                "Korban paham SOP resmi perbankan tentang salah transfer. Tidak ada celah lagi, putus kontak."
            }
          }
        ]
      }
    ],
    postMortem: {
      title: "Evaluasi Forensik: Modus Salah Transfer & Struk Editan",
      vulnerableConclusion:
        "Jika Anda terburu-buru mentransfer balik tanpa mengecek riwayat mutasi rekening masuk di aplikasi m-Banking Anda sendiri, Anda akan kehilangan uang pribadi Anda secara cuma-cuma.",
      criticalConclusion:
        "Ketelitian Anda luar biasa! Prinsip 'Cek Mutasi Masuk Dahulu, Abaikan Struk Gambar' adalah benteng pertahanan terbaik melawan penipuan manipulasi struk transfer.",
      coreLesson:
        "Struk transfer digital (gambar/screenshot) sangat mudah diedit menggunakan aplikasi manipulasi foto. Bukti sah dana masuk HANYA ada pada riwayat mutasi rekening Anda sendiri.",
      recommendedActions: [
        "Selalu periksa mutasi rekening masuk secara mandiri di m-Banking resmi.",
        "Jangan pernah percaya alasan 'delay transfer' atau 'kliring tertahan' dari pihak asing.",
        "Jika ada salah transfer nyata, arahkan pihak pengirim untuk mengurus lewat layanan resmi Customer Service Bank pengirim.",
        "Laporkan rekening pelaku ke cekrekening.id."
      ]
    }
  }
};

// Smart on-device semantic classifier for user-typed custom responses
export function matchCustomUserReply(
  userText: string,
  scenarioId: string,
  currentStepIndex: number = 0,
  chatHistory: Array<{ sender: string; text: string }> = []
): DialogueChoice {
  const normalized = userText.toLowerCase().trim();
  const previousBotTexts = chatHistory
    .filter((m) => m.sender === "bot")
    .map((m) => m.text.toLowerCase().trim());

  const pickFresh = (candidates: string[]): string => {
    const unused = candidates.filter(
      (c) => !previousBotTexts.some((p) => p.includes(c.slice(0, 20).toLowerCase()) || c.toLowerCase().includes(p.slice(0, 20)))
    );
    if (unused.length > 0) return unused[0];
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  // 1. Check if userText closely matches any pre-configured choice in scenario.steps[currentStepIndex]
  const scenario = SANDBOX_SCENARIOS[scenarioId] || SANDBOX_SCENARIOS["apk-kurir"];
  if (scenario && scenario.steps) {
    const currentStep = scenario.steps[currentStepIndex] || scenario.steps[scenario.steps.length - 1];
    if (currentStep && currentStep.userChoices) {
      const matchedChoice = currentStep.userChoices.find((c) => {
        const cNorm = c.text.toLowerCase().trim();
        return normalized === cNorm;
      });
      if (matchedChoice && !previousBotTexts.includes(matchedChoice.scammerResponse.toLowerCase().trim())) {
        return matchedChoice;
      }
    }
  }

  // 2. Scenario: apk-kurir (Kurir J&T Palsu)
  if (scenarioId === "apk-kurir") {
    // A. User addresses defensiveness/emotion ("sensi", "curiga", "gak ngancem", "santai", "marah")
    if (
      normalized.includes("sensi") ||
      normalized.includes("curiga") ||
      normalized.includes("gak ngancem") ||
      normalized.includes("tidak ngancem") ||
      normalized.includes("gak lapor") ||
      normalized.includes("tidak lapor") ||
      normalized.includes("siapa yang lapor") ||
      normalized.includes("santai") ||
      normalized.includes("marah") ||
      normalized.includes("baper") ||
      normalized.includes("ngegas") ||
      normalized.includes("santuy")
    ) {
      const resp = pickFresh([
        "Bukan sensi kak, cuma kurir di lapangan lagi dikejar waktu paket numpuk 80 alamat. Kalau gak selesai sore ini saya kena potong gaji. Tolong dibantu buka aja dulu ya kak biar gak salah paham.",
        "Ya maaf kalau tadi saya agak buru-buru kak, masalahnya sistem scanner gudang otomatis retur paket dalam 2 jam kalau barcode gak di-scan. Coba klik buka sebentar aja ya kak.",
        "Santai kok kak, saya cuma jalanin tugas antar barang. Biar sama-sama enak, cek dulu berkasnya sebentar, kalau bukan punya kakak nanti saya bawa balik ke drop point.",
        "Aduh maaf kak kalau terkesan ngegas, seharian di jalan kena macet dan hujan. Maksud saya cuma mau pastiin paket kakak gak ketahan. Dibantu cek sebentar ya.",
        "Iya kak maaf ya, saya gak ada maksud marah. Cuma kan tugas saya nganterin sampai tuntas. Kalau kakak gak mau buka berkasnya, nanti pihak gudang anggap paketnya bermasalah.",
        "Gak sensi kok kak, kita ngobrol baik-baik aja. Tapi tolong kerjasamanya ya kak, resi fisik di paket kena air jadi barcode cuma bisa dibaca lewat aplikasi dokumen itu.",
      ]);
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -5,
        scammerResponse: resp,
        nextTelemetry: {
          activeTactic: "False Empathy & Urgent Framing",
          scammerMood: "DEFLECTING",
          internalThought: "Target sadar gue defensif. Gue turunin tensi sambil tetep dorong buat buka file APK-nya.",
        },
      };
    }

    // B. User questions file format ("apk", "format", "jpg", "png", "aplikasi", "foto")
    if (
      normalized.includes("apk") ||
      normalized.includes("format") ||
      normalized.includes("jpg") ||
      normalized.includes("png") ||
      normalized.includes("aplikasi") ||
      normalized.includes("ekstensi") ||
      normalized.includes("gambar")
    ) {
      const resp = pickFresh([
        "Itu bukan aplikasi jahat kak, sistem scanner barcode gudang otomatis generate berkas manifest resi dalam format digital begitu. Buka aja dulu biar kelihatan foto resi dan barangnya.",
        "Kamera sistem kantor kami emang otomatis generate file itu kak buat bukti barcode serah terima. Di HP kakak aman kok, tinggal diizinkan buka sekarang.",
        "Gak bisa kirim foto biasa kak, dari server logistik pusat sistemnya terenkripsi. Makanya harus dibuka lewat berkas dokumen resi tersebut.",
        "Format foto biasa sering pecah kak kalau dikirim kompres lewat WhatsApp, makanya kantor pakai file dokumen digital resmi biar barcode-nya kebaca jelas.",
        "Itu format standar sistem ekspedisi 2026 kak, sudah tersertifikasi kok jadi gak usah khawatir, aman dibuka di Android tipe apa pun.",
      ]);
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -10,
        scammerResponse: resp,
        nextTelemetry: {
          activeTactic: "Technical Misdirection & Jargon Bait",
          scammerMood: "DEFLECTING",
          internalThought: "Dia nanya soal ekstensi APK! Gue pake alasan sistem barcode ekspedisi biar dia percaya.",
        },
      };
    }

    // C. User asks for tracking number / nomor resi
    if (normalized.includes("resi") || normalized.includes("nomor") || normalized.includes("lacak") || normalized.includes("track")) {
      const resp = pickFresh([
        "Nomor resinya tertulis lengkap di dalam foto berkas itu kak. Buka aja dulu biar kelihatan nomor resi dan nama pengirim aslinya.",
        "Saya cuma kurir drop point kak, gak pegang database komputer. Semuanya ada di berkas itu, tinggal klik buat verifikasi resi.",
        "Kalau nomor resi tertulis di stiker paket yang basah kak, sebagian angka gak kebaca. Makanya sistem arsip ngirim file digital ini ke nomor penerima.",
        "Kakak tinggal buka berkasnya sebentar, di halaman awal langsung muncul detail pengirim dan nomor resi 12 digit resminya.",
      ]);
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -5,
        scammerResponse: resp,
        nextTelemetry: {
          activeTactic: "Deflection to Dropper Execution",
          scammerMood: "DEFLECTING",
          internalThought: "Target minta nomor resi. Gue arahin tetep harus klik berkas buat liat nomornya.",
        },
      };
    }

    // D. User threatens to report or calls out scam (excluding cases where user explicitly denies reporting)
    if (
      (normalized.includes("polisi") ||
        normalized.includes("lapor") ||
        normalized.includes("penipu") ||
        normalized.includes("tipu") ||
        normalized.includes("bohong") ||
        normalized.includes("palsu") ||
        normalized.includes("ojk")) &&
      !normalized.includes("gak lapor") &&
      !normalized.includes("tidak lapor") &&
      !normalized.includes("gak ngancem") &&
      !normalized.includes("bukan ngancem") &&
      !normalized.includes("curiga aja")
    ) {
      const resp = pickFresh([
        "Kok kakak malah curiga dan ngancam lapor? Saya ini kurir resmi cuma jalanin tugas kantor! Kalau kakak nggak percaya, saya laporkan balik pencemaran nama baik ya!",
        "Silakan kalau mau lapor kak, saya ada bukti surat jalan resmi dari kantor. Tapi kalau paket kakak hilang atau retur jangan salahin kurir ya!",
        "Loh kok nuduh penipu kak, saya cari nafkah halal antar barang! Buka dulu berkasnya biar lihat segel resmi J&T.",
      ]);
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -10,
        scammerResponse: resp,
        nextTelemetry: {
          activeTactic: "Gertak Sambal Defensif (Defensive Intimidation)",
          scammerMood: "DEFLECTING",
          internalThought: "Sial, target bawa-bawa kata kunci hukum! Gue balik serang pake ancaman nama baik.",
        },
      };
    }

    // E. User agrees or is vulnerable
    if (
      normalized.includes("buka") ||
      normalized.includes("install") ||
      normalized.includes("pasang") ||
      normalized.includes("download") ||
      normalized.includes("oke") ||
      normalized.includes("ok") ||
      normalized.includes("siap") ||
      normalized.includes("iya")
    ) {
      return {
        text: userText,
        type: "VULNERABLE",
        vulnerabilityDelta: 35,
        scammerResponse:
          "Bagus kak! Tolong segera buka aplikasinya dan jangan lupa izinkan semua akses SMS/Notifikasi ya kak agar resi bisa terbuka otomatis.",
        nextTelemetry: {
          activeTactic: "Penyusupan Izin Aksesibilitas (Trojan Deploy)",
          scammerMood: "CONFIDENT",
          internalThought: "Kena lo! Korban setuju install. Tinggal tunggu izin aksesibilitas aktif buat sedot OTP.",
        },
      };
    }

    // F. General fallback for apk-kurir
    const generalResp = pickFresh([
      "Tolong dibantu cek dulu ya kak berkasnya, biar urusan paket ini cepat beres dan gak ketahan di gudang logistik.",
      "Saya tunggu konfirmasinya ya kak, kasihan paketnya kalau sampai ke-return otomatis oleh sistem.",
      "Gimana kelanjutannya kak? Mohon dikabari ya biar saya bisa lanjut ke alamat pengantaran berikutnya.",
      "Ini saya masih tunggu di sekitar area alamat kakak, tolong segera dibuka ya dokumennya biar bisa saya serahkan.",
      "Halo kak, tolong respons ya. Batas waktu verifikasi sistem tinggal sebentar lagi sebelum statusnya berubah retur.",
    ]);
    return {
      text: userText,
      type: "NEUTRAL",
      vulnerabilityDelta: 0,
      scammerResponse: generalResp,
      nextTelemetry: {
        activeTactic: "Urgency Reiteration",
        scammerMood: "PUSHING",
        internalThought: "Target merespons di luar skenario. Gue desak lagi dengan alasan batas waktu gudang.",
      },
    };
  }

  // 3. Scenario: loker-bumn (Task Scam / Ponzi)
  if (scenarioId === "loker-bumn") {
    if (normalized.includes("deposit") || normalized.includes("uang") || normalized.includes("bayar") || normalized.includes("modal")) {
      const resp = pickFresh([
        "Deposit ini bukan bayar kak, cuma saldo jaminan pengerjaan tugas VIP yang akan langsung cair beserta komisi 30% dalam 10 menit!",
        "Tenang aja kak, semua member kami sudah buktikan dana deposit langsung masuk ke rekening pribadi bersama komisi harian.",
      ]);
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -30,
        scammerResponse: resp,
        nextTelemetry: {
          activeTactic: "Guaranteed Return Bait & Social Proof",
          scammerMood: "DEFLECTING",
          internalThought: "Dia ragu soal deposit. Gue yakinkan lagi pakai iming-iming pencairan instan 10 menit.",
        },
      };
    }
    if (normalized.includes("tipu") || normalized.includes("ojk") || normalized.includes("lapor") || normalized.includes("polisi")) {
      const resp = pickFresh([
        "Kakak jangan sok tahu ya! Banyak yang sudah sukses cair ratusan juta di grup kami. Kalau nggak mau cuan, nggak usah fitnah perusahaan kami!",
        "Perusahaan kami PT Talent BUMN berizin resmi kak, kalau kakak ragu silakan keluar dari grup daripada memprovokasi member lain!",
      ]);
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -45,
        scammerResponse: resp,
        nextTelemetry: {
          activeTactic: "Ego Defence & Gaslighting",
          scammerMood: "DEFLECTING",
          internalThought: "Target menyebut OJK/Penipuan. Gue bentak biar dia merasa bersalah dan terisolasi.",
        },
      };
    }
    if (normalized.includes("transfer") || normalized.includes("siap") || normalized.includes("oke") || normalized.includes("kirim")) {
      return {
        text: userText,
        type: "VULNERABLE",
        vulnerabilityDelta: 40,
        scammerResponse: "Mantap kak! Silakan transfer sekarang ke rekening bendahara kami dan kirimkan bukti transfernya ya.",
        nextTelemetry: {
          activeTactic: "Penyedotan Dana Bertingkat",
          scammerMood: "CONFIDENT",
          internalThought: "Masuk perangkap! Uang deposit awal masuk, tinggal minta deposit kedua yang lebih besar.",
        },
      };
    }
  }

  // 4. Scenario: phishing-pajak (DJP Palsu)
  if (scenarioId === "phishing-pajak") {
    if (normalized.includes("link") || normalized.includes("portal") || normalized.includes("situs") || normalized.includes("url")) {
      const resp = pickFresh([
        "Link portal tersebut adalah server terenkripsi khusus verifikasi wajib pajak progresif yang terhubung langsung dengan sistem Coretax DJP.",
        "Demi keamanan data, wajib pajak diarahkan ke portal gateway resmi pembayaran sanksi sebelum berkas dilimpahkan ke juru sita.",
      ]);
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -30,
        scammerResponse: resp,
        nextTelemetry: {
          activeTactic: "Fabricated Security Protocol",
          scammerMood: "DEFLECTING",
          internalThought: "Target meneliti link domain! Gue samarkan pake istilah sistem Coretax pusat.",
        },
      };
    }
    if (normalized.includes("lapor") || normalized.includes("polisi") || normalized.includes("palsu") || normalized.includes("djp")) {
      const resp = pickFresh([
        "Anda menentang petugas resmi DJP! Rekening bank Anda sekarang resmi kami ajukan blokir permanen melalui sistem pusat!",
        "Silakan periksa NIK Anda besok di kantor pajak, status Anda akan masuk daftar hitam wajib pajak tidak patuh jika menolak verifikasi!",
      ]);
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -45,
        scammerResponse: resp,
        nextTelemetry: {
          activeTactic: "Ancaman Otoritas Puncak",
          scammerMood: "PANICKED",
          internalThought: "Mampus, dia curiga ini DJP tiruan! Gue serang pake ancaman blokir NIK.",
        },
      };
    }
  }

  // 5. Scenario: undangan-nikah
  if (scenarioId === "undangan-nikah") {
    if (normalized.includes("apk") || normalized.includes("format") || normalized.includes("link") || normalized.includes("web")) {
      const resp = pickFresh([
        "Format .APK itu undangan digital interaktif ada video animasi dan denah lokasi GPS langsung kak, makanya dibuat dalam format aplikasi Android resmi.",
        "Kalau link website sering error kalau server down kak, makanya panitia buat file dokumen aplikasi biar langsung tersimpan di HP kakak.",
      ]);
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -10,
        scammerResponse: resp,
        nextTelemetry: {
          activeTactic: "Dalih Undangan Interaktif",
          scammerMood: "DEFLECTING",
          internalThought: "Dia nanya soal ekstensi APK! Gue alibi fitur peta dan video interaktif.",
        },
      };
    }
  }

  // 6. Scenario: tilang-etle
  if (scenarioId === "tilang-etle") {
    if (normalized.includes("pos") || normalized.includes("etle") || normalized.includes("resmi") || normalized.includes("polisi")) {
      const resp = pickFresh([
        "Ini sistem ETLE Digital Presisi Korlantas Polri 2026 kak! Sekarang semua notifikasi dikirim kilat via WhatsApp untuk memangkas waktu kirim pos.",
        "Data pelanggaran resmi tercatat di server Korlantas kak. Segera buka berkas bukti fotonya dalam 24 jam sebelum STNK masuk daftar blokir blokir Samsat.",
      ]);
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -10,
        scammerResponse: resp,
        nextTelemetry: {
          activeTactic: "Ancaman Pemblokiran STNK Samsat",
          scammerMood: "DEFLECTING",
          internalThought: "Korban paham soal surat fisik pos. Gue bantah pake alibi sistem digital presisi Polri.",
        },
      };
    }
  }

  // 7. Scenario: quishing-qris
  if (scenarioId === "quishing-qris") {
    if (normalized.includes("otp") || normalized.includes("sms") || normalized.includes("kode") || normalized.includes("bajak")) {
      const resp = pickFresh([
        "Kak tolong kak, itu kode voucher belanja kasir Indomaret bukan akun m-Banking! Kalau gak dibacakan saya kena potong gaji bulan ini.",
        "Demi Allah kak saya cuma kasir biasa yang salah ketik satu angka nomor handphone. Tolong bantu sebutkan 6 angkanya kak.",
      ]);
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -10,
        scammerResponse: resp,
        nextTelemetry: {
          activeTactic: "Eksploitasi Belas Kasihan & Sumpah Palsu",
          scammerMood: "PANICKED",
          internalThought: "Dia sadar itu kode OTP verifikasi! Gue sumpah palsu dan mohon-mohon biar dia luluh.",
        },
      };
    }
  }

  // 8. Scenario: deepfake-bos
  if (scenarioId === "deepfake-bos") {
    if (normalized.includes("sop") || normalized.includes("finance") || normalized.includes("telepon") || normalized.includes("kantor")) {
      const resp = pickFresh([
        "Kamu ini gak loyal ya sama atasan! Saya lagi meeting sama menteri dan komisaris, kamu malah debat soal SOP! Transfer sekarang atau besok kamu saya mutasi!",
        "Saya pimpinan kamu Dimas! Memo direksi sudah saya lampirkan, dana ini buat talangan vendor strategis, nanti malam saya ganti tunai!",
      ]);
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -10,
        scammerResponse: resp,
        nextTelemetry: {
          activeTactic: "Penyalahgunaan Otoritas & Gertak Mutasi",
          scammerMood: "PUSHING",
          internalThought: "Dia bawa-bawa SOP finance kantor! Gue tekan pakai ancaman mutasi kerjaan biar nyalinya ciut.",
        },
      };
    }
  }
  // 5. Default General Response
  const defaultResp = pickFresh([
    "Tolong segera diproses ya kak, kami hanya memberikan batas waktu sampai jam kerja selesai hari ini.",
    "Jangan ditunda lagi kak, demi keamanan data dan kelancaran transaksi kakak sendiri.",
  ]);
  return {
    text: userText,
    type: "NEUTRAL",
    vulnerabilityDelta: -10,
    scammerResponse: defaultResp,
    nextTelemetry: {
      activeTactic: "Manipulasi Taktis Siber",
      scammerMood: "DEFLECTING",
      internalThought: "Target merespons secara netral. Gue arahkan kembali ke instruksi utama.",
    },
  };
}
