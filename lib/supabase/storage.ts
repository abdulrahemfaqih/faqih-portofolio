import { createClient } from "@/lib/supabase/client";

/**
 * Kompresi gambar otomatis di sisi browser (client-side) menggunakan HTML5 Canvas
 * Mengubah foto kamera beresolusi raksasa menjadi maksimal 1920px dan format WebP terkompresi.
 */
async function compressImageClientSide(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.82
): Promise<File> {
  // Hanya proses file gambar raster (skip dokumen PDF, SVG, atau GIF animasi)
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return file;
  }

  // Jika bukan di browser environment
  if (typeof window === "undefined" || typeof document === "undefined") {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let { width, height } = img;

        // Jika ukuran file sudah sangat kecil (< 200KB dan dimensi w/h <= 1200), tidak perlu diproses ulang
        if (file.size < 200 * 1024 && width <= 1200 && height <= 1200) {
          resolve(file);
          return;
        }

        // Skala aspect ratio proporsional
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert ke WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const cleanFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
            const compressedFile = new File([blob], cleanFileName, {
              type: "image/webp",
              lastModified: Date.now(),
            });

            // Gunakan hasil kompresi jika ukurannya lebih hemat
            if (compressedFile.size < file.size) {
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/webp",
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

/**
 * Helper untuk upload file ke Supabase Storage (otomatis kompres gambar di client)
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

  // Otomatis kompresi gambar sebelum dikirim ke server Supabase
  const processedFile = await compressImageClientSide(file);

  // Generate nama file yang unik & bersih
  const fileExt = processedFile.name.split(".").pop() || "webp";
  const cleanName = processedFile.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .slice(0, 30);
  const fileName = `${folder ? `${folder}/` : ""}${Date.now()}-${cleanName}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, processedFile, {
      cacheControl: "31536000",
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
