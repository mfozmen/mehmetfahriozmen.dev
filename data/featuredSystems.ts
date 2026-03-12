export interface FeaturedSystem {
  id: string;
  title: string;
  subtitle: string;
  bullets: string[];
}

export const featuredSystems: FeaturedSystem[] = [
  {
    id: "mobilet",
    title: "Mobilet",
    subtitle: "Ticketing Platform",
    bullets: [
      "Scalable infrastructure",
      "Payment flows",
      "Large-scale ticketing operations",
    ],
  },
  {
    id: "villasepeti",
    title: "VillaSepeti",
    subtitle: "Travel & Booking Engine",
    bullets: [
      "E-commerce engine",
      "Holiday villa inventory",
      "High volume booking backend",
    ],
  },
  {
    id: "magicpags",
    title: "MagicPags",
    subtitle: "Educational mobile platform for kids",
    bullets: [
      "Interactive games",
      "Audio story platform",
      "Backend infrastructure",
    ],
  },
];
