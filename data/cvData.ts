export interface CvProject {
  name: string;
  description: string;
}

export interface CvExperienceEntry {
  role: string;
  date: string;
  company: string;
  description?: string;
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
    date: "2024 — 2025",
    company: "Mayadem",
    description:
      "Led cross-functional engineering teams across backend, frontend, QA, and UI/UX. Built and scaled multiple products from the ground up, overseeing architecture, hiring, and end-to-end delivery.",
    projects: [
      { name: "MagicPags", description: "Educational audiobook — analytics, child-safe delivery, ETL reporting" },
      { name: "Çoknet", description: "Exam prep — microservices architecture, multi-discipline team" },
    ],
    chips: [".NET", "Kafka", "PostgreSQL", "Hasura", "AWS"],
  },
  {
    role: "Software Engineering Manager",
    date: "2019 — 2024",
    company: "Brew Interactive",
    description:
      "Led a backend & DevOps team of 4–6 engineers. Designed event-driven microservices architectures for domestic and international clients. Grew from senior developer to engineering manager over 5 years.",
    projects: [
      { name: "Decktopus AI", description: "Serverless, real-time GraphQL, containerized export" },
      { name: "BeforeSunset AI", description: "Backend from scratch, task planning, Kubernetes" },
      { name: "Shubuo", description: "Ad scheduling, contract-aware pacing, real-time optimization" },
    ],
    chips: ["Node.js", "TypeScript", "PostgreSQL", "Redis", "AWS"],
  },
  {
    role: "Senior Software Engineer",
    date: "2018 — 2019",
    company: "Ptt Trade",
    description:
      "Built backend services and search engine for the foreign trade portal in partnership with PTT. Worked across Node.js, .NET Core, and Golang with Elasticsearch powering search.",
    chips: ["Golang", "Node.js", "Elasticsearch", ".NET Core"],
  },
  {
    role: "Senior Software Engineer",
    date: "2019",
    company: "Datagen Bilişim",
    description:
      "Developed sales automation system for Peyman Kuruyemiş — Android application and backend services with MSSQL database programming.",
    chips: ["C#", "Xamarin", "MSSQL"],
  },
  {
    role: "Software Engineer → Senior",
    date: "2013 — 2018",
    company: "Veriyaz Yazılım",
    description:
      "Led development of a CRM platform for SMEs. Built vehicle tracking, computer monitoring, document management, and bulk mail systems — growing from developer to senior over 5.5 years.",
    chips: ["C# / .NET", "MSSQL", "AWS", "WebSocket"],
  },
];

export const cvEarlierRoles: { role: string; company: string; date: string }[] = [
  { role: "Software Engineer", company: "Erik Bilişim", date: "2012 — 2013" },
  { role: "Intern", company: "TRT", date: "2010" },
  { role: "Intern", company: "Izmir Metropolitan Municipality", date: "2009" },
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
