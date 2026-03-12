export interface GraphNode {
  id: string;
  label: string;
  type: "system" | "domain";
  featured?: boolean;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface SystemsGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export const systemsGraph: SystemsGraph = {
  nodes: [
    // Systems
    { id: "mobilet", label: "Mobilet", type: "system", featured: true },
    { id: "villasepeti", label: "VillaSepeti", type: "system", featured: true },
    { id: "magicpags", label: "MagicPags", type: "system", featured: true },
    { id: "decktopus", label: "Decktopus", type: "system" },
    { id: "beforesunset", label: "BeforeSunset", type: "system" },
    { id: "foodservicedirect", label: "FoodServiceDirect", type: "system" },
    { id: "internal-tools", label: "Internal Tools", type: "system" },

    // Domains
    { id: "commerce", label: "Commerce", type: "domain" },
    { id: "distributed-systems", label: "Distributed Systems", type: "domain" },
    { id: "microservices", label: "Microservices", type: "domain" },
    { id: "search-platforms", label: "Search Platforms", type: "domain" },
    { id: "developer-tools", label: "Developer Tools", type: "domain" },
  ],

  edges: [
    // Mobilet
    { source: "mobilet", target: "commerce" },
    { source: "mobilet", target: "distributed-systems" },
    { source: "mobilet", target: "microservices" },

    // VillaSepeti
    { source: "villasepeti", target: "commerce" },
    { source: "villasepeti", target: "microservices" },

    // MagicPags
    { source: "magicpags", target: "developer-tools" },
    { source: "magicpags", target: "microservices" },

    // Decktopus
    { source: "decktopus", target: "developer-tools" },

    // BeforeSunset
    { source: "beforesunset", target: "developer-tools" },

    // FoodServiceDirect
    { source: "foodservicedirect", target: "commerce" },
    { source: "foodservicedirect", target: "distributed-systems" },

    // Internal Tools
    { source: "internal-tools", target: "developer-tools" },
  ],
};
