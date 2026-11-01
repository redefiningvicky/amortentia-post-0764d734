import { DEMO_COPY } from "@/lib/demo-copy";
import type { PotionResult } from "@/lib/catalog";

// Optional recipe fields preserve orders saved before live potion results existed.
export type GuestOrder = {
  id: string;
  tier: string;
  recipient_name: string;
  total: number;
  created_at: string;
  gift_id?: string;
  gift_url?: string;
  gift?: GiftDetails;
  potions?: string[];
  potion_result?: PotionResult | null;
};
export type GiftDetails = {
  id: string;
  to: string;
  from: string;
  tier: string;
  blend: string;
  note: string;
  wrapping?: string | undefined;
  handwritten?: string | undefined;
  card?: string | undefined;
  cardMessage?: string | undefined;
  keepsakes?: string[];
  potions?: string[];
  potionResult?: PotionResult | null;
  createdAt?: string | undefined;
};
export type ReceivedGift = GiftDetails & { receivedAt: string };
export type GuestProfile = { display_name: string; avatar: string | null };

const read = <T>(k: string, d: T): T => {
  try {
    return JSON.parse(localStorage.getItem(k) ?? "") as T;
  } catch {
    return d;
  }
};
const write = (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v));

export const guest = {
  orders: () => read<GuestOrder[]>("ap-orders-v2", []),
  addOrder: (o: GuestOrder) => write("ap-orders-v2", [o, ...guest.orders()]),
  received: () => read<ReceivedGift[]>("ap-received-v1", []),
  receive: (gift: GiftDetails) => {
    const old = guest.received();
    write("ap-received-v1", [
      {
        ...gift,
        receivedAt: old.find((g) => g.id === gift.id)?.receivedAt ?? new Date().toISOString(),
      },
      ...old.filter((g) => g.id !== gift.id),
    ]);
  },
  profile: () => read<GuestProfile>("ap-profile", { display_name: DEMO_COPY.sender, avatar: null }),
  saveProfile: (p: GuestProfile) => write("ap-profile", p),
  swoons: () => read<string[]>("ap-swoons", []),
  saveSwoons: (s: string[]) => write("ap-swoons", s),
};
