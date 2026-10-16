import { describe, expect, it, vi } from 'vitest';
import { GenerationStartError, openReadyGenerationStream } from './stream';

const encoder = new TextEncoder();

function stream(...chunks: string[]) {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
      controller.close();
    },
  });
}

describe('generation stream readiness', () => {
  it('buffers and replays the stream after the first answer token', async () => {
    const source = [
      ': keep-alive\n\n',
      'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n',
      'data: [DONE]\n\n',
    ];
    const ready = await openReadyGenerationStream(async () => stream(...source));
    await expect(new Response(ready).text()).resolves.toBe(source.join(''));
  });

  it.each([
    ['data: [DONE]\n\n', 'empty_stream'],
    ['data: {"error":{"message":"busy"}}\n\n', 'upstream_error'],
  ] as const)(
    'rejects an unusable stream before it reaches the client',
    async (body, reason) => {
      await expect(openReadyGenerationStream(async () => stream(body))).rejects.toEqual(
        expect.objectContaining<Partial<GenerationStartError>>({ reason }),
      );
    },
  );

  it('aborts a provider that sends no answer token before the deadline', async () => {
    vi.useFakeTimers();
    const cancelled = vi.fn();
    const pending = openReadyGenerationStream(
      async () =>
        new ReadableStream<Uint8Array>({
          cancel: cancelled,
        }),
      undefined,
      25,
    );
    const rejection = expect(pending).rejects.toEqual(
      expect.objectContaining<Partial<GenerationStartError>>({ reason: 'timeout' }),
    );
    await vi.advanceTimersByTimeAsync(25);
    await rejection;
    expect(cancelled).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
