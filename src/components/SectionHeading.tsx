interface SectionHeadingProps {
  /** id passed to the heading; the owning section references it via aria-labelledby. */
  id?: string;
  /** Service number rendered before the kicker, e.g. "01". */
  index: string;
  /** Translated section kicker. */
  kicker: string;
  /** Translated section title. */
  title: string;
  /** Scale variant: 'section' is the default editorial heading, 'sub' a compact
   *  panel-level heading (used by the Contact panel). */
  size?: 'section' | 'sub';
}

/** Editorial section heading: the service index + kicker sit in the narrow
 *  left column, the title fills the wide right column on desktop; on mobile
 *  the kicker returns above the title. */
export function SectionHeading({
  id,
  index,
  kicker,
  title,
  size = 'section',
}: SectionHeadingProps) {
  return (
    <div className={`section-heading${size === 'sub' ? ' section-heading--sub' : ''}`}>
      <span className="section-heading-kicker">
        {index} / {kicker}
      </span>
      <h2 className="section-heading-title" id={id}>
        {title}
      </h2>
    </div>
  );
}
