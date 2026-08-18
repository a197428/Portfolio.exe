import { describe, expect, it, vi } from 'vitest';
import { streamBob } from '@/features/bob/api';

describe('Bob SSE client', () => {
  it('parses events split across transport chunks', async () => {
    const encoder = new TextEncoder();
    vi.stubGlobal(
      'fetch',
      vi.fn(
        async () =>
          new Response(
            new ReadableStream({
              start(controller) {
                controller.enqueue(encoder.encode('event: delta\ndata: {"type":"del'));
                controller.enqueue(encoder.encode('ta","text":"Hi"}\n\n'));
                controller.close();
              },
            }),
          ),
      ),
    );
    const events: unknown[] = [];
    await streamBob(
      { mode: 'qa', message: 'Hello', history: [], locale: 'en', role: 'ai' },
      new AbortController().signal,
      (event) => events.push(event),
    );
    expect(events).toEqual([{ type: 'delta', text: 'Hi' }]);
  });
});
