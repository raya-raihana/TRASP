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
    title: "Malware APK Sniffer (Kurir Resi, Undangan Nikah, Tilang ETLE)",
    shortName: "Malware .APK Sniffer",
    category: "Android Malware / Banking Trojan",
    riskLevel: "CRITICAL",
    dangerScore: 95,
    modusOperandi:
      "Pengiriman file berekstensi ganda (.apk) berkedok foto/dokumen resmi, seperti LIHAT_FOTO_PAKET.apk, Surat_Undangan_Pernikahan.apk, atau Surat_Tilang_ETLE.apk melalui WhatsApp.",
    characteristics: [
      "Berkas berakhiran .apk dengan ikon menyerupai gambar dokumen atau logo ekspedisi",
      "Mendesak korban segera membuka file dalam tenggat waktu 1-2 jam",
      "Meminta izin Accessibility Services dan Read SMS saat dipasang di ponsel Android",
      "Menyadap notifikasi dan kode OTP perbankan tanpa memunculkan tanda di layar"
    ],
    psychologicalBiases: [
      {
        biasName: "Panic & Urgency Bias",
        description: "Diancam denda tilang hangus atau paket penting diretur dalam 2 jam agar korban panik dan buru-buru mengklik."
      },
      {
        biasName: "Curiosity Bias",
        description: "Rasa penasaran tinggi terhadap foto paket yang tertahan atau siapa pihak yang mengirim surat undangan nikah."
      }
    ],
    technicalMechanism:
      "Aplikasi Android liar (sideloaded APK) memanfaatkan Android Accessibility Services untuk membaca pohon aksesibilitas (AccessibilityNodeInfo), mencuri SMS masuk melalui BroadcastReceiver SMS_RECEIVED, dan mengirimkan token perbankan ke server Command & Control (C2) penipu secara terenkripsi.",
    realCasesIndonesia:
      "Kasus kurir J&T Express palsu (LIHAT_FOTO_PAKET.apk); Sindikat penipuan surat tilang elektronik ETLE palsu mencatut Korlantas Polri; Jurnal Innovative FH UHO (Fuad Nur, 2025).",
    emergencyActionSteps: [
      "Aktifkan Mode Pesawat (Airplane Mode) seketika & matikan Wi-Fi serta cabut kartu SIM.",
      "Buka Pengaturan Android > Aksesibilitas > Aplikasi Terinstal > Matikan toggle izin aplikasi mencurigakan.",
      "Hapus Data & Cache, lakukan Uninstal aplikasi, atau Factory Reset jika ikon aplikasi disembunyikan.",
      "Ganti kata sandi email dan PIN Mobile Banking melalui perangkat lain yang aman."
    ],
    legalClauses:
      "Pasal 30 jo. Pasal 46 UU ITE (Illegal Access), Pasal 32 UU ITE (Pencurian/Penyadapan Data), serta Pasal 378 KUHP (Penipuan Konvensional). Ancaman hukuman pidana hingga 8 tahun penjara dan denda Rp800 juta.",
    officialSourceCitation:
      "Bareskrim Polri (Direktorat Tindak Pidana Siber), CekFakta ANTARA, & Fuad Nur (2025) Innovative Journal.",
    workbenchPresetId: "apk-kurir"
  },
  {
    id: "authority-impersonation",
    number: 2,
    title: "Impersonasi Otoritas Resmi (Coretax DJP, BSSN, OJK/IASC)",
    shortName: "Impersonasi Otoritas & Coretax",
    category: "Phishing Kredensial & Social Engineering",
    riskLevel: "HIGH",
    dangerScore: 88,
    modusOperandi:
      "Membuat situs tiruan menggunakan alamat IP mentah (misal: 194.233.164.88) atau domain berbiaya murah (.xyz, .top) yang menyerupai portal pemerintah/bank. Penipu mengaku sebagai call center atau petugas verifikasi pajak.",
    characteristics: [
      "Mencatut nama instansi negara: Ditjen Pajak (DJP), BSSN, OJK, atau bank swasta/BUMN",
      "Menggunakan logo resmi dan kop surat berstempel digital palsu",
      "Ancaman pemblokiran rekening 1x24 jam atau denda progresif jika tidak melakukan verifikasi data",
      "Formulir login meminta nomor kartu debit, PIN ATM, atau kode OTP"
    ],
    psychologicalBiases: [
      {
        biasName: "Authority Bias",
        description: "Korban tunduk dan segan pada figur otoritas hukum/pajak negara karena takut disanksi denda atau pemblokiran rekening."
      },
      {
        biasName: "Fear of Sanction",
        description: "Ketakutan akan konsekuensi hukum atau pembekuan NPWP/aset finansial secara mendadak."
      }
    ],
    technicalMechanism:
      "Penipu menyusun domain phishing dengan teknik Subdomain Spoofing (contoh: djp-pajak.klikbca.pembayaran-denda.top) dan menampung input kredensial ke bot API Telegram tertutup secara real-time.",
    realCasesIndonesia:
      "Siaran Pers Kementerian Komunikasi dan Digital (19 November 2025) terkait situs tiruan layanan perpajakan Coretax DJP; Rilis Satgas PASTI OJK (SP 3/STPASTI/III/2025) mengenai website palsu mengatasnamakan IASC.",
    emergencyActionSteps: [
      "Periksa domain utama di bilah alamat peramban (portal resmi pemerintah selalu berakhiran .go.id, BUKAN .top, .xyz, atau .site).",
      "Jangan pernah mengisikan kode OTP atau PIN ke formulir web apa pun.",
      "Konfirmasi langsung ke kanal resmi instansi terkait (Kring Pajak 1500200 atau Kontak OJK 157)."
    ],
    legalClauses:
      "Pasal 35 jo. Pasal 51 ayat (1) UU ITE (Pemalsuan Dokumen Elektronik dengan ancaman 12 tahun penjara & denda Rp12 miliar) serta Pasal 378 KUHP.",
    officialSourceCitation:
      "Kementerian Komunikasi dan Digital RI (Komdigi) & Satgas PASTI Otoritas Jasa Keuangan (2025).",
    workbenchPresetId: "phishing-pajak"
  },
  {
    id: "task-scam",
    number: 3,
    title: "Loker Freelance & Task Scam (Misi Like & Komisi Harian)",
    shortName: "Task Scam (Loker Freelance)",
    category: "Penipuan Finansial Bertingkat / Task Fraud",
    riskLevel: "HIGH",
    dangerScore: 90,
    modusOperandi:
      "Penawaran kerja paruh waktu mudah (like video YouTube, follow medsos, ulasan produk e-commerce). Di awal komisi kecil puluhan ribu benar-benar dicairkan, lalu korban dipaksa deposit jutaan rupiah berdalih 'Misi VIP'.",
    characteristics: [
      "Iming-iming gaji 50rb-500rb per hari tanpa kualifikasi pendidikan",
      "Pencairan komisi awal berhasil untuk membangun kepercayaan semu (Foot-in-the-Door)",
      "Peralihan ke grup Telegram khusus dengan anggota bot yang memamerkan bukti penarikan palsu",
      "Kewajiban transfer deposit berjenjang dengan ancaman modal hangus jika tugas tidak selesai"
    ],
    psychologicalBiases: [
      {
        biasName: "Greed & Reciprocity Bias",
        description: "Tergiur keuntungan instan dan merasa berhutang budi karena sebelumnya sudah diberi komisi gratis."
      },
      {
        biasName: "Sunk Cost Fallacy",
        description: "Korban merasa sudah menyetor modal awal jutaan rupiah, sehingga terdorong menyetor lagi agar uang sebelumnya tidak hilang."
      }
    ],
    technicalMechanism:
      "Jaringan sindikat memanfaatkan grup perpesanan tertutup (Telegram Channels) dengan sistem multi-tier bot akun nominee. Rekening tujuan deposit adalah rekening bank sewaan (mule accounts) yang langsung di-layering ke rekening lain dalam hitungan menit.",
    realCasesIndonesia:
      "Data penanganan satgas perbankan Indonesia Anti-Scam Centre (IASC - OJK); Laporan aduan transaksi nominee masyarakat pada portal Patroli Siber Bareskrim Polri.",
    emergencyActionSteps: [
      "Hentikan segera transfer tambahan apa pun dalih admin (jangan percaya janji pencairan).",
      "Kumpulkan bukti mutasi transfer dan nomor rekening penampung pelaku.",
      "Laporkan nomor rekening penipu ke portal iasc.ojk.go.id dan CekRekening.id (Komdigi)."
    ],
    legalClauses:
      "Pasal 28 ayat (1) jo. Pasal 45A ayat (1) UU ITE No. 1/2024 (Penyebaran Berita Bohong yang Menyebabkan Kerugian Konsumen) dan Pasal 378 KUHP.",
    officialSourceCitation:
      "Otoritas Jasa Keuangan (IASC) & Satgas PASTI.",
    workbenchPresetId: "loker-bumn"
  },
  {
    id: "sms-blast-phishing",
    number: 4,
    title: "SMS Blast Phishing Bank (Kuras Rekening Skala Massal)",
    shortName: "SMS Blast Phishing Perbankan",
    category: "Phishing Massal & SIM Card Box",
    riskLevel: "CRITICAL",
    dangerScore: 92,
    modusOperandi:
      "Mengirimkan pesan singkat (SMS) secara massal mencatut nama bank swasta/BUMN ternama, menyertakan link phishing pembaruan tarif transfer menjadi Rp150.000/bulan atau pemblokiran kartu debit.",
    characteristics: [
      "Pesan masuk melalui SMS menggunakan nomor GSM biasa atau sender ID tiruan",
      "Isu perubahan tarif transaksi drastis yang membuat nasabah emosi atau cemas",
      "Tautan mengarah ke halaman web tiruan login m-Banking / Internet Banking",
      "Meminta memasukkan nomor kartu debit, expired date, CVV, dan kode OTP masuk"
    ],
    psychologicalBiases: [
      {
        biasName: "Fear of Loss",
        description: "Khawatir saldo tabungan terpotong biaya administrasi siluman Rp150.000 jika tidak segera membatalkan via tautan."
      },
      {
        biasName: "Urgency Pressure",
        description: "Batas waktu pembatalan dibuat singkat (1 jam) agar nasabah bertindak tanpa sempat menelepon bank resmi."
      }
    ],
    technicalMechanism:
      "Sindikat menggunakan perangkat keras SIM Card Box / Modem Pool ilegal dengan ribuan kartu SIM perdana yang menembakkan jutaan SMS phishing per hari. Data yang dimasukkan korban ditangkap otomatis oleh script backend penipu dan langsung digunakan untuk transaksi online.",
    realCasesIndonesia:
      "Pengungkapan Bareskrim Polri (24 Maret 2025) atas sindikat SMS blast phishing bank dengan kerugian 12 nasabah mencapai Rp473 juta.",
    emergencyActionSteps: [
      "Segera telepon hotline resmi bank penerbit kartu debit (Halo BCA 1500888, Mandiri 14000, BRI 1500017, BNI 1500046).",
      "Minta pemblokiran kartu debit dan akun mobile banking secara darurat.",
      "Ganti seluruh kredensial perbankan dan buat laporan ke kantor cabang terdekat."
    ],
    legalClauses:
      "Pasal 30 jo. Pasal 46 UU ITE (Illegal Access) serta UU No. 3 Tahun 2011 tentang Transfer Dana. Ancaman pidana penjara 8 tahun.",
    officialSourceCitation:
      "Direktorat Tindak Pidana Siber Bareskrim Polri (Pengungkapan Sindikat SMS Blast Maret 2025).",
    workbenchPresetId: "phishing-pajak"
  },
  {
    id: "account-takeover-quishing",
    number: 5,
    title: "Account Takeover (ATO) & Quishing (Begal OTP & QR Palsu)",
    shortName: "Begal OTP & QR Code Palsu (Quishing)",
    category: "Penyusupan Akun & QR Code Tampering",
    riskLevel: "HIGH",
    dangerScore: 85,
    modusOperandi:
      "Pelaku mengaku salah kirim voucher belanja/pulsa lalu mendesak korban mengirimkan 6 digit angka SMS masuk; atau menempelkan stiker QRIS/QR code palsu di lokasi publik untuk menyusupkan tautan berbahaya.",
    characteristics: [
      "Pelaku memelas minta tolong karena keliru memasukkan nomor korban",
      "Mendesak memberikan 6 digit kode yang masuk ke SMS korban (sebenarnya kode OTP WhatsApp/e-wallet)",
      "Stiker kode QRIS di meja resto/kotak amal yang menimpa kode QRIS resmi pemilik toko",
      "Begitu akun berpindah tangan, penipu meminjam uang ke semua kontak kontak darurat korban"
    ],
    psychologicalBiases: [
      {
        biasName: "Helpfulness & Empathy Trap",
        description: "Niat tulus menolong orang lain yang mengaku keliru atau panik salah transaksi."
      },
      {
        biasName: "Blind Trust in Technology",
        description: "Menganggap semua kode QR yang tercetak di ruang publik adalah resmi dan aman dipindai."
      }
    ],
    technicalMechanism:
      "Penyerang memicu request login dari perangkat penipu, lalu memanfaatkan kelengahan korban untuk membacakan kode 2-Factor Authentication (2FA). Untuk Quishing, QR code memuat payload deep-link yang mengarahkan peramban korban ke halaman pencuri token OAuth.",
    realCasesIndonesia:
      "Modus pengambilalihan akun WhatsApp dan dompet digital massal yang dicatat Bareskrim Polri; Panduan Keamanan Siber SeaBank ID & OJK (2025).",
    emergencyActionSteps: [
      "Jangan pernah menyerahkan 6 digit kode OTP masuk kepada siapa pun dengan alasan apa pun.",
      "Jika akun WhatsApp terlanjur dibajak: Kirim email darurat ke support@whatsapp.com dengan subjek 'Hilang/Dicuri: Silakan nonaktifkan akun saya'.",
      "Periksa nama merchant resmi setiap kali memindai kode QRIS sebelum menekan tombol bayar."
    ],
    legalClauses:
      "Pasal 32 UU ITE (Perusakan dan Pemindahan Dokumen/Akun Elektronik) dan Pasal 378 KUHP.",
    officialSourceCitation:
      "Patroli Siber Bareskrim Polri & Panduan Edukasi Keamanan Perbankan Digital.",
    workbenchPresetId: "m-banking-palsu"
  },
  {
    id: "deepfake-vishing",
    number: 6,
    title: "Deepfake & Voice Phishing (Vishing) (Kloning Suara & Video AI)",
    shortName: "Deepfake & Voice Vishing AI",
    category: "Kecerdasan Buatan Generatif / Audio Spoofing",
    riskLevel: "CRITICAL",
    dangerScore: 94,
    modusOperandi:
      "Penggunaan teknologi AI generatif untuk mengkloning suara pejabat, atasan kantor, atau anak/kerabat dalam panggilan telepon, atau video klarifikasi palsu pengumuman bansos dan dana hibah.",
    characteristics: [
      "Panggilan telepon dari nomor tidak dikenal dengan suara yang persis menyerupai suara kerabat",
      "Skenario darurat dramatis: anak menangis tertangkap polisi, kecelakaan, atau atasan butuh transfer dana talangan segera",
      "Latar belakang suara dibuat bising menyerupai kantor polisi atau IGD rumah sakit",
      "Penipu melarang korban mematikan telepon atau menghubungi anggota keluarga lain"
    ],
    psychologicalBiases: [
      {
        biasName: "Social Proof & Familiarity",
        description: "Korban mendengar suara yang sangat identik dengan sosok yang dipercaya sehingga logika kritis langsung lumpuh."
      },
      {
        biasName: "Cognitive Overload",
        description: "Rasa panik dan syok mendengar kerabat tertimpa musibah membuat korban langsung menuruti permintaan uang."
      }
    ],
    technicalMechanism:
      "Pelaku menggunakan model AI Voice Synthesis (seperti RVC atau VITS) yang dilatih dengan sampel audio korban dari media sosial publik (TikTok/Instagram) hanya dalam 3-5 detik. Model lalu digabungkan dengan soundboard real-time saat melakukan panggilan VoIP spoofed.",
    realCasesIndonesia:
      "Kajian akademis arXiv:2601.20184 (Securing AI Agents & Deepfake Threats); Kasus vishing penipuan kloning suara ASN di Magetan dengan kerugian Rp105 juta (Maret 2025).",
    emergencyActionSteps: [
      "Gunakan 'Kata Sandi Rahasia Keluarga' (Family Safe Word) untuk memverifikasi keaslian penelepon.",
      "Tutup panggilan telepon segera dan hubungi nomor telepon utama kerabat yang bersangkutan secara terpisah.",
      "Hubungi kantor kepolisian atau rumah sakit terdekat untuk mengonfirmasi kebenaran peristiwa sebelum mentransfer dana."
    ],
    legalClauses:
      "Pasal 35 UU ITE (Manipulasi Informasi Elektronik Mengakibatkan Dokumen Otentik Palsu) jo. Pasal 51 ayat (1) serta Pasal 378 KUHP.",
    officialSourceCitation:
      "Kajian Ilmiah arXiv:2601.20184 (Hatami et al., 2026) & Laporan Penipuan AI Siber Bareskrim Polri.",
    workbenchPresetId: "m-banking-palsu"
  },
  {
    id: "romance-pig-butchering",
    number: 7,
    title: "Romance Scam & Pig Butchering (Sha Zhu Pan / Investasi Bodong)",
    shortName: "Romance Scam & Love Bait",
    category: "Manipulasi Emosional & Investasi Fiktif",
    riskLevel: "CRITICAL",
    dangerScore: 93,
    modusOperandi:
      "Pelaku membangun hubungan asmara palsu secara intensif di media sosial/aplikasi kencan (Love Bombing) selama berminggu-minggu, lalu secara halus mengajak korban 'investasi bersama' di website kripto/trading fiktif yang tampilannya dapat dimanipulasi.",
    characteristics: [
      "Profil media sosial berpenampilan sangat mapan, menarik, dan perhatian penuh",
      "Selalu menolak melakukan panggilan video (video call) dengan dalih kamera rusak atau sinyal buruk",
      "Mengaku memiliki 'orang dalam' atau sistem rahasia trading dengan keuntungan pasti",
      "Pada awal deposit, korban diizinkan mencairkan keuntungan kecil untuk memancing setoran modal jutaan rupiah"
    ],
    psychologicalBiases: [
      {
        biasName: "Love Bombing & Emotional Attachment",
        description: "Memanfaatkan kesepian dan rasa percaya korban melalui perhatian emosional harian yang intensif."
      },
      {
        biasName: "Sunk-Cost Fallacy",
        description: "Ketika saldo tertahan, korban terus menyetor uang pajak/biaya pencairan fiktif demi menyelamatkan uang modal sebelumnya."
      }
    ],
    technicalMechanism:
      "Sindikat mengoperasikan platform web trading palsu (MetaTrader tiruan atau bursa kripto custom) yang angkanya diatur manual oleh penipu. Ketika korban ingin menarik dana (withdraw), sistem mengunci akun dan menuntut biaya 'verifikasi pajak internasional' hingga korban kehabisan dana.",
    realCasesIndonesia:
      "Laporan Satgas PASTI OJK (2025) terkait kerugian warga akibat love scam berkedok bursa kripto palsu di aplikasi kencan.",
    emergencyActionSteps: [
      "Hentikan segera seluruh transfer dana tambahan, jangan pernah membayar 'biaya pencairan pajak'.",
      "Simpan seluruh riwayat percakapan, nomor rekening, dan alamat dompet kripto pelaku.",
      "Laporkan nomor rekening ke portal iasc.ojk.go.id dan buat Laporan Polisi di SPKT/patrolisiber.id."
    ],
    legalClauses:
      "Pasal 28 ayat (1) UU ITE No. 1/2024 (Kerugian Konsumen Transaksi Elektronik), Pasal 378 KUHP (Penipuan), dan UU TPPU No. 8/2010.",
    officialSourceCitation:
      "Satgas PASTI OJK & Direktorat Tindak Pidana Siber Bareskrim Polri.",
    workbenchPresetId: "loker-bumn"
  },
  {
    id: "sextortion-blackmail",
    number: 8,
    title: "Sextortion & Pemerasan Digital (Video Call Trap & Rekayasa AI)",
    shortName: "Sextortion & Pemerasan Digital",
    category: "Pemerasan Siber & Manipulasi Privasi",
    riskLevel: "CRITICAL",
    dangerScore: 96,
    modusOperandi:
      "Pelaku memancing korban melakukan panggilan video asusila atau merekayasa foto wajah korban dengan kecerdasan buatan, lalu mengancam menyebarkan rekaman ke daftar kontak keluarga, teman sekolah, atau media sosial jika tidak mentransfer sejumlah uang.",
    characteristics: [
      "Ajakan video call yang intens dari akun baru dengan foto profil menarik",
      "Tiba-tiba mengirim rekaman tangkapan layar video dan daftar follower/kontak korban",
      "Batas waktu ancaman sangat mendesak (10-30 menit) disertai intimidasi verbal",
      "Permintaan uang ditransfer via dompet digital (e-wallet) tanpa verifikasi identitas"
    ],
    psychologicalBiases: [
      {
        biasName: "Extreme Shame & Panic Bias",
        description: "Rasa malu dan takut reputasi hancur di depan keluarga/sekolah melumpuhkan pertimbangan logis korban."
      },
      {
        biasName: "Blackmail Compliance",
        description: "Korban mengira membayar sekali akan menyelesaikan masalah, padahal pelaku akan terus memeras berulang kali."
      }
    ],
    technicalMechanism:
      "Pelaku menggunakan aplikasi screen recorder saat video call atau model face-swap AI untuk menempelkan wajah korban ke rekaman orang lain. Daftar kontak korban biasanya dikumpulkan sebelumnya melalui phishing tautan Instagram atau scraping data publik.",
    realCasesIndonesia:
      "Peringatan BSSN & Bareskrim Polri mengenai sindikat pemerasan seksual digital lintas negara yang menyasar pelajar dan remaja.",
    emergencyActionSteps: [
      "JANGAN PERNAH mentransfer uang sepeser pun! Membayar hanya membuat pelaku menuntut jumlah yang lebih besar.",
      "Ambil tangkapan layar ancaman, nomor telepon, dan nomor rekening penipu untuk bukti hukum.",
      "Kunci akun media sosial menjadi private, aktifkan 2FA, dan segera ceritakan kepada orang tua/konselor terpercaya.",
      "Laporkan ke portal aduankonten.id (Komdigi) dan patrolisiber.id Bareskrim Polri."
    ],
    legalClauses:
      "Pasal 27B ayat (2) jo. Pasal 45 ayat (10) UU ITE No. 1/2024 (Pemerasan dan Pengancaman melalui Elektronik, pidana 6 tahun) serta Pasal 368 KUHP.",
    officialSourceCitation:
      "Kementerian Komunikasi dan Digital (Komdigi) & Bareskrim Polri.",
    workbenchPresetId: "m-banking-palsu"
  },
  {
    id: "game-social-phishing",
    number: 9,
    title: "Phishing Akun Game & Media Sosial (Diamond Gratis & Centang Biru)",
    shortName: "Phishing Akun Game & Sosmed",
    category: "Pencurian Akun & Kredensial",
    riskLevel: "HIGH",
    dangerScore: 82,
    modusOperandi:
      "Penyebaran tautan di kolom komentar TikTok/YouTube yang menjanjikan skin senjata Free Fire, diamond Mobile Legends gratis, atau formulir verifikasi centang biru Instagram dengan meminta login akun media sosial.",
    characteristics: [
      "Domain menggunakan ekstensi tidak lazim (misal: claim-diamond-mlbb.xyz atau verifikasi-ig-badge.top)",
      "Tampilan halaman web dibuat sangat mirip dengan portal login resmi Google, Facebook, atau Moonton",
      "Meminta kata sandi dan kode OTP masuk akun",
      "Setelah data dikirim, kata sandi dan email pemulihan langsung diganti oleh bot penipu"
    ],
    psychologicalBiases: [
      {
        biasName: "Greed & Freebie Bias",
        description: "Keinginan mendapatkan item digital mahal secara cuma-cuma mengabaikan kewaspadaan alamat website."
      }
    ],
    technicalMechanism:
      "Halaman phishing meniru form OAuth login dan langsung mengirimkan string username serta password ke webhook Telegram atau database penipu. Akun korban lalu dijual di forum gelap atau digunakan untuk mengirimkan spam ke kontak korban.",
    realCasesIndonesia:
      "Laporan literasi keamanan siber Komdigi mengenai maraknya pencurian akun gamer pelajar melalui turnamen fiktif dan web klaim skin gratis.",
    emergencyActionSteps: [
      "Segera buka halaman pemulihan akun resmi (accounts.google.com atau facebook.com/hacked) untuk ganti kata sandi.",
      "Periksa sesi perangkat yang aktif dan pilih 'Keluar dari semua perangkat'.",
      "Aktifkan Google Authenticator / Two-Factor Authentication (2FA) berbasis aplikasi, hindari 2FA via SMS biasa."
    ],
    legalClauses:
      "Pasal 30 jo. Pasal 46 UU ITE (Illegal Access) dan Pasal 35 UU ITE (Manipulasi Dokumen Otentik).",
    officialSourceCitation:
      "Direktorat Tata Kelola Aplikasi Informatika Komdigi & BSSN.",
    workbenchPresetId: "phishing-pajak"
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
