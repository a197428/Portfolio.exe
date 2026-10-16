export const FIRST_TOKEN_TIMEOUT_MS = 20_000;

export class GenerationStartError extends Error {
  constructor(
    readonly reason: 'timeout' | 'empty_stream' | 'upstream_error',
    message: string,
  ) {
    super(message);
    this.name = 'GenerationStartError';
  }
}

function inspectEvent(line: string) {
  if (!line.startsWith('data:')) return false;
  const data = line.slice(5).trim();
  if (!data) return false;
  if (data === '[DONE]') {
    throw new GenerationStartError(
      'empty_stream',
      'Provider completed before sending answer text',
    );
  }

  let payload: {
    choices?: Array<{
      delta?: { content?: string };
      message?: { content?: string };
    }>;
    error?: { message?: string };
  };
  try {
    payload = JSON.parse(data) as typeof payload;
  } catch {
    return false;
  }
  if (payload.error) {
    throw new GenerationStartError(
      'upstream_error',
      'Provider reported an error before sending answer text',
    );
  }
  const content =
    payload.choices?.[0]?.delta?.content ?? payload.choices?.[0]?.message?.content ?? '';
  return content.length > 0;
}

function replay(buffered: Uint8Array[], reader: ReadableStreamDefaultReader<Uint8Array>) {
  let cancelled = false;
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of buffered) controller.enqueue(chunk);
      void (async () => {
        try {
          while (!cancelled) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
          if (!cancelled) controller.close();
        } catch (error) {
          if (!cancelled) controller.error(error);
        }
      })();
    },
    async cancel(reason) {
      cancelled = true;
      await reader.cancel(reason).catch(() => undefined);
    },
  });
}

async function waitForAnswerText(
  upstream: ReadableStream<Uint8Array>,
  signal: AbortSignal,
) {
  const reader = upstream.getReader();
  const decoder = new TextDecoder();
  const buffered: Uint8Array[] = [];
  let textBuffer = '';
  const abort = () => void reader.cancel(signal.reason).catch(() => undefined);
  signal.addEventListener('abort', abort, { once: true });

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        throw new GenerationStartError(
          'empty_stream',
          'Provider closed before sending answer text',
        );
      }
      buffered.push(value);
      textBuffer += decoder.decode(value, { stream: true });
      const lines = textBuffer.split(/\r?\n/);
      textBuffer = lines.pop() ?? '';
      if (lines.some(inspectEvent)) return replay(buffered, reader);
    }
  } catch (error) {
    await reader.cancel(error).catch(() => undefined);
    throw error;
  } finally {
    signal.removeEventListener('abort', abort);
  }
}

export async function openReadyGenerationStream(
  open: (signal: AbortSignal) => Promise<ReadableStream<Uint8Array>>,
  requestSignal?: AbortSignal,
  timeoutMs = FIRST_TOKEN_TIMEOUT_MS,
) {
  const attempt = new AbortController();
  const abortFromRequest = () => attempt.abort(requestSignal?.reason);
  requestSignal?.addEventListener('abort', abortFromRequest, { once: true });
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      const error = new GenerationStartError(
        'timeout',
        `Provider sent no answer text within ${timeoutMs}ms`,
      );
      attempt.abort(error);
      reject(error);
    }, timeoutMs);
  });

  try {
    const ready = (async () => {
      const upstream = await open(attempt.signal);
      return waitForAnswerText(upstream, attempt.signal);
    })();
    return await Promise.race([ready, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
    requestSignal?.removeEventListener('abort', abortFromRequest);
  }
}
