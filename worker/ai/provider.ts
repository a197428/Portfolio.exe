import type { ChatRequest } from '../../src/features/bob/contracts';
import type { RetrievedEvidence } from '../knowledge';

export interface LLMProvider {
  readonly id: string;
  embed(input: string): Promise<number[]>;
  stream(
    request: ChatRequest,
    evidence: RetrievedEvidence[],
    signal?: AbortSignal,
  ): Promise<ReadableStream<Uint8Array>>;
}
