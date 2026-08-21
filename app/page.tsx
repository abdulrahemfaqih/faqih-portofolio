/**
 * Landing Page — / (halaman utama)
 * Server Component: fetch data dari Supabase di server
 * Semua section diassemble di sini
 */

import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ExperienceSection from "@/components/sections/ExperienceSection";
import SkillsSection from "@/components/sections/SkillsSection";
import ContactSection from "@/components/sections/ContactSection";
import CustomCursor from "@/components/ui/CustomCursor";
import {
  getAboutMe,
  getSocialLinks,
  getSkills,
  getExperiences,
  getProjects,
} from "@/lib/queries";

export const metadata: Metadata = {
  title: "Abdul Rahem Faqih (Faqih) | Fullstack Developer & Software Engineer",
  description:
    "Portfolio resmi Abdul Rahem Faqih (Faqih). Fullstack Developer yang membangun aplikasi web modern, frontend, backend, database, dan integrasi API.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Abdul Rahem Faqih (Faqih) | Fullstack Developer & Software Engineer",
    description:
      "Portfolio resmi Abdul Rahem Faqih (Faqih). Fullstack Developer yang membangun aplikasi web modern, frontend, backend, database, dan integrasi API.",
    type: "website",
    images: ["/preview_1.png"],
  },
};


export default async function HomePage() {
  // Fetch semua data paralel — lebih cepat dari sequential await
  const [about, socialLinks, skills, experiences, projects] = await Promise.all([
    getAboutMe(),
    getSocialLinks(),
    getSkills(),
    getExperiences(),
    getProjects(),
  ]);

  return (
    <>
      {/* Kursor kustom — signature element, hanya di desktop */}
      <CustomCursor />

      <Navbar />

      <main>
        <HeroSection about={about} />
        <AboutSection about={about} socialLinks={socialLinks} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experiences={experiences} />
        <SkillsSection skills={skills} />
        <ContactSection about={about} socialLinks={socialLinks} />
      </main>

      <Footer socialLinks={socialLinks} />
    </>
  );
}
