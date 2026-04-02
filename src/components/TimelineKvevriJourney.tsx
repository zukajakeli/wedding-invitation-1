"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type MutableRefObject,
  type RefObject,
} from "react";

/** Local connector artboard (matches static connector SVG). */
const VB_W = 360;
const VB_H = 84;

/** Pivot (belly center) in glyph space; scale around this so path anchor stays correct. */
const K_PX = 14;
const K_PY = 21;
const KVEVRI_SCALE = 1.46;

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

/** Initials as HTML inside foreignObject — survives non-uniform SVG scaling (unlike tiny &lt;text&gt;). */
function KvevriInitials() {
  return (
    <foreignObject x="0" y="13" width="28" height="13" className="overflow-visible">
      <div
        className="flex h-full w-full items-center justify-center font-serif text-[7px] font-semibold italic leading-none tracking-tight text-[#f5ead8]"
        style={{
          textShadow:
            "0 0 2px #1a0f0a, 0 1px 3px rgba(0,0,0,0.45), 0 -1px 1px rgba(255,255,255,0.2)",
        }}
      >
        L &amp; A
      </div>
    </foreignObject>
  );
}

/** Georgian qvevri: narrow neck, waxed rim, banded egg-shaped clay body, lugs. */
function KvevriGlyph({ gradId }: { gradId: string }) {
  return (
    <g>
      <ellipse
        cx="14"
        cy="12.5"
        rx="5.4"
        ry="1.05"
        fill="none"
        stroke="#4a3529"
        strokeWidth="0.32"
        opacity={0.55}
      />
      <ellipse
        cx="14"
        cy="17.2"
        rx="6.8"
        ry="1.2"
        fill="none"
        stroke="#4a3529"
        strokeWidth="0.32"
        opacity={0.48}
      />
      <ellipse
        cx="14"
        cy="22.5"
        rx="7.35"
        ry="1.1"
        fill="none"
        stroke="#4a3529"
        strokeWidth="0.3"
        opacity={0.42}
      />
      <ellipse
        cx="14"
        cy="27.2"
        rx="6.9"
        ry="1"
        fill="none"
        stroke="#4a3529"
        strokeWidth="0.28"
        opacity={0.36}
      />

      <path
        d="M 5 10.5 Q 2.4 11.6 2.6 14.2 Q 3.1 16.2 5.2 15.4"
        fill="none"
        stroke="#3d2a22"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 23 10.5 Q 25.6 11.6 25.4 14.2 Q 24.9 16.2 22.8 15.4"
        fill="none"
        stroke="#3d2a22"
        strokeWidth="0.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M 14 3.2
           C 16.8 3.2 17.6 4.2 17.4 5.8 L 16.6 8.4
           C 16.3 9.6 16.9 10.4 17.8 10.9
           C 22.8 12.8 25.2 18.2 24.8 24.5
           C 24.4 30.5 20.2 35.2 14 36.2
           C 7.8 35.2 3.6 30.5 3.2 24.5
           C 2.8 18.2 5.2 12.8 10.2 10.9
           C 11.1 10.4 11.7 9.6 11.4 8.4 L 10.6 5.8
           C 10.4 4.2 11.2 3.2 14 3.2 Z"
        fill={`url(#${gradId})`}
        stroke="#261a14"
        strokeWidth="0.42"
      />

      <KvevriInitials />

      <ellipse cx="14" cy="5.1" rx="3.1" ry="1.15" fill="#5a4234" opacity={0.92} />
      <ellipse cx="14" cy="4.35" rx="2.35" ry="0.78" fill="#8a6b52" opacity={0.75} />
      <ellipse cx="14" cy="4.05" rx="1.55" ry="0.45" fill="#2a1e18" opacity={0.35} />
    </g>
  );
}

type Props = {
  rootRef: RefObject<HTMLDivElement | null>;
  connectorRefs: MutableRefObject<(HTMLDivElement | null)[]>;
  connectorCount: number;
};

/**
 * One kvevri follows all mobile connector curves in order; jumps between segments (separate M commands).
 */
export function TimelineKvevriJourney({
  rootRef,
  connectorRefs,
  connectorCount,
}: Props) {
  const reactId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradId = `tt-kv-grad-${reactId}`;

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
  const prevTangentRef = useRef<number | null>(null);
  const prevPtRef = useRef<{ x: number; y: number } | null>(null);

  useLayoutEffect(() => {
    if (!svg) return;

    let cancelled = false;
    const durationMs = durSec * 1000;
    const t0Ref = { current: null as number | null };
    prevTangentRef.current = null;
    prevPtRef.current = null;

    function unwrapTangent(prev: number | null, rawDeg: number): number {
      if (prev === null) return rawDeg;
      let delta = rawDeg - prev;
      delta = ((((delta + 180) % 360) + 360) % 360) - 180;
      return prev + delta;
    }

    /** Keep neck roughly “up”: if path wants ±100°, show upright rotation instead. */
    function uprightDisplayAngle(tangentDeg: number): number {
      let a = tangentDeg;
      if (a > 87) a -= 180;
      else if (a < -87) a += 180;
      return a;
    }

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
      const prevPt = prevPtRef.current;
      if (prevPt) {
        const jump = Math.hypot(pt.x - prevPt.x, pt.y - prevPt.y);
        if (jump > 35) prevTangentRef.current = null;
      }
      prevPtRef.current = { x: pt.x, y: pt.y };

      const eps = Math.min(4, total * 0.025);
      const d2 = d < total - eps ? d + eps : Math.max(0, d - eps);
      const pt2 = p.getPointAtLength(d2);
      const raw = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * (180 / Math.PI);
      const rawSafe = Number.isFinite(raw) ? raw : 0;

      const tangent = unwrapTangent(prevTangentRef.current, rawSafe);
      prevTangentRef.current = tangent;

      const displayAngle = uprightDisplayAngle(tangent);

      r.setAttribute(
        "transform",
        `translate(${pt.x},${pt.y}) rotate(${displayAngle}) translate(${-K_PX},${-K_PY})`
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
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b6f56" />
            <stop offset="35%" stopColor="#6b4e3d" />
            <stop offset="72%" stopColor="#4a3529" />
            <stop offset="100%" stopColor="#34241c" />
          </linearGradient>
        </defs>

        <path ref={pathRef} d={svg.pathD} fill="none" stroke="none" />

        <g ref={riderRef} opacity={0.92}>
          <g
            transform={`translate(${K_PX},${K_PY}) scale(${KVEVRI_SCALE}) translate(${-K_PX},${-K_PY})`}
          >
            <KvevriGlyph gradId={gradId} />
          </g>
        </g>
      </svg>
    </div>
  );
}
