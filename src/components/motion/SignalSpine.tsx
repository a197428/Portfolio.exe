import { createTimeline, onScroll, svg } from 'animejs';
import { type RefObject, useCallback, useLayoutEffect, useRef, useState } from 'react';
import { useAnimeScope } from '@/hooks/useAnimeScope';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface SignalSpineProps {
  root: RefObject<HTMLDivElement | null>;
  refreshKey: string;
}

interface SignalNode {
  x: number;
  y: number;
  progress: number;
}

interface SignalGeometry {
  width: number;
  height: number;
  startY: number;
  endY: number;
  path: string;
  nodes: SignalNode[];
}

const EMPTY_GEOMETRY: SignalGeometry = {
  width: 1,
  height: 1,
  startY: 0,
  endY: 1,
  path: 'M 0 0',
  nodes: [],
};

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

function buildPath(points: Array<{ x: number; y: number }>) {
  if (points.length === 0) return 'M 0 0';
  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const middleY = previous.y + (point.y - previous.y) * 0.5;
    return `${path} C ${previous.x} ${middleY}, ${point.x} ${middleY}, ${point.x} ${point.y}`;
  }, `M ${points[0].x} ${points[0].y}`);
}

export function SignalSpine({ root, refreshKey }: SignalSpineProps) {
  const spineRoot = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const [geometry, setGeometry] = useState<SignalGeometry>(EMPTY_GEOMETRY);

  // The ref object is stable while ref.current intentionally remains mutable;
  // ResizeObserver must always read the latest mounted page element.
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const measure = useCallback(() => {
    const page = root.current;
    if (!page) return;

    const pageRect = page.getBoundingClientRect();
    const hero = page.querySelector<HTMLElement>('[data-signal-origin]');
    const anchors = Array.from(
      page.querySelectorAll<HTMLElement>('[data-signal-anchor]'),
    );
    if (!hero || anchors.length !== 5) return;

    const mobile = pageRect.width <= 720;
    const edgePadding = mobile ? 12 : 18;
    const nodes = anchors.map((anchor) => {
      const anchorRect = anchor.getBoundingClientRect();
      const anchorLeft = anchorRect.left - pageRect.left;
      // Every node belongs to the section index, not to the section box. A
      // shared editorial gutter keeps the route out of cards while preserving
      // the small natural offsets created by each heading's real position.
      const x = clamp(
        mobile ? anchorLeft - 16 : anchorLeft - 20,
        edgePadding,
        pageRect.width - edgePadding,
      );
      return {
        x,
        y: anchorRect.top - pageRect.top + anchorRect.height * 0.5,
        progress: 0,
      };
    });

    const originRect = hero.getBoundingClientRect();
    const origin = {
      x: nodes[0].x,
      y: originRect.bottom - pageRect.top - (mobile ? 10 : 28),
    };
    const startY = origin.y;
    const distance = Math.max(nodes.at(-1)!.y - startY, 1);
    const measuredNodes = nodes.map((node) => ({
      ...node,
      progress: clamp((node.y - startY) / distance, 0, 1),
    }));
    const next = {
      width: Math.max(Math.round(pageRect.width), 1),
      height: Math.max(Math.round(page.scrollHeight), 1),
      startY,
      endY: measuredNodes.at(-1)!.y,
      path: buildPath([origin, ...measuredNodes]),
      nodes: measuredNodes,
    };

    setGeometry((current) =>
      current.width === next.width &&
      current.height === next.height &&
      current.path === next.path
        ? current
        : next,
    );
  }, [root]);

  useLayoutEffect(() => {
    let observer: ResizeObserver | undefined;
    const frame = requestAnimationFrame(() => {
      const page = root.current;
      if (!page) return;
      measure();
      if (typeof ResizeObserver === 'undefined') return;
      observer = new ResizeObserver(measure);
      observer.observe(page);
      page.querySelectorAll('section').forEach((section) => observer?.observe(section));
    });
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [measure, refreshKey, root]);

  useAnimeScope(spineRoot, () => {
    const page = root.current;
    const track = spineRoot.current?.querySelector<HTMLElement>('[data-signal-track]');
    const path = spineRoot.current?.querySelector<SVGPathElement>(
      '[data-signal-path-active]',
    );
    const pulse =
      spineRoot.current?.querySelector<SVGCircleElement>('[data-signal-pulse]');
    const nodes =
      spineRoot.current?.querySelectorAll<SVGCircleElement>('[data-signal-node]');
    const nodeGroups = spineRoot.current?.querySelectorAll<SVGGElement>(
      '[data-signal-node-group]',
    );
    if (
      !page ||
      !track ||
      !path ||
      !pulse ||
      !nodes?.length ||
      !nodeGroups?.length ||
      geometry.nodes.length !== 5
    )
      return;

    const [drawable] = svg.createDrawable(path);
    const { translateX, translateY } = svg.createMotionPath(path);
    const pathLength = path.getTotalLength();
    const nodeProgresses = geometry.nodes.map((node) => {
      let low = 0;
      let high = pathLength;
      // The route is monotonic on Y, so a short binary search maps each
      // physical anchor to the exact progress used by createMotionPath().
      for (let iteration = 0; iteration < 18; iteration += 1) {
        const middle = (low + high) * 0.5;
        if (path.getPointAtLength(middle).y < node.y) low = middle;
        else high = middle;
      }
      return ((low + high) * 0.5) / Math.max(pathLength, 1);
    });
    nodeGroups.forEach((group, index) => {
      group.dataset.signalNodeProgress = nodeProgresses[index].toFixed(4);
    });
    let activeNode = -1;
    const updateNodeStates = (progress: number) => {
      let nextActiveNode = -1;
      nodeProgresses.forEach((nodeProgress, index) => {
        if (progress + 0.004 >= nodeProgress) nextActiveNode = index;
      });

      if (nextActiveNode === activeNode) return;
      activeNode = nextActiveNode;
      nodeGroups.forEach((group, index) => {
        group.dataset.signalState =
          index < activeNode ? 'passed' : index === activeNode ? 'active' : 'idle';
      });
      if (spineRoot.current) {
        spineRoot.current.dataset.signalActiveNode =
          activeNode >= 0 ? `0${activeNode + 1}` : 'none';
      }
    };

    const duration = 1000;
    const timeline = createTimeline({
      autoplay: false,
      defaults: { ease: 'linear' },
    });

    timeline.add(drawable, { draw: ['0 0', '0 1'], duration }, 0).add(
      pulse,
      {
        translateX,
        translateY,
        opacity: [0, 1, 1, 0],
        duration,
      },
      0,
    );

    const applyProgress = (progress: number) => {
      const normalizedProgress = clamp(progress, 0, 1);
      timeline.seek(duration * normalizedProgress);
      updateNodeStates(normalizedProgress);
      if (spineRoot.current) {
        spineRoot.current.dataset.signalProgress = normalizedProgress.toFixed(4);
      }
    };
    const observer = onScroll({
      target: track,
      // Matching thresholds make the pulse meet every physical node at the
      // same viewport depth instead of accelerating through long project sets.
      enter: 'top 72%',
      leave: 'bottom 72%',
      onUpdate: (self) => {
        applyProgress(self.progress);
      },
    });

    let syncFrame = 0;
    const syncFromViewport = () => {
      cancelAnimationFrame(syncFrame);
      syncFrame = requestAnimationFrame(() => {
        const trackRect = track.getBoundingClientRect();
        const trackTop = trackRect.top + window.scrollY;
        const threshold = window.innerHeight * 0.72;
        const start = trackTop - threshold;
        const maximumScroll = Math.max(
          document.documentElement.scrollHeight - window.innerHeight,
          0,
        );
        const end = Math.min(trackTop + track.offsetHeight - threshold, maximumScroll);
        applyProgress((window.scrollY - start) / Math.max(end - start, 1));
      });
    };
    window.addEventListener('scroll', syncFromViewport, { passive: true });
    syncFromViewport();

    return () => {
      cancelAnimationFrame(syncFrame);
      window.removeEventListener('scroll', syncFromViewport);
      observer.revert();
    };
  }, [geometry.path, geometry.height, refreshKey]);

  const displayNodes =
    geometry.nodes.length === 5
      ? geometry.nodes
      : Array.from({ length: 5 }, () => ({ x: 0, y: 0, progress: 0 }));

  return (
    <div
      className="signal-spine"
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
      data-signal-progress="0"
      ref={spineRoot}
      aria-hidden="true"
    >
      <span
        data-signal-track
        style={{
          position: 'absolute',
          top: geometry.startY,
          left: 0,
          width: 1,
          height: Math.max(geometry.endY - geometry.startY, 1),
        }}
      />
      <svg
        data-signal-spine
        viewBox={`0 0 ${geometry.width} ${geometry.height}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="signal-spine-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path className="signal-spine-base" d={geometry.path} />
        <path className="signal-spine-active" data-signal-path-active d={geometry.path} />
        {displayNodes.map((node, index) => (
          <g key={index} data-signal-node-group data-signal-state="idle">
            <circle className="signal-node-ring" cx={node.x} cy={node.y} r="7" />
            <circle
              className="signal-node-core"
              data-signal-node
              data-signal-index={`0${index + 1}`}
              cx={node.x}
              cy={node.y}
              r="2.5"
            />
          </g>
        ))}
        <circle className="signal-spine-pulse" data-signal-pulse cx="0" cy="0" r="3.5" />
      </svg>
    </div>
  );
}
