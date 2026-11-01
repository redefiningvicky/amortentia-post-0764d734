import { beforeEach, describe, expect, it, vi } from "vitest";
import { demo, DEMO_CONFESSIONS, giftLink } from "@/lib/demo";
import { restoreRecipe } from "@/lib/recipe";
describe("Self-contained demo", () => {
  beforeEach(() => localStorage.clear());
  it("provides built-in confessions with usable recipes without a network", () => {
    const fetch = vi.spyOn(globalThis, "fetch");
    expect(demo.confessions().length).toBeGreaterThanOrEqual(10);
    for (const post of DEMO_CONFESSIONS)
      if (post.potions.length) expect(restoreRecipe(post.potions)).not.toBeNull();
    expect(fetch).not.toHaveBeenCalled();
    fetch.mockRestore();
  });
  it("saves a confession and a pinned memory in browser storage", () => {
    demo.addConfession({
      note: "I rehearsed hello again.",
      tier: "confession",
      strength: "swoon",
      aroma: "rose",
      potions: [],
      outcome: "No Potion Needed",
    });
    expect(demo.confessions()[0]?.note).toBe("I rehearsed hello again.");
    demo.pinPhoto("sample-bite", "One questionable bite.");
    expect(demo.photos()[0]?.sampleId).toBe("sample-bite");
  });
  it("keeps gift tracking idempotent and builds a hash link under a Pages subdirectory", () => {
    demo.markGift("gift-one", "open");
    const opened = demo.giftStatus(["gift-one"])[0]?.opened_at;
    demo.markGift("gift-one", "bite");
    expect(demo.giftStatus(["gift-one"])[0]?.opened_at).toBe(opened);
    expect(demo.giftStatus(["gift-one"])[0]?.bitten_at).toBeTruthy();
    window.history.replaceState({}, "", "/amortentia-demo/#/send");
    expect(giftLink(new URLSearchParams({ id: "gift-one" }))).toContain(
      "/amortentia-demo/#/gift?id=gift-one",
    );
  });
});
