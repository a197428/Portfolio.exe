import { describe, expect, it, vi } from 'vitest';
import { GigaChatProvider } from './gigachat';

const embedding = Array.from({ length: 1024 }, () => 0.01);

describe('GigaChat provider', () => {
  it('shares an OAuth refresh between concurrent calls', async () => {
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.includes('/oauth'))
        return Response.json({ access_token: 'token', expires_at: Date.now() + 600_000 });
      return Response.json({ data: [{ embedding }] });
    });
    const provider = new GigaChatProvider({
      authorizationKey: 'secret-concurrent',
      fetcher: fetchMock as unknown as typeof fetch,
    });
    const secondProvider = new GigaChatProvider({
      authorizationKey: 'secret-concurrent',
      fetcher: fetchMock as unknown as typeof fetch,
    });
    await Promise.all([provider.embed('one'), secondProvider.embed('two')]);
    expect(
      fetchMock.mock.calls.filter(([url]) => String(url).includes('/oauth')),
    ).toHaveLength(1);
  });

  it('refreshes once and retries after a 401', async () => {
    let embeddingCalls = 0;
    const fetchMock = vi.fn(async (input: string | URL | Request) => {
      const url = String(input);
      if (url.includes('/oauth'))
        return Response.json({
          access_token: randomToken(),
          expires_at: Date.now() + 600_000,
        });
      embeddingCalls += 1;
      return embeddingCalls === 1
        ? new Response(null, { status: 401 })
        : Response.json({ data: [{ embedding }] });
    });
    const provider = new GigaChatProvider({
      authorizationKey: 'secret-retry',
      fetcher: fetchMock as unknown as typeof fetch,
    });
    await expect(provider.embed('question')).resolves.toHaveLength(1024);
    expect(
      fetchMock.mock.calls.filter(([url]) => String(url).includes('/oauth')),
    ).toHaveLength(2);
  });
});

function randomToken() {
  return crypto.randomUUID();
}
