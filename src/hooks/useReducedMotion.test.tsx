import { renderHook } from '@testing-library/react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

it('reads the reduced-motion preference', () => {
  vi.spyOn(window, 'matchMedia').mockReturnValue({
    matches: true,
    media: '(prefers-reduced-motion: reduce)',
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });

  const { result } = renderHook(() => useReducedMotion());
  expect(result.current).toBe(true);
});
