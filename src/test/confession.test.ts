import { describe, expect, it } from "vitest";
import { validConfession } from "@/lib/confession";

describe("anonymous confession", () => {
  it("rejects a blank confession", () => expect(validConfession("   ")).toBe(false));
  it("accepts a 200-character confession", () => expect(validConfession("a".repeat(200))).toBe(true));
  it("rejects a confession longer than 200 characters", () => expect(validConfession("a".repeat(201))).toBe(false));
});