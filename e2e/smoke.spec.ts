import { expect, test } from '@playwright/test';

test('loads, switches role, and opens a project', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByRole('button', { name: 'Frontend Developer' }).click();
  await expect(page.getByText('Engineering the moment a product clicks.')).toBeVisible();

  await page.locator('a[href="/projects/bitrix24-integrations"]').first().click();
  await expect(page).toHaveURL(/\/projects\/bitrix24-integrations$/);
  await expect(
    page.getByRole('heading', { name: 'Industrial Bitrix24 integrations' }),
  ).toBeVisible();
  await page.getByRole('tab', { name: /TTLock Connector/ }).click();
  await expect(page.getByRole('tabpanel')).toContainText('Manage accounts, smart locks');
  await expect(page.locator('video')).toHaveAttribute(
    'src',
    '/media/bitrix24-ttlock.mp4',
  );
  await expect(page.locator('video')).toHaveAttribute(
    'poster',
    '/media/bitrix24-ttlock-poster.webp',
  );
});

test('has no horizontal overflow on the home page', async ({ page }) => {
  await page.goto('/');
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflows).toBe(false);
});
