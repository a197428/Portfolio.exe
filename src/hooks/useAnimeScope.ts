import { createScope, type Scope } from 'animejs';
import { type RefObject, useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function useAnimeScope<T extends HTMLElement>(
  root: RefObject<T | null>,
  setup: (scope: Scope) => void,
  dependencies: ReadonlyArray<unknown> = [],
) {
  const scope = useRef<Scope | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!root.current || reducedMotion) return;

    const nextScope = createScope({ root: root.current });
    scope.current = nextScope.add(() => setup(nextScope));
    return () => {
      scope.current?.revert();
      scope.current = null;
    };
    // setup is intentionally controlled by the caller-provided dependency list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, reducedMotion, ...dependencies]);

  return { scope, reducedMotion };
}
