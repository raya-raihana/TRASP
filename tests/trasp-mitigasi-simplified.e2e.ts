import { test } from '@e2e-dev/web';
import { expect } from 'e2e';
import { loginToHero } from './e2e-auth-helper';

test('TRASP Mitigasi: Simplified Emergency Procedures, Streamlined Report Generator & Clear Juridical Review', async ({ app, screen }) => {
  // 1. Open workbench application
  await app.open('/');
  await loginToHero(app, screen);

  // 2. Navigate to Act tab
  const mitigasiNav = screen.getByRole('button', 'Act');
  await mitigasiNav.tap();

  // 3. Verify clean catalog view
  await expect(screen.getByRole('heading', { name: /Katalog Kasus & Modus Kejahatan Siber/i })).toBeVisible();
  await app.screenshot('act-01-catalog-grid');

  // 4. Click first case card
  const caseCard = screen.getByText(/Pencurian Kode SMS via File Palsu/i);
  await caseCard.tap();

  // 5. Verify single-scroll editorial view header
  await expect(screen.getByRole('heading', { name: /Pencurian Kode SMS via File Palsu \(\.APK\)/i })).toBeVisible();
  await expect(screen.getByText(/Kategori:\s*Penipuan Aplikasi Ponsel/i)).toBeVisible();
  await app.screenshot('act-02-detail-header');

  // 6. Verify Babak II: Prosedur Tanggap Darurat & 4 Elegant Numbered Steps
  await expect(screen.getByRole('heading', { name: /Prosedur Tanggap Darurat/i })).toBeVisible();
  await expect(screen.getByText(/Jika Anda terlanjur memasang aplikasi atau mengeklik file tersebut/i)).toBeVisible();
  await expect(screen.getByText(/Putus Koneksi Ponsel/i)).toBeVisible();
  await expect(screen.getByText(/Hapus Aplikasi Berbahaya/i)).toBeVisible();
  await expect(screen.getByText(/Amankan Akun Bank & Sandi/i)).toBeVisible();
  await expect(screen.getByText(/Hubungi Bank/i)).toBeVisible();
  await app.screenshot('act-03-emergency-procedure-steps');

  // 7. Verify unified bank contacts bar & official reporting portals
  await expect(screen.getByText('Pusat Bantuan Resmi Bank (24 Jam):')).toBeVisible();
  await expect(screen.getByText('1500888')).toBeVisible(); // BCA
  await expect(screen.getByText('1500017')).toBeVisible(); // BRI
  await expect(screen.getByText('14000')).toBeVisible();   // Mandiri
  await expect(screen.getByText('1500046')).toBeVisible(); // BNI

  // 8. Verify streamlined Report Generator & group warning
  await expect(screen.getByRole('button', 'Salin Draf Laporan Siap Kirim')).toBeVisible();
  await expect(screen.getByRole('button', 'Salin Pesan Peringatan')).toBeVisible();
  await app.screenshot('act-04-streamlined-report-generator');

  // 9. Verify Babak III: Tinjauan Yuridis & 3 Concise Legal Points
  await expect(screen.getByRole('heading', { name: /Tinjauan Yuridis & Landasan Hukum/i })).toBeVisible();
  await expect(screen.getByText(/Pelaku penipuan ini melanggar hukum pencurian data dan penipuan digital/i)).toBeVisible();
  await expect(screen.getByText(/1\. Pembobolan Ponsel & Data Pribadi/i)).toBeVisible();
  await expect(screen.getByText(/2\. Penipuan Digital & Pemalsuan Identitas/i)).toBeVisible();
  await expect(screen.getByText(/3\. Rekening Penampung Kejahatan/i)).toBeVisible();
  await expect(screen.getByText(/Hak Perlindungan Hukum Bagi Korban/i)).toBeVisible();
  await app.screenshot('act-05-juridical-analysis-simplified');
});
