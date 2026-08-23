import { ArrowLeft } from 'lucide-react';
import { useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { ProjectVideo } from '@/components/projects/ProjectVideo';
import { ProjectEvidence } from '@/components/projects/ProjectEvidence';
import { ViewProjectButton } from '@/components/projects/ViewProjectButton';
import { getProject } from '@/content';
import { usePreferences } from '@/features/preferences/store';

const CASE_SUMMARY_HASH = '#case-summary';

function withoutSmoothScroll(action: () => void) {
  const root = document.documentElement;
  const previousBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = 'auto';
  action();
  root.style.scrollBehavior = previousBehavior;
}

export function ProjectPage() {
  const { t } = useTranslation();
  const { slug = '' } = useParams();
  const location = useLocation();
  const locale = usePreferences((state) => state.locale);
  const role = usePreferences((state) => state.role);
  const project = getProject(slug, locale);

  // Cards on the home page open the final "Task / Result" block: after the
  // click the URL carries #case-summary, and the summary is scrolled into
  // view before the browser paints an intermediate position. Clean URLs
  // (address bar, Bob, external links) open the page from the top. Temporarily
  // overriding the root scroll behavior prevents the site's global smooth
  // scrolling from exposing the middle of long case studies. A locale or role
  // switch keeps both pathname and hash, so the effect does not re-run and the
  // reading position is preserved.
  useLayoutEffect(() => {
    withoutSmoothScroll(() => {
      if (location.hash === CASE_SUMMARY_HASH) {
        document.getElementById('case-summary')?.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'auto' });
      }
    });
  }, [location.pathname, location.hash]);
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
            {/* Focusable so the "View project" button can hand keyboard focus
                to the title after it has scrolled the page back to the top. */}
            <h1 tabIndex={-1}>{project.title}</h1>
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
        {project.media && project.capabilities && project.architecture ? (
          <ProjectEvidence project={project} />
        ) : project.media && project.chapters.length > 0 ? (
          <ProjectVideo project={project} />
        ) : (
          <div className="generic-case glass-panel">
            <h2>{project.task}</h2>
            <p>{project.outcome}</p>
          </div>
        )}
        <section
          className="case-summary-grid"
          id="case-summary"
          aria-label={t('project.taskOutcome')}
        >
          <div>
            <span className="card-eyebrow">{t('project.task')}</span>
            <h2>{project.task}</h2>
          </div>
          <div>
            <span className="card-eyebrow">{t('project.outcome')}</span>
            <p>{project.outcome}</p>
            {/* Keyed on the slug so a new project remounts the button as
                unviewed while a locale switch keeps the current state. */}
            <ViewProjectButton key={slug} />
          </div>
        </section>
      </article>
    </Shell>
  );
}
