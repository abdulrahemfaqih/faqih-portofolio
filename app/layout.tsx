import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION, KEYWORDS } from "@/lib/seo";

/*
 * Font Loading — self-hosted via next/font (sesuai design.md §4.2)
 * - Fraunces: serif berkarakter untuk display/heading
 * - Geist Sans: body, label UI
 * - Geist Mono: metadata, tag, eyebrow, code
 */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

/*
 * Global SEO Metadata & Open Graph
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: "Abdul Rahem Faqih Portfolio",
  category: "technology",
  icons: {
    icon: [
      { url: "/logo.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/preview_1.png",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} | Fullstack Developer`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/preview_1.png"],
    creator: "@abdulrahemfaqih",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// JSON-LD Structured Data (Schema.org Person & WebSite)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Abdul Rahem Faqih",
      alternateName: ["Faqih", "Abdul Rahem", "ARF", "abdulrahemfaqih"],
      jobTitle: "Fullstack Developer",
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      image: `${SITE_URL}/me.png`,
      sameAs: [
        "https://github.com/abdulrahemfaqih",
        "https://linkedin.com/in/abdulrahemfaqih",
      ],
      knowsAbout: [
        "Web Development",
        "Fullstack Development",
        "Next.js",
        "React",
        "TypeScript",
        "Node.js",
        "Supabase",
        "PostgreSQL",
        "Tailwind CSS",
        "Software Engineering",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Abdul Rahem Faqih Portfolio",
      description: SITE_DESCRIPTION,
      publisher: {
        "@id": `${SITE_URL}/#person`,
      },
      inLanguage: "id-ID",
    },
  ],
};

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[--paper] text-[--ink]">
        {children}
      </body>
    </html>
  );
}
