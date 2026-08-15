import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { PortfolioProject } from '@/content/schema';

export function ProjectVideo({ project }: { project: PortfolioProject }) {
  const { t } = useTranslation();
  const video = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(project.chapters[0]?.id);
  const select = (chapter: PortfolioProject['chapters'][number]) => {
    setActive(chapter.id);
    if (video.current) {
      video.current.currentTime = chapter.time;
      void video.current.play().catch(() => undefined);
    }
  };
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
        <video ref={video} controls preload="metadata" poster={project.media?.poster}>
          <source src={project.media?.video} type="video/mp4" />
        </video>
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
