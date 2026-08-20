import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BobMark } from '@/features/bob/BobMark';

describe('BobMark', () => {
  it('draws two glowing eyes in the accent color, independent of currentColor', () => {
    const { container } = render(<BobMark />);

    const eyes = container.querySelectorAll('[data-bob-eye]');
    expect(eyes).toHaveLength(2);

    for (const eye of eyes) {
      // The eyes live in a group that is NOT filled with the inherited color.
      const eyesGroup = eye.closest('g');
      expect(eyesGroup?.getAttribute('fill')).toBe('var(--accent)');
      expect(eyesGroup?.getAttribute('fill')).not.toBe('currentColor');
      expect(eyesGroup?.getAttribute('filter')).toMatch(/^url\(#.+\)$/);
    }
  });

  it('marks the inner screen so tests can compare the eyes against it', () => {
    const { container } = render(<BobMark />);
    const face = container.querySelector('[data-bob-face]');
    expect(face).not.toBeNull();
    expect(face?.getAttribute('fill')).toBe('#06120d');
  });

  it('renders as a decorative non-focusable icon', () => {
    const { container } = render(<BobMark />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).not.toHaveAttribute('focusable', 'true');
  });
});
