import generatedKnowledge from './knowledge.generated.json';
import type { ChatRequest, Citation } from '../src/features/bob/contracts';
import type { EmbeddingProvider } from './ai/provider';

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

type CandidateIntent =
  'skills' | 'resume' | 'experience' | 'education' | 'availability' | 'candidate';

const intentPrefixes: Record<CandidateIntent, string[]> = {
  skills: [
    'skill',
    'stack',
    'technolog',
    'навык',
    'умен',
    'компетенц',
    'стек',
    'технолог',
  ],
  resume: ['resume', 'curriculum', 'vitae', 'резюме', 'cv'],
  experience: [
    'experience',
    'career',
    'responsibil',
    'duties',
    'опыт',
    'карьер',
    'обязанност',
    'место',
  ],
  education: [
    'education',
    'degree',
    'diploma',
    'course',
    'learning',
    'book',
    'образован',
    'диплом',
    'курс',
    'обучен',
    'учил',
    'книг',
    'литератур',
  ],
  availability: [
    'availab',
    'remote',
    'relocat',
    'employment',
    'salary',
    'доступ',
    'удален',
    'формат',
    'занятост',
    'зарплат',
    'релокац',
    'выход',
  ],
  candidate: [
    'candidate',
    'alexander',
    'popoff',
    'кандидат',
    'александр',
    'popoff',
    'попов',
    'о себе',
  ],
};

function normalizedWords(value: string) {
  return value
    .toLocaleLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^\p{L}\p{N}+#.-]+/gu, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function canonicalTerm(term: string) {
  for (const [intent, prefixes] of Object.entries(intentPrefixes)) {
    if (prefixes.some((prefix) => !prefix.includes(' ') && term.startsWith(prefix))) {
      return `intent:${intent}`;
    }
  }
  return term;
}

function terms(value: string) {
  return new Set(
    normalizedWords(value)
      .filter((term) => term.length > 2)
      .map(canonicalTerm),
  );
}

function detectIntents(value: string): Set<CandidateIntent> {
  const words = normalizedWords(value);
  const normalized = words.join(' ');
  const intents = new Set<CandidateIntent>();
  for (const [intent, prefixes] of Object.entries(intentPrefixes) as Array<
    [CandidateIntent, string[]]
  >) {
    if (
      prefixes.some((prefix) =>
        prefix.includes(' ')
          ? normalized.includes(prefix)
          : words.some((word) => word.startsWith(prefix)),
      )
    ) {
      intents.add(intent);
    }
  }
  return intents;
}

const genericQuestionWords = new Set([
  'what',
  'which',
  'does',
  'have',
  'has',
  'tell',
  'show',
  'summarize',
  'professional',
  'commercial',
  'his',
  'какой',
  'какие',
  'каким',
  'какими',
  'что',
  'расскажи',
  'расскажите',
  'покажи',
  'кратко',
  'есть',
  'имеет',
  'владеет',
  'него',
  'его',
  'коммерческий',
  'профессиональный',
]);

function hasSpecificSubject(value: string) {
  return normalizedWords(value).some((word) => {
    if (word.length <= 2 || genericQuestionWords.has(word)) return false;
    return !canonicalTerm(word).startsWith('intent:');
  });
}

function intentBoost(type: KnowledgeChunk['type'], intents: Set<CandidateIntent>) {
  let boost = 0;
  if (intents.has('skills')) {
    if (type === 'resume') boost += 0.48;
    if (type === 'profile') boost += 0.38;
    if (type === 'project') boost += 0.08;
  }
  if (intents.has('resume')) {
    if (type === 'resume') boost += 0.72;
    if (type === 'profile') boost += 0.38;
    if (type === 'fact') boost += 0.18;
  }
  if (intents.has('experience')) {
    if (type === 'resume') boost += 0.58;
    if (type === 'profile') boost += 0.36;
    if (type === 'project') boost += 0.08;
  }
  if (intents.has('education')) {
    if (type === 'fact') boost += 0.62;
    if (type === 'resume') boost += 0.18;
    if (type === 'profile') boost += 0.28;
  }
  if (intents.has('availability')) {
    if (type === 'resume') boost += 0.68;
    if (type === 'profile') boost += 0.32;
  }
  if (intents.has('candidate')) {
    if (type === 'profile') boost += 0.62;
    if (type === 'resume') boost += 0.24;
    if (type === 'fact') boost += 0.08;
  }
  return boost;
}

export function lexicalRetrieve(request: ChatRequest): RetrievedEvidence[] {
  const queryTerms = terms(request.message);
  const intents = detectIntents(request.message);
  const ranked = fallbackKnowledge
    .filter((chunk) => chunk.locale === request.locale)
    .map((chunk) => {
      const chunkTerms = terms(`${chunk.title} ${chunk.content}`);
      const matches = [...queryTerms].filter((term) => chunkTerms.has(term)).length;
      const roleBoost = chunk.roles.includes(request.role) ? 0.08 : 0;
      return {
        ...chunk,
        score:
          matches / Math.max(queryTerms.size, 1) +
          roleBoost +
          intentBoost(chunk.type, intents),
      };
    })
    .filter(({ score }) => score > 0.08)
    .sort((left, right) => right.score - left.score);

  if (intents.size === 0) return ranked.slice(0, 8);

  const requiredTypes: KnowledgeChunk['type'][] = ['profile'];
  if ([...intents].some((intent) => intent !== 'education' && intent !== 'candidate')) {
    requiredTypes.push('resume');
  }
  if (intents.has('education')) requiredTypes.push('fact');

  const selected = requiredTypes.flatMap((type) => {
    const match = ranked.find((item) => item.type === type);
    return match ? [match] : [];
  });
  const genericCandidateQuestion =
    request.mode === 'qa' && !hasSpecificSubject(request.message);
  for (const item of ranked) {
    if (selected.length === 8) break;
    if (genericCandidateQuestion && item.type === 'project') continue;
    if (!intents.has('education') && item.type === 'fact') continue;
    if (!selected.some(({ id }) => id === item.id)) selected.push(item);
  }
  return selected;
}

export async function retrieveEvidence(
  request: ChatRequest,
  provider?: EmbeddingProvider,
  vectorize?: VectorizeIndex,
): Promise<RetrievedEvidence[]> {
  if (!vectorize || !provider) return lexicalRetrieve(request);

  let results: VectorizeMatches;
  try {
    const embedding = await provider.embed(request.message);
    results = await vectorize.query(embedding, {
      topK: 8,
      namespace: request.locale,
      returnMetadata: 'all',
    });
  } catch {
    return lexicalRetrieve(request);
  }

  const semanticEvidence = results.matches
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

  const intents = detectIntents(request.message);
  if (intents.size === 0) return semanticEvidence;

  // Semantic retrieval can miss short, general questions such as "skills?". Merge
  // verified profile/resume anchors so production Vectorize behaves like the local fallback.
  const anchors = lexicalRetrieve(request).filter(({ type }) => type !== 'project');
  const merged = new Map<string, RetrievedEvidence>();
  for (const item of [...semanticEvidence, ...anchors]) {
    const current = merged.get(item.id);
    if (!current || item.score > current.score) merged.set(item.id, item);
  }
  return [...merged.values()].sort((left, right) => right.score - left.score).slice(0, 8);
}

export function citationsFromEvidence(evidence: RetrievedEvidence[]): Citation[] {
  return evidence.map(({ id, title, type, href }) => ({ id, title, type, href }));
}
