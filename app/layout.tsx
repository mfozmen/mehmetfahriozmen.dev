import type { Metadata } from "next";
import Script from "next/script";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = "https://mehmetfahriozmen.dev";
const SITE_NAME = "Mehmet Fahri Özmen";
const DEFAULT_DESCRIPTION = "Backend Systems Architect & Engineering Leader. Building distributed systems, search engines, and the teams behind them.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Backend Systems Architect`,
    template: `%s — ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
    title: `${SITE_NAME} — Backend Systems Architect`,
    description: DEFAULT_DESCRIPTION,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@mfozmen",
  },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/feed.xml" },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mehmet Fahri Özmen",
    url: SITE_URL,
    jobTitle: "Backend Systems Architect & Engineering Leader",
    description: DEFAULT_DESCRIPTION,
    sameAs: [
      "https://github.com/mfozmen",
      "https://linkedin.com/in/mfozmen",
      "https://x.com/mfozmen",
    ],
    knowsAbout: [
      "Backend Architecture", "Distributed Systems", "Engineering Leadership",
      "Node.js", ".NET", "Golang", "PostgreSQL", "Kafka", "Docker", "Kubernetes",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    author: { "@type": "Person", name: "Mehmet Fahri Özmen" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd />
        {children}
        <SpeedInsights />
        {process.env.NODE_ENV === "production" && (
          <>
            <Script
              src="https://insights.mehmetfahriozmen.dev/script.js"
              data-website-id="6121e91e-7701-4630-896e-02d794d1852a"
              strategy="afterInteractive"
            />
            <Script id="microsoft-clarity" strategy="afterInteractive">
              {`(function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "w22elwcfda");`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
