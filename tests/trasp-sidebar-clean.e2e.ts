import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { loginToHero } from './e2e-auth-helper';

test('TRASP UI Minimalist: Kompendium Regulasi feature successfully removed', async ({ app, screen }) => {
  await app.open('/');
  await loginToHero(app, screen);

  // 1. Verify Core Navigation items exist
  await expect(screen.getByRole('button', 'Recognize')).toBeVisible();
  await expect(screen.getByRole('button', 'Learn')).toBeVisible();
  await expect(screen.getByRole('button', 'Act')).toBeVisible();
  await expect(screen.getByRole('button', 'Informasi Tim')).toBeVisible();
  await expect(screen.getByRole('button', 'Video Live')).toBeVisible();

  // 2. Verify Kompendium Regulasi is completely gone from sidebar and header
  const kompendiumSidebar = screen.getByText(/Kompendium Regulasi/i);
  expect(await kompendiumSidebar.count()).toBe(0);

  const kompendiumHeader = screen.getByRole('link', { name: /Kompendium/i });
  expect(await kompendiumHeader.count()).toBe(0);

  await app.screenshot('sidebar-clean-no-kompendium');
});
