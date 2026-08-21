import { animate, onScroll, splitText, stagger } from 'animejs';
import { ArrowDownRight, ArrowUpRight, GitFork, Mail, Send } from 'lucide-react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RoleSwitch } from '@/components/controls/RoleSwitch';
import { SectionHeading } from '@/components/SectionHeading';
import { FlipCard } from '@/components/kokonutui/card-flip';
import { BobIntro } from '@/features/bob/BobIntro';
import BentoGrid from '@/components/kokonutui/bento-grid';
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
  const shortSport = projects.find((project) => project.slug === 'shortsport-ai-forge');
  const videoTranscriber = projects.find((project) => project.slug === 'video-sut');
  const neurosportTma = projects.find((project) => project.slug === 'neurosport-tma');
  const readCloseBot = projects.find((project) => project.slug === 'read-close-bot');
  const todoApp = projects.find((project) => project.slug === 'todo-app');
  const neurosport = projects.find((project) => project.slug === 'neurosport');
  const neuralGrid = projects.find(
    (project) => project.slug === 'neuralgrid-international',
  );
  const energoAi = projects.find((project) => project.slug === 'energo-ai');
  const otherProjects = projects.filter(
    (project) =>
      project.slug !== featured.slug &&
      project.slug !== localAi?.slug &&
      project.slug !== shortSport?.slug &&
      project.slug !== videoTranscriber?.slug &&
      project.slug !== neurosportTma?.slug &&
      project.slug !== readCloseBot?.slug &&
      project.slug !== todoApp?.slug &&
      project.slug !== neurosport?.slug &&
      project.slug !== neuralGrid?.slug &&
      project.slug !== energoAi?.slug,
  );
  // Every project in both lenses is now a featured card, so the Bento Grid
  // has no remaining projects and is conditionally hidden.
  const bentoStartIndex = 9;
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

    const heroName = root.current?.querySelector<HTMLElement>('[data-hero-name]');
    const split = heroName
      ? splitText(heroName, {
          accessible: true,
          words: { wrap: 'clip', class: 'hero-name-word' },
        })
      : null;

    split?.addEffect(({ words }) =>
      animate(words, {
        opacity: [0, 1],
        y: ['115%', '0%'],
        filter: ['blur(10px)', 'blur(0px)'],
        duration: 950,
        delay: stagger(90),
        ease: 'out(4)',
      }),
    );

    animate('[data-hero-portrait]', {
      opacity: [0, 1],
      scale: [0.94, 1],
      clipPath: ['inset(18% 8% 0% 8% round 45% 45% 2rem 2rem)', 'inset(0%)'],
      duration: 1200,
      delay: 180,
      ease: 'out(4)',
    });

    animate('[data-hero-dock]', {
      opacity: [0, 1],
      y: [-14, 0],
      duration: 760,
      delay: 300,
      ease: 'out(4)',
    });

    root.current
      ?.querySelectorAll<HTMLElement>('[data-hero-rail]')
      .forEach((rail, index) => {
        animate(rail, {
          opacity: [0, 1],
          x: index === 0 ? [-28, 0] : [28, 0],
          duration: 900,
          delay: 360 + index * 120,
          ease: 'out(4)',
        });
      });

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

  const shortSportCard = shortSport && (
    <Link
      className="featured-case glass-panel"
      to={`/projects/${shortSport.slug}`}
      key={shortSport.slug}
    >
      <div className="featured-case-copy">
        <span className="project-index">003 / {shortSport.status}</span>
        <p className="card-eyebrow">{shortSport.eyebrow}</p>
        <h3>{shortSport.title}</h3>
        <p>{shortSport.roleFocus[role]}</p>
        <div className="tag-row">
          {shortSport.stack.slice(0, 5).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="featured-visual">
        <img
          src={shortSport.cardPreview ?? shortSport.media?.poster}
          alt={t('projects.shortSportPosterAlt')}
        />
        <span>{t('projects.liveDemo')}</span>
      </div>
    </Link>
  );

  const videoTranscriberCard = videoTranscriber && (
    <Link
      className="featured-case featured-case--reverse glass-panel"
      to={`/projects/${videoTranscriber.slug}`}
      key={videoTranscriber.slug}
    >
      <div className="featured-visual">
        <img
          src={videoTranscriber.cardPreview ?? videoTranscriber.media?.poster}
          alt={t('projects.videoTranscriberPosterAlt')}
        />
        <span>{t('projects.watch')} · 1 demo</span>
      </div>
      <div className="featured-case-copy">
        <span className="project-index">
          {role === 'ai' ? '004' : '002'} / {videoTranscriber.status}
        </span>
        <p className="card-eyebrow">{videoTranscriber.eyebrow}</p>
        <h3>{videoTranscriber.title}</h3>
        <p>{videoTranscriber.roleFocus[role]}</p>
        <div className="tag-row">
          {videoTranscriber.stack.slice(0, 5).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </Link>
  );

  const todoAppCard = todoApp && (
    <Link
      className="featured-case featured-case--reverse glass-panel"
      to={`/projects/${todoApp.slug}`}
      key={todoApp.slug}
    >
      <div className="featured-visual">
        <img
          src={todoApp.cardPreview ?? todoApp.media?.poster}
          alt={t('projects.todoPosterAlt')}
        />
        <span>{t('projects.watch')} · 1 demo</span>
      </div>
      <div className="featured-case-copy">
        <span className="project-index">004 / {todoApp.status}</span>
        <p className="card-eyebrow">{todoApp.eyebrow}</p>
        <h3>{todoApp.title}</h3>
        <p>{todoApp.roleFocus[role]}</p>
        <div className="tag-row">
          {todoApp.stack.slice(0, 5).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </Link>
  );

  const neurosportCard = neurosport && (
    <Link
      className="featured-case featured-case--reverse glass-panel"
      to={`/projects/${neurosport.slug}`}
      key={neurosport.slug}
    >
      <div className="featured-visual">
        <img
          src={neurosport.cardPreview ?? neurosport.media?.poster}
          alt={t('projects.neurosportPosterAlt')}
        />
        <span>{t('projects.liveDemo')}</span>
      </div>
      <div className="featured-case-copy">
        <span className="project-index">006 / {neurosport.status}</span>
        <p className="card-eyebrow">{neurosport.eyebrow}</p>
        <h3>{neurosport.title}</h3>
        <p>{neurosport.roleFocus[role]}</p>
        <div className="tag-row">
          {neurosport.stack.slice(0, 5).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </Link>
  );

  const neuralGridCard = neuralGrid && (
    <Link
      className="featured-case glass-panel"
      to={`/projects/${neuralGrid.slug}`}
      key={neuralGrid.slug}
    >
      <div className="featured-case-copy">
        <span className="project-index">007 / {neuralGrid.status}</span>
        <p className="card-eyebrow">{neuralGrid.eyebrow}</p>
        <h3>{neuralGrid.title}</h3>
        <p>{neuralGrid.roleFocus[role]}</p>
        <div className="tag-row">
          {neuralGrid.stack.slice(0, 5).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
      <div className="featured-visual">
        <img
          src={neuralGrid.cardPreview ?? neuralGrid.media?.poster}
          alt={t('projects.neuralGridPosterAlt')}
        />
        <span>{t('projects.liveDemo')}</span>
      </div>
    </Link>
  );

  const energoAiCard = energoAi && (
    <Link
      className="featured-case featured-case--reverse glass-panel"
      to={`/projects/${energoAi.slug}`}
      key={energoAi.slug}
    >
      <div className="featured-visual">
        <img
          src={energoAi.cardPreview ?? energoAi.media?.poster}
          alt={t('projects.energoAiPosterAlt')}
        />
        <span>{t('projects.liveDemo')}</span>
      </div>
      <div className="featured-case-copy">
        <span className="project-index">008 / {energoAi.status}</span>
        <p className="card-eyebrow">{energoAi.eyebrow}</p>
        <h3>{energoAi.title}</h3>
        <p>{energoAi.roleFocus[role]}</p>
        <div className="tag-row">
          {energoAi.stack.slice(0, 5).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </Link>
  );

  return (
    <Shell>
      <div ref={root}>
        <section className={`hero hero--${locale}`} aria-labelledby="hero-name">
          <div className="hero-coordinate hero-coordinate--top" aria-hidden="true">
            48°42′ N / 44°30′ E
          </div>
          <h1
            className="hero-display-name"
            id="hero-name"
            data-hero-name
            key={profile.name}
          >
            {profile.name}
          </h1>
          <div className="hero-role-dock" data-hero-dock>
            <RoleSwitch />
          </div>

          <div className="hero-stage">
            <aside className="hero-rail hero-rail--left" data-hero-rail>
              <div className="hero-status">
                <span className="status-dot" />
                {profile.location} · {t('hero.availability')}
              </div>
              <div className="hero-actions">
                <a className="primary-action enabled" href="#projects">
                  {t('hero.explore')}
                  <ArrowDownRight size={18} />
                </a>
                <a className="text-action" href={`mailto:${profile.contacts.email}`}>
                  {t('contact.write')}
                  <ArrowUpRight size={17} />
                </a>
              </div>
            </aside>

            <figure className="hero-portrait" data-hero-portrait>
              <div className="hero-portrait-halo" aria-hidden="true" />
              <img src={profile.avatar} alt={t('hero.portraitAlt')} />
              <figcaption aria-hidden="true">
                <span>PORTFOLIO.EXE</span>
                <span>2026 / 001</span>
              </figcaption>
            </figure>

            <aside className="hero-rail hero-rail--right" data-hero-rail>
              <p className="hero-role-index">01 / {roleProfile.title}</p>
              <h2 data-hero-title key={headlineText}>
                {headlineText}
              </h2>
              <p className="hero-description">{roleProfile.summary}</p>
              <div className="hero-stack" aria-label={t('hero.coreStack')}>
                {roleProfile.skills.slice(0, 3).map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </aside>
          </div>

          <div className="hero-coordinate hero-coordinate--bottom" aria-hidden="true">
            AI APPLICATIONS · INTERFACES · EDGE SYSTEMS
          </div>
        </section>

        <section
          className="projects-section"
          id="projects"
          aria-labelledby="projects-title"
        >
          <SectionHeading
            index="01"
            kicker={t('projects.kicker')}
            title={t('projects.title')}
            id="projects-title"
          />
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
              <img
                src={featured.cardPreview ?? featured.media?.poster}
                alt={t('projects.posterAlt')}
              />
              <span>{t('projects.watch')} · 3 demos</span>
            </div>
          </Link>
          {localAi && (
            <Link
              className="featured-case featured-case--reverse glass-panel"
              to={`/projects/${localAi.slug}`}
            >
              <div className="featured-visual">
                <img
                  src={localAi.cardPreview ?? localAi.media?.poster}
                  alt={t('projects.localPosterAlt')}
                />
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
          {role === 'frontend' ? (
            <>
              {videoTranscriberCard}
              {shortSportCard}
              {todoAppCard}
            </>
          ) : (
            <>
              {shortSportCard}
              {videoTranscriberCard}
            </>
          )}
          {neurosportTma && (
            <Link
              className="featured-case glass-panel"
              to={`/projects/${neurosportTma.slug}`}
            >
              <div className="featured-case-copy">
                <span className="project-index">005 / {neurosportTma.status}</span>
                <p className="card-eyebrow">{neurosportTma.eyebrow}</p>
                <h3>{neurosportTma.title}</h3>
                <p>{neurosportTma.roleFocus[role]}</p>
                <div className="tag-row">
                  {neurosportTma.stack.slice(0, 5).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
              <div className="featured-visual">
                <img
                  src={neurosportTma.cardPreview ?? neurosportTma.media?.poster}
                  alt={t('projects.neurosportTmaPosterAlt')}
                />
                <span>{t('projects.watch')} · 1 demo</span>
              </div>
            </Link>
          )}
          {role === 'frontend' && (
            <>
              {neurosportCard}
              {neuralGridCard}
              {energoAiCard}
            </>
          )}
          {readCloseBot && (
            <Link
              className="featured-case featured-case--reverse glass-panel"
              to={`/projects/${readCloseBot.slug}`}
            >
              <div className="featured-visual">
                <img
                  src={readCloseBot.cardPreview ?? readCloseBot.media?.poster}
                  alt={t('projects.readCloseBotPosterAlt')}
                />
                <span>{t('projects.architecturePreview')}</span>
              </div>
              <div className="featured-case-copy">
                <span className="project-index">006 / {readCloseBot.status}</span>
                <p className="card-eyebrow">{readCloseBot.eyebrow}</p>
                <h3>{readCloseBot.title}</h3>
                <p>{readCloseBot.roleFocus.ai}</p>
                <div className="tag-row">
                  {readCloseBot.stack.slice(0, 5).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            </Link>
          )}
          {otherProjects.length > 0 && (
            <BentoGrid projects={otherProjects} startIndex={bentoStartIndex} />
          )}
        </section>

        <section
          className="experience-section"
          id="about"
          aria-labelledby="experience-title"
        >
          <SectionHeading
            index="02"
            kicker={t('experience.kicker')}
            title={t('experience.title')}
            id="experience-title"
          />
          <div className="experience-grid">
            {profile.credentials.map((item, index) => (
              <FlipCard
                key={item.title}
                index={`0${index + 1}`}
                title={item.title}
                summary={item.text}
                details={item.details}
                frontLabel={t('flipCard.reveal')}
                backLabel={t('flipCard.collapse')}
              />
            ))}
          </div>
        </section>

        <section className="method-section" aria-labelledby="method-title">
          <SectionHeading
            index="03"
            kicker={t('method.kicker')}
            title={t('method.title')}
            id="method-title"
          />
          <div className="method-grid">
            {[0, 1, 2].map((index) => (
              <FlipCard
                key={index}
                index={`0${index + 1}`}
                title={t(`method.items.${index}.title`)}
                summary={t(`method.items.${index}.text`)}
                details={
                  t(`method.items.${index}.details`, { returnObjects: true }) as string[]
                }
                frontLabel={t('flipCard.reveal')}
                backLabel={t('flipCard.collapse')}
              />
            ))}
          </div>
        </section>

        <section className="ai-preview" aria-labelledby="ai-preview-title">
          <SectionHeading
            index="04"
            kicker={t('aiPreview.kicker')}
            title={t('aiPreview.title')}
            id="ai-preview-title"
          />
          <div className="ai-preview-grid">
            <p>{t('aiPreview.text')}</p>
            <BobIntro />
          </div>
        </section>

        <section
          className="contact-section glass-panel"
          id="contact"
          aria-labelledby="contact-title"
        >
          <SectionHeading
            index="05"
            kicker={t('contact.kicker')}
            title={t('contact.title')}
            id="contact-title"
            size="sub"
          />
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
