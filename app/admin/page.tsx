import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Folder,
  Article,
  Briefcase,
  Code,
  Plus,
  ArrowUpRight,
  User,
} from "@phosphor-icons/react/dist/ssr";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch counts & recent data paralel
  const [
    { count: projectsCount },
    { data: blogPosts },
    { count: experienceCount },
    { count: skillsCount },
    { data: recentProjects },
    { data: aboutMe },
  ] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase.from("blog_posts").select("id, status"),
    supabase.from("experience").select("*", { count: "exact", head: true }),
    supabase.from("skills").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("id, title, slug, is_featured, created_at").order("created_at", { ascending: false }).limit(5),
    supabase.from("about_me").select("full_name, role_title").maybeSingle(),
  ]);

  const totalBlog = blogPosts?.length ?? 0;
  const publishedBlog = blogPosts?.filter((b) => b.status === "published").length ?? 0;
  const draftBlog = totalBlog - publishedBlog;

  const STATS = [
    {
      label: "Total Proyek",
      value: projectsCount ?? 0,
      sublabel: "Ditampilkan di portfolio",
      icon: Folder,
      href: "/admin/projects",
    },
    {
      label: "Blog Posts",
      value: totalBlog,
      sublabel: `${publishedBlog} Terbit • ${draftBlog} Draf`,
      icon: Article,
      href: "/admin/blog",
    },
    {
      label: "Pengalaman Kerja",
      value: experienceCount ?? 0,
      sublabel: "Riwayat karir di timeline",
      icon: Briefcase,
      href: "/admin/experience",
    },
    {
      label: "Keahlian / Skills",
      value: skillsCount ?? 0,
      sublabel: "3 kategori keahlian",
      icon: Code,
      href: "/admin/skills",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[--ink-12]">
        <div>
          <span className="eyebrow-label mb-2">Dashboard Admin</span>
          <h1 className="text-h1 font-[family-name:var(--font-fraunces)] text-[--ink]">
            Selamat datang{aboutMe?.full_name ? `, ${aboutMe.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="text-small text-[--ink-70] mt-1">
            Kelola seluruh konten dinamis portfolio Anda dari satu tempat.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" className="btn-outline text-xs inline-flex items-center gap-1.5">
            <span>Buka Website</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map(({ label, value, sublabel, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="card p-5 hover:border-[--ink-45] transition-colors group block"
          >
            <div className="flex items-center justify-between text-[--ink-45] group-hover:text-[--ink] transition-colors mb-4">
              <span className="font-[family-name:var(--font-geist-mono)] text-xs tracking-wider uppercase">
                {label}
              </span>
              <Icon size={20} />
            </div>
            <p className="font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[--ink] mb-1">
              {value}
            </p>
            <p className="text-[0.6875rem] text-[--ink-45] font-[family-name:var(--font-geist-mono)]">
              {sublabel}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Action Buttons */}
      <div>
        <h2 className="font-[family-name:var(--font-geist-mono)] text-xs tracking-widest uppercase text-[--ink-45] mb-4">
          Aksi Cepat
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-3 p-4 border border-[--ink-12] rounded-sm hover:border-[--ink] hover:bg-[--surface-alt] transition-all group"
          >
            <div className="p-2 rounded-sm bg-[--surface-alt] group-hover:bg-[--ink] group-hover:text-[--paper] transition-colors text-[--ink]">
              <Plus size={16} weight="bold" />
            </div>
            <div>
              <p className="text-xs font-medium text-[--ink]">Tambah Proyek</p>
              <p className="text-[0.6875rem] text-[--ink-45]">Upload portofolio baru</p>
            </div>
          </Link>

          <Link
            href="/admin/blog/new"
            className="flex items-center gap-3 p-4 border border-[--ink-12] rounded-sm hover:border-[--ink] hover:bg-[--surface-alt] transition-all group"
          >
            <div className="p-2 rounded-sm bg-[--surface-alt] group-hover:bg-[--ink] group-hover:text-[--paper] transition-colors text-[--ink]">
              <Plus size={16} weight="bold" />
            </div>
            <div>
              <p className="text-xs font-medium text-[--ink]">Tulis Blog Baru</p>
              <p className="text-[0.6875rem] text-[--ink-45]">Buat artikel teknis</p>
            </div>
          </Link>

          <Link
            href="/admin/experience/new"
            className="flex items-center gap-3 p-4 border border-[--ink-12] rounded-sm hover:border-[--ink] hover:bg-[--surface-alt] transition-all group"
          >
            <div className="p-2 rounded-sm bg-[--surface-alt] group-hover:bg-[--ink] group-hover:text-[--paper] transition-colors text-[--ink]">
              <Plus size={16} weight="bold" />
            </div>
            <div>
              <p className="text-xs font-medium text-[--ink]">Tambah Pengalaman</p>
              <p className="text-[0.6875rem] text-[--ink-45]">Update riwayat karir</p>
            </div>
          </Link>

          <Link
            href="/admin/about"
            className="flex items-center gap-3 p-4 border border-[--ink-12] rounded-sm hover:border-[--ink] hover:bg-[--surface-alt] transition-all group"
          >
            <div className="p-2 rounded-sm bg-[--surface-alt] group-hover:bg-[--ink] group-hover:text-[--paper] transition-colors text-[--ink]">
              <User size={16} weight="bold" />
            </div>
            <div>
              <p className="text-xs font-medium text-[--ink]">Edit Profil & CV</p>
              <p className="text-[0.6875rem] text-[--ink-45]">Atur bio & kontak</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Projects Overview */}
      <div className="card p-6">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[--ink-12]">
          <h2 className="text-h2 font-[family-name:var(--font-fraunces)] text-[--ink]">
            Proyek Terbaru
          </h2>
          <Link
            href="/admin/projects"
            className="font-[family-name:var(--font-geist-mono)] text-xs text-[--ink-70] hover:text-[--ink] uppercase tracking-wider"
          >
            Lihat Semua →
          </Link>
        </div>

        {recentProjects && recentProjects.length > 0 ? (
          <div className="divide-y divide-[--ink-12]">
            {recentProjects.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[--ink] truncate">{p.title}</p>
                  <p className="text-[0.6875rem] font-[family-name:var(--font-geist-mono)] text-[--ink-45]">
                    /{p.slug}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {p.is_featured && (
                    <span className="chip text-[0.6875rem] bg-[--surface-alt]">Featured</span>
                  )}
                  <Link
                    href={`/admin/projects/${p.id}/edit`}
                    className="text-xs text-[--ink-70] hover:text-[--ink] underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-6 text-center text-sm text-[--ink-45]">
            Belum ada proyek yang ditambahkan.
          </p>
        )}
      </div>
    </div>
  );
}
