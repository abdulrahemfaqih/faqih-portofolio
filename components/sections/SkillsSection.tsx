import type { Skill, SkillCategory } from "@/types/supabase";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface SkillsSectionProps {
  skills: Skill[];
}

const CATEGORY_CONFIG: Record<SkillCategory, { label: string; description: string }> = {
  programming_language: {
    label: "Bahasa Pemrograman",
    description: "Bahasa yang saya kuasai untuk mengembangkan solusi",
  },
  framework_library: {
    label: "Framework & Library",
    description: "Tools utama dalam workflow pengembangan saya",
  },
  tools_practice: {
    label: "Tools & Praktik",
    description: "Ekosistem dan metodologi yang mendukung kerja saya",
  },
};

const CATEGORY_ORDER: SkillCategory[] = [
  "programming_language",
  "framework_library",
  "tools_practice",
];

export default function SkillsSection({ skills }: SkillsSectionProps) {
  // Kelompokkan skills per kategori
  const grouped = CATEGORY_ORDER.reduce(
    (acc, category) => {
      acc[category] = skills.filter((s) => s.category === category);
      return acc;
    },
    {} as Record<SkillCategory, Skill[]>
  );

  return (
    <section id="skills" className="section-spacing">
      <div className="container-main">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Keahlian"
            title="Yang saya kuasai"
          />
        </ScrollReveal>

        {skills.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[--ink-12] rounded-sm">
            <p className="font-[family-name:var(--font-geist-mono)] text-sm text-[--ink-45]">
              Belum ada keahlian yang ditampilkan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {CATEGORY_ORDER.map((category, colIndex) => {
              const config = CATEGORY_CONFIG[category];
              const categorySkills = grouped[category];
              if (categorySkills.length === 0) return null;

              return (
                <ScrollReveal key={category} delay={colIndex * 0.12}>
                  <div>
                    {/* Header kolom */}
                    <div className="mb-6 pb-4 border-b border-[--ink-12]">
                      <h3 className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.1em] uppercase text-[--ink] mb-1">
                        {config.label}
                      </h3>
                      <p className="text-small text-[--ink-45]">
                        {config.description}
                      </p>
                    </div>

                    {/* Chips — tanpa progress bar (design.md §7) */}
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill) => (
                        <span key={skill.id} className="chip">
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
