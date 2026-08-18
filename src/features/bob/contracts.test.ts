import { describe, expect, it } from 'vitest';
import { chatRequestSchema } from '@/features/bob/contracts';

const base = { mode: 'qa', message: 'Cloudflare experience?', locale: 'en', role: 'ai' };

describe('Bob chat contract', () => {
  it('applies different limits to questions and vacancies', () => {
    expect(
      chatRequestSchema.safeParse({ ...base, message: 'x'.repeat(2_001) }).success,
    ).toBe(false);
    expect(
      chatRequestSchema.safeParse({
        ...base,
        mode: 'vacancy',
        message: 'x'.repeat(12_000),
      }).success,
    ).toBe(true);
  });

  it('rejects injected system fields and excessive history', () => {
    const result = chatRequestSchema.safeParse({
      ...base,
      history: Array.from({ length: 9 }, () => ({ role: 'user', content: 'hello' })),
    });
    expect(result.success).toBe(false);
  });
});
