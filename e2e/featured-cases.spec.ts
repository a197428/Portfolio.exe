import { expect, test, type Page } from '@playwright/test';

const BITRIX_HREF = '/projects/bitrix24-integrations';
const LOCAL_HREF = '/projects/local-ai-assistant';
const SHORTSPORT_HREF = '/projects/shortsport-ai-forge';

async function featuredCards(page: Page) {
  const projects = page.locator('#projects');
  const bitrix = projects.locator(`a[href="${BITRIX_HREF}"]`);
  const local = projects.locator(`a[href="${LOCAL_HREF}"]`);
  const shortSport = projects.locator(`a[href="${SHORTSPORT_HREF}"]`);
  await expect(bitrix).toBeVisible();
  await expect(local).toBeVisible();
  await expect(shortSport).toBeVisible();
  return { projects, bitrix, local, shortSport };
}

test.describe('mirrored featured card', () => {
  test('desktop: text/media horizontal ordering, equal geometry, hover parity, Bitrix regression', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-chromium', 'desktop-only');
    await page.goto('/');

    const { bitrix, local, shortSport } = await featuredCards(page);

    // Horizontal ordering: Bitrix text→media, Local media→text.
    const bitrixCopy = bitrix.locator('.featured-case-copy');
    const bitrixVisual = bitrix.locator('.featured-visual');
    const localCopy = local.locator('.featured-case-copy');
    const localVisual = local.locator('.featured-visual');
    const shortSportCopy = shortSport.locator('.featured-case-copy');
    const shortSportVisual = shortSport.locator('.featured-visual');
    const bCopy = await bitrixCopy.boundingBox();
    const bVisual = await bitrixVisual.boundingBox();
    const lCopy = await localCopy.boundingBox();
    const lVisual = await localVisual.boundingBox();
    const sCopy = await shortSportCopy.boundingBox();
    const sVisual = await shortSportVisual.boundingBox();
    expect(bCopy!.x).toBeLessThan(bVisual!.x);
    expect(lVisual!.x).toBeLessThan(lCopy!.x);
    expect(sCopy!.x).toBeLessThan(sVisual!.x);

    // Equal card geometry (same width, height within tolerance).
    const bitrixBox = await bitrix.boundingBox();
    const localBox = await local.boundingBox();
    const shortSportBox = await shortSport.boundingBox();
    expect(Math.abs(bitrixBox!.width - localBox!.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(bitrixBox!.height - localBox!.height)).toBeLessThanOrEqual(6);
    expect(Math.abs(bitrixBox!.width - shortSportBox!.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(bitrixBox!.height - shortSportBox!.height)).toBeLessThanOrEqual(6);

    // Bitrix regression: untouched copy→visual structure, no reverse modifier.
    await expect(bitrix).toHaveClass(/featured-case/);
    await expect(bitrix).not.toHaveClass(/featured-case--reverse/);
    await expect(bitrix).toHaveAttribute('href', BITRIX_HREF);
    await expect(local).toHaveClass(/featured-case--reverse/);
    await expect(local).toHaveAttribute('href', LOCAL_HREF);
    await expect(shortSport).toHaveClass(/featured-case/);
    await expect(shortSport).not.toHaveClass(/featured-case--reverse/);
    await expect(shortSport).toHaveAttribute('href', SHORTSPORT_HREF);

    // Hover parity: both cards raise and glow identically.
    await bitrix.hover();
    await expect(bitrix).toHaveCSS('border-top-color', 'rgba(184, 255, 99, 0.45)');
    await expect(bitrix).toHaveCSS('transform', /-5/);
    await local.hover();
    await expect(local).toHaveCSS('border-top-color', 'rgba(184, 255, 99, 0.45)');
    await expect(local).toHaveCSS('transform', /-5/);
    await shortSport.hover();
    await expect(shortSport).toHaveCSS('border-top-color', 'rgba(184, 255, 99, 0.45)');
    await expect(shortSport).toHaveCSS('transform', /-5/);

    // The new featured card navigates to its own project page.
    await shortSport.click();
    await expect(page).toHaveURL(new RegExp(`${SHORTSPORT_HREF}$`));
  });

  test('mobile: single column, media above copy, no overflow, keyboard access', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile-only');
    await page.goto('/');

    const { bitrix, local, shortSport } = await featuredCards(page);

    // Single column: copy and visual share the same track on both cards.
    for (const card of [bitrix, local, shortSport]) {
      const copy = await card.locator('.featured-case-copy').boundingBox();
      const visual = await card.locator('.featured-visual').boundingBox();
      expect(Math.abs(copy!.x - visual!.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(copy!.width - visual!.width)).toBeLessThanOrEqual(1);
    }

    // Media sits above copy (grid-row: 1 keeps the mirrored order visual-first).
    const lCopy = await local.locator('.featured-case-copy').boundingBox();
    const lVisual = await local.locator('.featured-visual').boundingBox();
    expect(lVisual!.y).toBeLessThan(lCopy!.y);
    const sCopy = await shortSport.locator('.featured-case-copy').boundingBox();
    const sVisual = await shortSport.locator('.featured-visual').boundingBox();
    expect(sVisual!.y).toBeLessThan(sCopy!.y);

    // No horizontal overflow from the added card.
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);

    // Keyboard access: focus outline appears, Enter opens the project.
    await shortSport.focus();
    await expect(shortSport).toBeFocused();
    await expect(shortSport).toHaveCSS('outline-style', 'solid');
    await expect(shortSport).toHaveCSS('outline-width', '2px');
    await shortSport.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${SHORTSPORT_HREF}$`));
  });

  test('frontend: ShortSport stays copy→visual and numbering remains continuous', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-chromium', 'desktop-only');
    await page.goto('/');
    await page.getByRole('button', { name: 'Frontend Developer' }).click();

    const projects = page.locator('#projects');
    const shortSport = projects.locator(`a[href="${SHORTSPORT_HREF}"]`);
    await expect(projects.locator(`a[href="${LOCAL_HREF}"]`)).toHaveCount(0);
    await expect(shortSport).toContainText('002 / mvp');

    const copy = await shortSport.locator('.featured-case-copy').boundingBox();
    const visual = await shortSport.locator('.featured-visual').boundingBox();
    expect(copy!.x).toBeLessThan(visual!.x);
    await expect(projects.locator('.bento-project').first()).toContainText('003');
  });
});
