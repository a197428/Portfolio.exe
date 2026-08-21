import { describe, expect, it, vi } from 'vitest';
import { OpenRouterError, OpenRouterProvider } from './openrouter';

const request = {
  mode: 'qa' as const,
  message: 'What is verified?',
  history: [],
  locale: 'en' as const,
  role: 'ai' as const,
};
const retrieval = {
  evidence: [
    {
      id: 'project',
      locale: 'en' as const,
      type: 'project' as const,
      title: 'Verified project',
      href: '/projects/verified',
      route: '/projects/verified',
      roles: ['ai'],
      content: 'A verified implementation.',
      score: 0.9,
    },
  ],
  coverage: {
    complete: false,
    scope: 'focused' as const,
    intents: [],
    requestedTypes: ['project' as const],
    matchingProjectHrefs: ['/projects/verified'],
    usedHistory: false,
  },
};

describe('OpenRouter provider', () => {
  it('uses Nemotron free as the primary streaming model', async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      void input;
      void init;
      return new Response(
        new ReadableStream({ start: (controller) => controller.close() }),
      );
    });
    const provider = new OpenRouterProvider({
      apiKey: 'test-key',
      siteUrl: 'https://portfolio.example',
      fetcher: fetchMock as unknown as typeof fetch,
    });
    await provider.stream(request, retrieval);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://openrouter.ai/api/v1/chat/completions');
    expect(init?.headers).toMatchObject({
      Authorization: 'Bearer test-key',
      'HTTP-Referer': 'https://portfolio.example',
    });
    expect(JSON.parse(String(init?.body))).toMatchObject({
      model: 'nvidia/nemotron-3-ultra-550b-a55b:free',
      stream: true,
    });
  });

  it('classifies rejected keys without leaking provider responses', async () => {
    const provider = new OpenRouterProvider({
      apiKey: 'bad-key',
      fetcher: vi.fn(
        async () => new Response('private upstream message', { status: 401 }),
      ) as unknown as typeof fetch,
    });
    await expect(provider.stream(request, retrieval)).rejects.toEqual(
      expect.objectContaining<Partial<OpenRouterError>>({ kind: 'auth' }),
    );
  });
});
