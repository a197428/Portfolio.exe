import evals from '../../../content/evals/bob.json';
import { describe, expect, it } from 'vitest';

describe('Bob evaluation corpus', () => {
  it('contains at least 30 bilingual grounded and adversarial cases', () => {
    expect(evals.length).toBeGreaterThanOrEqual(30);
    expect(new Set(evals.map(({ locale }) => locale))).toEqual(new Set(['ru', 'en']));
    expect(
      evals.some(({ mode, sources }) => mode === 'vacancy' && sources.length === 0),
    ).toBe(true);
    expect(evals.every(({ forbidden }) => forbidden.length > 0)).toBe(true);
  });
});
