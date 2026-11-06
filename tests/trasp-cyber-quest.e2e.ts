import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { loginToHero } from './e2e-auth-helper';

test('TRASP Cyber Quest: Independent Progress Tracking (Defense vs Offense) & Mission Differentiation', async ({ app, screen }) => {
  // 1. Open Workbench
  await app.open('/');
  await loginToHero(app, screen);

  // 2. Navigate to Learn tab
  const learnNav = screen.getByRole('button', 'Learn');
  await learnNav.tap();

  // 3. Verify HUD Header & Initial Defense Mode Progress
  await expect(screen.getByRole('heading', { name: /Kampanye Investigasi Forensik/i })).toBeVisible();
  await expect(screen.getByText(/Cyber Sentinel \(Tier II\)/i)).toBeVisible();
  await expect(screen.getByText(/Integritas:/i)).toBeVisible();
  // Defense initial progress: Level 1/10 Selesai (7%), 100 XP
  await expect(screen.getByText(/Level 1\/10 Selesai/i)).toBeVisible();
  await expect(screen.getByText(/Undangan & Resi Kurir \.APK/i)).toBeVisible();
  await app.screenshot('quest-01-defense-initial-hud');

  // 4. Verify Sector Chapter Dividers in roadmap
  await expect(screen.getByText(/Sektor 1: Social Engineering/i)).toBeVisible();
  await expect(screen.getByText(/Sektor 2: Network & Phishing/i)).toBeVisible();
  await expect(screen.getByText(/Sektor 3: Deepfake & AI/i)).toBeVisible();

  // 5. Switch to Red Team (Offense Mode) & Verify Independent Zero-Progress
  const redTeamBtn = screen.getByRole('button', 'Red Team');
  await redTeamBtn.tap();
  await expect(screen.getByText(/Ghost Operator \(Tier II\)/i)).toBeVisible();
  await expect(screen.getByText(/Simulasi Red Team/i)).toBeVisible();
  // Offense has independent 0 XP and 0/10 Selesai (0%)
  await expect(screen.getByText(/Level 0\/10 Selesai \(0%\)/i)).toBeVisible();
  // Offense specific mission title
  await expect(screen.getByText(/Dropper Pretexting Resi \.APK/i)).toBeVisible();
  await app.screenshot('quest-02-red-team-zero-progress-isolated');

  // 6. Switch back to Defense Mode & Verify Defense Progress Preserved
  const defenseBtn = screen.getByRole('button', 'Defense');
  await defenseBtn.tap();
  await expect(screen.getByText(/Cyber Sentinel \(Tier II\)/i)).toBeVisible();
  await expect(screen.getByText(/Level 1\/10 Selesai/i)).toBeVisible();
  await expect(screen.getByText(/Undangan & Resi Kurir \.APK/i)).toBeVisible();
  await app.screenshot('quest-03-defense-progress-preserved');

  // 7. Test Checkpoint: Mini-Quiz (Level 3)
  const quizNode = screen.getByRole('button', /QUIZ/i);
  await quizNode.tap();

  // Verify Mini-Quiz Modal is opened with Defense specific questions
  await expect(screen.getByRole('heading', { name: /Mini-Quiz: Izin Aksesibilitas/i })).toBeVisible();
  await app.screenshot('quest-04-quiz-defense-modal');

  // Close the quiz modal
  const closeQuizBtn = screen.getByRole('button', 'Tutup');
  await closeQuizBtn.tap();

  // 8. Test Playing Level 2 (Play Now node)
  const level2Btn = screen.getByRole('button', /PLAY NOW.*02|02.*PLAY NOW/i);
  await level2Btn.tap();

  // Verify Simulator Phone View opened
  await expect(screen.getByText(/Level 02: Undangan Pernikahan \.APK/i)).toBeVisible();
  await expect(screen.getByRole('heading', { name: /Kerabat Palsu/i })).toBeVisible();
  await expect(screen.getByText('09:41')).toBeVisible();
  await expect(screen.getByText(/Integritas Saldo & Data:/i)).toBeVisible();
  await expect(screen.getByText(/Tingkat Tekanan Psikologis:/i)).toBeVisible();
  await expect(screen.getByRole('textbox')).toBeVisible();
  await app.screenshot('quest-05-level2-arena-phone-mockup');

  // 9. Test Block & Report Action (Debrief Trigger)
  const blockBtn = screen.getByRole('button', /Blokir & Laporkan Kasus/i);
  await blockBtn.tap();

  // Verify Debrief Modal Screen
  await expect(screen.getByRole('heading', { name: /Debrief Forensik: Kasus #2/i })).toBeVisible();
  await expect(screen.getByText(/ANCAMAN DINETRALISIR DENGAN SUKSES/i)).toBeVisible();
  await expect(screen.getByText(/UU ITE No\. 1\/2024/i)).toBeVisible();
  await app.screenshot('quest-06-debrief-modal');

  // Close debrief modal via close button
  const closeDebriefBtn = screen.getByRole('button', { name: 'Tutup Debrief' });
  await closeDebriefBtn.tap();

  // 10. Test Back to Roadmap
  const backToRoadmapBtn = screen.getByRole('button', 'Kembali ke Katalog');
  await backToRoadmapBtn.tap();
  await expect(screen.getByRole('heading', { name: /Kampanye Investigasi Forensik/i })).toBeVisible();
  await app.screenshot('quest-07-back-to-roadmap');
});
