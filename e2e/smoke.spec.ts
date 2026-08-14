import { expect, test } from '@playwright/test';

test('loads, switches role, and opens a project', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  await page.getByRole('button', { name: 'Frontend Developer' }).click();
  await expect(page.getByText('Engineering the moment a product clicks.')).toBeVisible();

  await page.locator('a[href="/projects/portfolio-exe"]').click();
  await expect(page).toHaveURL(/\/projects\/portfolio-exe$/);
  await expect(page.getByRole('heading', { name: 'Portfolio.exe' })).toBeVisible();
});

test('has no horizontal overflow on the home page', async ({ page }) => {
  await page.goto('/');
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflows).toBe(false);
});
