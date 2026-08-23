import { expect, test } from '@playwright/test';

test('reveals the accessible hero and refreshes it across role and locale changes', async ({
  page,
}) => {
  await page.goto('/');

  const name = page.getByRole('heading', {
    level: 1,
    name: 'Alexander Popoff',
  });
  await expect(name).toBeVisible();
  await expect(name.locator('.hero-name-word')).not.toHaveCount(0);
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'I connect the model, interface, and infrastructure into one coherent product.',
    }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Frontend Developer' }).click();
  await expect(
    page.getByRole('heading', {
      level: 2,
      name: 'I turn complex product logic into a simple, intuitive interface.',
    }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
    'Alexander Popoff',
  );

  await page.getByRole('button', { name: 'RU' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(
    'Александр Popoff',
  );
  await expect(page.locator('[data-hero-name] .hero-name-word')).not.toHaveCount(0);
});

test('moves project media without taking ownership of card transforms', async ({
  page,
}) => {
  await page.goto('/');

  const card = page.locator('.featured-case').first();
  await card.scrollIntoViewIfNeeded();

  const poster = card.locator('img');
  await expect
    .poll(() => poster.evaluate((element) => element.style.objectPosition))
    .not.toBe('');
  expect(await card.evaluate((element) => element.style.filter)).toBe('');
  expect(await card.evaluate((element) => element.style.boxShadow)).toBe('');
  expect(await card.evaluate((element) => element.style.transform)).toBe('');
});

test('draws one signal spine through all five home sections', async ({ page }) => {
  await page.goto('/');

  const spine = page.locator('[data-signal-spine]');
  await expect(spine).toHaveCount(1);
  await expect(spine.locator('[data-signal-path-active]')).toHaveCount(1);
  await expect(spine.locator('[data-signal-node]')).toHaveCount(5);

  const activePath = spine.locator('[data-signal-path-active]');
  await expect(activePath).toHaveAttribute('pathLength', '1000');
  const before = await activePath.getAttribute('stroke-dasharray');
  const verifyAnchorsAndSequence = async () => {
    await expect(page.locator('[data-signal-node-group]').first()).toHaveAttribute(
      'data-signal-node-progress',
      /\d/,
    );

    const alignment = await page.evaluate(() => {
      const anchors = Array.from(
        document.querySelectorAll<HTMLElement>('[data-signal-anchor]'),
      );
      const nodes = Array.from(
        document.querySelectorAll<SVGCircleElement>('[data-signal-node]'),
      );
      return anchors.map((anchor, index) => {
        const anchorRect = anchor.getBoundingClientRect();
        const nodeRect = nodes[index].getBoundingClientRect();
        return {
          horizontalGap: anchorRect.left - (nodeRect.left + nodeRect.width / 2),
          verticalGap: Math.abs(
            anchorRect.top + anchorRect.height / 2 - (nodeRect.top + nodeRect.height / 2),
          ),
        };
      });
    });
    const mobile = (page.viewportSize()?.width ?? 0) <= 720;
    alignment.forEach(({ horizontalGap, verticalGap }) => {
      if (mobile) expect(Math.abs(horizontalGap)).toBeLessThanOrEqual(16);
      else {
        expect(horizontalGap).toBeGreaterThanOrEqual(14);
        expect(horizontalGap).toBeLessThanOrEqual(24);
      }
      expect(verticalGap).toBeLessThanOrEqual(2);
    });

    for (let index = 0; index < 5; index += 1) {
      await page.evaluate((nodeIndex) => {
        const track = document.querySelector<HTMLElement>('[data-signal-track]')!;
        const group = document.querySelectorAll<SVGGElement>('[data-signal-node-group]')[
          nodeIndex
        ];
        const progress = Number(group.dataset.signalNodeProgress);
        const trackTop = track.getBoundingClientRect().top + window.scrollY;
        const threshold = window.innerHeight * 0.72;
        const start = trackTop - threshold;
        const maximumScroll = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          0,
        );
        const end = Math.min(trackTop + track.offsetHeight - threshold, maximumScroll);
        window.scrollTo({ top: start + progress * (end - start), behavior: 'instant' });
      }, index);
      await expect(page.locator('.signal-spine')).toHaveAttribute(
        'data-signal-active-node',
        `0${index + 1}`,
      );
    }
  };

  await verifyAnchorsAndSequence();
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
  );
  await expect
    .poll(async () =>
      Number(await page.locator('.signal-spine').getAttribute('data-signal-progress')),
    )
    .toBeGreaterThanOrEqual(0.995);
  await expect.poll(() => activePath.getAttribute('stroke-dasharray')).not.toBe(before);

  await page.getByRole('button', { name: 'Frontend Developer' }).click();
  await verifyAnchorsAndSequence();
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
  );
  await expect
    .poll(async () =>
      Number(await page.locator('.signal-spine').getAttribute('data-signal-progress')),
    )
    .toBeGreaterThanOrEqual(0.995);

  await page.getByRole('button', { name: 'AI Developer' }).click();
  await page.evaluate(() =>
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }),
  );
  await expect
    .poll(async () =>
      Number(await page.locator('.signal-spine').getAttribute('data-signal-progress')),
    )
    .toBeGreaterThanOrEqual(0.995);

  await page.getByRole('button', { name: 'RU' }).click();
  await expect(page.locator('[data-signal-spine]')).toHaveCount(1);
  await expect(page.locator('[data-signal-node]')).toHaveCount(5);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
  ).toBe(false);
});

test('keeps content static when reduced motion is requested', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.hero-name-word')).toHaveCount(0);
  await expect(page.locator('[data-hero-portrait]')).toHaveCSS('opacity', '1');

  const card = page.locator('.featured-case').first();
  expect(await card.evaluate((element) => element.style.filter)).toBe('');
  expect(await card.evaluate((element) => element.style.boxShadow)).toBe('');
  await expect(page.locator('.signal-spine')).toHaveAttribute(
    'data-reduced-motion',
    'true',
  );
  expect(
    await page.locator('[data-signal-path-active]').getAttribute('style'),
  ).toBeNull();
});
