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
