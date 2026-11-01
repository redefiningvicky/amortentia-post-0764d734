import { findBrewable, MAX_BLEND } from "@/lib/catalog";

export type RecipeMode = "cabinet" | "class";
export type RestorableRecipe = { ids: string[]; mode: RecipeMode };
export type SpellbookDraft = { cabinet: string[]; ingredients: string[]; mode: RecipeMode };

/** Restore all items or none: never truncate, deduplicate or substitute a shared recipe. */
export function restoreRecipe(value: unknown): RestorableRecipe | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_BLEND) return null;
  if (!value.every((id): id is string => typeof id === "string" && Boolean(findBrewable(id))))
    return null;
  if (new Set(value).size !== value.length) return null;
  const raw = value.every((id) => id.startsWith("raw-"));
  if (!raw && value.some((id) => id.startsWith("raw-"))) return null;
  return { ids: [...value], mode: raw ? "class" : "cabinet" };
}

export function sameRecipe(a: string[], b: string[]) {
  return a.length === b.length && [...a].sort().every((id, i) => id === [...b].sort()[i]);
}

const DRAFT_KEY = "ap-spellbook-recipe-v1";
export function readSpellbookDraft(): SpellbookDraft {
  const empty: SpellbookDraft = { cabinet: [], ingredients: [], mode: "class" };
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "null");
    if (!value || typeof value !== "object") return empty;
    const draft = value as Record<string, unknown>;
    const cabinet = restoreRecipe(draft["cabinet"]);
    const ingredients = restoreRecipe(draft["ingredients"]);
    return {
      cabinet: cabinet?.mode === "cabinet" ? cabinet.ids : [],
      ingredients: ingredients?.mode === "class" ? ingredients.ids : [],
      mode: draft["mode"] === "cabinet" ? "cabinet" : "class",
    };
  } catch {
    return empty;
  }
}

export function saveSpellbookDraft(draft: SpellbookDraft) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* Keep editing when storage is unavailable. */
  }
}
