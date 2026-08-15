/**
 * Avatar component with circular clipping, subtle glass effect and hover lift.
 * Falls back to profile initials when the image cannot be loaded.
 */
import { type CSSProperties, type HTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

export function Avatar({
  avatar = '/image/avatar.jpg',
  name,
  alt = '',
  size = 120,
  className,
  style,
  ...props
}: Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  avatar?: string;
  name: string;
  alt?: string;
  size?: number;
}) {
  const [failedAvatar, setFailedAvatar] = useState<string>();
  const hasImageError = failedAvatar === avatar;
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? '')
    .join('');
  const fallbackInitials = initials.toLocaleUpperCase() || 'AP';

  const dimensions: CSSProperties = { width: size, height: size, ...style };

  return (
    <div
      {...props}
      className={cn(
        'avatar relative flex items-center justify-center overflow-hidden rounded-full border-2 border-white/10 bg-white/5 transition-transform duration-200 hover:scale-105 hover:bg-white/10',
        className,
      )}
      style={dimensions}
    >
      {hasImageError ? (
        <span
          className="text-xl font-semibold tracking-[0.12em] text-[var(--ink)]"
          role={alt ? 'img' : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
        >
          {fallbackInitials}
        </span>
      ) : (
        <img
          src={avatar}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setFailedAvatar(avatar)}
        />
      )}
    </div>
  );
}
