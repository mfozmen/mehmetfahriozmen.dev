export interface Project {
  name: string;
  description: string;
  url?: string;
  category: string;
}

export const projects: Project[] = [
  {
    name: "Decktopus",
    description: "AI presentation platform",
    url: "https://www.decktopus.com",
    category: "AI",
  },
  {
    name: "BeforeSunset",
    description: "AI productivity assistant",
    url: "https://www.beforesunset.ai",
    category: "AI",
  },
  {
    name: "VillaSepeti",
    description: "Vacation rental marketplace",
    url: "https://www.villasepeti.com",
    category: "Commerce",
  },
  {
    name: "Mobilet",
    description: "Ticketing platform",
    url: "https://mobilet.com",
    category: "Commerce",
  },
  {
    name: "FoodServiceDirect",
    description: "Large-scale food commerce platform",
    url: "https://www.foodservicedirect.com",
    category: "Commerce",
  },
  {
    name: "MagicPags",
    description: "Content and marketing tools",
    url: "https://www.magicpags.com",
    category: "Tools",
  },
  {
    name: "İhtiyaç Haritası",
    description: "Social impact platform",
    url: "https://sosyalpazaryeri.ihtiyacharitasi.org",
    category: "Social",
  },
  {
    name: "20 Megatons",
    description: "Creative digital platform",
    url: "https://20megatons.com",
    category: "Tools",
  },
  {
    name: "PTT Trade",
    description: "E-commerce marketplace",
    category: "Commerce",
  },
  {
    name: "Peyman Field App",
    description: "Mobile application for field operations",
    category: "Internal",
  },
];
