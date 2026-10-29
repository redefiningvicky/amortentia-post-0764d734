import { useMemo, useState } from "react";
import { ESSENCES, MAX_BLEND, POTIONS, blendOutcome, type EssenceId } from "@/lib/catalog";
import { cn } from "@/lib/utils";
import { bottleStyle } from "@/lib/art";
import { Icon } from "@/components/icons";
import { OptArt } from "@/components/opt-art";
import { Button } from "@/components/ui/button";

const RARITY_LABEL = { common: "", rare: "Rare", legendary: "Legendary" } as const;

export function PotionCabinet({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [essence, setEssence] = useState<EssenceId | "all">("all");
  const [q, setQ] = useState("");
  const list = useMemo(
    () => POTIONS.filter((p) => (essence === "all" || p.essence === essence) && p.name.toLowerCase().includes(q.toLowerCase())),
    [essence, q],
  );
  const outcome = blendOutcome(value);
  const toggle = (id: string) =>
    value.includes(id) ? onChange(value.filter((x) => x !== id)) : value.length < MAX_BLEND && onChange([...value, id]);

  return (
    <div className="space-y-3">
      <div className="pb-3 pt-1">
        <div className="rounded-2xl border border-gold bg-card p-4 shadow-glow">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Your blend · {value.length}/{MAX_BLEND}</p>
          {outcome ? (
            <>
              <p className="mt-1 font-display text-xl text-gold-gradient">{outcome.name}</p>
              <p className="text-muted-foreground">{outcome.desc}</p>
            </>
          ) : (
            <p className="mt-1 text-muted-foreground">Pick up to 5 potions. Mixing them changes how they fall for you.</p>
          )}
          {value.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {value.map((id) => {
                const p = POTIONS.find((x) => x.id === id);
                if (!p) return null;
                const e = ESSENCES.find((x) => x.id === p.essence);
                if (!e) return null;
                return (
                  <button key={id} onClick={() => toggle(id)} className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm" aria-label={`Remove ${p.name}`}>
                    <span role="img" aria-label={`${e.name} potion`} className="inline-block h-5 w-4 bg-no-repeat" style={bottleStyle(e.id)} /> {p.name} <Icon name="x" className="h-3.5 w-3.5 opacity-70" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search 100 potions…" aria-label="Search potions"
        className="h-12 w-full rounded-xl border bg-card px-4 outline-none focus:border-gold" />
      <div className="grid grid-cols-2 gap-2" aria-label="Potion essences">
        {[{ id: "all" as const, name: "All" }, ...ESSENCES].map((e) => (
          <Button key={e.id} variant="outline" aria-pressed={essence === e.id} onClick={() => setEssence(e.id)}
            className={cn("h-11 min-w-0 justify-start gap-1.5 rounded-full px-3 text-sm", essence === e.id ? "bg-gold-gradient text-primary-foreground" : "bg-card")}>
            {e.id === "all"
              ? <OptArt id="wand" alt="" className="h-6 w-6 rounded-full object-cover" />
              : <span role="img" aria-label={`${e.name} potion`} className="inline-block h-6 w-5 bg-no-repeat" style={bottleStyle(e.id)} />}
            {e.name}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {list.map((p) => {
          const on = value.includes(p.id);
          const full = !on && value.length >= MAX_BLEND;
          const e = ESSENCES.find((x) => x.id === p.essence)!;
          return (
            <button key={p.id} onClick={() => toggle(p.id)} disabled={full} aria-pressed={on}
              className={cn("rounded-2xl border bg-card p-3 text-left transition disabled:opacity-40", on && "border-gold shadow-glow",
                p.rarity === "legendary" && "border-primary/60")}>
              <div className="flex items-start justify-between">
                <span role="img" aria-label={`${e.name} potion`} className="block h-14 w-11 bg-no-repeat" style={bottleStyle(e.id)} />
                {RARITY_LABEL[p.rarity] && <span className="rounded-full bg-gold-gradient px-2 text-[10px] font-bold uppercase text-primary-foreground">{RARITY_LABEL[p.rarity]}</span>}
              </div>
              <p className="mt-1 font-semibold leading-tight">{p.name}</p>
              <p className="text-xs text-muted-foreground">{e.name}</p>
              <p className="mt-1 text-gold">${p.price}</p>
            </button>
          );
        })}
        {list.length === 0 && <p className="col-span-2 py-6 text-center text-muted-foreground">No potion by that name… yet.</p>}
      </div>
    </div>
  );
}
