export type ProjectImportance = "primary" | "secondary" | "minor";

export type Project = {
  id: string;
  name: string;
  url?: string;
  description?: string;
  highlights?: string[];
  importance: ProjectImportance;
  domains: string[];
  technologyCategories: string[];
};

export const projects: Project[] = [
  // Primary
  {
    id: "mobilet",
    name: "Mobilet",
    url: "https://www.mobilet.com",
    description:
      "Event ticketing platform with campaign engine, QR gate entry, and multi-channel payment processing serving millions",
    highlights: [
      "80K tickets/hour peak capacity",
      "Custom dynamic campaign engine",
      "Multi-channel payment integration",
    ],
    importance: "primary",
    domains: ["ecommerce", "distributed"],
    technologyCategories: [
      "databases",
      "search",
      "cloud",
      "devops",
      "api",
      "architecture",
      "frameworks",
      "monitoring",
      "data_analysis",
      "methodologies",
    ],
  },
  {
    id: "shubuo",
    name: "Shubuo",
    description:
      "Digital advertising platform with intelligent ad scheduling that optimizes delivery against contracts in real-time",
    highlights: [
      "Smart schedule-based ad delivery",
      "Contract-aware pacing algorithm",
      "Real-time campaign optimization",
    ],
    importance: "primary",
    domains: ["adtech", "distributed"],
    technologyCategories: [
      "databases",
      "cloud",
      "devops",
      "api",
      "architecture",
      "frameworks",
      "methodologies",
    ],
  },
  {
    id: "villasepeti",
    name: "VillaSepeti",
    url: "https://www.villasepeti.com",
    description:
      "Vacation rental marketplace where complex manual filtering rules were transformed into an automated, intelligent search system",
    highlights: [
      "5K+ properties with rule-based availability",
      "Search engine powered by set theory — replacing human decision-making with algorithmic rule matching",
      "Automated filtering replacing manual processes",
    ],
    importance: "primary",
    domains: ["ecommerce", "distributed"],
    technologyCategories: [
      "databases",
      "search",
      "cloud",
      "devops",
      "api",
      "architecture",
      "messaging",
      "frameworks",
      "methodologies",
    ],
  },
  {
    id: "magicpags",
    name: "MagicPags",
    url: "https://www.magicpags.com/",
    description:
      "Educational platform teaching kids to read — with real-time analytics tracking dozens of in-app learning events across schools",
    highlights: [
      "Event-driven analytics pipeline for learning insights",
      "Child-safe content delivery with privacy constraints",
      "ETL-powered reporting across schools",
    ],
    importance: "primary",
    domains: ["education", "distributed"],
    technologyCategories: [
      "databases",
      "search",
      "cloud",
      "devops",
      "api",
      "architecture",
      "messaging",
      "frameworks",
      "monitoring",
      "data_analysis",
      "methodologies",
    ],
  },
  {
    id: "beforesunset",
    name: "BeforeSunset AI",
    url: "https://www.beforesunset.ai",
    description:
      "Productivity assistant built from the ground up — backend architecture designed and implemented from scratch",
    highlights: [
      "Backend architecture built from zero",
      "Task planning and scheduling engine",
      "Intelligent calendar optimization",
    ],
    importance: "primary",
    domains: ["productivity"],
    technologyCategories: [
      "databases",
      "cloud",
      "devops",
      "api",
      "architecture",
      "methodologies",
    ],
  },
  {
    id: "decktopus",
    name: "Decktopus AI",
    url: "https://www.decktopus.com",
    description:
      "Presentation platform with serverless architecture, real-time subscriptions, and event-driven workflows",
    highlights: [
      "Event-driven serverless architecture",
      "GraphQL, API and real-time GraphQL subscriptions",
      "Containerized function orchestration",
    ],
    importance: "primary",
    domains: ["productivity"],
    technologyCategories: [
      "databases",
      "cloud",
      "devops",
      "api",
      "architecture",
      "methodologies",
    ],
  },
  // Secondary
  {
    id: "ptttrade",
    name: "PTT Trade",
    description: "E-commerce marketplace",
    importance: "secondary",
    domains: ["ecommerce"],
    technologyCategories: [
      "databases",
      "search",
      "cloud",
      "devops",
      "api",
      "architecture",
      "frameworks",
    ],
  },
  {
    id: "room3d",
    name: "Room3D",
    url: "https://room3d.net/",
    importance: "secondary",
    domains: ["realtime"],
    technologyCategories: [
      "databases",
      "cloud",
      "devops",
      "api",
      "architecture",
      "methodologies",
    ],
  },
  {
    id: "ihtiyac",
    name: "İhtiyaç Haritası",
    url: "https://sosyalpazaryeri.ihtiyacharitasi.org/",
    description: "Social impact platform",
    importance: "secondary",
    domains: ["nonprofit"],
    technologyCategories: [
      "databases",
      "cloud",
      "devops",
      "api",
      "architecture",
      "methodologies",
    ],
  },
  {
    id: "coknet",
    name: "Çok Net",
    url: "https://app.cok.net.tr/",
    importance: "secondary",
    domains: ["education"],
    technologyCategories: [
      "databases",
      "search",
      "cloud",
      "devops",
      "api",
      "architecture",
      "frameworks",
      "methodologies",
    ],
  },
  // Minor
  {
    id: "fsd",
    name: "FoodServiceDirect",
    description: "Large-scale food commerce platform",
    importance: "minor",
    domains: ["ecommerce"],
    technologyCategories: [
      "databases",
      "search",
      "cloud",
      "api",
      "architecture",
      "frameworks",
      "methodologies",
    ],
  },
  {
    id: "megatons",
    name: "20 Megatons",
    importance: "minor",
    domains: ["nonprofit"],
    technologyCategories: [
      "databases",
      "cloud",
      "devops",
      "api",
      "architecture",
      "methodologies",
    ],
  },
];
