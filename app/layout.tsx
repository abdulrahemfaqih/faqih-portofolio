import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";

/*
 * Font Loading — self-hosted via next/font (sesuai design.md §4.2)
 * - Fraunces: serif berkarakter untuk display/heading
 * - Geist Sans: body, label UI
 * - Geist Mono: metadata, tag, eyebrow, code
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  // Optical size axis tersedia di Fraunces — aktifkan untuk heading besar
  axes: ["opsz", "SOFT", "WONK"],
});

/*
 * Default Metadata — akan di-override di tiap halaman via generateMetadata
 * atau export const metadata = { ... }
 */
export const metadata: Metadata = {
  title: {
    default: "Abdul Rahem Faqih — Fullstack Developer",
    template: "%s — Abdul Rahem Faqih",
  },
  description:
    "Portfolio Abdul Rahem Faqih, Fullstack Developer yang berfokus pada pengembangan aplikasi web modern: frontend, backend, database, dan integrasi API.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Abdul Rahem Faqih",
  },
  robots: {
    index: true,
    follow: true,
  },
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[--paper] text-[--ink]">
        {children}
      </body>
    </html>
  );
}
