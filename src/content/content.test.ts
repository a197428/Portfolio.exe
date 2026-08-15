import { content, getProfile, getProject, getProjects } from '@/content';
import { projectSchema } from '@/content/schema';

describe('portfolio content', () => {
  it('has a complete locale pair for every project', () => {
    const slugs = [...new Set(content.projects.map((project) => project.slug))];
    for (const slug of slugs) {
      expect(
        content.projects
          .filter((project) => project.slug === slug)
          .map((project) => project.locale)
          .sort(),
      ).toEqual(['en', 'ru']);
    }
  });

  it('provides the same published avatar for both profile locales', () => {
    expect(getProfile('en').avatar).toBe('/image/avatar.jpg');
    expect(getProfile('ru').avatar).toBe('/image/avatar.jpg');
  });

  it('keeps Bitrix24 featured for both role lenses', () => {
    expect(getProjects('en', 'ai')[0].slug).toBe('bitrix24-integrations');
    expect(getProjects('en', 'frontend')[0].slug).toBe('bitrix24-integrations');
    expect(getProject('bitrix24-integrations', 'ru')?.chapters).toHaveLength(3);
  });

  it('provides an independent video and poster for every Bitrix24 product', () => {
    for (const locale of ['en', 'ru'] as const) {
      const project = getProject('bitrix24-integrations', locale)!;
      expect(project.chapters.map(({ video }) => video)).toEqual([
        '/media/bitrix24-acquiring.mp4',
        '/media/bitrix24-apartsharing.mp4',
        '/media/bitrix24-ttlock.mp4',
      ]);
      expect(
        project.chapters.every(({ poster }) => poster.endsWith('-poster.webp')),
      ).toBe(true);
    }
  });

  it('pins matching evidence sources and factual coverage for both locales', () => {
    const english = getProject('bitrix24-integrations', 'en')!;
    const russian = getProject('bitrix24-integrations', 'ru')!;
    const expectedCommits = [
      'fb1e7824c368c605af504aec994f65c7679fc836',
      '04c33c1f9d615abb9c341fd788bfb4b2715b6544',
      '9b8a91ad48c9ebf7540180ea1b941f5843b4714d',
    ];

    expect(english.chapters.map(({ source }) => source.commit)).toEqual(expectedCommits);
    expect(russian.chapters.map(({ source }) => source.commit)).toEqual(expectedCommits);
    expect(
      english.chapters.map((chapter) => ({
        id: chapter.id,
        status: chapter.status,
        source: chapter.source,
        capabilities: chapter.capabilities.length,
        architecture: chapter.architecture.length,
        verification: chapter.verification.length,
      })),
    ).toEqual(
      russian.chapters.map((chapter) => ({
        id: chapter.id,
        status: chapter.status,
        source: chapter.source,
        capabilities: chapter.capabilities.length,
        architecture: chapter.architecture.length,
        verification: chapter.verification.length,
      })),
    );
  });

  it('requires the evidence contract on every product chapter', () => {
    const project = structuredClone(getProject('bitrix24-integrations', 'en')!);
    const [chapter] = project.chapters;
    expect(chapter).toBeDefined();
    if (!chapter) return;

    const incompleteChapter = { ...chapter } as Partial<typeof chapter>;
    delete incompleteChapter.architecture;
    project.chapters[0] = incompleteChapter as typeof chapter;

    expect(projectSchema.safeParse(project).success).toBe(false);
  });

  it('contains no unfinished resume placeholders', () => {
    expect(JSON.stringify(content)).not.toContain('[указать');
    expect(JSON.stringify(content)).not.toContain('github.com/dashboard');
  });
});
