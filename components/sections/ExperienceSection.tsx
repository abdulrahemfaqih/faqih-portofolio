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
            description="Perjalanan karier, kontribusi teknis, dan pengalaman kerja profesional yang membentuk keahlian saya."
          />
        </ScrollReveal>

        {experiences.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[--ink-12] rounded-sm">
            <p className="font-[family-name:var(--font-geist-mono)] text-sm text-[--ink-45]">
              Belum ada pengalaman kerja yang ditampilkan.
            </p>
          </div>
        ) : (
          <div className="relative max-w-4xl">
            {/* Garis vertikal timeline — menghubungkan logo-logo pengalaman */}
            <div
              className="absolute left-[21px] sm:left-[23px] top-6 bottom-8 w-px bg-[--ink-12]"
              aria-hidden="true"
            />

            <div className="space-y-0">
              {experiences.map((exp, index) => {
                const isLast = index === experiences.length - 1;
                return (
                  <ScrollReveal key={exp.id} delay={index * 0.1}>
                    <div className={`relative flex gap-5 sm:gap-8 ${isLast ? "pb-0" : "pb-8 sm:pb-10"}`}>
                      {/* Kiri: Logo perusahaan / titik timeline */}
                      <div className="relative z-10 shrink-0 flex flex-col items-center">
                        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg sm:rounded-md border border-[--ink-12] bg-[--paper] shadow-xs overflow-hidden flex items-center justify-center p-1">
                          {exp.company_logo_url ? (
                            <Image
                              src={exp.company_logo_url}
                              alt={`Logo ${exp.company_name}`}
                              width={48}
                              height={48}
                              quality={80}
                              className="object-contain"
                            />
                          ) : (
                            <Buildings size={22} weight="light" className="text-[--ink-45]" />
                          )}
                        </div>
                      </div>

                    {/* Kanan: Detail pengalaman */}
                    <div className="flex-1 min-w-0 pt-0.5 sm:pt-1">
                      {/* Rentang waktu & Tipe Pekerjaan */}
                      <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap mb-2 sm:mb-2.5">
                        <p className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wider text-[--ink-45]">
                          {formatExperiencePeriod(exp)}
                        </p>
                        {exp.employment_type && (
                          <span className="chip text-[0.6875rem] py-0.5 px-2.5 bg-[--paper] text-[--ink-70] border-[--ink-12]">
                            {formatEmploymentType(exp.employment_type)}
                          </span>
                        )}
                      </div>

                      {/* Jabatan / Posisi */}
                      <h3 className="text-xl sm:text-2xl font-[family-name:var(--font-fraunces)] font-semibold text-[--ink] leading-snug tracking-tight">
                        {exp.position_title}
                      </h3>

                      {/* Perusahaan / Organisasi */}
                      <p className="text-sm sm:text-base text-[--ink-70] mt-1 mb-4 sm:mb-5 font-normal">
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
                          <ul className="experience-list">
                            {points.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        );
                      })()}

                      {/* Galeri Foto Dokumentasi (Horizontal Scroll Rapi) */}
                      {exp.photos && exp.photos.length > 0 && (
                        <div className="mt-4 sm:mt-5 pt-3.5 border-t border-[--ink-12] w-full max-w-full">
                          <div className="relative w-full max-w-full overflow-hidden">
                            <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto py-1 no-scrollbar touch-pan-x overscroll-x-contain">
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
                                  className="group relative w-24 sm:w-28 aspect-[4/3] shrink-0 rounded-md overflow-hidden border border-[--ink-12] bg-[--paper] shadow-xs hover:border-[--ink-70] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-[--ink]"
                                  aria-label={`Lihat foto ${photoIdx + 1} dari ${exp.company_name}`}
                                >
                                  <Image
                                    src={photoUrl}
                                    alt={`Foto ${photoIdx + 1} - ${exp.company_name}`}
                                    fill
                                    quality={75}
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    sizes="(max-width: 640px) 96px, 112px"
                                    loading="lazy"
                                  />
                                  {/* Hover overlay dengan icon magnifying glass */}
                                  <div className="absolute inset-0 bg-[--ink]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="p-1 rounded-full bg-[--paper]/95 text-[--ink] shadow-xs transform scale-90 group-hover:scale-100 transition-transform">
                                      <MagnifyingGlassPlus size={14} weight="bold" />
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
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
