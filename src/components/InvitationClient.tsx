"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, CalendarDays, Clock } from "lucide-react";

export function InvitationClient({ name }: { name: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-[450px]">
      <div
        className="relative w-full aspect-[730/950] perspective-1000 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* The Card Inside */}
        <div
          className="absolute inset-0 bg-white rounded-sm shadow-xl flex flex-col items-center justify-between p-8 text-center"
          style={{ transform: "translateZ(-10px)" }}
        >
          <div className="flex flex-col items-center space-y-4 pt-4">
            <span className="text-sm tracking-widest uppercase text-stone-500 font-serif">
              Together with their families
            </span>
            <h1 className="text-5xl md:text-6xl font-cursive text-stone-800 my-4">
              Levani & Anni
            </h1>
            <p className="font-serif italic text-stone-600 text-lg">
              request the honor of your presence <br /> at their wedding celebration
            </p>
          </div>

          <div className="bg-stone-50 border border-stone-200 w-full py-4 px-2 my-6">
            <p className="font-serif text-lg text-stone-700">
              Dear <span className="font-bold font-cursive text-2xl px-1">{name}</span>,
            </p>
            <p className="font-serif text-sm text-stone-600 mt-2">
              We can&apos;t wait to celebrate with you!
            </p>
          </div>

          <div className="flex flex-col items-center space-y-3 font-serif text-stone-600 text-sm pb-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={16} className="text-stone-400" />
              <span>Saturday, September 25, 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-stone-400" />
              <span>4:00 PM in the Afternoon</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-stone-400" />
              <span>The Grand Balcony Estate, Paris</span>
            </div>
          </div>
        </div>

        {/* Left Door */}
        <motion.div
          className="absolute top-0 left-0 w-1/2 h-full origin-left preserve-3d"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isOpen ? -110 : 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ zIndex: 10 }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{
              backgroundImage: "url('/balcony.png')",
              backgroundSize: "200% 100%",
              backgroundPosition: "left center",
              backgroundRepeat: "no-repeat"
            }}
          />
          {/* Back Face */}
          <div
            className="absolute inset-0 bg-stone-800 backface-hidden"
            style={{
              transform: "rotateY(180deg)",
            }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: "url('/balcony.png')",
                backgroundSize: "200% 100%",
                backgroundPosition: "right center", // Flipped image logic
                backgroundRepeat: "no-repeat",
                transform: "scaleX(-1)"
              }}
            />
          </div>
        </motion.div>

        {/* Right Door */}
        <motion.div
          className="absolute top-0 right-0 w-1/2 h-full origin-right preserve-3d"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: isOpen ? 110 : 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ zIndex: 10 }}
        >
          {/* Front Face */}
          <div
            className="absolute inset-0 backface-hidden"
            style={{
              backgroundImage: "url('/balcony.png')",
              backgroundSize: "200% 100%",
              backgroundPosition: "right center",
              backgroundRepeat: "no-repeat"
            }}
          />
          {/* Back Face */}
          <div
            className="absolute inset-0 bg-stone-800 backface-hidden"
            style={{
              transform: "rotateY(180deg)",
            }}
          >
            <div
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage: "url('/balcony.png')",
                backgroundSize: "200% 100%",
                backgroundPosition: "left center", // Flipped image logic
                backgroundRepeat: "no-repeat",
                transform: "scaleX(-1)"
              }}
            />
          </div>
        </motion.div>

        {/* Instruction overlay when closed */}
        <motion.div
          className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-stone-500 font-serif text-sm tracking-widest opacity-0"
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ delay: 1 }}
        >
          {isOpen ? "" : "CLICK TO OPEN"}
        </motion.div>
      </div>
    </div>
  );
}
