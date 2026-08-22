import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { getProjectBySlug } from "@/lib/queries";
import { createBuildTimeClient } from "@/lib/supabase/build-client";
import ProjectScreenshotsGallery from "@/components/project/ProjectScreenshotsGallery";

interface Params {
  params: Promise<{ slug: string }>;
}

// Menggunakan build-time client (tanpa cookies) karena berjalan di build time
export async function generateStaticParams() {
  const supabase = createBuildTimeClient();
  const { data } = await supabase.from("projects").select("slug");
  return (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description.slice(0, 160),
    openGraph: {
      title: project.title,
      description: project.description.slice(0, 160),
      images: project.thumbnail_url ? [project.thumbnail_url] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[--paper]">
      <div className="container-main pt-24 pb-20">
        {/* Breadcrumb / back link */}
        <Link
          href="/#projects"
          className="
            inline-flex items-center gap-2 mb-12
            font-[family-name:var(--font-geist-mono)] text-xs tracking-wide uppercase
            text-[--ink-45] hover:text-[--ink] transition-colors duration-200
          "
        >
          <ArrowLeft size={14} weight="bold" />
          Kembali ke Proyek
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-[7fr_4fr] gap-12 lg:gap-20">
          {/* Kiri: Gambar + Deskripsi */}
          <div>
            {/* Gambar utama */}
            {project.thumbnail_url && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-sm border border-[--ink-12] mb-10">
                <Image
                  src={project.thumbnail_url}
                  alt={project.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Judul */}
            <h1 className="text-h1 font-[family-name:var(--font-fraunces)] text-[--ink] mb-4">
              {project.title}
            </h1>

            {/* Deskripsi */}
            <div className="text-body-lg text-[--ink-70] leading-relaxed">
              {project.description.split("\n").map((para, i) => (
                <p key={i} className="mb-4 last:mb-0">{para}</p>
              ))}
            </div>

            {/* Galeri Screenshot Proyek */}
            <ProjectScreenshotsGallery
              screenshots={project.screenshots || []}
              projectTitle={project.title}
            />
          </div>

          {/* Kanan: Meta info */}
          <div className="flex flex-col gap-8 lg:pt-2">
            {/* Tech stack */}
            <div>
              <p className="font-[family-name:var(--font-geist-mono)] text-xs tracking-[0.1em] uppercase text-[--ink-45] mb-3">
                Tech Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <span key={tech} className="chip">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[--ink-12]" />

            {/* Links */}
            <div className="flex flex-col gap-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-solid inline-flex items-center gap-2 justify-center"
                >
                  <ArrowUpRight size={16} weight="bold" />
                  Buka Live Site
                </a>
              )}
              {project.repo_url && (
                <a
                  href={project.repo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline inline-flex items-center gap-2 justify-center"
                >
                  <GithubLogo size={16} weight="regular" />
                  Lihat Repositori
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
