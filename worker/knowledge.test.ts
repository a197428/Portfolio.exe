import { describe, expect, it, vi } from 'vitest';
import { retrieveEvidence } from './knowledge';

describe('knowledge retrieval fallback', () => {
  it('uses verified lexical knowledge when embeddings or Vectorize fail', async () => {
    const evidence = await retrieveEvidence(
      {
        mode: 'qa',
        message: 'Cloudflare Workers',
        history: [],
        locale: 'en',
        role: 'ai',
      },
      { id: 'broken', embed: vi.fn(async () => Promise.reject(new Error('offline'))) },
      { query: vi.fn() } as unknown as VectorizeIndex,
    );
    expect(evidence.length).toBeGreaterThan(0);
    expect(evidence.every(({ locale }) => locale === 'en')).toBe(true);
  });
});
