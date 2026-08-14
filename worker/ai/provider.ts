export type PortfolioRole = 'ai' | 'frontend';

export interface GenerateRequest {
  prompt: string;
  locale: 'ru' | 'en';
  role: PortfolioRole;
  evidence: Array<{ source: string; content: string }>;
}

export interface GenerateResult {
  text: string;
  citations: string[];
  provider: string;
  model: string;
}

export interface LLMProvider {
  readonly id: string;
  generate(request: GenerateRequest, signal?: AbortSignal): Promise<GenerateResult>;
}
