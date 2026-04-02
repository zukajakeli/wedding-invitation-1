"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { translations, Language } from "@/locales/translations";

export function Countdown({ lang }: { lang: Language }) {
  const t = translations[lang].countdown;
  const weddingDate = new Date("2026-04-19T14:00:00").getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [weddingDate]);

  return (
    <div className="relative overflow-hidden flex flex-col items-center py-20 w-full" style={{ backgroundColor: '#838769' }}>
      <Image
        src="/assets/grape-cluster.svg"
        alt=""
        width={150}
        height={194}
        unoptimized
        className="absolute -left-6 -top-6 w-[min(28vw,120px)] sm:w-[min(24vw,150px)] h-auto opacity-[0.18] sm:opacity-[0.2] rotate-[-12deg] pointer-events-none"
        aria-hidden
      />
      <Image
        src="/assets/grape-cluster.svg"
        alt=""
        width={150}
        height={194}
        unoptimized
        className="absolute -right-6 -top-6 w-[min(28vw,120px)] sm:w-[min(24vw,150px)] h-auto opacity-[0.18] sm:opacity-[0.2] rotate-[12deg] scale-x-[-1] pointer-events-none"
        aria-hidden
      />
      <h2 className="relative z-10 font-serif italic text-4xl sm:text-5xl mb-3 text-white text-center">{t.title}</h2>
      <p className="relative z-10 font-serif text-sm sm:text-base text-white/80 mb-12 text-center tracking-wide">
        {t.subtitle}
      </p>
      <div className="relative z-10 flex gap-3 sm:gap-6 text-center justify-center">
        {[
          { label: t.days, value: timeLeft.days },
          { label: t.hours, value: timeLeft.hours },
          { label: t.minutes, value: timeLeft.minutes },
          { label: t.seconds, value: timeLeft.seconds },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center justify-center w-20 h-24 sm:w-24 sm:h-28 bg-white/10 rounded-md border border-white/20 shadow-sm backdrop-blur-sm">
            <span className="font-serif text-3xl sm:text-4xl text-white mb-2">{item.value}</span>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/70 font-serif">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
