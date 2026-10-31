import type { ReactNode } from "react";
import { OptArt } from "@/components/opt-art";
import { livePotionResult, MAX_BLEND, type PotionResult, findBrewable } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function PotionResultCard({ ids, result: savedResult, heading = "Your blend", emptyText = "Pick up to 5 potions. A little longing needs a recipe.", showRecipe = false, embedded = false, children }: {
  ids: string[]; result?: PotionResult | null | undefined; heading?: string; emptyText?: string;
  showRecipe?: boolean; embedded?: boolean; children?: ReactNode;
}) {
  const result = savedResult ?? livePotionResult(ids);
  const colour = result?.colourEssences.reduce((mix, essence, i) => i === 0
    ? `var(--potion-${essence})`
    : `color-mix(in oklab, ${mix} ${(i / (i + 1)) * 100}%, var(--potion-${essence}))`, "");
  return <section aria-label="Potion result" className={cn("min-w-0", embedded ? "mt-3 border-t pt-3" : "rounded-lg border border-gold bg-card p-3")}>
    <p className="text-xs uppercase text-gold">{heading} · {ids.length}/{MAX_BLEND}</p>
    <div aria-live="polite" aria-atomic="true" className="mt-2 flex items-start gap-3">
      <OptArt id="vial" alt="" className="h-14 w-12 shrink-0 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <h3 className="break-words font-display text-base leading-snug text-gold">{result?.name ?? "A little mystery, for now"}</h3>
        {result ? <>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full border border-gold" style={{ backgroundColor: colour }} />{result.colour}</p>
          <p className="mt-1 text-sm leading-snug text-foreground">{result.flavour}</p>
          <p className="mt-1 text-sm italic leading-snug text-muted-foreground">{result.effect}</p>
        </> : <p className="mt-1 text-sm leading-snug text-muted-foreground">{emptyText}</p>}
      </div>
    </div>
    {showRecipe && result && <p className="mt-2 break-words text-xs leading-snug text-muted-foreground"><span className="text-gold">Recipe: </span>{result.recipeIds.map((id) => findBrewable(id)?.name ?? id).join(" · ")}</p>}
    {children}
  </section>;
}