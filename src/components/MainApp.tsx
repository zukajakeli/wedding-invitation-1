"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { translations, Language } from "@/locales/translations";
import { Countdown } from "./Countdown";
import { Map } from "./Map";
import { MapPin, CalendarDays, Utensils, Shirt, Volume2, VolumeX, Globe, Heart, Wine, Church } from "lucide-react";
import { BalconyScene } from "./BalconyScene";
import { useProgress } from "@react-three/drei";

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

        {/* Background Content (Invitation) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 pt-20 w-full max-w-4xl mx-auto z-0">
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
          <BalconyScene isOpen={isOpen} />

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
        <section className="py-24 px-4 w-full flex flex-col items-center" style={{ backgroundColor: '#F3EFE7' }}>
          <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
            <h2 className="font-serif italic text-4xl sm:text-5xl text-center mb-2" style={{ color: '#4A5B45' }}>
              {t.timetable.title}
            </h2>
            <p className="font-serif text-sm text-stone-500 mb-16 text-center tracking-wide uppercase">
              {t.timetable.subtitle}
            </p>

            {/* Main timeline container */}
            <div className="relative flex flex-col md:flex-row w-full justify-between items-start md:items-stretch px-4 md:px-0">

              {/* The continuous line (horizontal on desktop, vertical on mobile) */}
              <div className="absolute left-[41px] top-8 bottom-12 w-[2px] md:w-auto md:h-[2px] md:left-12 md:right-12 md:top-[85px] bg-stone-300 z-0" />

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

                return (
                  <div key={index} className="relative flex md:flex-col items-start md:items-center w-full md:w-1/4 mb-12 md:mb-0 z-10 group">

                    {/* Time Badge (Desktop: Top, Mobile: Left over the line) */}
                    <div
                      className="absolute md:relative left-[9px] top-[40px] md:left-auto md:top-auto w-16 text-center py-1.5 rounded-full text-white font-serif text-sm md:mb-6 shadow-sm z-20"
                      style={{ backgroundColor: '#4A5B45' }}
                    >
                      {item.time}
                    </div>

                    {/* Icon Node (Desktop: Middle, Mobile: Right of line) */}
                    <div className="w-[50px] h-[50px] rounded-full bg-white border border-stone-200 shadow-sm flex items-center justify-center shrink-0 ml-[80px] md:ml-0 md:mb-6 group-hover:scale-110 transition-transform duration-300 z-10">
                      <Icon size={20} style={{ color: '#4A5B45' }} />
                    </div>

                    {/* Text Content */}
                    <div className="ml-6 md:ml-0 md:text-center mt-2 md:mt-0 max-w-[200px]">
                      <h3 className="font-serif text-lg text-stone-800 mb-1">{item.title}</h3>
                      <p className="font-sans text-stone-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>

                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Dresscode Section */}
        <section className="py-24 px-4 w-full bg-stone-100 border-t border-stone-200 text-center">
          <div className="max-w-2xl mx-auto flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-white border border-stone-200 flex items-center justify-center mb-6 text-stone-400">
              <Shirt size={28} />
            </div>
            <h2 className="font-cursive text-5xl text-stone-800 mb-6">
              {t.dresscode.title}
            </h2>
            <p className="font-serif text-lg text-stone-600 leading-relaxed">
              {t.dresscode.desc}
            </p>
          </div>
        </section>

        {/* Location / Map Section */}
        <section className="py-24 px-4 w-full max-w-5xl mx-auto text-center flex flex-col items-center">
          <h2 className="font-cursive text-5xl md:text-6xl text-stone-800 mb-6">
            {t.location.title}
          </h2>
          <p className="font-serif text-stone-600 mb-12">
            {t.location.desc}
          </p>

          <Map />

          <a
            href="https://maps.apple.com/?q=41.7151,44.8271"
            className="mt-10 inline-flex items-center gap-2 bg-stone-800 text-white px-8 py-4 rounded-full font-serif uppercase tracking-widest text-sm hover:bg-stone-700 transition-colors"
          >
            <MapPin size={16} />
            {t.location.btn}
          </a>
        </section>

      </div>
    </div>
  );
}
