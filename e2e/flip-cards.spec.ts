import { expect, test, type Locator } from '@playwright/test';

/** True when the 3D inner is actually rotated (rotateY(180deg) or similar). */
async function isFlipped(inner: Locator): Promise<boolean> {
  return inner.evaluate((element) => {
    const transform = getComputedStyle(element).transform;
    return transform !== 'none' && transform !== 'matrix(1, 0, 0, 1, 0, 0)';
  });
}

/** Waits for the 560ms flip transition to settle before asserting. */
async function expectFlipped(inner: Locator, flipped: boolean) {
  await expect.poll(() => isFlipped(inner), { timeout: 2000 }).toBe(flipped);
}

async function noHorizontalOverflow(page: import('@playwright/test').Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
}

test('renders six flip cards wired as accessible toggle buttons', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.locator('.experience-grid .flip-card')).toHaveCount(3);
  await expect(page.locator('.method-grid .flip-card')).toHaveCount(3);

  const first = page.locator('.experience-grid .flip-card').first();
  await expect(first).toHaveAttribute('role', 'button');
  await expect(first).toHaveAttribute('aria-pressed', 'false');

  // The inactive (back) face is hidden from assistive technology up front.
  await expect(first.locator('.flip-card-front')).toHaveAttribute('aria-hidden', 'false');
  await expect(first.locator('.flip-card-back')).toHaveAttribute('aria-hidden', 'true');
});

test('previews the back on hover and pins it open on click (desktop)', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'touch tap covered on mobile');
  await page.goto('/');

  const card = page.locator('.experience-grid .flip-card').first();
  const inner = card.locator('.flip-card-inner');
  await card.scrollIntoViewIfNeeded();

  // Hover shows the back temporarily.
  await card.hover();
  await expectFlipped(inner, true);

  // Leaving the card returns to the front (nothing pinned yet).
  await page.mouse.move(4, 4);
  await expectFlipped(inner, false);

  // A click pins the back open and it survives the pointer leaving.
  await card.click();
  await expect(card).toHaveAttribute('aria-pressed', 'true');
  await page.mouse.move(4, 4);
  await expectFlipped(inner, true);
  await expect(card.locator('.flip-card-back')).toHaveAttribute('aria-hidden', 'false');

  // A second click collapses the card again; the pointer still hovers, so move
  // away to let the unpinned card return to the front.
  await card.click();
  await expect(card).toHaveAttribute('aria-pressed', 'false');
  await page.mouse.move(4, 4);
  await expectFlipped(inner, false);
});

test('flips with focus, pins with Enter, and releases with Escape', async ({ page }) => {
  await page.goto('/');

  const card = page.locator('.method-grid .flip-card').first();
  const inner = card.locator('.flip-card-inner');
  await card.scrollIntoViewIfNeeded();

  // Focus previews the back without pinning.
  await card.focus();
  await expectFlipped(inner, true);
  await expect(card).toHaveAttribute('aria-pressed', 'false');

  // Enter pins the card open.
  await page.keyboard.press('Enter');
  await expect(card).toHaveAttribute('aria-pressed', 'true');

  // Escape releases the pin, but focus keeps the back previewed.
  await page.keyboard.press('Escape');
  await expect(card).toHaveAttribute('aria-pressed', 'false');
  await expectFlipped(inner, true);

  // Space also pins, then Escape releases it and Tab closes the card.
  await page.keyboard.press(' ');
  await expect(card).toHaveAttribute('aria-pressed', 'true');
  await page.keyboard.press('Escape');
  await expect(card).toHaveAttribute('aria-pressed', 'false');
  await page.keyboard.press('Tab');
  await expectFlipped(inner, false);
});

test('keeps RU/EN parity for all six flip cards', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.locator('.flip-card')).toHaveCount(6);
  await expect(page.getByRole('button', { name: /Commercial practice/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Define the AI flow/i })).toBeVisible();

  await page.getByRole('button', { name: 'RU' }).click();
  await expect(page.locator('.flip-card')).toHaveCount(6);
  await expect(
    page.getByRole('button', { name: /Коммерческая практика/i }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: /Определить AI-сценарий/i }),
  ).toBeVisible();

  // The back faces carry the localized detail points.
  const commercial = page.getByRole('button', { name: /Коммерческая практика/i });
  await commercial.click();
  await expect(commercial.locator('.flip-card-back')).toContainText(
    'Модернизация трёх legacy-приложений',
  );
});

test('switches the block-03 content with the role and resets a pinned card', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  // The default AI lens drives block 03 first.
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'From task to controlled AI system.',
    }),
  ).toBeVisible();
  const aiFlow = page.getByRole('button', { name: /Define the AI flow/i });
  await aiFlow.click();
  await expect(aiFlow).toHaveAttribute('aria-pressed', 'true');

  // Switching to the Frontend lens swaps the heading and all three cards at once.
  await page.getByRole('button', { name: 'Frontend Developer' }).click();
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'From task to working interface.',
    }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /Understand the task/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Build the interface/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Verify the result/i })).toBeVisible();
  // No leftover AI-lens text in the block.
  await expect(page.getByText('Define the AI flow')).toHaveCount(0);

  // The remounted card starts closed: the previous pin does not carry over.
  const task = page.getByRole('button', { name: /Understand the task/i });
  await expect(task).toHaveAttribute('aria-pressed', 'false');

  // Round trip back to the AI lens restores the AI block.
  await page.getByRole('button', { name: 'AI Developer' }).click();
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'From task to controlled AI system.',
    }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: /Define the AI flow/i })).toBeVisible();
});

test('shows neutral hints in both locales and drops the press instructions', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  // English: every closed card hints "View details"; opening shows the back hint.
  await expect(page.getByText('View details', { exact: true })).toHaveCount(6);
  const defineFlow = page.getByRole('button', { name: /Define the AI flow/i });
  await defineFlow.click();
  await expect(defineFlow.locator('.flip-card-back')).toContainText('Back to overview');
  await defineFlow.click();

  // Russian: every closed card hints "Подробнее"; opening shows "Краткий обзор".
  await page.getByRole('button', { name: 'RU' }).click();
  await expect(page.getByText('Подробнее', { exact: true })).toHaveCount(6);
  const defineRus = page.getByRole('button', { name: /Определить AI-сценарий/i });
  await defineRus.click();
  await expect(defineRus.locator('.flip-card-back')).toContainText('Краткий обзор');

  // The old action-based instructions are gone from the interface.
  await expect(page.getByText('Press to reveal')).toHaveCount(0);
  await expect(page.getByText('Press to collapse')).toHaveCount(0);
  await expect(page.getByText('Нажмите, чтобы раскрыть')).toHaveCount(0);
  await expect(page.getByText('Нажмите, чтобы свернуть')).toHaveCount(0);
});

test('keeps front and back the same size and never overflows', async ({ page }) => {
  await page.goto('/');

  const card = page.locator('.experience-grid .flip-card').first();
  await card.scrollIntoViewIfNeeded();
  const front = card.locator('.flip-card-front');
  const back = card.locator('.flip-card-back');

  const frontBox = await front.boundingBox();
  const backBox = await back.boundingBox();
  expect(frontBox).not.toBeNull();
  expect(backBox).not.toBeNull();
  expect(Math.abs(frontBox!.height - backBox!.height)).toBeLessThanOrEqual(1);

  expect(await noHorizontalOverflow(page)).toBe(false);
});

test('stacks the flip cards in one column on mobile and toggles by tap', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'desktop grid covered above');
  await page.goto('/');

  await expect(page.locator('.flip-card')).toHaveCount(6);
  expect(await noHorizontalOverflow(page)).toBe(false);

  const cards = page.locator('.experience-grid .flip-card');
  const firstBox = await cards.nth(0).boundingBox();
  const secondBox = await cards.nth(1).boundingBox();
  expect(firstBox).not.toBeNull();
  expect(secondBox).not.toBeNull();
  // One column: the second card starts below the first on the same left edge.
  expect(Math.abs(firstBox!.x - secondBox!.x)).toBeLessThanOrEqual(1);
  expect(secondBox!.y).toBeGreaterThan(firstBox!.y);

  // Tap pins the back face open.
  const card = cards.first();
  await card.tap();
  await expect(card).toHaveAttribute('aria-pressed', 'true');
});

test('replaces the 3D rotation with a fade under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const card = page.locator('.method-grid .flip-card').first();
  const inner = card.locator('.flip-card-inner');
  await card.scrollIntoViewIfNeeded();

  await card.focus();
  // No spatial rotation; the faces fade instead.
  await expect(inner).toHaveCSS('transform', 'none');
  const back = card.locator('.flip-card-back');
  await expect(back).toHaveCSS('opacity', '1');
  await expect(card.locator('.flip-card-front')).toHaveCSS('opacity', '0');
});
