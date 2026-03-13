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
  angle: number;
  technologies: string[];
};

export type OrbitConfig = {
  rx: number;
  ry: number;
  rotation: number;
  opacity: number;
};

export const orbits: OrbitConfig[] = [
  { rx: 0.42, ry: 0.38, rotation: -0.12, opacity: 0.07 },
  { rx: 0.30, ry: 0.26, rotation: -0.08, opacity: 0.06 },
  { rx: 0.22, ry: 0.18, rotation: -0.05, opacity: 0.04 },
  { rx: 0.13, ry: 0.11, rotation: -0.02, opacity: 0.03 },
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
    techClusters: ["backend", "databases", "cloud", "devops", "architecture"],
    url: "https://www.mobilet.com",
  },
  {
    id: "shubuo",
    name: "Shubuo",
    importance: "primary",
    angle: 1.55,
    orbit: 0,
    domains: ["adtech", "distributed"],
    techClusters: ["backend", "databases", "cloud", "architecture"],
  },
  {
    id: "villasepeti",
    name: "VillaSepeti",
    importance: "primary",
    angle: 2.6,
    orbit: 0,
    domains: ["ecommerce", "distributed"],
    techClusters: ["backend", "databases", "cloud"],
    url: "https://www.villasepeti.com",
  },
  {
    id: "ptttrade",
    name: "PTT Trade",
    importance: "primary",
    angle: 3.65,
    orbit: 0,
    domains: ["ecommerce"],
    techClusters: ["backend", "databases"],
  },
  {
    id: "beforesunset",
    name: "BeforeSunset",
    importance: "primary",
    angle: 4.7,
    orbit: 0,
    domains: ["productivity"],
    techClusters: ["backend", "cloud"],
    url: "https://www.beforesunset.ai",
  },
  {
    id: "decktopus",
    name: "Decktopus",
    importance: "primary",
    angle: 5.75,
    orbit: 0,
    domains: ["productivity"],
    techClusters: ["backend", "cloud"],
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
    techClusters: ["backend", "databases"],
  },
  {
    id: "room3d",
    name: "Room3D",
    importance: "secondary",
    angle: 2.2,
    orbit: 1,
    domains: ["realtime"],
    techClusters: ["backend", "cloud"],
  },
  {
    id: "ihtiyac",
    name: "İhtiyaç Haritası",
    importance: "secondary",
    angle: 4.1,
    orbit: 1,
    domains: ["social"],
    techClusters: ["backend"],
  },
  {
    id: "coknet",
    name: "Çok Net",
    importance: "secondary",
    angle: 5.4,
    orbit: 1,
    domains: ["education"],
    techClusters: ["backend"],
  },

  // Minor — orbit 2, opposite sides
  {
    id: "fsd",
    name: "FoodServiceDirect",
    importance: "minor",
    angle: 1.2,
    orbit: 2,
    domains: ["ecommerce"],
    techClusters: ["backend", "databases"],
  },
  {
    id: "megatons",
    name: "20 Megatons",
    importance: "minor",
    angle: 4.4,
    orbit: 2,
    domains: ["social"],
    techClusters: ["backend"],
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
    offset: { x: 0.08, y: -0.06 },
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
    offset: { x: -0.06, y: -0.07 },
  },
  {
    id: "education",
    name: "Education",
    angle: 0.2,
    orbit: 1,
    offset: { x: 0.07, y: -0.06 },
  },
  {
    id: "social",
    name: "Social Platforms",
    angle: 4.0,
    orbit: 1,
    offset: { x: -0.07, y: 0.06 },
  },
  {
    id: "realtime",
    name: "Real-time Collaboration",
    angle: 2.5,
    orbit: 1,
    offset: { x: 0.06, y: -0.07 },
  },
];

export const techClusters: TechClusterNode[] = [
  {
    id: "backend",
    name: "Backend",
    angle: 0.0,
    technologies: ["Node.js", "NestJS", ".NET", "Java", "PHP", "Go"],
  },
  {
    id: "databases",
    name: "Databases",
    angle: 1.26,
    technologies: ["PostgreSQL", "MySQL", "MSSQL", "Redis", "Couchbase", "Elasticsearch"],
  },
  {
    id: "cloud",
    name: "Cloud",
    angle: 2.51,
    technologies: ["AWS", "Azure", "DigitalOcean", "Docker", "Kubernetes"],
  },
  {
    id: "devops",
    name: "DevOps",
    angle: 3.77,
    technologies: ["CircleCI", "Bitbucket Pipelines", "GitHub Actions"],
  },
  {
    id: "architecture",
    name: "Architecture",
    angle: 5.03,
    technologies: ["Event-Driven", "GraphQL", "REST", "CQRS", "Hasura", "Directus"],
  },
];
