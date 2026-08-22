import { expect, test } from '@playwright/test';

test('hero portrait spans the decorative hero block with no darkening overlay', async ({
  page,
}, testInfo) => {
  const mobile = testInfo.project.name === 'mobile-chromium';
  // Freeze the entrance animations so geometry is measured at rest.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const portrait = page.locator('.hero-portrait');
  await expect(portrait).toBeVisible();

  const img = portrait.locator('img');
  await expect.poll(() => img.evaluate((image) => image.naturalWidth)).toBeGreaterThan(0);

  const style = await portrait.evaluate((element) => getComputedStyle(element));
  expect(style.borderTopLeftRadius).toBe('0px');
  expect(style.borderTopRightRadius).toBe('0px');
  // 2.5rem on desktop, 2rem on the ≤720px layout.
  expect(style.borderBottomLeftRadius).toBe(mobile ? '32px' : '40px');
  expect(style.borderBottomRightRadius).toBe(mobile ? '32px' : '40px');
  expect(parseFloat(style.borderTopWidth)).toBeGreaterThan(0);

  const box = await portrait.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.width).toBeGreaterThan(280);
  // The portrait keeps its tall editorial size (not the small avatar).
  expect(box!.height).toBeGreaterThan(mobile ? 400 : 480);

  const imageStyle = await img.evaluate((element) => getComputedStyle(element));
  expect(imageStyle.objectFit).toBe('cover');
  // Color grading is untouched: no darkening layer over the head.
  expect(await img.evaluate((element) => getComputedStyle(element).filter)).toBe(
    'saturate(0.82) contrast(1.04)',
  );

  // No ::before overlay remains; only the neutral ::after stays (bottom depth +
  // sheen), and it must not darken the face area.
  const beforeStyle = await portrait.evaluate((element) => {
    const pseudo = getComputedStyle(element, '::before');
    return { content: pseudo.content, backgroundImage: pseudo.backgroundImage };
  });
  expect(beforeStyle.content).toBe('none');
  expect(beforeStyle.backgroundImage).toBe('none');
  const afterContent = await portrait.evaluate(
    (element) => getComputedStyle(element, '::after').content,
  );
  expect(afterContent).not.toBe('none');

  // Straightening the top corners must not shift or clip the hero content.
  await expect(page.locator('[data-hero-name]')).toBeVisible();
  await expect(page.locator('[data-hero-dock]')).toBeVisible();
  if (!mobile) {
    // On desktop the portrait top and bottom must match the decorative hero
    // panel, which uses the same inset: 9% 7% 7%.
    const panel = await page.locator('.hero').evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        top: rect.top + rect.height * 0.09,
        bottom: rect.bottom - rect.height * 0.07,
      };
    });
    expect(Math.abs(box!.y - panel.top)).toBeLessThanOrEqual(2);
    expect(Math.abs(box!.y + box!.height - panel.bottom)).toBeLessThanOrEqual(2);

    // The portrait also stays level with the end-aligned side rails.
    const railBox = await page.locator('.hero-rail--right').boundingBox();
    expect(railBox).not.toBeNull();
    expect(Math.abs(box!.y + box!.height - (railBox!.y + railBox!.height))).toBeLessThan(
      2,
    );
  }

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
});

test('promotes the mailto CTA and removes the explore link in both locales', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.getByRole('link', { name: 'Explore projects' })).toHaveCount(0);
  const cta = page.getByRole('link', { name: 'Get in touch' });
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute('href', 'mailto:a197428@yandex.ru');

  // The CTA is reachable with the keyboard and gets the focus ring.
  for (let i = 0; i < 30; i += 1) {
    await page.keyboard.press('Tab');
    if (
      await page.evaluate(() => document.activeElement?.classList.contains('hero-cta'))
    ) {
      break;
    }
  }
  await expect
    .poll(() =>
      page.evaluate(() => document.activeElement?.classList.contains('hero-cta')),
    )
    .toBe(true);
  const focusOutline = await page.evaluate(() => {
    const el = document.activeElement;
    return el ? getComputedStyle(el).outlineStyle : '';
  });
  expect(focusOutline).not.toBe('none');

  // Reduced motion disables the CTA's hover transition.
  const ctaTransition = await cta.evaluate(
    (element) => getComputedStyle(element).transition,
  );
  expect(ctaTransition).toContain('none');

  // The same contract holds in Russian.
  await page.getByRole('button', { name: 'RU' }).click();
  await expect(page.getByRole('link', { name: 'Смотреть проекты' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Написать' })).toHaveAttribute(
    'href',
    'mailto:a197428@yandex.ru',
  );
});

test('sits the contact module beside the portrait and keeps the editorial card off the face', async ({
  page,
}, testInfo) => {
  const mobile = testInfo.project.name === 'mobile-chromium';
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  const portrait = page.locator('.hero-portrait');
  await expect(portrait).toBeVisible();
  const portraitBox = (await portrait.boundingBox())!;

  const cta = page.getByRole('link', { name: 'Get in touch' });
  await expect(cta).toBeVisible();

  const card = page.locator('.hero-rail--right.hero-card');
  await expect(card).toBeVisible();

  if (mobile) {
    // Mobile order: portrait → status + CTA → editorial card.
    const ctaBox = (await cta.boundingBox())!;
    const cardBox = (await card.boundingBox())!;
    expect(portraitBox.y + portraitBox.height).toBeLessThanOrEqual(ctaBox.y + 2);
    expect(ctaBox.y + ctaBox.height).toBeLessThanOrEqual(cardBox.y + 2);
  } else {
    const railBox = (await page.locator('.hero-rail--left').boundingBox())!;
    // The compact contact module hugs the portrait's left edge (small gap).
    const gap = portraitBox.x - (railBox.x + railBox.width);
    expect(gap).toBeGreaterThanOrEqual(0);
    expect(gap).toBeLessThan(56);

    // The editorial card steps toward the portrait but never reaches the face:
    // its left edge stays past the portrait's horizontal centre.
    const cardBox = (await card.boundingBox())!;
    expect(cardBox.x).toBeGreaterThan(portraitBox.x + portraitBox.width * 0.5);

    // The card stays inside the decorative hero panel (inset 9% 7% 7%).
    const panel = await page.locator('.hero').evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        left: rect.left + rect.width * 0.07,
        right: rect.right - rect.width * 0.07,
      };
    });
    expect(cardBox.x).toBeGreaterThanOrEqual(panel.left - 1);
    expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(panel.right + 1);
  }

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
});

test('keeps the editorial card clear of the portrait on tablet', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto('/');

  const portrait = page.locator('.hero-portrait');
  const card = page.locator('.hero-rail--right.hero-card');
  await expect(portrait).toBeVisible();
  await expect(card).toBeVisible();

  const portraitBox = (await portrait.boundingBox())!;
  const cardBox = (await card.boundingBox())!;
  // Two-column tablet layout: the card sits in the left column, fully to the
  // left of the portrait — no overlap.
  expect(cardBox.x + cardBox.width).toBeLessThanOrEqual(portraitBox.x + 1);

  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
});
