"use client";

/**
 * Navbar — Sticky, minimal, monospace labels huruf kapital
 * Sesuai design.md §7: background paper + blur saat scroll
 * Jika di luar landing page (/), link section jadi /#section
 * supaya kembali ke home dan scroll ke section yang dipilih
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

const NAV_LINKS = [
  { href: "#about", label: "Tentang" },
  { href: "#projects", label: "Proyek" },
  { href: "#experience", label: "Pengalaman" },
  { href: "#skills", label: "Keahlian" },
  { href: "#contact", label: "Kontak" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Di landing page: href="#section" (anchor lokal, smooth scroll)
  // Di halaman lain : href="/#section" (balik ke home, lalu scroll)
  function buildHref(anchor: string) {
    return isHome ? anchor : `/${anchor}`;
  }

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: isHome ? 1.2 : 0.2 }}
      className={`
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        ${scrolled
          ? "bg-[--paper]/90 backdrop-blur-md border-b border-[--ink-12]"
          : "bg-transparent"}
      `}
    >
      <div className="container-main flex items-center justify-between h-14">
        {/* Wordmark / Logo */}
        <Link
          href="/"
          className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.12em] uppercase text-[--ink] hover:text-[--ink-70] transition-colors"
        >
          ARF
        </Link>

        {/* Nav Links — desktop */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Navigasi utama">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={buildHref(href)}
              className="
                font-[family-name:var(--font-geist-mono)] text-[0.8125rem]
                tracking-[0.08em] uppercase text-[--ink-70]
                hover:text-[--ink] transition-colors duration-200
                relative after:absolute after:bottom-0 after:left-0
                after:h-px after:w-0 after:bg-[--ink]
                after:transition-all after:duration-300
                hover:after:w-full
              "
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Blog link — kanan */}
        <Link
          href="/blog"
          className="btn-outline text-xs"
        >
          Blog
        </Link>
      </div>
    </motion.header>
  );
}
