"use client";

/**
 * Hero Section — Layout asimetris sesuai design.md §7
 * Animasi buka halaman (intro sequence) sesuai design.md §6.1
 * Headline besar di kiri, detail di kanan
 */

import { motion } from "motion/react";
import type { AboutMe } from "@/types/supabase";
import { ArrowDown } from "@phosphor-icons/react";

interface HeroProps {
  about: AboutMe | null;
}

// Stagger timing untuk intro sequence
const STAGGER = 0.08; // 80ms antar elemen

export default function HeroSection({ about }: HeroProps) {
  const name = about?.full_name ?? "Abdul Rahem Faqih";
  const roleTitle = about?.role_title ?? "Fullstack Developer";
  const headline = about?.headline ?? "Membangun aplikasi web dan mobile modern, dari antarmuka hingga infrastruktur.";

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center pt-14"
      aria-labelledby="hero-heading"
    >
      {/* Garis horizontal animasi (intro sequence, design.md §6.1) */}
      <motion.div
        className="absolute top-[30%] left-0 right-0 h-px bg-[--ink-12]"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        aria-hidden="true"
      />

      <div className="container-main">
        {/* Eyebrow — nama kecil mono sebagai "wordmark" intro */}
        <motion.div
          className="eyebrow-label mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {name}
        </motion.div>

        {/* Layout asimetris: headline kiri + detail kanan */}
        <div className="grid grid-cols-1 md:grid-cols-[5fr_3fr] gap-8 md:gap-16 items-end">
          {/* Kiri: Headline besar */}
          <div>
            <motion.h1
              id="hero-heading"
              className="text-display font-[family-name:var(--font-fraunces)] font-bold leading-[1.05] tracking-[-0.03em] text-[--ink]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            >
              {headline}
            </motion.h1>

            <motion.div
              className="mt-8 flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 + STAGGER * 3 }}
            >
              <a href="#projects" className="btn-solid">
                Lihat Proyek
              </a>
              <a href="#contact" className="btn-outline">
                Hubungi Saya
              </a>
            </motion.div>

            {/* Status di mobile */}
            <motion.div
              className="mt-6 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 + STAGGER * 4 }}
            >
              <p className="font-[family-name:var(--font-geist-mono)] text-xs text-[--ink-70]">
                Terbuka untuk freelance & kolaborasi full-time
              </p>
            </motion.div>
          </div>

          {/* Kanan: Detail / meta info */}
          <motion.div
            className="hidden md:flex flex-col gap-6 pb-2"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 + STAGGER * 2 }}
          >
            <div>
              <p className="text-mono text-[--ink-45] mb-1">Peran</p>
              <p className="font-[family-name:var(--font-geist-mono)] text-sm text-[--ink-70]">
                {roleTitle}
              </p>
            </div>
            <div>
              <p className="text-mono text-[--ink-45] mb-1">Lokasi</p>
              <p className="font-[family-name:var(--font-geist-mono)] text-sm text-[--ink-70]">
                {about?.location ?? "Indonesia"}
              </p>
            </div>
            <div>
              <p className="text-mono text-[--ink-45] mb-1">Status</p>
              <p className="font-[family-name:var(--font-geist-mono)] text-sm text-[--ink-70]">
                Terbuka untuk freelance & kolaborasi full-time
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[--ink-45]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        aria-hidden="true"
      >
        <span className="font-[family-name:var(--font-geist-mono)] text-[0.6875rem] tracking-[0.1em] uppercase">
          Gulir
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} weight="light" />
        </motion.div>
      </motion.div>
    </section>
  );
}
