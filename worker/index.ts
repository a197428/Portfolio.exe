import { Hono } from 'hono';
import { chatRequestSchema, type ChatStreamEvent } from '../src/features/bob/contracts';
import { GigaChatError, GigaChatProvider } from './ai/gigachat';
import { citationsFromEvidence, retrieveEvidence } from './knowledge';

interface Env {
  GIGACHAT_AUTH_KEY?: string;
  GIGACHAT_SCOPE?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_SITE_KEY?: string;
  TURNSTILE_HOSTNAME?: string;
  KNOWLEDGE?: VectorizeIndex;
  ANON_RATE_LIMITER?: RateLimit;
  VERIFIED_RATE_LIMITER?: RateLimit;
}

const app = new Hono<{ Bindings: Env }>();
const encoder = new TextEncoder();

function sse(event: ChatStreamEvent) {
  return encoder.encode(`event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
}

function safeError(code: string, message: string) {
  return { error: { code, message } };
}

async function visitorKey(request: Request) {
  const ip = request.headers.get('CF-Connecting-IP') ?? 'local';
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(ip));
  return [...new Uint8Array(digest)]
    .slice(0, 12)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

async function validateTurnstile(token: string, request: Request, env: Env) {
  if (!env.TURNSTILE_SECRET_KEY) return false;
  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: request.headers.get('CF-Connecting-IP') ?? undefined,
        idempotency_key: crypto.randomUUID(),
      }),
    },
  );
  if (!response.ok) return false;
  const result = (await response.json()) as {
    success?: boolean;
    hostname?: string;
    action?: string;
  };
  return Boolean(
    result.success &&
    (!env.TURNSTILE_HOSTNAME || result.hostname === env.TURNSTILE_HOSTNAME) &&
    result.action === 'bob-chat',
  );
}

async function enforceRateLimit(request: Request, env: Env, token?: string) {
  const key = await visitorKey(request);
  if (token) {
    if (!(await validateTurnstile(token, request, env)))
      return 'challenge_required' as const;
    const result = await env.VERIFIED_RATE_LIMITER?.limit({ key });
    return result && !result.success ? ('rate_limit' as const) : null;
  }
  const result = await env.ANON_RATE_LIMITER?.limit({ key });
  return result && !result.success ? ('challenge_required' as const) : null;
}

function bobStream(
  upstream: ReadableStream<Uint8Array>,
  sources: ReturnType<typeof citationsFromEvidence>,
  requestId: string,
  onComplete: (usage?: { prompt: number; completion: number }) => void,
) {
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(sse({ type: 'sources', sources }));
      const reader = upstream.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let usage: { prompt: number; completion: number } | undefined;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() ?? '';
          for (const line of lines) {
            if (!line.startsWith('data:')) continue;
            const data = line.slice(5).trim();
            if (!data || data === '[DONE]') continue;
            const payload = JSON.parse(data) as {
              choices?: Array<{
                delta?: { content?: string };
                message?: { content?: string };
              }>;
              usage?: { prompt_tokens?: number; completion_tokens?: number };
            };
            if (payload.usage) {
              usage = {
                prompt: payload.usage.prompt_tokens ?? 0,
                completion: payload.usage.completion_tokens ?? 0,
              };
            }
            const text =
              payload.choices?.[0]?.delta?.content ??
              payload.choices?.[0]?.message?.content ??
              '';
            if (text) controller.enqueue(sse({ type: 'delta', text }));
          }
        }
        controller.enqueue(sse({ type: 'done', requestId, usage }));
        onComplete(usage);
      } catch {
        controller.enqueue(
          sse({
            type: 'error',
            code: 'stream_interrupted',
            message: 'Bob lost the connection before finishing the answer.',
          }),
        );
        await reader.cancel().catch(() => undefined);
      } finally {
        controller.close();
      }
    },
  });
}

app.get('/api/health', (context) =>
  context.json({ status: 'ok', service: 'portfolio-exe' }),
);

app.get('/api/bob/config', (context) =>
  context.json({ turnstileSiteKey: context.env.TURNSTILE_SITE_KEY ?? null }),
);

app.post('/api/chat', async (context) => {
  const requestId = crypto.randomUUID();
  const startedAt = Date.now();
  let raw: unknown;
  try {
    raw = await context.req.json();
  } catch {
    return context.json(safeError('validation', 'Request body must be valid JSON.'), 400);
  }
  const parsed = chatRequestSchema.safeParse(raw);
  if (!parsed.success) {
    return context.json(safeError('validation', 'Check the message and try again.'), 400);
  }

  const limited = await enforceRateLimit(
    context.req.raw,
    context.env,
    parsed.data.turnstileToken,
  );
  if (limited) {
    return context.json(
      safeError(
        limited,
        limited === 'rate_limit'
          ? 'Too many requests. Please wait a minute.'
          : 'Please confirm that you are human to continue.',
      ),
      limited === 'rate_limit' ? 429 : 403,
    );
  }

  if (!context.env.GIGACHAT_AUTH_KEY) {
    return context.json(
      safeError('provider_unavailable', 'Bob is not configured in this environment yet.'),
      503,
    );
  }

  const provider = new GigaChatProvider({
    authorizationKey: context.env.GIGACHAT_AUTH_KEY,
    scope: context.env.GIGACHAT_SCOPE,
  });

  try {
    const evidence = await retrieveEvidence(parsed.data, provider, context.env.KNOWLEDGE);
    if (evidence.length === 0) {
      return context.json(
        safeError(
          'no_evidence',
          parsed.data.locale === 'ru'
            ? 'У Боба нет подтверждённых данных для точного ответа.'
            : 'Bob has no verified evidence for an accurate answer.',
        ),
        404,
      );
    }
    const upstream = await provider.stream(parsed.data, evidence, context.req.raw.signal);
    console.log(
      JSON.stringify({
        event: 'bob_chat',
        requestId,
        mode: parsed.data.mode,
        locale: parsed.data.locale,
        evidenceCount: evidence.length,
        latencyMs: Date.now() - startedAt,
        status: 'streaming',
      }),
    );
    return new Response(
      bobStream(upstream, citationsFromEvidence(evidence), requestId, (usage) => {
        console.log(
          JSON.stringify({
            event: 'bob_chat_complete',
            requestId,
            mode: parsed.data.mode,
            locale: parsed.data.locale,
            evidenceCount: evidence.length,
            latencyMs: Date.now() - startedAt,
            status: 'complete',
            usage,
          }),
        );
      }),
      {
        headers: {
          'Cache-Control': 'no-store',
          'Content-Type': 'text/event-stream; charset=utf-8',
          'X-Accel-Buffering': 'no',
        },
      },
    );
  } catch (error) {
    const auth = error instanceof GigaChatError && error.kind === 'auth';
    console.error(
      JSON.stringify({
        event: 'bob_chat',
        requestId,
        mode: parsed.data.mode,
        locale: parsed.data.locale,
        latencyMs: Date.now() - startedAt,
        status: auth ? 'provider_auth' : 'provider_unavailable',
      }),
    );
    return context.json(
      safeError(
        auth ? 'provider_auth' : 'provider_unavailable',
        'Bob cannot reach the language model right now. Please try again later.',
      ),
      503,
    );
  }
});

app.notFound((context) => context.json({ error: 'Not found' }, 404));

export { app };
export default app;
