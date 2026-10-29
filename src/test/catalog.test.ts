import { describe, it, expect } from "vitest";
import { TIERS, orderTotal, INGREDIENTS, INGREDIENT_KIND, ESSENCES, blendOutcome, findBrewable, potionsTotal } from "@/lib/catalog";

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

import { POTIONS } from "@/lib/catalog";
describe("potion cabinet", () => {
  it("has exactly 110 potions with unique ids", () => {
    expect(POTIONS).toHaveLength(110);
    expect(new Set(POTIONS.map((p) => p.id)).size).toBe(110);
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

import { upgradesTotal, MAX_BLEND } from "@/lib/catalog";
describe("upgrades", () => {
  it("blend allows up to 5 potions", () => expect(MAX_BLEND).toBe(5));
  it("default kraft + standard owl is free", () => expect(upgradesTotal("kraft", "owl", [], false)).toBe(0));
  it("music box + courier + plush + antidote", () => expect(upgradesTotal("music", "courier", ["plush"], true)).toBe(116.96));
});

import { SEASONAL, desperationLevel } from "@/lib/catalog";
describe("seasonal boxes & desperation meter", () => {
  it("seasonal box prices count in total", () => expect(orderTotal("valentine", "flutter", "hour")).toBe(55.99));
  it("offers Christmas", () => expect(SEASONAL.some((box) => box.id === "christmas")).toBe(true));
  it("offers New Year", () => expect(SEASONAL.some((box) => box.id === "newyear")).toBe(true));
  it("offers Thanksgiving", () => expect(SEASONAL.some((box) => box.id === "thanksgiving")).toBe(true));
  it("offers birthday gifts", () => expect(SEASONAL.some((box) => box.id === "birthday")).toBe(true));
  it.each(["christmas", "newyear"])("%s proposed box price counts in totals", (id) => expect(orderTotal(id, "flutter", "hour")).toBe(55.99));
  it.each(["thanksgiving", "birthday"])("%s proposed box price counts in totals", (id) => expect(orderTotal(id, "flutter", "hour")).toBe(45.99));
  it("cheap order is Mildly Hopeful", () => expect(desperationLevel(40).label).toBe("Mildly Hopeful"));
  it("$400 order is Unhinged Romantic", () => expect(desperationLevel(400).label).toBe("Unhinged Romantic"));
});

import { BUNDLES, bundlePrice, bundleSavings, expressWaiver } from "@/lib/catalog";
describe("bundles & free express", () => {
  it("Full Love Spell saves $10 when all its items are picked", () =>
    expect(bundleSavings({ handwritten: true, card: "singing", keepsakes: ["vial", "plush"], packaging: "velvet" })).toBe(10));
  it("no saving if a bundle item is removed", () =>
    expect(bundleSavings({ handwritten: true, card: "singing", keepsakes: ["vial"], packaging: "velvet" })).toBe(0));
  it("express is free over $99", () => expect(expressWaiver("express", 99)).toBe(14.99));
  it("express is paid under $99", () => expect(expressWaiver("express", 98.99)).toBe(0));
  it.each([["wish", 4, 23.96], ["romance", 7, 44.96], ["serenade", 12, 62.96]])("%s bundle applies its proposed saving", (id, saving, price) => {
    const bundle = BUNDLES.find((b) => b.id === id);
    expect(bundle).toBeDefined();
    if (!bundle) throw new Error("Missing bundle");
    expect(bundleSavings({ handwritten: bundle.pick.handwritten, card: bundle.pick.card, keepsakes: [...bundle.pick.keepsakes], packaging: bundle.pick.packaging ?? "kraft" })).toBe(saving);
    expect(bundlePrice(bundle)).toBe(price);
  });
  it("overlapping savings do not stack", () => expect(bundleSavings({ handwritten: true, card: "vintage", keepsakes: ["seal", "vial", "bouquet"], packaging: "velvet" })).toBe(7));
});

import { ICON_NAMES } from "@/components/icons";
import { ESSENCES, CARDS, PACKAGING, DELIVERY, KEEPSAKES, DESPERATION } from "@/lib/catalog";
describe("drawn artwork", () => {
  const used = [
    ...ESSENCES.map((e) => e.icon),
    ...CARDS.map((c) => c.icon),
    ...PACKAGING.map((p) => p.icon),
    ...DELIVERY.map((d) => d.icon),
    ...KEEPSAKES.map((k) => k.icon),
    ...DESPERATION.map((d) => d.icon),
  ];
  it("every catalog icon name has artwork", () => {
    expect(used.length).toBe(28);
    for (const name of used) expect(ICON_NAMES).toContain(name);
  });
});

describe("raw brewing ingredients", () => {
  it("has 110 ingredients, 10 per essence across 11 kinds, and none are free", () => {
    expect(INGREDIENTS.length).toBe(110);
    for (const ing of INGREDIENTS) expect(ing.price).toBeGreaterThan(0);
    for (const e of ESSENCES) expect(INGREDIENTS.filter((i) => i.essence === e.id)).toHaveLength(10);
    expect(new Set(INGREDIENTS.map((i) => INGREDIENT_KIND[i.essence])).size).toBe(11);
  });
  it("prices raw blends through the same totals as potions", () => {
    expect(potionsTotal(["raw-ember-1", "raw-rose-1"])).toBe(3.98);
    expect(potionsTotal(["raw-ember-10"])).toBe(4.99);
    expect(potionsTotal(["ember-1", "raw-thorn-1"])).toBe(5.98);
  });
  it("raw ingredients blend into the same essence outcomes", () => {
    expect(findBrewable("raw-ember-1")?.name).toBe("Crushed Dragon Pepper");
    expect(blendOutcome(["raw-ember-1", "raw-thorn-1"])?.name).toBe("Wildfire Obsession");
    expect(blendOutcome(["raw-moon-1", "raw-star-1"])?.name).toBe("Written in the Stars");
  });
});
