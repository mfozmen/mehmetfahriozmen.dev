export type SystemImportance = "primary" | "secondary" | "minor";

export type SystemNode = {
  id: string;
  name: string;
  url?: string;
  importance: SystemImportance;
  domains: string[];
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

export type OrbitConfig = {
  rx: number;
  ry: number;
  rotation: number;
  opacity: number;
};

export const orbits: OrbitConfig[] = [
  { rx: 0.38, ry: 0.20, rotation: -0.15, opacity: 0.07 },
  { rx: 0.28, ry: 0.15, rotation: -0.10, opacity: 0.06 },
  { rx: 0.18, ry: 0.10, rotation: -0.05, opacity: 0.05 },
];

export const systems: SystemNode[] = [
  // Primary — orbit 0 (outer)
  { id: "mobilet",     name: "Mobilet",          importance: "primary",   angle: 2.8, orbit: 0, domains: ["ecommerce", "payment", "microservices", "distributed"] },
  { id: "shubuo",      name: "Shubuo",           importance: "primary",   angle: 0.4, orbit: 0, domains: ["adtech", "microservices", "distributed"] },
  { id: "villasepeti", name: "VillaSepeti",      importance: "primary",   angle: 3.8, orbit: 0, domains: ["travel", "ecommerce", "microservices"] },
  { id: "ptttrade",    name: "PTT Trade",        importance: "primary",   angle: 4.8, orbit: 0, domains: ["ecommerce", "payment", "distributed"] },

  // Secondary — orbit 1 (middle)
  { id: "beforesunset", name: "BeforeSunset",     importance: "secondary", angle: 1.2, orbit: 1, domains: ["productivity"] },
  { id: "decktopus",    name: "Decktopus",        importance: "secondary", angle: 2.4, orbit: 1, domains: ["productivity"] },
  { id: "magicpags",    name: "MagicPags",        importance: "secondary", angle: 4.0, orbit: 1, domains: ["game", "education"] },
  { id: "room3d",       name: "Room3D",           importance: "secondary", angle: 5.2, orbit: 1, domains: ["online_meeting"] },
  { id: "ihtiyac",      name: "İhtiyaç Haritası", importance: "secondary", angle: 0.1, orbit: 1, domains: ["nonprofit"] },
  { id: "coknet",       name: "Çök Net",          importance: "secondary", angle: 5.8, orbit: 1, domains: ["cms"] },

  // Minor — orbit 2 (inner)
  { id: "fsd",       name: "FoodServiceDirect", importance: "minor", angle: 1.8, orbit: 2, domains: ["ecommerce"] },
  { id: "megatons",  name: "20 Megatons",       importance: "minor", angle: 4.6, orbit: 2, domains: ["game"] },
];

export const domains: DomainNode[] = [
  { id: "distributed",   name: "Distributed Systems", angle: 0.0, orbit: 0, offset: { x: 0.02, y: -0.06 } },
  { id: "ecommerce",     name: "E-Commerce",          angle: 1.6, orbit: 0, offset: { x: -0.04, y: 0.04 } },
  { id: "microservices",  name: "Microservices",       angle: 3.3, orbit: 0, offset: { x: 0.03, y: -0.03 } },
  { id: "payment",        name: "Payment Services",    angle: 4.3, orbit: 0, offset: { x: -0.02, y: 0.05 } },
  { id: "adtech",         name: "AdTech",              angle: 0.8, orbit: 0, offset: { x: 0.06, y: 0.02 } },
  { id: "travel",         name: "Travel",              angle: 3.6, orbit: 0, offset: { x: 0.05, y: 0.04 } },
  { id: "productivity",   name: "Productivity",        angle: 1.8, orbit: 1, offset: { x: 0.04, y: -0.04 } },
  { id: "game",           name: "Game Backends",       angle: 4.3, orbit: 1, offset: { x: -0.03, y: 0.04 } },
  { id: "education",      name: "Education",           angle: 4.8, orbit: 1, offset: { x: 0.05, y: 0.03 } },
  { id: "online_meeting", name: "Online Meeting",      angle: 5.5, orbit: 1, offset: { x: 0.03, y: -0.03 } },
  { id: "nonprofit",      name: "Non-Profit",          angle: 0.5, orbit: 1, offset: { x: -0.04, y: 0.03 } },
  { id: "cms",            name: "CMS",                 angle: 5.4, orbit: 1, offset: { x: 0.05, y: 0.04 } },
  { id: "devops",         name: "DevOps / CI-CD",      angle: 2.8, orbit: 2, offset: { x: -0.03, y: -0.03 } },
  { id: "cloud",          name: "Cloud Services",      angle: 3.2, orbit: 2, offset: { x: 0.04, y: 0.02 } },
  { id: "devtools",       name: "Developer Tools",     angle: 0.6, orbit: 2, offset: { x: -0.04, y: -0.02 } },
];
