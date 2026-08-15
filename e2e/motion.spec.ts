import { expect, test } from '@playwright/test';

test('reveals the accessible hero and refreshes it across role and locale changes', async ({
  page,
}) => {
  await page.goto('/');

  const heading = page.getByRole('heading', {
    level: 1,
    name: 'Interfaces that make intelligence tangible.',
  });
  await expect(heading).toBeVisible();
  await expect(heading.locator('.hero-split-word')).not.toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

  await page.getByRole('button', { name: 'Frontend Developer' }).click();
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Engineering the moment a product clicks.',
    }),
  ).toBeVisible();
  await expect(page.locator('[data-hero-title] .hero-split-word')).not.toHaveCount(0);

  await page.getByRole('button', { name: 'RU' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.locator('[data-hero-title] .hero-split-word')).not.toHaveCount(0);
});

test('applies scroll spotlight without taking ownership of card transforms', async ({
  page,
}) => {
  await page.goto('/');

  const card = page.locator('.featured-case').first();
  await card.scrollIntoViewIfNeeded();

  await expect
    .poll(() => card.evaluate((element) => element.style.filter))
    .toContain('brightness');
  await expect
    .poll(() => card.evaluate((element) => element.style.boxShadow))
    .not.toBe('');
  expect(await card.evaluate((element) => element.style.transform)).toBe('');
});

test('keeps content static when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.hero-split-word')).toHaveCount(0);

  const card = page.locator('.featured-case').first();
  expect(await card.evaluate((element) => element.style.filter)).toBe('');
  expect(await card.evaluate((element) => element.style.boxShadow)).toBe('');
});
