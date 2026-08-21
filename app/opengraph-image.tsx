import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Abdul Rahem Faqih | Fullstack Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "sans-serif",
          color: "#fafaf8",
          border: "12px solid #222222",
        }}
      >
        {/* Top bar / Wordmark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
            }}
          />
          <span
            style={{
              fontSize: "20px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#a1a1aa",
              fontFamily: "monospace",
            }}
          >
            abdulrahemfaqih.com
          </span>
        </div>

        {/* Middle Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "#fafaf8",
              lineHeight: 1.1,
            }}
          >
            Abdul Rahem Faqih
          </div>
          <div
            style={{
              fontSize: "28px",
              color: "#a1a1aa",
              letterSpacing: "0.02em",
              fontFamily: "monospace",
              textTransform: "uppercase",
            }}
          >
            Fullstack Developer & Software Engineer
          </div>
        </div>

        {/* Bottom Tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "24px",
            borderTop: "1px solid #27272a",
          }}
        >
          <span style={{ fontSize: "20px", color: "#71717a" }}>
            Portfolio, Karya & Tulisan Teknis
          </span>
          <span
            style={{
              fontSize: "20px",
              fontFamily: "monospace",
              color: "#fafaf8",
              backgroundColor: "#18181b",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "1px solid #27272a",
            }}
          >
            Next.js • TypeScript • Supabase
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
