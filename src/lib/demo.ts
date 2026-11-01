import { guest } from "@/lib/guest";
export type DemoConfession = {
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
] as const;
export const DEMO_CONFESSIONS: DemoConfession[] = examples.map(
  ([outcome, note, potions, swoon_count], i) => ({
    id: `demo-confession-${i}`,
    outcome,
    note,
    potions: [...potions],
    swoon_count,
    tier: potions.length ? "true" : "confession",
    strength: "swoon",
    aroma: "rose",
    created_at: new Date(Date.UTC(2026, 0, 10 - i)).toISOString(),
  }),
);
function read<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback;
  } catch {
    return fallback;
  }
}
export const demo = {
  confessions: (): DemoConfession[] => [
    ...read<DemoConfession[]>("ap-demo-confessions", []),
    ...DEMO_CONFESSIONS,
  ],
  addConfession: (value: Omit<DemoConfession, "id" | "created_at" | "swoon_count">) => {
    const rows = read<DemoConfession[]>("ap-demo-confessions", []);
    localStorage.setItem(
      "ap-demo-confessions",
      JSON.stringify([
        { ...value, id: crypto.randomUUID(), created_at: new Date().toISOString(), swoon_count: 0 },
        ...rows,
      ]),
    );
  },
  markGift: (id: string, event: "open" | "bite") => {
    const all = read<Record<string, { opened_at: string | null; bitten_at: string | null }>>(
      "ap-demo-gift-status",
      {},
    );
    const old = all[id] ?? { opened_at: null, bitten_at: null };
    all[id] = {
      opened_at: old.opened_at ?? new Date().toISOString(),
      bitten_at: event === "bite" ? (old.bitten_at ?? new Date().toISOString()) : old.bitten_at,
    };
    localStorage.setItem("ap-demo-gift-status", JSON.stringify(all));
  },
  giftStatus: (ids: string[]) => {
    const all = read<Record<string, { opened_at: string | null; bitten_at: string | null }>>(
      "ap-demo-gift-status",
      {},
    );
    return ids.map((id) => ({
      id,
      opened_at: all[id]?.opened_at ?? null,
      bitten_at: all[id]?.bitten_at ?? null,
    }));
  },
  photos: (): { id: string; sampleId: string; caption: string }[] => read("ap-demo-photos", []),
  pinPhoto: (sampleId: string, caption: string) => {
    localStorage.setItem(
      "ap-demo-photos",
      JSON.stringify([{ id: crypto.randomUUID(), sampleId, caption }, ...demo.photos()]),
    );
  },
};
export function giftLink(query: URLSearchParams) {
  const base = window.location.href.split("#")[0]!.split("?")[0]!;
  return `${base}#/gift?${query}`;
}
// Imported gifts contain their full details in the link; only activity on this browser is recorded.
export const rememberGift = guest.receive;
