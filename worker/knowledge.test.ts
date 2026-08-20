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

  it.each([
    ['Что Александр делал в SatelAB?', 'SatelAB'],
    ['Как устроена интеграция эквайринга?', 'Acquiring'],
    ['Расскажи про ApartSharing', 'ApartSharing'],
    ['Какой опыт есть с умными замками?', 'TTLock'],
    ['Что он разрабатывал для Битрикс24?', 'Bitrix24'],
  ])('retrieves the SatelAB dossier for a project subject: %s', (message, term) => {
    const evidence = lexicalRetrieve({
      mode: 'qa',
      message,
      history: [],
      locale: 'ru',
      role: 'frontend',
    });
    expect(
      evidence.some(
        ({ type, title, content }) =>
          type === 'fact' && `${title} ${content}`.includes(term),
      ),
    ).toBe(true);
    expect(evidence.some(({ type }) => type === 'project')).toBe(true);
  });

  it('anchors general commercial-experience questions in profile, resume, and SatelAB facts', () => {
    const evidence = lexicalRetrieve({
      mode: 'qa',
      message: 'Расскажи о коммерческом опыте и обязанностях',
      history: [],
      locale: 'ru',
      role: 'frontend',
    });
    expect(evidence.some(({ type }) => type === 'profile')).toBe(true);
    expect(evidence.some(({ type }) => type === 'resume')).toBe(true);
    expect(
      evidence.some(({ type, title }) => type === 'fact' && title.includes('SatelAB')),
    ).toBe(true);
  });
});
