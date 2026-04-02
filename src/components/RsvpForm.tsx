"use client";

import { useState, useEffect, FormEvent } from "react";
import confetti from "canvas-confetti";
import { Language, translations } from "@/locales/translations";

const CONFETTI_COLORS = [
  "#4A5B45",
  "#5c6d56",
  "#b0a574",
  "#e8dcc4",
  "#7d6b50",
];

function burstConfetti() {
  const opts = {
    colors: CONFETTI_COLORS,
    zIndex: 200,
    ticks: 220,
  };
  confetti({
    ...opts,
    particleCount: 110,
    spread: 72,
    origin: { y: 0.72 },
  });
  window.setTimeout(() => {
    confetti({
      ...opts,
      particleCount: 48,
      angle: 58,
      spread: 52,
      origin: { x: 0.08, y: 0.78 },
    });
    confetti({
      ...opts,
      particleCount: 48,
      angle: 122,
      spread: 52,
      origin: { x: 0.92, y: 0.78 },
    });
  }, 140);
}

type Attending = "yes" | "no" | "";

export function RsvpForm({ lang }: { lang: Language }) {
  const t = translations[lang].rsvp;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [attending, setAttending] = useState<Attending>("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (status !== "success") return;
    const t = window.setTimeout(() => burstConfetti(), 80);
    return () => clearTimeout(t);
  }, [status]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !attending) {
      setErrorMessage(t.validation);
      setStatus("error");
      return;
    }
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          attending,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErrorMessage(data.error || t.errorGeneric);
        setStatus("error");
        return;
      }
      setStatus("success");
      setFirstName("");
      setLastName("");
      setAttending("");
    } catch {
      setErrorMessage(t.errorGeneric);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="relative z-[210] w-full max-w-md mx-auto rounded-2xl border border-stone-200 bg-white/95 px-8 py-10 text-center shadow-md backdrop-blur-sm"
        role="status"
      >
        <p className="font-serif text-lg text-[#3D4839]">{t.thankYou}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="w-full max-w-md mx-auto rounded-2xl border border-stone-200 bg-white/90 px-6 py-8 sm:px-8 sm:py-10 shadow-sm backdrop-blur-sm text-left"
    >
      <div className="space-y-5">
        <div>
          <label
            htmlFor="rsvp-first-name"
            className="block font-serif text-sm text-stone-600 mb-1.5"
          >
            {t.firstName}
          </label>
          <input
            id="rsvp-first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 font-sans text-stone-800 outline-none focus:border-[#4A5B45] focus:ring-1 focus:ring-[#4A5B45]"
          />
        </div>
        <div>
          <label
            htmlFor="rsvp-last-name"
            className="block font-serif text-sm text-stone-600 mb-1.5"
          >
            {t.lastName}
          </label>
          <input
            id="rsvp-last-name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 font-sans text-stone-800 outline-none focus:border-[#4A5B45] focus:ring-1 focus:ring-[#4A5B45]"
          />
        </div>
        <fieldset className="space-y-3 border-0 p-0 m-0">
          <legend className="block font-serif text-sm text-stone-600 mb-2">
            {t.attendingQuestion}
          </legend>
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 bg-white px-4 py-3 has-[:checked]:border-[#4A5B45] has-[:checked]:bg-[#F3EFE7]">
              <input
                type="radio"
                name="attending"
                value="yes"
                checked={attending === "yes"}
                onChange={() => setAttending("yes")}
                className="h-4 w-4 accent-[#4A5B45]"
              />
              <span className="font-serif text-stone-800">{t.yes}</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-stone-200 bg-white px-4 py-3 has-[:checked]:border-[#4A5B45] has-[:checked]:bg-[#F3EFE7]">
              <input
                type="radio"
                name="attending"
                value="no"
                checked={attending === "no"}
                onChange={() => setAttending("no")}
                className="h-4 w-4 accent-[#4A5B45]"
              />
              <span className="font-serif text-stone-800">{t.no}</span>
            </label>
          </div>
        </fieldset>
      </div>

      {status === "error" && errorMessage ? (
        <p className="mt-4 text-sm text-red-700 font-sans" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === "loading"}
        className="mt-8 w-full rounded-lg bg-[#4A5B45] px-6 py-3 font-serif text-sm tracking-widest uppercase text-white shadow-sm transition-opacity hover:opacity-95 disabled:opacity-60"
      >
        {status === "loading" ? t.sending : t.submit}
      </button>
    </form>
  );
}
