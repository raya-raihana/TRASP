import { NextRequest, NextResponse } from "next/server";
import { SANDBOX_SCENARIOS, matchCustomUserReply } from "@/lib/trasp/sandbox-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scenarioId, userMessage, chatHistory, currentVulnerability } = body;

    const apiKey = process.env.GEMINI_API_KEY;
    const scenario = SANDBOX_SCENARIOS[scenarioId] || SANDBOX_SCENARIOS["apk-kurir"];

    // If no API key, fallback immediately
    if (!apiKey) {
      const fallback = matchCustomUserReply(userMessage || "", scenarioId || "apk-kurir", 0);
      return NextResponse.json({
        ok: true,
        source: "fallback",
        ...fallback
      });
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

    // Call Gemini 3.8 Flash with 4-second timeout abort controller
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`;

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
  } catch (err) {
    // Deterministic fallback (Kepatuhan Juknis: Zero-Crash & Offline-Ready)
    const fallback = matchCustomUserReply("Halo kak", "apk-kurir", 0);
    return NextResponse.json({
      ok: true,
      source: "local-fallback",
      ...fallback
    });
  }
}
