import { NextRequest, NextResponse } from "next/server";
import { SANDBOX_SCENARIOS, matchCustomUserReply } from "@/lib/trasp/sandbox-data";

function createFallbackResponse(userMessage: string, scenarioId: string, currentStepIndex: number = 0) {
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

export async function POST(req: NextRequest) {
  let userMessage = "";
  let scenarioId = "apk-kurir";
  let currentStepIndex = 0;

  try {
    const body = await req.json();
    userMessage = body.userMessage || "";
    scenarioId = body.scenarioId || "apk-kurir";
    currentStepIndex = body.currentStepIndex || 0;
    const { chatHistory, currentVulnerability } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    const scenario = SANDBOX_SCENARIOS[scenarioId] || SANDBOX_SCENARIOS["apk-kurir"];

    // If no API key or non-AIzaSy key, fallback immediately without network delay (Kepatuhan Juknis Anti-Lag)
    if (!apiKey || !apiKey.startsWith("AIzaSy")) {
      return NextResponse.json(createFallbackResponse(userMessage, scenarioId, currentStepIndex));
    }

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
1. Tanggapi pesan target dengan gaya bahasa WhatsApp penipu Indonesia yang sangat otentik (bisa sok akrab, menekan waktu/urgensi, ngeles saat dicurigai, bawa-bawa agama/kasihan, atau gertak balik).
2. Jika target kritis/curiga/sebut polisi/OJK/tanya resi: Kamu mulai panik/defensif, cari dalih ngawur untuk menutupi kedokmu.
3. Jika target mau menuruti/tanya rekening/mau instal: Dorong lebih keras agar dia segera transfer/kirim OTP/izinkan aksesibilitas.
4. Jangan pernah membocorkan bahwa kamu adalah AI. Tetap dalam karakter penipu sampai akhir.

FORMAT OUTPUT WAJIB JSON PERSIS:
{
  "scammerResponse": "balasan penipu dalam 1-3 kalimat chat WhatsApp",
  "activeTactic": "nama taktik manipulasi psikologis (misal: Kepanikan Urgensi, Dalih Otoritas Palsu, Gaslighting, atau Eksploitasi Empati)",
  "scammerMood": "CONFIDENT" | "PUSHING" | "DEFLECTING" | "PANICKED" | "BUSTED",
  "internalThought": "monolog batin jujur dan sinis dari penipu (apa yang sebenarnya dia pikirkan saat mengetik pesan ini)",
  "vulnerabilityDelta": angka antara -50 sampai +50 (negatif jika target bersikap waspada/kritis, positif jika target menunjukkan tanda-tanda termakan umpan)
}`;

    // 3.5s timeout abort controller (Anti-Lag requirement)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

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

    if (!res.ok) {
      throw new Error(`Gemini API error: ${res.statusText}`);
    }

    const data = await res.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error("Empty candidate from Gemini");

    const parsed = JSON.parse(rawText);

    return NextResponse.json({
      ok: true,
      source: "gemini-ai",
      scammerResponse: parsed.scammerResponse,
      activeTactic: parsed.activeTactic || "Manipulasi Interaktif AI",
      scammerMood: parsed.scammerMood || "DEFLECTING",
      internalThought: parsed.internalThought || "Target memberikan respon tak terduga.",
      vulnerabilityDelta: typeof parsed.vulnerabilityDelta === "number" ? parsed.vulnerabilityDelta : 0,
    });
  } catch (_err) {
    // Deterministic fallback (Kepatuhan Juknis: Zero-Crash & Offline-Ready)
    return NextResponse.json(createFallbackResponse(userMessage, scenarioId, currentStepIndex));
  }
}
