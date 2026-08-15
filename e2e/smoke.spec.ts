import { expect, test } from '@playwright/test';

test('loads, switches role, and opens a project', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  const avatar = page.locator('img[src="/image/avatar.jpg"]');
  await expect(avatar).toBeVisible();
  await expect
    .poll(() => avatar.evaluate((image) => image.naturalWidth))
    .toBeGreaterThan(0);

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

test('presents Local AI Assistant as a bilingual AI-only evidence case', async ({
  page,
}) => {
  await page.goto('/');
  const caseLink = page.locator('a[href="/projects/local-ai-assistant"]');
  await expect(caseLink).toBeVisible();

  await caseLink.click();
  await expect(page).toHaveURL(/\/projects\/local-ai-assistant$/);
  await expect(page.getByRole('heading', { name: 'Local AI Assistant' })).toBeVisible();
  await expect(
    page.getByText('Contextual answers grounded in the active browser tab'),
  ).toBeVisible();
  await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
    'href',
    'https://github.com/a197428/local-ai-assistant-extension',
  );

  const video = page.locator('video');
  await expect(video).toHaveAttribute('src', '/media/local-ai-assistant.mp4');
  await expect(video).toHaveAttribute('poster', '/media/local-ai-assistant-poster.webp');
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => element.videoWidth))
    .toBe(1280);
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => element.videoHeight))
    .toBe(720);
  await expect
    .poll(() => video.evaluate((element: HTMLVideoElement) => element.duration))
    .toBeGreaterThan(156);

  await page.getByRole('button', { name: 'RU' }).click();
  await expect(page.getByText('Ответы по содержимому активной вкладки')).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);

  await page.getByRole('link', { name: /Вернуться к обзору/ }).click();
  await page.getByRole('button', { name: 'Frontend-разработчик' }).click();
  await expect(page.locator('a[href="/projects/local-ai-assistant"]')).toHaveCount(0);
});

test('presents the ordered bilingual Frontend evidence with safe live demos', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Frontend Developer' }).click();
  await expect(page.getByText(/Vue 3 and TypeScript/)).toBeVisible();

  const projectHrefs = await page
    .locator('#projects a[href^="/projects/"]')
    .evaluateAll((links) => links.map((link) => link.getAttribute('href')));
  expect([...new Set(projectHrefs)].slice(0, 5)).toEqual([
    '/projects/bitrix24-integrations',
    '/projects/shortsport-ai-forge',
    '/projects/neurosport',
    '/projects/neuralgrid-international',
    '/projects/energo-ai',
  ]);

  for (const slug of [
    'shortsport-ai-forge',
    'neurosport',
    'neuralgrid-international',
    'energo-ai',
  ]) {
    await page.goto(`/projects/${slug}`);
    await expect(page.locator('main img[src^="/media/"]').first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Live demo' })).toHaveAttribute(
      'target',
      '_blank',
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);
  }

  await page.getByRole('button', { name: 'RU' }).click();
  await expect(
    page.getByText('Публичный deployment доступен как live demo'),
  ).toBeVisible();
  await expect(page.locator('a[href*="github.com/a197428/EnergoAI"]')).toHaveCount(0);
});
