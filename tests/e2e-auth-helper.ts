/**
 * Reusable E2E Authentication Helper for HERO Login
 * 
 * Standard System Credentials:
 * - Username / NIK / SN: 71261
 * - Password: Chitra#71261
 */
export async function loginToHero(app: any, screen: any, browser?: any) {
  try {
    const usernameInput =
      screen.getByPlaceholder(/username|nik|sn/i) ||
      screen.getByLabel(/username|nik|sn/i) ||
      screen.getByRole('textbox', { name: /username|nik|sn/i });

    const passwordInput =
      screen.getByPlaceholder(/password|kata sandi/i) ||
      screen.getByLabel(/password|kata sandi/i);

    if ((await usernameInput.count()) > 0) {
      await usernameInput.fill('71261');
      await passwordInput.fill('Chitra#71261');
      
      const submitBtn = screen.getByRole('button', {
        name: /masuk|login|sign in/i,
      });
      if ((await submitBtn.count()) > 0) {
        await submitBtn.click();
      }
    }
  } catch {
    // If login is already satisfied or not required on this screen, continue gracefully
  }
}
