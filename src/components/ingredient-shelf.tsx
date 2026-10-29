import { useMemo, useState } from "react";
import { ESSENCES, INGREDIENTS, INGREDIENT_KIND, MAX_BLEND, type EssenceId } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { ING_ART } from "@/lib/art";
import { Icon } from "@/components/icons";
import { OptArt } from "@/components/opt-art";
import { Button } from "@/components/ui/button";

const RARITY_LABEL = { common: "", rare: "Rare", legendary: "Legendary" } as const;

export function IngredientShelf({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [essence, setEssence] = useState<EssenceId | "all">("all");
  const [q, setQ] = useState("");
  const list = useMemo(
    () => INGREDIENTS.filter((p) => (essence === "all" || p.essence === essence) && p.name.toLowerCase().includes(q.toLowerCase())),
    [essence, q],
  );
  const toggle = (id: string) =>
    value.includes(id) ? onChange(value.filter((x) => x !== id)) : value.length < MAX_BLEND && onChange([...value, id]);

  return (
    <div className="space-y-3">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${INGREDIENTS.length} raw ingredients…`} aria-label="Search ingredients"
        className="h-12 w-full rounded-xl border bg-card px-4 outline-none focus:border-gold" />
      <div className="grid grid-cols-2 gap-2" aria-label="Ingredient essences">
        {[{ id: "all" as const, name: "All" }, ...ESSENCES].map((e) => (
          <Button key={e.id} variant="outline" aria-pressed={essence === e.id} onClick={() => setEssence(e.id)}
            className={cn("h-11 min-w-0 justify-start gap-1.5 rounded-full px-3 text-sm", essence === e.id ? "bg-gold-gradient text-primary-foreground" : "bg-card")}>
            {e.id === "all"
              ? <OptArt id="wand" alt="" className="h-6 w-6 rounded-full object-cover" />
              : <img src={ING_ART[`raw-${e.id}-1`]} alt="" loading="lazy" className="h-6 w-6 rounded-full object-cover" />}
            {e.name}
          </Button>
        ))}
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5" aria-label="Chosen ingredients">
          {value.map((id) => {
            const p = INGREDIENTS.find((x) => x.id === id);
            if (!p) return null;
            return (
              <button key={id} onClick={() => toggle(id)} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm" aria-label={`Remove ${p.name}`}>
                {p.name} <Icon name="x" className="h-3.5 w-3.5 opacity-70" />
              </button>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {list.map((p) => {
          const on = value.includes(p.id);
          const full = !on && value.length >= MAX_BLEND;
          const e = ESSENCES.find((x) => x.id === p.essence)!;
          return (
            <button key={p.id} onClick={() => toggle(p.id)} disabled={full} aria-pressed={on}
              className={cn("rounded-2xl border bg-card p-3 text-left transition disabled:opacity-40", on && "border-gold shadow-glow",
                p.rarity === "legendary" && "border-primary/60")}>
              <div className="relative">
                <img src={ING_ART[p.id]} alt={p.name} loading="lazy" width={460} height={460}
                  className="aspect-square w-full rounded-xl border border-gold/30 object-cover" />
                {RARITY_LABEL[p.rarity] && (
                  <span className="absolute right-1.5 top-1.5 rounded-full bg-gold-gradient px-2 text-[10px] font-bold uppercase text-primary-foreground">
                    {RARITY_LABEL[p.rarity]}
                  </span>
                )}
              </div>
              <p className="mt-2 font-semibold leading-tight">{p.name}</p>
              <p className="mt-0.5 text-xs italic text-muted-foreground">{p.note}</p>
              <p className="mt-1 text-xs text-muted-foreground">{INGREDIENT_KIND[p.essence]} · {e.name} · <span className="text-gold">${p.price}</span></p>
            </button>
          );
        })}
        {list.length === 0 && <p className="col-span-2 py-6 text-center text-muted-foreground">No ingredient by that name… yet.</p>}
      </div>
    </div>
  );
}
