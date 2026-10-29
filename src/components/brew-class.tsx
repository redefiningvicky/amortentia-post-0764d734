import { useState } from "react";
import { IngredientShelf } from "@/components/ingredient-shelf";
import { GoldButton } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { OptArt } from "@/components/opt-art";
import { blendOutcome, potionsTotal } from "@/lib/catalog";

export function BrewClass({ value, onChange, onReady }: { value: string[]; onChange: (ids: string[]) => void; onReady?: (ready: boolean) => void }) {
  const [stage, setStage] = useState<"ingredients" | "stir" | "bottled">("ingredients");
  const [stirs, setStirs] = useState(0);
  const outcome = blendOutcome(value);
  function editIngredients() { setStage("ingredients"); setStirs(0); onReady?.(false); }

  return <section className="space-y-4" aria-label="Cauldron class">
    <p className="text-sm uppercase text-gold">Cauldron Class · {stage === "ingredients" ? "1 · Choose" : stage === "stir" ? "2 · Stir" : "3 · Bottle"}</p>
    {stage === "ingredients" ? <>
      <p className="text-sm text-muted-foreground">Start from scratch: pick raw ingredients and brew a potion no one has ever tasted.</p>
      <IngredientShelf value={value} onChange={(ids) => { onChange(ids); setStirs(0); onReady?.(false); }} />
      <GoldButton disabled={!value.length} onClick={() => { setStage("stir"); window.scrollTo(0, 0); }}>Into the Cauldron · +${potionsTotal(value).toFixed(2)}</GoldButton>
    </> : <>
      <div key={stirs} className={`relative overflow-hidden rounded-lg ${stage === "stir" && stirs > 0 ? "brew-stir" : ""}`}>
        <OptArt id={stage === "bottled" ? "vial" : "cauldron"} alt={stage === "bottled" ? "Your bottled love potion" : "An antique cauldron of molten chocolate and potion bottles"} className="aspect-[4/3] w-full object-cover" />
        {stage === "stir" && <Button variant="outline" aria-label="Stir the cauldron" disabled={stirs >= 3} onClick={() => setStirs((n) => Math.min(3, n + 1))}
          className="absolute bottom-4 left-1/2 h-12 -translate-x-1/2 rounded-full border-gold bg-background/95 px-6 text-gold">{stirs >= 3 ? "Your blend is ready" : `Stir · ${stirs}/3`}</Button>}
      </div>
      {stage === "stir" && <div className="flex gap-2" aria-label={`${stirs} of 3 stirs complete`}>{[1, 2, 3].map((n) => <div key={n} className={`h-2 flex-1 rounded-full ${stirs >= n ? "bg-gold-gradient" : "bg-muted"}`} />)}</div>}
      <div aria-live="polite"><h2 className="font-display text-2xl text-gold-gradient">{stage === "bottled" ? "Bottled: " : "Brewing: "}{outcome?.name}</h2><p className="mt-2 text-lg text-muted-foreground">{outcome?.desc}</p><p className="mt-2 text-gold">{value.length} potions · +${potionsTotal(value).toFixed(2)}</p></div>
      {stage === "stir" && <GoldButton disabled={stirs < 3} onClick={() => { setStage("bottled"); onReady?.(true); }}>Bottle My Love Potion</GoldButton>}
      <Button variant="outline" className="h-11 w-full" onClick={editIngredients}>Change Ingredients</Button>
      <p className="text-xs italic text-muted-foreground">A playful chocolate spell. Real feelings stay delightfully beyond our control.</p>
    </>}
  </section>;
}