import { describe, expect, it, vi } from 'vitest';
import { lexicalRetrieve, retrieveEvidence } from './knowledge';

describe('knowledge retrieval fallback', () => {
  it.each([
    ['ru', 'У кандидата есть фронтенд-проекты. Расскажи о них'],
    ['ru', 'Какие проекты фронтенда есть в портфолио?'],
    ['en', 'Tell me about all frontend projects'],
  ] as const)('returns the complete frontend catalog: %s', async (locale, message) => {
    const result = await retrieveEvidence({
      mode: 'qa',
      message,
      history: [],
      locale,
      role: 'ai',
    });
    const hrefs = new Set(
      result.evidence.filter(({ type }) => type === 'project').map(({ href }) => href),
    );
    expect(result.coverage.complete).toBe(true);
    expect(result.coverage.roleFocus).toBe('frontend');
    expect(hrefs).toEqual(
      new Set([
        '/projects/bitrix24-integrations',
        '/projects/energo-ai',
        '/projects/neuralgrid-international',
        '/projects/neurosport',
        '/projects/neurosport-tma',
        '/projects/shortsport-ai-forge',
        '/projects/todo-app',
        '/projects/video-sut',
      ]),
    );
    expect(hrefs.has('/projects/read-close-bot')).toBe(false);
  });

  it('uses verified lexical knowledge when embeddings or Vectorize fail', async () => {
    const { evidence } = await retrieveEvidence(
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

  it.each([
    ['ru', 'Какими навыками владеет Александр?', 'ai'],
    ['en', 'What skills and capabilities does Alexander have?', 'frontend'],
    ['ru', 'В чём сильные стороны кандидата и чем они подтверждены?', 'frontend'],
    ['en', 'Why is Alexander qualified for an AI application developer role?', 'ai'],
  ] as const)(
    'grounds capabilities in the candidate dossier and project evidence: %s',
    (locale, message, role) => {
      const evidence = lexicalRetrieve({
        mode: 'qa',
        message,
        history: [],
        locale,
        role,
      });
      expect(evidence.some(({ type }) => type === 'profile')).toBe(true);
      expect(evidence.some(({ type }) => type === 'resume')).toBe(true);
      expect(evidence.some(({ type }) => type === 'project')).toBe(true);
    },
  );

  it.each([
    ['ru', 'Как связаться с Александром?'],
    ['en', 'How can I contact Alexander?'],
  ] as const)('retrieves only verified public contact details: %s', (locale, message) => {
    const evidence = lexicalRetrieve({
      mode: 'qa',
      message,
      history: [],
      locale,
      role: 'ai',
    });
    expect(evidence.some(({ type }) => type === 'profile')).toBe(true);
    expect(evidence.some(({ content }) => content.includes('a197428@yandex.ru'))).toBe(
      true,
    );
  });

  it.each([
    ['ru', 'Нужны React, TypeScript, LLM, RAG и опыт production-разработки'],
    ['en', 'We need React, TypeScript, LLM, RAG and production experience'],
  ] as const)(
    'assembles a complete evidence mix for vacancies: %s',
    (locale, message) => {
      const evidence = lexicalRetrieve({
        mode: 'vacancy',
        message,
        history: [],
        locale,
        role: 'ai',
      });
      expect(new Set(evidence.map(({ type }) => type))).toEqual(
        new Set(['profile', 'resume', 'fact', 'project']),
      );
    },
  );

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
    const { evidence } = await retrieveEvidence(
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

  it('uses recent conversation context for a short follow-up', async () => {
    const result = await retrieveEvidence({
      mode: 'qa',
      message: 'А какие технологии там использованы?',
      history: [
        { role: 'user', content: 'Расскажи про Todo App' },
        { role: 'assistant', content: 'Todo App — проект на Nuxt и Vue.' },
      ],
      locale: 'ru',
      role: 'frontend',
    });
    expect(result.coverage.usedHistory).toBe(true);
    expect(result.evidence.some(({ href }) => href === '/projects/todo-app')).toBe(true);
  });

  it('hydrates semantic matches from current local knowledge and ignores stale ids', async () => {
    const local = lexicalRetrieve({
      mode: 'qa',
      message: 'Cloudflare Workers',
      history: [],
      locale: 'en',
      role: 'ai',
    })[0];
    const result = await retrieveEvidence(
      {
        mode: 'qa',
        message: 'Cloudflare Workers',
        history: [],
        locale: 'en',
        role: 'ai',
      },
      { id: 'embedding', embed: vi.fn(async () => [0.1, 0.2]) },
      {
        query: vi.fn(async () => ({
          matches: [
            { id: 'stale-id', score: 0.99, metadata: { content: 'stale' } },
            { id: local.id, score: 0.98, metadata: { content: 'tampered' } },
          ],
        })),
      } as unknown as VectorizeIndex,
    );
    expect(result.evidence.some(({ id }) => id === 'stale-id')).toBe(false);
    expect(result.evidence.find(({ id }) => id === local.id)?.content).toBe(
      local.content,
    );
  });
});
