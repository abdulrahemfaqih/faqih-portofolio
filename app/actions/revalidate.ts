"use server";

import { revalidatePath } from "next/cache";

/**
 * Server Actions untuk on-demand revalidation di Vercel / Next.js
 * Memaksa cache edge / CDN Vercel dibersihkan seketika setelah perubahan di admin
 */

export async function revalidateProjectAction(slug?: string, oldSlug?: string) {
  try {
    revalidatePath("/");
    revalidatePath("/project/[slug]", "page");
    if (slug) {
      revalidatePath(`/project/${slug}`);
    }
    if (oldSlug && oldSlug !== slug) {
      revalidatePath(`/project/${oldSlug}`);
    }
    revalidatePath("/sitemap.xml");
    return { success: true };
  } catch (error) {
    console.error("[revalidateProjectAction]", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function revalidateBlogAction(slug?: string, oldSlug?: string) {
  try {
    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }
    if (oldSlug && oldSlug !== slug) {
      revalidatePath(`/blog/${oldSlug}`);
    }
    revalidatePath("/sitemap.xml");
    return { success: true };
  } catch (error) {
    console.error("[revalidateBlogAction]", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function revalidateHomeAction() {
  try {
    revalidatePath("/");
    revalidatePath("/sitemap.xml");
    return { success: true };
  } catch (error) {
    console.error("[revalidateHomeAction]", error);
    return { success: false, error: (error as Error).message };
  }
}
