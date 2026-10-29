export type Tier = { id: string; name: string; pieces: number; price: number; blurb: string };

export const TIERS: Tier[] = [
  { id: "sweet", name: "The Sweet Whisper", pieces: 9, price: 19.99, blurb: "A gentle crush" },
  { id: "true", name: "The True Devotion", pieces: 18, price: 34.99, blurb: "Most chosen" },
  { id: "eternal", name: "The Eternal Enchantment", pieces: 32, price: 54.99, blurb: "Hopelessly smitten" },
  { id: "vault", name: "The Obsession Vault", pieces: 48, price: 79.99, blurb: "No one else will do" },
  { id: "grand", name: "The Grand Amortentia", pieces: 72, price: 119.99, blurb: "Love beyond reason" },
];

// Limited-edition seasonal boxes (proposed prices, unconfirmed).
export const SEASONAL: Tier[] = [
  { id: "spooky", name: "The Spooky Crush", pieces: 16, price: 34.99, blurb: "Halloween only · scary how much you like them" },
  { id: "valentine", name: "The Heartbreaker", pieces: 24, price: 44.99, blurb: "Valentine's only · for when Feb 14 hurts" },
  { id: "galentine", name: "The Galentine's Gossip", pieces: 20, price: 29.99, blurb: "Galentine's only · love your besties loudly" },
  { id: "revenge", name: "The Revenge Ex Edition", pieces: 18, price: 39.99, blurb: "Limited · make them regret everything" },
  { id: "christmas", name: "The Mistletoe Spell", pieces: 24, price: 44.99, blurb: "Christmas · suddenly, mistletoe everywhere" },
  { id: "newyear", name: "The Midnight Kiss", pieces: 24, price: 44.99, blurb: "New Year · one resolution: kiss you" },
  { id: "thanksgiving", name: "The Grateful Heart", pieces: 20, price: 34.99, blurb: "Thanksgiving · thankful you exist, frankly" },
  { id: "birthday", name: "The Birthday Wish", pieces: 18, price: 34.99, blurb: "Birthday · you were the wish all along" },
];
export const ALL_BOXES: Tier[] = [...TIERS, ...SEASONAL];

// Funny gauge that rises with the order total.
export const DESPERATION = [
  { min: 0, label: "Mildly Hopeful", icon: "moon" },
  { min: 60, label: "Lovesick", icon: "heart" },
  { min: 120, label: "Hopelessly Devoted", icon: "flame" },
  { min: 220, label: "Writing Their Name in Notebooks", icon: "quill" },
  { min: 350, label: "Unhinged Romantic", icon: "sparkles" },
];
export function desperationLevel(total: number) {
  return [...DESPERATION].reverse().find((d) => total >= d.min)!;
}

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
  const t = ALL_BOXES.find((x) => x.id === tierId)?.price ?? 0;
  const s = STRENGTHS.find((x) => x.id === strengthId)?.price ?? 0;
  const d = DURATIONS.find((x) => x.id === durationId)?.price ?? 0;
  return Math.round((t + s + d) * 100) / 100;
}

export const HANDWRITTEN = { id: "handwritten", name: "Handwritten Love Note", desc: "Your words, penned in gold ink by our scribes", price: 6.99 };

export const CARDS = [
  { id: "vintage", name: "Vintage Valentine", desc: "Lace-edged, 1940s post style", price: 4.99, icon: "envelope" },
  { id: "singing", name: "Singing Envelope", desc: "Sings your confession when opened", price: 8.99, icon: "music" },
];

export function addonsTotal(handwritten: boolean, cardId: string | null) {
  const c = CARDS.find((x) => x.id === cardId)?.price ?? 0;
  return Math.round(((handwritten ? HANDWRITTEN.price : 0) + c) * 100) / 100;
}

// ---------- The Potion Cabinet: 100 potions, 10 essences, blend synergies ----------
export type Rarity = "common" | "rare" | "legendary";
export const RARITY_PRICE: Record<Rarity, number> = { common: 3.99, rare: 6.99, legendary: 11.99 };
export const MAX_BLEND = 5;

export const ESSENCES = [
  { id: "ember", name: "Passion", icon: "flame", adj: "Smoldering", noun: "Desire", effect: "their pulse races when you walk in" },
  { id: "rose", name: "Tenderness", icon: "rose", adj: "Tender", noun: "Affection", effect: "they long to hold your hand" },
  { id: "moon", name: "Longing", icon: "moon", adj: "Aching", noun: "Yearning", effect: "they miss you the moment you leave" },
  { id: "star", name: "Destiny", icon: "star", adj: "Fated", noun: "Destiny", effect: "they swear you were meant to meet" },
  { id: "thorn", name: "Obsession", icon: "thorn", adj: "Consuming", noun: "Obsession", effect: "you are all they can think about" },
  { id: "honey", name: "Devotion", icon: "honey", adj: "Devoted", noun: "Devotion", effect: "they'd cross oceans for you" },
  { id: "mist", name: "Mystery", icon: "mist", adj: "Enchanted", noun: "Intrigue", effect: "they can't stop wondering about you" },
  { id: "storm", name: "Courage", icon: "bolt", adj: "Fearless", noun: "Confession", effect: "they find the nerve to say it first" },
  { id: "bloom", name: "Euphoria", icon: "bloom", adj: "Giddy", noun: "Bliss", effect: "they smile like a fool around you" },
  { id: "frost", name: "Rekindling", icon: "snowflake", adj: "Rekindled", noun: "Second Chance", effect: "old feelings thaw and return" },
] as const;
export type EssenceId = (typeof ESSENCES)[number]["id"];

const NAMES: Record<EssenceId, string[]> = {
  ember: ["Dragon's Blush", "Ember Kiss", "Scarlet Fever", "Phoenix Tear", "Cinder Heart", "Flame Draught", "Blazing Glance", "Hearthfire Tonic", "Molten Sigh", "Salamander's Vow"],
  rose: ["Rosewater Whisper", "Velvet Petal", "Blushing Bud", "Gentle Thorn", "Dewdrop Caress", "Petal Promise", "Soft Embrace", "Pink Mist Elixir", "Cradle Tonic", "Queen Rose Nectar"],
  moon: ["Moonmilk", "Midnight Pining", "Silver Ache", "Lunar Lament", "Eclipse Draught", "Dusk Longing", "Tidal Pull", "Owl's Lullaby", "Crescent Sigh", "Blood Moon Elixir"],
  star: ["Stardust Draught", "Comet's Promise", "Fate Thread", "Constellation Kiss", "Wishing Well Water", "Astral Vow", "Northern Star", "Celestial Sip", "Oracle's Drop", "Destiny's Crown"],
  thorn: ["Thornheart", "Nightshade Crush", "Raven's Fixation", "Ivy Grip", "Obsidian Gaze", "Bramble Bind", "Shadow Fever", "Hollow Hunger", "Serpent Coil", "The Unforgettable"],
  honey: ["Honeyed Oath", "Golden Loyalty", "Hearth Promise", "Amber Bond", "Beeswax Vow", "Sunlit Devotion", "Steadfast Draught", "Knight's Pledge", "Twin Flame Honey", "Eternal Oath"],
  mist: ["Fogbound Allure", "Veiled Glance", "Riddle Tonic", "Smoke & Mirrors", "Hidden Door", "Whisper Fog", "Masquerade Drop", "Sphinx Draught", "Twilight Secret", "The Enigma"],
  storm: ["Thunder Courage", "Lightning Confession", "Bold Gale", "Tempest Draught", "Lionheart Tonic", "Spark of Nerve", "Rumbling Vow", "Gale Kiss", "Brave Heart Brew", "Storm King's Roar"],
  bloom: ["Giggle Water", "Butterfly Flutter", "Sunshine Swoon", "Peony Pop", "Cloud Nine", "Fizzing Crush", "Daydream Dew", "Bubblegum Bliss", "Meadow Glee", "Everbloom"],
  frost: ["Thawing Heart", "Frostbite Forgiven", "Winter Return", "Icicle Memory", "First Snow", "Glacier Melt", "Old Flame Thaw", "Hoarfrost Hope", "Snowglobe Wish", "Spring After Winter"],
};

export type Potion = { id: string; name: string; essence: EssenceId; rarity: Rarity; price: number };
export const POTIONS: Potion[] = ESSENCES.flatMap((e) =>
  NAMES[e.id].map((name, i) => {
    const rarity: Rarity = i === 9 ? "legendary" : i >= 6 ? "rare" : "common";
    return { id: `${e.id}-${i + 1}`, name, essence: e.id, rarity, price: RARITY_PRICE[rarity] };
  }),
);

const SYNERGIES: Record<string, { name: string; desc: string }> = {
  "ember+thorn": { name: "Wildfire Obsession", desc: "A love that burns and won't let go. They will chase you." },
  "moon+star": { name: "Written in the Stars", desc: "They'll believe the universe sent you, and wait for you forever." },
  "frost+rose": { name: "Second First Kiss", desc: "An old love returns softer than before." },
  "honey+star": { name: "Soulmate Bond", desc: "They'll know, deep down, you're the one." },
  "ember+mist": { name: "Forbidden Spark", desc: "Secret glances. Stolen moments. Irresistible." },
  "rose+storm": { name: "Brave Confession", desc: "They'll be the one to confess first, sweetly." },
  "bloom+ember": { name: "Giddy Infatuation", desc: "Butterflies so strong they blush when they hear your name." },
  "mist+thorn": { name: "Haunted Heart", desc: "You'll linger in their dreams night after night." },
  "honey+rose": { name: "Forever Sweetheart", desc: "Breakfast in bed, forehead kisses, a lifetime of tenderness." },
  "frost+moon": { name: "The One Who Came Back", desc: "They realize they never stopped missing you." },
  "bloom+star": { name: "Fairytale Ending", desc: "They'll start planning a future with you in it." },
  "storm+thorn": { name: "Grand Gesture", desc: "Expect serenades, roses at the door, and a public declaration." },
  "honey+moon": { name: "Faithful Moon", desc: "Distance won't matter; they will always come home to you." },
};

export type Outcome = { name: string; desc: string; essences: EssenceId[] };

export function blendOutcome(potionIds: string[]): Outcome | null {
  const ps = potionIds.map((id) => POTIONS.find((p) => p.id === id)).filter((p): p is Potion => !!p);
  if (!ps.length) return null;
  const order = ESSENCES.map((e) => e.id) as EssenceId[];
  const counts = new Map<EssenceId, number>();
  ps.forEach((p) => counts.set(p.essence, (counts.get(p.essence) ?? 0) + 1));
  const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1] || order.indexOf(a[0]) - order.indexOf(b[0])).map((x) => x[0]);
  const legendary = ps.some((p) => p.rarity === "legendary") ? "Legendary " : "";
  const E = (id: EssenceId) => ESSENCES.find((e) => e.id === id)!;
  const [a, b] = ranked as [EssenceId, EssenceId | undefined];

  if (!b) {
    const pure = (counts.get(a) ?? 0) >= 2;
    return { name: `${legendary}${pure ? "Overflowing" : "Pure"} ${E(a).noun}`, desc: `${cap(E(a).effect)}${pure ? ", twice as strong" : ""}.`, essences: [a] };
  }
  const key = [a, b].sort().join("+");
  const syn = SYNERGIES[key];
  if (syn) return { name: legendary + syn.name, desc: syn.desc, essences: ranked };
  return { name: `${legendary}${E(a).adj} ${E(b).noun}`, desc: `${cap(E(a).effect)}, and ${E(b).effect}.`, essences: ranked };
}

export function potionsTotal(potionIds: string[]) {
  return Math.round(potionIds.reduce((s, id) => s + (POTIONS.find((p) => p.id === id)?.price ?? 0), 0) * 100) / 100;
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------- Upgrades: packaging, delivery, keepsakes ----------
export const PACKAGING = [
  { id: "kraft", name: "Vintage Kraft Parcel", desc: "Twine and a red wax seal", price: 0, icon: "box" },
  { id: "velvet", name: "Crimson Velvet Heart", desc: "Soft velvet they'll keep forever", price: 9.99, icon: "velvet" },
  { id: "music", name: "Enchanted Music Box Heart", desc: "Plays a waltz the moment they lift the lid", price: 39.99, icon: "music" },
];

export const DELIVERY = [
  { id: "owl", name: "Standard Owl", desc: "Arrives in 3–5 days", price: 0, icon: "owl" },
  { id: "express", name: "Express Owl", desc: "Tomorrow. Free on orders over $99", price: 14.99, icon: "wind" },
  { id: "courier", name: "Hand-Delivered by Courier", desc: "Handed over in person, with a bow", price: 49.99, icon: "hat" },
];

export const KEEPSAKES = [
  { id: "seal", name: "Monogram Wax Seal", desc: "Your initial, pressed in gold wax", price: 2.99, icon: "seal" },
  { id: "vial", name: "Keepsake Potion Vial", desc: "A glowing vial of your blend to keep", price: 12.99, icon: "vial" },
  { id: "plush", name: "Messenger Owl Plush", desc: "Something to hold when you're not there", price: 18.99, icon: "plush" },
  { id: "bouquet", name: "Dozen Red Roses", desc: "Delivered alongside the box", price: 29.99, icon: "bouquet" },
];

export const ANTIDOTE = { id: "antidote", name: "Antidote Guarantee", desc: "If they don't swoon, we re-brew a fresh box free", price: 7.99 };

// Honest perk: Express Owl is free once the rest of the order reaches this amount.
export const FREE_EXPRESS_OVER = 99;

export function upgradesTotal(packagingId: string, deliveryId: string, keepsakeIds: string[], antidote: boolean) {
  const p = PACKAGING.find((x) => x.id === packagingId)?.price ?? 0;
  const d = DELIVERY.find((x) => x.id === deliveryId)?.price ?? 0;
  const k = keepsakeIds.reduce((s, id) => s + (KEEPSAKES.find((x) => x.id === id)?.price ?? 0), 0);
  return Math.round((p + d + k + (antidote ? ANTIDOTE.price : 0)) * 100) / 100;
}

// Spell bundles: one tap picks several extras; when every item in a bundle is chosen, the saving applies.
export type Extras = { handwritten: boolean; card: string | null; keepsakes: string[]; packaging: string };
export type SpellBundle = { id: string; name: string; desc: string; save: number; pick: { handwritten: boolean; card: string; keepsakes: readonly string[]; packaging?: string } };
export const BUNDLES: SpellBundle[] = [
  { id: "charm", name: "The Little Charm", desc: "Handwritten note + Vintage Valentine card + wax seal", save: 2,
    pick: { handwritten: true, card: "vintage", keepsakes: ["seal"] } },
  { id: "spell", name: "The Full Love Spell", desc: "Note + Singing Envelope + potion vial + owl plush + velvet heart", save: 10,
    pick: { handwritten: true, card: "singing", keepsakes: ["vial", "plush"], packaging: "velvet" } },
  { id: "wish", name: "The Bottled Confession", desc: "Note + Vintage Valentine + keepsake potion vial + wax seal", save: 4,
    pick: { handwritten: true, card: "vintage", keepsakes: ["vial", "seal"] } },
  { id: "romance", name: "The Grand Gesture", desc: "Note + Vintage Valentine + dozen roses + velvet heart", save: 7,
    pick: { handwritten: true, card: "vintage", keepsakes: ["bouquet"], packaging: "velvet" } },
  { id: "serenade", name: "The Midnight Serenade", desc: "Note + Singing Envelope + owl plush + music box heart", save: 12,
    pick: { handwritten: true, card: "singing", keepsakes: ["plush"], packaging: "music" } },
];

export function bundleMatches(b: SpellBundle, x: Extras) {
  const p = b.pick;
  return x.handwritten === p.handwritten && x.card === p.card && p.keepsakes.every((k) => x.keepsakes.includes(k)) && (!p.packaging || x.packaging === p.packaging);
}

export function bundlePrice(b: SpellBundle) {
  return Math.round((addonsTotal(b.pick.handwritten, b.pick.card) + upgradesTotal(b.pick.packaging ?? "kraft", "owl", [...b.pick.keepsakes], false) - b.save) * 100) / 100;
}

export function bundleSavings(x: Extras) {
  const hits = BUNDLES.filter((b) => bundleMatches(b, x));
  return Math.max(0, ...hits.map((b) => b.save));
}

// Express delivery fee waived when the rest of the order is over the threshold.
export function expressWaiver(deliveryId: string, subtotalBeforeDelivery: number) {
  if (deliveryId !== "express" || subtotalBeforeDelivery < FREE_EXPRESS_OVER) return 0;
  return DELIVERY.find((d) => d.id === "express")!.price;
}
