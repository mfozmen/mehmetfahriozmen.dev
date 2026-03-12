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
  { rx: 0.42, ry: 0.38, rotation: -0.12, opacity: 0.07 },
  { rx: 0.30, ry: 0.26, rotation: -0.08, opacity: 0.06 },
  { rx: 0.16, ry: 0.13, rotation: -0.04, opacity: 0.05 },
];

export const systems: SystemNode[] = [
  // Primary — orbit 0 (outer), ~90° apart
  { id: "mobilet",     name: "Mobilet",          importance: "primary",   angle: 0.8, orbit: 0, domains: ["ecommerce", "payment", "microservices", "distributed"] },
  { id: "shubuo",      name: "Shubuo",           importance: "primary",   angle: 2.4, orbit: 0, domains: ["adtech", "microservices", "distributed"] },
  { id: "villasepeti", name: "VillaSepeti",      importance: "primary",   angle: 3.9, orbit: 0, domains: ["travel", "ecommerce", "microservices"] },
  { id: "ptttrade",    name: "PTT Trade",        importance: "primary",   angle: 5.4, orbit: 0, domains: ["ecommerce", "payment", "distributed"] },

  // Secondary — orbit 1 (middle), ~60° apart
  { id: "ihtiyac",      name: "İhtiyaç Haritası", importance: "secondary", angle: 0.3,  orbit: 1, domains: ["nonprofit"] },
  { id: "beforesunset", name: "BeforeSunset",      importance: "secondary", angle: 1.35, orbit: 1, domains: ["productivity"] },
  { id: "decktopus",    name: "Decktopus",         importance: "secondary", angle: 2.4,  orbit: 1, domains: ["productivity"] },
  { id: "magicpags",    name: "MagicPags",         importance: "secondary", angle: 3.45, orbit: 1, domains: ["game", "education"] },
  { id: "room3d",       name: "Room3D",            importance: "secondary", angle: 4.5,  orbit: 1, domains: ["online_meeting"] },
  { id: "coknet",       name: "Çök Net",           importance: "secondary", angle: 5.55, orbit: 1, domains: ["cms"] },

  // Minor — orbit 2 (inner), opposite sides
  { id: "fsd",       name: "FoodServiceDirect", importance: "minor", angle: 1.2, orbit: 2, domains: ["ecommerce"] },
  { id: "megatons",  name: "20 Megatons",       importance: "minor", angle: 4.4, orbit: 2, domains: ["game"] },
];

export const domains: DomainNode[] = [
  // Outer orbit domains — pushed outside orbit 0
  { id: "distributed",   name: "Distributed Systems", angle: 0.5,  orbit: 0, offset: { x: 0.07, y: -0.08 } },
  { id: "ecommerce",     name: "E-Commerce",          angle: 2.0,  orbit: 0, offset: { x: -0.08, y: 0.07 } },
  { id: "microservices",  name: "Microservices",       angle: 3.0,  orbit: 0, offset: { x: 0.06, y: -0.07 } },
  { id: "payment",        name: "Payment Services",    angle: 4.5,  orbit: 0, offset: { x: -0.06, y: 0.08 } },
  { id: "adtech",         name: "AdTech",              angle: 1.2,  orbit: 0, offset: { x: 0.08, y: 0.05 } },
  { id: "travel",         name: "Travel",              angle: 5.0,  orbit: 0, offset: { x: 0.07, y: 0.06 } },

  // Middle orbit domains — between orbit 0 and orbit 1
  { id: "productivity",   name: "Productivity",        angle: 1.8,  orbit: 1, offset: { x: 0.07, y: -0.06 } },
  { id: "game",           name: "Game Backends",       angle: 3.8,  orbit: 1, offset: { x: -0.06, y: 0.07 } },
  { id: "education",      name: "Education",           angle: 4.3,  orbit: 1, offset: { x: 0.08, y: 0.05 } },
  { id: "online_meeting", name: "Online Meeting",      angle: 5.0,  orbit: 1, offset: { x: 0.06, y: -0.05 } },
  { id: "nonprofit",      name: "Non-Profit",          angle: 0.8,  orbit: 1, offset: { x: -0.07, y: 0.06 } },
  { id: "cms",            name: "CMS",                 angle: 5.8,  orbit: 1, offset: { x: 0.07, y: 0.05 } },

  // Inner orbit domains — between orbit 1 and orbit 2
  { id: "devops",         name: "DevOps / CI-CD",      angle: 2.5,  orbit: 2, offset: { x: -0.06, y: -0.05 } },
  { id: "cloud",          name: "Cloud Services",      angle: 3.8,  orbit: 2, offset: { x: 0.07, y: 0.04 } },
  { id: "devtools",       name: "Developer Tools",     angle: 0.8,  orbit: 2, offset: { x: -0.06, y: -0.04 } },
];
