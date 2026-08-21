import type { ChatRequest } from '../../src/features/bob/contracts';
import type { RetrievalResult } from '../knowledge';
import { buildBobPrompt } from '../prompt';
import type { GenerationProvider } from './provider';

const API_URL = 'https://openrouter.ai/api/v1';
export const DEFAULT_OPENROUTER_MODEL = 'nvidia/nemotron-3-ultra-550b-a55b:free';

interface OpenRouterOptions {
  apiKey: string;
  model?: string;
  siteUrl?: string;
  fetcher?: typeof fetch;
}

export class OpenRouterError extends Error {
  constructor(
    readonly kind: 'auth' | 'unavailable',
    message: string,
  ) {
    super(message);
  }
}

export class OpenRouterProvider implements GenerationProvider {
  readonly id = 'openrouter';
  private readonly fetcher: typeof fetch;

  constructor(private readonly options: OpenRouterOptions) {
    this.fetcher = options.fetcher ?? ((input, init) => fetch(input, init));
  }

  async stream(
    request: ChatRequest,
    retrieval: RetrievalResult,
    signal?: AbortSignal,
  ): Promise<ReadableStream<Uint8Array>> {
    const headers: Record<string, string> = {
      Accept: 'text/event-stream',
      Authorization: `Bearer ${this.options.apiKey}`,
      'Content-Type': 'application/json',
      'X-OpenRouter-Title': 'Portfolio.exe Bob',
    };
    if (this.options.siteUrl) headers['HTTP-Referer'] = this.options.siteUrl;

    const response = await this.fetcher(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: this.options.model ?? DEFAULT_OPENROUTER_MODEL,
        messages: [
          { role: 'system', content: buildBobPrompt(request, retrieval) },
          ...request.history,
          { role: 'user', content: request.message },
        ],
        stream: true,
        temperature: 0.2,
        max_tokens: 1_200,
      }),
      signal,
    });

    if (response.status === 401 || response.status === 403) {
      throw new OpenRouterError('auth', 'OpenRouter rejected the API key');
    }
    if (!response.ok) {
      throw new OpenRouterError('unavailable', `OpenRouter returned ${response.status}`);
    }
    if (!response.body) {
      throw new OpenRouterError('unavailable', 'OpenRouter returned no stream');
    }
    return response.body;
  }
}
