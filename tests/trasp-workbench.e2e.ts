import { test } from '@e2e-dev/web';
import { expect } from 'e2e';

test('TRASP Workbench: Forensic Inspector, Case Switch & Privacy Scrubber', async ({ app, screen }) => {
  // 1. Open the workbench application
  await app.open('/');

  // 2. Initial state verification & Screenshot
  await expect(screen.getByText('TRASP Workbench')).toBeVisible();
  await app.screenshot('01-workbench-initial');

  // 3. Switch sample case to "Loker Freelance BUMN"
  const lokerBtn = screen.getByRole('button', 'Loker Freelance BUMN (Task Fraud)');
  await lokerBtn.tap();

  // Verify that the preset input textarea updated
  const inputArea = screen.getByRole('textbox', 'Tempel pesan mencurigakan di sini...');
  await expect(inputArea).toHaveValue(/HR BUMN Holding/i);
  await app.screenshot('02-sample-case-switched');

  // 4. Switch to "Gambar" (Privacy Scrubber) tab
  const gambarTab = screen.getByRole('tab', 'Gambar');
  await gambarTab.tap();

  // Verify Privacy Scrubber title with InfoHint indicator exists
  await expect(screen.getByText('Sensor Privasi Gambar')).toBeVisible();
  await app.screenshot('03-privacy-scrubber-view');

  // 5. Run forensic analysis
  const analyzeBtn = screen.getByRole('button', 'Periksa Indikator Forensik');
  await analyzeBtn.tap();
  await app.screenshot('04-forensic-analysis-result');
});
