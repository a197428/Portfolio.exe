import { useId } from 'react';

interface BobMarkProps {
  size?: number;
  className?: string;
}

export function BobMark({ size = 28, className }: BobMarkProps) {
  const glowId = useId();

  return (
    <svg
      aria-hidden="true"
      data-bob-mark
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id={glowId} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M23 9.5C23 6.46 25.46 4 28.5 4h7C38.54 4 41 6.46 41 9.5V13H23V9.5Z"
        fill="currentColor"
        opacity=".5"
      />
      <path
        d="M9 30H6.5A4.5 4.5 0 0 0 2 34.5v7A4.5 4.5 0 0 0 6.5 46H9V30ZM55 30h2.5a4.5 4.5 0 0 1 4.5 4.5v7a4.5 4.5 0 0 1-4.5 4.5H55V30Z"
        fill="currentColor"
        opacity=".72"
      />
      <rect x="7" y="11" width="50" height="47" rx="19" fill="#14251e" />
      <rect
        x="8"
        y="12"
        width="48"
        height="45"
        rx="18"
        stroke="currentColor"
        opacity=".34"
      />
      <path
        data-bob-face
        d="M15 27.5c0-7.3 6.2-11.9 13.1-11.9h9.1c8.1 0 12.2 5.8 11.8 13.4l-.5 8.4c-.5 8.6-6.3 14-14.9 14h-4.8C20.2 51.4 15 46 15 37.4v-9.9Z"
        fill="#06120d"
      />
      <path
        d="M18.5 27.2c1.2-4.2 4.7-7.4 9.4-8.2"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity=".12"
      />
      {/* Eyes use the portfolio accent, independent of the inherited
          currentColor, so they stay visible on dark faces everywhere. */}
      <g filter={`url(#${glowId})`} fill="var(--accent)">
        <rect data-bob-eye x="23" y="28" width="5" height="12" rx="2.5" />
        <rect data-bob-eye x="37" y="28" width="5" height="12" rx="2.5" />
      </g>
    </svg>
  );
}
