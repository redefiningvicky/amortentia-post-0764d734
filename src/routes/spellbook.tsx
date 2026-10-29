import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/kit";
import { PotionCabinet } from "@/components/potion-cabinet";
import { OptArt } from "@/components/opt-art";
import { potionsTotal } from "@/lib/catalog";

export const Route = createFileRoute("/spellbook")({
  head: () => ({ meta: [
    { title: "The Spellbook — Amortentia Post" },
    { name: "description", content: "Explore 100 love potions and discover the playful outcomes of your blend." },
    { property: "og:title", content: "The Spellbook — Amortentia Post" },
    { property: "og:description", content: "Find the potion blend for your secret longing." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Spellbook,
});

function Spellbook() {
  const [potions, setPotions] = useState<string[]>([]);
  return <Shell>
    <div className="mb-5 flex items-center gap-3"><OptArt id="spell" alt="An antique book of love spells" /><div><h1 className="font-display text-3xl text-gold-gradient">Spellbook</h1><p className="mt-1 text-muted-foreground">What does your heart have in mind?</p></div></div>
    <div className="pb-28"><PotionCabinet value={potions} onChange={setPotions} /></div>
    {potions.length > 0 && <div className="fixed inset-x-0 bottom-16 z-30 mx-auto max-w-md border-t bg-background/95 px-5 py-3 backdrop-blur">
      <Link to="/send" search={{ blend: potions.join(",") }} className="flex h-14 items-center justify-center rounded-full bg-gold-gradient font-display text-base text-primary-foreground shadow-glow">Send This Blend · +${potionsTotal(potions).toFixed(2)}</Link>
    </div>}
  </Shell>;
}