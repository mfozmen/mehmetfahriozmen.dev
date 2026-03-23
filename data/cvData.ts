export interface CvProject {
  name: string;
  description: string;
}

export interface CvRole {
  title: string;
  date: string;
  description?: string;
}

export interface CvSubEntry {
  role: string;
  date: string;
  company: string;
  description: string;
  chips: string[];
}

export interface CvExperienceEntry {
  role: string;
  date: string;
  company: string;
  roles?: CvRole[];
  description?: string;
  subEntry?: CvSubEntry;
  projects?: CvProject[];
  chips?: string[];
}

export interface CvSkillCategory {
  label: string;
  items: string[];
}

export interface CvCoordinate {
  label: string;
  value: string;
  href?: string;
}

export const cvExperience: CvExperienceEntry[] = [
  {
    role: "Head of Software Technologies",
    date: "Dec 2024 — Dec 2025",
    company: "Mayadem",
    roles: [
      { title: "Head of Software Technologies", date: "Nov 2025 — Dec 2025", description: "Led cross-functional engineering teams across backend, frontend, QA, and UI/UX. Drove end-to-end product development, aligning technical execution with business objectives. Established coding standards and engineering best practices across all teams." },
      { title: "Head of Backend Engineering", date: "Dec 2024 — Nov 2025", description: "Built backend engineering teams from scratch for multiple products. Defined backend architecture, coding standards, and oversaw distributed system design. Improved CI/CD pipelines and promoted TDD practices for system robustness." },
    ],
    projects: [
      { name: "MagicPags", description: "Educational audiobook, analytics, child-safe delivery" },
      { name: "Çoknet", description: "Exam prep, microservices architecture, multi-discipline team" },
    ],
    chips: [".NET", "Kafka", "PostgreSQL", "Hasura", "AWS"],
  },
  {
    role: "Software Engineering Manager",
    date: "Aug 2019 — Sep 2024",
    company: "Brew Interactive",
    roles: [
      { title: "Software Engineering Manager", date: "Dec 2022 — Sep 2024", description: "Led a backend and DevOps team of 4–6 engineers, designing event-driven microservices for domestic and international clients. Managed hiring, performance evaluations, and career development. Developed internal open-source solutions for reusability across projects." },
      { title: "Senior Backend Developer", date: "Aug 2019 — Dec 2022", description: "Developed serverless functions and microservices powering backend operations for multiple client projects. Built CI/CD pipelines, containerized applications, and worked in Agile Scrum with TDD methodology." },
    ],
    subEntry: {
      role: "Senior Backend Developer",
      date: "Jan 2021 — Dec 2022",
      company: "BeforeSunset AI",
      description: "Built the backend architecture from scratch for an AI productivity assistant. Designed database models, developed APIs with Hasura, and managed Kubernetes deployments.",
      chips: ["Node.js", "Hasura", "PostgreSQL", "Docker", "Kubernetes"],
    },
    projects: [
      { name: "Decktopus AI", description: "Serverless, real-time GraphQL, containerized export" },
      { name: "Shubuo", description: "Ad scheduling, contract-aware pacing, real-time optimization" },
    ],
    chips: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "AWS"],
  },
  {
    role: "Senior Software Engineer",
    date: "May 2019 — Jul 2019",
    company: "Datagen Bilişim",
    description:
      "Developed sales automation system for Peyman Kuruyemiş — Android application and backend services with MSSQL database programming.",
    chips: ["C#", "Xamarin", "MSSQL"],
  },
  {
    role: "Senior Software Engineer",
    date: "Jun 2018 — Apr 2019",
    company: "Ptt Trade",
    description:
      "Built backend services and search engine for the foreign trade portal in partnership with PTT. Worked across Node.js, .NET Core, and Golang with Elasticsearch powering search.",
    chips: ["Golang", "Node.js", "Elasticsearch", ".NET Core"],
  },
  {
    role: "Senior Software Engineer",
    date: "Jan 2013 — Jun 2018",
    company: "Veriyaz Yazılım",
    roles: [
      { title: "Senior Software Engineer", date: "Jan 2015 — Jun 2018", description: "Led backend and frontend development of a CRM platform for SMEs. Built vehicle tracking, computer monitoring, document management, and bulk mail systems using .NET, with real-time tracking via TCP/IP and WebSocket." },
      { title: "Software Engineer", date: "Jan 2013 — Jan 2015", description: "Contributed to the development of the CRM platform, implementing core features and integrating with AWS and Azure services." },
    ],
    chips: ["C# / .NET", "MSSQL", "AWS", "WebSocket"],
  },
];

export const cvEarlierRoles: { role: string; company: string; date: string }[] = [
  { role: "Software Engineer", company: "Erik Bilişim", date: "Sep 2012 — Jan 2013" },
  { role: "Intern", company: "TRT", date: "Sep 2010 — Oct 2010" },
  { role: "Intern", company: "Izmir Metropolitan Municipality", date: "Jul 2009 — Aug 2009" },
];

export const cvSkills: CvSkillCategory[] = [
  { label: "Backend", items: ["Node.js", "TypeScript", "PHP", "Laravel", ".NET / C#", "Golang", "GraphQL", "REST"] },
  { label: "Infrastructure", items: ["AWS", "GCP", "Docker", "Kubernetes", "CI/CD", "Redis", "RabbitMQ", "Kafka"] },
  { label: "Data", items: ["PostgreSQL", "MongoDB", "MySQL", "MSSQL", "Elasticsearch"] },
  { label: "Leadership", items: ["Team building", "Hiring", "Mentoring", "Agile", "Code review culture"] },
];

export const cvCoordinates: CvCoordinate[] = [
  { label: "Location", value: "İzmir, Turkey" },
  { label: "Email", value: "mehmetfahriozmen@gmail.com", href: "mailto:mehmetfahriozmen@gmail.com" },
  { label: "LinkedIn", value: "linkedin.com/in/mfozmen", href: "https://linkedin.com/in/mfozmen" },
  { label: "GitHub", value: "github.com/mfozmen", href: "https://github.com/mfozmen" },
  { label: "Web", value: "mehmetfahriozmen.dev", href: "https://mehmetfahriozmen.dev" },
];
