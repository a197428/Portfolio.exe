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
  await expect(page.getByRole('tabpanel')).toContainText(
    'Built handler and robot tables',
  );
  await page.getByRole('tab', { name: /ApartSharing/ }).click();
  await expect(page.getByRole('tabpanel')).toContainText(
    'Map CRM fields, lead sources, and apartments',
  );
  await page.getByRole('tab', { name: /TTLock Connector/ }).click();
  await expect(page.getByRole('tabpanel')).toContainText('Manage accounts, smart locks');
  await expect(page.getByRole('tabpanel')).toContainText('Production UI');
  await expect(page.getByRole('tabpanel')).toContainText('All 11 component tests');
  await expect(page.locator('video')).toHaveAttribute(
    'src',
    '/media/bitrix24-ttlock.mp4',
  );
  await expect(page.locator('video')).toHaveAttribute(
    'poster',
    '/media/bitrix24-ttlock-poster.webp',
  );
  await expect(page.locator('a[href*="github.com/a197428"]')).toHaveCount(0);

  await page.getByRole('button', { name: 'RU' }).click();
  await expect(page.getByRole('tabpanel')).toContainText(
    'Все 11 component-тестов публичного снимка проходят',
  );

  await page.getByRole('link', { name: /Вернуться к обзору/ }).click();
  await page.getByRole('button', { name: 'AI-разработчик' }).click();
  await page.locator('a[href="/projects/bitrix24-integrations"]').first().click();
  await page.getByRole('tab', { name: /TTLock Connector/ }).click();
  await expect(page.getByRole('tabpanel')).toContainText(
    'Спроектировал Production UI как проверяемую границу будущей интеграции',
  );
});

test('has no horizontal overflow on the home page', async ({ page }) => {
  await page.goto('/');
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflows).toBe(false);
});
