/**
 * Supabase query helpers — dipakai di Server Components (Fase 3)
 * Setiap fungsi meng-import server client dan mereturn data/error
 */

import { createClient } from "@/lib/supabase/server";
import { createBuildTimeClient } from "@/lib/supabase/build-client";
import type {
  AboutMe,
  BlogPost,
  BlogPostSummary,
  Experience,
  Project,
  Skill,
  SocialLink,
} from "@/types/supabase";

/* --------------------------------
   About Me
   -------------------------------- */
export async function getAboutMe(): Promise<AboutMe | null> {
  const supabase = createBuildTimeClient();
  const { data, error } = await supabase
    .from("about_me")
    .select("*")
    .maybeSingle(); // maybeSingle() → null jika 0 baris (tidak error), .single() → error jika 0 baris

  if (error) {
    console.error("[getAboutMe]", error.message);
    return null;
  }
  return data;
}

/* --------------------------------
   Social Links
   -------------------------------- */
export async function getSocialLinks(): Promise<SocialLink[]> {
  const supabase = createBuildTimeClient();
  const { data, error } = await supabase
    .from("social_links")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[getSocialLinks]", error.message);
    return [];
  }
  return data ?? [];
}

/* --------------------------------
   Skills
   -------------------------------- */
export async function getSkills(): Promise<Skill[]> {
  const supabase = createBuildTimeClient();
  const { data, error } = await supabase
    .from("skills")
    .select("*")
    .order("category")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[getSkills]", error.message);
    return [];
  }
  return data ?? [];
}

/* --------------------------------
   Experience
   -------------------------------- */
export async function getExperiences(): Promise<Experience[]> {
  const supabase = createBuildTimeClient();
  const { data, error } = await supabase
    .from("experience")
    .select("*")
    .order("start_year", { ascending: false })
    .order("start_month", { ascending: false });

  if (error) {
    console.error("[getExperiences]", error.message);
    return [];
  }
  return data ?? [];
}

/* --------------------------------
   Projects
   -------------------------------- */
export async function getProjects(): Promise<Project[]> {
  const supabase = createBuildTimeClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    console.error("[getProjects]", error.message);
    return [];
  }
  return data ?? [];
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createBuildTimeClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .maybeSingle(); // null jika tidak ditemukan → page.tsx panggil notFound()

  if (error) {
    console.error("[getProjectBySlug]", error.message);
    return null;
  }
  return data;
}

/* --------------------------------
   Blog Posts
   -------------------------------- */
export async function getPublishedBlogPosts(): Promise<BlogPostSummary[]> {
  const supabase = createBuildTimeClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, cover_image_url, excerpt, published_at, tags")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("[getPublishedBlogPosts]", error.message);
    return [];
  }
  return data ?? [];
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createBuildTimeClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle(); // null jika tidak ditemukan → page.tsx panggil notFound()

  if (error) {
    console.error("[getBlogPostBySlug]", error.message);
    return null;
  }
  return data;
}

/* --------------------------------
   Admin: semua blog post (termasuk draft)
   Hanya dipanggil dari route yang sudah diproteksi middleware
   -------------------------------- */
export async function getAllBlogPostsForAdmin(): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAllBlogPostsForAdmin]", error.message);
    return [];
  }
  return data ?? [];
}
