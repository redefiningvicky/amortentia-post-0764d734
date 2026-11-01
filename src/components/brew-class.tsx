import { useState } from "react";
import { IngredientShelf } from "@/components/ingredient-shelf";
import { GoldButton } from "@/components/kit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { OptArt } from "@/components/opt-art";
import { INGREDIENTS, MAX_BLEND, blendOutcome, potionsTotal } from "@/lib/catalog";
import { BlendAnchor, SelectionChips } from "@/components/blend-browse";
import { PotionResultCard } from "@/components/potion-result-card";

export function BrewClass({
  value,
  onChange,
  onReady,
}: {
  value: string[];
  onChange: (ids: string[]) => void;
  onReady?: (ready: boolean) => void;
}) {
  const [stage, setStage] = useState<"ingredients" | "stir" | "bottled">("ingredients");
  const [stirs, setStirs] = useState(0);
  const [cauldronPrompt, setCauldronPrompt] = useState(false);
  const outcome = blendOutcome(value);
  function startBrewing() {
    setCauldronPrompt(false);
    setStage("stir");
    window.scrollTo(0, 0);
  }
  function chooseIngredients(ids: string[]) {
    onChange(ids);
    setStirs(0);
    onReady?.(false);
    if (value.length < MAX_BLEND && ids.length === MAX_BLEND) setCauldronPrompt(true);
  }
  function editIngredients() {
    setStage("ingredients");
    setStirs(0);
    onReady?.(false);
  }

  return (
    <section className="space-y-4" aria-label="Cauldron class">
      <div className="pb-3 pt-1">
        <BlendAnchor count={value.length}>
          <PotionResultCard
            ids={value}
            heading="Cauldron Class"
            emptyText="Start from scratch: pick up to 5 raw ingredients and brew a potion no one has ever tasted."
          >
            {stage === "ingredients" && (
              <SelectionChips
                onRemove={(id) => chooseIngredients(value.filter((x) => x !== id))}
                items={value.flatMap((id) => {
                  const p = INGREDIENTS.find((x) => x.id === id);
                  return p ? [{ id, name: p.name }] : [];
                })}
              />
            )}
          </PotionResultCard>
        </BlendAnchor>
      </div>
      {stage === "ingredients" ? (
        <>
          <IngredientShelf value={value} onChange={chooseIngredients} />
          <GoldButton disabled={!value.length} onClick={startBrewing}>
            Into the Cauldron · +${potionsTotal(value).toFixed(2)}
          </GoldButton>
        </>
      ) : (
        <>
          <div
            key={stirs}
            className={`relative overflow-hidden rounded-lg ${stage === "stir" && stirs > 0 ? "brew-stir" : ""}`}
          >
            <OptArt
              id={stage === "bottled" ? "vial" : "cauldron"}
              alt={
                stage === "bottled"
                  ? "Your bottled love potion"
                  : "An antique cauldron of molten chocolate and potion bottles"
              }
              className="aspect-[4/3] w-full object-cover"
            />
            {stage === "stir" && (
              <Button
                variant="outline"
                aria-label="Stir the cauldron"
                disabled={stirs >= 3}
                onClick={() => setStirs((n) => Math.min(3, n + 1))}
                className="absolute bottom-4 left-1/2 h-12 -translate-x-1/2 rounded-full border-gold bg-background/95 px-6 text-gold"
              >
                {stirs >= 3 ? "Your blend is ready" : `Stir · ${stirs}/3`}
              </Button>
            )}
          </div>
          {stage === "stir" && (
            <div className="flex gap-2" aria-label={`${stirs} of 3 stirs complete`}>
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className={`h-2 flex-1 rounded-full ${stirs >= n ? "bg-gold-gradient" : "bg-muted"}`}
                />
              ))}
            </div>
          )}
          <div>
            <h2 className="font-display text-2xl text-gold-gradient">
              {stage === "bottled" ? "Bottled: " : "Brewing: "}
              {outcome?.name}
            </h2>
            <p className="mt-2 text-gold">
              {value.length} ingredients · +${potionsTotal(value).toFixed(2)}
            </p>
          </div>
          {stage === "stir" && (
            <GoldButton
              disabled={stirs < 3}
              onClick={() => {
                setStage("bottled");
                onReady?.(true);
              }}
            >
              Bottle My Love Potion
            </GoldButton>
          )}
          <Button variant="outline" className="h-11 w-full" onClick={editIngredients}>
            Change Ingredients
          </Button>
          <p className="text-xs italic text-muted-foreground">
            A playful chocolate spell. Real feelings stay delightfully beyond our control.
          </p>
        </>
      )}
      <Dialog open={cauldronPrompt} onOpenChange={setCauldronPrompt}>
        <DialogContent className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-lg border-gold bg-card shadow-glow">
          <OptArt
            id="cauldron"
            alt="An antique cauldron ready for your ingredients"
            className="aspect-[16/9] w-full rounded-lg object-cover"
          />
          <DialogHeader>
            <DialogTitle className="font-display text-2xl tracking-normal text-gold">
              Into the Cauldron?
            </DialogTitle>
            <DialogDescription>
              Your five ingredients are chosen. Time to stir a little longing into chocolate.
            </DialogDescription>
          </DialogHeader>
          <GoldButton onClick={startBrewing}>
            Into the Cauldron · +${potionsTotal(value).toFixed(2)}
          </GoldButton>
          <Button
            variant="outline"
            className="h-11 w-full"
            onClick={() => setCauldronPrompt(false)}
          >
            Keep Choosing
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
