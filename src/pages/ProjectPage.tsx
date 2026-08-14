import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';

export function ProjectPage() {
  const { t } = useTranslation();
  const { slug } = useParams();

  return (
    <Shell>
      <article className="project-detail glass-panel">
        <Link className="text-action" to="/">
          <ArrowLeft aria-hidden="true" size={17} />
          {t('project.back')}
        </Link>
        <p className="eyebrow">{t('project.caseStudy')}</p>
        <h1>{slug === 'portfolio-exe' ? 'Portfolio.exe' : t('project.notFound')}</h1>
        <p className="hero-lead">{t('project.foundation')}</p>
        <div className="project-meta">
          <span>React 19</span>
          <span>Cloudflare Workers</span>
          <span>Tailwind CSS v4</span>
          <span>Anime.js</span>
        </div>
      </article>
    </Shell>
  );
}
