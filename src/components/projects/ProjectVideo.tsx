import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PortfolioProject } from '@/content/schema';

export function ProjectVideo({ project }: { project: PortfolioProject }) {
  const { t } = useTranslation();
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
                <span className="card-eyebrow">{chapter.title}</span>
                <h2>{chapter.task}</h2>
              </div>
              <div>
                <h3>{t('project.contribution')}</h3>
                <ul>
                  {chapter.contribution.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <h3>{t('project.decisions')}</h3>
                <ul>
                  {chapter.decisions.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>
          ),
      )}
    </section>
  );
}
