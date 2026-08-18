import generatedKnowledge from './knowledge.generated.json';
import type { ChatRequest, Citation } from '../src/features/bob/contracts';
import type { GigaChatProvider } from './ai/gigachat';

export interface KnowledgeChunk {
  id: string;
  locale: 'ru' | 'en';
  type: 'profile' | 'project' | 'resume' | 'fact';
  title: string;
  href: string;
  route: string;
  sourceUrl?: string;
  roles: string[];
  content: string;
}

export interface RetrievedEvidence extends KnowledgeChunk {
  score: number;
}

const fallbackKnowledge = generatedKnowledge as KnowledgeChunk[];

function terms(value: string) {
  return new Set(
    value
      .toLocaleLowerCase()
      .replace(/[^\p{L}\p{N}+#.-]+/gu, ' ')
      .split(/\s+/)
      .filter((term) => term.length > 2),
  );
}

function lexicalRetrieve(request: ChatRequest): RetrievedEvidence[] {
  const queryTerms = terms(request.message);
  return fallbackKnowledge
    .filter((chunk) => chunk.locale === request.locale)
    .map((chunk) => {
      const chunkTerms = terms(`${chunk.title} ${chunk.content}`);
      const matches = [...queryTerms].filter((term) => chunkTerms.has(term)).length;
      const roleBoost = chunk.roles.includes(request.role) ? 0.08 : 0;
      return { ...chunk, score: matches / Math.max(queryTerms.size, 1) + roleBoost };
    })
    .filter(({ score }) => score > 0.08)
    .sort((left, right) => right.score - left.score)
    .slice(0, 8);
}

export async function retrieveEvidence(
  request: ChatRequest,
  provider: GigaChatProvider,
  vectorize?: VectorizeIndex,
): Promise<RetrievedEvidence[]> {
  if (!vectorize) return lexicalRetrieve(request);

  const embedding = await provider.embed(request.message);
  const results = await vectorize.query(embedding, {
    topK: 8,
    namespace: request.locale,
    returnMetadata: 'all',
  });

  return results.matches
    .filter((match) => match.score >= 0.42)
    .map((match) => {
      const metadata = match.metadata ?? {};
      return {
        id: match.id,
        locale: request.locale,
        type: String(metadata.type) as KnowledgeChunk['type'],
        title: String(metadata.title ?? 'Portfolio evidence'),
        href: String(metadata.href ?? '/'),
        route: String(metadata.route ?? metadata.href ?? '/'),
        sourceUrl:
          typeof metadata.sourceUrl === 'string' ? metadata.sourceUrl : undefined,
        roles: Array.isArray(metadata.roles) ? metadata.roles.map(String) : [],
        content: String(metadata.content ?? ''),
        score: match.score,
      };
    })
    .filter(({ content }) => content.length > 0);
}

export function citationsFromEvidence(evidence: RetrievedEvidence[]): Citation[] {
  return evidence.map(({ id, title, type, href }) => ({ id, title, type, href }));
}
