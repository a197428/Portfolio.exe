import { expect, test, type Locator } from '@playwright/test';

/** Count the visual text lines of an element (one rect per line box, deduped by
 *  bottom coordinate). Works with text-wrap: balance because balanced lines are
 *  still separate line boxes. */
async function countLines(locator: Locator): Promise<number> {
  return locator.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    return new Set(
      Array.from(range.getClientRects()).map((rect) => Math.round(rect.bottom)),
    ).size;
  });
}

async function noHorizontalOverflow(page: import('@playwright/test').Page) {
  return page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
}

const SECTIONS = [
  { index: '01', id: 'projects-title' },
  { index: '02', id: 'experience-title' },
  { index: '03', id: 'method-title' },
  { index: '04', id: 'ai-preview-title' },
  { index: '05', id: 'contact-title' },
] as const;

test('home sections share one editorial heading grid on desktop', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'mobile stacking covered below');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const headings = page.locator('.section-heading');
  await expect(headings).toHaveCount(SECTIONS.length);

  const columns: Array<{
    kickerLeft: number;
    kickerOffset: number;
    titleLeft: number;
    titleWidth: number;
    gap: number;
  }> = [];

  for (let i = 0; i < SECTIONS.length; i += 1) {
    const heading = headings.nth(i);
    const section = SECTIONS[i];

    const kicker = heading.locator('.section-heading-kicker');
    const title = heading.locator('.section-heading-title');
    await expect(kicker).toBeVisible();
    await expect(title).toBeVisible();

    // Kicker carries the service number and the title is the labelled heading.
    await expect(kicker).toHaveText(new RegExp(`^${section.index} / `));
    await expect(title).toHaveAttribute('id', section.id);

    const kickerBox = await kicker.boundingBox();
    const titleBox = await title.boundingBox();
    expect(kickerBox).not.toBeNull();
    expect(titleBox).not.toBeNull();

    // Editorial split: kicker in the narrow left column, title in the wide right.
    expect(kickerBox!.x + kickerBox!.width).toBeLessThan(titleBox!.x);
    expect(titleBox!.width).toBeGreaterThan(600);
    // Title width is capped at 850–900px by design.
    expect(titleBox!.width).toBeLessThanOrEqual(856);

    // The kicker baseline is level with the first line of the title.
    const kickerBottom = kickerBox!.y + kickerBox!.height;
    expect(kickerBottom).toBeGreaterThanOrEqual(titleBox!.y - 12);
    expect(kickerBottom).toBeLessThanOrEqual(titleBox!.y + titleBox!.height + 12);

    columns.push({
      kickerLeft: kickerBox!.x,
      // Offset of the kicker baseline relative to its own title, so sections at
      // different scroll depths are still comparable.
      kickerOffset: kickerBottom - titleBox!.y,
      titleLeft: titleBox!.x,
      titleWidth: titleBox!.width,
      gap: parseFloat(await heading.evaluate((el) => getComputedStyle(el).marginBottom)),
    });
  }

  // The four full-width sections share one column position, baseline offset and
  // heading→content gap. Contact is an inset glass panel and is verified against
  // its own content box below.
  const reference = columns.slice(0, 4);
  const first = reference[0];
  for (const column of reference.slice(1)) {
    expect(Math.abs(column.kickerLeft - first.kickerLeft)).toBeLessThanOrEqual(1);
    expect(Math.abs(column.titleLeft - first.titleLeft)).toBeLessThanOrEqual(1);
    expect(Math.abs(column.kickerOffset - first.kickerOffset)).toBeLessThanOrEqual(2);
    expect(Math.abs(column.gap - first.gap)).toBeLessThanOrEqual(1);
  }
  // The unified gap to content is compact but real.
  expect(first.gap).toBeGreaterThanOrEqual(30);

  // Contact keeps the same baseline rhythm and gap, aligned to its panel content
  // box (the panel's horizontal padding offsets its columns by design).
  const contact = columns[4];
  const panelContent = await headings.nth(4).evaluate((el) => {
    const panel = el.closest('.contact-section');
    if (!panel) return null;
    const rect = panel.getBoundingClientRect();
    const style = getComputedStyle(panel);
    return {
      left: rect.left + parseFloat(style.paddingLeft),
      right: rect.right - parseFloat(style.paddingRight),
    };
  });
  expect(panelContent).not.toBeNull();
  expect(Math.abs(contact.kickerLeft - panelContent!.left)).toBeLessThanOrEqual(1);
  // Contact uses the compact sub scale, so its smaller title box top sits closer
  // to the shared baseline; the per-section baseline check above already verifies
  // the kicker is level with the first line. Only the gap rhythm stays global.
  expect(Math.abs(contact.gap - first.gap)).toBeLessThanOrEqual(1);
  expect(contact.titleLeft + contact.titleWidth).toBeLessThanOrEqual(
    panelContent!.right + 1,
  );

  // Titles never spill outside their section.
  const titles = page.locator('.section-heading-title');
  for (let i = 0; i < SECTIONS.length; i += 1) {
    const heading = headings.nth(i);
    const titleBox = await titles.nth(i).boundingBox();
    const sectionBox = await heading.evaluate((el) => {
      const section = el.closest('section');
      if (!section) return null;
      const rect = section.getBoundingClientRect();
      return { left: rect.left, right: rect.right };
    });
    expect(sectionBox).not.toBeNull();
    expect(titleBox!.x).toBeGreaterThanOrEqual(sectionBox!.left - 1);
    expect(titleBox!.x + titleBox!.width).toBeLessThanOrEqual(sectionBox!.right + 1);
  }
});

test('experience title stays within two lines on a standard desktop', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('button', { name: 'RU' }).click();

  const title = page.locator('#experience-title');
  await expect(title).toBeVisible();
  expect(await countLines(title)).toBeLessThanOrEqual(2);
});

test('section headings stack vertically on mobile without overflow', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile-chromium', 'desktop grid covered above');
  // Measure the stable stacked layout, not the mid-flight entrance animation.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const headings = page.locator('.section-heading');
  await expect(headings).toHaveCount(SECTIONS.length);

  for (let i = 0; i < SECTIONS.length; i += 1) {
    const kicker = headings.nth(i).locator('.section-heading-kicker');
    const title = headings.nth(i).locator('.section-heading-title');
    await expect(kicker).toBeVisible();
    const kickerBox = await kicker.boundingBox();
    const titleBox = await title.boundingBox();
    expect(kickerBox).not.toBeNull();
    expect(titleBox).not.toBeNull();
    // Kicker returns above the title on mobile.
    expect(kickerBox!.y + kickerBox!.height).toBeLessThanOrEqual(titleBox!.y + 2);
  }
  expect(await noHorizontalOverflow(page)).toBe(false);
});

test('home and project pages keep no horizontal overflow in both locales', async ({
  page,
}) => {
  await page.goto('/');
  expect(await noHorizontalOverflow(page)).toBe(false);
  await page.getByRole('button', { name: 'RU' }).click();
  expect(await noHorizontalOverflow(page)).toBe(false);

  for (const href of [
    '/projects/bitrix24-integrations',
    '/projects/local-ai-assistant',
  ]) {
    await page.goto(href);
    expect(await noHorizontalOverflow(page)).toBe(false);
  }
});

test('project pages keep the heading hierarchy and balanced h1 width', async ({
  page,
}) => {
  await page.goto('/projects/bitrix24-integrations');
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1).toBeVisible();
  const h1Box = await h1.boundingBox();
  expect(h1Box).not.toBeNull();
  expect(h1Box!.width).toBeLessThanOrEqual(902);

  // Summary "Task" headings are h2; capability/architecture sections are h3.
  await expect(page.getByRole('heading', { level: 2 }).first()).toBeVisible();
  await expect(page.getByRole('heading', { level: 3 }).first()).toBeVisible();
  expect(await noHorizontalOverflow(page)).toBe(false);
});

test('sections keep accessible h1–h3 labels wired via aria-labelledby', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);

  const sections = [
    page.locator('#projects'),
    page.locator('#about'),
    page.locator('.method-section'),
    page.locator('.ai-preview'),
    page.locator('#contact'),
  ];
  for (const section of sections) {
    await expect(section).toBeVisible();
    const labelledBy = await section.getAttribute('aria-labelledby');
    expect(labelledBy).not.toBeNull();
    // The referenced id must exist and be the section's heading level.
    const ref = page.locator(`#${labelledBy}`);
    await expect(ref).toHaveCount(1);
    await expect(ref).toBeVisible();
    expect(await ref.evaluate((el) => el.tagName.toLowerCase())).toBe('h2');
    await expect(ref).toBeVisible();
  }
});
