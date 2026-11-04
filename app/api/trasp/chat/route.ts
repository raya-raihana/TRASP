import { NextRequest, NextResponse } from "next/server";
import { SANDBOX_SCENARIOS, matchCustomUserReply } from "@/lib/trasp/sandbox-data";

function createFallbackScammerResponse(userMessage: string, scenarioId: string, currentStepIndex: number = 0) {
  const fallback = matchCustomUserReply(userMessage || "", scenarioId || "apk-kurir", currentStepIndex);
  return {
    ok: true,
    source: "local-heuristic",
    scammerResponse: fallback.scammerResponse,
    activeTactic: fallback.nextTelemetry?.activeTactic || "Manipulasi Taktis Siber",
    scammerMood: fallback.nextTelemetry?.scammerMood || "DEFLECTING",
    internalThought: fallback.nextTelemetry?.internalThought || "Target memberikan respons yang patut diwaspadai.",
    vulnerabilityDelta: typeof fallback.vulnerabilityDelta === "number" ? fallback.vulnerabilityDelta : 0,
  };
}

function createFallbackVictimResponse(userMessage: string, currentSkepticism: number = 100) {
  const lower = (userMessage || "").toLowerCase();
  let delta = -25;
  let response = "Waduh, ini beneran dari pihak resmi ya? Saya jadi kepikiran...";
  let state = "RAGU";
  let thought = "Agak panik mendengar ancaman ini, tapi saya harus tetap hati-hati.";

  if (lower.includes("otp") || lower.includes("pin") || lower.includes("rekening") || lower.includes("transfer sekarang")) {
    delta = 20;
    response = "Lho kok minta kode verifikasi atau transfer langsung ya? Setahu saya pihak resmi tidak pernah meminta itu lewat chat WhatsApp.";
    state = "SKEPTIS";
    thought = "Mencurigakan, ini pola penipuan yang sering diperingatkan OJK.";
  } else if (lower.includes("2 jam") || lower.includes("blokir") || lower.includes("denda") || lower.includes("paket")) {
    delta = -35;
    response = "Aduh jangan diblokir dulu ya kak, tolong kasih tahu apa yang harus saya lakukan biar tidak ada masalah?";
    state = "PANIK";
    thought = "Takut sekali kalau rekening diblokir atau ada denda jutaan rupiah.";
  } else if (lower.includes("500") || lower.includes("hadiah") || lower.includes("cuan") || lower.includes("komisi")) {
    delta = -30;
    response = "Wah lumayan sekali ya komisinya. Caranya gimana ya kak untuk ikut tugas selanjutnya?";
    state = "TERGIUR";
    thought = "Tergiur dengan penghasilan tambahan, mumpung lagi butuh uang.";
  }

  return {
    ok: true,
    source: "local-heuristic",
    victimResponse: response,
    skepticismDelta: delta,
    emotionalState: state,
    victimThought: thought,
  };
}

function createFallbackAssistantResponse(userMessage: string) {
  const lower = (userMessage || "").toLowerCase();
  let reply = "Halo! Saya Ras. Berdasarkan analisis pola digital deception, selalu waspadai berkas asing (.apk) dan tautan yang mendesak tindakan finansial atau kode OTP.";

  if (lower.includes("apk") || lower.includes("kurir") || lower.includes("resi") || lower.includes("undangan")) {
    reply = "Berkas berekstensi .apk di luar toko aplikasi resmi umumnya trojan perbankan (Android Banking Trojan). Modus ini meminta izin Accessibility Service dan Read SMS untuk menyadap SMS OTP m-Banking. Jangan pernah di-install. Jika telanjur, segera aktifkan Mode Pesawat (Air-Gap) dan cabut izin aksesibilitasnya.";
  } else if (lower.includes("ojk") || lower.includes("iasc") || lower.includes("lapor") || lower.includes("polisi")) {
    reply = "Untuk penanganan darurat penipuan finansial, laporkan nomor rekening penipu dalam 15-30 menit pertama ke Indonesia Anti-Scam Centre (IASC) OJK via portal iasc.ojk.go.id atau kontak 157 untuk blokir kilat rekening penampung. Untuk jerat pidana UU ITE, laporkan ke patrolisiber.id Bareskrim Polri.";
  } else if (lower.includes("hukum") || lower.includes("pasal") || lower.includes("ite")) {
    reply = "Pelaku kejahatan siber penipuan online dijerat secara khusus (lex specialis) melalui Pasal 28 ayat (1) jo. Pasal 45A ayat (1) UU ITE No. 1/2024 dengan ancaman penjara hingga 6 tahun dan/atau denda Rp1 Miliar, serta Pasal 378 KUHP (lex generali) penipuan.";
  } else if (lower.includes("loker") || lower.includes("tugas") || lower.includes("deposit")) {
    reply = "Waspadai skema Task Scam atau komisi kerja lepas. Awalnya korban diberi komisi kecil asli untuk membangun kepercayaan, lalu diarahkan menyetor deposit talangan bertingkat yang tidak akan pernah bisa ditarik kembali.";
  }

  return {
    ok: true,
    source: "local-forensic-assistant",
    assistantResponse: reply,
    detectedVectors: ["Heuristik Linguistik Siber", "Protokol OJK / Bareskrim", "Edukasi UU ITE 2024"],
  };
}

const CANDIDATE_GEMINI_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-3.8-flash",
];

export async function POST(req: NextRequest) {
  let userMessage = "";
  let scenarioId = "apk-kurir";
  let currentStepIndex = 0;
  let mode: "scammer" | "assistant" | "victim" = "scammer";

  try {
    const body = await req.json();
    userMessage = body.userMessage || body.message || "";
    scenarioId = body.scenarioId || "apk-kurir";
    currentStepIndex = body.currentStepIndex || 0;
    
    if (body.mode === "victim") {
      mode = "victim";
    } else if (body.mode === "assistant" || body.mode === "copilot") {
      mode = "assistant";
    } else {
      mode = "scammer";
    }

    const { chatHistory, currentVulnerability, currentSkepticism, contextEvidence } = body;

    const rawKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_AI_STUDIO_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY ||
      process.env.GEMINI_KEY ||
      process.env.AI_STUDIO_KEY ||
      "";
    const apiKey = rawKey.trim().replace(/^["']|["']$/g, "");

    const mistralKey = (
      process.env.MISTRAL_API_KEY ||
      ""
    ).trim().replace(/^["']|["']$/g, "");

    const scenario = SANDBOX_SCENARIOS[scenarioId] || SANDBOX_SCENARIOS["apk-kurir"];

    // -------------------------------------------------------------
    // MODE 1: ASISTEN FORENSIK AI INTERAKTIF (Recognize & Act Chatbot)
    // -------------------------------------------------------------
    if (mode === "assistant") {
      const historyFormatted = Array.isArray(chatHistory) && chatHistory.length > 0
        ? `\nRIWAYAT PERCAKAPAN SEBELUMNYA (INGAT DAN LANJUTKAN KONTEKS INI):\n${chatHistory
            .slice(-8)
            .map((m: { sender: string; text: string }) => `${m.sender === "user" ? "Pengguna" : "Ras"}: ${m.text}`)
            .join("\n")}\n`
        : "";

      const assistantSystemPrompt = `Kamu adalah Ras, asisten kecerdasan buatan forensik siber dan analis regulasi TRASP untuk kompetisi Web Development MIT-WEEK 2026 UNMUL.
Karaktermu: Investigator forensik siber berwawasan tinggi setara Satgas PASTI OJK dan Dittipidsiber Bareskrim Polri. Kamu ramah, tajam, empatik, dan berwibawa.
Gaya bicaramu: Bahasa Indonesia yang bersih, natural, profesional, dan terstruktur rapi. DILARANG menggunakan tanda bintang ganda (**) berlebihan. Gunakan pemformatan teks bersih dengan spasi paragraf dan poin strip (-) agar nyaman dibaca.

BASIS PENGETAHUAN RESMI OTORITAS (OJK, BARESKRIM, BSSN):
1. INDONESIA ANTI-SCAM CENTRE (IASC - OJK):
   - Forum koordinasi penipuan transaksi keuangan yang dibentuk OJK bersama Satgas PASTI, Asosiasi Bank, dan PJP (beroperasi sejak 22 Nov 2024).
   - Portal Resmi: iasc.ojk.go.id, Kontak OJK 157, WhatsApp Resmi: 081-157-157-157, sipasti.ojk.go.id.
   - Alur Kerja IASC: Korban melapor dengan nomor rekening penipu & bukti transfer -> Bank pengirim memverifikasi tiket laporan -> Diteruskan secara instan ke Bank penerima/penampung untuk Penundaan Transaksi (Blokir Kilat) & Enhanced Due Diligence (EDD) -> Penelusuran berantai (Chain fund tracking) ke rekening nominee berikutnya sebelum dana ditarik.
   - PENTING: Laporan ke IASC adalah JALUR FINANSIAL (penyelamatan sisa dana). Korban TETAP WAJIB membuat Laporan Polisi (LP) di patrolisiber.id / SPKT untuk JALUR HUKUM PIDANA.
2. BARESKRIM POLRI (DITTIPIDSIBER):
   - Portal: patrolisiber.id | Email: aduan@siber.polri.go.id.
   - Menerbitkan Surat Tanda Terima Laporan Polisi (STTLP) sebagai syarat sah pembekuan rekening tetap dan penyitaan aset sitaan negara untuk restitusi korban.
3. KERANGKA HUKUM SIBER INDONESIA:
   - UU No. 1 Tahun 2024 (Perubahan Kedua UU ITE):
     * Pasal 28 ayat (1) jo. Pasal 45A ayat (1): Berita bohong / menyesatkan merugikan konsumen transaksi elektronik (Maksimal 6 tahun penjara / denda Rp1 Miliar).
     * Pasal 30 jo. Pasal 46: Akses ilegal sistem perbankan / sideloading trojan APK (Hingga 8 tahun / denda Rp800 Juta).
     * Pasal 32 jo. Pasal 48: Penyadapan / intersepsi transmisi SMS OTP m-Banking tanpa hak (Hingga 10 tahun / denda Rp3 Miliar).
     * Pasal 35 jo. Pasal 51 ayat (1): Manipulasi dokumen otentik elektronik / phising domain (Hingga 12 tahun / denda Rp12 Miliar).
   - KUHP: Pasal 378 (Penipuan konvensional, 4 tahun penjara).
   - UU No. 8 Tahun 2010 (TPPU): Menjerat penyedia / penjual Rekening Nominee (Mule Account) yang menampung uang kejahatan (Hingga 20 tahun penjara).
   - POJK No. 22/2023: Pelindungan Konsumen Sektor Jasa Keuangan.
4. PROTOKOL FORENSIK TEKNIS (BSSN):
   - Malware APK Sniffer: Memanfaatkan Android Accessibility Services (AccessibilityNodeInfo) & izin READ_SMS untuk mencuri token OTP. Tindakan: Segera aktifkan Mode Pesawat (Air-Gap) untuk memutus soket TCP malware ke Command & Control (C2), lalu cabut izin aksesibilitas.
   - Quishing (QRIS Phishing): Dynamic QR code tampering mengalihkan pembayaran ke merchant fiktif.
   - Task Scam: Skema penipuan komisi bertingkat (Advance-Fee Fraud) mengeksploitasi bias sunk-cost fallacy.

${contextEvidence ? `BUKTI YANG SEDANG DIPERIKSA OLEH PENGGUNA:\n${contextEvidence}\n` : ""}
${historyFormatted}
TUGASMU:
1. Bedah bukti pesan/tautan yang ditanyakan dengan presisi forensik (jelaskan taktik psikologis dan ancaman teknisnya).
2. Jika pengguna panik atau sudah telanjur transfer/instal APK, prioritaskan instruksi darurat Golden Time 15 Menit pertama (Air-gap, Call Center Bank, dan lapor ke iasc.ojk.go.id).
3. Kutip pasal UU ITE 2024 dan alur Laporan Polisi (patrolisiber.id) secara proporsional.
4. Jawab pertanyaan pengguna secara padat, lugas, mengalir, dan solutif.

FORMAT OUTPUT WAJIB JSON PERSIS:
{
  "assistantResponse": "Jawaban mendalam, solutif, dan berwibawa dari Ras tanpa simbol bintang berantakan",
  "detectedVectors": ["1-3 vektor analisis relevan"],
  "recommendedAction": "1 rekomendasi aksi cepat paling penting bagi pengguna"
}`;

      for (const model of CANDIDATE_GEMINI_MODELS) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

          const res = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: assistantSystemPrompt },
                    { text: `Pesan/Pertanyaan Pengguna: "${userMessage}"` },
                  ],
                },
              ],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.6,
              },
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          if (!res.ok) continue;

          const data = await res.json();
          let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!rawText) continue;

          rawText = rawText.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (!jsonMatch) continue;

          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({
            ok: true,
            source: `gemini-ai (${model})`,
            assistantResponse: parsed.assistantResponse || "Analisis forensik selesai.",
            detectedVectors: parsed.detectedVectors || ["Analisis Forensik AI"],
            recommendedAction: parsed.recommendedAction || "Selalu verifikasi ke pihak resmi terkait.",
          });
        } catch {
          continue;
        }
      }

      if (mistralKey) {
        try {
          const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${mistralKey}`,
            },
            body: JSON.stringify({
              model: "mistral-small-latest",
              messages: [
                { role: "system", content: assistantSystemPrompt },
                { role: "user", content: `Pertanyaan: "${userMessage}"` },
              ],
              response_format: { type: "json_object" },
            }),
          });
          if (res.ok) {
            const data = await res.json();
            const raw = data?.choices?.[0]?.message?.content;
            const parsed = JSON.parse(raw);
            return NextResponse.json({
              ok: true,
              source: "mistral-ai (mistral-small)",
              assistantResponse: parsed.assistantResponse,
              detectedVectors: parsed.detectedVectors || ["Mistral AI Forensics"],
              recommendedAction: parsed.recommendedAction || "Waspada terhadap modus manipulasi digital.",
            });
          }
        } catch {
          // Fall through
        }
      }

      return NextResponse.json(createFallbackAssistantResponse(userMessage));
    }

    // -------------------------------------------------------------
    // MODE 2: SIMULASI TARGET / KORBAN (Red Team Mode: User = Penipu, Bot = Korban)
    // -------------------------------------------------------------
    if (mode === "victim") {
      const victimSystemPrompt = `Kamu adalah mesin simulator siber forensik TRASP untuk kompetisi Web Development MIT-WEEK 2026 UNMUL.
Tugasmu adalah memainkan peran (roleplay) sebagai WARGA INDONESIA BIASA (CALON KORBAN) yang sedang dichat di WhatsApp oleh orang asing / penipu (User).

SKENARIO KASUS:
- Modus: ${scenario.title} (${scenario.category})
- Skeptisisme Korban saat ini: ${currentSkepticism ?? 100}% (100% = sangat waspada/curiga, 0% = percaya total/jebol).

RIWAYAT PERCAKAPAN (INGAT DAN LANJUTKAN DARI PERCAKAPAN INI):
${Array.isArray(chatHistory) ? chatHistory.slice(-10).map((m: { sender: string; text: string }) => `${m.sender === "user" ? "Penipu (User)" : "Korban (AI)"}: ${m.text}`).join("\n") : ""}

PESAN TERBARU DARI PENIPU (USER):
"${userMessage}"

INSTRUKSI ROLEPLAY KORBAN:
1. Bersikaplah seperti warga biasa yang menggunakan bahasa santun, wajar, dan sedikit emosional.
2. Jika trik penipu meyakinkan, menakut-nakuti batas waktu (misal paket tertahan, ancaman denda, atau iming-iming komisi): kamu mulai panik atau tergiur, dan berikan skepticismDelta NEGATIF (antara -15 sampai -40).
3. Jika penipu terlalu kasar, terburu-buru minta transfer/OTP tanpa alasan jelas, atau mencurigakan: kamu curiga dan berikan skepticismDelta POSITIF (+10 sampai +30), serta tanyakan surat tugas / bukti resmi.
4. Jangan pernah membocorkan bahwa kamu adalah AI. Tetap dalam karakter warga biasa sampai akhir.

FORMAT OUTPUT WAJIB JSON PERSIS:
{
  "victimResponse": "balasan singkat calon korban (1-2 kalimat chat WhatsApp)",
  "skepticismDelta": angka antara -40 sampai +30,
  "emotionalState": "SKEPTIS" | "RAGU" | "PANIK" | "TERGIUR" | "JEBOL",
  "victimThought": "monolog batin jujur dari korban tentang apa yang dia rasakan saat membaca pesan penipu"
}`;

      for (const model of CANDIDATE_GEMINI_MODELS) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

          const res = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: victimSystemPrompt }] }],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.7,
              },
            }),
            signal: controller.signal,
          });

          clearTimeout(timeoutId);
          if (!res.ok) continue;

          const data = await res.json();
          let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!rawText) continue;

          rawText = rawText.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
          const jsonMatch = rawText.match(/\{[\s\S]*\}/);
          if (!jsonMatch) continue;

          const parsed = JSON.parse(jsonMatch[0]);

          return NextResponse.json({
            ok: true,
            source: `gemini-ai (${model})`,
            victimResponse: parsed.victimResponse || "Waduh, ini beneran ya? Saya agak ragu...",
            skepticismDelta: typeof parsed.skepticismDelta === "number" ? parsed.skepticismDelta : -20,
            emotionalState: parsed.emotionalState || "RAGU",
            victimThought: parsed.victimThought || "Saya merasa tertekan membaca pesan ini.",
          });
        } catch {
          continue;
        }
      }

      return NextResponse.json(createFallbackVictimResponse(userMessage, currentSkepticism));
    }

    // -------------------------------------------------------------
    // MODE 3: SIMULASI ROLEPLAY PENIPU (Game Korban: User = Korban, Bot = Penipu)
    // -------------------------------------------------------------
    const scammerSystemPrompt = `Kamu adalah mesin AI simulator siber forensik untuk kompetisi Web Development MIT-WEEK 2026 UNMUL.
Tugasmu adalah memainkan peran (roleplay) sebagai SINDIKAT PENIPU SIBER INDONESIA yang sangat realistis dalam percakapan WhatsApp.

INFORMASI SKENARIO:
- Modus: ${scenario.title} (${scenario.category})
- Nama Pelaku: ${scenario.scammerName}
- Kerentanan Korban Saat Ini: ${currentVulnerability ?? 50}%

RIWAYAT PERCAKAPAN (INGAT DAN LANJUTKAN DARI PERCAKAPAN INI):
${Array.isArray(chatHistory) ? chatHistory.slice(-10).map((m: { sender: string; text: string }) => `${m.sender === "user" ? "Target" : "Penipu"}: ${m.text}`).join("\n") : ""}

PESAN TERBARU DARI TARGET (USER):
"${userMessage}"

INSTRUKSI ROLEPLAY:
1. Tanggapi pesan target dengan gaya bahasa WhatsApp penipu Indonesia yang otentik (menekan urgensi waktu, dalih sistem, sok akrab, atau gertak balik).
2. Jika target kritis/curiga/sebut polisi/OJK: Kamu mulai defensif, ngeles, dan tutupi kedokmu.
3. Jika target mau menuruti: Dorong lebih keras agar dia segera transfer/kirim OTP/instal APK.
4. Jangan pernah membocorkan bahwa kamu adalah AI.

FORMAT OUTPUT WAJIB JSON PERSIS TANPA FORMAT LAIN:
{
  "scammerResponse": "balasan penipu dalam 1-3 kalimat chat WhatsApp",
  "activeTactic": "nama taktik manipulasi psikologis (misal: Kepanikan Urgensi, Dalih Otoritas, Gaslighting)",
  "scammerMood": "CONFIDENT" | "PUSHING" | "DEFLECTING" | "PANICKED" | "BUSTED",
  "internalThought": "monolog batin sinis penipu tentang apa yang dia pikirkan",
  "vulnerabilityDelta": angka antara -50 sampai +50 (negatif jika target waspada, positif jika target termakan umpan)
}`;

    for (const model of CANDIDATE_GEMINI_MODELS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: scammerSystemPrompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.7,
            },
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        if (!res.ok) continue;

        const data = await res.json();
        let rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) continue;

        rawText = rawText.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) continue;

        const parsed = JSON.parse(jsonMatch[0]);

        return NextResponse.json({
          ok: true,
          source: `gemini-ai (${model})`,
          scammerResponse: parsed.scammerResponse || "Iya kak, tolong dicek sekarang ya.",
          activeTactic: parsed.activeTactic || "Manipulasi Interaktif AI",
          scammerMood: parsed.scammerMood || "DEFLECTING",
          internalThought: parsed.internalThought || "Target memberikan respons tak terduga.",
          vulnerabilityDelta: typeof parsed.vulnerabilityDelta === "number" ? parsed.vulnerabilityDelta : 0,
        });
      } catch {
        continue;
      }
    }

    if (mistralKey) {
      try {
        const res = await fetch("https://api.mistral.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mistralKey}`,
          },
          body: JSON.stringify({
            model: "mistral-small-latest",
            messages: [
              { role: "system", content: scammerSystemPrompt },
              { role: "user", content: `Pesan target: "${userMessage}"` },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const raw = data?.choices?.[0]?.message?.content;
          const parsed = JSON.parse(raw);
          return NextResponse.json({
            ok: true,
            source: "mistral-ai (mistral-small)",
            scammerResponse: parsed.scammerResponse || "Iya kak, tolong segera diproses ya.",
            activeTactic: parsed.activeTactic || "Manipulasi Taktis Mistral",
            scammerMood: parsed.scammerMood || "DEFLECTING",
            internalThought: parsed.internalThought || "Target merespons dengan pola tertentu.",
            vulnerabilityDelta: typeof parsed.vulnerabilityDelta === "number" ? parsed.vulnerabilityDelta : 0,
          });
        }
      } catch {
        // Fall through
      }
    }

    return NextResponse.json(createFallbackScammerResponse(userMessage, scenarioId, currentStepIndex));
  } catch (_err) {
    if (mode === "assistant") {
      return NextResponse.json(createFallbackAssistantResponse(userMessage));
    }
    if (mode === "victim") {
      return NextResponse.json(createFallbackVictimResponse(userMessage));
    }
    return NextResponse.json(createFallbackScammerResponse(userMessage, scenarioId, currentStepIndex));
  }
}
