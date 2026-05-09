import { expect, test } from '@playwright/test';

test('loads the app and completes a lesson answer', async ({ page }) => {
  await page.addInitScript(() => {
    const clipboard = {
      writeText: async (value: string) => {
        (window as Window & { __copiedText?: string }).__copiedText = value;
      }
    };
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: clipboard
    });
  });

  await page.route('https://api.github.com/repos/baditaflorin/localingo/commits/main', async (route) => {
    await route.fulfill({
      json: {
        sha: '1234567890abcdef',
        html_url: 'https://github.com/baditaflorin/localingo/commit/1234567890abcdef',
        commit: { committer: { date: '2026-05-08T00:00:00Z' } }
      }
    });
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Localingo' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Star on GitHub/i })).toHaveAttribute(
    'href',
    'https://github.com/baditaflorin/localingo'
  );
  await expect(page.getByRole('link', { name: /PayPal/i })).toHaveAttribute(
    'href',
    'https://www.paypal.com/paypalme/florinbadita'
  );
  await expect(page.getByText(/v0\.2\.0/)).toBeVisible();

  await page.getByRole('button', { name: 'hola' }).click();
  await expect(page.getByText('Correct')).toBeVisible();
  await page.getByRole('button', { name: 'Next' }).click();
  await expect(page.getByPlaceholder('Starts with gra...')).toBeVisible();

  await page.getByRole('tab', { name: 'Settings' }).click();
  await page.getByLabel(/Learner name/i).fill('Florin');
  await page.getByLabel(/Daily goal XP/i).fill('45');
  await page.getByLabel('Voice practice').uncheck();
  await expect(page.getByText('Settings saved')).toBeVisible();

  await page.getByRole('tab', { name: 'Progress' }).click();
  await page.getByRole('button', { name: 'Copy JSON' }).click();
  await expect(page.getByText('Copied export')).toBeVisible();

  await page.getByRole('button', { name: 'Copy share link' }).click();
  const copiedText = await page.evaluate(
    () => (window as Window & { __copiedText?: string }).__copiedText ?? ''
  );
  expect(copiedText).toContain('#share=');
});
