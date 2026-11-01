import { beforeEach, describe, expect, it } from "vitest";
import { restoreRecipe, sameRecipe, readSpellbookDraft, saveSpellbookDraft } from "@/lib/recipe";
import { guest, type GiftDetails } from "@/lib/guest";

describe("Recipe and gift continuity", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  it("restores exact raw and cabinet recipes without substituting invalid items", () => {
    expect(restoreRecipe(["raw-rose-1", "raw-ember-1"])?.mode).toBe("class");
    expect(restoreRecipe(["rose-1", "ember-1"])?.mode).toBe("cabinet");
    expect(restoreRecipe(["rose-1", "raw-ember-1"])).toBeNull();
    expect(restoreRecipe(["rose-1", "missing"])).toBeNull();
    expect(restoreRecipe(["rose-1", "rose-1"])).toBeNull();
    expect(sameRecipe(["rose-1", "ember-1"], ["ember-1", "rose-1"])).toBe(true);
  });
  it("preserves both Spellbook modes and tolerates damaged storage", () => {
    const draft = { cabinet: ["rose-1"], ingredients: ["raw-ember-1"], mode: "class" as const };
    saveSpellbookDraft(draft);
    expect(readSpellbookDraft()).toEqual(draft);
    sessionStorage.setItem("ap-spellbook-recipe-v1", "broken");
    expect(readSpellbookDraft().cabinet).toEqual([]);
  });
  it("remembers one received gift when it is opened repeatedly", () => {
    const gift: GiftDetails = {
      id: "gift-one",
      to: "Recipient",
      from: "Admirer",
      tier: "sweet",
      blend: "Pure Desire",
      note: "Hello",
      wrapping: "velvet",
      handwritten: "A separate letter",
      keepsakes: ["plush"],
      potions: ["ember-1"],
    };
    guest.receive(gift);
    const first = guest.received()[0]!;
    guest.receive(gift);
    expect(guest.received()).toHaveLength(1);
    expect(guest.received()[0]).toEqual(first);
    expect(guest.received()[0]?.handwritten).toBe("A separate letter");
  });
});
