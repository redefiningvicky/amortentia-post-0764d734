import { describe, it, expect } from "vitest";
import { TIERS, orderTotal } from "@/lib/catalog";

describe("box tiers", () => {
  it("lowest box is $19.99", () => {
    expect(Math.min(...TIERS.map((t) => t.price))).toBe(19.99);
  });
  it("has five tiers", () => {
    expect(TIERS).toHaveLength(5);
  });
  it("adds potion add-ons to total", () => {
    expect(orderTotal("sweet", "besotted", "week")).toBe(53.99);
  });
});

import { addonsTotal } from "@/lib/catalog";
describe("add-ons", () => {
  it("handwritten note costs $6.99", () => expect(addonsTotal(true, null)).toBe(6.99));
  it("note plus singing card", () => expect(addonsTotal(true, "singing")).toBe(15.98));
  it("no add-ons is $0", () => expect(addonsTotal(false, null)).toBe(0));
});

import { POTIONS, blendOutcome, potionsTotal } from "@/lib/catalog";
describe("potion cabinet", () => {
  it("has exactly 100 potions with unique ids", () => {
    expect(POTIONS).toHaveLength(100);
    expect(new Set(POTIONS.map((p) => p.id)).size).toBe(100);
  });
  it("no potion is free", () => expect(POTIONS.every((p) => p.price > 0)).toBe(true));
  it("passion + obsession blends into Wildfire Obsession", () => {
    expect(blendOutcome(["ember-1", "thorn-1"])?.name).toBe("Wildfire Obsession");
  });
  it("same blend in a different order gives same outcome", () => {
    expect(blendOutcome(["thorn-1", "ember-1"])?.name).toBe("Wildfire Obsession");
  });
  it("a legendary potion upgrades the outcome", () => {
    expect(blendOutcome(["ember-10", "thorn-1"])?.name).toBe("Legendary Wildfire Obsession");
  });
  it("potion prices add up", () => expect(potionsTotal(["ember-1", "ember-7", "ember-10"])).toBe(22.97));
});
