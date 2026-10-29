export type Tier = { id: string; name: string; pieces: number; price: number; blurb: string };

export const TIERS: Tier[] = [
  { id: "sweet", name: "The Sweet Whisper", pieces: 9, price: 19.99, blurb: "A gentle crush" },
  { id: "true", name: "The True Devotion", pieces: 18, price: 34.99, blurb: "Most chosen" },
  { id: "eternal", name: "The Eternal Enchantment", pieces: 32, price: 54.99, blurb: "Hopelessly smitten" },
];

export const STRENGTHS = [
  { id: "flutter", name: "Flutter", desc: "Lingering glances, soft blushes", price: 0 },
  { id: "swoon", name: "Swoon", desc: "Poetry-writing levels of fondness", price: 5 },
  { id: "besotted", name: "Utterly Besotted", desc: "Ron-on-his-birthday intensity", price: 10 },
];

export const AROMAS = [
  { id: "rose", name: "Wild Rose" },
  { id: "parchment", name: "Fresh Parchment" },
  { id: "treacle", name: "Treacle Tart" },
  { id: "pepper", name: "Peppermint Frost" },
  { id: "amber", name: "Amber & Honey" },
];

export const DURATIONS = [
  { id: "hour", name: "One Hour", price: 0 },
  { id: "day", name: "A Full Day", price: 3 },
  { id: "week", name: "A Fortnight", price: 8 },
];

export function orderTotal(tierId: string, strengthId: string, durationId: string) {
  const t = TIERS.find((x) => x.id === tierId)?.price ?? 0;
  const s = STRENGTHS.find((x) => x.id === strengthId)?.price ?? 0;
  const d = DURATIONS.find((x) => x.id === durationId)?.price ?? 0;
  return Math.round((t + s + d) * 100) / 100;
}
