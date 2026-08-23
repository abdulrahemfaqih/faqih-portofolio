"use client";

/**
 * Project Card — dengan hover effect dan data-cursor="Lihat"
 * Sesuai design.md §7: gambar dominan, judul, 2-3 tech stack tag mono
 * Card klik → halaman detail /project/[slug]
 */

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "@phosphor-icons/react";
import type { Project } from "@/types/supabase";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      className="h-full"
    >
      <Link
        href={`/project/${project.slug}`}
        className="group flex flex-col h-full card overflow-hidden"
        data-cursor="Lihat"
        aria-label={`Lihat detail proyek ${project.title}`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[--surface-alt] shrink-0 border-b border-[--ink-12]">
          {project.thumbnail_url ? (
            <Image
              src={project.thumbnail_url}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              priority={index < 2}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-[family-name:var(--font-geist-mono)] text-xs text-[--ink-45] tracking-widest uppercase">
                No Image
              </span>
            </div>
          )}
        </div>

        {/* Konten card */}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 className="text-xl font-[family-name:var(--font-fraunces)] font-bold text-[--ink] leading-snug">
              {project.title}
            </h3>
            <ArrowUpRight
              size={18}
              weight="light"
              className="shrink-0 text-[--ink-45] mt-1 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[--ink]"
            />
          </div>

          <p className="text-small text-[--ink-70] mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Tech stack tags (maksimal 3 ditampilkan) */}
          <div className="flex flex-wrap gap-2 mt-auto pt-2">
            {project.tech_stack.slice(0, 3).map((tech) => (
              <span key={tech} className="chip">{tech}</span>
            ))}
            {project.tech_stack.length > 3 && (
              <span className="chip text-[--ink-45]">
                +{project.tech_stack.length - 3}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
