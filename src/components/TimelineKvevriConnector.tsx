"use client";

import Image from "next/image";
import { MaskedGrapes } from "./GrapeDecorations";

/** View-space paths (match journey measurement). */
const PATH_TO_LEFT = "M56 10 C 122 66, 242 60, 308 74";
const PATH_TO_RIGHT = "M308 10 C 248 66, 126 60, 56 74";

type Props = {
  isRight: boolean;
};

/**
 * Mobile timetable zig-zag: curved stroke + grape decor (kvevri is one global journey overlay).
 */
export function TimelineKvevriConnector({ isRight }: Props) {
  const pathD = isRight ? PATH_TO_RIGHT : PATH_TO_LEFT;

  return (
    <div className="relative mt-1 mb-1 h-20 w-full pointer-events-none" aria-hidden>
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/grapes-ornament.svg"
          alt=""
          width={56}
          height={34}
          unoptimized
          className={`absolute top-1/2 w-11 -translate-y-1/2 h-auto opacity-[0.22] ${isRight ? "left-[35%] rotate-[10deg]" : "right-[35%] rotate-[-10deg]"}`}
          aria-hidden
        />
        <MaskedGrapes
          className={`absolute top-[58%] w-10 h-12 opacity-[0.2] ${isRight ? "left-[54%] -rotate-[8deg]" : "right-[54%] rotate-[8deg]"}`}
        />
      </div>

      <svg
        className="absolute inset-0 z-[1] h-full w-full"
        viewBox="0 0 360 84"
        preserveAspectRatio="none"
      >
        <path
          d={pathD}
          fill="none"
          stroke="#7f8c79"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="opacity-[0.45]"
        />
      </svg>
    </div>
  );
}
