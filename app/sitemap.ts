import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { createBuildTimeClient } from "@/lib/supabase/build-client";

export const revalidate = 3600; // Revalidate sitemap tiap 1 jam

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createBuildTimeClient();

  // Fetch projects and blog posts
  const [{ data: projects }, { data: blogPosts }] = await Promise.all([
    supabase.from("projects").select("slug, updated_at"),
    supabase
      .from("blog_posts")
      .select("slug, updated_at")
      .eq("status", "published"),
  ]);

  const projectRoutes: MetadataRoute.Sitemap = (projects ?? []).map((p: any) => ({
    url: `${SITE_URL}/project/${p.slug}`,
    lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = (blogPosts ?? []).map((b: any) => ({
    url: `${SITE_URL}/blog/${b.slug}`,
    lastModified: b.updated_at ? new Date(b.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
