import { afterEach, describe, expect, it, vi } from 'vitest';
import { app } from './index';

const requestBody = {
  mode: 'qa',
  message: 'What does the agent use?',
  history: [],
  locale: 'en',
  role: 'ai',
};

afterEach(() => vi.restoreAllMocks());

describe('Bob Worker API', () => {
  it('rejects malformed input before contacting providers', async () => {
    const response = await app.request('/api/chat', { method: 'POST', body: '{}' });
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({
      error: { code: 'validation' },
    });
  });

  it('streams only retrieved evidence and safe citations', async () => {
    const encoder = new TextEncoder();
    const upstream = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            'data: {"choices":[{"delta":{"content":"Grounded answer [1]"}}]}\n\n',
          ),
        );
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL | Request) => {
        const url = String(input);
        if (url.includes('/oauth'))
          return Response.json({
            access_token: 'access',
            expires_at: Date.now() + 600_000,
          });
        if (url.includes('/embeddings'))
          return Response.json({ data: [{ embedding: Array(1024).fill(0.01) }] });
        if (url.includes('/chat/completions')) return new Response(upstream);
        throw new Error(`Unexpected URL: ${url}`);
      }),
    );
    const knowledge = {
      query: vi.fn(async () => ({
        matches: [
          {
            id: 'read-close',
            score: 0.9,
            metadata: {
              type: 'project',
              title: 'Read-Close-Bot',
              href: '/projects/read-close-bot',
              roles: ['ai'],
              content: 'Runs on Cloudflare Workers.',
            },
          },
        ],
      })),
    } as unknown as VectorizeIndex;
    const response = await app.request(
      '/api/chat',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      },
      {
        OPENROUTER_API_KEY: 'openrouter-secret',
        GIGACHAT_AUTH_KEY: 'authorization-secret',
        GIGACHAT_EMBEDDINGS_ENABLED: 'true',
        KNOWLEDGE: knowledge,
      },
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    const body = await response.text();
    expect(body).toContain('Read-Close-Bot');
    expect(body).toContain('Grounded answer [1]');
    expect(body).not.toContain('authorization-secret');
    expect(body).not.toContain('openrouter-secret');
  });

  it('falls back to RouterAI when OpenRouter cannot start a response', async () => {
    const calls: string[] = [];
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: string | URL | Request) => {
        const url = String(input);
        calls.push(url);
        if (url.startsWith('https://openrouter.ai/')) {
          return new Response('unavailable', { status: 503 });
        }
        if (url.startsWith('https://routerai.ru/')) {
          return new Response(
            'data: {"choices":[{"delta":{"content":"Fallback answer"}}]}\n\ndata: [DONE]\n\n',
            { headers: { 'Content-Type': 'text/event-stream' } },
          );
        }
        throw new Error(`Unexpected URL: ${url}`);
      }),
    );

    const response = await app.request(
      '/api/chat',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      },
      {
        OPENROUTER_API_KEY: 'primary-key',
        ROUTERAI_API_KEY: 'fallback-key',
      },
    );

    expect(response.status).toBe(200);
    await expect(response.text()).resolves.toContain('Fallback answer');
    expect(calls).toEqual([
      'https://openrouter.ai/api/v1/chat/completions',
      'https://routerai.ru/api/v1/chat/completions',
    ]);
  });
});
