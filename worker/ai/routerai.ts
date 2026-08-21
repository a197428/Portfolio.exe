import type { ChatRequest } from '../../src/features/bob/contracts';
import type { RetrievalResult } from '../knowledge';
import { buildBobPrompt } from '../prompt';
import type { GenerationProvider } from './provider';

const DEFAULT_API_URL = 'https://routerai.ru/api/v1';
export const DEFAULT_ROUTERAI_MODEL = 'deepseek/deepseek-v4-flash-0731';

interface RouterAIOptions {
  apiKey: string;
  model?: string;
  baseUrl?: string;
  fetcher?: typeof fetch;
}

export class RouterAIError extends Error {
  constructor(
    readonly kind: 'auth' | 'unavailable',
    message: string,
  ) {
    super(message);
  }
}

export class RouterAIProvider implements GenerationProvider {
  readonly id = 'routerai';
  private readonly fetcher: typeof fetch;

  constructor(private readonly options: RouterAIOptions) {
    this.fetcher = options.fetcher ?? ((input, init) => fetch(input, init));
  }

  async stream(
    request: ChatRequest,
    retrieval: RetrievalResult,
    signal?: AbortSignal,
  ): Promise<ReadableStream<Uint8Array>> {
    const baseUrl = (this.options.baseUrl ?? DEFAULT_API_URL).replace(/\/$/, '');
    let response: Response;
    try {
      response = await this.fetcher(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Accept: 'text/event-stream',
          Authorization: `Bearer ${this.options.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.options.model ?? DEFAULT_ROUTERAI_MODEL,
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
    } catch (error) {
      if (signal?.aborted) throw error;
      throw new RouterAIError('unavailable', 'RouterAI request failed');
    }

    if (response.status === 401 || response.status === 403) {
      throw new RouterAIError('auth', 'RouterAI rejected the API key');
    }
    if (!response.ok) {
      throw new RouterAIError('unavailable', `RouterAI returned ${response.status}`);
    }
    if (!response.body) {
      throw new RouterAIError('unavailable', 'RouterAI returned no stream');
    }
    return response.body;
  }
}
