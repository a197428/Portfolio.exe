import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { format } from 'prettier';
import { contentSchema, profileSchema, projectSchema } from '../src/content/schema';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

async function parseMarkdown(path: string, kind: 'profile' | 'project') {
  const source = await readFile(path, 'utf8');
  const parsed = matter(source);
  const value = { ...parsed.data, body: parsed.content.trim() };
  return kind === 'profile' ? profileSchema.parse(value) : projectSchema.parse(value);
}

const profileDir = resolve(root, 'content/profile');
const projectDir = resolve(root, 'content/projects');
const profiles = await Promise.all(
  (await readdir(profileDir))
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => parseMarkdown(resolve(profileDir, name), 'profile')),
);
const projectFolders = (await readdir(projectDir, { withFileTypes: true })).filter(
  (entry) => entry.isDirectory(),
);
const projects = (
  await Promise.all(
    projectFolders.map(async (folder) =>
      Promise.all(
        (await readdir(resolve(projectDir, folder.name)))
          .filter((name) => name.endsWith('.md'))
          .sort()
          .map((name) =>
            parseMarkdown(resolve(projectDir, folder.name, name), 'project'),
          ),
      ),
    ),
  )
).flat();

const content = contentSchema.parse({ profiles, projects });
const output = await format(JSON.stringify(content), { parser: 'json', printWidth: 90 });
await writeFile(resolve(root, 'src/generated/content.json'), output);
console.log(
  `content: ${profiles.length} profiles, ${projects.length} localized projects`,
);
