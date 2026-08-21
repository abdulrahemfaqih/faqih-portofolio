import Image from "next/image";
import type { Experience } from "@/types/supabase";
import { formatExperiencePeriod } from "@/lib/utils";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import { Buildings } from "@phosphor-icons/react/dist/ssr";

interface ExperienceSectionProps {
  experiences: Experience[];
}

export default function ExperienceSection({ experiences }: ExperienceSectionProps) {
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
                            className="object-contain p-1"
                          />
                        ) : (
                          <Buildings size={20} weight="light" className="text-[--ink-45]" />
                        )}
                      </div>
                    </div>

                    {/* Kanan: Detail pengalaman */}
                    <div className="flex-1 pt-1">
                      {/* Rentang waktu */}
                      <p className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wide text-[--ink-45] mb-2">
                        {formatExperiencePeriod(exp)}
                      </p>

                      <h3 className="text-h2 font-[family-name:var(--font-fraunces)] text-[--ink] leading-snug">
                        {exp.position_title}
                      </h3>
                      <p className="text-small text-[--ink-70] mt-1 mb-4">
                        {exp.company_name}
                      </p>

                      {/* Bullet points deskripsi */}
                      {exp.description_points.length > 0 && (
                        <ul className="space-y-2">
                          {exp.description_points.map((point, i) => (
                            <li
                              key={i}
                              className="flex gap-3 text-body text-[--ink-70]"
                            >
                              <span
                                className="mt-2 shrink-0 w-1 h-1 rounded-full bg-[--ink-45]"
                                aria-hidden="true"
                              />
                              {point}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
