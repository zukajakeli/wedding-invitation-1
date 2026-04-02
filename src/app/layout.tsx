import type { Metadata, Viewport } from "next";
import { Playfair_Display, Great_Vibes, Alex_Brush, Parisienne, Caveat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-great-vibes",
  subsets: ["latin"],
});

const alexBrush = Alex_Brush({
  weight: "400",
  variable: "--font-alex-brush",
  subsets: ["latin"],
});

const parisienne = Parisienne({
  weight: "400",
  variable: "--font-parisienne",
  subsets: ["latin"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "Wedding Invitation",
  description: "You are invited to our wedding",
};

/** Lets `env(safe-area-inset-*)` reflect notches / home indicator; avoids iOS letterboxing vs real screen. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${greatVibes.variable} ${alexBrush.variable} ${parisienne.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full h-full flex flex-col font-serif overflow-hidden bg-stone-50 text-stone-900">
        {children}
      </body>
    </html>
  );
}
