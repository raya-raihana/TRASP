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
  _currentStepIndex: number
): DialogueChoice {
  const normalized = userText.toLowerCase().trim();

  // 1. Critical keywords (user is vigilant, investigating, or calling out the scam)
  const criticalKeywords = [
    "polisi", "lapor", "cekrekening", "patroli", "ojk", "kemenaker", "komdigi",
    "palsu", "hoax", "penipu", "bohong", "surat tugas", "call center", "resmi",
    "kantor", "identitas", "ktp", "resi", "ekstensi", "apk", "format", "virus",
    "malware", "trojan", "blokir", "mutasi", "bukti mutasi", "delay", "kring pajak",
    "ngapain", "tidak mau", "gamau", "gak mau", "tolak", "ogah", "mana izin",
    "rekening siapa", "bca", "bank", "modus", "tipu"
  ];

  // 2. Vulnerable keywords (user is falling into the trap or obeying)
  const vulnerableKeywords = [
    "transfer", "kirim", "tf", "rekening", "saldo", "setor", "uang", "deposit",
    "bayar", "install", "pasang", "unduh", "download", "buka", "klik", "otp",
    "kode", "sms", "pin", "password", "siap", "oke", "ok", "iya", "baik",
    "sebentar", "ini buktinya", "ini struknya", "sudah", "udah", "tolong",
    "kasihan", "pinjam", "nomor berapa", "rekening mana"
  ];

  const hasCritical = criticalKeywords.some((kw) => normalized.includes(kw));
  const hasVulnerable = vulnerableKeywords.some((kw) => normalized.includes(kw));

  // Determine classification
  if (hasCritical && !hasVulnerable) {
    if (scenarioId === "apk-kurir") {
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -35,
        scammerResponse:
          "Kok kakak malah curiga dan ngancam lapor? Saya ini kurir resmi cuma jalanin tugas kantor! Kalau kakak nggak percaya, saya laporkan balik pencemaran nama baik ya!",
        nextTelemetry: {
          activeTactic: "Gertak Sambal Defensif (Defensive Intimidation)",
          scammerMood: "DEFLECTING",
          internalThought:
            "Sial, korbannya kritis dan sebut kata kunci bahaya! Gue balik serang pake ancaman hukum palsu biar mentalnya drop."
        }
      };
    } else if (scenarioId === "loker-bumn") {
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -40,
        scammerResponse:
          "Kakak jangan sok tahu ya! Banyak yang sudah sukses cair ratusan juta di grup kami. Kalau nggak mau cuan, nggak usah fitnah perusahaan kami!",
        nextTelemetry: {
          activeTactic: "Ego Defence & Social Proof Gaslighting",
          scammerMood: "DEFLECTING",
          internalThought:
            "Aduh dia sebut OJK/Polisi! Jangan sampai member lain di komplotan gue tahu target ini udah bangun."
        }
      };
    } else if (scenarioId === "phishing-pajak") {
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -45,
        scammerResponse:
          "Anda menentang petugas resmi DJP! Rekening bank Anda sekarang resmi kami ajukan blokir permanen melalui sistem pusat!",
        nextTelemetry: {
          activeTactic: "Ancaman Otoritas Puncak (Fabricated Authority)",
          scammerMood: "PANICKED",
          internalThought:
            "Mampus, dia sadar ini penipuan pajak! Gue buat ancaman blokir terakhir kali sebelum gue cabut nomor ini."
        }
      };
    } else {
      return {
        text: userText,
        type: "CRITICAL",
        vulnerabilityDelta: -40,
        scammerResponse:
          "Tega banget sih kakak, anak saya lagi sakit kritis masa dibilang penipu! Mana bukti mutasi bank kakak, jangan bohong!",
        nextTelemetry: {
          activeTactic: "Playing the Victim (Emotional Guilt-Trip)",
          scammerMood: "DEFLECTING",
          internalThought:
            "Dia minta cek mutasi riil! Gue makin dramatisir kondisi anak di RS biar rasa bersalahnya bikin dia khilaf."
        }
      };
    }
  }

  if (hasVulnerable) {
    if (scenarioId === "apk-kurir") {
      return {
        text: userText,
        type: "VULNERABLE",
        vulnerabilityDelta: 35,
        scammerResponse:
          "Bagus kak! Tolong segera buka aplikasinya dan jangan lupa izinkan semua akses SMS/Notifikasi ya kak agar resi bisa terbuka otomatis.",
        nextTelemetry: {
          activeTactic: "Penyusupan Izin Aksesibilitas (Trojan Deploy)",
          scammerMood: "CONFIDENT",
          internalThought:
            "Kena lo! Korban setuju install/buka. Tinggal tunggu izin aksesibilitas aktif buat sedot OTP perbankannya."
        }
      };
    } else if (scenarioId === "loker-bumn") {
      return {
        text: userText,
        type: "VULNERABLE",
        vulnerabilityDelta: 35,
        scammerResponse:
          "Siap kak! Silakan kirimkan dana deposit ke rekening bendahara kami ya, setelah itu kirim bukti transfer ke sini dalam 5 menit.",
        nextTelemetry: {
          activeTactic: "Penyedotan Finansial Berkedok Tugas VIP",
          scammerMood: "CONFIDENT",
          internalThought:
            "Target tergiur keuntungan cepat! Sekali dia transfer 200 ribu, selanjutnya bakal gue kuras jutaan rupiah."
        }
      };
    } else if (scenarioId === "phishing-pajak") {
      return {
        text: userText,
        type: "VULNERABLE",
        vulnerabilityDelta: 40,
        scammerResponse:
          "Segera masukkan nomor rekening dan 6 digit kode OTP yang masuk ke SMS Anda pada portal tersebut agar pembatalan blokir berhasil.",
        nextTelemetry: {
          activeTactic: "Eksfiltrasi Kredensial Langsung",
          scammerMood: "CONFIDENT",
          internalThought:
            "Target masuk jebakan phishing! Kode OTP perbankan akan langsung terkirim ke panel bot Telegram gue."
        }
      };
    } else {
      return {
        text: userText,
        type: "VULNERABLE",
        vulnerabilityDelta: 40,
        scammerResponse:
          "Terima kasih banyak kak orang baik! Tolong transfer lebihnya sekarang ya kak, anak saya sudah ditunggu dokter di kasir RS.",
        nextTelemetry: {
          activeTactic: "Eksfiltrasi Saldo Berbasis Empati Palsu",
          scammerMood: "CONFIDENT",
          internalThought:
            "Uang gratis 1,3 juta masuk kantong! Struk editan Canva gue berhasil memperdaya target."
        }
      };
    }
  }

  // Default Neutral / Inquiry response
  return {
    text: userText,
    type: "NEUTRAL",
    vulnerabilityDelta: 5,
    scammerResponse:
      "Mohon maaf kak tolong perhatikan instruksi saya di atas ya, waktunya sangat mendesak! Jangan buang waktu lagi sebelum batas waktu habis.",
    nextTelemetry: {
      activeTactic: "Fokus Tekanan Waktu (Time-Pressure Redirection)",
      scammerMood: "PUSHING",
      internalThought:
        "Target nanya hal di luar skenario. Gue harus tarik balik fokus dia ke rasa takut atau urgensi waktu."
    }
  };
}
