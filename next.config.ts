import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 80, 85],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        // Supabase Storage — izinkan semua bucket dari project Supabase
        protocol: "https",
        hostname: "erkwwezliqrjdsajalsp.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
