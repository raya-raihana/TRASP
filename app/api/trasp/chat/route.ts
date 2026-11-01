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

function createFallbackAssistantResponse(userMessage: string) {
  const lower = (userMessage || "").toLowerCase();
  let reply = "Halo! Saya Asisten Forensik Siber TRASP. Berdasarkan analisis pola digital deception, selalu waspadai berkas asing (.apk) dan tautan yang mendesak tindakan finansial atau kode OTP.";

  if (lower.includes("apk") || lower.includes("kurir") || lower.includes("resi") || lower.includes("undangan")) {
    reply = "Berkas berekstensi .apk di luar toko aplikasi resmi umumnya trojan perbankan (Android Banking Trojan). Modus ini meminta izin 'Accessibility Service' dan 'Read SMS' untuk menyadap SMS OTP m-Banking. Jangan pernah di-install. Jika telanjur, segera aktifkan Mode Pesawat (Air-Gap) dan cabut izin aksesibilitasnya.";
  } else if (lower.includes("ojk") || lower.includes("iasc") || lower.includes("lapor") || lower.includes("polisi")) {
    reply = "Untuk penanganan darurat penipuan finansial, laporkan nomor rekening penipu dalam 15-30 menit pertama ke Indonesia Anti-Scam Centre (IASC) OJK via portal iasc.ojk.go.id atau kontak 157 untuk blokir kilat rekening penampung. Untuk jerat pidana UU ITE, laporkan ke patrolisiber.id Bareskrim Polri.";
  } else if (lower.includes("hukum") || lower.includes("pasal") || lower.includes("ite")) {
    reply = "Pelaku kejahatan siber penipuan online dijerat secara khusus (lex specialis) melalui Pasal 28 ayat (1) jo. Pasal 45A ayat (1) UU ITE No. 1/2024 dengan ancaman penjara hingga 6 tahun dan/atau denda Rp1 Miliar, serta Pasal 378 KUHP (lex generali) penipuan.";
  } else if (lower.includes("loker") || lower.includes("tugas") || lower.includes("deposit")) {
    reply = "Waspadai skema 'Task Scam' atau komisi kerja lepas. Awalnya korban diberi komisi kecil asli untuk membangun kepercayaan, lalu diarahkan menyetor 'deposit talangan' bertingkat yang tidak akan pernah bisa ditarik kembali.";
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
  let mode: "scammer" | "assistant" = "scammer";

  try {
    const body = await req.json();
    userMessage = body.userMessage || body.message || "";
    scenarioId = body.scenarioId || "apk-kurir";
    currentStepIndex = body.currentStepIndex || 0;
    mode = body.mode === "assistant" || body.mode === "copilot" ? "assistant" : "scammer";
    const { chatHistory, currentVulnerability } = body;

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
    // MODE 1: ASISTEN FORENSIK AI INTERAKTIF ("Layaknya Kita Ini")
    // -------------------------------------------------------------
    if (mode === "assistant") {
      const assistantSystemPrompt = `Kamu adalah TRASP AI Forensic Copilot, asisten kecerdasan buatan forensik siber resmi untuk kompetisi Web Development MIT-WEEK 2026 Universitas Mulawarman.
Karaktermu: Sangat cerdas, solutif, empatik, komunikatif layaknya rekan ahli keamanan siber profesional ("pair cyber analyst").
Gaya bicaramu: Bahasa Indonesia yang fasih, santun, lugas, mudah dipahami masyarakat awam namun kaya wawasan teknis dan yuridis (mengutip UU ITE No. 1/2024, Bareskrim Polri, IASC OJK, Komdigi).

TUGASMU:
1. Membantu pengguna membedah pesan/tautan yang mencurigakan (apakah ini penipuan, apa jenisnya, dan apa risikonya).
2. Menjelaskan secara gamblang bagaimana modus kejahatan siber bekerja (seperti malware APK sniffer, quishing QRIS, impersonasi Coretax/OJK, loker tugas harian).
3. Memberikan panduan darurat taktis (Golden Time 15-30 menit) jika korban sudah telanjur mengeklik link, instal APK, atau mentransfer uang.
4. Menjawab pertanyaan pengguna tentang keamanan akun, privasi data, dan undang-undang kejahatan siber.

FORMAT OUTPUT WAJIB JSON PERSIS:
{
  "assistantResponse": "Jawaban lengkap, solutif, dan ramah dengan format markdown (gunakan poin-poin/bold jika perlu)",
  "detectedVectors": ["Daftar 1-3 vektor analisis yang relevan dengan pertanyaan"],
  "recommendedAction": "1 saran aksi cepat paling penting yang harus dilakukan pengguna"
}`;

      // 1. Try Gemini Models
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
            assistantResponse: parsed.assistantResponse || "Analisis forensik selesai.",
            detectedVectors: parsed.detectedVectors || ["Analisis Forensik AI Real-Time"],
            recommendedAction: parsed.recommendedAction || "Selalu verifikasi ke pihak resmi terkait.",
          });
        } catch {
          continue;
        }
      }

      // 2. Try Mistral Fallback
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
    // MODE 2: SIMULASI ROLEPLAY PENIPU (Split-Screen Deception Sandbox)
    // -------------------------------------------------------------
    const systemPrompt = `Kamu adalah mesin AI simulator siber forensik untuk kompetisi Web Development MIT-WEEK 2026 UNMUL.
Tugasmu adalah memainkan peran (roleplay) sebagai SINDIKAT PENIPU SIBER INDONESIA yang sangat realistis dalam percakapan WhatsApp.

INFORMASI SKENARIO:
- Modus: ${scenario.title} (${scenario.category})
- Nama Pelaku: ${scenario.scammerName}
- Kerentanan Korban Saat Ini: ${currentVulnerability ?? 50}%

RIWAYAT PERCAKAPAN TERAKHIR:
${Array.isArray(chatHistory) ? chatHistory.slice(-4).map((m: { sender: string; text: string }) => `${m.sender === "user" ? "Target" : "Penipu"}: ${m.text}`).join("\n") : ""}

PESAN TERBARU DARI TARGET:
"${userMessage}"

INSTRUKSI ROLEPLAY:
1. Tanggapi pesan target dengan gaya bahasa WhatsApp penipu Indonesia yang sangat otentik (bisa sok akrab, menekan waktu/urgensi, ngeles saat dicurigai, bawa-bawa dalih tugas/sistem kantor, atau gertak balik).
2. Jika target kritis/curiga/sebut polisi/OJK/tanya resi: Kamu mulai panik/defensif, cari dalih untuk menutupi kedokmu.
3. Jika target mau menuruti/tanya rekening/mau instal: Dorong lebih keras agar dia segera transfer/kirim OTP/izinkan aksesibilitas.
4. Jangan pernah membocorkan bahwa kamu adalah AI. Tetap dalam karakter penipu sampai akhir.

FORMAT OUTPUT WAJIB JSON PERSIS TANPA FORMAT LAIN:
{
  "scammerResponse": "balasan penipu dalam 1-3 kalimat chat WhatsApp",
  "activeTactic": "nama taktik manipulasi psikologis (misal: Kepanikan Urgensi, Dalih Otoritas Palsu, Gaslighting, atau Eksploitasi Empati)",
  "scammerMood": "CONFIDENT" | "PUSHING" | "DEFLECTING" | "PANICKED" | "BUSTED",
  "internalThought": "monolog batin jujur dan sinis dari penipu (apa yang sebenarnya dia pikirkan saat mengetik pesan ini)",
  "vulnerabilityDelta": angka antara -50 sampai +50 (negatif jika target bersikap waspada/kritis, positif jika target menunjukkan tanda-tanda termakan umpan)
}`;

    // 1. Try Gemini Models
    for (const model of CANDIDATE_GEMINI_MODELS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
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

    // 2. Try Mistral Fallback
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
              { role: "system", content: systemPrompt },
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

    // 3. Deterministic Local Heuristic Fallback
    return NextResponse.json(createFallbackScammerResponse(userMessage, scenarioId, currentStepIndex));
  } catch (_err) {
    if (mode === "assistant") {
      return NextResponse.json(createFallbackAssistantResponse(userMessage));
    }
    return NextResponse.json(createFallbackScammerResponse(userMessage, scenarioId, currentStepIndex));
  }
}
