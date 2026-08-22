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
  relatedProjects?: string[];
  content: string;
}

export interface RetrievedEvidence extends KnowledgeChunk {
  score: number;
}

export interface RetrievalCoverage {
  complete: boolean;
  scope: 'overview' | 'focused';
  intents: QueryIntent[];
  requestedTypes: KnowledgeChunk['type'][];
  matchingProjectHrefs: string[];
  roleFocus?: 'ai' | 'frontend';
  usedHistory: boolean;
}

export interface RetrievalResult {
  evidence: RetrievedEvidence[];
  coverage: RetrievalCoverage;
}

type QueryIntent =
  | 'skills'
  | 'qualification'
  | 'strengths'
  | 'resume'
  | 'experience'
  | 'education'
  | 'availability'
  | 'contact'
  | 'candidate'
  | 'projects'
  | 'implementation'
  | 'comparison'
  | 'llm';

const fallbackKnowledge = generatedKnowledge as KnowledgeChunk[];
const knowledgeById = new Map(fallbackKnowledge.map((chunk) => [chunk.id, chunk]));

const intentPrefixes: Record<QueryIntent, string[]> = {
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
  qualification: [
    'qualification',
    'qualified',
    'suitable',
    'fit for',
    'capabilit',
    'can he',
    'квалификац',
    'подходит',
    'соответству',
    'способен',
    'возможност',
    'может ли',
  ],
  strengths: [
    'strength',
    'advantage',
    'why hire',
    'сильн',
    'преимуществ',
    'почему стоит нанять',
    'чем полезен',
  ],
  resume: ['resume', 'curriculum', 'vitae', 'резюме', 'cv'],
  experience: [
    'experience',
    'career',
    'responsibil',
    'duties',
    'commercial',
    'work',
    'опыт',
    'карьер',
    'обязанност',
    'место работы',
    'коммерческ',
    'работал',
    'делал',
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
    'формат работы',
    'занятост',
    'зарплат',
    'релокац',
    'выход',
  ],
  contact: [
    'contact',
    'email',
    'telegram',
    'github',
    'reach',
    'связат',
    'контакт',
    'почт',
    'телеграм',
    'гитхаб',
    'написать',
  ],
  candidate: [
    'candidate',
    'alexander',
    'popoff',
    'кандидат',
    'александр',
    'попов',
    'о себе',
  ],
  projects: ['project', 'case study', 'portfolio work', 'проект', 'кейс', 'портфолио'],
  implementation: [
    'architect',
    'implement',
    'inside',
    'detail',
    'testing',
    'api',
    'how',
    'архитект',
    'реализ',
    'устроен',
    'детал',
    'тест',
  ],
  comparison: ['compare', 'difference', 'versus', ' vs ', 'сравн', 'отлич', 'разниц'],
  llm: [
    'llm',
    'language model',
    'large language model',
    'generative ai',
    'deepseek',
    'openrouter',
    'routerai',
    'summar',
    'языковая модель',
    'языковые модели',
    'языков',
    'нейросет',
    'генеративн',
    'суммариз',
  ],
};

const genericWords = new Set([
  'what',
  'which',
  'does',
  'have',
  'has',
  'tell',
  'show',
  'summarize',
  'about',
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
  'них',
  'про',
  'об',
  'это',
  'этот',
  'эта',
  'там',
]);

const followUpWords = [
  'it',
  'its',
  'that',
  'there',
  'this project',
  'second',
  'first',
  'он',
  'его',
  'это',
  'этот',
  'эта',
  'там',
  'подробнее',
  'второй',
  'первый',
  'последний',
];

function normalizedWords(value: string) {
  const aliases: Record<string, string> = {
    битрикс: 'bitrix24',
    битрикс24: 'bitrix24',
  };
  return value
    .toLocaleLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[\u2010-\u2015-]+/g, ' ')
    .replace(/[^\p{L}\p{N}+#.]+/gu, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => aliases[word] ?? word);
}

function normalizedText(value: string) {
  return normalizedWords(value).join(' ');
}

function matchesPrefix(value: string, prefix: string) {
  const normalizedPrefix = normalizedText(prefix);
  if (normalizedPrefix.includes(' ')) return value.includes(normalizedPrefix);
  return normalizedWords(value).some((word) => word.startsWith(normalizedPrefix));
}

function detectIntents(value: string) {
  const normalized = normalizedText(value);
  return new Set(
    (Object.entries(intentPrefixes) as Array<[QueryIntent, string[]]>)
      .filter(([, prefixes]) =>
        prefixes.some((prefix) => matchesPrefix(normalized, prefix)),
      )
      .map(([intent]) => intent),
  );
}

function detectRoleFocus(value: string): 'ai' | 'frontend' | undefined {
  const words = normalizedWords(value);
  if (
    words.some((word) =>
      ['frontend', 'фронтенд', 'фронт'].some((term) => word.startsWith(term)),
    )
  )
    return 'frontend';
  if (
    words.some((word) =>
      ['ai', 'ии', 'искусственн', 'agent', 'агент'].some((term) => word.startsWith(term)),
    )
  )
    return 'ai';
  return undefined;
}

function isFollowUp(value: string) {
  const normalized = normalizedText(value);
  return (
    normalizedWords(value).length <= 10 &&
    followUpWords.some((word) => normalized.includes(word))
  );
}

function retrievalText(request: ChatRequest) {
  if (!isFollowUp(request.message) || request.history.length === 0) {
    return { value: request.message, usedHistory: false };
  }
  const context = request.history
    .slice(-4)
    .map(({ content }) => content)
    .join(' ');
  return { value: `${context} ${request.message}`, usedHistory: true };
}

function stem(term: string) {
  const prefixes = [
    'frontend',
    'фронтенд',
    'project',
    'проект',
    'technolog',
    'технолог',
    'education',
    'образован',
    'experience',
    'опыт',
    'architect',
    'архитект',
    'implement',
    'реализ',
  ];
  return prefixes.find((prefix) => term.startsWith(prefix)) ?? term;
}

function terms(value: string) {
  return new Set(
    normalizedWords(value)
      .filter((term) => term.length > 2 && !genericWords.has(term))
      .map(stem),
  );
}

function isIntentTerm(term: string) {
  return Object.values(intentPrefixes)
    .flat()
    .some((prefix) => {
      const normalizedPrefix = normalizedText(prefix);
      return !normalizedPrefix.includes(' ') && term.startsWith(normalizedPrefix);
    });
}

function matchingProjectHrefs(locale: ChatRequest['locale'], query: string) {
  const queryTerms = normalizedWords(query).filter(
    (term) =>
      term.length >= 4 &&
      !genericWords.has(term) &&
      !isIntentTerm(term) &&
      !['frontend', 'фронтенд', 'фронт', 'backend'].some((role) => term.startsWith(role)),
  );
  if (queryTerms.length === 0) return [];
  return [
    ...new Set(
      fallbackKnowledge
        .filter((chunk) => chunk.locale === locale && chunk.type === 'project')
        .filter((chunk) => {
          const chunkTerms = normalizedWords(
            `${chunk.title} ${chunk.href} ${chunk.content}`,
          );
          return queryTerms.some((queryTerm) =>
            chunkTerms.some(
              (chunkTerm) =>
                chunkTerm === queryTerm ||
                (Math.min(chunkTerm.length, queryTerm.length) >= 5 &&
                  (chunkTerm.startsWith(queryTerm) || queryTerm.startsWith(chunkTerm))),
            ),
          );
        })
        .map(({ href }) => href),
    ),
  ];
}

function namedProjectHrefs(locale: ChatRequest['locale'], query: string) {
  const normalized = normalizedText(query);
  return [
    ...new Set(
      fallbackKnowledge
        .filter((chunk) => chunk.locale === locale && chunk.type === 'project')
        .filter((chunk) => normalized.includes(normalizedText(chunk.title)))
        .map(({ href }) => href),
    ),
  ];
}

function asksForCompleteList(value: string) {
  const normalized = normalizedText(value);
  return [
    'which project',
    'what project',
    'all project',
    'list project',
    'every project',
    'какие проект',
    'каких проект',
    'все проект',
    'назови проект',
    'перечисли проект',
  ].some((phrase) => normalized.includes(phrase));
}

function scoreChunk(
  chunk: KnowledgeChunk,
  query: string,
  intents: Set<QueryIntent>,
  selectedRole: ChatRequest['role'],
  explicitRole?: 'ai' | 'frontend',
) {
  const queryTerms = terms(query);
  const chunkTerms = terms(`${chunk.title} ${chunk.content}`);
  const matches = [...queryTerms].filter((term) =>
    [...chunkTerms].some(
      (candidate) =>
        candidate === term ||
        (Math.min(candidate.length, term.length) >= 5 &&
          (candidate.startsWith(term) || term.startsWith(candidate))) ||
        (/[а-я]/.test(term) && candidate.slice(0, 4) === term.slice(0, 4)),
    ),
  ).length;
  let score = matches / Math.max(queryTerms.size, 1);
  if (chunk.roles.includes(explicitRole ?? selectedRole))
    score += explicitRole ? 0.22 : 0.08;
  if (intents.has('projects') && chunk.type === 'project') score += 0.5;
  if (intents.has('skills') && ['profile', 'resume'].includes(chunk.type)) score += 0.45;
  if (
    (intents.has('qualification') || intents.has('strengths')) &&
    ['profile', 'resume', 'project'].includes(chunk.type)
  )
    score += 0.42;
  if (intents.has('resume') && chunk.type === 'resume') score += 0.7;
  if (intents.has('experience') && ['resume', 'fact'].includes(chunk.type)) score += 0.45;
  if (intents.has('experience') && chunk.type === 'profile') score += 0.28;
  if (intents.has('education') && ['fact', 'profile'].includes(chunk.type)) score += 0.55;
  if (intents.has('availability') && ['resume', 'profile'].includes(chunk.type))
    score += 0.55;
  if (intents.has('contact') && chunk.type === 'profile') score += 0.7;
  if (intents.has('candidate') && ['profile', 'resume'].includes(chunk.type))
    score += 0.28;
  if (intents.has('llm') && ['project', 'fact'].includes(chunk.type)) score += 0.35;
  if (intents.has('implementation') && chunk.type === 'project') score += 0.18;
  return score;
}

function analyze(request: ChatRequest) {
  const context = retrievalText(request);
  const intents = detectIntents(context.value);
  const roleFocus = detectRoleFocus(context.value);
  const namedProjects = matchingProjectHrefs(request.locale, context.value);
  const titleProjects = namedProjectHrefs(request.locale, context.value);
  const overview =
    intents.has('projects') &&
    titleProjects.length === 0 &&
    (namedProjects.length === 0 ||
      Boolean(roleFocus) ||
      intents.has('llm') ||
      asksForCompleteList(context.value)) &&
    !intents.has('implementation');
  const requestedTypes = new Set<KnowledgeChunk['type']>();
  if (
    intents.has('projects') ||
    intents.has('implementation') ||
    namedProjects.length > 0
  )
    requestedTypes.add('project');
  const relatedFactExists = fallbackKnowledge.some(
    (item) =>
      item.locale === request.locale &&
      item.type === 'fact' &&
      item.relatedProjects?.some((slug) => namedProjects.includes(`/projects/${slug}`)),
  );
  if (
    intents.has('skills') ||
    intents.has('qualification') ||
    intents.has('strengths') ||
    intents.has('candidate') ||
    intents.has('experience') ||
    intents.has('education') ||
    intents.has('availability') ||
    intents.has('contact')
  )
    requestedTypes.add('profile');
  if (
    intents.has('resume') ||
    intents.has('experience') ||
    intents.has('skills') ||
    intents.has('qualification') ||
    intents.has('strengths') ||
    intents.has('education') ||
    intents.has('availability')
  )
    requestedTypes.add('resume');
  if (
    intents.has('education') ||
    intents.has('experience') ||
    intents.has('skills') ||
    intents.has('qualification') ||
    intents.has('strengths') ||
    intents.has('llm') ||
    relatedFactExists
  )
    requestedTypes.add('fact');
  if (intents.has('skills') || intents.has('qualification') || intents.has('strengths'))
    requestedTypes.add('project');
  if (request.mode === 'vacancy') {
    requestedTypes.add('profile');
    requestedTypes.add('resume');
    requestedTypes.add('fact');
    requestedTypes.add('project');
  }
  if (requestedTypes.size === 0) {
    requestedTypes.add('profile');
    requestedTypes.add('resume');
    requestedTypes.add('project');
    requestedTypes.add('fact');
  }
  return {
    ...context,
    intents,
    roleFocus,
    namedProjects,
    overview,
    requestedTypes: [...requestedTypes],
  };
}

function lexicalResult(request: ChatRequest): RetrievalResult {
  const analysis = analyze(request);
  const ranked = fallbackKnowledge
    .filter((chunk) => chunk.locale === request.locale)
    .map((chunk) => ({
      ...chunk,
      score: scoreChunk(
        chunk,
        analysis.value,
        analysis.intents,
        request.role,
        analysis.roleFocus,
      ),
    }))
    .filter(({ score, type }) => score > 0.08 || analysis.requestedTypes.includes(type))
    .sort((left, right) => right.score - left.score);

  let evidence: RetrievedEvidence[];
  let matchingHrefs = analysis.namedProjects;
  if (analysis.overview) {
    const dossier = analysis.intents.has('llm')
      ? ranked.find(
          (item) =>
            item.type === 'fact' &&
            /four projects using llms|четыре проекта с llm/i.test(item.title),
        )
      : undefined;
    const dossierText = dossier ? normalizedText(dossier.content) : '';
    const declaredProjectHrefs = new Set(
      dossier?.relatedProjects?.map((slug) => `/projects/${slug}`) ?? [],
    );
    const projects = ranked
      .filter((item) => {
        if (item.type !== 'project') return false;
        if (dossier) return declaredProjectHrefs.has(item.href);
        return !analysis.roleFocus || item.roles.includes(analysis.roleFocus);
      })
      .sort((left, right) => {
        if (!dossier) return right.score - left.score;
        return (
          dossierText.indexOf(normalizedText(left.title)) -
          dossierText.indexOf(normalizedText(right.title))
        );
      });
    matchingHrefs = [...new Set(projects.map(({ href }) => href))];
    evidence = dossier ? [dossier, ...projects] : projects;
  } else {
    const required = analysis.requestedTypes.flatMap((type) => {
      let candidates = ranked.filter((item) => item.type === type);
      if (type === 'project' && analysis.namedProjects.length > 0) {
        return candidates
          .filter((item) => analysis.namedProjects.includes(item.href))
          .slice(0, 5);
      }
      if (type === 'fact' && analysis.namedProjects.length > 0) {
        candidates = candidates.filter((item) =>
          item.relatedProjects?.some((slug) =>
            analysis.namedProjects.includes(`/projects/${slug}`),
          ),
        );
      }
      return candidates.slice(0, type === 'project' ? 5 : 2);
    });
    evidence = [...new Map(required.map((item) => [item.id, item])).values()].slice(
      0,
      12,
    );
  }

  return {
    evidence,
    coverage: {
      complete: analysis.overview,
      scope: analysis.overview ? 'overview' : 'focused',
      intents: [...analysis.intents],
      requestedTypes: analysis.requestedTypes,
      matchingProjectHrefs: matchingHrefs,
      roleFocus: analysis.roleFocus,
      usedHistory: analysis.usedHistory,
    },
  };
}

export function lexicalRetrieve(request: ChatRequest) {
  return lexicalResult(request).evidence;
}

export async function retrieveEvidence(
  request: ChatRequest,
  provider?: EmbeddingProvider,
  vectorize?: VectorizeIndex,
): Promise<RetrievalResult> {
  const lexical = lexicalResult(request);
  if (!vectorize || !provider || lexical.coverage.complete) return lexical;

  let results: VectorizeMatches;
  try {
    const query = retrievalText(request).value;
    results = await vectorize.query(await provider.embed(query), {
      topK: 12,
      namespace: request.locale,
      returnMetadata: 'none',
    });
  } catch {
    return lexical;
  }

  const semantic = results.matches
    .filter((match) => match.score >= 0.42)
    .flatMap((match) => {
      const current = knowledgeById.get(match.id);
      return current && current.locale === request.locale
        ? [{ ...current, score: match.score }]
        : [];
    });
  const merged = new Map<string, RetrievedEvidence>();
  for (const item of [...lexical.evidence, ...semantic]) {
    const current = merged.get(item.id);
    if (!current || item.score > current.score) merged.set(item.id, item);
  }
  return {
    evidence: [...merged.values()]
      .sort((left, right) => right.score - left.score)
      .slice(0, 12),
    coverage: lexical.coverage,
  };
}

export function citationsFromEvidence(evidence: RetrievedEvidence[]): Citation[] {
  const unique = new Map<string, Citation>();
  for (const { id, title, type, href } of evidence) {
    const key = `${type}:${href}`;
    if (!unique.has(key)) unique.set(key, { id, title, type, href });
  }
  return [...unique.values()];
}
