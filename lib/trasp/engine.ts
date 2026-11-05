// TRASP Forensic & Heuristic Engine
// Built for MIT-WEEK 2026 UNMUL — The Trust Trap

export interface ThreatVector {
  id: string;
  name: string;
  score: number; // 0 - 100
  weight: number;
  description: string;
  detectedClues: string[];
}

export interface UrlDeconstruction {
  isValid: boolean;
  originalUrl: string;
  protocol: string;
  subdomain: string;
  rootDomain: string;
  path: string;
  isSuspiciousTld: boolean;
  isPunycodeOrIp: boolean;
  isSpoofedSubdomain: boolean;
  isTrustedPlatform?: boolean;
  trustedPlatformName?: string;
  explanation: string;
}

export interface ForensicResult {
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  riskScore: number; // 0 - 100
  statusLabel: string;
  summary: string;
  vectors: ThreatVector[];
  urlAnalysis?: UrlDeconstruction;
  normalizedText: string;
  detectedRedFlags: string[];
  safeRecommendations: string[];
}

export interface PresetCase {
  id: string;
  title: string;
  tag: string;
  iconType: string;
  rawText: string;
  rawUrl?: string;
  sampleSender: string;
  scenarioDescription: string;
}

// 4 Preset Demo Data for "Alur 60 Detik Juri"
export const PRESET_CASES: PresetCase[] = [
  {
    id: "apk-kurir",
    title: "Undangan Nikah & Resi Kurir .APK",
    tag: "Malware Android",
    iconType: "smartphone",
    sampleSender: "+62 812-9988-7711 (Kurir J&T Express)",
    scenarioDescription: "Pelaku mengirimkan berkas berformat .APK dengan dalih foto resi paket yang belum sampai atau undangan nikah digital.",
    rawText: "Selamat siang kak, mohon maaf paket J&T tertahan karena alamat kurang jelas. Tolong buka dan cek foto resi di berkas LIHAT_FOTO_PAKET.apk ini ya kak. Wajib di-install sekarang sebelum paket dikembalikan ke gudang dalam 2 jam!",
    rawUrl: "http://194.233.164.88/unduh/LIHAT_FOTO_PAKET.apk"
  },
  {
    id: "loker-bumn",
    title: "Loker Freelance BUMN (Task Fraud)",
    tag: "Penipuan Finansial",
    iconType: "briefcase",
    sampleSender: "+62 857-4433-2211 (HRD Rekrutmen BUMN)",
    scenarioDescription: "Pelaku menawarkan pekerjaan paruh waktu mudah (like-subscribe YouTube) dengan komisi harian, lalu meminta deposit uang.",
    rawText: "Halo kak! Kami dari tim talent HR BUMN Holding. Anda terpilih kerja freelance paruh waktu cuma like dan subscribe YouTube komisi 50rb-500rb per hari! Tugas 1 & 2 gratis. Tugas 3 wajib deposit saldo awal 200rb ke rekening bendahara kami untuk cairkan komisi 500rb sekarang juga!",
    rawUrl: "https://bumn-karir-resmi.cuan-harian.xyz/tugas-freelance"
  },
  {
    id: "phishing-pajak",
    title: "Tagihan Denda Pajak & Bea Cukai",
    tag: "Phishing & Ancaman",
    iconType: "alert-triangle",
    sampleSender: "+62 821-7788-9900 (Ditjen Pajak RI)",
    scenarioDescription: "Pelaku mencatut nama instansi resmi pemerintah dengan ancaman pemblokiran rekening jika tidak klik link verifikasi.",
    rawText: "PERINGATAN TERAKHIR DITJEN PAJAK RI: Anda memiliki tunggakan pajak progresif sebesar Rp4.850.000. Rekening bank dan NPWP Anda akan DIBLOKIR TOTAL dalam waktu 1x24 jam jika tidak konfirmasi. Segera verifikasi data dan masukkan kode OTP Anda pada portal berikut:",
    rawUrl: "https://djp-pajak.klikbca.pembayaran-denda.top/login-portal"
  },
  {
    id: "m-banking-palsu",
    title: "Bukti Transfer M-Banking Editan",
    tag: "Social Engineering",
    iconType: "credit-card",
    sampleSender: "+62 813-1122-3344 (Pembeli Online Shop)",
    scenarioDescription: "Pelaku pura-pura kelebihan transfer uang saat beli barang, lalu menuntut korban segera transfer balik selisihnya sambil panik.",
    rawText: "Halo kak, saya sudah transfer Rp1.500.000 via m-Banking BCA padahal tagihannya cuma Rp150.000! Saya panik salah ketik angka 0. Ini uang buat berobat anak saya di RS! Tolong segera transfer balik Rp1.350.000 ke rekening saya sekarang kak sebelum jam 5 sore!",
  }
];

// Leetspeak Dictionary
const LEET_MAP: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "7": "t",
  "8": "b",
  "@": "a",
  "$": "s",
};

export function normalizeText(input: string): string {
  if (!input) return "";

  // 1. Lowercase & strip zero-width characters
  let text = input.replace(/[\u200B-\u200D\uFEFF]/g, "").toLowerCase();

  // 2. Decode Leetspeak
  text = text
    .split("")
    .map((char) => LEET_MAP[char] || char)
    .join("");

  // 3. Unmask spaced single letters like "t . e . l . e . g . r . a . m" or "w a"
  text = text.replace(/(?<=\b[a-z0-9])[\s\.\-_]+(?=[a-z0-9]\b)/gi, "");

  // 4. Normalize multiple whitespaces into a single space
  return text.replace(/\s+/g, " ").trim();
}

// URL Anatomy Deconstructor
export function deconstructUrl(rawUrl: string): UrlDeconstruction {
  const result: UrlDeconstruction = {
    isValid: false,
    originalUrl: rawUrl,
    protocol: "",
    subdomain: "",
    rootDomain: "",
    path: "",
    isSuspiciousTld: false,
    isPunycodeOrIp: false,
    isSpoofedSubdomain: false,
    explanation: ""
  };

  if (!rawUrl || typeof rawUrl !== "string") return result;

  try {
    let cleanUrl = rawUrl.trim();
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = "https://" + cleanUrl;
    }

    const parsed = new URL(cleanUrl);
    result.isValid = true;
    result.protocol = parsed.protocol;
    result.path = parsed.pathname + parsed.search;

    const hostname = parsed.hostname;

    // Check IP address hostname
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname)) {
      result.isPunycodeOrIp = true;
      result.rootDomain = hostname;
      result.explanation = "Menggunakan alamat IP langsung tanpa nama domain terdaftar. Ini pola umum server malware/phishing!";
      return result;
    }

    // Check Punycode
    if (hostname.includes("xn--")) {
      result.isPunycodeOrIp = true;
      result.explanation = "Menggunakan karakter homograf (Punycode) yang menyerupai huruf asli untuk memanipulasi mata manusia!";
    }

    const parts = hostname.split(".");
    if (parts.length >= 2) {
      const suspiciousTlds = ["xyz", "top", "tk", "ml", "ga", "cf", "gq", "work", "click", "rest", "buzz"];
      const tld = parts[parts.length - 1];
      result.isSuspiciousTld = suspiciousTlds.includes(tld);

      result.rootDomain = parts.slice(-2).join(".");
      if (parts.length > 2) {
        result.subdomain = parts.slice(0, -2).join(".");
      }

      // Check Subdomain Spoofing (e.g. bca.pembayaran-denda.xyz)
      const officialBrands = ["bca", "bri", "mandiri", "bni", "pajak", "beacukai", "kemkes", "pln", "telkomsel", "shopee", "tokopedia"];
      for (const brand of officialBrands) {
        if (result.subdomain.includes(brand) && !result.rootDomain.includes(brand)) {
          result.isSpoofedSubdomain = true;
          result.explanation = `PURA-PURA RESMI: Subdomain mengandung kata '${brand}', padahal domain pemilik sebenarnya adalah '${result.rootDomain}'.`;
          break;
        }
      }
    }

    if (!result.explanation) {
      // Check Known Trusted Platforms
      const trustedMap: Record<string, string> = {
        "youtube.com": "YouTube (Google LLC)",
        "youtu.be": "YouTube (Google LLC)",
        "google.com": "Google Search / Services",
        "google.co.id": "Google Indonesia",
        "wikipedia.org": "Wikipedia Ensiklopedia Terbuka",
        "github.com": "GitHub (Microsoft)",
        "instagram.com": "Instagram (Meta)",
        "facebook.com": "Facebook (Meta)",
        "tiktok.com": "TikTok Resmi",
        "twitter.com": "X (Twitter)",
        "x.com": "X (Twitter)",
        "whatsapp.com": "WhatsApp Resmi",
        "linkedin.com": "LinkedIn Professional",
        "spotify.com": "Spotify Music"
      };

      let isTrusted = false;
      let trustedName = "";
      for (const [domain, name] of Object.entries(trustedMap)) {
        if (hostname === domain || hostname.endsWith("." + domain)) {
          isTrusted = true;
          trustedName = name;
          break;
        }
      }

      if (!isTrusted) {
        if (hostname.endsWith(".go.id")) {
          isTrusted = true;
          trustedName = "Portal Resmi Pemerintah RI (.go.id)";
        } else if (hostname.endsWith(".ac.id") || hostname.endsWith(".sch.id")) {
          isTrusted = true;
          trustedName = "Institusi Pendidikan Resmi Indonesia";
        }
      }

      if (isTrusted) {
        result.isTrustedPlatform = true;
        result.trustedPlatformName = trustedName;
        result.explanation = `Tautan mengarah ke domain resmi terverifikasi: ${trustedName}. Bukan tautan phishing, malware, atau penipuan perbankan.`;
      } else if (result.isSuspiciousTld) {
        result.explanation = `Menggunakan domain tingkat atas (.${parts[parts.length - 1]}) berbiaya murah yang sering dimanfaatkan sindikat penipuan massal.`;
      } else {
        result.explanation = "Format URL secara teknis valid, namun tetap periksa tujuan tautannya.";
      }
    }
  } catch {
    result.explanation = "Format URL tidak valid atau rusak.";
  }

  return result;
}

// Multi-Vector Analysis Engine
export function analyzeForensics(text: string, urlInput?: string): ForensicResult {
  const norm = normalizeText(text);
  const redFlags: string[] = [];

  // Vektor 1: Urgensi & Tekanan Waktu (Weight: 25)
  const urgencyClues: string[] = [];
  const urgencyKeywords = [
    "segera", "cepat", "dalam waktu", "1x24 jam", "24 jam", "2 jam", "15 menit", "sekarang juga", "sekarang",
    "hari ini terakhir", "sebelum diblokir", "diblokir total", "tertahan", "darurat", "peringatan terakhir", "panik", "sebelum jam"
  ];
  urgencyKeywords.forEach((kw) => {
    if (norm.includes(kw)) urgencyClues.push(kw);
  });
  const urgencyScore = Math.min(100, urgencyClues.length * 35);
  if (urgencyClues.length > 0) {
    redFlags.push(`Menciptakan kepanikan buatan (urgensi): [${urgencyClues.join(", ")}]`);
  }

  // Vektor 2: Permintaan Aset & Akses Sensitif (Weight: 30)
  const assetClues: string[] = [];
  const assetKeywords = [
    "otp", "pin", "password", "kode verifikasi", "transfer", "deposit", "saldo awal", "unduh",
    ".apk", "install", "pasang aplikasi", "kirim saldo", "rekening bendahara", "kembalikan uang", "transfer balik", "rekening saya", "rekening"
  ];
  assetKeywords.forEach((kw) => {
    if (norm.includes(kw)) assetClues.push(kw);
  });
  const assetScore = Math.min(100, assetClues.length * 35);
  if (assetClues.length > 0) {
    redFlags.push(`Meminta akses sensitif / transfer dana: [${assetClues.join(", ")}]`);
  }

  // Vektor 3: Iming-iming Finansial & Umpan Hadiah (Weight: 20)
  const financialClues: string[] = [];
  const financialKeywords = [
    "cuan", "komisi", "like dan subscribe", "paruh waktu", "freelance", "gaji", "menang undian",
    "hadiah", "gratis", "bonus", "jutaan", "cairkan", "untung", "kelebihan transfer"
  ];
  financialKeywords.forEach((kw) => {
    if (norm.includes(kw)) financialClues.push(kw);
  });
  const financialScore = Math.min(100, financialClues.length * 30);
  if (financialClues.length > 0) {
    redFlags.push(`Iming-iming keuntungan finansial instan: [${financialClues.join(", ")}]`);
  }

  // Vektor 4: Pencatutan Otoritas & Identitas Resmi (Weight: 15)
  const authorityClues: string[] = [];
  const authorityKeywords = [
    "ditjen pajak", "bumn", "polri", "bea cukai", "bank bca", "bank bri", "bank mandiri", "m-banking bca", "m-banking",
    "j&t", "jne", "pos indonesia", "ojk", "kementerian", "institusi resmi", "kurir"
  ];
  authorityKeywords.forEach((kw) => {
    if (norm.includes(kw)) authorityClues.push(kw);
  });
  const authorityScore = Math.min(100, authorityClues.length * 35);
  if (authorityClues.length > 0) {
    redFlags.push(`Mencatut nama institusi atau instansi resmi: [${authorityClues.join(", ")}]`);
  }

  // Vektor 5: Tautan & Saluran Meragukan (Weight: 10)
  let urlAnalysis: UrlDeconstruction | undefined;
  let channelScore = 0;
  const channelClues: string[] = [];

  const effectiveUrl = urlInput || (text.match(/https?:\/\/[^\s]+/i)?.[0]);
  if (effectiveUrl) {
    urlAnalysis = deconstructUrl(effectiveUrl);
    if (urlAnalysis.isPunycodeOrIp) {
      channelScore = 95;
      channelClues.push("Alamat IP langsung / Punycode terdeteksi");
    } else if (urlAnalysis.isSpoofedSubdomain) {
      channelScore = 90;
      channelClues.push(`Subdomain menipu institusi (${urlAnalysis.subdomain})`);
    } else if (urlAnalysis.isSuspiciousTld) {
      channelScore = 70;
      channelClues.push(`Ekstensi domain mencurigakan (${urlAnalysis.rootDomain})`);
    } else if (urlAnalysis.isTrustedPlatform) {
      channelScore = 0;
    } else {
      channelScore = 15;
    }
  } else if (norm.includes(".apk")) {
    channelScore = 90;
    channelClues.push("Mengarahkan instalasi file executable Android (.apk)");
  }

  if (channelClues.length > 0) {
    redFlags.push(...channelClues);
  }

  // Multi-Vector Composite Score calculation (0 - 100)
  let calculatedScore = Math.round(
    (urgencyScore * 0.25) +
    (assetScore * 0.30) +
    (financialScore * 0.20) +
    (authorityScore * 0.15) +
    (channelScore * 0.10)
  );

  let riskLevel: "HIGH" | "MEDIUM" | "LOW" = "LOW";
  let statusLabel = "Indikator Kecurigaan Rendah (Aman)";
  let summary = "Tidak ditemukan kombinasi pola manipulasi berbahaya. Namun tetap selalu waspada terhadap pesan dari pihak asing.";

  const isHighCondition =
    calculatedScore >= 55 ||
    (channelScore >= 80 && assetScore >= 35) ||
    (urgencyScore >= 70 && assetScore >= 35) ||
    (financialScore >= 60 && assetScore >= 35) ||
    (channelScore >= 70 && urgencyScore >= 70);

  const hasAttackVector =
    assetScore > 0 ||
    channelScore >= 70 ||
    authorityScore > 0 ||
    (financialScore >= 30 && urgencyScore >= 35) ||
    financialScore >= 60;

  if (urlAnalysis?.isTrustedPlatform && redFlags.length === 0) {
    calculatedScore = 0;
    riskLevel = "LOW";
    statusLabel = `Tautan Platform Resmi (${urlAnalysis.trustedPlatformName})`;
    summary = `Tautan ini mengarah ke platform resmi publik (${urlAnalysis.trustedPlatformName}). Tidak ditemukan indikasi bahaya siber, phishing, maupun malware.`;
  } else if (text.startsWith("[Tangkapan Layar Unggahan Pengguna") && redFlags.length === 0) {
    calculatedScore = 0;
    riskLevel = "LOW";
    statusLabel = "Berkas / Gambar Netral (Bukan Ancaman)";
    summary = "Gambar yang diunggah tidak memuat teks atau pola manipulasi rekayasa sosial, urgensi palsu, maupun ancaman siber berbahaya. Berkas netral dan aman.";
  } else if (!hasAttackVector) {
    calculatedScore = 0;
    riskLevel = "LOW";
    statusLabel = "Pesan Normal / Bukan Ancaman Siber";
    summary = "Pesan ini teridentifikasi sebagai komunikasi wajar sehari-hari. Tidak ditemukan kombinasi pola manipulasi rekayasa sosial, permintaan kode OTP/PIN, tautan phishing, maupun ancaman file malware.";
  } else if (isHighCondition) {
    riskLevel = "HIGH";
    statusLabel = "Indikator Bahaya Tinggi (High Risk)";
    summary = "Pesan ini memiliki pola manipulasi psikologis tingkat tinggi dengan indikasi kuat serangan rekayasa sosial, pencurian dana, atau malware berbahaya!";
  } else if (calculatedScore >= 35 || assetScore >= 35 || (authorityScore >= 35 && urgencyScore >= 35)) {
    riskLevel = "MEDIUM";
    statusLabel = "Indikator Waspada (Medium Risk)";
    summary = "Ditemukan beberapa indikator kecurigaan. Verifikasi kanal resmi sebelum menanggapi atau mengklik tautan apa pun.";
  }

  const vectors: ThreatVector[] = [
    {
      id: "urgency",
      name: "Tekanan Urgensi",
      score: urgencyScore,
      weight: 25,
      description: "Memaksa korban bertindak cepat dalam keadaan panik agar tidak sempat berpikir jernih.",
      detectedClues: urgencyClues
    },
    {
      id: "asset",
      name: "Permintaan Aset / OTP",
      score: assetScore,
      weight: 30,
      description: "Target utama penipu untuk menguras saldo, mengambil alih akun, atau menginstal backdoor.",
      detectedClues: assetClues
    },
    {
      id: "financial",
      name: "Iming-iming Keuntungan",
      score: financialScore,
      weight: 20,
      description: "Memanfaatkan psikologi keserakahan (greed bait) dengan janji komisi tidak masuk akal.",
      detectedClues: financialClues
    },
    {
      id: "authority",
      name: "Pencatutan Otoritas",
      score: authorityScore,
      weight: 15,
      description: "Meniru instansi pemerintah, BUMN, atau bank agar korban merasa takut atau patuh.",
      detectedClues: authorityClues
    },
    {
      id: "channel",
      name: "Kecurigaan Saluran / URL",
      score: channelScore,
      weight: 10,
      description: "Menggunakan saluran non-resmi, file APK liar, atau domain palsu.",
      detectedClues: channelClues
    }
  ];

  let safeRecommendations = [
    "Jangan pernah mengirimkan kode OTP atau PIN kepada siapa pun, termasuk pihak yang mengaku petugas resmi.",
    "Jangan mengunduh atau menginstal berkas berakhiran .APK di luar toko aplikasi resmi (Google Play Store).",
    "Lakukan verifikasi nomor rekening atau telepon melalui kanal resmi CekRekening.id atau call center resmi bank.",
    "Beri jeda 15 menit dan konsultasikan pesan ini dengan rekan atau keluarga sebelum mengambil tindakan apa pun."
  ];

  if (calculatedScore === 0) {
    safeRecommendations = [
      "Tidak ada indikasi kejahatan siber, rekayasa sosial, atau manipulasi data yang ditemukan.",
      "Pesan atau tautan ini tergolong aman untuk interaksi wajar sehari-hari.",
      "Tetap jaga kebiasaan baik dengan tidak membagikan kata sandi atau data pribadi sensitif kepada pihak asing."
    ];
  } else if (urlAnalysis?.isTrustedPlatform && redFlags.length === 0) {
    safeRecommendations = [
      `Tautan ini terverifikasi aman mengarah ke ${urlAnalysis.trustedPlatformName}.`,
      "Aman untuk diakses sebagai konten publik biasa.",
      "Tetap waspada untuk tidak membuka tautan mencurigakan di kolom deskripsi atau komentar jika ada pihak asing yang menyematkan link eksternal."
    ];
  } else if (text.startsWith("[Tangkapan Layar Unggahan Pengguna") && redFlags.length === 0) {
    safeRecommendations = [
      "Tidak ada indikator ancaman siber yang terdeteksi pada gambar ini.",
      "Jika gambar ini merupakan bukti chat penipuan, ketikkan isi percakapan pada tab Teks agar dapat dibedah secara forensik."
    ];
  }

  return {
    riskLevel,
    riskScore: calculatedScore === 0 ? 0 : Math.min(99, Math.max(5, calculatedScore)),
    statusLabel,
    summary,
    vectors,
    urlAnalysis,
    normalizedText: norm,
    detectedRedFlags: redFlags,
    safeRecommendations
  };
}
