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

test('opens a shared link on the right lens and lets the URL beat the saved role', async ({
  page,
}) => {
  // This test performs three full page loads of the animated home page; under
  // the parallel e2e suite a cold start can exceed the default 30s budget.
  test.setTimeout(60_000);
  // Content assertions follow each navigation, so DOM-ready is the right wait;
  // the full `load` event (fonts, posters) stalls under parallel test workers.
  await page.goto('/?role=frontend', { waitUntil: 'domcontentloaded' });
  await expect(
    page.getByText('I turn complex product logic into a simple, intuitive interface.'),
  ).toBeVisible();
  await expect(
    page.getByText(
      'I connect the model, interface, and infrastructure into one coherent product.',
    ),
  ).toHaveCount(0);

  await page.goto('/?role=ai', { waitUntil: 'domcontentloaded' });
  await expect(
    page.getByText(
      'I connect the model, interface, and infrastructure into one coherent product.',
    ),
  ).toBeVisible();

  // A saved preference must not override an explicit URL role.
  await page.getByRole('button', { name: 'Frontend Developer' }).click();
  await expect(page).toHaveURL(/\/\?role=frontend$/);
  await page.goto('/?role=ai', { waitUntil: 'domcontentloaded' });
  await expect(
    page.getByText(
      'I connect the model, interface, and infrastructure into one coherent product.',
    ),
  ).toBeVisible();
});

test('manual toggle updates content, URL, and store without reload or a new history entry', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(
    page.getByText(
      'I connect the model, interface, and infrastructure into one coherent product.',
    ),
  ).toBeVisible();

  const historyBefore = await page.evaluate(() => history.length);
  const navigationType = await page.evaluate(
    () => performance.getEntriesByType('navigation')[0]?.type,
  );

  await page.getByRole('button', { name: 'Frontend Developer' }).click();
  await expect(
    page.getByText('I turn complex product logic into a simple, intuitive interface.'),
  ).toBeVisible();
  await expect(page).toHaveURL(/\/\?role=frontend$/);
  await expect(
    page.locator('[data-role-switch] button', { hasText: 'Frontend Developer' }),
  ).toHaveAttribute('aria-pressed', 'true');

  // replace() — same history depth, same navigation record, no reload.
  expect(await page.evaluate(() => history.length)).toBe(historyBefore);
  expect(
    await page.evaluate(() => performance.getEntriesByType('navigation')[0]?.type),
  ).toBe(navigationType);

  // The preference is persisted for plain-link visits.
  const stored = await page.evaluate(() => localStorage.getItem('portfolio-preferences'));
  expect(stored).toContain('"role":"frontend"');
});

test('ignores an invalid role value and falls back to the saved or default role', async ({
  page,
}) => {
  await page.goto('/?role=designer', { waitUntil: 'domcontentloaded' });
  await expect(
    page.getByText(
      'I connect the model, interface, and infrastructure into one coherent product.',
    ),
  ).toBeVisible();
  await expect(
    page.getByText('I turn complex product logic into a simple, intuitive interface.'),
  ).toHaveCount(0);

  // Case-sensitive match, so a wrongly-cased value is ignored too.
  await page.goto('/?role=Frontend', { waitUntil: 'domcontentloaded' });
  await expect(
    page.getByText(
      'I connect the model, interface, and infrastructure into one coherent product.',
    ),
  ).toBeVisible();

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
});

test('keeps the chosen lens through project navigation and back', async ({ page }) => {
  // The card opens the case on its final Task / Result anchor; reduced motion
  // makes that landing and the back-navigation instant and deterministic.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('button', { name: 'Frontend Developer' }).click();
  await expect(page).toHaveURL(/\/\?role=frontend$/);

  // Project links drop the query; the store keeps the lens.
  await page
    .locator('a[href="/projects/bitrix24-integrations#case-summary"]')
    .first()
    .click();
  await expect(page).toHaveURL(/\/projects\/bitrix24-integrations#case-summary$/);
  await expect(page.getByRole('tabpanel')).toContainText(
    'Built handler and robot tables',
  );

  await page.getByRole('link', { name: 'Back to overview' }).click();
  // The case study has its own h1 too, so confirm the home route before the
  // headline assertion — otherwise a slow SPA render under load fails the wait.
  await expect(page).toHaveURL('/');
  await expect(
    page.getByText('I turn complex product logic into a simple, intuitive interface.'),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
});

test('exposes the labeled module in RU and EN with keyboard activation and focus ring', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByText('Portfolio focus')).toBeVisible();
  await expect(
    page.getByText(
      'Projects, experience, and approach below adapt to the selected role.',
    ),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'AI Developer' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await page.getByRole('button', { name: 'RU' }).click();
  await expect(page.getByText('Фокус портфолио')).toBeVisible();
  await expect(
    page.getByText('Проекты, опыт и подход ниже адаптируются под выбранную роль.'),
  ).toBeVisible();

  // Keyboard activation: Tab to the Frontend segment (real focus, so the
  // :focus-visible ring applies), then press Enter.
  const feSegment = page.getByRole('button', { name: 'Frontend-разработчик' });
  for (let i = 0; i < 40; i += 1) {
    await page.keyboard.press('Tab');
    const isFe = await page.evaluate(() => {
      const el = document.activeElement;
      return (
        (el?.classList.contains('role-segment') &&
          el.textContent?.includes('Frontend-разработчик')) ??
        false
      );
    });
    if (isFe) break;
  }
  const focused = await page.evaluate(() => {
    const el = document.activeElement;
    return {
      isFe: el?.textContent?.includes('Frontend-разработчик') ?? false,
      outline: el ? getComputedStyle(el).outlineStyle : '',
    };
  });
  expect(focused.isFe).toBe(true);
  expect(focused.outline).not.toBe('none');
  await page.keyboard.press('Enter');
  await expect(feSegment).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/role=frontend/);
});

test('keeps the role module clear of the hero name and inside the viewport', async ({
  page,
}, testInfo) => {
  // Freeze entrance animations so geometry is measured at rest.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const module = page.locator('[data-role-switch]');
  await expect(module).toBeVisible();
  await expect(module.locator('.role-switch-caption')).toBeVisible();

  if (testInfo.project.name === 'chromium') {
    const moduleBox = (await module.boundingBox())!;
    const nameBox = (await page.locator('[data-hero-name]').boundingBox())!;
    const overlapX =
      moduleBox.x < nameBox.x + nameBox.width &&
      moduleBox.x + moduleBox.width > nameBox.x;
    const overlapY =
      moduleBox.y < nameBox.y + nameBox.height &&
      moduleBox.y + moduleBox.height > nameBox.y;
    expect(overlapX && overlapY).toBe(false);

    const viewport = page.viewportSize()!;
    expect(moduleBox.x).toBeGreaterThanOrEqual(0);
    expect(moduleBox.x + moduleBox.width).toBeLessThanOrEqual(viewport.width);
    expect(moduleBox.y).toBeGreaterThanOrEqual(0);
  }
});

test('hands the active role to Bob for the chat request', async ({ page }) => {
  let sentRole: string | undefined;
  await page.route('**/api/bob/config', (route) =>
    route.fulfill({ json: { turnstileSiteKey: null } }),
  );
  await page.route('**/api/chat', (route) => {
    sentRole = route.request().postDataJSON()?.role as string;
    return route.fulfill({
      status: 200,
      contentType: 'text/event-stream',
      body: answerStream,
    });
  });

  await page.goto('/?role=frontend');
  await page.getByRole('button', { name: 'Open chat with Bob' }).click();
  const dialog = page.getByRole('dialog');
  await dialog
    .getByPlaceholder(/which projects demonstrate/i)
    .fill('Which projects fit a Frontend role?');
  await dialog.getByRole('button', { name: 'Send' }).click();

  await expect.poll(() => sentRole).toBe('frontend');
});

test('recomputes the signal spine when the lens changes', async ({ page }) => {
  // SignalSpine measures five content sections after the full home layout has
  // settled. Give that layout-dependent journey the slow-test allowance when
  // the complete desktop/mobile suite is saturating the browser workers.
  test.slow();
  await page.goto('/');
  const path = page.locator('[data-signal-path-active]');
  await expect.poll(() => path.getAttribute('d'), { timeout: 30_000 }).not.toBe('M 0 0');
  const spineBefore = await path.getAttribute('d');

  await page.getByRole('button', { name: 'Frontend Developer' }).click();
  await expect(page.getByRole('button', { name: 'Frontend Developer' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect
    .poll(() => path.getAttribute('d'), { timeout: 30_000 })
    .not.toBe(spineBefore);
});
