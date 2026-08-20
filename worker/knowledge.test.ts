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

  it.each([
    ['ru', 'В каких проектах используется LLM?'],
    ['ru', 'Назови все проекты с языковыми моделями'],
    ['en', 'Which projects use large language models?'],
    ['en', 'List all projects that use LLMs'],
  ] as const)(
    'returns the exact four-project LLM portfolio set: %s',
    (locale, message) => {
      const evidence = lexicalRetrieve({
        mode: 'qa',
        message,
        history: [],
        locale,
        role: 'ai',
      });
      expect(
        evidence.filter(({ type }) => type === 'project').map(({ href }) => href),
      ).toEqual([
        '/projects/local-ai-assistant',
        '/projects/video-sut',
        '/projects/neurosport-tma',
        '/projects/read-close-bot',
      ]);
      expect(
        evidence.some(({ title }) => /four projects|четыре проекта/i.test(title)),
      ).toBe(true);
      expect(evidence.some(({ href }) => href === '/projects/shortsport-ai-forge')).toBe(
        false,
      );
    },
  );

  it('merges all LLM anchors with production semantic retrieval', async () => {
    const evidence = await retrieveEvidence(
      {
        mode: 'qa',
        message: 'Which projects use LLMs?',
        history: [],
        locale: 'en',
        role: 'ai',
      },
      { id: 'embedding', embed: vi.fn(async () => [0.1, 0.2]) },
      { query: vi.fn(async () => ({ matches: [] })) } as unknown as VectorizeIndex,
    );
    expect(evidence.filter(({ type }) => type === 'project')).toHaveLength(4);
    expect(evidence.some(({ href }) => href === '/projects/shortsport-ai-forge')).toBe(
      false,
    );
  });
});
