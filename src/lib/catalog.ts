export type Tier = { id: string; name: string; pieces: number; price: number; blurb: string };

export const TIERS: Tier[] = [
  { id: "sweet", name: "The Sweet Whisper", pieces: 9, price: 19.99, blurb: "A gentle crush" },
  { id: "true", name: "The True Devotion", pieces: 18, price: 34.99, blurb: "Most chosen" },
  {
    id: "eternal",
    name: "The Eternal Enchantment",
    pieces: 32,
    price: 54.99,
    blurb: "Hopelessly smitten",
  },
  {
    id: "vault",
    name: "The Obsession Vault",
    pieces: 48,
    price: 79.99,
    blurb: "No one else will do",
  },
  {
    id: "grand",
    name: "The Grand Amortentia",
    pieces: 72,
    price: 119.99,
    blurb: "Love beyond reason",
  },
];

// Limited-edition seasonal boxes (proposed prices, unconfirmed).
export const SEASONAL: Tier[] = [
  {
    id: "valentine",
    name: "The Heartbreaker",
    pieces: 24,
    price: 44.99,
    blurb: "Valentine's only · for when Feb 14 hurts",
  },
  {
    id: "galentine",
    name: "The Galentine's Gossip",
    pieces: 20,
    price: 29.99,
    blurb: "Galentine's only · love your besties loudly",
  },
  {
    id: "revenge",
    name: "The Revenge Ex Edition",
    pieces: 18,
    price: 39.99,
    blurb: "Limited · make them regret everything",
  },
  {
    id: "birthday",
    name: "The Birthday Wish",
    pieces: 18,
    price: 34.99,
    blurb: "Birthday · you were the wish all along",
  },
  {
    id: "spooky",
    name: "The Spooky Crush",
    pieces: 16,
    price: 34.99,
    blurb: "Halloween only · scary how much you like them",
  },
  {
    id: "thanksgiving",
    name: "The Grateful Heart",
    pieces: 20,
    price: 34.99,
    blurb: "Thanksgiving · thankful you exist, frankly",
  },
  {
    id: "christmas",
    name: "The Mistletoe Spell",
    pieces: 24,
    price: 44.99,
    blurb: "Christmas · suddenly, mistletoe everywhere",
  },
  {
    id: "newyear",
    name: "The Midnight Kiss",
    pieces: 24,
    price: 44.99,
    blurb: "New Year · one resolution: kiss you",
  },
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

// Every price the app shows ends in .99: computed totals snap to the nearest .99 (never more than 50¢ off the raw sum).
export function to99(n: number): number {
  if (n <= 0) return 0;
  const k = Math.round(n - 0.99);
  return Math.round((k + 0.99) * 100) / 100;
}

// For "spend X more" tips: the next .99 amount at or above n, so the tip never under-promises.
export function to99Up(n: number): number {
  if (n <= 0) return 0;
  const k = Math.ceil(n - 0.99);
  return Math.round((k + 0.99) * 100) / 100;
}

export const STRENGTHS = [
  { id: "flutter", name: "Flutter", desc: "They can't stop thinking of you", price: 6.99 },
  { id: "swoon", name: "Swoon", desc: "They ache when you leave the room", price: 11.99 },
  { id: "besotted", name: "Utterly Besotted", desc: "Hopelessly, desperately yours", price: 18.99 },
];

export const AROMAS = [
  { id: "rose", name: "Wild Rose" },
  { id: "parchment", name: "Fresh Parchment" },
  { id: "treacle", name: "Treacle Tart" },
  { id: "pepper", name: "Peppermint Frost" },
  { id: "amber", name: "Amber & Honey" },
];

export const DURATIONS = [
  { id: "hour", name: "One Night", price: 3.99 },
  { id: "day", name: "A Full Moon", price: 8.99 },
  { id: "week", name: "Forever-ish", price: 14.99 },
];

export function orderTotal(tierId: string, strengthId: string, durationId: string) {
  const t = ALL_BOXES.find((x) => x.id === tierId)?.price ?? 0;
  const s = STRENGTHS.find((x) => x.id === strengthId)?.price ?? 0;
  const d = DURATIONS.find((x) => x.id === durationId)?.price ?? 0;
  return to99(t + s + d);
}

export const HANDWRITTEN = {
  id: "handwritten",
  name: "Handwritten Love Note",
  desc: "Your words, penned in gold ink by our scribes",
  price: 6.99,
};

export const CARDS = [
  {
    id: "vintage",
    name: "Vintage Valentine",
    desc: "Lace-edged, 1940s post style",
    price: 4.99,
    icon: "envelope",
  },
  {
    id: "singing",
    name: "Singing Envelope",
    desc: "Sings your confession when opened",
    price: 8.99,
    icon: "music",
  },
  {
    id: "sealed-card",
    name: "Wax-Sealed Confession",
    desc: "A parchment card sealed shut for dramatic effect",
    price: 5.99,
    icon: "envelope",
  },
];

export function addonsTotal(handwritten: boolean, cardId: string | null) {
  const c = CARDS.find((x) => x.id === cardId)?.price ?? 0;
  return to99((handwritten ? HANDWRITTEN.price : 0) + c);
}

// ---------- The Potion Cabinet: 110 potions, 11 essences, blend synergies ----------
export type Rarity = "common" | "rare" | "legendary";
export const RARITY_PRICE: Record<Rarity, number> = { common: 3.99, rare: 6.99, legendary: 11.99 };
export const MAX_BLEND = 5;

export const ESSENCES = [
  {
    id: "ember",
    name: "Passion",
    icon: "flame",
    adj: "Smoldering",
    noun: "Desire",
    effect: "their pulse races when you walk in",
  },
  {
    id: "rose",
    name: "Tenderness",
    icon: "rose",
    adj: "Tender",
    noun: "Affection",
    effect: "they long to hold your hand",
  },
  {
    id: "moon",
    name: "Longing",
    icon: "moon",
    adj: "Aching",
    noun: "Yearning",
    effect: "they miss you the moment you leave",
  },
  {
    id: "star",
    name: "Destiny",
    icon: "star",
    adj: "Fated",
    noun: "Destiny",
    effect: "they swear you were meant to meet",
  },
  {
    id: "thorn",
    name: "Obsession",
    icon: "thorn",
    adj: "Consuming",
    noun: "Obsession",
    effect: "you are all they can think about",
  },
  {
    id: "honey",
    name: "Devotion",
    icon: "honey",
    adj: "Devoted",
    noun: "Devotion",
    effect: "they'd cross oceans for you",
  },
  {
    id: "mist",
    name: "Mystery",
    icon: "mist",
    adj: "Enchanted",
    noun: "Intrigue",
    effect: "they can't stop wondering about you",
  },
  {
    id: "storm",
    name: "Courage",
    icon: "bolt",
    adj: "Fearless",
    noun: "Confession",
    effect: "they find the nerve to say it first",
  },
  {
    id: "bloom",
    name: "Euphoria",
    icon: "bloom",
    adj: "Giddy",
    noun: "Bliss",
    effect: "they smile like a fool around you",
  },
  {
    id: "frost",
    name: "Rekindling",
    icon: "snowflake",
    adj: "Rekindled",
    noun: "Second Chance",
    effect: "old feelings thaw and return",
  },
  {
    id: "charm",
    name: "Enchantment",
    icon: "sparkles",
    adj: "Beguiling",
    noun: "Enchantment",
    effect: "they find you utterly irresistible and can't explain why",
  },
] as const;
export type EssenceId = (typeof ESSENCES)[number]["id"];

const NAMES: Record<EssenceId, string[]> = {
  ember: [
    "Dragon's Blush",
    "Ember Kiss",
    "Scarlet Fever",
    "Phoenix Tear",
    "Cinder Heart",
    "Flame Draught",
    "Blazing Glance",
    "Hearthfire Tonic",
    "Molten Sigh",
    "Salamander's Vow",
  ],
  rose: [
    "Rosewater Whisper",
    "Velvet Petal",
    "Blushing Bud",
    "Gentle Thorn",
    "Dewdrop Caress",
    "Petal Promise",
    "Soft Embrace",
    "Pink Mist Elixir",
    "Cradle Tonic",
    "Queen Rose Nectar",
  ],
  moon: [
    "Moonmilk",
    "Midnight Pining",
    "Silver Ache",
    "Lunar Lament",
    "Eclipse Draught",
    "Dusk Longing",
    "Tidal Pull",
    "Owl's Lullaby",
    "Crescent Sigh",
    "Blood Moon Elixir",
  ],
  star: [
    "Stardust Draught",
    "Comet's Promise",
    "Fate Thread",
    "Constellation Kiss",
    "Wishing Well Water",
    "Astral Vow",
    "Northern Star",
    "Celestial Sip",
    "Oracle's Drop",
    "Destiny's Crown",
  ],
  thorn: [
    "Thornheart",
    "Nightshade Crush",
    "Raven's Fixation",
    "Ivy Grip",
    "Obsidian Gaze",
    "Bramble Bind",
    "Shadow Fever",
    "Hollow Hunger",
    "Serpent Coil",
    "The Unforgettable",
  ],
  honey: [
    "Honeyed Oath",
    "Golden Loyalty",
    "Hearth Promise",
    "Amber Bond",
    "Beeswax Vow",
    "Sunlit Devotion",
    "Steadfast Draught",
    "Knight's Pledge",
    "Twin Flame Honey",
    "Eternal Oath",
  ],
  mist: [
    "Fogbound Allure",
    "Veiled Glance",
    "Riddle Tonic",
    "Smoke & Mirrors",
    "Hidden Door",
    "Whisper Fog",
    "Masquerade Drop",
    "Sphinx Draught",
    "Twilight Secret",
    "The Enigma",
  ],
  storm: [
    "Thunder Courage",
    "Lightning Confession",
    "Bold Gale",
    "Tempest Draught",
    "Lionheart Tonic",
    "Spark of Nerve",
    "Rumbling Vow",
    "Gale Kiss",
    "Brave Heart Brew",
    "Storm King's Roar",
  ],
  bloom: [
    "Giggle Water",
    "Butterfly Flutter",
    "Sunshine Swoon",
    "Peony Pop",
    "Cloud Nine",
    "Fizzing Crush",
    "Daydream Dew",
    "Bubblegum Bliss",
    "Meadow Glee",
    "Everbloom",
  ],
  frost: [
    "Thawing Heart",
    "Frostbite Forgiven",
    "Winter Return",
    "Icicle Memory",
    "First Snow",
    "Glacier Melt",
    "Old Flame Thaw",
    "Hoarfrost Hope",
    "Snowglobe Wish",
    "Spring After Winter",
  ],
  charm: [
    "Cupid's Mishap",
    "Charmed Whisper",
    "Beguiling Glance",
    "Siren's Sip",
    "Glimmer Draught",
    "Lovestruck Tonic",
    "Enchanted Wink",
    "Sweet Nothings",
    "Spellbound Smile",
    "The Irresistible",
  ],
};

// Bottled-potion tasting notes, in the same order as NAMES.
const POTION_NOTES: Record<EssenceId, string[]> = {
  ember: [
    "Spiced cherry warmth with a suspiciously rosy finish.",
    "Smoked cocoa sealed with a kiss of cinnamon.",
    "A scarlet cordial for dangerously warm cheeks.",
    "Golden heat rising from the ashes of almost-love.",
    "Dark chocolate embers that linger past midnight.",
    "A peppery draught bottled while the cauldron still glows.",
    "Bright ginger fire for glances across crowded rooms.",
    "Toasted cinnamon comfort from a lover’s hearth.",
    "Velvety cocoa with a slow, smoldering finish.",
    "A legendary fire-spiced elixir, corked with a crimson vow.",
  ],
  rose: [
    "Rosewater stirred softly into a blush-pink draught.",
    "Silken vanilla with a delicate petal finish.",
    "Young rose nectar, bottled before the first confession.",
    "Soft floral sweetness with one teasing prickle.",
    "Morning dew and white chocolate, tenderly steeped.",
    "A rose-scented cordial sealed like a folded love letter.",
    "Warm cream and lavender for the gentlest kind of longing.",
    "A pearly pink elixir with a whisper of wild rose.",
    "Honeyed chamomile, rocked slowly over a low flame.",
    "A legendary rose nectar fit for a very dramatic courtship.",
  ],
  moon: [
    "Creamy vanilla steeped beneath a sleepless moon.",
    "Midnight jasmine with a bittersweet cocoa finish.",
    "A silver-flecked draught for beautifully inconvenient yearning.",
    "Violet and dark cocoa, brewed after the last goodbye.",
    "Black cherry shadow wrapped around a silver glow.",
    "Dusky lavender warmth for the hour they usually call.",
    "Sea-salted caramel drawn slowly toward the moon.",
    "Soft chamomile cream, bottled as the owls wake.",
    "A pale almond cordial with a wistful lunar shimmer.",
    "A legendary ruby elixir steeped through a lunar eclipse.",
  ],
  star: [
    "Sparkling sugar suspended in a midnight-blue draught.",
    "Bright citrus trailing a comet’s golden wake.",
    "A fine ribbon of caramel winding through starlit cream.",
    "Vanilla stars scattered across a dark chocolate sky.",
    "Clear pear sweetness, drawn from the wishing well.",
    "Honey and cardamom sealed beneath a lucky constellation.",
    "A luminous mint cordial for hearts finding their way.",
    "Silvery almond cream with a little celestial sparkle.",
    "Spiced plum nectar from the oracle’s private shelf.",
    "A legendary gilded draught, crowned with fallen starlight.",
  ],
  thorn: [
    "Blackberry cordial with a dark, thorny edge.",
    "A midnight-purple chocolate fantasy with a berry blush.",
    "Black cherry and cocoa, dark as a raven’s wing.",
    "Deep herbal sweetness that winds around the palate.",
    "Glossy dark cocoa with a sharp crystal-clear finish.",
    "Wild bramble syrup knotted through bitter chocolate.",
    "Smoky plum warmth from the shadowed end of the shelf.",
    "A dark espresso draught for another sleepless love letter.",
    "Spiced licorice curled beneath a velvet-black surface.",
    "A legendary black-rose elixir with an unforgettable finish.",
  ],
  honey: [
    "Wildflower honey sealed with a golden wax promise.",
    "Butterscotch warmth that glows like late-afternoon sunlight.",
    "Toasted marshmallow cream from a quietly waiting hearth.",
    "Rich amber caramel, slow-brewed and patiently bottled.",
    "Honeyed vanilla with the scent of a candlelit letter.",
    "Orange-blossom nectar gathered on the brightest morning.",
    "Malted cocoa, steady and sweet through every storm.",
    "Maple and warm spice from the royal apothecary.",
    "Two ribbons of honey meeting in one glowing vial.",
    "A legendary golden cordial aged beside a treasured vow.",
  ],
  mist: [
    "Smoky vanilla half-hidden beneath a pearly haze.",
    "A violet cordial glimpsed through a curtain of mist.",
    "Spiced pear sweetness with a puzzling cocoa finish.",
    "Toasted sugar and dark cocoa playing delicious tricks.",
    "A secret blend of fig and velvet-soft vanilla.",
    "Lavender vapor caught in a silver-stoppered bottle.",
    "Blackcurrant nectar dressed for a midnight masquerade.",
    "Saffron and honey from an inscrutable apothecary.",
    "Dusky plum cordial, corked before anyone could ask.",
    "A legendary opalescent elixir with a closely guarded recipe.",
  ],
  storm: [
    "Ginger sparks rolling through a storm-dark draught.",
    "Sharp citrus fizz for words caught on the tongue.",
    "Brisk mint and cocoa with a windswept finish.",
    "Salted dark chocolate, whipped into a tiny tempest.",
    "Golden ginger warmth bottled with a brave little bow.",
    "A bright peppery sip for the moment before hello.",
    "Spiced caramel that rumbles gently in the cauldron.",
    "A wild citrus cordial kissed by a passing gale.",
    "Warming cocoa and cardamom for grand declarations.",
    "A legendary thunder-spiced elixir from the storm king’s cellar.",
  ],
  bloom: [
    "Strawberry fizz with a thoroughly unserious finish.",
    "Peach nectar fluttering beneath a rose-gold shimmer.",
    "Sunny orange cream for inconveniently broad smiles.",
    "A floral pink cordial with a playful little pop.",
    "Airy vanilla sweetness, whipped above the clouds.",
    "Raspberry bubbles that refuse to sit quietly.",
    "Dewy melon nectar from a daydreamer’s garden.",
    "Candy-pink sweetness for spectacularly silly crushes.",
    "Wild berry cordial gathered from a laughing meadow.",
    "A legendary blossom elixir, bright as endless spring.",
  ],
  frost: [
    "Cool peppermint melting into a warm cocoa heart.",
    "White chocolate and mint with a forgiving finish.",
    "Spiced vanilla warmth beneath a frosted silver surface.",
    "Clear mint cordial holding a glimmer of old sweetness.",
    "Soft coconut cream dusted with wintry sugar.",
    "Glacial blue peppermint, slowly warmed over the flame.",
    "Smoked cocoa returning beneath a cool mint veil.",
    "Frosted pear sweetness for hopeful second chapters.",
    "A shimmering vanilla draught with snow-sugar flecks.",
    "A legendary mint-and-blossom elixir for the first thaw.",
  ],
  charm: [
    "Pink cherry fizz from a delightfully misfired spell.",
    "Rose-gold vanilla, stirred with a whispered compliment.",
    "Shimmering peach nectar for lingering across-the-room looks.",
    "Pearl-soft salted caramel with a sea-song finish.",
    "A violet cordial sparkling under the apothecary lamps.",
    "Sweet raspberry cream for hopelessly theatrical sighs.",
    "A mischievous citrus sparkle beneath a jeweled stopper.",
    "Honeyed rosewater, sweeter than a rehearsed compliment.",
    "Glowing strawberry vanilla, corked with a crooked grin.",
    "A legendary rose-gold elixir from the most coveted shelf.",
  ],
};

export type Potion = {
  id: string;
  name: string;
  note: string;
  essence: EssenceId;
  rarity: Rarity;
  price: number;
};
export const POTIONS: Potion[] = ESSENCES.flatMap((e) =>
  NAMES[e.id].map((name, i) => {
    const rarity: Rarity = i === 9 ? "legendary" : i >= 6 ? "rare" : "common";
    return {
      id: `${e.id}-${i + 1}`,
      name,
      note: POTION_NOTES[e.id][i] ?? "",
      essence: e.id,
      rarity,
      price: RARITY_PRICE[rarity],
    };
  }),
);

// Raw brewing ingredients for the cauldron class: 4 per essence, priced by rarity (never free).
export const INGREDIENT_PRICE: Record<Rarity, number> = {
  common: 1.99,
  rare: 2.99,
  legendary: 4.99,
};
// Each essence is one raw-ingredient type (spices, flowers, herbs…), 10 flavors each = 110 total.
export const INGREDIENT_KIND: Record<EssenceId, string> = {
  ember: "Spices",
  rose: "Flowers",
  moon: "Leaves",
  star: "Crystals",
  thorn: "Vines & Thorns",
  honey: "Nectars",
  mist: "Waters",
  storm: "Roots",
  bloom: "Fruits",
  frost: "Mints",
  charm: "Curios",
};
const RAW: Record<EssenceId, string[]> = {
  ember: [
    "Crushed Dragon Pepper",
    "Phoenix Ash",
    "Chili-Chocolate Nibs",
    "Heartfire Ember",
    "Smoked Cinnamon Bark",
    "Saffron Threads of Longing",
    "Blazing Clove Buds",
    "Fire-Roasted Cardamom",
    "Volcano Salt",
    "Dragonscale Pepper",
  ],
  rose: [
    "Crushed Rose Petals",
    "Blushing Dewdrops",
    "Velvet Petal Sugar",
    "First-Blush Bud",
    "Sweetheart Peony Petals",
    "Dried Lavender Hearts",
    "Midnight Camellia",
    "Carnation Confetti",
    "Gilded Rosehips",
    "The Unopened Bloom",
  ],
  moon: [
    "Moonlight Dew",
    "Midnight Jasmine",
    "Silver Tears",
    "Owl-Feather Down",
    "Moonlit Sage",
    "Dreamer's Chamomile",
    "Silverleaf Thyme",
    "Shadow Basil",
    "Lunar Mugwort",
    "The Sleepless Herb",
  ],
  star: [
    "Stardust Sugar",
    "Comet-Tail Shavings",
    "Wishbone Honey",
    "Constellation Salt",
    "Celestial Rock Candy",
    "Meteorite Dust",
    "Aurora Crystals",
    "Zodiac Quartz",
    "Nebula Sugar",
    "Destiny Diamond Dust",
  ],
  thorn: [
    "Nightshade Berries",
    "Bramble Thorns",
    "Raven Feathers",
    "Obsession Orchid",
    "Mandrake Slivers",
    "Widow's Fern",
    "Black Dahlia",
    "Hemlock Petals",
    "Raven's Ivy",
    "The Unforgettable Root",
  ],
  honey: [
    "Wildflower Honey",
    "Amber Resin",
    "Beeswax Hearts",
    "Golden Treacle",
    "Maple Moon Syrup",
    "Caramel Oath",
    "Butterscotch Nectar",
    "Royal Jelly",
    "Toasted Marshmallow Syrup",
    "Eternal Oath Nectar",
  ],
  mist: [
    "Bottled Fogwater",
    "Whisper-Smoke",
    "Veiled Vanilla",
    "Sphinx Smoke",
    "Midnight Rainwater",
    "Cloud Cream",
    "Incense Tears",
    "Fog from a Secret Garden",
    "Mirage Droplets",
    "The Enigma Mist",
  ],
  storm: [
    "Lightning-Struck Cocoa",
    "Thunder Salt",
    "Lionheart Ginger",
    "Storm-Charged Sugar",
    "Thunder Turmeric",
    "Daredevil Ginseng",
    "Valor Valerian",
    "Gale Root",
    "Peppercorn of Pluck",
    "Storm King's Heartroot",
  ],
  bloom: [
    "Giggling Peony",
    "Butterfly Pollen",
    "Sunshine Zest",
    "Popping Fizz Crystals",
    "Blushing Strawberry Dust",
    "Candied Cherry Hearts",
    "Raspberry Fizz",
    "Pink Grapefruit Peel",
    "Golden Gooseberry",
    "Everbloom Fruit",
  ],
  frost: [
    "First-Snow Crystals",
    "Thawed Icicle Water",
    "Winter Mint",
    "Hoarfrost Sugar",
    "Glacial Salt",
    "Snowberry Dust",
    "Iced Spearmint",
    "Frozen Juniper",
    "Silver Fir Resin",
    "Spring-After-Winter Crystal",
  ],
  charm: [
    "Crushed Cupid Wings",
    "Charmed Sugar",
    "Siren-Song Syrup",
    "Sparkle Dust",
    "Lovebird Feather",
    "Enchanted Rose-Gold Leaf",
    "Cupid's Arrowhead Shavings",
    "Siren Pearl Dust",
    "Heartstring Filament",
    "Bottled First Glance",
  ],
};
// Apothecary notes (kind + lore) shown on each raw ingredient card, in the same order as RAW.
const RAW_NOTES: Record<EssenceId, string[]> = {
  ember: [
    "A fierce spice that sets the brew simmering with want.",
    "Reborn heat; keeps the flame of longing alive.",
    "Bitter-sweet spice with a slow, burning finish.",
    "A coal that never cools for its chosen.",
    "Bark smoked over a lover's hearth.",
    "Threads worth more than gold, and almost as rare as their attention.",
    "Buds that spark on the tongue.",
    "Pods cracked open under a full moon.",
    "Crystals scraped from a volcano's heart.",
    "Legendary pepper; one flake and they burn for you.",
  ],
  rose: [
    "A classic flower of courtship, dried at first bloom.",
    "Morning dew gathered from a blushing rose.",
    "Flower-sweet sugar that softens any heart.",
    "A bud that opens only for true adoration.",
    "Petals pressed between love letters.",
    "Calming hearts and hoping hearts since forever.",
    "A flower that only blooms after dark.",
    "Scattered at weddings; swept up by the hopeful.",
    "Fruit of the rose, gilded and patient.",
    "Legendary bloom; whoever it opens for is yours.",
  ],
  moon: [
    "Collected at midnight; makes the heart ache sweetly.",
    "A night flower that blooms for the one you miss.",
    "Moonlit drops for loves kept secret.",
    "Softness that carries dreams to the beloved.",
    "Leaves brushed by moonbeams only.",
    "Brewed by dreamers who whisper names in sleep.",
    "Tiny silver leaves for quiet devotion.",
    "A leaf that grows only in shadow.",
    "Herb of visions; shows their face in dreams.",
    "Legendary herb; rest only comes when they arrive.",
  ],
  star: [
    "The sugar of wishes; sweetens fate itself.",
    "Shavings that pull two hearts into orbit.",
    "Stir counterclockwise and make a wish.",
    "Salt that aligns destinies.",
    "Crystals grown on comet tails.",
    "Ground from a fallen star.",
    "Crystals that shimmer with the northern lights.",
    "Twelve stones, one for every sign of them.",
    "Sugar spun from a swirling galaxy.",
    "Legendary dust; destiny itself takes your side.",
  ],
  thorn: [
    "A dangerous plant; handle obsession with care.",
    "They cling, like a thought you can't shake.",
    "Dark plumage for darker fixations.",
    "A bloom that flowers only for one.",
    "It screams when pulled; so will they, for you.",
    "A fern that grows where love was lost.",
    "Beauty with a shadow; love with a grip.",
    "Lovely, lethal, unforgettable.",
    "It winds around whatever it wants.",
    "Legendary root; once tasted, never forgotten.",
  ],
  honey: [
    "Devotion, gathered one flower at a time.",
    "Ancient tree-gold; preserves loyalty forever.",
    "Melted into the brew to seal a promise.",
    "Slow, patient, eternal sweetness.",
    "Tapped under a harvest moon.",
    "A vow you can drizzle.",
    "Golden and impossible to resist.",
    "Fit for a queen, meant for one.",
    "Campfire sweetness for cold nights apart.",
    "Legendary nectar; an oath that cannot break.",
  ],
  mist: [
    "Keeps the beloved mysteriously out of reach.",
    "Carries your name to their ear at night.",
    "A sweetness hidden under gauze, like a secret crush.",
    "They must solve you to have you.",
    "Caught drop by drop while the world slept.",
    "Whipped from a passing cloud.",
    "Wept by incense at midnight mass.",
    "Bottled where two paths secretly meet.",
    "Water that shows what you long for.",
    "Legendary mist; nobody who breathes it forgets you.",
  ],
  storm: [
    "Courage, harvested mid-thunderstorm.",
    "A pinch gives a timid heart its voice.",
    "A root for those who finally say it.",
    "Crystals that crackle with nerve.",
    "Golden root ground in a gale.",
    "For hearts that dare greatly.",
    "Calms the storm so the confession comes clear.",
    "Pulled from a cliffside in high wind.",
    "One crack and the knees stop shaking.",
    "Legendary root; courage fit for a king's confession.",
  ],
  bloom: [
    "A flower that laughs when you say their name.",
    "One pinch and the stomach flutters.",
    "Bright citrus for hopeless romantics.",
    "Joy that cannot be corked.",
    "Summer berries crushed into blush-pink dust.",
    "Sweetness shaped like what you're after.",
    "Berries that burst with nervous laughter.",
    "Sharp, bright, impossible to ignore.",
    "A rare golden berry for rare golden feelings.",
    "Legendary fruit; it ripens only when love is near.",
  ],
  frost: [
    "Cold crystals that thaw into second chances.",
    "Melted from the eaves of an old heart.",
    "A cool herb for rekindling old warmth.",
    "Sugar for spring after the longest winter.",
    "Raked from a glacier's shoulder.",
    "Berries picked under the first frost.",
    "Cool, clean, and quietly hopeful.",
    "Berries that waited out the winter.",
    "Sap frozen mid-sigh.",
    "Legendary crystal; winter ends the moment they bite.",
  ],
  charm: [
    "Mischief in powdered form; aim carefully.",
    "One spoonful and glances linger.",
    "A sea-song that calls them to your shore.",
    "Shimmer impossible to look away from.",
    "Shed by birds who mate for life.",
    "Gilding for the sweetest words.",
    "Shaved from the arrow that started it all.",
    "Ground from a pearl that heard a siren.",
    "One thread tied around a willing heart.",
    "Legendary vial; the moment your eyes first met.",
  ],
};
export type Ingredient = {
  id: string;
  name: string;
  note: string;
  essence: EssenceId;
  rarity: Rarity;
  price: number;
};
export const INGREDIENTS: Ingredient[] = ESSENCES.flatMap((e) =>
  RAW[e.id].map((name, i) => {
    const rarity: Rarity = i === 9 ? "legendary" : i >= 6 ? "rare" : "common";
    return {
      id: `raw-${e.id}-${i + 1}`,
      name,
      note: RAW_NOTES[e.id][i] ?? "",
      essence: e.id,
      rarity,
      price: INGREDIENT_PRICE[rarity],
    };
  }),
);

// Anything that can go into the cauldron: a bottled potion or a raw ingredient.
export function findBrewable(id: string): Potion | Ingredient | undefined {
  return POTIONS.find((p) => p.id === id) ?? INGREDIENTS.find((p) => p.id === id);
}

const SYNERGIES: Record<string, { name: string; desc: string }> = {
  "ember+thorn": {
    name: "Wildfire Obsession",
    desc: "A love that burns and won't let go. They will chase you.",
  },
  "moon+star": {
    name: "Written in the Stars",
    desc: "They'll believe the universe sent you, and wait for you forever.",
  },
  "frost+rose": { name: "Second First Kiss", desc: "An old love returns softer than before." },
  "honey+star": { name: "Soulmate Bond", desc: "They'll know, deep down, you're the one." },
  "ember+mist": { name: "Forbidden Spark", desc: "Secret glances. Stolen moments. Irresistible." },
  "rose+storm": { name: "Brave Confession", desc: "They'll be the one to confess first, sweetly." },
  "bloom+ember": {
    name: "Giddy Infatuation",
    desc: "Butterflies so strong they blush when they hear your name.",
  },
  "mist+thorn": { name: "Haunted Heart", desc: "You'll linger in their dreams night after night." },
  "honey+rose": {
    name: "Forever Sweetheart",
    desc: "Breakfast in bed, forehead kisses, a lifetime of tenderness.",
  },
  "frost+moon": {
    name: "The One Who Came Back",
    desc: "They realize they never stopped missing you.",
  },
  "bloom+star": {
    name: "Fairytale Ending",
    desc: "They'll start planning a future with you in it.",
  },
  "storm+thorn": {
    name: "Grand Gesture",
    desc: "Expect serenades, roses at the door, and a public declaration.",
  },
  "honey+moon": {
    name: "Faithful Moon",
    desc: "Distance won't matter; they will always come home to you.",
  },
  "charm+thorn": {
    name: "Dangerous Allure",
    desc: "They're obsessed and they don't even know why. Neither do you.",
  },
  "charm+moon": {
    name: "Enchanted Ache",
    desc: "They miss you in a way that feels like magic, because it is.",
  },
  "charm+bloom": {
    name: "Head Over Heels",
    desc: "Giddy, dazzled, hopeless. They trip over their own feet around you.",
  },
};

export type Outcome = { name: string; desc: string; essences: EssenceId[] };

export function blendOutcome(potionIds: string[]): Outcome | null {
  const ps = potionIds.map(findBrewable).filter((p): p is Potion | Ingredient => !!p);
  if (!ps.length) return null;
  const order = ESSENCES.map((e) => e.id) as EssenceId[];
  const counts = new Map<EssenceId, number>();
  ps.forEach((p) => counts.set(p.essence, (counts.get(p.essence) ?? 0) + 1));
  const ranked = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || order.indexOf(a[0]) - order.indexOf(b[0]))
    .map((x) => x[0]);
  const legendary = ps.some((p) => p.rarity === "legendary") ? "Legendary " : "";
  const E = (id: EssenceId) => ESSENCES.find((e) => e.id === id)!;
  const [a, b] = ranked as [EssenceId, EssenceId | undefined];

  if (!b) {
    const pure = (counts.get(a) ?? 0) >= 2;
    return {
      name: `${legendary}${pure ? "Overflowing" : "Pure"} ${E(a).noun}`,
      desc: `${cap(E(a).effect)}${pure ? ", twice as strong" : ""}.`,
      essences: [a],
    };
  }
  const key = [a, b].sort().join("+");
  const syn = SYNERGIES[key];
  if (syn) return { name: legendary + syn.name, desc: syn.desc, essences: ranked };
  return {
    name: `${legendary}${E(a).adj} ${E(b).noun}`,
    desc: `${cap(E(a).effect)}, and ${E(b).effect}.`,
    essences: ranked,
  };
}

export function potionsTotal(potionIds: string[]) {
  return to99(potionIds.reduce((s, id) => s + (findBrewable(id)?.price ?? 0), 0));
}

export type PotionResult = {
  version: 1;
  recipeIds: string[];
  name: string;
  colour: string;
  colourEssences: EssenceId[];
  flavour: string;
  effect: string;
};

export const POTION_COLOURS: Record<EssenceId, string> = {
  ember: "Ruby",
  rose: "Rose pink",
  moon: "Moonlit silver",
  star: "Starlight blue",
  thorn: "Blackberry",
  honey: "Honey gold",
  mist: "Pearl grey",
  storm: "Storm teal",
  bloom: "Strawberry pink",
  frost: "Glacial blue",
  charm: "Enchanted violet",
};
const PREDICTED_EFFECTS: Record<EssenceId, string> = {
  ember: "May cause suspiciously long eye contact.",
  rose: "May cause hand-holding disguised as checking your pulse.",
  moon: "May cause a very casual text at 2:03 a.m.",
  star: "May cause them to call an ordinary Tuesday destiny.",
  thorn: "May cause repeated visits to your profile. For research.",
  honey: "May cause them to save you the last chocolate. Allegedly.",
  mist: "May cause dramatic window-gazing with you as the plot.",
  storm: "May cause a rehearsed hello to escape at full volume.",
  bloom: "May cause giggling at jokes that were not that funny.",
  frost: "May cause an old flame to ask if you are still cold.",
  charm: "May cause them to forget why they entered the room. You entered it.",
};
const FLAVOUR_WORDS =
  /dark chocolate|white chocolate|dark cocoa|smoked cocoa|cocoa|chocolate|black cherry|cherry|rosewater|rose|cinnamon|vanilla|lavender|chamomile|jasmine|violet|caramel|almond|mint|honey|cardamom|plum|blackberry|espresso|licorice|butterscotch|marshmallow|maple|pear|fig|blackcurrant|saffron|ginger|citrus|pepper|strawberry|peach|orange|raspberry|melon|coconut|treacle|clove|turmeric|grapefruit|gooseberry|juniper/gi;

/** Canonical catalogue IDs keep every result independent of click order. */
export function livePotionResult(ids: string[]): PotionResult | null {
  const recipeIds = [...new Set(ids)].filter((id) => findBrewable(id)).sort();
  const recipe = recipeIds.map(findBrewable).filter((p): p is Potion | Ingredient => Boolean(p));
  const outcome = blendOutcome(recipeIds);
  const dominant = outcome?.essences[0];
  if (!outcome || !dominant) return null;
  const flavours = [
    ...new Set(
      recipe.flatMap((p) => {
        const matches = `${p.name}. ${p.note}`.match(FLAVOUR_WORDS);
        return matches ? matches.map((word) => word.toLowerCase()) : [p.name.toLowerCase()];
      }),
    ),
  ];
  // One flavour from each selection comes first, so no selected ingredient disappears.
  const firstFlavours = [
    ...new Set(
      recipe.map((p) => {
        const matches = `${p.name}. ${p.note}`.match(FLAVOUR_WORDS);
        return matches?.[0]?.toLowerCase() ?? p.name.toLowerCase();
      }),
    ),
  ];
  const description = [...new Set([...firstFlavours, ...flavours])].slice(
    0,
    Math.max(3, firstFlavours.length),
  );
  const flavour =
    description.length > 1
      ? `${description.slice(0, -1).join(", ")} and ${description.at(-1)}.`
      : `${description[0] ?? "A little chocolate mystery"}.`;
  return {
    version: 1,
    recipeIds,
    name: outcome.name,
    colour: outcome.essences.map((e) => POTION_COLOURS[e]).join(" / "),
    colourEssences: recipe.map((p) => p.essence),
    flavour: cap(flavour),
    effect: PREDICTED_EFFECTS[dominant],
  };
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ---------- Upgrades: packaging, delivery, keepsakes ----------
export const PACKAGING = [
  {
    id: "kraft",
    name: "Vintage Kraft Parcel",
    desc: "Twine and a red wax seal",
    price: 0,
    icon: "box",
  },
  {
    id: "velvet",
    name: "Crimson Velvet Heart",
    desc: "Soft velvet they'll keep forever",
    price: 9.99,
    icon: "velvet",
  },
  {
    id: "music",
    name: "Enchanted Music Box Heart",
    desc: "Plays a waltz the moment they lift the lid",
    price: 39.99,
    icon: "music",
  },
];

export const DELIVERY = [
  { id: "owl", name: "Standard Owl", desc: "Arrives in 3–5 days", price: 0, icon: "owl" },
  {
    id: "express",
    name: "Express Owl",
    desc: "Tomorrow. Free on orders over $99",
    price: 14.99,
    icon: "wind",
  },
  {
    id: "courier",
    name: "Hand-Delivered by Courier",
    desc: "Handed over in person, with a bow",
    price: 49.99,
    icon: "hat",
  },
];

export const KEEPSAKES = [
  {
    id: "seal",
    name: "Monogram Wax Seal",
    desc: "Your initial, pressed in gold wax",
    price: 2.99,
    icon: "seal",
  },
  {
    id: "vial",
    name: "Keepsake Potion Vial",
    desc: "A glowing vial of your blend to keep",
    price: 12.99,
    icon: "vial",
  },
  {
    id: "plush",
    name: "Messenger Owl Plush",
    desc: "Something to hold when you're not there",
    price: 18.99,
    icon: "plush",
  },
  {
    id: "bouquet",
    name: "Dozen Red Roses",
    desc: "Delivered alongside the box",
    price: 29.99,
    icon: "bouquet",
  },
];

export const ANTIDOTE = {
  id: "antidote",
  name: "Antidote Guarantee",
  desc: "If they don't swoon, we re-brew a fresh box free",
  price: 7.99,
};

// Honest perk: Express Owl is free once the rest of the order reaches this amount.
export const FREE_EXPRESS_OVER = 99;

export function upgradesTotal(
  packagingId: string,
  deliveryId: string,
  keepsakeIds: string[],
  antidote: boolean,
) {
  const p = PACKAGING.find((x) => x.id === packagingId)?.price ?? 0;
  const d = DELIVERY.find((x) => x.id === deliveryId)?.price ?? 0;
  const k = keepsakeIds.reduce((s, id) => s + (KEEPSAKES.find((x) => x.id === id)?.price ?? 0), 0);
  return to99(p + d + k + (antidote ? ANTIDOTE.price : 0));
}

// Spell bundles: one tap picks several extras; when every item in a bundle is chosen, the saving applies.
export type Extras = {
  handwritten: boolean;
  card: string | null;
  keepsakes: string[];
  packaging: string;
};
export type SpellBundle = {
  id: string;
  name: string;
  desc: string;
  save: number;
  pick: { handwritten: boolean; card: string; keepsakes: readonly string[]; packaging?: string };
};
export const BUNDLES: SpellBundle[] = [
  {
    id: "charm",
    name: "The Little Charm",
    desc: "Handwritten note + Vintage Valentine card + wax seal",
    save: 2,
    pick: { handwritten: true, card: "vintage", keepsakes: ["seal"] },
  },
  {
    id: "spell",
    name: "The Full Love Spell",
    desc: "Note + Singing Envelope + potion vial + owl plush + velvet heart",
    save: 10,
    pick: { handwritten: true, card: "singing", keepsakes: ["vial", "plush"], packaging: "velvet" },
  },
  {
    id: "wish",
    name: "The Bottled Confession",
    desc: "Note + Vintage Valentine + keepsake potion vial + wax seal",
    save: 4,
    pick: { handwritten: true, card: "vintage", keepsakes: ["vial", "seal"] },
  },
  {
    id: "romance",
    name: "The Grand Gesture",
    desc: "Note + Vintage Valentine + dozen roses + velvet heart",
    save: 7,
    pick: { handwritten: true, card: "vintage", keepsakes: ["bouquet"], packaging: "velvet" },
  },
  {
    id: "serenade",
    name: "The Midnight Serenade",
    desc: "Note + Singing Envelope + owl plush + music box heart",
    save: 12,
    pick: { handwritten: true, card: "singing", keepsakes: ["plush"], packaging: "music" },
  },
];

export function bundleMatches(b: SpellBundle, x: Extras) {
  const p = b.pick;
  return (
    x.handwritten === p.handwritten &&
    x.card === p.card &&
    p.keepsakes.every((k) => x.keepsakes.includes(k)) &&
    (!p.packaging || x.packaging === p.packaging)
  );
}

export function bundlePrice(b: SpellBundle) {
  return to99(
    addonsTotal(b.pick.handwritten, b.pick.card) +
      upgradesTotal(b.pick.packaging ?? "kraft", "owl", [...b.pick.keepsakes], false) -
      b.save,
  );
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
