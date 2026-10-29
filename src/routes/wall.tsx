import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { guest } from "@/lib/guest";
import { POTIONS, STRENGTHS, ALL_BOXES } from "@/lib/catalog";
import { Shell } from "@/components/kit";
import { OptArt } from "@/components/opt-art";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/wall")({
  head: () => ({
    meta: [
      { title: "Secret Admirer Wall — Amortentia Post" },
      { name: "description", content: "Anonymous love confessions sent with enchanted chocolates. Swoon for your favorites." },
      { property: "og:title", content: "Secret Admirer Wall" },
      { property: "og:description", content: "Read anonymous confessions and see the most-craved love potions." },
    ],
  }),
  component: Wall,
});

const name = (list: { id: string; name: string }[], id: string) => list.find((x) => x.id === id)?.name ?? id;

function Wall() {
  const qc = useQueryClient();
  const [sort, setSort] = useState<"hot" | "new">("hot");
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    setUserId(null);
  }, []);

  const { data: rows = [] } = useQuery({
    queryKey: ["confessions", sort],
    queryFn: async () => {
      const { data, error } = await supabase.from("confessions").select("*")
        .order(sort === "hot" ? "swoon_count" : "created_at", { ascending: false }).limit(100);
      if (error) throw error;
      return data;
    },
  });
  const [guestSwoons, setGuestSwoons] = useState<string[]>([]);
  useEffect(() => setGuestSwoons(guest.swoons()), []);
  const { data: dbSwoons = [] } = useQuery({
    queryKey: ["my-swoons", userId],
    enabled: !!userId,
    queryFn: async () => (await supabase.from("swoons").select("confession_id")).data?.map((s) => s.confession_id) ?? [],
  });
  const mine = userId ? dbSwoons : guestSwoons;
  const count = (r: { id: string; swoon_count: number }) => r.swoon_count + (!userId && guestSwoons.includes(r.id) ? 1 : 0);

  const scores = new Map<string, number>();
  rows.forEach((r) => r.outcome && scores.set(r.outcome, (scores.get(r.outcome) ?? 0) + r.swoon_count + 1));
  const trending = [...scores.entries()].map(([name, score]) => ({ id: name, name, score })).sort((a, b) => b.score - a.score).slice(0, 5);

  async function swoon(id: string) {
    const has = mine.includes(id);
    if (!userId) {
      const next = has ? guestSwoons.filter((x) => x !== id) : [...guestSwoons, id];
      guest.saveSwoons(next); setGuestSwoons(next); return;
    }
    const { error } = has
      ? await supabase.from("swoons").delete().eq("confession_id", id).eq("user_id", userId)
      : await supabase.from("swoons").insert({ confession_id: id });
    if (error) { toast.error("Couldn't swoon, try again"); return; }
    qc.invalidateQueries({ queryKey: ["confessions"] });
    qc.invalidateQueries({ queryKey: ["my-swoons"] });
  }

  return (
    <Shell>
      <h1 className="font-display text-3xl text-gold-gradient">Secret Admirer Wall</h1>
      <p className="mt-1 text-muted-foreground">Anonymous confessions, sealed in chocolate.</p>

      <section className="mt-5 rounded-2xl border bg-card p-4">
        <p className="text-sm uppercase tracking-[0.2em] text-gold">Most craved blends</p>
        {trending.map((t, i) => (
          <div key={t.id} className="mt-2 flex items-center gap-3">
            <span className="w-6 font-display text-gold">{i + 1}</span>
            <span className="flex-1 text-lg">{t.name}</span>
            <span className="flex items-center gap-1.5 text-muted-foreground"><OptArt id="heart" alt="swoons" className="h-5 w-5 rounded-full object-cover" /> {t.score}</span>
          </div>
        ))}
      </section>

      <div className="mt-5 flex gap-2">
        {(["hot", "new"] as const).map((s) => (
          <button key={s} onClick={() => setSort(s)} className={cn("min-h-11 rounded-full border px-4", sort === s ? "bg-gold-gradient text-primary-foreground" : "bg-card")}>
            {s === "hot" ? "Most Smitten" : "Newest"}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {rows.map((r) => (
          <article key={r.id} className="rounded-2xl bg-parchment p-4 text-parchment-foreground">
            {r.outcome && <p className="font-display text-lg text-accent">{r.outcome}</p>}
            <p className="text-xs uppercase tracking-wider opacity-70">
              {name(ALL_BOXES, r.tier)} · {r.potions.length ? r.potions.map((id) => POTIONS.find((p) => p.id === id)?.name).filter(Boolean).join(" + ") : name(STRENGTHS, r.strength)}
            </p>
            {r.note && <p className="mt-2 text-lg italic">"{r.note}"</p>}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm opacity-70">— A Secret Admirer</span>
              <button onClick={() => swoon(r.id)} aria-pressed={mine.includes(r.id)}
                className={cn("flex min-h-11 items-center gap-2 rounded-full border border-parchment-foreground/30 px-4", mine.includes(r.id) && "bg-accent text-accent-foreground")}>
                <OptArt id="heart" alt="swoon" className="h-5 w-5 rounded-full object-cover" /> {count(r)}
              </button>
            </div>
          </article>
        ))}
      </div>

      <Link to="/send" className="mt-6 flex h-14 items-center justify-center rounded-full bg-gold-gradient font-display text-lg text-primary-foreground shadow-glow">
        Confess Your Own
      </Link>
    </Shell>
  );
}
