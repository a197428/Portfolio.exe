import { describe, expect, it, vi } from 'vitest';
import { DEFAULT_ROUTERAI_MODEL, RouterAIError, RouterAIProvider } from './routerai';

const request = {
  mode: 'qa' as const,
  message: 'What is verified?',
  history: [],
  locale: 'en' as const,
  role: 'ai' as const,
};
const evidence = [
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
];

describe('RouterAI provider', () => {
  it('uses the configured OpenAI-compatible streaming endpoint', async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request, init?: RequestInit) => {
      void input;
      void init;
      return new Response(
        new ReadableStream({ start: (controller) => controller.close() }),
      );
    });
    const provider = new RouterAIProvider({
      apiKey: 'routerai-test-key',
      fetcher: fetchMock as unknown as typeof fetch,
    });

    await provider.stream(request, evidence);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://routerai.ru/api/v1/chat/completions');
    expect(init?.headers).toMatchObject({
      Authorization: 'Bearer routerai-test-key',
    });
    expect(JSON.parse(String(init?.body))).toMatchObject({
      model: DEFAULT_ROUTERAI_MODEL,
      stream: true,
    });
  });

  it('classifies rejected keys without exposing the provider response', async () => {
    const provider = new RouterAIProvider({
      apiKey: 'bad-key',
      fetcher: vi.fn(
        async () => new Response('private detail', { status: 403 }),
      ) as unknown as typeof fetch,
    });

    await expect(provider.stream(request, evidence)).rejects.toEqual(
      expect.objectContaining<Partial<RouterAIError>>({ kind: 'auth' }),
    );
  });
});
