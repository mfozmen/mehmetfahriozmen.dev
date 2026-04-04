import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/lab/how-to-write-custom-skills-for-ai-coding-agents",
        destination: "/lab/writing-custom-skills-for-ai-coding-agents",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
