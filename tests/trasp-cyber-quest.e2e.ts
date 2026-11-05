import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { loginToHero } from './e2e-auth-helper';

test('TRASP Cyber Quest: 10-Level Campaign Roadmap, Dual-Mode & Interactive Drill', async ({ app, screen }) => {
  // 1. Open Workbench
  await app.open('/');
  await loginToHero(app, screen);

  // 2. Navigate to Learn tab
  const learnNav = screen.getByRole('button', 'Learn');
  await learnNav.tap();

  // 3. Verify HUD Header & Roadmap Container
  await expect(screen.getByRole('heading', { name: /Kampanye Investigasi Forensik/i })).toBeVisible();
  await expect(screen.getByText(/Cyber Sentinel \(Tier II\)/i)).toBeVisible();
  await expect(screen.getByText(/Integritas:/i)).toBeVisible();
  await app.screenshot('quest-01-hud-and-roadmap');

  // 4. Verify Sector Filter Tabs
  await expect(screen.getByRole('button', 'Semua Sektor (10 Level)')).toBeVisible();
  await expect(screen.getByRole('button', /Sektor 1: Social Engineering/i)).toBeVisible();
  await expect(screen.getByRole('button', /Sektor 2: Network & Phishing/i)).toBeVisible();
  await expect(screen.getByRole('button', /Sektor 3: Deepfake & AI/i)).toBeVisible();

  // 5. Test Dual-Mode Switch to Red Team (Offense)
  const redTeamBtn = screen.getByRole('button', 'Red Team');
  await redTeamBtn.tap();
  await expect(screen.getByText(/Ghost Operator \(Tier II\)/i)).toBeVisible();
  await expect(screen.getByText(/Simulasi Red Team/i)).toBeVisible();
  await app.screenshot('quest-02-red-team-mode');

  // Switch back to Defense Mode
  const defenseBtn = screen.getByRole('button', 'Defense');
  await defenseBtn.tap();
  await expect(screen.getByText(/Cyber Sentinel \(Tier II\)/i)).toBeVisible();

  // 6. Test Interactive Checkpoint: Mini-Quiz (Level 3)
  const quizNode = screen.getByRole('button', '📝 QUIZ');
  await quizNode.tap();

  // Verify Mini-Quiz Modal is opened
  await expect(screen.getByRole('heading', { name: /Mini-Quiz: Izin Aksesibilitas/i })).toBeVisible();
  await app.screenshot('quest-03-quiz-modal');

  // Close the quiz modal
  const closeQuizBtn = screen.getByRole('button', 'Tutup');
  await closeQuizBtn.tap();

  // 7. Test Playing Level 2 (Play Now node)
  const level2Btn = screen.getByRole('button', '💌 PLAY NOW 02');
  await level2Btn.tap();

  // Verify Simulator Phone View opened
  await expect(screen.getByText(/Level 02: Undangan Pernikahan \.APK/i)).toBeVisible();
  await expect(screen.getByRole('heading', { name: /Kerabat Palsu/i })).toBeVisible();
  await app.screenshot('quest-04-level2-simulator-active');

  // 8. Test Back to Roadmap
  const backToRoadmapBtn = screen.getByRole('button', 'Kembali ke Katalog');
  await backToRoadmapBtn.tap();
  await expect(screen.getByRole('heading', { name: /Kampanye Investigasi Forensik/i })).toBeVisible();
  await app.screenshot('quest-05-back-to-roadmap');
});
