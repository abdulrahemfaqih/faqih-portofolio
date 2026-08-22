"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { Experience } from "@/types/supabase";
import { formatExperiencePeriod, formatEmploymentType } from "@/lib/utils";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Buildings, MagnifyingGlassPlus } from "@phosphor-icons/react";

// Lazy load ImageLightboxModal hanya ketika dibutuhkan
const ImageLightboxModal = dynamic(
  () => import("@/components/ui/ImageLightboxModal"),
  { ssr: false }
);

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
  const [activeLightbox, setActiveLightbox] = useState<{
    images: string[];
    index: number;
    title: string;
  } | null>(null);

  return (
    <section id="experience" className="section-spacing surface-alt">
      <div className="container-main">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Pengalaman"
            title="Di mana saya pernah bekerja"
          />
        </ScrollReveal>

        {experiences.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[--ink-12] rounded-sm">
            <p className="font-[family-name:var(--font-geist-mono)] text-sm text-[--ink-45]">
              Belum ada pengalaman kerja yang ditampilkan.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Garis vertikal timeline — memberi makna kronologis (design.md §7) */}
            <div
              className="absolute left-6 top-0 bottom-0 w-px bg-[--ink-12]"
              aria-hidden="true"
            />

            <div className="space-y-0">
              {experiences.map((exp, index) => (
                <ScrollReveal key={exp.id} delay={index * 0.1}>
                  <div className="relative flex gap-8 pb-12 last:pb-0">
                    {/* Kiri: Logo perusahaan / titik timeline */}
                    <div className="relative z-10 shrink-0 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-sm border border-[--ink-12] bg-[--paper] overflow-hidden flex items-center justify-center">
                        {exp.company_logo_url ? (
                          <Image
                            src={exp.company_logo_url}
                            alt={`Logo ${exp.company_name}`}
                            width={48}
                            height={48}
                            quality={80}
                            className="object-contain p-1"
                          />
                        ) : (
                          <Buildings size={20} weight="light" className="text-[--ink-45]" />
                        )}
                      </div>
                    </div>

                    {/* Kanan: Detail pengalaman */}
                    <div className="flex-1 pt-1">
                      {/* Rentang waktu & Tipe Pekerjaan */}
                      <div className="flex items-center gap-2.5 flex-wrap mb-2">
                        <p className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wide text-[--ink-45]">
                          {formatExperiencePeriod(exp)}
                        </p>
                        {exp.employment_type && (
                          <span className="chip text-[0.625rem] py-0.5 px-2 bg-[--paper] text-[--ink-70] border-[--ink-12]">
                            {formatEmploymentType(exp.employment_type)}
                          </span>
                        )}
                      </div>

                      <h3 className="text-h2 font-[family-name:var(--font-fraunces)] text-[--ink] leading-snug">
                        {exp.position_title}
                      </h3>
                      <p className="text-small text-[--ink-70] mt-1 mb-4">
                        {exp.company_name}
                      </p>

                      {/* Bullet points deskripsi */}
                      {(() => {
                        const rawPoints = exp.description_points;
                        const points = rawPoints
                          ? (Array.isArray(rawPoints) ? rawPoints : [rawPoints]).flatMap(
                              (p) =>
                                typeof p === "string"
                                  ? p.split("\n").map((s) => s.trim()).filter(Boolean)
                                  : []
                            )
                          : [];

                        if (points.length === 0) return null;

                        return (
                          <ul className="experience-list text-body">
                            {points.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        );
                      })()}

                      {/* Galeri Foto Dokumentasi (1 Baris Horizontal Scroll Ringkas) */}
                      {exp.photos && exp.photos.length > 0 && (
                        <div className="mt-4 pt-3.5 border-t border-[--ink-12]">
                          <div className="flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar">
                            {exp.photos.map((photoUrl, photoIdx) => (
                              <button
                                key={photoIdx}
                                type="button"
                                onClick={() =>
                                  setActiveLightbox({
                                    images: exp.photos,
                                    index: photoIdx,
                                    title: `${exp.position_title} — ${exp.company_name}`,
                                  })
                                }
                                className="group relative w-20 sm:w-24 aspect-[4/3] shrink-0 rounded-sm overflow-hidden border border-[--ink-12] bg-[--paper] hover:border-[--ink-45] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[--ink]"
                                aria-label={`Lihat foto ${photoIdx + 1} dari ${exp.company_name}`}
                              >
                                <Image
                                  src={photoUrl}
                                  alt={`Foto ${photoIdx + 1} - ${exp.company_name}`}
                                  fill
                                  quality={75}
                                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                                  sizes="96px"
                                  loading="lazy"
                                />
                                {/* Hover overlay dengan icon magnifying glass */}
                                <div className="absolute inset-0 bg-[--ink]/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <div className="p-1 rounded-full bg-[--paper]/90 text-[--ink] shadow-xs transform scale-90 group-hover:scale-100 transition-transform">
                                    <MagnifyingGlassPlus size={13} weight="bold" />
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Pop-up Modal (Lazy Loaded) */}
      {activeLightbox && (
        <ImageLightboxModal
          isOpen={!!activeLightbox}
          images={activeLightbox.images}
          initialIndex={activeLightbox.index}
          title={activeLightbox.title}
          onClose={() => setActiveLightbox(null)}
        />
      )}
    </section>
  );
}
