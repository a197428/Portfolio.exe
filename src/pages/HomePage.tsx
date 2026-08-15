import { animate, onScroll, splitText, stagger } from 'animejs';
import {
  ArrowDownRight,
  ArrowUpRight,
  GitFork,
  Mail,
  Send,
  Sparkles,
} from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RoleSwitch } from '@/components/controls/RoleSwitch';
import AIPrompt from '@/components/kokonutui/ai-prompt';
import { Avatar } from '@/components/avatar';
import BentoGrid from '@/components/kokonutui/bento-grid';
import { LiquidGlassCard } from '@/components/kokonutui/liquid-glass-card';
import { Shell } from '@/components/layout/Shell';
import { getProfile, getProjects } from '@/content';
import { usePreferences } from '@/features/preferences/store';
import { useAnimeScope } from '@/hooks/useAnimeScope';

export function HomePage() {
  const { t } = useTranslation();
  const role = usePreferences((state) => state.role);
  const locale = usePreferences((state) => state.locale);
  const profile = getProfile(locale);
  const roleProfile = profile.roleProfiles[role];
  const headlineText = t(`roles.${role}.headline`);
  const projects = getProjects(locale, role);
  const featured = projects.find((project) => project.slug === 'bitrix24-integrations')!;
  const localAi = projects.find((project) => project.slug === 'local-ai-assistant');
  const otherProjects = projects.filter(
    (project) => project.slug !== featured.slug && project.slug !== localAi?.slug,
  );
  const bentoStartIndex = role === 'ai' ? 3 : 2;
  const root = useRef<HTMLDivElement>(null);

  useAnimeScope(root, () => {
    animate('[data-reveal]', {
      opacity: [0, 1],
      y: [28, 0],
      filter: ['blur(9px)', 'blur(0px)'],
      duration: 950,
      delay: stagger(75),
      ease: 'out(4)',
    });

    const headline = root.current?.querySelector<HTMLElement>('[data-hero-title]');
    const split = headline
      ? splitText(headline, {
          accessible: true,
          words: { wrap: 'clip', class: 'hero-split-word' },
        })
      : null;

    split?.addEffect(({ words }) =>
      animate(words, {
        opacity: [0, 1],
        y: ['108%', '0%'],
        filter: ['blur(6px)', 'blur(0px)'],
        duration: 800,
        delay: stagger(55),
        ease: 'out(4)',
      }),
    );

    const cards = root.current?.querySelectorAll<HTMLElement>(
      '.featured-case, .bento-project',
    );

    cards?.forEach((card) => {
      const scrollSettings = {
        target: card,
        enter: 'bottom top',
        leave: 'top bottom',
        sync: 0.24,
      } as const;

      animate(card, {
        filter: [
          'brightness(.92) saturate(.92)',
          'brightness(1.055) saturate(1.08)',
          'brightness(.97) saturate(.97)',
        ],
        boxShadow: [
          '0 20px 60px rgb(0 0 0 / 18%)',
          '0 34px 90px rgb(128 255 176 / 16%)',
          '0 20px 60px rgb(0 0 0 / 18%)',
        ],
        ease: 'linear',
        autoplay: onScroll(scrollSettings),
      });

      const poster = card.querySelector<HTMLImageElement>('img');
      if (!poster) return;

      animate(poster, {
        objectPosition: card.classList.contains('bento-project')
          ? ['50% 0%', '50% 18%']
          : ['50% 42%', '50% 58%'],
        ease: 'linear',
        autoplay: onScroll(scrollSettings),
      });
    });

    return () => split?.revert();
  }, [role, locale, headlineText]);

  return (
    <Shell>
      <div ref={root}>
        <section className="hero">
          <div className="hero-copy">
            <Avatar avatar={profile.avatar} name={profile.name} alt="" className="mb-4" />
            <div className="eyebrow" data-reveal>
              <span className="status-dot" />
              {profile.location} · {t('hero.availability')}
            </div>
            <RoleSwitch />
            <p className="hero-name" data-reveal>
              {profile.name} / {roleProfile.title}
            </p>
            <h1 data-hero-title key={headlineText}>
              {headlineText}
            </h1>
            <p className="hero-lead" data-reveal>
              {roleProfile.summary}
            </p>
            <div className="hero-actions" data-reveal>
              <a className="primary-action enabled" href="#projects">
                {t('hero.explore')}
                <ArrowDownRight size={18} />
              </a>
              <a className="text-action" href={`mailto:${profile.contacts.email}`}>
                {t('contact.write')}
                <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
          <LiquidGlassCard className="signal-card" data-reveal>
            <div className="signal-card-head">
              <Sparkles size={17} />
              <span>{t('proof.title')}</span>
              <span className="live-chip">{t('proof.status')}</span>
            </div>
            <div className="signal-grid">
              <article>
                <strong>2 roles / 1 system</strong>
                <span>{t('proof.role')}</span>
              </article>
              <article>
                <strong>{roleProfile.skills.slice(0, 2).join(' + ')}</strong>
                <span>{t('proof.delivery')}</span>
              </article>
              <article>
                <strong>RU / EN</strong>
                <span>{t('proof.languages')}</span>
              </article>
            </div>
          </LiquidGlassCard>
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
          <Link className="featured-case glass-panel" to={`/projects/${featured.slug}`}>
            <div className="featured-case-copy">
              <span className="project-index">001 / {featured.status}</span>
              <p className="card-eyebrow">{featured.eyebrow}</p>
              <h3>{featured.title}</h3>
              <p>{featured.roleFocus[role]}</p>
              <div className="tag-row">
                {featured.stack.slice(0, 5).map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
            <div className="featured-visual">
              <img src={featured.media?.poster} alt={t('projects.posterAlt')} />
              <span>{t('projects.watch')} · 3 demos</span>
            </div>
          </Link>
          {localAi && (
            <Link
              className="featured-case featured-case--reverse glass-panel"
              to={`/projects/${localAi.slug}`}
            >
              <div className="featured-visual">
                <img src={localAi.media?.poster} alt={t('projects.localPosterAlt')} />
                <span>{t('projects.watch')} · 1 demo</span>
              </div>
              <div className="featured-case-copy">
                <span className="project-index">002 / {localAi.status}</span>
                <p className="card-eyebrow">{localAi.eyebrow}</p>
                <h3>{localAi.title}</h3>
                <p>{localAi.roleFocus.ai}</p>
                <div className="tag-row">
                  {localAi.stack.slice(0, 5).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </Link>
          )}
          <BentoGrid projects={otherProjects} startIndex={bentoStartIndex} />
        </section>

        <section className="method-section" aria-labelledby="method-title">
          <div className="section-heading">
            <span>02 / {t('method.kicker')}</span>
            <h2 id="method-title">{t('method.title')}</h2>
          </div>
          <div className="method-grid">
            {[0, 1, 2].map((index) => (
              <article className="glass-panel" key={index}>
                <span>0{index + 1}</span>
                <h3>{t(`method.items.${index}.title`)}</h3>
                <p>{t(`method.items.${index}.text`)}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ai-preview" aria-labelledby="ai-preview-title">
          <div>
            <span className="card-eyebrow">03 / {t('aiPreview.kicker')}</span>
            <h2 id="ai-preview-title">{t('aiPreview.title')}</h2>
            <p>{t('aiPreview.text')}</p>
          </div>
          <AIPrompt
            title={t('aiPreview.label')}
            placeholder={t('aiPreview.placeholder')}
          />
        </section>

        <section className="contact-section glass-panel" id="contact">
          <div>
            <span className="card-eyebrow">04 / {t('contact.kicker')}</span>
            <h2>{t('contact.title')}</h2>
          </div>
          <div className="contact-links">
            <a href={`mailto:${profile.contacts.email}`}>
              <Mail />
              {profile.contacts.email}
            </a>
            <a href={profile.contacts.telegram} target="_blank" rel="noreferrer">
              <Send />
              Telegram
            </a>
            <a href={profile.contacts.github} target="_blank" rel="noreferrer">
              <GitFork />
              GitHub
            </a>
          </div>
        </section>
      </div>
    </Shell>
  );
}
