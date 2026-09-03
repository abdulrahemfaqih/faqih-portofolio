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
    description: "Framework dan library yang saya pakai untuk membangun aplikasi, dari backend sampai frontend dan mobile.",
  },
  database: {
    label: "Database",
    description: "Database relasional dan non-relasional yang saya gunakan untuk pemodelan data dan persistensi.",
  },
  tools_practice: {
    label: "Tools & Praktik",
    description: "Tools dan praktik yang mendukung workflow pengembangan saya, dari kolaborasi kode sampai deployment.",
  },
};

const CATEGORY_ORDER: SkillCategory[] = [
  "programming_language",
  "framework_library",
  "database",
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-x-8 lg:gap-x-8 md:gap-y-10 lg:gap-y-0 lg:grid-rows-[auto_1fr]">
            {CATEGORY_ORDER.map((category, colIndex) => {
              const config = CATEGORY_CONFIG[category];
              const categorySkills = grouped[category];
              if (categorySkills.length === 0) return null;

              return (
                <ScrollReveal
                  key={category}
                  delay={colIndex * 0.12}
                  className="flex flex-col lg:grid lg:grid-rows-subgrid lg:row-span-2"
                >
                  {/* Header kolom */}
                  <div className="flex flex-col justify-start pb-3 sm:pb-4 border-b border-[--ink-12] mb-4 sm:mb-6">
                    <h3 className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.1em] uppercase text-[--ink] mb-1">
                      {config.label}
                    </h3>
                    <p className="text-small text-[--ink-45]">
                      {config.description}
                    </p>
                  </div>

                  {/* Chips — tanpa progress bar (design.md §7) */}
                  <div className="flex flex-wrap gap-2 content-start">
                    {categorySkills.map((skill) => (
                      <span key={skill.id} className="chip">
                        {skill.name}
                      </span>
                    ))}
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
