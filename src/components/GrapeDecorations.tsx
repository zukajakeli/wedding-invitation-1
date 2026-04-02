"use client";

import Image from "next/image";

const VINE = "#4A5B45";

const maskStyle = {
  backgroundColor: VINE,
  maskImage: "url(/assets/grapes-ornament.svg)",
  WebkitMaskImage: "url(/assets/grapes-ornament.svg)",
  maskSize: "contain",
  maskRepeat: "no-repeat",
  maskPosition: "center",
  WebkitMaskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
} as const;

export function MaskedGrapes({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={className}
      style={{
        ...maskStyle,
      }}
    />
  );
}

/** Behind hero copy; sits under invitation text via parent z-index. */
export function HeroGrapeDecor() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <MaskedGrapes className="absolute -left-[14%] top-[6%] w-[min(44vw,360px)] h-[min(34vw,290px)] opacity-[0.1] -rotate-[6deg]" />
      <MaskedGrapes className="absolute -right-[12%] top-[22%] w-[min(40vw,320px)] h-[min(31vw,260px)] opacity-[0.08] rotate-[10deg] scale-x-[-1]" />
      <MaskedGrapes className="absolute left-[18%] -bottom-[6%] w-[min(36vw,280px)] h-[min(28vw,220px)] opacity-[0.07] rotate-[4deg] md:opacity-[0.09]" />
      <Image
        src="/assets/grape-cluster.svg"
        alt=""
        width={210}
        height={272}
        unoptimized
        className="absolute right-[4%] top-[30%] w-[min(26vw,210px)] h-auto opacity-[0.16] rotate-[8deg] hidden sm:block"
      />
      <Image
        src="/assets/grape-cluster.svg"
        alt=""
        width={170}
        height={220}
        unoptimized
        className="absolute left-[2%] bottom-[18%] w-[min(22vw,170px)] h-auto opacity-[0.14] -rotate-[12deg] scale-x-[-1] hidden md:block"
      />
    </div>
  );
}

/** Corner accents for content sections (timetable, dress code, etc.). */
export function SectionGrapeDecor({
  showMobileCorners = false,
}: {
  /** When true, masked corner vines show below `lg` (e.g. location). Timetable keeps default to avoid crowding the mobile layout. */
  showMobileCorners?: boolean;
} = {}) {
  const cornerLgOnly = showMobileCorners ? "" : "hidden lg:block";
  return (
    <>
      <MaskedGrapes
        className={`absolute -left-[10%] sm:-left-[8%] top-[18%] sm:top-1/2 sm:-translate-y-1/2 w-[min(38vw,200px)] lg:w-[min(32vw,240px)] h-[min(30vw,160px)] lg:h-[min(25vw,200px)] opacity-[0.09] lg:opacity-[0.11] -rotate-[5deg] pointer-events-none ${cornerLgOnly}`}
      />
      <MaskedGrapes
        className={`absolute -right-[8%] sm:-right-[6%] top-6 sm:top-8 w-[min(34vw,180px)] lg:w-[min(28vw,200px)] h-[min(26vw,150px)] lg:h-[min(22vw,170px)] opacity-[0.08] lg:opacity-[0.09] rotate-[8deg] scale-x-[-1] pointer-events-none ${cornerLgOnly}`}
      />
      <Image
        src="/assets/grape-cluster.svg"
        alt=""
        width={140}
        height={181}
        unoptimized
        className="absolute right-4 bottom-6 w-[min(20vw,140px)] h-auto opacity-[0.13] rotate-[6deg] md:right-8 md:bottom-10"
      />
      {showMobileCorners ? (
        <Image
          src="/assets/grape-cluster.svg"
          alt=""
          width={120}
          height={155}
          unoptimized
          className="absolute left-2 bottom-32 lg:hidden w-[min(22vw,120px)] h-auto opacity-[0.11] -rotate-[8deg] scale-x-[-1] pointer-events-none"
          aria-hidden
        />
      ) : null}
    </>
  );
}
