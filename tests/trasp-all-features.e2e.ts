import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { loginToHero } from './e2e-auth-helper';

test('TRASP Full Suite: All Features, Dynamic Indicators, Unified Learn & Assistant AI', async ({ app, screen }) => {
  // 1. Open the workbench application
  await app.open('/');
  await loginToHero(app, screen);

  // Verify workbench title is loaded
  await expect(screen.getByRole('button', 'Recognize')).toBeVisible();

  // Verify that the dedicated /mobile button is completely REMOVED from the header
  const mobileHeaderBtn = screen.getByText('/mobile');
  expect(await mobileHeaderBtn.count()).toBe(0);

  // -------------------------------------------------------------
  // FITUR 1: FORENSIC INSPECTOR, REAL-TIME AI STUDY & DYNAMIC INDICATION
  // -------------------------------------------------------------
  // Verify Initial Preset: Undangan .APK has High Risk Indication
  await expect(screen.getByText(/Indikator Bahaya Tinggi/i)).toBeVisible();

  // Verify Real-Time AI Forensic Learning Card
  await expect(screen.getByText(/HASIL PEMBELAJARAN FORENSIK AI REAL-TIME/i)).toBeVisible();
  await app.screenshot('01-forensic-apk-high-risk');

  // Switch to Preset 2: Loker Freelance BUMN
  const lokerBtn = screen.getByRole('button', 'Loker Freelance BUMN (Task Fraud)');
  await lokerBtn.tap();

  const inputArea = screen.getByRole('textbox', 'Tempel pesan WhatsApp/SMS mencurigakan di sini...');
  await expect(inputArea).toHaveValue(/HR BUMN Holding/i);
  await expect(screen.getByText(/Indikator Bahaya Tinggi/i)).toBeVisible();
  await expect(screen.getByText(/Skor:\s*80\/100/i)).toBeVisible();
  await app.screenshot('02-forensic-loker-switched');

  // Test dynamic indication change: Enter a benign/safe message
  await inputArea.fill('Halo Bu Siti, laporan keuangan triwulan sudah kami kirimkan via email kantor ya. Selamat beristirahat.');
  const analyzeBtn = screen.getByRole('button', 'Pindai & Bedah Pesan');
  await analyzeBtn.tap();

  // Verify indication dynamically changed to LOW / AMAN
  await expect(screen.getByText(/Indikator Kecurigaan Rendah \(Aman\)/i)).toBeVisible();
  await app.screenshot('03-forensic-indication-changed-to-safe');

  // -------------------------------------------------------------
  // FITUR 2: PRIVACY SCRUBBER (CANVAS REDACTOR)
  // -------------------------------------------------------------
  const sensorTab = screen.getByRole('tab', 'Sensor Privasi');
  await sensorTab.tap();
  await expect(screen.getByText('Sensor Privasi Gambar')).toBeVisible();
  await expect(screen.getByRole('button', 'Reset Sampel')).toBeVisible();
  await app.screenshot('04-privacy-scrubber-view');

  // -------------------------------------------------------------
  // FITUR 3: UNIFIED LEARN (SIMULASI PENIPU & ASISTEN FORENSIK AI)
  // -------------------------------------------------------------
  // Navigate to 2. Learn (Simulasi & Asisten AI) via sidebar
  const simulasiNav = screen.getByRole('button', /2\. Learn/i);
  await simulasiNav.tap();

  // 3A. Verify Simulator Mode (WhatsApp Roleplay & Scammer Telemetry)
  await expect(screen.getByText('1. Simulasi Penipu (WhatsApp Roleplay)')).toBeVisible();
  await expect(screen.getByText('2. Konsultasi Asisten Forensik AI (Live)')).toBeVisible();
  await expect(screen.getByText('LIVE SCAMMER TELEMETRY X-RAY')).toBeVisible();
  await app.screenshot('05-learn-simulator-initial');

  // Interact with Scammer in Simulator
  const criticalChoice = screen.getByRole('button', /Loh katanya kerja freelance kak/i);
  if ((await criticalChoice.count()) > 0) {
    await criticalChoice.tap();
  } else {
    const chatInput = screen.getByPlaceholder(/Ketik balasan bebas Anda ke penipu/i);
    await chatInput.fill('Loh kenapa harus deposit uang? Bukannya penipuan?');
    const sendBtn = screen.getByRole('button', { name: /kirim/i });
    if ((await sendBtn.count()) > 0) {
      await sendBtn.tap();
    }
  }

  // Wait for scammer response and internal thought telemetry
  await expect(screen.getByText(/Monolog Batin Pelaku/i)).toBeVisible();
  await app.screenshot('06-learn-simulator-response-verified');

  // 3B. Switch to Mode 2: Konsultasi Asisten Forensik AI (Unified in Same Module!)
  const assistantTabBtn = screen.getByRole('button', /2\. Konsultasi Asisten Forensik AI/i);
  await assistantTabBtn.tap();

  // Verify Assistant Terminal and Forensic Knowledge Panel are visible
  await expect(screen.getByRole('heading', { name: /TRASP AI FORENSIC COPILOT/i })).toBeVisible();
  await expect(screen.getByText('PANEL INTELIJEN & RUJUKAN FORENSIK')).toBeVisible();
  await expect(screen.getByText('Didukung Google AI Studio (Gemini 3.6 Flash) & Basis Regulasi Siber RI')).toBeVisible();
  await app.screenshot('07-learn-assistant-unified-view');

  // Send consultation message to the AI Assistant
  const assistantInput = screen.getByPlaceholder(/Ketik pertanyaan konsultasi atau tempel pesan penipuan/i);
  await assistantInput.fill('Apa dasar hukum penipuan online di Indonesia?');
  const assistantSend = screen.getByRole('button', 'Kirim Pesan');
  await assistantSend.tap();

  // Verify AI Assistant answered with legal & forensic guidance
  await expect(screen.getByText('Apa dasar hukum penipuan online di Indonesia?')).toBeVisible();
  await expect(screen.getByText('Pasal 28 (1) jo. Pasal 45A (1) UU ITE No. 1/2024')).toBeVisible();
  await app.screenshot('08-learn-assistant-live-reply-verified');

  // Switch back to Simulator to confirm seamless two-way state preservation
  const simulatorTabBtn = screen.getByRole('button', /1\. Simulasi Penipu/i);
  await simulatorTabBtn.tap();
  await expect(screen.getByText('LIVE SCAMMER TELEMETRY X-RAY')).toBeVisible();

  // -------------------------------------------------------------
  // FITUR 4: MITIGASI DARURAT (ACT CONTAINMENT)
  // -------------------------------------------------------------
  const mitigasiNav = screen.getByRole('button', '3. Act (Mitigasi)');
  await mitigasiNav.tap();

  await expect(screen.getByText(/Mitigasi 15 Menit/i)).toBeVisible();
  await expect(screen.getByText(/Gawat: Saya Telanjur/i)).toBeVisible();
  await expect(screen.getByText('IASC OJK (Anti Scam Centre)')).toBeVisible();
  await expect(screen.getByRole('button', 'Salin Draf Laporan Siap Kirim')).toBeVisible();
  await app.screenshot('09-mitigasi-emergency-playbook');

  // -------------------------------------------------------------
  // FITUR 5: MODE RED TEAM
  // -------------------------------------------------------------
  const redteamNav = screen.getByRole('button', '4. Red Team');
  await redteamNav.tap();

  await expect(screen.getByText('Simulasi Red Team')).toBeVisible();
  await expect(screen.getByText('100% BERTAHAN')).toBeVisible();

  // Apply a Red Team Tactic
  const panicTactic = screen.getByRole('button', /Trik Kepanikan & Batas Waktu/i);
  await panicTactic.tap();

  // Verify resistance decreased
  await expect(screen.getByText('65% BERTAHAN')).toBeVisible();
  await app.screenshot('10-redteam-tactic-executed');

  // -------------------------------------------------------------
  // FITUR 6: RESPONSIVE VERIFICATION & CLEAN NAVIGATION
  // -------------------------------------------------------------
  // Verify sidebar has no /mobile button
  const mobileSidebarLink = screen.getByText(/Mode Tampilan Mobile/i);
  expect(await mobileSidebarLink.count()).toBe(0);
  await app.screenshot('11-final-clean-responsive-verified');

  // -------------------------------------------------------------
  // VERIFIKASI SIDEBAR MINIMALIS (Kompendium telah dibersihkan)
  // -------------------------------------------------------------
  const kompendiumLink = screen.getByRole('link', /Kompendium/i);
  expect(await kompendiumLink.count()).toBe(0);
  await app.screenshot('12-clean-sidebar-verified');
});
