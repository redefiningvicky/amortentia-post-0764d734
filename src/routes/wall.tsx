import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AROMAS, STRENGTHS, TIERS } from "@/lib/catalog";
import { Shell } from "@/components/kit";
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
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
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
  const { data: mine = [] } = useQuery({
    queryKey: ["my-swoons", userId],
    enabled: !!userId,
    queryFn: async () => (await supabase.from("swoons").select("confession_id")).data?.map((s) => s.confession_id) ?? [],
  });

  const trending = STRENGTHS.map((s) => ({
    ...s,
    score: rows.filter((r) => r.strength === s.id).reduce((a, r) => a + r.swoon_count + 1, 0),
  })).sort((a, b) => b.score - a.score);

  async function swoon(id: string) {
    if (!userId) return toast("Sign in to swoon 💘");
    const has = mine.includes(id);
    const { error } = has
      ? await supabase.from("swoons").delete().eq("confession_id", id).eq("user_id", userId)
      : await supabase.from("swoons").insert({ confession_id: id });
    if (error) return toast.error("Couldn't swoon, try again");
    qc.invalidateQueries({ queryKey: ["confessions"] });
    qc.invalidateQueries({ queryKey: ["my-swoons"] });
  }

  return (
    <Shell>
      <h1 className="font-display text-3xl text-gold-gradient">Secret Admirer Wall</h1>
      <p className="mt-1 text-muted-foreground">Anonymous confessions, sealed in chocolate.</p>

      <section className="mt-5 rounded-2xl border bg-card p-4">
        <p className="text-sm uppercase tracking-[0.2em] text-gold">Most craved potions</p>
        {trending.map((t, i) => (
          <div key={t.id} className="mt-2 flex items-center gap-3">
            <span className="w-6 font-display text-gold">{i + 1}</span>
            <span className="flex-1 text-lg">{t.name}</span>
            <span className="text-muted-foreground">{t.score} 💘</span>
          </div>
        ))}
      </section>

      <div className="mt-5 flex gap-2">
        {(["hot", "new"] as const).map((s) => (
          <button key={s} onClick={() => setSort(s)} className={cn("min-h-11 rounded-full border px-4", sort === s ? "bg-gold-gradient text-primary-foreground" : "bg-card")}>
            {s === "hot" ? "🔥 Most Smitten" : "✨ Newest"}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {rows.map((r) => (
          <article key={r.id} className="rounded-2xl bg-parchment p-4 text-parchment-foreground">
            <p className="text-xs uppercase tracking-wider opacity-70">
              {name(TIERS, r.tier)} · {name(STRENGTHS, r.strength)} · {name(AROMAS, r.aroma)}
            </p>
            {r.note && <p className="mt-2 text-lg italic">"{r.note}"</p>}
            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm opacity-70">— A Secret Admirer</span>
              <button onClick={() => swoon(r.id)} aria-pressed={mine.includes(r.id)}
                className={cn("min-h-11 rounded-full border border-parchment-foreground/30 px-4", mine.includes(r.id) && "bg-accent text-accent-foreground")}>
                💘 {r.swoon_count}
              </button>
            </div>
          </article>
        ))}
      </div>

      <Link to="/send" className="mt-6 flex h-14 items-center justify-center rounded-full bg-gold-gradient font-display text-lg text-primary-foreground shadow-glow">
        Confess Your Own ✦
      </Link>
    </Shell>
  );
}
