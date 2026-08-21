"use client";

/**
 * Navbar — Sticky, minimal, monospace labels huruf kapital
 * Sesuai design.md §7: background paper + blur saat scroll
 * Mendukung desktop nav & mobile hamburger drawer
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { List, X } from "@phosphor-icons/react";

const NAV_LINKS = [
  { href: "#about", label: "Tentang" },
  { href: "#projects", label: "Proyek" },
  { href: "#experience", label: "Pengalaman" },
  { href: "#skills", label: "Keahlian" },
  { href: "#contact", label: "Kontak" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tutup mobile menu saat rute berubah
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Di landing page: href="#section" (anchor lokal, smooth scroll)
  // Di halaman lain : href="/#section" (balik ke home, lalu scroll)
  function buildHref(anchor: string) {
    return isHome ? anchor : `/${anchor}`;
  }

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: isHome ? 1.2 : 0.2 }}
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${
            scrolled || mobileMenuOpen
              ? "bg-[--paper]/95 backdrop-blur-md border-b border-[--ink-12]"
              : "bg-transparent"
          }
        `}
      >
        <div className="container-main flex items-center justify-between h-14">
          {/* Wordmark / Logo */}
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.12em] uppercase text-[--ink] hover:text-[--ink-70] transition-colors"
          >
            ARF
          </Link>

          {/* Nav Links — Desktop */}
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

          {/* Right Action (Desktop Blog & Mobile Toggle) */}
          <div className="flex items-center gap-3">
            <Link
              href="/blog"
              className="btn-outline text-xs hidden sm:inline-flex"
            >
              Blog
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[--ink] hover:bg-[--surface-alt] rounded-sm transition-colors"
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu navigasi"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden border-t border-[--ink-12] bg-[--paper]/98 backdrop-blur-lg overflow-hidden"
            >
              <div className="container-main py-6 flex flex-col gap-4">
                <nav className="flex flex-col gap-3" aria-label="Navigasi mobile">
                  {NAV_LINKS.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={buildHref(href)}
                      onClick={() => setMobileMenuOpen(false)}
                      className="
                        font-[family-name:var(--font-geist-mono)] text-sm tracking-[0.08em]
                        uppercase text-[--ink-70] hover:text-[--ink] py-2 border-b border-[--ink-12]/50
                        transition-colors flex items-center justify-between
                      "
                    >
                      <span>{label}</span>
                      <span className="text-[--ink-45] text-xs">→</span>
                    </Link>
                  ))}

                  <Link
                    href="/blog"
                    onClick={() => setMobileMenuOpen(false)}
                    className="
                      font-[family-name:var(--font-geist-mono)] text-sm tracking-[0.08em]
                      uppercase text-[--ink] py-2 border-b border-[--ink-12]/50
                      font-semibold flex items-center justify-between
                    "
                  >
                    <span>Blog</span>
                    <span className="text-[--ink-45] text-xs">→</span>
                  </Link>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
