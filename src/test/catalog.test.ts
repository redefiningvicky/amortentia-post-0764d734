import { describe, it, expect } from "vitest";
import { TIERS, orderTotal } from "@/lib/catalog";

describe("box tiers", () => {
  it("lowest box is $19.99", () => {
    expect(Math.min(...TIERS.map((t) => t.price))).toBe(19.99);
  });
  it("has three tiers", () => {
    expect(TIERS).toHaveLength(3);
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
