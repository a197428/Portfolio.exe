import { ExternalLink, FileSearch2, RotateCcw, Send, Square, X } from 'lucide-react';
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { useBob } from '@/features/bob/BobProvider';
import { BobMark } from '@/features/bob/BobMark';
import { bobPlainText } from '@/features/bob/plainText';

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

function TurnstileChallenge() {
  const { t } = useTranslation();
  const { turnstileSiteKey, setTurnstileToken } = useBob();
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!turnstileSiteKey) return;
    const hostElement = host.current;
    const scriptId = 'cloudflare-turnstile-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    const render = () => {
      if (!hostElement || !window.turnstile || hostElement.childElementCount) return;
      const widgetId = window.turnstile.render(hostElement, {
        sitekey: turnstileSiteKey,
        action: 'bob-chat',
        callback: setTurnstileToken,
        'expired-callback': () => setTurnstileToken(''),
      });
      hostElement.dataset.widgetId = widgetId;
    };
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      document.head.append(script);
    }
    script.addEventListener('load', render);
    render();
    return () => {
      script?.removeEventListener('load', render);
      const widgetId = hostElement?.dataset.widgetId;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [setTurnstileToken, turnstileSiteKey]);

  if (!turnstileSiteKey)
    return <p className="bob-notice">{t('bob.challengeUnavailable')}</p>;
  return <div className="bob-challenge" ref={host} aria-label={t('bob.challenge')} />;
}

export function BobDialog() {
  const { t } = useTranslation();
  const bob = useBob();
  const { launcherRef, open, setOpen } = bob;
  const titleId = useId();
  const textarea = useRef<HTMLTextAreaElement>(null);
  const dialog = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const launcherElement = launcherRef.current;
    document.body.style.overflow = 'hidden';
    textarea.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key !== 'Tab' || !dialog.current) return;
      const focusable = [
        ...dialog.current.querySelectorAll<HTMLElement>('button, a, textarea'),
      ].filter((element) => !element.hasAttribute('disabled'));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      launcherElement?.focus();
    };
  }, [launcherRef, open, setOpen]);

  if (!bob.open) return null;
  const submit = () => bob.send();

  return createPortal(
    <div
      className="bob-backdrop"
      role="presentation"
      onMouseDown={() => bob.setOpen(false)}
    >
      <section
        ref={dialog}
        className={`bob-dialog glass-panel${bob.streaming ? ' bob-dialog--streaming' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="bob-dialog-head">
          <div className="bob-dialog-identity">
            <span className="bob-dialog-mark">
              <BobMark size={38} />
            </span>
            <div>
              <h2 id={titleId}>{t('bob.title')}</h2>
              <span>{bob.streaming ? t('bob.thinking') : t('bob.status')}</span>
            </div>
          </div>
          <button
            type="button"
            className="bob-icon-button"
            onClick={() => bob.setOpen(false)}
            aria-label={t('bob.close')}
          >
            <X />
          </button>
        </header>

        <div className="bob-messages" aria-live="polite" aria-busy={bob.streaming}>
          {bob.messages.length === 0 && (
            <div className="bob-welcome">
              <p>{t('bob.welcome')}</p>
              <small>{t('bob.disclaimer')}</small>
            </div>
          )}
          {bob.messages.map((message) => (
            <article className={`bob-message ${message.role}`} key={message.id}>
              <span className="bob-message-author">
                {message.role === 'assistant' && <BobMark size={18} />}
                {message.role === 'assistant' ? 'Боб' : t('bob.you')}
              </span>
              <p>
                {message.content
                  ? bobPlainText(message.content)
                  : bob.streaming
                    ? t('bob.retrieving')
                    : ''}
              </p>
              {message.sources && message.sources.length > 0 && (
                <details className="bob-sources">
                  <summary>
                    {t('bob.sourcesCount', { count: message.sources.length })}
                  </summary>
                  <div aria-label={t('bob.sources')}>
                    {message.sources.map((source) => (
                      <a
                        href={source.href}
                        key={source.id}
                        target={source.href.startsWith('http') ? '_blank' : undefined}
                        rel="noreferrer"
                      >
                        <span>{source.type}</span>
                        {source.title}
                        <ExternalLink size={12} />
                      </a>
                    ))}
                  </div>
                </details>
              )}
            </article>
          ))}
          {bob.error && (
            <p className="bob-error" role="alert">
              {t(`bob.errors.${bob.error.code}`)}
            </p>
          )}
          {bob.needsChallenge && <TurnstileChallenge />}
        </div>

        <form
          className="bob-composer"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <div className="bob-composer-mode">
            <button
              type="button"
              className={bob.mode === 'vacancy' ? 'active' : ''}
              aria-pressed={bob.mode === 'vacancy'}
              onClick={() => bob.setMode(bob.mode === 'vacancy' ? 'qa' : 'vacancy')}
            >
              {bob.mode === 'vacancy' ? <X size={14} /> : <FileSearch2 size={15} />}
              {bob.mode === 'vacancy' ? t('bob.vacancyActive') : t('bob.vacancy')}
            </button>
          </div>
          <textarea
            ref={textarea}
            value={bob.draft}
            onChange={(event) => bob.setDraft(event.target.value)}
            placeholder={
              bob.mode === 'vacancy' ? t('bob.vacancyPlaceholder') : t('bob.placeholder')
            }
            maxLength={bob.mode === 'vacancy' ? 12_000 : 2_000}
            rows={bob.mode === 'vacancy' ? 5 : 2}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
          />
          <div className="bob-composer-actions">
            {(bob.mode === 'vacancy' || bob.draft.length >= 1_600) && (
              <small>
                {bob.draft.length}/{bob.mode === 'vacancy' ? '12000' : '2000'}
              </small>
            )}
            {bob.error && (
              <button type="button" className="bob-secondary" onClick={bob.retry}>
                <RotateCcw size={15} />
                {t('bob.retry')}
              </button>
            )}
            {bob.streaming ? (
              <button type="button" className="bob-send" onClick={bob.stop}>
                <Square size={14} />
                {t('bob.stop')}
              </button>
            ) : (
              <button type="submit" className="bob-send" disabled={!bob.draft.trim()}>
                <Send size={16} />
                {t('bob.send')}
              </button>
            )}
          </div>
        </form>
        <span className="sr-only" aria-live="polite">
          {bob.streaming ? t('bob.thinking') : ''}
        </span>
      </section>
    </div>,
    document.body,
  );
}
