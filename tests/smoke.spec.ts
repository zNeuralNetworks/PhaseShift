import { expect, test } from '@playwright/test';

test('state navigation, protocol controls, preferences, and roadmap render', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Low Energy' })).toBeVisible();
  await page.getByRole('button', { name: /Activate/ }).click();
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible();
  await page.getByRole('button', { name: 'Pause' }).click();
  await page.getByLabel('Reset protocol').click();

  await page.getByRole('button', { name: /Need focus/ }).click();
  await expect(page.getByRole('heading', { name: 'Deep Work' })).toBeVisible();
  await page.getByRole('button', { name: /Single target/ }).click();
  await page.getByLabel('One target').fill('Finish smoke coverage');
  await page.getByRole('button', { name: '50 min' }).click();
  await expect(page.getByRole('button', { name: '50 min' })).toHaveClass(/ps-pill-accent/);

  await page.getByRole('button', { name: /OLED midnight mode/ }).click();
  await expect(page.locator('html')).toHaveAttribute('data-ps-theme', 'midnight');

  await page.getByRole('button', { name: /Roadmap/ }).click();
  await expect(page.getByRole('heading', { name: 'PhaseShift Roadmap' })).toBeVisible();
  await expect(page.getByText('Protocol Engine v1')).toBeVisible();
  await expect(page.getByText('Playwright Smoke Tests')).toBeVisible();
});
