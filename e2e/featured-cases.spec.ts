import { expect, test, type Page } from '@playwright/test';

const BITRIX_HREF = '/projects/bitrix24-integrations';
const LOCAL_HREF = '/projects/local-ai-assistant';

async function featuredCards(page: Page) {
  const projects = page.locator('#projects');
  const bitrix = projects.locator(`a[href="${BITRIX_HREF}"]`);
  const local = projects.locator(`a[href="${LOCAL_HREF}"]`);
  await expect(bitrix).toBeVisible();
  await expect(local).toBeVisible();
  return { projects, bitrix, local };
}

test.describe('mirrored featured card', () => {
  test('desktop: text/media horizontal ordering, equal geometry, hover parity, Bitrix regression', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-chromium', 'desktop-only');
    await page.goto('/');

    const { bitrix, local } = await featuredCards(page);

    // Horizontal ordering: Bitrix text→media, Local media→text.
    const bitrixCopy = bitrix.locator('.featured-case-copy');
    const bitrixVisual = bitrix.locator('.featured-visual');
    const localCopy = local.locator('.featured-case-copy');
    const localVisual = local.locator('.featured-visual');
    const bCopy = await bitrixCopy.boundingBox();
    const bVisual = await bitrixVisual.boundingBox();
    const lCopy = await localCopy.boundingBox();
    const lVisual = await localVisual.boundingBox();
    expect(bCopy!.x).toBeLessThan(bVisual!.x);
    expect(lVisual!.x).toBeLessThan(lCopy!.x);

    // Equal card geometry (same width, height within tolerance).
    const bitrixBox = await bitrix.boundingBox();
    const localBox = await local.boundingBox();
    expect(Math.abs(bitrixBox!.width - localBox!.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(bitrixBox!.height - localBox!.height)).toBeLessThanOrEqual(6);

    // Bitrix regression: untouched copy→visual structure, no reverse modifier.
    await expect(bitrix).toHaveClass(/featured-case/);
    await expect(bitrix).not.toHaveClass(/featured-case--reverse/);
    await expect(bitrix).toHaveAttribute('href', BITRIX_HREF);
    await expect(local).toHaveClass(/featured-case--reverse/);
    await expect(local).toHaveAttribute('href', LOCAL_HREF);

    // Hover parity: both cards raise and glow identically.
    await bitrix.hover();
    await expect(bitrix).toHaveCSS('border-top-color', 'rgba(184, 255, 99, 0.45)');
    await expect(bitrix).toHaveCSS('transform', /-5/);
    await local.hover();
    await expect(local).toHaveCSS('border-top-color', 'rgba(184, 255, 99, 0.45)');
    await expect(local).toHaveCSS('transform', /-5/);

    // Local card navigates to its own project page.
    await local.click();
    await expect(page).toHaveURL(new RegExp(`${LOCAL_HREF}$`));
  });

  test('mobile: single column, media above copy, no overflow, keyboard access', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile-only');
    await page.goto('/');

    const { bitrix, local } = await featuredCards(page);

    // Single column: copy and visual share the same track on both cards.
    for (const card of [bitrix, local]) {
      const copy = await card.locator('.featured-case-copy').boundingBox();
      const visual = await card.locator('.featured-visual').boundingBox();
      expect(Math.abs(copy!.x - visual!.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(copy!.width - visual!.width)).toBeLessThanOrEqual(1);
    }

    // Media sits above copy (grid-row: 1 keeps the mirrored order visual-first).
    const lCopy = await local.locator('.featured-case-copy').boundingBox();
    const lVisual = await local.locator('.featured-visual').boundingBox();
    expect(lVisual!.y).toBeLessThan(lCopy!.y);

    // No horizontal overflow from the added card.
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);

    // Keyboard access: focus outline appears, Enter opens the project.
    const localLink = local;
    await localLink.focus();
    await expect(localLink).toBeFocused();
    await expect(localLink).toHaveCSS('outline-style', 'solid');
    await expect(localLink).toHaveCSS('outline-width', '2px');
    await localLink.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${LOCAL_HREF}$`));
  });
});
