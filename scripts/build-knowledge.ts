import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { format } from 'prettier';

interface GeneratedContent {
  profiles: Array<Record<string, unknown> & { locale: 'ru' | 'en'; name: string }>;
  projects: Array<
    Record<string, unknown> & {
      locale: 'ru' | 'en';
      slug: string;
      title: string;
      roles: string[];
    }
  >;
}

interface Chunk {
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

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const generated = JSON.parse(
  await readFile(resolve(root, 'src/generated/content.json'), 'utf8'),
) as GeneratedContent;

function idFor(parts: string[]) {
  return createHash('sha256').update(parts.join('\0')).digest('hex').slice(0, 32);
}

function readable(value: unknown): string[] {
  if (typeof value === 'string') return value.trim() ? [value.trim()] : [];
  if (Array.isArray(value)) return value.flatMap(readable);
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, item]) =>
      ['source', 'media', 'priority'].includes(key) ? [] : readable(item),
    );
  }
  return [];
}

function makeChunk(input: Omit<Chunk, 'id'>, part: number): Chunk {
  const content = input.content.replace(/\s+/g, ' ').trim();
  return {
    ...input,
    content,
    id: idFor([input.locale, input.type, input.href, input.title, String(part), content]),
  };
}

function sourceUrl(value: Record<string, unknown>) {
  const source = value.source;
  if (!source || typeof source !== 'object') return undefined;
  const repository = (source as Record<string, unknown>).repository;
  return typeof repository === 'string' ? repository : undefined;
}

function appendChunks(input: Omit<Chunk, 'id' | 'content'> & { content: string }) {
  const words = input.content.replace(/\s+/g, ' ').trim().split(' ');
  const size = 420;
  for (let offset = 0; offset < words.length; offset += size) {
    chunks.push(
      makeChunk(
        { ...input, content: words.slice(offset, offset + size).join(' ') },
        offset / size,
      ),
    );
  }
}

const chunks: Chunk[] = [];
const supplementalLocales = new Map<string, Set<string>>();
for (const profile of generated.profiles) {
  appendChunks({
    locale: profile.locale,
    type: 'profile',
    title: profile.name,
    href: '/#about',
    route: '/#about',
    roles: ['ai', 'frontend'],
    content: readable(profile).join('\n'),
  });
}

for (const project of generated.projects) {
  appendChunks({
    locale: project.locale,
    type: 'project',
    title: project.title,
    href: `/projects/${project.slug}`,
    route: `/projects/${project.slug}`,
    sourceUrl: sourceUrl(project),
    roles: project.roles,
    content: readable(project).join('\n'),
  });
}

for (const [directory, type] of [
  ['resume', 'resume'],
  ['facts', 'fact'],
] as const) {
  const base = resolve(root, 'content', directory);
  for (const name of await readdir(base)) {
    if (extname(name) !== '.md' || name.toLowerCase() === 'readme.md') continue;
    const parsed = matter(await readFile(resolve(base, name), 'utf8'));
    const locale = parsed.data.locale;
    if (locale !== 'ru' && locale !== 'en') {
      throw new Error(`${directory}/${name}: locale must be ru or en`);
    }
    if (typeof parsed.data.key !== 'string' || !parsed.data.key.trim()) {
      throw new Error(`${directory}/${name}: key is required for RU/EN parity`);
    }
    const pairKey = `${type}:${parsed.data.key}`;
    const locales = supplementalLocales.get(pairKey) ?? new Set<string>();
    locales.add(locale);
    supplementalLocales.set(pairKey, locales);
    appendChunks({
      locale,
      type,
      title: String(parsed.data.title ?? (type === 'resume' ? 'Resume' : 'Fact')),
      href: String(parsed.data.href ?? '/#about'),
      route: String(parsed.data.route ?? parsed.data.href ?? '/#about'),
      sourceUrl:
        typeof parsed.data.sourceUrl === 'string' ? parsed.data.sourceUrl : undefined,
      roles: Array.isArray(parsed.data.roles)
        ? parsed.data.roles.map(String)
        : ['ai', 'frontend'],
      relatedProjects: Array.isArray(parsed.data.relatedProjects)
        ? parsed.data.relatedProjects.map(String)
        : undefined,
      content: parsed.content,
    });
  }
}

for (const [key, locales] of supplementalLocales) {
  if (locales.size !== 2) throw new Error(`${key}: expected matching ru/en documents`);
}

const output = await format(JSON.stringify(chunks), { parser: 'json', printWidth: 90 });
await writeFile(resolve(root, 'worker/knowledge.generated.json'), output);
console.log(`knowledge: ${chunks.length} verified chunks`);
