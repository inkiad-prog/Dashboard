export type Category = "Grains" | "Pulses" | "Oilseeds" | "Energy";

export interface CommodityMeta {
  slug: string;
  label: string;
  category: Category;
  icon: string;
  accent: string; // CSS var name, e.g. "--cat-grains"
}

export const COMMODITIES: CommodityMeta[] = [
  { slug: "wheat", label: "Wheat", category: "Grains", icon: "🌾", accent: "--cat-grains" },
  { slug: "maize", label: "Maize/Corn", category: "Grains", icon: "🌽", accent: "--cat-grains" },
  { slug: "chickpeas", label: "Chickpeas", category: "Pulses", icon: "🧆", accent: "--cat-pulses" },
  { slug: "yellow-peas", label: "Yellow Peas", category: "Pulses", icon: "🟡", accent: "--cat-pulses" },
  { slug: "lentil", label: "Lentil", category: "Pulses", icon: "🔴", accent: "--cat-pulses" },
  { slug: "soybean", label: "Soybean", category: "Oilseeds", icon: "🫘", accent: "--cat-oilseeds" },
  { slug: "canola-seed", label: "Canola Seed", category: "Oilseeds", icon: "🌻", accent: "--cat-oilseeds" },
  { slug: "coal", label: "Coal", category: "Energy", icon: "⚫", accent: "--cat-energy" },
];

export const CATEGORY_ORDER: Category[] = ["Grains", "Pulses", "Oilseeds", "Energy"];

export function getCommodityBySlug(slug: string): CommodityMeta | undefined {
  return COMMODITIES.find((c) => c.slug === slug);
}
