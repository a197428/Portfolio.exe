import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { ProjectVideo } from '@/components/projects/ProjectVideo';
import { ProjectEvidence } from '@/components/projects/ProjectEvidence';
import { getProject } from '@/content';
import { usePreferences } from '@/features/preferences/store';

export function ProjectPage() {
  const { t } = useTranslation();
  const { slug = '' } = useParams();
  const locale = usePreferences((state) => state.locale);
  const role = usePreferences((state) => state.role);
  const project = getProject(slug, locale);
  if (!project)
    return (
      <Shell>
        <div className="project-detail">
          <Link className="text-action" to="/">
            <ArrowLeft size={17} />
            {t('project.back')}
          </Link>
          <h1>{t('project.notFound')}</h1>
        </div>
      </Shell>
    );
  return (
    <Shell>
      <article className="case-detail">
        <Link className="text-action" to="/">
          <ArrowLeft size={17} />
          {t('project.back')}
        </Link>
        <header className="case-hero">
          <div>
            <p className="eyebrow">{project.eyebrow}</p>
            <h1>{project.title}</h1>
          </div>
          <div>
            <p className="hero-lead">{project.roleFocus[role]}</p>
            <div className="tag-row">
              {project.stack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </header>
        {project.media?.video ? (
          <ProjectEvidence project={project} />
        ) : project.media && project.chapters.length > 0 ? (
          <ProjectVideo project={project} />
        ) : (
          <div className="generic-case glass-panel">
            <h2>{project.task}</h2>
            <p>{project.outcome}</p>
          </div>
        )}
        <section className="case-summary-grid">
          <div>
            <span className="card-eyebrow">{t('project.task')}</span>
            <h2>{project.task}</h2>
          </div>
          <div>
            <span className="card-eyebrow">{t('project.outcome')}</span>
            <p>{project.outcome}</p>
            {!project.media?.video &&
              project.links.map((link) => (
                <a
                  className="text-action"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  key={link.href}
                >
                  {link.label}
                  <ArrowUpRight size={16} />
                </a>
              ))}
          </div>
        </section>
      </article>
    </Shell>
  );
}
