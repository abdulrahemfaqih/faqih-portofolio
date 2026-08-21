import type { Project } from "@/types/supabase";
import ProjectCard from "@/components/ui/ProjectCard";
import SectionHeader from "@/components/ui/SectionHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Link from "next/link";

interface ProjectsSectionProps {
  projects: Project[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <section id="projects" className="section-spacing">
      <div className="container-main">
        <ScrollReveal>
          <SectionHeader
            eyebrow="Proyek"
            title="Yang sudah saya bangun"
            description="Pilihan proyek yang mencerminkan pendekatan saya terhadap pengembangan: fungsional, terstruktur, dan mudah dipelihara."
          />
        </ScrollReveal>

        {projects.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[--ink-12] rounded-sm">
            <p className="font-[family-name:var(--font-geist-mono)] text-sm text-[--ink-45]">
              Belum ada proyek yang ditampilkan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
