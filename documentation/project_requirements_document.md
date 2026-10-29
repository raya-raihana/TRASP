# Product Requirements Document (PRD) — TRUST//TRAP

**Product Name:** TRUST//TRAP (Interactive Cyber-Forensic & Digital Deception Triage Workbench)  
**Target Competition:** MIT-WEEK 2026 — Universitas Mulawarman  
**Theme:** *Guardians of the Digital Space – Empowering Today's Generation Toward a Safer Cyber Ecosystem*  
**Case Study:** *The Trust Trap: Navigating Digital Deception*  
**Version:** 1.1.0 (Realistic & Compliance-Hardened Edition)  

---

## 1. Executive Summary & Vision

In Indonesia's digital landscape, young people and families face daily threats from manipulative digital deception: fraudulent job vacancies requiring deposit schemes, malicious `.APK` invitations designed to hijack SMS OTPs, and fake accounts impersonating official institutions.

**TRUST//TRAP** is an interactive, privacy-first web application designed to empower everyday internet users to become informed digital guardians. Built around the core principle of **"Depth and Reliability over Feature Bloat"** (as mandated by the competition guidelines), TRUST//TRAP focuses on a single, seamless pipeline:
1. **Recognize (Mengenali):** Analyze suspicious text and URLs using heuristic vector matching and a leetspeak/slang normalizer, supported by an interactive client-side privacy redactor.
2. **Learn (Belajar) — [HERO FEATURE]:** Train decision-making resilience through a split-screen interactive chat sandbox with a real-time *Scammer Telemetry X-Ray*.
3. **Act (Bertindak):** Execute a 15-minute emergency triage checklist and generate standardized, copy-ready incident reports for official authorities.

---

## 2. Regulatory Compliance & Educational Disclaimer

> [!IMPORTANT]
> **Strict Adherence to Competition Rule 29 (Transparency & Limitation):**
> 1. **No Absolute Verdicts:** The system strictly avoids claiming 100% certainty. It does not label items as "Definitely Safe" or "100% Scam". Instead, it outputs probabilistic educational indicators:
>    - *Indikator Kecurigaan Tinggi (High Suspicion Indicators Found)*
>    - *Waspada: Memuat Pola Manipulasi (Warning: Manipulation Patterns Detected)*
>    - *Indikator Rendah Terdeteksi (Low Risk Indicators - Stay Cautious)*
> 2. **Permanent Educational Banner:** Every screen displays a visible disclaimer:
>    *"⚠️ Disclaimer Edukasi: TRUST//TRAP adalah alat bantu simulasi dan indikator awal edukasi keamanan siber. Hasil evaluasi tidak menjamin legalitas mutlak suatu entitas. Selalu lakukan verifikasi silang melalui kanal resmi."*
> 3. **Zero Data Retention:** No personal data, chat history, or uploaded media are collected or stored on external servers. All basic evaluations happen strictly on-device in the user's browser.

---

## 3. Core Architecture: The 3 Cohesive Engines

### Engine 1: Recognize — Text/URL Heuristics & Interactive Privacy Canvas
- **Primary Input (Zero-Lag):** Fast text and URL input with instant evaluation (<10ms).
- **Linguistic Normalization (Anti-Evasion):**
  - Leetspeak decoder (`d4p4tk4n` $\rightarrow$ `dapatkan`, `pr0m0` $\rightarrow$ `promo`).
  - Spacing unmasker (`t . e . l . e . g . r . a . m` $\rightarrow$ `telegram`).
  - Indonesian scam lexicon (cuan instan, misi like-subscribe, deposit awal, komisi harian).
- **Multi-Vector Heuristic Scoring:** Rather than brittle single-keyword matches, the engine scores across 3 interlocking threat vectors:
  1. *Time Pressure (Urgensi):* Artificial deadlines and panic-inducing language.
  2. *Sensitive Asset Demand:* Demands for OTP, PIN, transfer, or remote installation.
  3. *Unverified Channel / Obfuscated Link:* IP address, typosquatting domains, or deceptive subdomains.
- **Interactive Canvas Privacy Redactor (Visual Assister):**
  - Instead of slow, high-latency browser OCR that risks browser freezes, users can upload a screenshot and use an intuitive one-touch black-marker canvas to redact phone numbers or names before analysis.
  - Built-in preset demo screenshots allow judges to test the redaction instantly without needing personal files.

### Engine 2: Learn — [FLAGSHIP HERO FEATURE] Split-Screen Sandbox
- **Dual-View Split Screen:**
  - *Left View:* Simulated messaging interface (WhatsApp/Telegram style) where users interact with common deceptive scripts (fake courier APK, fake BUMN HR recruitment, tax penalty phishing).
  - *Right View (Live Scammer Telemetry X-Ray):* Exposes the scammer's real-time psychological playbook:
    - *Active Manipulation Vector:* (e.g., "Memicu Sunk Cost Fallacy: Korban telah menyelesaikan tugas 1 & 2, penipu mulai meminta deposit Rp150.000").
    - *Victim Vulnerability Bar:* Fluctuates based on user responses (critical questions reduce vulnerability; emotional/panic responses spike it).
- **Post-Simulation Post-Mortem:** Transparent breakdown of which responses mitigated the threat and which decision points almost led into the trap.

### Engine 3: Act — 15-Minute Containment & Incident Triage
- **Interactive Containment Checklist:** Sequential first-aid protocols for immediate damage control:
  - *Scenario A: Accidental APK Click* $\rightarrow$ Step 1: Airplane mode; Step 2: Revoke Accessibility Services; Step 3: Check app list.
  - *Scenario B: Disclosed OTP/PIN* $\rightarrow$ Step 1: Direct call button to official bank hotlines; Step 2: Temporary card freeze.
- **Copy-Ready Official Report Generator:** Formats the incident chronology into clean, ready-to-copy text for official government and banking portals (IASC OJK, Patroli Siber Polri, CekRekening.id).

---

## 4. Technical Specifications & Performance

- **Framework:** Next.js 15 (App Router), React 19, TypeScript.
- **Styling:** Tailwind CSS v4, Lucide React icons.
- **State Management:** React state + `localStorage` for sandbox session history.
- **Performance Targets (Addy Osmani Standard):**
  - First Contentful Paint (FCP) $\le 1.2s$.
  - Interaction to Next Paint (INP) $\le 150ms$.
  - Zero Cumulative Layout Shift (CLS $\le 0.05$).
- **Deployment:** Vercel (Edge-ready, static asset caching, zero database crash risk during live evaluation).
