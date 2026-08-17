import { expect, test, type Page } from '@playwright/test';

const BITRIX_HREF = '/projects/bitrix24-integrations';
const LOCAL_HREF = '/projects/local-ai-assistant';
const SHORTSPORT_HREF = '/projects/shortsport-ai-forge';
const VIDEO_TRANSCRIBER_HREF = '/projects/video-sut';
const NEUROSPORT_TMA_HREF = '/projects/neurosport-tma';
const READ_CLOSE_BOT_HREF = '/projects/read-close-bot';

async function featuredCards(page: Page) {
  const projects = page.locator('#projects');
  const bitrix = projects.locator(`a[href="${BITRIX_HREF}"]`);
  const local = projects.locator(`a[href="${LOCAL_HREF}"]`);
  const shortSport = projects.locator(`a[href="${SHORTSPORT_HREF}"]`);
  const videoTranscriber = projects.locator(`a[href="${VIDEO_TRANSCRIBER_HREF}"]`);
  const neurosportTma = projects.locator(`a[href="${NEUROSPORT_TMA_HREF}"]`);
  const readCloseBot = projects.locator(`a[href="${READ_CLOSE_BOT_HREF}"]`);
  await expect(bitrix).toBeVisible();
  await expect(local).toBeVisible();
  await expect(shortSport).toBeVisible();
  await expect(videoTranscriber).toBeVisible();
  await expect(neurosportTma).toBeVisible();
  await expect(readCloseBot).toBeVisible();
  return {
    projects,
    bitrix,
    local,
    shortSport,
    videoTranscriber,
    neurosportTma,
    readCloseBot,
  };
}

test.describe('mirrored featured card', () => {
  test('desktop: text/media horizontal ordering, equal geometry, hover parity, Bitrix regression', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-chromium', 'desktop-only');
    await page.goto('/');

    const { bitrix, local, shortSport, videoTranscriber, neurosportTma, readCloseBot } =
      await featuredCards(page);

    // Horizontal ordering: Bitrix text→media, Local media→text.
    const bitrixCopy = bitrix.locator('.featured-case-copy');
    const bitrixVisual = bitrix.locator('.featured-visual');
    const localCopy = local.locator('.featured-case-copy');
    const localVisual = local.locator('.featured-visual');
    const shortSportCopy = shortSport.locator('.featured-case-copy');
    const shortSportVisual = shortSport.locator('.featured-visual');
    const videoCopy = videoTranscriber.locator('.featured-case-copy');
    const videoVisual = videoTranscriber.locator('.featured-visual');
    const tmaCopy = neurosportTma.locator('.featured-case-copy');
    const tmaVisual = neurosportTma.locator('.featured-visual');
    const readCloseCopy = readCloseBot.locator('.featured-case-copy');
    const readCloseVisual = readCloseBot.locator('.featured-visual');
    const bCopy = await bitrixCopy.boundingBox();
    const bVisual = await bitrixVisual.boundingBox();
    const lCopy = await localCopy.boundingBox();
    const lVisual = await localVisual.boundingBox();
    const sCopy = await shortSportCopy.boundingBox();
    const sVisual = await shortSportVisual.boundingBox();
    const vCopy = await videoCopy.boundingBox();
    const vVisual = await videoVisual.boundingBox();
    const tCopy = await tmaCopy.boundingBox();
    const tVisual = await tmaVisual.boundingBox();
    const rCopy = await readCloseCopy.boundingBox();
    const rVisual = await readCloseVisual.boundingBox();
    expect(bCopy!.x).toBeLessThan(bVisual!.x);
    expect(lVisual!.x).toBeLessThan(lCopy!.x);
    expect(sCopy!.x).toBeLessThan(sVisual!.x);
    expect(vVisual!.x).toBeLessThan(vCopy!.x);
    expect(tCopy!.x).toBeLessThan(tVisual!.x);
    expect(rVisual!.x).toBeLessThan(rCopy!.x);

    // Equal card geometry (same width, height within tolerance).
    const bitrixBox = await bitrix.boundingBox();
    const localBox = await local.boundingBox();
    const shortSportBox = await shortSport.boundingBox();
    const videoBox = await videoTranscriber.boundingBox();
    const tmaBox = await neurosportTma.boundingBox();
    const readCloseBox = await readCloseBot.boundingBox();
    expect(Math.abs(bitrixBox!.width - localBox!.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(bitrixBox!.height - localBox!.height)).toBeLessThanOrEqual(6);
    expect(Math.abs(bitrixBox!.width - shortSportBox!.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(bitrixBox!.height - shortSportBox!.height)).toBeLessThanOrEqual(6);
    expect(Math.abs(bitrixBox!.width - videoBox!.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(bitrixBox!.height - videoBox!.height)).toBeLessThanOrEqual(6);
    expect(Math.abs(bitrixBox!.width - tmaBox!.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(bitrixBox!.height - tmaBox!.height)).toBeLessThanOrEqual(6);
    expect(Math.abs(bitrixBox!.width - readCloseBox!.width)).toBeLessThanOrEqual(1);
    expect(Math.abs(bitrixBox!.height - readCloseBox!.height)).toBeLessThanOrEqual(6);

    // Bitrix regression: untouched copy→visual structure, no reverse modifier.
    await expect(bitrix).toHaveClass(/featured-case/);
    await expect(bitrix).not.toHaveClass(/featured-case--reverse/);
    await expect(bitrix).toHaveAttribute('href', BITRIX_HREF);
    await expect(local).toHaveClass(/featured-case--reverse/);
    await expect(local).toHaveAttribute('href', LOCAL_HREF);
    await expect(shortSport).toHaveClass(/featured-case/);
    await expect(shortSport).not.toHaveClass(/featured-case--reverse/);
    await expect(shortSport).toHaveAttribute('href', SHORTSPORT_HREF);
    await expect(videoTranscriber).toHaveClass(/featured-case--reverse/);
    await expect(videoTranscriber).toHaveAttribute('href', VIDEO_TRANSCRIBER_HREF);
    await expect(neurosportTma).toHaveAttribute('href', NEUROSPORT_TMA_HREF);
    await expect(neurosportTma).toContainText('005 / mvp');
    await expect(readCloseBot).toHaveClass(/featured-case--reverse/);
    await expect(readCloseBot).toContainText('006 / active');
    await expect(readCloseVisual.locator('img')).toHaveAttribute(
      'src',
      '/image/Read-Close-Bot.png',
    );
    await expect(videoVisual).toContainText('Watch presentation · 1 demo');

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
    await videoTranscriber.hover();
    await expect(videoTranscriber).toHaveCSS(
      'border-top-color',
      'rgba(184, 255, 99, 0.45)',
    );
    await expect(videoTranscriber).toHaveCSS('transform', /-5/);

    // The new featured card navigates to its own project page.
    await shortSport.click();
    await expect(page).toHaveURL(new RegExp(`${SHORTSPORT_HREF}$`));
  });

  test('mobile: single column, media above copy, no overflow, keyboard access', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile-chromium', 'mobile-only');
    await page.goto('/');

    const { bitrix, local, shortSport, videoTranscriber, neurosportTma, readCloseBot } =
      await featuredCards(page);

    // Single column: copy and visual share the same track on both cards.
    for (const card of [
      bitrix,
      local,
      shortSport,
      videoTranscriber,
      neurosportTma,
      readCloseBot,
    ]) {
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
    const vCopy = await videoTranscriber.locator('.featured-case-copy').boundingBox();
    const vVisual = await videoTranscriber.locator('.featured-visual').boundingBox();
    expect(vVisual!.y).toBeLessThan(vCopy!.y);
    const rCopy = await readCloseBot.locator('.featured-case-copy').boundingBox();
    const rVisual = await readCloseBot.locator('.featured-visual').boundingBox();
    expect(rVisual!.y).toBeLessThan(rCopy!.y);

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

  test('frontend: Video precedes ShortSport while both keep their geometry', async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile-chromium', 'desktop-only');
    await page.goto('/');
    await page.getByRole('button', { name: 'Frontend Developer' }).click();

    const projects = page.locator('#projects');
    const shortSport = projects.locator(`a[href="${SHORTSPORT_HREF}"]`);
    const videoTranscriber = projects.locator(`a[href="${VIDEO_TRANSCRIBER_HREF}"]`);
    const neurosportTma = projects.locator(`a[href="${NEUROSPORT_TMA_HREF}"]`);
    await expect(projects.locator(`a[href="${LOCAL_HREF}"]`)).toHaveCount(0);
    await expect(projects.locator(`a[href="${READ_CLOSE_BOT_HREF}"]`)).toHaveCount(0);
    await expect(shortSport).toContainText('003 / mvp');

    const copy = await shortSport.locator('.featured-case-copy').boundingBox();
    const visual = await shortSport.locator('.featured-visual').boundingBox();
    expect(copy!.x).toBeLessThan(visual!.x);
    await expect(videoTranscriber).toContainText('002 / mvp');
    await expect(neurosportTma).toContainText('005 / mvp');
    const videoCopy = await videoTranscriber.locator('.featured-case-copy').boundingBox();
    const videoVisual = await videoTranscriber.locator('.featured-visual').boundingBox();
    expect(videoVisual!.x).toBeLessThan(videoCopy!.x);
    const shortSportBox = await shortSport.boundingBox();
    const videoBox = await videoTranscriber.boundingBox();
    expect(videoBox!.y).toBeLessThan(shortSportBox!.y);
    await expect(projects.locator('.bento-project').first()).toContainText('004');
  });
});
