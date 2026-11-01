export type WallConfession = {
  id: string;
  note: string;
  tier: string;
  strength: string;
  aroma: string;
  potions: string[];
  swoon_count: number;
  created_at: string;
  outcome: string | null;
};
// Stable fictional engagement counts; these never change on refresh.
export function dummySwoonCount(id: string): number {
  const hash = [...id].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 0);
  return 50 + (hash % 51);
}
const examples = [
  [
    "Written in the Stars",
    "Three years of passing you in the library. Tonight, you finally look back.",
    ["moon-10", "star-3"],
    142,
  ],
  [
    "Giddy Infatuation",
    "You laugh at everyone's jokes but mine. Let's change that.",
    ["bloom-1", "ember-2"],
    98,
  ],
  ["Pure Intrigue", "Just notice me. That's all I ask.", ["mist-1"], 77],
  [
    "Brave Confession",
    "I rehearsed this confession 400 times. The chocolates will say it better.",
    ["storm-1", "rose-1"],
    63,
  ],
  [
    "Forever Sweetheart",
    "To the barista who spells my name wrong every morning — I love you anyway.",
    ["honey-1", "rose-6"],
    51,
  ],
  [
    "The One Who Came Back",
    "Ex who said I'd never find someone better: watch.",
    ["frost-1", "moon-2"],
    39,
  ],
  [
    "Overflowing Desire",
    "I love the way you love everyone else. Teach me.",
    ["ember-1", "ember-2", "ember-3"],
    0,
  ],
  ["Pure Desire", "Every playlist I make somehow ends up being about you.", ["ember-1"], 0],
  [
    "Pure Desire",
    "You returned my pen yesterday. I have not stopped smiling since.",
    ["ember-1"],
    0,
  ],
  ["No Potion Needed", "I bought the chocolates. Now I am rehearsing hello again.", [], 0],
  [
    "Pure Intrigue",
    "I liked your photo from 2019. The owl has been instructed to deny everything.",
    ["mist-1"],
    24,
  ],
  [
    "Brave Confession",
    "My crush said 'who is this?' We have worked together for four years.",
    ["storm-1", "rose-1"],
    18,
  ],
  [
    "Giddy Infatuation",
    "I asked the stars for a sign. They suggested therapy. I bought chocolates.",
    ["bloom-1", "ember-2"],
    12,
  ],
] as const;
export const WALL_CONFESSIONS: WallConfession[] = examples.map(
  ([outcome, note, potions, swoon_count], i) => ({
    id: `demo-confession-${i}`,
    outcome,
    note,
    potions: [...potions],
    swoon_count: swoon_count === 0 ? dummySwoonCount(`demo-confession-${i}`) : swoon_count,
    tier: potions.length ? "true" : "confession",
    strength: "swoon",
    aroma: "rose",
    created_at: new Date(Date.UTC(2026, 0, 10 - i)).toISOString(),
  }),
);

// Only pretend Wall activity from this browser session. Never read the customer database or its cache.
const SESSION_KEY = "ap-pretend-wall-v1";
export function readWallConfessions(): WallConfession[] {
  try {
    const saved: unknown = JSON.parse(sessionStorage.getItem(SESSION_KEY) ?? "[]");
    const extra = Array.isArray(saved)
      ? saved.filter(
          (row): row is WallConfession =>
            row &&
            typeof row.id === "string" &&
            row.id.startsWith("pretend-") &&
            typeof row.note === "string" &&
            Array.isArray(row.potions),
        )
      : [];
    return [
      ...extra.map((row) => ({ ...row, swoon_count: row.swoon_count || dummySwoonCount(row.id) })),
      ...WALL_CONFESSIONS,
    ];
  } catch {
    return [...WALL_CONFESSIONS];
  }
}
export function addWallConfession(
  value: Omit<WallConfession, "id" | "created_at" | "swoon_count">,
) {
  const row: WallConfession = {
    ...value,
    id: `pretend-${crypto.randomUUID()}`,
    created_at: new Date().toISOString(),
    swoon_count: dummySwoonCount(value.note),
  };
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify([
        row,
        ...readWallConfessions().filter((item) => item.id.startsWith("pretend-")),
      ]),
    );
  } catch {
    // The current visit can still preview a post when storage is unavailable.
  }
  return row;
}
