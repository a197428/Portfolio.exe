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

// The lens hero headlines that identify the active role after returning home.
const AI_HEADLINE_EN =
  'I connect the model, interface, and infrastructure into one coherent product.';
const FRONTEND_HEADLINE_EN =
  'I turn complex product logic into a simple, intuitive interface.';

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

// Return home the way a user does — through the case's own overview link — so
// the lens survives (the store keeps it) without a full reload or a goBack's
// scroll-restoration race, which can leave a card unstable to click under load.
async function returnHomeViaOverview(page: Page, heroHeadline: string) {
  await page.getByRole('link', { name: 'Back to overview' }).click();
  // The case study also has its own h1, so pin the wait to the home route
  // itself: under load a slow SPA render lets an h1 check pass against the
  // project page while the home headline is still absent.
  await expect(page).toHaveURL('/');
  await expect(page.getByText(heroHeadline)).toBeVisible({ timeout: 10_000 });
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
    // One cold load, then the app's own overview link between cases: opening
    // three cards from fresh full reloads exhausts memory under the parallel
    // suite, while in-app navigation still exercises each card click.
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText(AI_HEADLINE_EN)).toBeVisible();
    for (const href of [CARD_HREF.shortSport, CARD_HREF.readCloseBot, CARD_HREF.bitrix]) {
      await openCard(page, href);
      await expectSummaryStructure(page, ['Task', 'Outcome']);
      if (href !== CARD_HREF.bitrix) {
        await returnHomeViaOverview(page, AI_HEADLINE_EN);
      }
    }
  });

  test('long Local AI Assistant case lands on the summary', async ({ page }) => {
    await openFromCard(page, CARD_HREF.local);
    await expectSummaryStructure(page, ['Task', 'Outcome']);
  });

  test('Frontend lens cards land on the summary too', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'Frontend Developer' }).click();
    await expect(page.getByText(FRONTEND_HEADLINE_EN)).toBeVisible();

    // Load the Frontend home once; return between cards through the app's own
    // overview link. Unlike a goBack, that push navigation carries no native
    // scroll restoration, so the next card is instantly stable to click under
    // parallel workers.
    for (const href of [CARD_HREF.todo, CARD_HREF.neuralGrid, CARD_HREF.energoAi]) {
      await openCard(page, href);
      await expectSummaryStructure(page, ['Task', 'Outcome']);
      if (href !== CARD_HREF.energoAi) {
        await returnHomeViaOverview(page, FRONTEND_HEADLINE_EN);
      }
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
    // Bring the card into view — unlike a fixed scrollTo(800), this waits for
    // the layout to be tall enough under load, so the deep position is real.
    const card = page.locator(`#projects a[href="${CARD_HREF.bitrix}"]`);
    await expect(card).toBeVisible();
    await card.scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);

    await card.click();
    await expect(page.locator('#case-summary')).toBeInViewport();

    // The home entry was scrolled deep, so native restoration brings it back.
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
