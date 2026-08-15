import '@testing-library/jest-dom/vitest';

// jsdom does not implement IntersectionObserver; framer-motion's whileInView
// needs it. A minimal polyfill that reports everything as visible is enough.
class IntersectionObserverMock {
  readonly root = null;
  readonly rootMargin: string;
  readonly thresholds: readonly number[];
  private readonly callback: IntersectionObserverCallback;

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit,
  ) {
    this.callback = callback;
    this.rootMargin = options?.rootMargin ?? '';
    const threshold = options?.threshold;
    this.thresholds =
      threshold === undefined ? [] : Array.isArray(threshold) ? threshold : [threshold];
  }

  observe(target: Element) {
    this.callback(
      [
        {
          isIntersecting: true,
          target,
          intersectionRatio: 1,
          boundingClientRect: target.getBoundingClientRect(),
          intersectionRect: target.getBoundingClientRect(),
          rootBounds: null,
          time: 0,
        },
      ],
      this as unknown as IntersectionObserver,
    );
  }

  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});
