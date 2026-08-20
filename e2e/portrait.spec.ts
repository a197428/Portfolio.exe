import { expect, test } from '@playwright/test';

test('hero portrait keeps straight top corners, a rounded base, border, and cover image', async ({
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
  expect(box!.height).toBeGreaterThan(mobile ? 400 : 500);

  const imageStyle = await img.evaluate((element) => getComputedStyle(element));
  expect(imageStyle.objectFit).toBe('cover');

  // Straightening the top corners must not shift or clip the hero content.
  await expect(page.locator('[data-hero-name]')).toBeVisible();
  await expect(page.locator('[data-hero-dock]')).toBeVisible();
  if (!mobile) {
    // The portrait and the side rails are all end-aligned grid items, so their
    // bottoms coincide; the portrait must stay level with the hero rails.
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
