import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";

export const alt = "Blog post cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? "Writing";
  const excerpt = post?.excerpt ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0a0a0a",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #BA7517, transparent)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "#BA7517",
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              marginBottom: 24,
            }}
          >
            mehmetfahriozmen.dev/writing
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.15,
              maxWidth: 900,
            }}
          >
            {title}
          </div>
          {excerpt && (
            <div
              style={{
                fontSize: 22,
                color: "#737373",
                marginTop: 20,
                fontStyle: "italic",
              }}
            >
              {excerpt}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 18,
            color: "#a3a3a3",
          }}
        >
          <span style={{ fontWeight: 600, color: "#ffffff" }}>Mehmet Fahri Özmen</span>
          <span style={{ color: "#BA7517" }}>·</span>
          <span>Backend Systems Architect</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
