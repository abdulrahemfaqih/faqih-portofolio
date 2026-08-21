// TypeScript interfaces untuk semua tabel Supabase
// Mengikuti schema.md secara persis — jangan ubah nama field tanpa konfirmasi

export type SkillCategory =
  | "programming_language"
  | "framework_library"
  | "tools_practice";

export type PostStatus = "draft" | "published";

export interface AboutMe {
  id: string;
  full_name: string;
  role_title: string;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  cv_url: string | null;
  email: string | null;
  location: string | null;
  updated_at: string;
}

export interface SocialLink {
  id: string;
  platform: string; // 'linkedin', 'github', 'instagram', 'x', dll.
  url: string;
  display_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  category: SkillCategory;
  name: string;
  display_order: number;
  created_at: string;
}

export interface Experience {
  id: string;
  company_name: string;
  company_logo_url: string | null;
  position_title: string;
  description_points: string[]; // array of bullet points
  start_month: number; // 1-12
  start_year: number;
  end_month: number | null; // null jika masih berjalan
  end_year: number | null;  // null jika masih berjalan
  is_current: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  description: string;
  tech_stack: string[]; // array, contoh: ['Next.js', 'Supabase', 'Tailwind']
  live_url: string | null;
  repo_url: string | null;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  cover_image_url: string | null;
  excerpt: string | null;
  content: string; // Markdown
  status: PostStatus;
  tags: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// Tipe ringkas untuk daftar blog (query dengan kolom terbatas)
export type BlogPostSummary = Pick<
  BlogPost,
  "id" | "title" | "slug" | "cover_image_url" | "excerpt" | "published_at" | "tags"
>;

// Database type untuk @supabase/supabase-js (opsional, helper typing)
export type Database = {
  public: {
    Tables: {
      about_me: { Row: AboutMe };
      social_links: { Row: SocialLink };
      skills: { Row: Skill };
      experience: { Row: Experience };
      projects: { Row: Project };
      blog_posts: { Row: BlogPost };
    };
  };
};
