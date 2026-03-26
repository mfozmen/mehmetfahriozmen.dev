import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mehmet Fahri Özmen — Backend Systems Architect";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
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
        <div
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: "#BA7517",
            letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            marginBottom: 24,
          }}
        >
          mehmetfahriozmen.dev
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: 24,
          }}
        >
          Mehmet Fahri Özmen
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#a3a3a3",
            lineHeight: 1.4,
          }}
        >
          Backend Systems Architect & Engineering Leader
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 80,
            display: "flex",
            gap: 32,
            fontSize: 16,
            color: "#737373",
          }}
        >
          <span>github.com/mfozmen</span>
          <span style={{ color: "#BA7517" }}>·</span>
          <span>linkedin.com/in/mfozmen</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
