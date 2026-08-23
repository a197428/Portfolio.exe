import { expect, test, type Page } from '@playwright/test';

// The "View project" CTA lives once in the outcome column of every case study's
// Task / Result block. Before its first use the button breathes softly (Anime.js
// holds an inline opacity on the glow while the loop runs); after that it
// scrolls the page back to the top over 900 ms, hands focus to the case title,
// and stays quiet for the rest of the visit. These tests verify the placement,
// the scroll, the glow lifecycle, reduced motion, keyboard use, and the two
// longest case studies (Bitrix24, Local AI Assistant).
const BUTTON = '[data-view-project]';
const GLOW = `${BUTTON} .view-project-glow`;
const HERO_TITLE = '.case-hero h1';

// Clean deep links land on the summary just like a card click: ProjectPage
// forces an `auto` scrollIntoView on entry, so no home-page animation races the
// measurement and the scroll position is deterministic.
const DEEP = {
  bitrix: '/projects/bitrix24-integrations#case-summary',
  local: '/projects/local-ai-assistant#case-summary',
  shortSport: '/projects/shortsport-ai-forge#case-summary',
  readCloseBot: '/projects/read-close-bot#case-summary',
} as const;

async function openSummary(page: Page, href: string) {
  await page.goto(href, { waitUntil: 'domcontentloaded' });
  await expect(page.locator('#case-summary')).toBeInViewport();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
}

async function openFromCard(page: Page, href: string) {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const card = page.locator(`#projects a[href="${href}"]`);
  await expect(card).toBeVisible();
  await card.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.locator('#case-summary')).toBeInViewport();
}

async function glowInlineOpacity(page: Page) {
  return page.locator(GLOW).evaluate((el) => (el as HTMLElement).style.opacity);
}

test('card entry still lands on Task / Result and every case has a single button', async ({
  page,
}) => {
  await openFromCard(page, DEEP.bitrix);
  await expect(page.locator('#case-summary')).toHaveAttribute(
    'aria-label',
    'Task / Result',
  );
  await expect(page.locator(`#case-summary ${BUTTON}`)).toHaveCount(1);
  await expect(page.locator(`#case-summary > div:nth-child(2) ${BUTTON}`)).toBeVisible();

  // The button appears once in every project page (short, medium, long cases).
  for (const href of [DEEP.local, DEEP.shortSport, DEEP.readCloseBot]) {
    await openSummary(page, href);
    await expect(page.locator(`#case-summary ${BUTTON}`)).toHaveCount(1);
  }
});

test('clicking scrolls smoothly to the top and focuses the title, leaving the URL and history alone', async ({
  page,
}) => {
  await openSummary(page, DEEP.bitrix);
  const startY = await page.evaluate(() => window.scrollY);

  const historyBefore = await page.evaluate(() => history.length);
  await page.locator(BUTTON).click();

  // The 900 ms animation has barely begun, so the page is not at the top yet —
  // this is the animated path, not the reduced-motion instant jump.
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  expect(startY).toBeGreaterThan(0);

  await expect(page.locator(BUTTON)).toHaveAttribute('data-viewed', 'true');
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBe(0);
  await expect(page.locator(HERO_TITLE)).toBeFocused();

  // The button is not a link: no `#case-summary` change, no history entry.
  await expect(page).toHaveURL(/\/projects\/bitrix24-integrations#case-summary$/);
  expect(await page.evaluate(() => history.length)).toBe(historyBefore);
});

test('the glow pulse runs before the click, stops after it, and RU/EN does not resume it', async ({
  page,
}) => {
  await openSummary(page, DEEP.local);

  // Anime.js is pulsing the glow: it holds an inline opacity while the loop
  // runs, and removes it when the scope reverts.
  expect(await glowInlineOpacity(page)).not.toBe('');
  await expect(page.locator(BUTTON)).toHaveAttribute('data-viewed', 'false');

  await page.locator(BUTTON).click();
  await expect(page.locator(BUTTON)).toHaveAttribute('data-viewed', 'true');
  await expect.poll(() => glowInlineOpacity(page), { timeout: 2000 }).toBe('');

  // RU/EN must not re-arm the pulse: the button is keyed on the slug, not the
  // locale, so the viewed state and the reverted scope survive the switch.
  await page.getByRole('button', { name: 'RU' }).click();
  await expect(page.locator(BUTTON)).toHaveAttribute('data-viewed', 'true');
  await expect.poll(() => glowInlineOpacity(page), { timeout: 2000 }).toBe('');
  await page.getByRole('button', { name: 'EN' }).click();
  await expect(page.locator(BUTTON)).toHaveAttribute('data-viewed', 'true');
});

test('reduced motion: no pulse and an instant jump to the top', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openSummary(page, DEEP.shortSport);

  // The scope never ran, so the glow carries no inline opacity (static CSS glow).
  expect(await glowInlineOpacity(page)).toBe('');
  await expect(page.locator(BUTTON)).toHaveAttribute('data-viewed', 'false');

  await page.locator(BUTTON).click();
  // The reduced path calls scrollTo synchronously — no 900 ms animation.
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 1000 }).toBe(0);
  await expect(page.locator(HERO_TITLE)).toBeFocused();
  await expect(page.locator(BUTTON)).toHaveAttribute('data-viewed', 'true');
});

test('Enter and Space activate the button and land on the title', async ({ page }) => {
  await openSummary(page, DEEP.bitrix);

  const button = page.locator(BUTTON);
  await button.focus();
  await expect(button).toBeFocused();
  await page.keyboard.press('Enter');
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBe(0);
  await expect(page.locator(HERO_TITLE)).toBeFocused();

  // A second activation (Space) works too — the scroll is not gated by the glow
  // state, so an already-viewed button still returns to the top.
  await page.evaluate(() => document.getElementById('case-summary')?.scrollIntoView());
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
  await button.focus();
  await page.keyboard.press('Space');
  await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 }).toBe(0);
  await expect(page.locator(HERO_TITLE)).toBeFocused();
});

test('Bitrix24 and Local AI Assistant scroll back to the top like the rest', async ({
  page,
}) => {
  for (const href of [DEEP.bitrix, DEEP.local]) {
    await openSummary(page, href);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(200);
    await page.locator(BUTTON).click();
    await expect
      .poll(() => page.evaluate(() => window.scrollY), { timeout: 5000 })
      .toBe(0);
    await expect(page.locator(HERO_TITLE)).toBeFocused();
  }
});

test('mobile: the button fits its column without horizontal overflow', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile-only');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await openSummary(page, DEEP.bitrix);
  await expect(page.locator(`#case-summary ${BUTTON}`)).toHaveCount(1);

  const viewport = page.viewportSize()!;
  const box = (await page.locator(BUTTON).boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(viewport.width);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
});
