// TypeScript interfaces untuk semua tabel Supabase
// Mengikuti schema.md secara persis — jangan ubah nama field tanpa konfirmasi

export type SkillCategory =
  | "programming_language"
  | "framework_library"
  | "database"
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

export type EmploymentType =
  | "full_time"
  | "part_time"
  | "internship"
  | "contract"
  | "freelance";

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
  employment_type: EmploymentType | null;
  photos: string[]; // array of photo URLs
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  screenshots: string[]; // array of screenshot URLs
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

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Database type lengkap untuk @supabase/supabase-js v2
export interface Database {
  public: {
    Tables: {
      about_me: {
        Row: AboutMe;
        Insert: {
          id?: string;
          full_name: string;
          role_title: string;
          headline?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          cv_url?: string | null;
          email?: string | null;
          location?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          role_title?: string;
          headline?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          cv_url?: string | null;
          email?: string | null;
          location?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      social_links: {
        Row: SocialLink;
        Insert: {
          id?: string;
          platform: string;
          url: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          platform?: string;
          url?: string;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      skills: {
        Row: Skill;
        Insert: {
          id?: string;
          category: SkillCategory;
          name: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          category?: SkillCategory;
          name?: string;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      experience: {
        Row: Experience;
        Insert: {
          id?: string;
          company_name: string;
          company_logo_url?: string | null;
          position_title: string;
          description_points?: string[];
          start_month: number;
          start_year: number;
          end_month?: number | null;
          end_year?: number | null;
          is_current?: boolean;
          employment_type?: EmploymentType | null;
          photos?: string[];
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          company_logo_url?: string | null;
          position_title?: string;
          description_points?: string[];
          start_month?: number;
          start_year?: number;
          end_month?: number | null;
          end_year?: number | null;
          is_current?: boolean;
          employment_type?: EmploymentType | null;
          photos?: string[];
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: Project;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          thumbnail_url?: string | null;
          screenshots?: string[];
          description: string;
          tech_stack?: string[];
          live_url?: string | null;
          repo_url?: string | null;
          is_featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          thumbnail_url?: string | null;
          screenshots?: string[];
          description?: string;
          tech_stack?: string[];
          live_url?: string | null;
          repo_url?: string | null;
          is_featured?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      blog_posts: {
        Row: BlogPost;
        Insert: {
          id?: string;
          title: string;
          slug: string;
          cover_image_url?: string | null;
          excerpt?: string | null;
          content: string;
          status?: PostStatus;
          tags?: string[];
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          cover_image_url?: string | null;
          excerpt?: string | null;
          content?: string;
          status?: PostStatus;
          tags?: string[];
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      skill_category: SkillCategory;
      post_status: PostStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
