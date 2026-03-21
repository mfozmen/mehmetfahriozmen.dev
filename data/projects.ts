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
    description: "Event ticketing platform with CMS, campaign engine, QR gate entry, and scalable payment infrastructure serving millions",
    highlights: ["80K tickets/hour peak capacity", "Dynamic campaign engine", "Microservices on K8s with multi-POS integration"],
    importance: "primary",
    domains: ["ecommerce", "distributed"],
    technologyCategories: ["databases", "search", "cloud", "devops", "api", "architecture", "frameworks", "monitoring", "data_analysis", "methodologies"],
  },
  {
    id: "shubuo",
    name: "Shubuo",
    description: "Digital advertising platform with smart ad scheduling that optimizes campaign delivery against contracts throughout the day",
    highlights: ["Smart ad scheduling engine", "Contract-based delivery optimization", "Real-time campaign pacing"],
    importance: "primary",
    domains: ["adtech", "distributed"],
    technologyCategories: ["databases", "cloud", "devops", "api", "architecture", "frameworks", "methodologies"],
  },
  {
    id: "villasepeti",
    name: "VillaSepeti",
    url: "https://www.villasepeti.com",
    description: "Vacation rental marketplace with intelligent search — complex manual filtering rules transformed into automated Elasticsearch indexing",
    highlights: ["5K+ properties with advanced search", "Complex rule-based availability indexing", "Elasticsearch-powered filtering"],
    importance: "primary",
    domains: ["ecommerce", "distributed"],
    technologyCategories: ["databases", "search", "cloud", "devops", "api", "architecture", "messaging", "frameworks", "methodologies"],
  },
  {
    id: "magicpags",
    name: "MagicPags",
    url: "https://www.magicpags.com/",
    description: "Educational platform teaching kids to read through interactive Unity games and audio storytelling, powered by a custom backend",
    highlights: ["Audio storytelling engine for kids", "Unity game backend integration", "Child-safe content delivery"],
    importance: "primary",
    domains: ["education"],
    technologyCategories: ["databases", "search", "cloud", "devops", "api", "architecture", "messaging", "frameworks", "monitoring", "data_analysis", "methodologies"],
  },
  {
    id: "beforesunset",
    name: "BeforeSunset AI",
    url: "https://www.beforesunset.ai",
    description: "AI-powered productivity assistant with intelligent task planning and calendar optimization",
    highlights: ["AI-powered task planning", "Calendar optimization engine", "Intelligent scheduling"],
    importance: "primary",
    domains: ["productivity"],
    technologyCategories: ["databases", "cloud", "devops", "api", "architecture", "methodologies"],
  },
  {
    id: "decktopus",
    name: "Decktopus AI",
    url: "https://www.decktopus.com",
    description: "AI presentation platform with automated content generation and template engine",
    highlights: ["AI content generation", "Template rendering engine", "Real-time collaboration"],
    importance: "primary",
    domains: ["productivity"],
    technologyCategories: ["databases", "cloud", "devops", "api", "architecture", "methodologies"],
  },
  // Secondary
  {
    id: "ptttrade",
    name: "PTT Trade",
    description: "E-commerce marketplace",
    importance: "secondary",
    domains: ["ecommerce"],
    technologyCategories: ["databases", "search", "cloud", "devops", "api", "architecture", "frameworks"],
  },
  {
    id: "room3d",
    name: "Room3D",
    url: "https://room3d.net/",
    importance: "secondary",
    domains: ["realtime"],
    technologyCategories: ["databases", "cloud", "devops", "api", "architecture", "methodologies"],
  },
  {
    id: "ihtiyac",
    name: "İhtiyaç Haritası",
    url: "https://sosyalpazaryeri.ihtiyacharitasi.org/",
    description: "Social impact platform",
    importance: "secondary",
    domains: ["nonprofit"],
    technologyCategories: ["databases", "cloud", "devops", "api", "architecture", "methodologies"],
  },
  {
    id: "coknet",
    name: "Çok Net",
    url: "https://app.cok.net.tr/",
    importance: "secondary",
    domains: ["education"],
    technologyCategories: ["databases", "search", "cloud", "devops", "api", "architecture", "frameworks", "methodologies"],
  },
  // Minor
  {
    id: "fsd",
    name: "FoodServiceDirect",
    description: "Large-scale food commerce platform",
    importance: "minor",
    domains: ["ecommerce"],
    technologyCategories: ["databases", "search", "cloud", "api", "architecture", "frameworks", "methodologies"],
  },
  {
    id: "megatons",
    name: "20 Megatons",
    importance: "minor",
    domains: ["nonprofit"],
    technologyCategories: ["databases", "cloud", "devops", "api", "architecture", "methodologies"],
  },
];
