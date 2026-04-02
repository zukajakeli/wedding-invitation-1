"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
  type RefObject,
} from "react";

/** Local connector artboard (matches static connector SVG). */
const VB_W = 360;
const VB_H = 84;

/** Bowl GIF size in SVG user units (centered on path). */
const BOWL_SIZE = 72;
const BOWL_HALF = BOWL_SIZE / 2;

function segmentPathPixels(
  cRect: DOMRectReadOnly,
  parent: DOMRectReadOnly,
  isRight: boolean
): string {
  const l = cRect.left - parent.left;
  const t = cRect.top - parent.top;
  const w = cRect.width;
  const h = cRect.height;
  const X = (x: number) => l + (x / VB_W) * w;
  const Y = (y: number) => t + (y / VB_H) * h;
  if (isRight) {
    return `M ${X(308)} ${Y(10)} C ${X(248)} ${Y(66)}, ${X(126)} ${Y(60)}, ${X(56)} ${Y(74)}`;
  }
  return `M ${X(56)} ${Y(10)} C ${X(122)} ${Y(66)}, ${X(242)} ${Y(60)}, ${X(308)} ${Y(74)}`;
}

type Props = {
  rootRef: RefObject<HTMLDivElement | null>;
  connectorRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  connectorCount: number;
};

/**
 * Bowl GIF follows mobile connector curves (GIF handles its own spin).
 */
export function TimelineKvevriJourney({
  rootRef,
  connectorRefs,
  connectorCount,
}: Props) {
  const [svg, setSvg] = useState<{
    pathD: string;
    w: number;
    h: number;
  } | null>(null);

  const pathRef = useRef<SVGPathElement | null>(null);
  const riderRef = useRef<SVGGElement | null>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || connectorCount <= 0) {
      setSvg(null);
      return;
    }

    let poll: ReturnType<typeof setInterval> | null = null;
    let cancelled = false;

    function measure(): boolean {
      const el = rootRef.current;
      if (!el || cancelled) return false;

      if (
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 768px)").matches
      ) {
        setSvg(null);
        return true;
      }

      const parent = el.getBoundingClientRect();
      if (parent.width < 8 || parent.height < 8) return false;

      const parts: string[] = [];
      for (let i = 0; i < connectorCount; i++) {
        const strip = connectorRefs.current[i];
        if (!strip) return false;
        const c = strip.getBoundingClientRect();
        if (c.width < 4 || c.height < 4) return false;
        const isRight = i % 2 === 1;
        parts.push(segmentPathPixels(c, parent, isRight));
      }

      setSvg({
        pathD: parts.join(" "),
        w: parent.width,
        h: parent.height,
      });
      return true;
    }

    function measureSoon() {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (cancelled || measure()) return;
          let n = 0;
          poll = setInterval(() => {
            if (cancelled) {
              if (poll) clearInterval(poll);
              poll = null;
              return;
            }
            if (measure()) {
              if (poll) clearInterval(poll);
              poll = null;
              return;
            }
            n += 1;
            if (n > 25 && poll) {
              clearInterval(poll);
              poll = null;
            }
          }, 48);
        });
      });
    }

    measureSoon();
    const ro = new ResizeObserver(measureSoon);
    ro.observe(root);
    for (let i = 0; i < connectorCount; i++) {
      const strip = connectorRefs.current[i];
      if (strip) ro.observe(strip);
    }
    window.addEventListener("resize", measureSoon);
    return () => {
      cancelled = true;
      if (poll) clearInterval(poll);
      ro.disconnect();
      window.removeEventListener("resize", measureSoon);
    };
  }, [rootRef, connectorRefs, connectorCount]);

  const durSec = 22 + connectorCount * 8;

  const rafRef = useRef(0);

  useLayoutEffect(() => {
    if (!svg) return;

    let cancelled = false;
    const durationMs = durSec * 1000;
    const t0Ref = { current: null as number | null };

    function loop(now: number) {
      if (cancelled) return;

      const p = pathRef.current;
      const r = riderRef.current;
      if (!p || !r) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const total = p.getTotalLength();
      if (total < 2) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      if (t0Ref.current === null) t0Ref.current = now;
      const t = (((now - t0Ref.current) % durationMs) / durationMs);
      const d = t * total;
      const pt = p.getPointAtLength(d);

      r.setAttribute(
        "transform",
        `translate(${pt.x},${pt.y}) translate(${-BOWL_HALF},${-BOWL_HALF})`
      );

      rafRef.current = requestAnimationFrame(loop);
    }

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
    };
  }, [svg, durSec]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(min-width: 768px)").matches) return;
    if (svg) return;
    const t = window.setTimeout(() => {
      if (window.matchMedia("(min-width: 768px)").matches) return;
      const root = rootRef.current;
      if (!root) return;
      const parent = root.getBoundingClientRect();
      if (parent.width < 8 || parent.height < 8) return;
      const parts: string[] = [];
      for (let i = 0; i < connectorCount; i++) {
        const strip = connectorRefs.current[i];
        if (!strip) return;
        const c = strip.getBoundingClientRect();
        if (c.width < 4 || c.height < 4) return;
        parts.push(segmentPathPixels(c, parent, i % 2 === 1));
      }
      setSvg({ pathD: parts.join(" "), w: parent.width, h: parent.height });
    }, 320);
    return () => clearTimeout(t);
  }, [svg, connectorCount, connectorRefs, rootRef]);

  if (!svg) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-[30] overflow-visible md:hidden">
      <svg
        className="block h-full w-full"
        viewBox={`0 0 ${svg.w} ${svg.h}`}
        preserveAspectRatio="none"
        aria-hidden
      >
        <path ref={pathRef} d={svg.pathD} fill="none" stroke="none" />

        <g ref={riderRef} opacity={0.95}>
          <image
            href="/gizgizi.gif"
            width={BOWL_SIZE}
            height={BOWL_SIZE}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </svg>
    </div>
  );
}
