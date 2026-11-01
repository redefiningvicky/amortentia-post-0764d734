import { blendOutcome, livePotionResult, orderTotal, potionsTotal, to99 } from "@/lib/catalog";
import type { GuestOrder, GiftDetails } from "@/lib/guest";

export const SAMPLE_SENT_ID = "owl-post-rehearsal";
const potions = ["honey-1", "rose-6"];
const gift: GiftDetails = {
  id: SAMPLE_SENT_ID,
  to: "Your Secret Crush",
  from: "Their Secret Admirer",
  tier: "true",
  blend: blendOutcome(potions)?.name ?? "A Very Unreasonable Affection",
  note: "I asked the owl to act casual. It wore a bow tie.",
  wrapping: "kraft",
  potions,
  potionResult: livePotionResult(potions),
  createdAt: "2026-02-14T12:00:00.000Z",
};
export const SAMPLE_SENT_ORDER: GuestOrder & { mine: true; demo: true } = {
  id: SAMPLE_SENT_ID,
  gift_id: SAMPLE_SENT_ID,
  recipient_name: gift.to,
  tier: gift.tier,
  total: to99(orderTotal(gift.tier, "swoon", "hour") + potionsTotal(potions)),
  created_at: gift.createdAt!,
  gift,
  potions,
  potion_result: gift.potionResult ?? null,
  mine: true,
  demo: true,
};
export type OwlReactionState = { sampleBittenAt: string | null; dismissed: string[] };
const KEY = "ap-owl-reactions-v1";
export function readOwlReactions(): OwlReactionState {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null");
    return {
      sampleBittenAt: typeof saved?.sampleBittenAt === "string" ? saved.sampleBittenAt : null,
      dismissed: Array.isArray(saved?.dismissed)
        ? saved.dismissed.filter((id: unknown) => typeof id === "string")
        : [],
    };
  } catch {
    return { sampleBittenAt: null, dismissed: [] };
  }
}
export function saveOwlReactions(state: OwlReactionState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Keep the reaction visible for this visit even when storage is unavailable.
  }
}
