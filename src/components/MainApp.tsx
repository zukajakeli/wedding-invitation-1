"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { translations, Language } from "@/locales/translations";
import { Countdown } from "./Countdown";
import { VenueMap } from "./Map";
import Image from "next/image";
import { MapPin, CalendarDays, Utensils, Volume2, VolumeX, Globe, Heart, Wine, Church, Clock, ExternalLink } from "lucide-react";

function appleMapsUrl(lat: number, lng: number, label: string) {
  return `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(label)}`;
}
import { BalconyScene } from "./BalconyScene";
import { RsvpForm } from "./RsvpForm";
import { useProgress } from "@react-three/drei";
import { HeroGrapeDecor, SectionGrapeDecor, MaskedGrapes } from "./GrapeDecorations";

function LoadingOverlay() {
  const { progress } = useProgress();
  return (
    <AnimatePresence>
      {progress < 100 && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#F3EFE7]"
        >
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-4xl md:text-5xl font-cursive text-stone-800">
              Levan & Anni
            </h1>
            <div className="w-32 h-[1px] bg-stone-300 relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-stone-800 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="font-serif text-xs tracking-widest uppercase text-stone-500">
              {Math.round(progress)}%
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function MainApp({ name, lang }: { name: string; lang: Language }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const t = translations[lang];

  useEffect(() => {
    if (!isEnded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isEnded]);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);

    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(err => console.log("Audio autoplay failed:", err));
    }

    setTimeout(() => {
      setIsEnded(true);
    }, 3000); // fade out early before seeing the back side
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const switchLanguage = (newLang: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", newLang);
    router.push(pathname + "?" + params.toString(), { scroll: false });
  };

  return (
    <div className="relative min-h-screen bg-stone-50 w-full overflow-x-hidden">

      <LoadingOverlay />

      <audio ref={audioRef} loop>
        <source src="/mukhambazi.mp3" type="audio/mpeg" />
      </audio>

      {/* FLOATING CONTROLS (Language + Music) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ delay: 1 }}
        className="fixed top-4 right-4 z-40 flex items-center gap-2"
      >
        <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-md flex items-center gap-2 border border-stone-200">
          <Globe size={16} className="text-stone-400 mr-1" />
          {["ka", "en", "ru", "fr"].map((l) => (
            <button
              key={l}
              onClick={() => switchLanguage(l)}
              className={`text-xs font-serif uppercase px-1.5 transition-colors ${lang === l ? "text-stone-900 font-bold scale-110" : "text-stone-400 hover:text-stone-600"
                }`}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          onClick={toggleMute}
          className="bg-white/80 backdrop-blur-sm p-2.5 rounded-full shadow-md text-stone-600 hover:text-stone-900 transition-colors border border-stone-200"
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </motion.div>

      {/* TOP SECTION: Balcony + Invitation Behind It */}
      <div className="relative w-full h-[100svh] overflow-hidden bg-stone-100 flex flex-col items-center justify-center">

        {/* Full-bleed grape ornaments (behind invitation copy) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <HeroGrapeDecor />
        </div>

        {/* Background Content (Invitation) */}
        <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center text-center px-4 pt-20 w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isEnded ? 1 : 0, scale: isEnded ? 1 : 0.95 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`flex flex-col items-center ${isEnded ? "pointer-events-auto" : "pointer-events-none"}`}
          >
            <h1 className="text-6xl md:text-8xl font-cursive text-stone-800 mb-8">
              Levan & Anni
            </h1>
            <div className="w-16 h-px bg-stone-300 mb-8" />

            <p className="font-serif text-lg md:text-2xl text-stone-600 leading-relaxed max-w-lg whitespace-pre-line mb-12">
              {t.hero.invite}
            </p>

            {name && (
              <div className="bg-white/80 backdrop-blur-sm border border-stone-200 px-8 py-6 shadow-sm mb-12 max-w-md w-full">
                <p className="font-serif text-stone-500 text-sm tracking-widest uppercase mb-2">
                  {t.hero.dear}
                </p>
                <p className="font-cursive text-4xl text-stone-800">
                  {name}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-8 text-stone-500 font-serif text-sm tracking-widest uppercase">
              <div className="flex items-center gap-2">
                <CalendarDays size={18} />
                <span>25.09.2026</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={18} />
                <span>Tbilisi</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 3D Balcony Overlay */}
        <motion.div
          className={`absolute inset-0 z-10 ${isEnded ? "pointer-events-none" : "cursor-pointer bg-black"}`}
          animate={{ opacity: isEnded ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          onClick={!isOpen ? handleOpen : undefined}
        >
          <BalconyScene isOpen={isOpen} pointerEventsEnabled={!isEnded} />

          {/* Open Button overlay */}
          <motion.div
            className="absolute inset-0 flex items-end justify-center pb-24 md:pb-32 text-white z-20 pointer-events-none"
            animate={{ opacity: isOpen ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-black/50 px-8 py-4 rounded-full backdrop-blur-md border border-white/30 font-serif tracking-widest text-sm animate-pulse pointer-events-auto hover:bg-black/70 transition-colors shadow-2xl">
              Enter
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* REST OF THE LANDING PAGE */}
      <div className="flex flex-col items-center w-full z-20 relative bg-stone-50">

        {/* Countdown Section */}
        <Countdown lang={lang} />

        {/* Timetable Section */}
        <section className="relative overflow-hidden py-24 px-4 w-full flex flex-col items-center" style={{ backgroundColor: '#F3EFE7' }}>
          <SectionGrapeDecor />
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center relative z-10">
            <h2 className="font-serif italic text-4xl sm:text-5xl text-center mb-2" style={{ color: '#4A5B45' }}>
              {t.timetable.title}
            </h2>
            <p className="font-serif text-sm text-stone-500 mb-16 text-center tracking-wide uppercase">
              {t.timetable.subtitle}
            </p>

            {/* Main timeline container */}
            <div className="relative flex flex-col md:flex-row w-full justify-between items-stretch px-4 md:px-0">

              {/* Desktop: horizontal connector */}
              <div className="hidden md:block absolute left-12 right-12 top-[85px] h-[2px] bg-stone-300 z-0" />

              {/* The elegant vine background (desktop only) */}
              <div className="hidden md:block absolute left-1/2 top-[20px] -translate-x-1/2 w-full max-w-4xl h-[150px] opacity-10 pointer-events-none z-0"
                style={{
                  backgroundImage: "url('/assets/vine-ornament.jpg')",
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "repeat-x"
                }}
              />

              {t.timetable.items.map((item, index) => {
                const icons = [Church, Wine, Heart, Utensils];
                const Icon = icons[index % icons.length];
                const isLast = index === t.timetable.items.length - 1;

                return (
                  <div key={index} className="relative z-10 w-full md:w-1/4 group">
                    <div className="flex flex-row md:flex-col items-center w-full gap-3 md:gap-0">
                      <div
                        className="shrink-0 w-16 text-center py-1.5 rounded-full text-white font-serif text-sm shadow-sm md:mb-6"
                        style={{ backgroundColor: '#4A5B45' }}
                      >
                        {item.time}
                      </div>

                      <div className="shrink-0 w-[50px] h-[50px] rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center md:mb-6 group-hover:scale-110 transition-transform duration-300">
                        <Icon size={20} style={{ color: '#4A5B45' }} />
                      </div>

                      <div className="min-w-0 flex-1 md:flex-none md:text-center md:max-w-[200px]">
                        <h3 className="font-serif text-lg text-stone-800 mb-1">{item.title}</h3>
                        <p className="font-sans text-stone-500 text-xs leading-relaxed">{item.desc}</p>
                      </div>
                    </div>

                    {/* Mobile only: grape connector in the gap between slots (not over pills) */}
                    {!isLast ? (
                      <div
                        className="md:hidden flex flex-row items-center justify-start gap-3 pointer-events-none py-3"
                        aria-hidden
                      >
                        <div className="w-16 shrink-0 flex justify-center items-center">
                          {index % 2 === 0 ? (
                            <MaskedGrapes className="w-10 h-12 opacity-[0.32]" />
                          ) : (
                            <Image
                              src="/assets/grape-cluster.svg"
                              alt=""
                              width={40}
                              height={52}
                              unoptimized
                              className="w-9 h-auto opacity-[0.22] rotate-[-12deg]"
                              aria-hidden
                            />
                          )}
                        </div>
                        <div className="w-[50px] shrink-0" />
                        <div className="flex-1 min-w-0" />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Dresscode Section */}
        <section
          className="relative overflow-hidden py-20 md:py-28 px-4 w-full text-center border-t border-[#e8e4db]"
          style={{ backgroundColor: "#F5F2EA" }}
        >
          <MaskedGrapes className="absolute -left-[6%] top-12 w-[min(30vw,220px)] h-[min(24vw,180px)] opacity-[0.1] -rotate-[4deg] pointer-events-none hidden md:block" />
          <Image
            src="/assets/grape-cluster.svg"
            alt=""
            width={160}
            height={207}
            unoptimized
            className="absolute -right-4 top-1/3 w-[min(24vw,160px)] h-auto opacity-[0.12] rotate-[10deg] pointer-events-none hidden lg:block"
            aria-hidden
          />
          <div className="max-w-3xl mx-auto flex flex-col items-center relative z-10">
            <Image
              src="/assets/dresscode-illustration1.png"
              alt="Guests in evening formal attire"
              width={764}
              height={610}
              sizes="(max-width: 768px) 100vw, 672px"
              className="w-full max-w-lg md:max-w-xl h-auto mb-10 md:mb-14 select-none"
            />
            <h2
              className="font-serif italic text-4xl sm:text-5xl md:text-[3.25rem] mb-3 md:mb-4 leading-tight"
              style={{ color: "#3D4839" }}
            >
              {t.dresscode.title}
            </h2>
            <p
              className="font-serif text-base sm:text-lg md:text-xl tracking-wide"
              style={{ color: "#5a6652" }}
            >
              {t.dresscode.desc}
            </p>
          </div>
        </section>

        {/* Locations: ceremony + main venue */}
        <section
          className="relative overflow-hidden py-24 px-4 w-full border-t border-stone-200"
          style={{ backgroundColor: "#F3EFE7" }}
        >
          <SectionGrapeDecor />
          <div className="max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
            <h2 className="font-serif text-4xl md:text-5xl text-stone-800 mb-4">
              {t.location.title}
            </h2>


            <article className="w-full mb-20 md:mb-28">
              <p className="font-serif text-2xl md:text-3xl text-[#3D4839] mb-1">
                {t.location.church.ceremonyGeo}
              </p>
              {t.location.church.ceremonyLabel ? (
                <p className="font-serif text-sm md:text-base text-stone-500 mb-3">
                  {t.location.church.ceremonyLabel}
                </p>
              ) : null}
              <h3 className="font-serif text-xl md:text-2xl text-stone-800">
                {t.location.church.venue}
              </h3>
              <p className="font-sans text-sm text-stone-500 mt-1 mb-6">
                {t.location.church.vicinity}
              </p>
              <div className="flex items-center justify-center gap-2 text-stone-500 font-sans text-sm mb-8">
                <Clock size={16} strokeWidth={1.5} aria-hidden />
                <span>{t.location.church.time}</span>
              </div>
              <Image
                src="/assets/location-svetitskhoveli.png"
                alt={t.location.church.imageAlt}
                width={1024}
                height={568}
                sizes="(max-width: 896px) 100vw, 896px"
                className="w-full max-w-4xl mx-auto h-auto rounded-2xl object-cover shadow-md border border-stone-200/80 mb-4"
              />
              <div className="relative w-full max-w-4xl mx-auto">
                <a
                  href={appleMapsUrl(41.8422734, 44.7209856, t.location.church.venue)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 left-3 z-[1000] inline-flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-xs font-serif tracking-wide text-stone-800 shadow-md backdrop-blur-sm border border-stone-200/90 hover:bg-white transition-colors"
                >
                  <ExternalLink size={14} aria-hidden />
                  {t.location.btn}
                </a>
                <VenueMap
                  mapContainerProps={{ id: "venue-map-church" }}
                  position={[41.8422734, 44.7209856]}
                  zoom={16}
                  markerTitle={t.location.church.venue}
                  markerSubtitle={t.location.church.vicinity}
                />
              </div>
            </article>

            <article className="w-full">
              <p className="font-serif text-sm md:text-base uppercase tracking-[0.2em] text-stone-500 mb-2">
                {t.location.villa.sectionLabel}
              </p>
              <h3 className="font-serif text-xl md:text-2xl text-stone-800">
                {t.location.villa.venue}
              </h3>
              <p className="font-sans text-sm text-stone-500 mt-1 mb-6">
                {t.location.villa.vicinity}
              </p>
              <div className="flex items-center justify-center gap-2 text-stone-500 font-sans text-sm mb-8">
                <Clock size={16} strokeWidth={1.5} aria-hidden />
                <span>{t.location.villa.time}</span>
              </div>
              <Image
                src="/assets/location-villa-mosavali.png"
                alt={t.location.villa.imageAlt}
                width={1024}
                height={576}
                sizes="(max-width: 896px) 100vw, 896px"
                className="w-full max-w-4xl mx-auto h-auto rounded-2xl object-cover shadow-md border border-stone-200/80 mb-4"
              />
              <div className="relative w-full max-w-4xl mx-auto">
                <a
                  href={appleMapsUrl(41.9382057, 44.6996392, t.location.villa.venue)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 left-3 z-[1000] inline-flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-xs font-serif tracking-wide text-stone-800 shadow-md backdrop-blur-sm border border-stone-200/90 hover:bg-white transition-colors"
                >
                  <ExternalLink size={14} aria-hidden />
                  {t.location.btn}
                </a>
                <VenueMap
                  mapContainerProps={{ id: "venue-map-villa" }}
                  position={[41.9382057, 44.6996392]}
                  zoom={15}
                  markerTitle={t.location.villa.venue}
                  markerSubtitle={t.location.villa.vicinity}
                />
              </div>
            </article>
          </div>
        </section>

        {/* RSVP */}
        <section
          className="relative overflow-hidden py-24 px-4 w-full border-t border-stone-200"
          style={{ backgroundColor: "#F5F2EA" }}
        >
          <MaskedGrapes className="absolute -right-[4%] bottom-16 w-[min(28vw,200px)] h-[min(22vw,160px)] opacity-[0.08] rotate-[6deg] pointer-events-none hidden md:block" />
          <div className="max-w-3xl mx-auto flex flex-col items-center text-center relative z-10">
            <h2
              className="font-serif italic text-4xl sm:text-5xl mb-2"
              style={{ color: "#3D4839" }}
            >
              {t.rsvp.title}
            </h2>
            <p className="font-serif text-sm text-stone-500 mb-10 tracking-wide max-w-md">
              {t.rsvp.subtitle}
            </p>
            <RsvpForm lang={lang} />
          </div>
        </section>

      </div>
    </div>
  );
}
