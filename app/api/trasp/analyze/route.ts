import { NextRequest, NextResponse } from "next/server";
import { analyzeForensics } from "@/lib/trasp/engine";

const CANDIDATE_GEMINI_MODELS = [
  "gemini-3.6-flash",
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.text || "";
    const url = body.url || "";

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

    // Quick local heuristic calculation as baseline
    const localResult = analyzeForensics(text, url);

    // AI Forensic Prompt: Deep Semantic & Psychological Study
    const forensicSystemPrompt = `Kamu adalah Sistem Analisis Forensik Siber AI TRASP (Cyber-Forensic & Behavioral Engine).
Tugasmu adalah MEMPELAJARI secara mendalam sampel teks/tautan yang dikirimkan, bukan menebak angka semata. Lakukan pembuktian forensik digital, teliti pola bahasa manipulasi psikologis, rekayasa sosial (social engineering), serta ancaman teknisnya.

SAMPEL YANG DIANALISIS:
- Teks Pesan: "${text}"
- Tautan / URL: "${url}"

INSTRUKSI ANALISIS:
1. Pelajari apakah pesan mengeksploitasi bias kognitif korban (urgensi semu, rasa takut, kepatuhan otoritas, iming-iming uang/cuan, atau rasa penasaran).
2. Periksa ancaman teknis (ekstensi .apk mencurigakan, IP publik mentah, formulir phishing, permintaan OTP/transfer, pemendek tautan).
3. Berikan skor bahaya ilmiah (0 - 100) dan klasifikasi:
   - 0-25: LOW (Indikator Rendah / Relatif Aman, tetap waspada)
   - 26-60: MEDIUM (Waspada: Memuat Pola Manipulasi)
   - 61-100: HIGH (Indikator Bahaya Tinggi: Potensi Kejahatan Siber Serius)
4. Tuliskan penjelasan forensik kritis (deepForensicReasoning) dalam 2-3 kalimat lugas yang membongkar trik pelaku.
5. Sebutkan langkah mitigasi darurat spesifik.

FORMAT OUTPUT WAJIB JSON PERSIS:
{
  "summaryVerdict": "Judul singkat vonis forensik (contoh: Trojan Malware APK Berbahaya / Phishing Akun Bank / Modus Task Scam / Pesan Komunikasi Wajar)",
  "dangerScore": angka 0-100,
  "riskLevel": "HIGH" | "MEDIUM" | "LOW",
  "biasExploited": ["Nama bias 1", "Nama bias 2"],
  "technicalThreats": ["Ancaman teknis 1", "Ancaman teknis 2"],
  "deepForensicReasoning": "Uraian ilmiah alasan pesan ini berbahaya atau aman, menelusuri trik linguistik dan niat terselubung pelaku.",
  "mitigationRecommendation": "Langkah mitigasi darurat 15 menit pertama bagi target."
}`;

    // 1. Try Gemini AI Studio Models
    for (const model of CANDIDATE_GEMINI_MODELS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: forensicSystemPrompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2, // Low temperature for deterministic precision
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
          summaryVerdict: parsed.summaryVerdict || localResult.statusLabel,
          dangerScore: typeof parsed.dangerScore === "number" ? parsed.dangerScore : localResult.riskScore,
          riskLevel: parsed.riskLevel || localResult.riskLevel,
          biasExploited: Array.isArray(parsed.biasExploited) ? parsed.biasExploited : ["Tekanan Waktu Semu (Urgency)"],
          technicalThreats: Array.isArray(parsed.technicalThreats) ? parsed.technicalThreats : ["Rekayasa Sosial Digital"],
          deepForensicReasoning: parsed.deepForensicReasoning || localResult.summary,
          mitigationRecommendation: parsed.mitigationRecommendation || (localResult.safeRecommendations?.[0] || "Selalu verifikasi ke pihak resmi terkait."),
          localVectors: localResult.vectors,
        });
      } catch {
        continue;
      }
    }

    // 2. Try Mistral AI Fallback
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
              { role: "system", content: forensicSystemPrompt },
              { role: "user", content: `Analisis teks: "${text}", URL: "${url}"` },
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
            summaryVerdict: parsed.summaryVerdict || localResult.statusLabel,
            dangerScore: typeof parsed.dangerScore === "number" ? parsed.dangerScore : localResult.riskScore,
            riskLevel: parsed.riskLevel || localResult.riskLevel,
            biasExploited: parsed.biasExploited || ["Bias Psikologis Digital"],
            technicalThreats: parsed.technicalThreats || ["Vektor Siber Terdeteksi"],
            deepForensicReasoning: parsed.deepForensicReasoning || localResult.summary,
            mitigationRecommendation: parsed.mitigationRecommendation || (localResult.safeRecommendations?.[0] || "Waspada terhadap modus manipulasi."),
            localVectors: localResult.vectors,
          });
        }
      } catch {
        // Fall through
      }
    }

    // 3. Fallback to Local Forensic Engine
    return NextResponse.json({
      ok: true,
      source: "local-heuristic-engine",
      summaryVerdict: localResult.statusLabel,
      dangerScore: localResult.riskScore,
      riskLevel: localResult.riskLevel,
      biasExploited: ["Manipulasi Diksi & Tekanan Waktu", "Eksploitasi Kredensial / Aset"],
      technicalThreats: localResult.vectors.filter((v) => v.score > 0).map((v) => v.name),
      deepForensicReasoning: localResult.summary,
      mitigationRecommendation: localResult.safeRecommendations?.[0] || "Verifikasi ke kanal resmi terkait.",
      localVectors: localResult.vectors,
    });
  } catch (_err) {
    return NextResponse.json({
      ok: false,
      error: "Gagal memproses analisis forensik.",
    });
  }
}
