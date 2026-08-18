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
    expect(getProfile('en').avatar).toBe('/image/Аватар_1.png');
    expect(getProfile('ru').avatar).toBe('/image/Аватар_1.png');
  });

  it('keeps Bitrix24 featured for both role lenses', () => {
    expect(getProjects('en', 'ai')[0].slug).toBe('bitrix24-integrations');
    expect(getProjects('en', 'frontend')[0].slug).toBe('bitrix24-integrations');
    expect(getProject('bitrix24-integrations', 'ru')?.chapters).toHaveLength(3);
  });

  it('publishes Local AI Assistant only in the AI lens', () => {
    const aiProjects = getProjects('en', 'ai');
    const frontendProjects = getProjects('en', 'frontend');
    const project = getProject('local-ai-assistant', 'en')!;

    expect(aiProjects.some(({ slug }) => slug === project.slug)).toBe(true);
    expect(frontendProjects.some(({ slug }) => slug === project.slug)).toBe(false);
    expect(project.featured).toBe(true);
    expect(project.roles).toEqual(['ai']);
  });

  it('pins matching Local AI Assistant evidence and media for both locales', () => {
    const english = getProject('local-ai-assistant', 'en')!;
    const russian = getProject('local-ai-assistant', 'ru')!;
    const expectedSource = {
      repository: 'https://github.com/a197428/local-ai-assistant-extension',
      commit: '3e76a56162d9d56c3f22014c4c786de1a2d7a8f5',
      verifiedAt: '2026-08-15',
      visibility: 'public',
    };

    expect(english.source).toEqual(expectedSource);
    expect(russian.source).toEqual(expectedSource);
    expect(english.media).toEqual({
      poster: '/media/local-ai-assistant-poster.webp',
      video: '/media/local-ai-assistant.mp4',
    });
    expect(russian.media).toEqual(english.media);
    expect({
      capabilities: english.capabilities?.length,
      architecture: english.architecture?.length,
      verification: english.verification?.length,
    }).toEqual({
      capabilities: russian.capabilities?.length,
      architecture: russian.architecture?.length,
      verification: russian.verification?.length,
    });
  });

  it('rejects malformed project-level provenance', () => {
    const project = structuredClone(getProject('local-ai-assistant', 'en')!);
    project.source = { ...project.source!, commit: '3e76a56' };

    expect(projectSchema.safeParse(project).success).toBe(false);
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

  it('does not publish the removed LiveClasses project', () => {
    expect(content.projects.some(({ slug }) => slug === 'liveclasses-agent')).toBe(false);
  });

  it('provides role-specific profile copy in both locales', () => {
    for (const locale of ['en', 'ru'] as const) {
      const profile = getProfile(locale);
      expect(profile.roleProfiles.frontend.title).toBe('Frontend Developer');
      expect(profile.roleProfiles.frontend.skills).toContain('Vue 3');
      expect(profile.roleProfiles.ai.summary).not.toBe(
        profile.roleProfiles.frontend.summary,
      );
    }
  });

  it('uses the verified Frontend evidence order', () => {
    expect(
      getProjects('en', 'frontend')
        .slice(0, 6)
        .map(({ slug }) => slug),
    ).toEqual([
      'bitrix24-integrations',
      'shortsport-ai-forge',
      'video-sut',
      'neurosport',
      'neurosport-tma',
      'neuralgrid-international',
    ]);
  });

  it('keeps Neurosport TMA separate from the existing Neurosport project', () => {
    const tma = getProject('neurosport-tma', 'en')!;
    const site = getProject('neurosport', 'en')!;

    expect(tma.roles).toEqual(['ai', 'frontend']);
    expect(tma.source).toEqual({
      repository: 'https://github.com/a197428/Neurosport-TMA',
      commit: '55b50a797b8552e5430130b67cb6703fff567d30',
      verifiedAt: '2026-08-17',
      visibility: 'public',
    });
    expect(tma.media).toEqual({
      poster: '/media/neurosport-tma-poster.webp',
      video: '/media/neurosport-tma.mp4',
    });
    expect(site.source?.repository).toBe('https://github.com/a197428/Neurosport');
    expect(site.roles).toEqual(['frontend']);
  });

  it('publishes Read-Close-Bot as an AI-only image-backed case', () => {
    for (const locale of ['en', 'ru'] as const) {
      const project = getProject('read-close-bot', locale)!;
      expect(project.roles).toEqual(['ai']);
      expect(project.featured).toBe(true);
      expect(project.priority).toEqual({ ai: 30, frontend: 0 });
      expect(project.media).toEqual({ poster: '/image/Read-Close-Bot.png' });
      expect(project.capabilities).toHaveLength(4);
      expect(project.architecture).toHaveLength(3);
      expect(project.verification).toHaveLength(3);
    }

    expect(getProjects('en', 'ai').some(({ slug }) => slug === 'read-close-bot')).toBe(
      true,
    );
    expect(
      getProjects('en', 'frontend').some(({ slug }) => slug === 'read-close-bot'),
    ).toBe(false);
  });

  it('publishes Todo App as a featured frontend-only case with bilingual evidence', () => {
    for (const locale of ['en', 'ru'] as const) {
      const project = getProject('todo-app', locale)!;
      expect(projectSchema.safeParse(project).success).toBe(true);
      expect(project.roles).toEqual(['frontend']);
      expect(project.status).toBe('active');
      expect(project.featured).toBe(true);
      expect(project.priority).toEqual({ ai: 0, frontend: 30 });
      expect(project.media).toEqual({
        poster: '/media/todo-app-poster.webp',
        video: '/media/todo-app.mp4',
      });
      expect(project.capabilities).toHaveLength(4);
      expect(project.architecture).toHaveLength(4);
      expect(project.verification).toHaveLength(4);
    }

    expect(getProjects('en', 'frontend').some(({ slug }) => slug === 'todo-app')).toBe(
      true,
    );
    expect(getProjects('en', 'ai').some(({ slug }) => slug === 'todo-app')).toBe(false);
  });

  it('publishes an identical cardPreview for every featured case in both locales', () => {
    const slugs = [
      'bitrix24-integrations',
      'local-ai-assistant',
      'shortsport-ai-forge',
      'video-sut',
      'neurosport-tma',
      'read-close-bot',
      'todo-app',
      'neurosport',
      'neuralgrid-international',
      'energo-ai',
    ];
    for (const slug of slugs) {
      const english = getProject(slug, 'en')!;
      const russian = getProject(slug, 'ru')!;
      expect(english.cardPreview).toMatch(/^\/image\/preview\/.+\.png$/);
      expect(russian.cardPreview).toEqual(english.cardPreview);
    }
  });

  it('publishes the three site projects as public sources with demo and GitHub links', () => {
    const expected: Array<{ slug: string; repository: string; commit: string }> = [
      {
        slug: 'neurosport',
        repository: 'https://github.com/a197428/Neurosport',
        commit: '7d4fdef4191d2be96e564902af768b26001a136b',
      },
      {
        slug: 'neuralgrid-international',
        repository: 'https://github.com/a197428/NeuralGrid',
        commit: '86258e72e362d648c6129aeb6a4c0e0b35b0f7b1',
      },
      {
        slug: 'energo-ai',
        repository: 'https://github.com/a197428/EnergoAI',
        commit: '2fe165e50e1354180c094b8a08ce86a755dc4506',
      },
    ];

    for (const { slug, repository, commit } of expected) {
      for (const locale of ['en', 'ru'] as const) {
        const project = getProject(slug, locale)!;
        expect(project.source).toEqual({
          repository,
          commit,
          verifiedAt: '2026-08-18',
          visibility: 'public',
        });
        expect(project.links).toHaveLength(2);
        expect(project.links.map(({ kind }) => kind).sort()).toEqual(['demo', 'source']);
        expect(project.links.some(({ href }) => href === repository)).toBe(true);
        expect(project.links.some(({ href }) => href.includes('pages.dev'))).toBe(true);
      }
    }
  });

  it('drops the outdated Neurosport and NeuralGrid claims', () => {
    const published = JSON.stringify([
      getProject('neurosport', 'en')!,
      getProject('neuralgrid-international', 'en')!,
    ]).toLowerCase();

    expect(published).not.toContain('168 frontend');
    expect(published).not.toContain('221 worker');
    expect(published).not.toContain('26 unit');
    expect(published).not.toContain('accessibility checks');
  });

  it('keeps NeuralGrid honest about its absent test suite', () => {
    const neuralGrid = JSON.stringify(
      getProject('neuralgrid-international', 'en')!,
    ).toLowerCase();

    expect(neuralGrid).not.toContain('26 unit');
    expect(neuralGrid).not.toContain('playwright');
    expect(neuralGrid).not.toContain('accessibility');
    expect(neuralGrid).toContain('no test suite is present');
  });

  it('keeps RU and EN priorities, provenance, and evidence coverage equivalent', () => {
    for (const slug of [
      'shortsport-ai-forge',
      'video-sut',
      'neurosport',
      'neurosport-tma',
      'read-close-bot',
      'neuralgrid-international',
      'energo-ai',
    ]) {
      const english = getProject(slug, 'en')!;
      const russian = getProject(slug, 'ru')!;
      expect(russian.priority).toEqual(english.priority);
      expect(russian.source).toEqual(english.source);
      expect(russian.capabilities?.length).toBe(english.capabilities?.length);
      expect(russian.architecture?.length).toBe(english.architecture?.length);
      expect(russian.verification?.length).toBe(english.verification?.length);
    }
  });

  it('pins honest bilingual Video Transcriber evidence and media', () => {
    const english = getProject('video-sut', 'en')!;
    const russian = getProject('video-sut', 'ru')!;

    expect(english.title).toBe('Video Transcriber');
    expect(russian.title).toBe('Video Transcriber');
    expect(english.roles).toEqual(['ai', 'frontend']);
    expect(english.source).toEqual({
      repository: 'https://github.com/a197428/Video_Transcriber',
      commit: '18d998f2fe6ea441ccd2aa15dad9dd4b8bc9e5e8',
      verifiedAt: '2026-08-16',
      visibility: 'private',
    });
    expect(russian.source).toEqual(english.source);
    expect(english.media).toEqual({
      poster: '/media/video-transcriber-poster.webp',
      video: '/media/video-transcriber.mp4',
    });
    expect(russian.media).toEqual(english.media);

    const published = JSON.stringify([english, russian]).toLowerCase();
    expect(published).not.toContain('18 component tests');
    expect(published).not.toContain('zod validates');
    expect(published).not.toContain('проходит все проверки типов');
  });
});
