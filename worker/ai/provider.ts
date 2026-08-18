import type { ChatRequest } from '../../src/features/bob/contracts';
import type { RetrievedEvidence } from '../knowledge';

export interface GenerationProvider {
  readonly id: string;
  stream(
    request: ChatRequest,
    evidence: RetrievedEvidence[],
    signal?: AbortSignal,
  ): Promise<ReadableStream<Uint8Array>>;
}

export interface EmbeddingProvider {
  readonly id: string;
  embed(input: string): Promise<number[]>;
}
