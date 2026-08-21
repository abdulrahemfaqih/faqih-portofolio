import { createClient } from "@/lib/supabase/client";

/**
 * Helper untuk upload file ke Supabase Storage
 * @param file File yang akan di-upload
 * @param bucket Nama bucket ('avatars', 'cv', 'company-logos', 'project-images', 'blog-images')
 * @param folder Optional subfolder
 * @returns Public URL dari file yang di-upload
 */
export async function uploadFileToStorage(
  file: File,
  bucket: string,
  folder: string = ""
): Promise<string> {
  const supabase = createClient();

  // Generate nama file yang unik & bersih
  const fileExt = file.name.split(".").pop();
  const cleanName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .slice(0, 30);
  const fileName = `${folder ? `${folder}/` : ""}${Date.now()}-${cleanName}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) {
    console.error(`[uploadFileToStorage] Error uploading to ${bucket}:`, error);
    throw new Error(error.message);
  }

  // Dapatkan URL publik
  const { data: publicData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return publicData.publicUrl;
}
