import { expect, test } from '@playwright/test';

const answerStream = [
  'event: sources',
  'data: {"type":"sources","sources":[{"id":"p1","title":"Read-Close-Bot","type":"project","href":"/projects/read-close-bot"}]}',
  '',
  'event: delta',
  'data: {"type":"delta","text":"Verified evidence: the agent runs on Cloudflare Workers [1]."}',
  '',
  'event: done',
  'data: {"type":"done","requestId":"test-request"}',
  '',
].join('\n');

test('Bob opens on every route, streams grounded answers, and restores focus', async ({
  page,
}) => {
  await page.route('**/api/bob/config', (route) =>
    route.fulfill({ json: { turnstileSiteKey: null } }),
  );
  await page.route('**/api/chat', (route) =>
    route.fulfill({ status: 200, contentType: 'text/event-stream', body: answerStream }),
  );
  await page.goto('/projects/read-close-bot');
  const launcher = page.getByRole('button', { name: 'Open chat with Bob' });
  await launcher.click();
  const dialog = page.getByRole('dialog', { name: 'Bob — portfolio assistant' });
  await expect(dialog).toBeVisible();
  await dialog.getByPlaceholder(/which projects demonstrate/i).fill('Cloudflare?');
  await dialog.getByRole('button', { name: 'Send' }).click();
  await expect(dialog).toContainText('Verified evidence');
  const sourceLink = dialog.getByRole('link', { name: /Read-Close-Bot/ });
  await expect(sourceLink).toBeHidden();
  await dialog.getByText('Sources · 1').click();
  await expect(sourceLink).toHaveAttribute('href', '/projects/read-close-bot');
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(launcher).toBeFocused();
});

test('Bob supports vacancy mode, localization, mobile layout, and honest no-evidence', async ({
  page,
}, testInfo) => {
  await page.route('**/api/bob/config', (route) =>
    route.fulfill({ json: { turnstileSiteKey: null } }),
  );
  await page.route('**/api/chat', (route) =>
    route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ error: { code: 'no_evidence', message: 'No evidence' } }),
    }),
  );
  await page.goto('/');
  await page.getByRole('button', { name: 'RU' }).click();
  await page.getByRole('button', { name: 'Открыть чат с Бобом' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Проверить вакансию' }).click();
  await dialog
    .getByPlaceholder(/описание вакансии/i)
    .fill('Нужен пилот межгалактического корабля');
  await dialog.getByRole('button', { name: 'Отправить' }).click();
  await expect(dialog).toContainText('нет подтверждённых данных');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
  if (testInfo.project.name === 'mobile-chromium') {
    const box = await dialog.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(page.viewportSize()!.width - 1);
    expect(box!.height).toBeGreaterThanOrEqual(page.viewportSize()!.height - 1);
  }
});

test('Bob keeps the interface calm and uses the dialog border as its wait state', async ({
  page,
}, testInfo) => {
  let releaseResponse: (() => void) | undefined;
  const responseGate = new Promise<void>((resolve) => {
    releaseResponse = resolve;
  });
  await page.route('**/api/bob/config', (route) =>
    route.fulfill({ json: { turnstileSiteKey: null } }),
  );
  await page.route('**/api/chat', async (route) => {
    await responseGate;
    await route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      body: answerStream,
    });
  });
  if (testInfo.project.name === 'mobile-chromium') {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  }
  await page.goto('/');

  await expect(page.locator('[data-bob-mark]')).toHaveCount(2);
  await page.getByRole('button', { name: 'Open chat with Bob' }).click();
  const dialog = page.getByRole('dialog', { name: 'Bob — portfolio assistant' });
  await expect(dialog.getByRole('button', { name: 'Ask a question' })).toHaveCount(0);
  await expect(dialog).not.toContainText('AI / GROUNDED');

  const vacancyMode = dialog.getByRole('button', { name: 'Check a vacancy' });
  await vacancyMode.click();
  await expect(dialog.getByPlaceholder(/vacancy description/i)).toHaveAttribute(
    'maxlength',
    '12000',
  );
  await dialog.getByRole('button', { name: 'Vacancy mode' }).click();
  const composer = dialog.getByPlaceholder(/which projects demonstrate/i);
  await expect(composer).toHaveAttribute('maxlength', '2000');

  await composer.fill('Cloudflare?');
  await dialog.getByRole('button', { name: 'Send' }).click();
  await expect(dialog).toHaveClass(/bob-dialog--streaming/);
  await expect(dialog.locator('.bob-progress')).toHaveCount(0);
  const borderAnimation = await dialog.evaluate(
    (element) => getComputedStyle(element, '::before').animationName,
  );
  expect(borderAnimation).toBe(
    testInfo.project.name === 'mobile-chromium' ? 'none' : 'bob-border-orbit',
  );
  releaseResponse?.();
  await expect(dialog).not.toHaveClass(/bob-dialog--streaming/);
  await expect(dialog.locator('[data-bob-mark]')).toHaveCount(2);
  await expect(page.locator('[data-bob-mark]')).toHaveCount(4);
});
