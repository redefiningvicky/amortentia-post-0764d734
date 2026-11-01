import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/kit";
import { PotionCabinet } from "@/components/potion-cabinet";
import { OptArt } from "@/components/opt-art";
import { potionsTotal } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { BrewClass } from "@/components/brew-class";

export const Route = createFileRoute("/spellbook")({
  head: () => ({ meta: [
    { title: "The Spellbook — Amortentia Post" },
    { name: "description", content: "Explore 110 love potions and discover the playful outcomes of your blend." },
    { property: "og:title", content: "The Spellbook — Amortentia Post" },
    { property: "og:description", content: "Find the potion blend for your secret longing." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Spellbook,
});

function Spellbook() {
  const [cabinetPotions, setCabinetPotions] = useState<string[]>([]);
  const [rawIngredients, setRawIngredients] = useState<string[]>([]);
  const [mode, setMode] = useState<"class" | "cabinet">("class");
  const potions = mode === "class" ? rawIngredients : cabinetPotions;
  const setPotions = mode === "class" ? setRawIngredients : setCabinetPotions;
  const [ready, setReady] = useState(false);
  return <Shell>
    <div className="mb-5 flex items-center gap-3"><OptArt id="spell" alt="An antique book of love spells" /><div><h1 className="font-display text-3xl text-gold-gradient">Spellbook</h1><p className="mt-1 text-muted-foreground">What does your heart have in mind?</p></div></div>
    <div className="mb-4 grid grid-cols-2 gap-2">
      <Button variant="outline" aria-pressed={mode === "class"} onClick={() => setMode("class")} className={mode === "class" ? "h-12 bg-gold-gradient text-primary-foreground" : "h-12"}>Brew My Own</Button>
      <Button variant="outline" aria-pressed={mode === "cabinet"} onClick={() => setMode("cabinet")} className={mode === "cabinet" ? "h-12 bg-gold-gradient text-primary-foreground" : "h-12"}>Potion Cabinet</Button>
    </div>
    <p className="-mt-2 mb-4 text-sm italic text-muted-foreground">{mode === "class" ? "Create a potion from raw ingredients." : "Mix ready-made potions into your own blend."}</p>
    <div className="pb-28">{mode === "class" ? <BrewClass value={potions} onChange={setPotions} onReady={setReady} /> : <PotionCabinet value={potions} onChange={(ids) => { setPotions(ids); setReady(false); }} />}</div>
    {potions.length > 0 && (mode === "cabinet" || ready) && <div className="fixed inset-x-0 bottom-16 z-30 mx-auto max-w-md border-t bg-background/95 px-5 py-3 backdrop-blur">
      <Link to="/send" search={{ blend: potions.join(",") }} className="flex h-14 items-center justify-center rounded-full bg-gold-gradient font-display text-base text-primary-foreground shadow-glow">Send This Blend · +${potionsTotal(potions).toFixed(2)}</Link>
    </div>}
  </Shell>;
}