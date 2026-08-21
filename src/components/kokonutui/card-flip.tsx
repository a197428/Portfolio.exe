/** Adapted from Kokonut UI Card Flip, MIT.
 *
 * The whole card surface is a single toggle button: hover shows the back
 * temporarily, a click or Enter/Space pins it open, and Escape returns the
 * front. Under `prefers-reduced-motion` the 3D rotation is replaced by a short
 * fade between the two faces. */
import { ArrowRight, Repeat2 } from 'lucide-react';
import { useState, type KeyboardEvent, type MouseEvent } from 'react';
import { cn } from '@/lib/utils';

export interface FlipCardProps {
  /** Service number shown on the front face, e.g. "01". */
  index: string;
  title: string;
  /** Short overview kept on the front face. */
  summary: string;
  /** 3–4 substantive points revealed on the back face. */
  details: string[];
  /** Neutral hint label shown on the front face (no action verbs). */
  frontLabel: string;
  /** Neutral hint label shown on the back face (no action verbs). */
  backLabel: string;
  /** Accessible-name template for the closed card, e.g. "View details: {{title}}". */
  revealLabel: string;
  /** Accessible-name template for the open card, e.g. "Back to overview: {{title}}". */
  collapseLabel: string;
  className?: string;
}

export function FlipCard({
  index,
  title,
  summary,
  details,
  frontLabel,
  backLabel,
  revealLabel,
  collapseLabel,
  className,
}: FlipCardProps) {
  const [pinned, setPinned] = useState(false);
  const [focused, setFocused] = useState(false);

  // Screen readers follow the persistent side: a hovered card flips visually
  // through CSS but stays the "front" for assistive technology until it is
  // pinned or focused (keyboard users see the back while focused).
  const flipped = pinned || focused;

  // The visible hint stays neutral, while the accessible name explains the
  // action to assistive technology. `{{title}}` is substituted per card.
  const accessibleName = (flipped ? collapseLabel : revealLabel).replace(
    '{{title}}',
    title,
  );

  const togglePin = () => setPinned((value) => !value);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      togglePin();
    } else if (event.key === 'Escape') {
      setPinned(false);
    }
  };

  // A mouse click pins/unpins without leaving focus behind, so a pointer user
  // who collapses the card sees it close as soon as the cursor leaves. Keyboard
  // users still reach the card with Tab and preview the back while focused.
  const handleMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div
      className={cn('flip-card', className)}
      data-pinned={pinned}
      role="button"
      tabIndex={0}
      aria-pressed={pinned}
      aria-label={accessibleName}
      onClick={togglePin}
      onKeyDown={handleKeyDown}
      onMouseDown={handleMouseDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="flip-card-inner">
        <div className="flip-card-face flip-card-front" aria-hidden={flipped}>
          <div className="flip-card-pattern" aria-hidden="true" />
          <div className="flip-card-front-copy">
            <span className="flip-card-index">{index}</span>
            <h3 className="flip-card-title">{title}</h3>
            <p className="flip-card-summary">{summary}</p>
          </div>
          <div className="flip-card-hint">
            <Repeat2 size={15} aria-hidden="true" />
            <span>{frontLabel}</span>
          </div>
        </div>

        <div className="flip-card-face flip-card-back" aria-hidden={!flipped}>
          <div className="flip-card-pattern" aria-hidden="true" />
          <h3 className="flip-card-title">{title}</h3>
          <ul className="flip-card-details">
            {details.map((item) => (
              <li key={item}>
                <ArrowRight size={14} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="flip-card-hint">
            <Repeat2 size={15} aria-hidden="true" />
            <span>{backLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
