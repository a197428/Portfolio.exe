import { describe, expect, it, vi } from 'vitest';
import { lexicalRetrieve, retrieveEvidence } from './knowledge';

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

  it.each([
    ['Какими навыками владеет Александр?', ['profile', 'resume']],
    ['Расскажите о его профессиональном опыте', ['profile', 'resume']],
    ['Покажи резюме кандидата', ['profile', 'resume']],
  ])('recognizes Russian candidate intent and morphology: %s', (message, types) => {
    const evidence = lexicalRetrieve({
      mode: 'qa',
      message,
      history: [],
      locale: 'ru',
      role: 'ai',
    });
    for (const type of types)
      expect(evidence.some((item) => item.type === type)).toBe(true);
  });

  it('retrieves verified education and work-format facts', () => {
    for (const message of [
      'Какое у него образование?',
      'Доступен ли он для удаленной работы?',
    ]) {
      const evidence = lexicalRetrieve({
        mode: 'qa',
        message,
        history: [],
        locale: 'ru',
        role: 'frontend',
      });
      expect(evidence.some(({ type }) => type === 'profile')).toBe(true);
      expect(evidence.some(({ type }) => type === 'resume' || type === 'fact')).toBe(
        true,
      );
    }
  });
});
