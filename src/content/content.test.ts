import { content, getProject, getProjects } from '@/content';

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

  it('contains no unfinished resume placeholders', () => {
    expect(JSON.stringify(content)).not.toContain('[указать');
    expect(JSON.stringify(content)).not.toContain('github.com/dashboard');
  });
});
