export type SystemImportance = "primary" | "secondary" | "minor";

export type SystemNode = {
  id: string;
  name: string;
  url?: string;
  importance: SystemImportance;
  domains: string[];
  techClusters: string[];
  angle: number;
  orbit: number;
};

export type DomainNode = {
  id: string;
  name: string;
  angle: number;
  orbit: number;
  offset: { x: number; y: number };
};

export type TechClusterNode = {
  id: string;
  name: string;
  technologies: string[];
  position: { x: number; y: number };
};

export type OrbitConfig = {
  rx: number;
  ry: number;
  rotation: number;
  opacity: number;
};

export const orbits: OrbitConfig[] = [
  { rx: 0.44, ry: 0.40, rotation: -0.12, opacity: 0.18 },
  { rx: 0.36, ry: 0.32, rotation: -0.08, opacity: 0.15 },
  { rx: 0.30, ry: 0.30, rotation: -0.05, opacity: 0.11 },
];

export const systems: SystemNode[] = [
  // Primary — orbit 0, ~60° apart
  {
    id: "mobilet",
    name: "Mobilet",
    importance: "primary",
    angle: 0.5,
    orbit: 0,
    domains: ["ecommerce", "distributed"],
    techClusters: ["databases", "search", "cloud", "devops", "api", "architecture", "frameworks", "monitoring", "data_analysis", "methodologies"],
    url: "https://www.mobilet.com",
  },
  {
    id: "shubuo",
    name: "Shubuo",
    importance: "primary",
    angle: 1.55,
    orbit: 0,
    domains: ["adtech", "distributed"],
    techClusters: ["databases", "cloud", "devops", "api", "architecture", "frameworks", "methodologies"],
  },
  {
    id: "villasepeti",
    name: "VillaSepeti",
    importance: "primary",
    angle: 2.6,
    orbit: 0,
    domains: ["ecommerce", "distributed"],
    techClusters: ["databases", "search", "cloud", "devops", "api", "architecture", "messaging", "frameworks", "methodologies"],
    url: "https://www.villasepeti.com",
  },
  {
    id: "ptttrade",
    name: "PTT Trade",
    importance: "primary",
    angle: 3.65,
    orbit: 0,
    domains: ["ecommerce"],
    techClusters: ["databases", "search", "cloud", "devops", "api", "architecture", "frameworks"],
  },
  {
    id: "beforesunset",
    name: "BeforeSunset",
    importance: "primary",
    angle: 4.7,
    orbit: 0,
    domains: ["productivity"],
    techClusters: ["databases", "cloud", "devops", "api", "architecture", "methodologies"],
    url: "https://www.beforesunset.ai",
  },
  {
    id: "decktopus",
    name: "Decktopus",
    importance: "primary",
    angle: 5.75,
    orbit: 0,
    domains: ["productivity"],
    techClusters: ["databases", "cloud", "devops", "api", "architecture", "methodologies"],
    url: "https://www.decktopus.com",
  },

  // Secondary — orbit 1, ~90° apart
  {
    id: "magicpags",
    name: "MagicPags",
    importance: "secondary",
    angle: 0.6,
    orbit: 1,
    domains: ["education"],
    techClusters: ["databases", "search", "cloud", "devops", "api", "architecture", "messaging", "frameworks", "monitoring", "data_analysis", "methodologies"],
  },
  {
    id: "room3d",
    name: "Room3D",
    importance: "secondary",
    angle: 2.2,
    orbit: 1,
    domains: ["realtime"],
    techClusters: ["databases", "cloud", "devops", "api", "architecture", "methodologies"],
  },
  {
    id: "ihtiyac",
    name: "İhtiyaç Haritası",
    importance: "secondary",
    angle: 4.1,
    orbit: 1,
    domains: ["nonprofit"],
    techClusters: ["databases", "cloud", "devops", "api", "architecture", "methodologies"],
    url: "https://sosyalpazaryeri.ihtiyacharitasi.org/",
  },
  {
    id: "coknet",
    name: "Çok Net",
    importance: "secondary",
    angle: 5.4,
    orbit: 1,
    domains: ["education"],
    techClusters: ["databases", "search", "cloud", "devops", "api", "architecture", "frameworks", "methodologies"],
    url: "https://app.cok.net.tr/",
  },

  // Minor — orbit 2, opposite sides
  {
    id: "fsd",
    name: "FoodServiceDirect",
    importance: "minor",
    angle: 1.2,
    orbit: 2,
    domains: ["ecommerce"],
    techClusters: ["databases", "search", "cloud", "api", "architecture", "frameworks", "methodologies"],
  },
  {
    id: "megatons",
    name: "20 Megatons",
    importance: "minor",
    angle: 4.4,
    orbit: 2,
    domains: ["nonprofit"],
    techClusters: ["databases", "cloud", "devops", "api", "architecture", "methodologies"],
  },
];

export const domains: DomainNode[] = [
  {
    id: "ecommerce",
    name: "E-Commerce",
    angle: 1.0,
    orbit: 0,
    offset: { x: -0.07, y: 0.08 },
  },
  {
    id: "adtech",
    name: "AdTech",
    angle: 1.8,
    orbit: 0,
    offset: { x: 0.10, y: -0.10 },
  },
  {
    id: "productivity",
    name: "Productivity",
    angle: 5.2,
    orbit: 0,
    offset: { x: 0.07, y: 0.06 },
  },
  {
    id: "distributed",
    name: "Distributed Systems",
    angle: 3.0,
    orbit: 0,
    offset: { x: 0.06, y: -0.07 },
  },
  {
    id: "education",
    name: "Education",
    angle: 0.2,
    orbit: 1,
    offset: { x: 0.07, y: -0.06 },
  },
  {
    id: "nonprofit",
    name: "Non-Profit",
    angle: 4.0,
    orbit: 1,
    offset: { x: -0.07, y: 0.06 },
  },
  {
    id: "realtime",
    name: "Real-time Collaboration",
    angle: 2.2,
    orbit: 1,
    offset: { x: -0.10, y: 0.08 },
  },
];

export const techClusters: TechClusterNode[] = [
  { id: "databases", name: "Databases", position: { x: 0.13, y: -0.02 }, technologies: ["PostgreSQL", "MySQL", "MSSQL", "Redis", "Couchbase"] },
  { id: "search", name: "Search", position: { x: 0.03, y: -0.17 }, technologies: ["Elasticsearch", "Meilisearch", "Typesense", "Algolia"] },
  { id: "cloud", name: "Cloud", position: { x: -0.06, y: -0.12 }, technologies: ["AWS", "Azure", "DigitalOcean"] },
  { id: "devops", name: "DevOps", position: { x: -0.14, y: 0.06 }, technologies: ["Docker", "Kubernetes", "CircleCI", "Bitbucket Pipelines", "GitHub Actions", "Vercel"] },
  { id: "api", name: "API", position: { x: -0.02, y: 0.16 }, technologies: ["Hasura", "Directus", "Supabase", "GraphQL", "REST", "WebSocket"] },
  { id: "architecture", name: "Architecture", position: { x: 0.06, y: 0.15 }, technologies: ["Event-Driven", "CQRS", "Microservices", "Monolith", "Monorepo"] },
  { id: "messaging", name: "Messaging", position: { x: 0.12, y: -0.12 }, technologies: ["RabbitMQ", "Kafka", "Redis Pub/Sub", "AWS SQS/SNS"] },
  { id: "frameworks", name: "Frameworks", position: { x: -0.13, y: -0.14 }, technologies: ["NestJS / TypeScript", "Node.js / JavaScript", "Laravel / PHP", "Spring Boot / Java", ".NET / C#", "Magento / PHP", "Golang"] },
  { id: "monitoring", name: "Monitoring", position: { x: -0.14, y: -0.04 }, technologies: ["Grafana", "Elasticsearch"] },
  { id: "data_analysis", name: "Data Analysis", position: { x: 0.14, y: 0.08 }, technologies: ["ClickHouse", "AWS Glue", "Airflow", "Superset", "SSIS"] },
  { id: "methodologies", name: "Methodologies", position: { x: -0.10, y: 0.14 }, technologies: ["Agile/Scrum", "TDD", "BDD"] },
];
