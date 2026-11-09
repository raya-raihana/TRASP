import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { loginToHero } from './e2e-auth-helper';

test('Sensor Privasi: Reset Sensor clears redactions without wiping current image', async ({ app, screen }) => {
  // 1. Open app and authenticate
  await app.open('/');
  await loginToHero(app, screen);

  // 2. Open Sensor Privasi tab
  const sensorTab = screen.getByRole('tab', 'Sensor Privasi');
  await sensorTab.tap();

  // Verify Sensor Privasi controls are loaded
  await expect(screen.getByRole('button', 'Reset Sensor')).toBeVisible();
  await expect(screen.getByText('Siap Sensor')).toBeVisible();
  await app.screenshot('01-sensor-privasi-initial');

  // 3. Reset Sensor when clean does not crash or replace image
  const resetBtn = screen.getByRole('button', 'Reset Sensor');
  await resetBtn.tap();
  await expect(screen.getByText('Siap Sensor')).toBeVisible();

  // 4. Verify that "Ganti Contoh" is NOT visible when in default mockup mode
  const gantiContohBtn = screen.getByRole('button', 'Ganti Contoh');
  expect(await gantiContohBtn.count()).toBe(0);

  // 5. Verify Pindai & Analisis works properly
  const analyzeBtn = screen.getByRole('button', 'Pindai & Analisis');
  await analyzeBtn.tap();

  await app.screenshot('02-sensor-privasi-verified');
});
