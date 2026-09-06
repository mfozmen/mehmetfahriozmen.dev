import { getLlmsTxt } from "@/lib/llmsTxt";

export function GET() {
  return new Response(getLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
