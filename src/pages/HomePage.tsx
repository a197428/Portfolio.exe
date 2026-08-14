import { animate, stagger } from 'animejs';
import { ArrowUpRight, Braces, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RoleSwitch } from '@/components/controls/RoleSwitch';
import { Shell } from '@/components/layout/Shell';
import { usePreferences } from '@/features/preferences/store';
import { useAnimeScope } from '@/hooks/useAnimeScope';

export function HomePage() {
  const { t } = useTranslation();
  const role = usePreferences((state) => state.role);
  const root = useRef<HTMLElement>(null);

  useAnimeScope(root, () => {
    animate('[data-reveal]', {
      opacity: [0, 1],
      y: [24, 0],
      duration: 900,
      delay: stagger(90),
      ease: 'out(4)',
    });
  }, [role]);

  return (
    <Shell>
      <section className="hero" ref={root}>
        <div className="hero-copy">
          <div className="eyebrow" data-reveal>
            <span className="status-dot" />
            {t('hero.eyebrow')}
          </div>
          <RoleSwitch />
          <h1 data-reveal>{t(`roles.${role}.headline`)}</h1>
          <p className="hero-lead" data-reveal>
            {t(`roles.${role}.description`)}
          </p>
          <div className="hero-actions" data-reveal>
            <button className="primary-action" type="button" disabled>
              <Sparkles aria-hidden="true" size={18} />
              {t('hero.chatSoon')}
            </button>
            <a className="text-action" href="#projects">
              {t('hero.explore')}
              <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          </div>
        </div>

        <aside
          className="signal-card glass-panel"
          data-reveal
          aria-label={t('proof.title')}
        >
          <div className="signal-card-head">
            <Braces aria-hidden="true" size={18} />
            <span>{t('proof.title')}</span>
            <span className="live-chip">{t('proof.status')}</span>
          </div>
          <div className="signal-grid">
            <article>
              <strong>React × Edge</strong>
              <span>{t('proof.architecture')}</span>
            </article>
            <article>
              <strong>RU / EN</strong>
              <span>{t('proof.languages')}</span>
            </article>
            <article>
              <strong>RAG-ready</strong>
              <span>{t('proof.knowledge')}</span>
            </article>
          </div>
        </aside>
      </section>

      <section
        className="projects-section"
        id="projects"
        aria-labelledby="projects-title"
      >
        <div className="section-heading">
          <span>01 / {t('projects.kicker')}</span>
          <h2 id="projects-title">{t('projects.title')}</h2>
        </div>
        <Link className="project-card glass-panel" to="/projects/portfolio-exe">
          <div>
            <span className="project-index">001</span>
            <h3>Portfolio.exe</h3>
            <p>{t('projects.portfolio')}</p>
          </div>
          <ArrowUpRight aria-hidden="true" />
        </Link>
      </section>
    </Shell>
  );
}
