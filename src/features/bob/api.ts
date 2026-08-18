import type {
  ChatErrorCode,
  ChatRequest,
  ChatStreamEvent,
} from '@/features/bob/contracts';

export class BobApiError extends Error {
  constructor(
    readonly code: ChatErrorCode,
    message: string,
  ) {
    super(message);
  }
}

export async function streamBob(
  request: ChatRequest,
  signal: AbortSignal,
  onEvent: (event: ChatStreamEvent) => void,
) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
    body: JSON.stringify(request),
    cache: 'no-store',
    signal,
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: { code?: string; message?: string };
    } | null;
    throw new BobApiError(
      (payload?.error?.code as ChatErrorCode | undefined) ?? 'provider_unavailable',
      payload?.error?.message ?? 'Bob is unavailable.',
    );
  }
  if (!response.body)
    throw new BobApiError('stream_interrupted', 'Empty response stream.');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split(/\r?\n\r?\n/);
    buffer = frames.pop() ?? '';
    for (const frame of frames) {
      const data = frame
        .split(/\r?\n/)
        .find((line) => line.startsWith('data:'))
        ?.slice(5)
        .trim();
      if (!data) continue;
      onEvent(JSON.parse(data) as ChatStreamEvent);
    }
  }
}
