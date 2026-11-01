import { useMemo, useState } from "react";
import { ESSENCES, MAX_BLEND, POTIONS, type EssenceId } from "@/lib/catalog";
import { PotionResultCard } from "@/components/potion-result-card";
import { cn } from "@/lib/utils";
import { bottleStyle } from "@/lib/art";
import { OptArt } from "@/components/opt-art";
import { Button } from "@/components/ui/button";
import { BlendAnchor, SelectionChips, ShowMore, useShowMore } from "@/components/blend-browse";

const RARITY_LABEL = { common: "", rare: "Rare", legendary: "Legendary" } as const;

export function PotionCabinet({
  value,
  onChange,
  showResult = true,
}: {
  showResult?: boolean;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [essence, setEssence] = useState<EssenceId | "all">("all");
  const [q, setQ] = useState("");
  const list = useMemo(
    () =>
      POTIONS.filter(
        (p) =>
          (essence === "all" || p.essence === essence) &&
          p.name.toLowerCase().includes(q.toLowerCase()),
      ),
    [essence, q],
  );
  const page = useShowMore(list, `${essence}|${q}`);
  const toggle = (id: string) =>
    value.includes(id)
      ? onChange(value.filter((x) => x !== id))
      : value.length < MAX_BLEND && onChange([...value, id]);

  return (
    <div className="space-y-3">
      {showResult && (
        <div className="pb-3 pt-1">
          <BlendAnchor count={value.length}>
            <PotionResultCard
              ids={value}
              emptyText="Pick up to 5 potions. Mixing them changes how they fall for you."
            >
              <SelectionChips
                onRemove={toggle}
                items={value.flatMap((id) => {
                  const p = POTIONS.find((x) => x.id === id);
                  return p
                    ? [
                        {
                          id,
                          name: p.name,
                          art: (
                            <span
                              aria-hidden="true"
                              className="inline-block h-5 w-4 bg-no-repeat"
                              style={bottleStyle(p.essence)}
                            />
                          ),
                        },
                      ]
                    : [];
                })}
              />
            </PotionResultCard>
          </BlendAnchor>
        </div>
      )}

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search 110 potions…"
        aria-label="Search potions"
        className="h-12 w-full rounded-xl border bg-card px-4 outline-none focus:border-gold"
      />
      <div className="grid grid-cols-2 gap-2" aria-label="Potion essences">
        {[{ id: "all" as const, name: "All" }, ...ESSENCES].map((e) => (
          <Button
            key={e.id}
            variant="outline"
            aria-pressed={essence === e.id}
            onClick={() => setEssence(e.id)}
            className={cn(
              "h-11 min-w-0 justify-start gap-1.5 rounded-full px-3 text-sm",
              essence === e.id ? "bg-gold-gradient text-primary-foreground" : "bg-card",
            )}
          >
            {e.id === "all" ? (
              <OptArt id="wand" alt="" className="h-6 w-6 rounded-full object-cover" />
            ) : (
              <span
                role="img"
                aria-label={`${e.name} potion`}
                className="inline-block h-6 w-5 bg-no-repeat"
                style={bottleStyle(e.id)}
              />
            )}
            {e.name}
          </Button>
        ))}
      </div>

      <div>
        <div className="grid grid-cols-2 gap-2">
          {page.visible.map((p) => {
            const on = value.includes(p.id);
            const full = !on && value.length >= MAX_BLEND;
            const e = ESSENCES.find((x) => x.id === p.essence)!;
            return (
              <button
                key={p.id}
                onClick={() => toggle(p.id)}
                disabled={full}
                aria-pressed={on}
                className={cn(
                  "rounded-2xl border bg-card p-3 text-left transition disabled:opacity-40",
                  on && "border-gold shadow-glow",
                  p.rarity === "legendary" && "border-primary/60",
                )}
              >
                <div className="flex items-start justify-between">
                  <span
                    role="img"
                    aria-label={`${e.name} potion`}
                    className="block h-14 w-11 bg-no-repeat"
                    style={bottleStyle(e.id)}
                  />
                  {RARITY_LABEL[p.rarity] && (
                    <span className="rounded-full bg-gold-gradient px-2 text-[10px] font-bold uppercase text-primary-foreground">
                      {RARITY_LABEL[p.rarity]}
                    </span>
                  )}
                </div>
                <p className="mt-1 font-semibold leading-tight">{p.name}</p>
                <p className="mt-0.5 text-xs italic text-muted-foreground">{p.note}</p>
                <p className="text-xs text-muted-foreground">{e.name}</p>
                <p className="mt-1 text-gold">${p.price}</p>
              </button>
            );
          })}
          {list.length === 0 && (
            <p className="col-span-2 py-6 text-center text-muted-foreground">
              No potion by that name… yet.
            </p>
          )}
        </div>
        <ShowMore shown={page.shown} total={page.total} noun="potions" onMore={page.more} />
      </div>
    </div>
  );
}
