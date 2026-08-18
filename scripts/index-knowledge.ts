import { randomUUID } from 'node:crypto';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

interface Chunk {
  id: string;
  locale: 'ru' | 'en';
  type: string;
  title: string;
  href: string;
  route: string;
  sourceUrl?: string;
  roles: string[];
  content: string;
}

const authKey = process.env.GIGACHAT_AUTH_KEY;
if (!authKey) throw new Error('Set GIGACHAT_AUTH_KEY before indexing knowledge.');
const indexName = process.env.VECTORIZE_INDEX ?? 'portfolio-knowledge';
const chunks = JSON.parse(
  await readFile(resolve('worker/knowledge.generated.json'), 'utf8'),
) as Chunk[];
if (process.env.ALLOW_INCOMPLETE_KNOWLEDGE !== '1') {
  for (const type of ['resume', 'fact']) {
    for (const locale of ['ru', 'en']) {
      if (!chunks.some((chunk) => chunk.type === type && chunk.locale === locale)) {
        throw new Error(
          `Knowledge is incomplete: add publication-approved ${type} content for ${locale}, or use ALLOW_INCOMPLETE_KNOWLEDGE=1 for preview only.`,
        );
      }
    }
  }
}

const oauth = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    Authorization: `Basic ${authKey}`,
    'Content-Type': 'application/x-www-form-urlencoded',
    RqUID: randomUUID(),
  },
  body: new URLSearchParams({ scope: process.env.GIGACHAT_SCOPE ?? 'GIGACHAT_API_PERS' }),
});
if (!oauth.ok) throw new Error(`GigaChat OAuth failed: ${oauth.status}`);
const { access_token: accessToken } = (await oauth.json()) as { access_token: string };

const vectors: Array<{
  id: string;
  values: number[];
  namespace: string;
  metadata: object;
}> = [];
for (let offset = 0; offset < chunks.length; offset += 16) {
  const batch = chunks.slice(offset, offset + 16);
  const response = await fetch('https://api.giga.chat/v1/embeddings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'Embeddings',
      input: batch.map(({ content }) => content),
    }),
  });
  if (!response.ok) throw new Error(`GigaChat embeddings failed: ${response.status}`);
  const payload = (await response.json()) as {
    data: Array<{ index: number; embedding: number[] }>;
  };
  for (const result of payload.data) {
    if (result.embedding.length !== 1024) {
      throw new Error(`Expected 1024 dimensions, received ${result.embedding.length}`);
    }
    const chunk = batch[result.index];
    vectors.push({
      id: chunk.id,
      values: result.embedding,
      namespace: chunk.locale,
      metadata: {
        locale: chunk.locale,
        type: chunk.type,
        title: chunk.title,
        href: chunk.href,
        route: chunk.route,
        sourceUrl: chunk.sourceUrl,
        roles: chunk.roles,
        content: chunk.content,
      },
    });
  }
}

const vectorFile = resolve(tmpdir(), `portfolio-knowledge-${randomUUID()}.ndjson`);
await writeFile(vectorFile, vectors.map((vector) => JSON.stringify(vector)).join('\n'));
const run = (args: string[]) => {
  const result = spawnSync('npx', ['wrangler', 'vectorize', ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout);
  return result.stdout;
};

function collectIds(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(collectIds);
  if (!value || typeof value !== 'object') return [];
  const record = value as Record<string, unknown>;
  if (typeof record.id === 'string') return [record.id];
  return ['ids', 'vectors', 'result'].flatMap((key) => collectIds(record[key]));
}

const existing = collectIds(JSON.parse(run(['list-vectors', indexName, '--json'])));
try {
  run(['upsert', indexName, '--file', vectorFile, '--json']);
} finally {
  await unlink(vectorFile).catch(() => undefined);
}
const current = new Set(chunks.map(({ id }) => id));
const stale = existing.filter((id) => !current.has(id));
for (let offset = 0; offset < stale.length; offset += 100) {
  run(['delete-vectors', indexName, '--ids', ...stale.slice(offset, offset + 100)]);
}
console.log(`Indexed ${vectors.length} chunks; removed ${stale.length} stale vectors.`);
