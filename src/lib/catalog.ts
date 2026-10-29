export type Tier = { id: string; name: string; pieces: number; price: number; blurb: string };

export const TIERS: Tier[] = [
  { id: "sweet", name: "The Sweet Whisper", pieces: 9, price: 19.99, blurb: "A gentle crush" },
  { id: "true", name: "The True Devotion", pieces: 18, price: 34.99, blurb: "Most chosen" },
  { id: "eternal", name: "The Eternal Enchantment", pieces: 32, price: 54.99, blurb: "Hopelessly smitten" },
];

export const STRENGTHS = [
  { id: "flutter", name: "Flutter", desc: "They can't stop thinking of you", price: 7 },
  { id: "swoon", name: "Swoon", desc: "They ache when you leave the room", price: 12 },
  { id: "besotted", name: "Utterly Besotted", desc: "Hopelessly, desperately yours", price: 19 },
];

export const AROMAS = [
  { id: "rose", name: "Wild Rose" },
  { id: "parchment", name: "Fresh Parchment" },
  { id: "treacle", name: "Treacle Tart" },
  { id: "pepper", name: "Peppermint Frost" },
  { id: "amber", name: "Amber & Honey" },
];

export const DURATIONS = [
  { id: "hour", name: "One Night", price: 4 },
  { id: "day", name: "A Full Moon", price: 9 },
  { id: "week", name: "Forever-ish", price: 15 },
];

export function orderTotal(tierId: string, strengthId: string, durationId: string) {
  const t = TIERS.find((x) => x.id === tierId)?.price ?? 0;
  const s = STRENGTHS.find((x) => x.id === strengthId)?.price ?? 0;
  const d = DURATIONS.find((x) => x.id === durationId)?.price ?? 0;
  return Math.round((t + s + d) * 100) / 100;
}

export const HANDWRITTEN = { id: "handwritten", name: "Handwritten Love Note", desc: "Your words, penned in gold ink by our scribes", price: 6.99 };

export const CARDS = [
  { id: "vintage", name: "Vintage Valentine", desc: "Lace-edged, 1940s post style", price: 4.99, emoji: "💌" },
  { id: "rose", name: "Pressed Rose", desc: "A real petal, sealed under wax", price: 5.99, emoji: "🌹" },
  { id: "singing", name: "Singing Envelope", desc: "Sings your confession when opened", price: 8.99, emoji: "🎶" },
];

export function addonsTotal(handwritten: boolean, cardId: string | null) {
  const c = CARDS.find((x) => x.id === cardId)?.price ?? 0;
  return Math.round(((handwritten ? HANDWRITTEN.price : 0) + c) * 100) / 100;
}
