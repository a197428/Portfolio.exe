import { expect, test, type Page } from '@playwright/test';

// Every home card now targets the final "Task / Result" block via a stable
// anchor. These tests verify the unified opening behavior: card clicks land on
// the summary, clean URLs open from the top, locale switches keep the reading
// position, and Back/Forward behave natively.
const CARD_HREF = {
  bitrix: '/projects/bitrix24-integrations#case-summary',
  local: '/projects/local-ai-assistant#case-summary',
  shortSport: '/projects/shortsport-ai-forge#case-summary',
  readCloseBot: '/projects/read-close-bot#case-summary',
  videoTranscriber: '/projects/video-sut#case-summary',
  todo: '/projects/todo-app#case-summary',
  neurosportTma: '/projects/neurosport-tma#case-summary',
  neurosport: '/projects/neurosport#case-summary',
  neuralGrid: '/projects/neuralgrid-international#case-summary',
  energoAi: '/projects/energo-ai#case-summary',
} as const;

async function openCard(page: Page, href: string) {
  const card = page.locator(`#projects a[href="${href}"]`);
  await expect(card).toBeVisible();
  // Let Playwright bring the card into view and click it. Reduced motion makes
  // the app's smooth scrolls instant, so the click never races an animation —
  // and unlike a manual one-shot scrollIntoView, the actionability scroll is
  // not overridden by native scroll restoration after a Back navigation.
  await card.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.locator('#case-summary')).toBeInViewport();
}

async function openFromCard(page: Page, href: string) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await openCard(page, href);
}

// Click a top-bar locale segment the way a mouse user would: the DOM click
// carries no keyboard-focus scroll, so it never nudges the reading position.
async function clickLocale(page: Page, code: 'RU' | 'EN') {
  await page.evaluate((label) => {
    const button = Array.from(
      document.querySelectorAll<HTMLButtonElement>('.topbar button.segment'),
    ).find((el) => el.textContent?.trim().toUpperCase() === label);
    // Focus without scrolling first, so the subsequent click's implicit focus
    // is a no-op and the top-bar segment never drags the viewport to the top.
    button?.focus({ preventScroll: true });
    button?.click();
  }, code);
}

// The summary is the final meaningful block of the case study, carries the
// anchor and the locale-aware Task / Result label, and leaves breathing room
// at the top via scroll-margin.
async function expectSummaryStructure(page: Page, labels: [string, string]) {
  const summary = page.locator('#case-summary');
  await expect(summary).toBeVisible();
  await expect(summary).toHaveAttribute('aria-label', 'Task / Result');
  const eyebrow = summary.locator('.card-eyebrow');
  await expect(eyebrow.nth(0)).toHaveText(labels[0]);
  await expect(eyebrow.nth(1)).toHaveText(labels[1]);
  const scrollMargin = await summary.evaluate(
    (el) => getComputedStyle(el).scrollMarginTop,
  );
  expect(scrollMargin).not.toBe('0px');

  const isLast = await summary.evaluate((el) => {
    const article = el.closest('.case-detail');
    const sections = Array.from(article!.querySelectorAll('section'));
    return sections[sections.length - 1] === el;
  });
  expect(isLast).toBe(true);
}

test.describe('unified card opening to Task / Result', () => {
  // Reduced motion freezes the app's smooth scrolls (CSS scroll-behavior and
  // the ProjectPage effect both honor prefers-reduced-motion), so scroll
  // positions are measured at rest instead of mid-animation.
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('AI lens: short, medium, and long cases all land on the summary', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-chromium', 'desktop-only');
    for (const href of [CARD_HREF.shortSport, CARD_HREF.readCloseBot, CARD_HREF.bitrix]) {
      await openFromCard(page, href);
      await expectSummaryStructure(page, ['Task', 'Outcome']);
    }
  });

  test('long Local AI Assistant case lands on the summary', async ({ page }) => {
    await openFromCard(page, CARD_HREF.local);
    await expectSummaryStructure(page, ['Task', 'Outcome']);
  });

  test('Frontend lens cards land on the summary too', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Frontend Developer' }).click();
    await expect(
      page.getByText('Engineering the moment a product clicks.'),
    ).toBeVisible();

    // Load the Frontend home once and use Back between cards instead of three
    // full reloads, so the suite stays stable under parallel workers.
    for (const [index, href] of [
      CARD_HREF.todo,
      CARD_HREF.neuralGrid,
      CARD_HREF.energoAi,
    ].entries()) {
      if (index > 0) {
        await page.goBack({ waitUntil: 'domcontentloaded' });
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        await expect(page.locator(`#projects a[href="${href}"]`)).toBeVisible();
      }
      await openCard(page, href);
      await expectSummaryStructure(page, ['Task', 'Outcome']);
    }
  });

  test('clean project URL opens from the top regardless of a previous SPA position', async ({
    page,
  }) => {
    // Direct clean navigation from a cold load starts at scrollY 0.
    await page.goto('/projects/bitrix24-integrations', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/projects\/bitrix24-integrations$/);
    expect(await page.evaluate(() => window.scrollY)).toBe(0);

    // Even when the home page was scrolled far down, a clean URL transition
    // must land at the top, not carry the previous SPA position.
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.goto('/projects/bitrix24-integrations', { waitUntil: 'domcontentloaded' });
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
  });

  test('locale switch inside a project does not reset the reading position', async ({
    page,
  }) => {
    await page.goto('/projects/bitrix24-integrations', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByRole('heading', { name: 'Industrial Bitrix24 integrations' }),
    ).toBeVisible();
    await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(800);

    await clickLocale(page, 'RU');
    await expect(page.locator('#case-summary .card-eyebrow').first()).toHaveText(
      'Задача',
    );

    // The switch must not snap back to the top (clean-URL branch re-run would
    // scrollTo 0) nor jump to the summary; the reading position is preserved.
    const { after, summaryTop, viewportH } = await page.evaluate(() => ({
      after: window.scrollY,
      summaryTop: document.getElementById('case-summary')!.getBoundingClientRect().top,
      viewportH: window.innerHeight,
    }));
    expect(after).toBeGreaterThan(0);
    expect(summaryTop).toBeGreaterThan(viewportH * 0.5);
  });

  test('Back restores the home scroll, Forward returns to the summary', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-chromium', 'desktop-only');
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(800);

    await page.locator(`#projects a[href="${CARD_HREF.bitrix}"]`).click();
    await expect(page.locator('#case-summary')).toBeInViewport();

    await page.goBack({ waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => window.scrollY), { timeout: 10_000 })
      .toBeGreaterThan(400);

    await page.goForward({ waitUntil: 'domcontentloaded' });
    await expect(page.locator('#case-summary')).toBeInViewport();
  });

  test('mobile: card lands on the summary without horizontal overflow', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile-only');
    await openFromCard(page, CARD_HREF.bitrix);
    await expectSummaryStructure(page, ['Task', 'Outcome']);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);
  });

  test('keyboard activation opens the summary', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-chromium', 'desktop-only');
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const card = page.locator(`#projects a[href="${CARD_HREF.shortSport}"]`);
    await card.focus();
    await expect(card).toBeFocused();
    await card.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${CARD_HREF.shortSport}$`));
    await expect(page.locator('#case-summary')).toBeInViewport();
  });
});
