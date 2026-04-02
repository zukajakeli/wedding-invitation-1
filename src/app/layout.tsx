import type { Metadata } from "next";
import { Playfair_Display, Great_Vibes, Alex_Brush, Parisienne } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Wedding Invitation",
  description: "You are invited to our wedding",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${greatVibes.variable} ${alexBrush.variable} ${parisienne.variable} h-full antialiased`}>
      <body className="min-h-full h-full flex flex-col font-serif overflow-hidden bg-stone-50 text-stone-900">
        {children}
      </body>
    </html>
  );
}
