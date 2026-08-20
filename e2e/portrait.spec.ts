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
