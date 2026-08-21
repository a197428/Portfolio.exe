import { ArrowUpRight, Bot, Braces, CheckCircle2, Workflow } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { PortfolioProject } from '@/content/schema';

const evidenceGroups = [
  { key: 'capabilities', icon: Bot },
  { key: 'architecture', icon: Workflow },
  { key: 'contribution', icon: Braces },
  { key: 'decisions', icon: CheckCircle2 },
] as const;

export function ProjectEvidence({ project }: { project: PortfolioProject }) {
  const { t } = useTranslation();
  const visibleLinks = project.links.filter(
    (link) => link.kind === 'demo' || project.source?.visibility === 'public',
  );

  if (!project.media || !project.capabilities || !project.architecture) return null;

  return (
    <section className="grid gap-8" aria-label={t('project.caseStudy')}>
      <div className="overflow-hidden rounded-[2rem] border border-[var(--glass-border)] bg-black/40 p-2 shadow-2xl shadow-black/30">
        {project.media.video ? (
          <video
            className="aspect-[8/5] w-full rounded-[1.55rem] bg-black object-contain"
            controls
            preload="metadata"
            poster={project.media.poster}
            src={project.media.video}
          />
        ) : (
          <img
            className="aspect-[8/5] w-full rounded-[1.55rem] object-cover object-top"
            src={project.media.poster}
            alt=""
          />
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {evidenceGroups.map(({ key, icon: Icon }) => (
          <article
            className="glass-panel group min-h-64 overflow-hidden p-7 md:p-9"
            key={key}
          >
            <div className="mb-8 flex items-center justify-between text-[var(--accent)]">
              <Icon size={20} aria-hidden="true" />
              <span className="font-mono text-xs uppercase tracking-[0.2em]">
                {t(`project.${key}`)}
              </span>
            </div>
            <ul className="grid gap-4 text-base leading-relaxed text-[var(--muted)]">
              {project[key]?.map((item) => (
                <li className="flex gap-3" key={item}>
                  <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {project.verification && (
        <article className="glass-panel grid gap-8 p-7 md:grid-cols-[0.7fr_1.3fr] md:p-10">
          <div>
            <span className="card-eyebrow">{t('project.verification')}</span>
            <h2 className="mt-3 text-3xl tracking-tight md:text-4xl text-balance">
              {t('project.evidenceTitle')}
            </h2>
          </div>
          <ul className="grid content-start gap-4 text-[var(--muted)]">
            {project.verification.map((item) => (
              <li className="flex gap-3" key={item}>
                <CheckCircle2 className="mt-1 shrink-0 text-[var(--accent)]" size={17} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>
      )}

      {visibleLinks.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {visibleLinks.map((link) => (
            <a
              className="primary-action enabled"
              href={link.href}
              target="_blank"
              rel="noreferrer"
              key={link.href}
            >
              {link.label}
              <ArrowUpRight size={17} />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
