import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PortfolioProject } from '@/content/schema';
import { usePreferences } from '@/features/preferences/store';

export function ProjectVideo({ project }: { project: PortfolioProject }) {
  const { t } = useTranslation();
  const role = usePreferences((state) => state.role);
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(project.chapters[0]?.id);
  const shouldPlay = useRef(false);
  const activeChapter =
    project.chapters.find((chapter) => chapter.id === active) ?? project.chapters[0];

  useEffect(() => {
    const player = video.current;
    if (!player || !activeChapter) return;

    player.currentTime = 0;
    player.load();

    if (shouldPlay.current) {
      shouldPlay.current = false;
      void player.play().catch(() => undefined);
    }
  }, [activeChapter]);

  const select = (chapter: PortfolioProject['chapters'][number]) => {
    if (chapter.id === active) return;

    video.current?.pause();
    shouldPlay.current = true;
    setActive(chapter.id);
  };

  if (!activeChapter) return null;

  return (
    <section className="case-player" aria-label="Project video chapters">
      <div className="chapter-tabs" role="tablist">
        {project.chapters.map((chapter, index) => (
          <button
            key={chapter.id}
            role="tab"
            aria-selected={active === chapter.id}
            onClick={() => select(chapter)}
            type="button"
          >
            <span>0{index + 1}</span>
            {chapter.title}
          </button>
        ))}
      </div>
      <div className="video-frame">
        <video
          ref={video}
          controls
          preload="metadata"
          poster={activeChapter.poster}
          src={activeChapter.video}
        />
      </div>
      {project.chapters.map(
        (chapter) =>
          active === chapter.id && (
            <article className="chapter-detail" role="tabpanel" key={chapter.id}>
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="card-eyebrow">{chapter.title}</span>
                  <span className="rounded-full border border-[var(--glass-border)] bg-[var(--glass-strong)] px-3 py-1 text-xs text-[var(--accent)]">
                    {t(
                      chapter.status === 'production-ui'
                        ? 'project.status.productionUi'
                        : 'project.status.productionIntegration',
                    )}
                  </span>
                </div>
                <h2>{chapter.task}</h2>
                <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
                  {chapter.roleFocus[role]}
                </p>
              </div>
              <div className="grid content-start gap-x-8 lg:grid-cols-2">
                <section>
                  <h3>{t('project.capabilities')}</h3>
                  <ul>
                    {chapter.capabilities.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>{t('project.architecture')}</h3>
                  <ul>
                    {chapter.architecture.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>{t('project.contribution')}</h3>
                  <ul>
                    {chapter.contribution.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3>{t('project.decisions')}</h3>
                  <ul>
                    {chapter.decisions.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
                <section className="lg:col-span-2">
                  <h3>{t('project.verification')}</h3>
                  <ul>
                    {chapter.verification.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>
            </article>
          ),
      )}
    </section>
  );
}
