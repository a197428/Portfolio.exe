import type { ChatRequest } from '../../src/features/bob/contracts';
import type { RetrievedEvidence } from '../knowledge';
import { buildBobPrompt } from '../prompt';
import type { EmbeddingProvider, GenerationProvider } from './provider';

const OAUTH_URL = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';
const API_URL = 'https://api.giga.chat/v1';

interface TokenResponse {
  access_token: string;
  expires_at: number;
}

interface TokenState {
  token?: TokenResponse;
  promise?: Promise<TokenResponse>;
}

const isolateTokens = new Map<string, TokenState>();

interface GigaChatProviderOptions {
  authorizationKey: string;
  scope?: string;
  fetcher?: typeof fetch;
  now?: () => number;
}

export class GigaChatError extends Error {
  constructor(
    readonly kind: 'auth' | 'unavailable',
    message: string,
  ) {
    super(message);
  }
}

export class GigaChatProvider implements GenerationProvider, EmbeddingProvider {
  readonly id = 'gigachat';
  private readonly tokenState: TokenState;
  private readonly fetcher: typeof fetch;
  private readonly now: () => number;
  private readonly scope: string;

  constructor(private readonly options: GigaChatProviderOptions) {
    this.fetcher = options.fetcher ?? ((input, init) => fetch(input, init));
    this.now = options.now ?? Date.now;
    this.scope = options.scope ?? 'GIGACHAT_API_PERS';
    const cacheKey = `${options.authorizationKey}\0${this.scope}`;
    this.tokenState = isolateTokens.get(cacheKey) ?? {};
    isolateTokens.set(cacheKey, this.tokenState);
  }

  private async accessToken(force = false): Promise<string> {
    if (
      !force &&
      this.tokenState.token &&
      this.tokenState.token.expires_at - this.now() > 60_000
    ) {
      return this.tokenState.token.access_token;
    }
    if (!force && this.tokenState.promise)
      return (await this.tokenState.promise).access_token;

    this.tokenState.promise = (async () => {
      const response = await this.fetcher(OAUTH_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: `Basic ${this.options.authorizationKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          RqUID: crypto.randomUUID(),
        },
        body: new URLSearchParams({ scope: this.scope }),
      });
      if (!response.ok) throw new GigaChatError('auth', 'GigaChat authorization failed');
      const token = (await response.json()) as TokenResponse;
      if (token.expires_at < 1_000_000_000_000) token.expires_at *= 1_000;
      this.tokenState.token = token;
      return token;
    })();

    try {
      return (await this.tokenState.promise).access_token;
    } finally {
      this.tokenState.promise = undefined;
    }
  }

  private async authorizedFetch(
    path: string,
    init: RequestInit,
    retry = true,
  ): Promise<Response> {
    const token = await this.accessToken();
    const response = await this.fetcher(`${API_URL}${path}`, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${token}` },
    });
    if (response.status === 401 && retry) {
      this.tokenState.token = undefined;
      await this.accessToken(true);
      return this.authorizedFetch(path, init, false);
    }
    if (response.status === 401 || response.status === 403) {
      throw new GigaChatError('auth', 'GigaChat rejected the credentials');
    }
    if (!response.ok)
      throw new GigaChatError('unavailable', `GigaChat returned ${response.status}`);
    return response;
  }

  async embed(input: string): Promise<number[]> {
    const response = await this.authorizedFetch('/embeddings', {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'Embeddings', input: [input] }),
    });
    const payload = (await response.json()) as { data?: Array<{ embedding?: number[] }> };
    const embedding = payload.data?.[0]?.embedding;
    if (!embedding || embedding.length !== 1024) {
      throw new GigaChatError('unavailable', 'GigaChat returned an invalid embedding');
    }
    return embedding;
  }

  async stream(
    request: ChatRequest,
    evidence: RetrievedEvidence[],
    signal?: AbortSignal,
  ): Promise<ReadableStream<Uint8Array>> {
    const messages = [
      { role: 'system', content: buildBobPrompt(request, evidence) },
      ...request.history,
      { role: 'user', content: request.message },
    ];
    const response = await this.authorizedFetch('/chat/completions', {
      method: 'POST',
      headers: { Accept: 'text/event-stream', 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'GigaChat-3-Ultra', messages, stream: true }),
      signal,
    });
    if (!response.body)
      throw new GigaChatError('unavailable', 'GigaChat returned no stream');
    return response.body;
  }
}
