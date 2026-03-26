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
          alignItems: "center",
          padding: "60px 80px",
          background: "#0a0a0a",
          fontFamily: "sans-serif",
          textAlign: "center",
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
            fontSize: 88,
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.05,
            marginBottom: 20,
          }}
        >
          Mehmet Fahri Özmen
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 500,
            color: "#BA7517",
            lineHeight: 1.3,
          }}
        >
          Backend Systems Architect & Engineering Leader
        </div>
      </div>
    ),
    { ...size }
  );
}
