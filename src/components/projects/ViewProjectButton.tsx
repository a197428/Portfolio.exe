import { animate, eases } from 'animejs';
import { ArrowUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAnimeScope } from '@/hooks/useAnimeScope';

// Inputs that mean "the visitor is scrolling manually" — wheel, touch drag, or
// a navigation key. Any of them hands the scroll back to the user.
const SCROLL_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  ' ',
  'Spacebar',
]);

const SCROLL_DURATION = 900;

/**
 * The single "View project" CTA in the outcome column of every case study.
 *
 * Before the first use the button softly breathes via an Anime.js glow loop that
 * lives in the `useAnimeScope` and is reverted as soon as the button is used or
 * the media query demands it. Clicking animates the page back to the top over
 * 900 ms with an `inOut(3)` ease, hands focus to the case title once it lands,
 * and stops breathing for the rest of the visit. A visitor who starts scrolling
 * (wheel, touch, navigation key) takes over instantly and the managed scroll
 * gives up. Reduced motion skips both the pulse and the animated scroll.
 */
export function ViewProjectButton() {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLButtonElement>(null);
  const [viewed, setViewed] = useState(false);
  // The one-shot scroll-to-top animation; null once it settles or is cancelled.
  const scrollRef = useRef<number | null>(null);
  // Tears down listeners, a running scroll, and the scroll-behavior override
  // when the button is clicked again, the user interrupts, or the page unmounts.
  const teardownRef = useRef<(() => void) | null>(null);

  // Calm pre-click glow. The scope owns the pulse and reverts it the moment the
  // button is used (or reduced motion is active), so the glow falls back to its
  // static CSS state with no lingering inline styles.
  const { reducedMotion } = useAnimeScope(rootRef, () => {
    if (viewed) return;
    animate('.view-project-glow', {
      opacity: [0.35, 0.9, 0.35],
      duration: 3400,
      ease: 'inOut(3)',
      loop: true,
    });
  }, [viewed]);

  // Navigating away mid-flight must not leak the animation or its listeners.
  useEffect(() => {
    return () => {
      teardownRef.current?.();
      teardownRef.current = null;
    };
  }, []);

  const handleClick = () => {
    // The click ends the pulse for the rest of the visit, whatever happens next
    // (the scope reverts when `viewed` flips, even if the scroll is cancelled).
    setViewed(true);
    const title = rootRef.current
      ?.closest('.case-detail')
      ?.querySelector<HTMLElement>('h1');
    const landAtTop = () => title?.focus({ preventScroll: true });

    if (reducedMotion) {
      // No pulse (the scope never ran) and no managed scroll: jump straight to
      // the top and hand focus to the title.
      window.scrollTo(0, 0);
      landAtTop();
      return;
    }

    // Freeze the site-wide `scroll-behavior: smooth` so each step lands
    // instantly instead of compounding with the CSS easing.
    const html = document.documentElement;
    const previousBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    const onKey = (event: KeyboardEvent) => {
      if (SCROLL_KEYS.has(event.key)) teardown();
    };
    const cleanup = () => {
      window.removeEventListener('wheel', teardown);
      window.removeEventListener('touchmove', teardown);
      window.removeEventListener('keydown', onKey);
    };
    const teardown = () => {
      if (scrollRef.current != null) cancelAnimationFrame(scrollRef.current);
      scrollRef.current = null;
      cleanup();
      html.style.scrollBehavior = previousBehavior;
      teardownRef.current = null;
    };

    // The standalone anime `animate()` does not tick in this app, so the scroll
    // is driven by a plain requestAnimationFrame loop with the same easing the
    // plan asks for (`inOut(3)`); the glow pulse above still runs through the
    // Anime.js scope as designed.
    const start = window.scrollY;
    const startTime = performance.now();
    const ease = eases.inOut(3);
    const step = (now: number) => {
      const t = Math.min((now - startTime) / SCROLL_DURATION, 1);
      window.scrollTo(0, Math.round(start * (1 - ease(t))));
      if (t < 1) {
        scrollRef.current = requestAnimationFrame(step);
      } else {
        scrollRef.current = null;
        teardown();
        landAtTop();
      }
    };
    scrollRef.current = requestAnimationFrame(step);
    teardownRef.current = teardown;
    window.addEventListener('wheel', teardown, { passive: true });
    window.addEventListener('touchmove', teardown, { passive: true });
    window.addEventListener('keydown', onKey);
  };

  return (
    <button
      type="button"
      ref={rootRef}
      className="view-project-btn"
      data-view-project
      data-viewed={viewed}
      onClick={handleClick}
    >
      <span className="view-project-glow" aria-hidden="true" />
      <ArrowUp size={16} strokeWidth={2.75} aria-hidden="true" />
      <span>{t('project.view')}</span>
    </button>
  );
}
