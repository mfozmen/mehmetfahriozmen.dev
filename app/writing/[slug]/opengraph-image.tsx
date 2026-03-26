import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";

export const alt = "Blog post cover";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const title = post?.title ?? "Writing";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
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
            height: "6px",
            background: "linear-gradient(90deg, transparent 10%, #BA7517 50%, transparent 90%)",
          }}
        />
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: 28,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: "#BA7517",
          }}
        >
          Mehmet Fahri Özmen
        </div>
      </div>
    ),
    { ...size }
  );
}
