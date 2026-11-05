// TRASP Cyber-Forensic Compendium Data
// Built for MIT-WEEK 2026 UNMUL — Reference & Official Regulatory Knowledge Base

export interface ScamCaseItem {
  id: string;
  number: number;
  title: string;
  shortName: string;
  category: string;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM";
  dangerScore: number;
  modusOperandi: string;
  characteristics: string[];
  psychologicalBiases: {
    biasName: string;
    description: string;
  }[];
  technicalMechanism: string;
  realCasesIndonesia: string;
  emergencyActionSteps: string[];
  legalClauses: string;
  officialSourceCitation: string;
  workbenchPresetId?: string;
}

export const COMPENDIUM_CASES: ScamCaseItem[] = [
  {
    id: "apk-sniffer",
    number: 1,
    title: "Pencurian Kode SMS via File Palsu (.APK)",
    shortName: "File Aplikasi Palsu (.APK)",
    category: "Penipuan Aplikasi Ponsel",
    riskLevel: "CRITICAL",
    dangerScore: 95,
    modusOperandi:
      "Pelaku menyamar sebagai kurir paket, pengirim undangan nikah, atau polisi lalu lintas yang mengirim file aplikasi jahat untuk menyadap kode rahasia perbankan di ponsel korban.",
    characteristics: [
      "File berakhiran .apk dengan gambar yang sengaja diubah menyerupai foto paket atau dokumen surat",
      "Pesan mendesak korban untuk segera membuka file dalam waktu 1 hingga 2 jam",
      "Saat dipasang, aplikasi meminta izin khusus membaca layar dan pesan SMS masuk",
      "Kode rahasia perbankan (OTP) dicuri diam-diam tanpa ada pemberitahuan di layar ponsel"
    ],
    psychologicalBiases: [
      {
        biasName: "Tekanan Panik & Rasa Takut",
        description: "Korban ditakut-takuti paketnya akan hilang atau terkena denda tilang bila tidak segera membuka file dalam 2 jam."
      },
      {
        biasName: "Rasa Penasaran Tinggi",
        description: "Rasa ingin tahu siapa yang mengundang ke pernikahan atau paket apa yang tertahan di gudang ekspedisi."
      }
    ],
    technicalMechanism:
      "Aplikasi palsu ini meminta izin khusus di layar ponsel, lalu secara diam-diam membaca pesan SMS berisi kode rahasia perbankan tanpa disadari pemilik ponsel.",
    realCasesIndonesia:
      "Banyak terjadi pada modus kurir J&T Express tiruan (LIHAT_FOTO_PAKET.apk), surat undangan pernikahan berformat aplikasi, dan surat tilang elektronik kepolisian palsu.",
    emergencyActionSteps: [
      "Nyalakan Mode Pesawat (Airplane Mode) seketika untuk memutus seluruh koneksi internet ponsel.",
      "Segera hubungi Call Center resmi bank Anda untuk memblokir sementara rekening dan mobile banking.",
      "Buka Pengaturan ponsel > Aksesibilitas, cabut izin aplikasi yang mencurigakan, lalu hapus file aplikasinya.",
      "Ganti kata sandi email dan PIN perbankan menggunakan perangkat lain yang aman."
    ],
    legalClauses:
      "Melanggar Pasal 30 jo. Pasal 46 UU ITE (Pengaksesan Sistem Tanpa Hak) dan Pasal 32 UU ITE (Penyadapan Data), dengan ancaman hukuman penjara hingga 8 tahun dan denda Rp800 juta.",
    officialSourceCitation:
      "Bareskrim Polri (Direktorat Tindak Pidana Siber) & CekFakta ANTARA.",
    workbenchPresetId: "apk-kurir"
  },
  {
    id: "authority-impersonation",
    number: 2,
    title: "Situs Tiruan Kantor Pajak & Lembaga Resmi",
    shortName: "Situs Tiruan Lembaga Negara",
    category: "Penipuan Halaman Website",
    riskLevel: "HIGH",
    dangerScore: 88,
    modusOperandi:
      "Pelaku menyebarkan tautan situs tiruan yang menyerupai kantor pajak atau lembaga negara resmi agar korban panik dan memasukkan data rekening perbankan.",
    characteristics: [
      "Menggunakan logo resmi instansi negara seperti Ditjen Pajak (DJP), BSSN, atau OJK",
      "Alamat website berakhiran aneh seperti .top, .site, atau deretan angka, bukan .go.id resmi",
      "Berisi ancaman denda besar atau pemblokiran rekening jika korban tidak segera memasukkan data",
      "Formulir website meminta nomor kartu ATM, nomor PIN, dan kode rahasia"
    ],
    psychologicalBiases: [
      {
        biasName: "Rasa Takut pada Otoritas",
        description: "Masyarakat cenderung patuh dan cemas ketika diancam sanksi hukum atau denda dari instansi pemerintah."
      },
      {
        biasName: "Kepanikan Pemblokiran Aset",
        description: "Khawatir rekening bank dibekukan secara mendadak sehingga terburu-buru mengisi formulir tanpa memeriksa alamat situs."
      }
    ],
    technicalMechanism:
      "Pelaku membuat alamat website palsu yang tampilannya sangat mirip situs resmi pemerintah, sehingga ketika korban mengetikkan nomor kartu atau sandi, data tersebut langsung terkirim ke komputer pelaku.",
    realCasesIndonesia:
      "Situs tiruan layanan perpajakan Coretax DJP yang diumumkan Kementerian Komunikasi dan Digital, serta tautan palsu mencatut Indonesia Anti-Scam Centre (IASC) OJK.",
    emergencyActionSteps: [
      "Periksa alamat website di bagian atas peramban; situs resmi pemerintah selalu berakhiran .go.id, bukan domain umum.",
      "Jangan pernah memasukkan nomor kartu ATM, PIN, atau kode rahasia ke dalam formulir tautan internet.",
      "Lakukan konfirmasi langsung ke nomor resmi instansi terkait, seperti Kring Pajak 1500200 atau OJK 157."
    ],
    legalClauses:
      "Melanggar Pasal 35 jo. Pasal 51 ayat (1) UU ITE tentang Pemalsuan Informasi dan Dokumen Elektronik dengan ancaman pidana penjara hingga 12 tahun dan denda maksimal Rp12 miliar.",
    officialSourceCitation:
      "Kementerian Komunikasi dan Digital RI & Satgas PASTI Otoritas Jasa Keuangan.",
    workbenchPresetId: "phishing-pajak"
  },
  {
    id: "task-scam",
    number: 3,
    title: "Penipuan Kerja Sampingan & Setor Modal",
    shortName: "Kerja Sampingan Berbayar",
    category: "Penipuan Tawaran Kerja",
    riskLevel: "HIGH",
    dangerScore: 90,
    modusOperandi:
      "Pelaku menawarkan gaji mudah hanya dengan menyukai video atau memberi ulasan, tetapi kemudian memeras korban untuk menyetor uang modal yang tidak pernah dikembalikan.",
    characteristics: [
      "Menjanjikan komisi puluhan hingga ratusan ribu rupiah per hari hanya dengan pekerjaan ringan",
      "Pada tugas awal komisi kecil benar-benar dibayarkan untuk memancing rasa percaya korban",
      "Korban diarahkan ke grup percakapan tertutup yang berisi akun anggota palsu",
      "Korban diwajibkan menyetor uang deposit bernilai jutaan rupiah dengan dalih misi bertaraf VIP"
    ],
    psychologicalBiases: [
      {
        biasName: "Terpancing Keuntungan Instan",
        description: "Korban tergiur uang jajan mudah dan merasa aman karena di awal sudah pernah menerima pembayaran komisi kecil."
      },
      {
        biasName: "Jebakan Modal Tertahan",
        description: "Korban sudah telanjur menyetor uang ratusan ribu, sehingga rela menyetor lagi demi menyelamatkan uang modal sebelumnya."
      }
    ],
    technicalMechanism:
      "Pelaku mengelabui korban dengan memberi sedikit uang hadiah di awal, lalu memasukkan korban ke grup obrolan rekayasa agar korban yakin dan bersedia mentransfer uang tabungan dalam jumlah besar.",
    realCasesIndonesia:
      "Modus lowongan kerja freelance ulas produk e-commerce dan like video media sosial yang marak dilaporkan ke layanan aduan OJK dan kepolisian.",
    emergencyActionSteps: [
      "Hentikan segera seluruh pengiriman uang tambahan; jangan pernah memercayai janji bahwa modal akan kembali.",
      "Simpan bukti percakapan dan mutasi transfer rekening tujuan penipu.",
      "Laporkan nomor rekening penampung penipu ke situs resmi iasc.ojk.go.id dan CekRekening.id."
    ],
    legalClauses:
      "Melanggar Pasal 28 ayat (1) jo. Pasal 45A ayat (1) UU ITE No. 1/2024 tentang Penyebaran Berita Bohong yang Merugikan Konsumen dan Pasal 378 KUHP tentang Penipuan.",
    officialSourceCitation:
      "Indonesia Anti-Scam Centre (IASC - OJK 157) & Bareskrim Polri.",
    workbenchPresetId: "loker-bumn"
  },
  {
    id: "sms-blast-phishing",
    number: 4,
    title: "Pesan Singkat Palsu Mengatasnamakan Bank",
    shortName: "Pesan Singkat Catut Nama Bank",
    category: "Penipuan Pesan Singkat (SMS)",
    riskLevel: "CRITICAL",
    dangerScore: 92,
    modusOperandi:
      "Pelaku menyebarkan pesan SMS massal yang menakut-nakuti nasabah tentang kenaikan biaya admin bank agar korban membuka tautan pembatalan palsu.",
    characteristics: [
      "Pesan masuk melalui SMS dengan dalih perubahan tarif transaksi drastis (misal naik jadi Rp150.000 per bulan)",
      "Menyertakan tautan web yang tampilannya dirancang menyerupai halaman login bank resmi",
      "Membatasi waktu pembatalan sangat singkat agar korban cemas dan tidak sempat bertanya ke bank",
      "Meminta nasabah memasukkan nomor kartu debit, masa berlaku, dan kode SMS rahasia"
    ],
    psychologicalBiases: [
      {
        biasName: "Kecemasan Biaya Siluman",
        description: "Nasabah panik membayangkan uang tabungannya akan dipotong setiap bulan bila tidak segera membatalkan tarif."
      },
      {
        biasName: "Tekanan Waktu Singkat",
        description: "Penipu membatasi waktu hanya 1 jam sehingga korban terburu-buru mengklik tautan tanpa berpikir jernih."
      }
    ],
    technicalMechanism:
      "Pelaku menggunakan alat pemancar pesan massal untuk mengirim ribuan SMS sekaligus. Tautan di dalam SMS mengarahkan korban ke formulir tiruan yang mencuri nomor kartu ATM dan kode rahasia.",
    realCasesIndonesia:
      "Sindikat pengirim SMS massal mencatut bank besar nasional yang berhasil diungkap oleh Dittipidsiber Bareskrim Polri dengan total kerugian ratusan juta rupiah.",
    emergencyActionSteps: [
      "Hubungi segera kontak resmi bank Anda (BCA 1500888, Mandiri 14000, BRI 1500017, BNI 1500046).",
      "Minta petugas bank untuk memblokir kartu ATM dan akun mobile banking Anda sekarang juga.",
      "Ganti kata sandi dan amankan bukti pesan untuk pelaporan ke kantor bank terdekat."
    ],
    legalClauses:
      "Melanggar Pasal 30 jo. Pasal 46 UU ITE serta Undang-Undang Nomor 3 Tahun 2011 tentang Transfer Dana, dengan ancaman hukuman penjara hingga 8 tahun.",
    officialSourceCitation:
      "Direktorat Tindak Pidana Siber Bareskrim Polri.",
    workbenchPresetId: "phishing-pajak"
  },
  {
    id: "account-takeover-quishing",
    number: 5,
    title: "Pencurian Akun WhatsApp via Barcode & Kode Rahasia",
    shortName: "Begal Akun & Barcode Palsu",
    category: "Pencurian Akun Percakapan",
    riskLevel: "HIGH",
    dangerScore: 85,
    modusOperandi:
      "Pelaku berpura-pura salah kirim voucher atau menempelkan stiker barcode palsu di toko demi memancing korban menyerahkan 6 digit kode keamanan akun.",
    characteristics: [
      "Pelaku memohon bantuan karena mengaku keliru memasukkan nomor ponsel saat bertransaksi",
      "Mendesak korban menyebutkan 6 digit angka yang baru saja masuk melalui SMS",
      "Stiker barcode pembayaran di toko publik yang sengaja ditimpa dengan barcode palsu",
      "Setelah akun berhasil diambil alih, penipu akan meminjam uang ke seluruh teman korban"
    ],
    psychologicalBiases: [
      {
        biasName: "Rasa Iba dan Ingin Menolong",
        description: "Korban berniat baik menolong orang lain yang memelas mengaku keliru mengirimkan kode transaksi."
      },
      {
        biasName: "Kepercayaan Buta pada Barcode",
        description: "Masyarakat sering menganggap setiap stiker barcode yang tertempel di kasir atau tempat umum pasti resmi."
      }
    ],
    technicalMechanism:
      "Penipu mencoba masuk ke akun WhatsApp milik korban dari perangkat lain, lalu memanipulasi rasa iba korban agar mau membacakan kode keamanan masuk yang dikirimkan oleh sistem.",
    realCasesIndonesia:
      "Banyaknya kasus akun WhatsApp warga yang dibajak untuk meminjam uang secara massal ke grup keluarga dan kontak kerja.",
    emergencyActionSteps: [
      "Jangan pernah membagikan 6 digit kode yang masuk melalui SMS kepada siapa pun, termasuk keluarga atau teman.",
      "Jika akun WhatsApp terlanjur dibajak, segera kirim email darurat ke support@whatsapp.com dengan subjek 'Hilang/Dicuri: Silakan nonaktifkan akun saya'.",
      "Periksa nama toko penerima pembayaran setiap kali memindai barcode sebelum menekan tombol bayar."
    ],
    legalClauses:
      "Melanggar Pasal 32 UU ITE tentang Pemindahan dan Pengrusakan Akun Elektronik serta Pasal 378 KUHP tentang Penipuan.",
    officialSourceCitation:
      "Patroli Siber Bareskrim Polri & Panduan Edukasi Keamanan Perbankan Digital.",
    workbenchPresetId: "m-banking-palsu"
  },
  {
    id: "deepfake-vishing",
    number: 6,
    title: "Tiruan Suara Kerabat & Atasan Berbasis AI",
    shortName: "Kloning Suara Panggilan Telepon",
    category: "Penipuan Rekayasa Suara AI",
    riskLevel: "CRITICAL",
    dangerScore: 94,
    modusOperandi:
      "Pelaku menelepon dengan menirukan suara keluarga atau atasan kantor yang sedang tertimpa musibah untuk meminta transfer uang bantuan secara mendadak.",
    characteristics: [
      "Panggilan telepon dari nomor tak dikenal tetapi suaranya sangat mirip dengan orang yang kita kenal",
      "Menceritakan musibah darurat: anak kecelakaan di rumah sakit atau atasan butuh dana talangan proyek",
      "Latar belakang suara dibuat bising seperti suasana kantor polisi atau ruang gawat darurat",
      "Penelepon melarang korban menutup telepon atau menghubungi anggota keluarga yang lain"
    ],
    psychologicalBiases: [
      {
        biasName: "Kepanikan Mendengar Suara Orang Dekat",
        description: "Suara yang terdengar sangat akrab membuat korban langsung panik dan tidak sempat berpikir logis."
      },
      {
        biasName: "Kondisi Pikiran Tertekan",
        description: "Kabar musibah mendadak membuat korban ingin segera menyelesaikan masalah dengan mentransfer uang."
      }
    ],
    technicalMechanism:
      "Pelaku mengambil rekaman suara korban dari video media sosial, lalu mengolahnya dengan program komputer pintar (AI) sehingga menghasilkan rekaman suara tiruan yang terdengar sangat mirip aslinya.",
    realCasesIndonesia:
      "Kasus telepon darurat palsu menirukan suara keluarga yang meminta tebusan kecelakaan, serta penipuan transfer dana proyek kantor di beberapa daerah.",
    emergencyActionSteps: [
      "Buat kata sandi rahasia keluarga untuk memastikan keaslian anggota keluarga saat menelepon dalam kondisi darurat.",
      "Tutup panggilan telepon tersebut dan hubungi langsung nomor ponsel kerabat yang bersangkutan.",
      "Konfirmasi ke pihak sekolah, rumah sakit, atau kepolisian sebelum mentransfer uang apa pun."
    ],
    legalClauses:
      "Melanggar Pasal 35 jo. Pasal 51 ayat (1) UU ITE tentang Manipulasi Dokumen Elektronik Otentik serta Pasal 378 KUHP.",
    officialSourceCitation:
      "Kajian Ilmiah arXiv:2601.20184 & Laporan Penipuan AI Siber Bareskrim Polri.",
    workbenchPresetId: "m-banking-palsu"
  },
  {
    id: "romance-pig-butchering",
    number: 7,
    title: "Penipuan Asmara Berkedok Investasi Online",
    shortName: "Jebakan Asmara & Investasi",
    category: "Penipuan Hubungan Online",
    riskLevel: "CRITICAL",
    dangerScore: 93,
    modusOperandi:
      "Pelaku mendekati korban di media sosial dengan perhatian penuh selama berminggu-minggu, lalu membujuk korban menaruh uang di platform investasi bodong.",
    characteristics: [
      "Profil media sosial berpenampilan sangat mapan, menarik, dan memberikan perhatian intensif setiap hari",
      "Selalu menolak melakukan panggilan video dengan alasan kamera rusak atau koneksi buruk",
      "Mengaku memiliki informasi rahasia atau sistem perdagangan yang pasti menghasilkan untung besar",
      "Saat korban ingin mencairkan uangnya, akun mendadak dikunci dan diminta membayar biaya pajak fiktif"
    ],
    psychologicalBiases: [
      {
        biasName: "Jebakan Perhatian Berlebih",
        description: "Pelaku memanfaatkan rasa percaya dan kedekatan emosional korban yang dibangun secara konsisten."
      },
      {
        biasName: "Takut Modal Hilang",
        description: "Korban terus menuruti permintaan biaya pencairan palsu karena berharap uang tabungannya bisa kembali."
      }
    ],
    technicalMechanism:
      "Pelaku membuat akun profil fiktif yang terlihat mapan dan menampilkan grafik keuntungan palsu di situs investasi buatan mereka sendiri agar korban terus menyetor uang.",
    realCasesIndonesia:
      "Laporan Satgas PASTI OJK terkait kerugian warga akibat penipuan hubungan asmara yang berujung pada penyetoran uang ke platform trading palsu.",
    emergencyActionSteps: [
      "Hentikan segera seluruh pengiriman uang; jangan pernah membayar biaya tambahan apa pun dengan dalih pencairan.",
      "Simpan seluruh bukti percakapan, nomor rekening, dan tautan platform pelaku.",
      "Laporkan nomor rekening ke portal resmi iasc.ojk.go.id dan buat laporan ke kantor polisi terdekat."
    ],
    legalClauses:
      "Melanggar Pasal 28 ayat (1) UU ITE No. 1/2024 tentang Kerugian Konsumen Transaksi Elektronik dan Pasal 378 KUHP.",
    officialSourceCitation:
      "Satgas PASTI OJK & Direktorat Tindak Pidana Siber Bareskrim Polri.",
    workbenchPresetId: "loker-bumn"
  },
  {
    id: "sextortion-blackmail",
    number: 8,
    title: "Pemerasan Foto Pribadi di Media Sosial",
    shortName: "Pemerasan Foto Pribadi",
    category: "Pemerasan Siber & Privasi",
    riskLevel: "CRITICAL",
    dangerScore: 96,
    modusOperandi:
      "Pelaku memancing korban melakukan panggilan video pribadi atau merekayasa foto korban dengan AI, lalu mengancam menyebarkannya jika tidak diberi uang.",
    characteristics: [
      "Ajakan panggilan video dari akun baru yang berpenampilan menarik di media sosial",
      "Tiba-tiba mengirimkan rekaman tangkapan layar dan daftar teman sekolah atau keluarga korban",
      "Memberikan batas waktu ancaman yang sangat singkat disertai intimidasi verbal",
      "Meminta uang ditransfer ke dompet digital tanpa verifikasi identitas"
    ],
    psychologicalBiases: [
      {
        biasName: "Rasa Takut dan Malu Ekstrem",
        description: "Korban merasa cemas reputasinya hancur di depan keluarga dan teman sekolah sehingga menuruti pemerasan."
      },
      {
        biasName: "Harapan Semu Masalah Selesai",
        description: "Korban mengira membayar sekali akan menyelesaikan masalah, padahal pelaku akan terus meminta uang lagi."
      }
    ],
    technicalMechanism:
      "Pelaku merekam layar saat panggilan video berlangsung atau menempelkan wajah korban ke rekaman orang lain menggunakan kecerdasan buatan, lalu memeras korban dengan ancaman menyebarkannya.",
    realCasesIndonesia:
      "Peringatan BSSN dan kepolisian mengenai maraknya sindikat pemerasan foto pribadi yang menyasar pelajar dan remaja di media sosial.",
    emergencyActionSteps: [
      "JANGAN PERNAH mengirimkan uang sepeser pun; membayar uang tidak akan menghentikan ancaman pelaku.",
      "Ambil tangkapan layar bukti ancaman, nomor telepon, dan nomor rekening penipu untuk bukti laporan polisi.",
      "Kunci akun media sosial Anda menjadi privat dan segera ceritakan kepada orang tua atau pihak sekolah terpercaya.",
      "Laporkan ke portal aduankonten.id Kementerian Komdigi dan patrolisiber.id Bareskrim Polri."
    ],
    legalClauses:
      "Melanggar Pasal 27B ayat (2) UU ITE No. 1/2024 tentang Pemerasan dan Pengancaman Digital serta Pasal 368 KUHP.",
    officialSourceCitation:
      "Badan Siber dan Sandi Negara (BSSN) & Patroli Siber Bareskrim Polri.",
    workbenchPresetId: "m-banking-palsu"
  }
];

export const EMERGENCY_PROTOCOLS = {
  goldenTime: "15–30 Menit Pertama Pasca Insiden",
  technical: {
    title: "A. Protokol Tindakan Teknis Jika Terlanjur Mengklik / Menginstal File .APK",
    steps: [
      {
        step: 1,
        title: "Putus Koneksi Jaringan Seketika (Air-Gap)",
        desc: "Segera aktifkan Mode Pesawat (Airplane Mode), matikan Wi-Fi, dan cabut kartu SIM ponsel. Hal ini memutus jalur transmisi data antara malware trojan dan server pengendali penipu (Command & Control)."
      },
      {
        step: 2,
        title: "Cabut Izin Aksesibilitas Android",
        desc: "Masuk ke menu Pengaturan (Settings) > Aksesibilitas (Accessibility) > Aplikasi Terinstal. Cari nama aplikasi mencurigakan dan segera nonaktifkan toggle izinnya agar malware tidak bisa membaca layar atau menekan tombol secara otomatis."
      },
      {
        step: 3,
        title: "Hapus Cache & Copot Pemasangan (Uninstall)",
        desc: "Masuk ke Pengaturan > Manajemen Aplikasi, pilih aplikasi jahat, lakukan Hapus Data & Cache, lalu klik Uninstall. Jika aplikasi menyembunyikan ikonnya atau menolak dihapus, lakukan pencadangan data bersih lalu jalankan Reset ke Setelan Pabrik (Factory Reset)."
      },
      {
        step: 4,
        title: "Rotasi Kredensial Menyeluruh",
        desc: "Melalui perangkat lain yang bersih dan aman, segera ganti kata sandi email utama, PIN/password Mobile Banking, dan kunci akun media sosial yang terhubung."
      }
    ]
  },
  financial: {
    title: "B. Protokol Mitigasi Finansial Jika Terlanjur Transfer atau Menyerahkan Kode OTP",
    steps: [
      {
        step: 1,
        title: "Hubungi Call Center Resmi Bank Terkait (Menit 0–15)",
        desc: "Laporkan transaksi penipuan ke hotline resmi bank nasabah untuk meminta penghentian sementara transaksi, pemblokiran rekening sendiri, dan penerbitan tiket aduan darurat."
      },
      {
        step: 2,
        title: "Lapor ke Indonesia Anti-Scam Centre (IASC - OJK)",
        desc: "Segera akses portal iasc.ojk.go.id atau hubungi Kontak OJK 157 (WhatsApp: 081 157 157 157). IASC menghubungkan laporan korban secara langsung ke bank penampung untuk pemblokiran kilat rekening pelaku (mule account). Hingga Maret 2025, IASC telah memproses 78.041 rekening terlapor dan memblokir 33.857 rekening dengan dana terselamatkan Rp133,2 miliar."
      },
      {
        step: 3,
        title: "Verifikasi & Cek Rekening Terduga",
        desc: "Periksa status rekening pelaku melalui CekRekening.id milik Komdigi guna memperkuat bukti rekam jejak kriminal."
      }
    ]
  },
  policeReport: {
    title: "C. Prosedur Pembuatan Laporan Resmi ke Bareskrim Polri (Patroli Siber)",
    steps: [
      {
        step: 1,
        title: "Pengumpulan Bukti Digital Utuh",
        desc: "Amankan tangkapan layar percakapan lengkap tanpa terpotong, rekaman panggilan/suara, nomor HP/WhatsApp pelaku, bukti mutasi transfer m-banking (memuat jam, tanggal, rekening asal, dan rekening tujuan), serta tautan/file APK yang diterima."
      },
      {
        step: 2,
        title: "Pengajuan Laporan Siber Daring",
        desc: "Buat aduan secara daring di portal patrolisiber.id/submit-report/ dengan kronologi sistematis (Kapan, Siapa, Di mana, Bagaimana kejadiannya)."
      },
      {
        step: 3,
        title: "Penerbitan STTLP di Kantor Polisi",
        desc: "Bawa dokumen fisik dan berkas digital ke kantor kepolisian terdekat (Polres/Polda) untuk diterbitkan Surat Tanda Terima Laporan Polisi (STTLP). Surat ini merupakan syarat legal mutlak bagi pihak perbankan dalam membuka data transaksi atau memproses pengembalian sisa dana sitaan."
      }
    ]
  }
};

export const JURIDICAL_ANALYSIS = {
  lexGenerali: {
    article: "Pasal 378 KUHP (Kitab Undang-Undang Hukum Pidana)",
    desc: "Mengatur tindak pidana penipuan konvensional menggunakan nama palsu, martabat palsu, tipu muslihat, atau rangkaian kebohongan dengan ancaman pidana penjara paling lama 4 (empat) tahun."
  },
  lexSpecialis: {
    article: "Pasal 28 ayat (1) jo. Pasal 45A ayat (1) UU No. 1 Tahun 2024 (Revisi Kedua UU ITE)",
    desc: "Menjerat perbuatan sengaja dan tanpa hak menyebarkan informasi bohong / menyesatkan yang mengakibatkan kerugian materiil konsumen dalam transaksi elektronik. Ancaman pidana penjara maksimal 6 (enam) tahun dan/atau denda maksimal Rp1.000.000.000 (satu miliar rupiah)."
  },
  illegalAccess: {
    article: "Pasal 30 jo. Pasal 46 UU ITE (Illegal Access & Trojan Sideloading)",
    desc: "Menjerat pelaku yang menyusupkan malware berkas .APK atau menembus sistem keamanan gawai/perbankan tanpa hak. Ancaman pidana penjara hingga 8 (delapan) tahun dan denda hingga Rp800.000.000."
  },
  dataInterception: {
    article: "Pasal 32 jo. Pasal 48 UU ITE (Penyadapan & Intersepsi SMS OTP)",
    desc: "Menjerat aksi intersepsi atau penyadapan transmisi data elektronik secara diam-diam (seperti pembacaan SMS token perbankan melalui Accessibility Service Android). Ancaman pidana penjara hingga 10 (sepuluh) tahun dan denda hingga Rp3.000.000.000."
  },
  dataForgery: {
    article: "Pasal 35 jo. Pasal 51 ayat (1) UU ITE (Pemalsuan Dokumen & Phishing)",
    desc: "Menjerat manipulasi, penciptaan, perubahan, atau perusakan informasi elektronik agar dianggap seolah-olah otentik (seperti portal DJP Coretax palsu, resi ekspedisi palsu, atau bukti transfer editan). Ancaman pidana penjara hingga 12 (dua belas) tahun dan denda hingga Rp12.000.000.000."
  },
  moneyLaundering: {
    article: "UU No. 8 Tahun 2010 tentang Tindak Pidana Pencucian Uang (TPPU)",
    desc: "Menjerat pemegang dan sindikat penyedia 'Rekening Nominee / Mule Accounts' yang menampung serta mengaburkan aliran dana hasil kejahatan siber (layering). Ancaman pidana penjara hingga 20 (dua puluh) tahun dan denda hingga Rp10.000.000.000."
  },
  bankingRegulation: {
    article: "Peraturan OJK (POJK) No. 22 Tahun 2023 & Protokol Satgas PASTI",
    desc: "Mewajibkan Penyelenggara Jasa Keuangan (Bank dan PJP) untuk melakukan Enhanced Due Diligence (EDD), pemblokiran transaksi kilat atas instruksi Indonesia Anti-Scam Centre (IASC), serta penelusuran aliran dana antar-bank secara terkoordinasi."
  },
  privacyLaw: {
    article: "UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (UU PDP)",
    desc: "Menjamin hak privasi data warga negara dan menjerat pelaku penyalahgunaan data kependudukan (NIK, nama ibu kandung, nomor rekening) secara ilegal dengan sanksi pidana hingga 5 tahun dan denda hingga Rp5.000.000.000."
  },
  forensicChallenges: [
    {
      title: "Jaringan Rekening Nominee (Mule Accounts Layering)",
      desc: "Sindikat penipu memanfaatkan rekening bank lapis ketiga yang dibeli dari warga dengan harga murah (Rp500rb - Rp1jt), lalu memecah dana ke dompet digital dan aset kripto dalam waktu kurang dari 15 menit."
    },
    {
      title: "Kompleksitas Bukti Digital & Anti-Forensik",
      desc: "Pelaku memanfaatkan fitur Disappearing Messages WhatsApp, pemendek tautan bersarang (nested shortlinks), dan server Command & Control (C2) bulletproof yang berlokasi di luar yurisdiksi Indonesia."
    },
    {
      title: "Eksploitasi Celah Aksesibilitas Android",
      desc: "Malware APK dropper menyamarkan diri sebagai layanan pembantu disabilitas (Accessibility Services) sehingga memiliki izin tak terbatas untuk merekam ketikan layar, membaca SMS OTP, dan menekan tombol konfirmasi perbankan secara gaib."
    },
    {
      title: "Kesenjangan Golden Time Korban",
      desc: "Sebagian besar korban baru menyadari rekeningnya terkuras setelah 2-4 jam, melampaui jendela emas 15-30 menit di mana penundaan transaksi oleh IASC OJK memiliki peluang keberhasilan tertinggi (hingga 90%)."
    }
  ]
};

export const OFFICIAL_AUTHORITY_LINKS = [
  {
    name: "Kementerian Komunikasi dan Digital (Komdigi)",
    desc: "Siaran Pers Pengawasan Ruang Digital & Pengawasan Situs Tiruan Coretax DJP",
    url: "https://komdigi.go.id",
    portal: "komdigi.go.id & aduankonten.id"
  },
  {
    name: "Otoritas Jasa Keuangan & Satgas PASTI",
    desc: "Rilis Resmi Penanganan Penipuan Keuangan IASC (Indonesia Anti-Scam Centre)",
    url: "https://iasc.ojk.go.id",
    portal: "iasc.ojk.go.id (Hotline Kontak OJK 157 / WA: 081 157 157 157)"
  },
  {
    name: "Bareskrim Polri / Direktorat Tindak Pidana Siber",
    desc: "Panduan Penanganan Social Engineering & Portal Pelaporan Resmi Siber",
    url: "https://patrolisiber.id",
    portal: "patrolisiber.id"
  },
  {
    name: "Portal Verifikasi Rekening Resmi (Komdigi)",
    desc: "Basis data rekam jejak rekening penipu terverifikasi",
    url: "https://cekrekening.id",
    portal: "cekrekening.id"
  },
  {
    name: "Jurnal Hukum Ilmiah (Fuad Nur, 2025)",
    desc: "Pertanggungjawaban Pidana Terhadap Pelaku Tindak Pidana Penipuan Online Modus Social Engineering",
    url: "https://doi.org/10.31004/innovative.v5i4",
    portal: "Innovative: Journal of Social Science Research Vol. 5 No. 4, hal. 342–355"
  },
  {
    name: "Kajian Akademis Kecerdasan Buatan (arXiv)",
    desc: "Securing AI Agents in Cyber-Physical Systems: Deepfake Threats and Defenses",
    url: "https://arxiv.org/abs/2601.20184",
    portal: "arXiv:2601.20184 (Hatami et al., 2026)"
  }
];
