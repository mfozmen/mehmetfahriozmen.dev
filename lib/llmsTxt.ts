import { getAllPosts, sortByDateDesc } from "@/lib/posts";
import { getAllLabPosts } from "@/lib/lab";
import { projects, type Project } from "@/data/projects";

const SITE_URL = "https://mehmetfahriozmen.dev";

export type LlmsEntry = { title: string; slug: string; description: string; date: string };

// The only hand-written part of llms.txt: who the author is. Posts and projects are
// generated from content/ and data/, so they can't go stale. This block can — when the
// CV, role or profile changes, update it here as well (see CLAUDE.md, "Crawler metadata").
const HEADER = `# mehmetfahriozmen.dev

> Personal website of Mehmet Fahri Özmen — Backend Systems Architect & Engineering Leader based in İzmir, Turkey. 12+ years building scalable distributed systems across e-commerce, ad-tech, edtech, and productivity.

## Author
- Name: Mehmet Fahri Özmen
- Role: Backend Systems Architect & Engineering Leader
- Location: İzmir, Turkey
- Education: Computer Engineering, Yaşar University (2006-2011)
- LinkedIn: https://linkedin.com/in/mfozmen
- GitHub: https://github.com/mfozmen
- X/Twitter: https://x.com/mfozmen
- Email: contact@mehmetfahriozmen.dev

## Key Expertise
- Backend architecture (Node.js, .NET, Golang, Java)
- Distributed systems (Kafka, RabbitMQ, microservices)
- Cloud infrastructure (AWS, Azure, Docker, Kubernetes)
- Databases (PostgreSQL, Elasticsearch, Redis, MSSQL)
- Engineering leadership (team building, hiring, mentoring)
- Agile planning: epics, user stories, acceptance criteria, BDD/TDD
- E-commerce, ad-tech, edtech, productivity domains

## Pages
- [Homepage](${SITE_URL}): Overview, galaxy visualization of systems, featured projects
- [About](${SITE_URL}/about): Career story, philosophy, personal interests
- [CV](${SITE_URL}/cv): Full professional timeline, skills, education
- [Writing](${SITE_URL}/writing): Field Notes — essays on engineering leadership, planning, AI and building software
- [Lab Day](${SITE_URL}/lab): Technical guides and walkthroughs
- [Contact](${SITE_URL}/contact): Contact form and direct channels

## Open Source
- [Groomie](https://github.com/mfozmen/groomie): Claude Code plugin that turns a messy Jira issue into an epic → user stories → technical tasks breakdown`;

function entryLine(section: string, post: LlmsEntry): string {
  return `- [${post.title}](${SITE_URL}/${section}/${post.slug}): ${post.description} (${post.date})`;
}

function projectLine(p: Project): string {
  const name = p.url ? `[${p.name}](${p.url})` : p.name;
  return p.description ? `- ${name}: ${p.description}` : `- ${name}`;
}

export function buildLlmsTxt(posts: LlmsEntry[], labPosts: LlmsEntry[], systems: Project[] = projects): string {
  const writing = [...posts].sort(sortByDateDesc).map((p) => entryLine("writing", p));
  const lab = [...labPosts].sort(sortByDateDesc).map((p) => entryLine("lab", p));
  const notable = systems.filter((p) => p.importance === "hero" || p.importance === "primary").map(projectLine);
  return [
    HEADER,
    "## Notable Systems",
    ...notable,
    "",
    "## Writing (Field Notes)",
    ...writing,
    "",
    "## Lab Day",
    ...lab,
    "",
    "## Feeds",
    `- RSS: ${SITE_URL}/feed.xml`,
    `- Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");
}

export function getLlmsTxt(): string {
  return buildLlmsTxt(getAllPosts(), getAllLabPosts());
}
