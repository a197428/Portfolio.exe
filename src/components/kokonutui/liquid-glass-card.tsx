/** Adapted from Kokonut UI Liquid Glass Card, MIT. */
import { type HTMLAttributes, useId } from 'react';
import { cn } from '@/lib/utils';

export function LiquidGlassCard({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const filterId = useId();
  return (
    <div className={cn('liquid-card', className)} {...props}>
      <svg aria-hidden="true" className="glass-filter">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="1"
              seed="7"
              result="noise"
            />
            <feGaussianBlur in="noise" stdDeviation="2" result="blur" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="blur"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>
      <div
        className="liquid-refraction"
        style={{ backdropFilter: `url(#${filterId})` }}
      />
      <div className="liquid-content">{children}</div>
    </div>
  );
}
