import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
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
  const [tab, setTab] = useState<"confessions" | "album">("confessions");
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

  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: photos = [] } = useQuery({
    queryKey: ["wall-photos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("wall_photos").select("*").order("created_at", { ascending: false }).limit(60);
      if (error) throw error;
      if (!data.length) return [];
      const { data: signed } = await supabase.storage.from("wall-photos").createSignedUrls(data.map((p) => p.image_path), 3600);
      const urls = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
      return data.map((p) => ({ ...p, url: urls.get(p.image_path) ?? "" }));
    },
  });
  const photoMine = guestSwoons.filter((s) => s.startsWith("photo:"));
  function swoonPhoto(id: string) {
    const key = `photo:${id}`;
    const next = photoMine.includes(key) ? guestSwoons.filter((x) => x !== key) : [...guestSwoons, key];
    guest.saveSwoons(next); setGuestSwoons(next);
  }
  async function uploadPhoto(file: File) {
    if (file.size > 5 * 1024 * 1024) { toast.error("Photos up to 5MB, please"); return; }
    setUploading(true);
    const path = `${crypto.randomUUID()}.${file.name.split(".").pop() ?? "jpg"}`;
    const up = await supabase.storage.from("wall-photos").upload(path, file);
    const ins = up.error ? { error: up.error } : await supabase.from("wall_photos").insert({ image_path: path, caption: caption.trim() || null });
    setUploading(false);
    if (ins.error) { toast.error("Couldn't post the photo, try again"); return; }
    setCaption(""); toast.success("Pinned to the album");
    qc.invalidateQueries({ queryKey: ["wall-photos"] });
  }

  return (
    <Shell>
      <h1 className="font-display text-3xl text-gold-gradient">Secret Admirer Wall</h1>
      <p className="mt-1 text-muted-foreground">Anonymous confessions, sealed in chocolate.</p>

      <div className="mt-4 flex gap-2">
        {([["confessions", "Confessions"], ["album", "Photo Album"]] as const).map(([t, l]) => (
          <button key={t} onClick={() => setTab(t)} className={cn("min-h-11 rounded-full border px-4", tab === t ? "bg-gold-gradient text-primary-foreground" : "bg-card")}>{l}</button>
        ))}
      </div>

      {tab === "album" && (
        <section className="mt-4">
          <div className="rounded-2xl border border-gold bg-card p-4">
            <p className="font-display text-lg text-gold-gradient">Pin a memory</p>
            <p className="text-sm text-muted-foreground">Your box, their smile, the aftermath. Always anonymous.</p>
            <input value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={140} placeholder="Caption (optional)"
              aria-label="Photo caption" className="mt-3 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-gold" />
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="mt-3 h-12 w-full rounded-full bg-gold-gradient font-display text-lg text-primary-foreground shadow-glow disabled:opacity-40">
              {uploading ? "Developing…" : "Choose a Photo"}
            </button>
          </div>
          {photos.length === 0 ? (
            <p className="mt-6 text-center text-muted-foreground">No memories yet. Yours could be the first.</p>
          ) : (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {photos.map((p) => (
                <figure key={p.id} className="overflow-hidden rounded-2xl border bg-card">
                  {p.url && <img src={p.url} alt={p.caption ?? "A secret admirer's photo"} loading="lazy" className="aspect-square w-full object-cover" />}
                  <figcaption className="flex items-center justify-between gap-2 p-2 text-sm">
                    <span className="line-clamp-1 flex-1 text-muted-foreground">{p.caption ?? "— A Secret Admirer"}</span>
                    <button onClick={() => swoonPhoto(p.id)} aria-pressed={photoMine.includes(`photo:${p.id}`)} aria-label="Swoon for this photo"
                      className={cn("flex min-h-9 items-center gap-1 rounded-full border px-2", photoMine.includes(`photo:${p.id}`) && "bg-accent text-accent-foreground")}>
                      <OptArt id="heart" alt="" className="h-4 w-4 rounded-full object-cover" /> {p.swoon_count + (photoMine.includes(`photo:${p.id}`) ? 1 : 0)}
                    </button>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "confessions" && (<>
      <section className="mt-5 rounded-2xl border bg-card p-4">
        <p className="text-sm uppercase tracking-[0.2em] text-gold">Most craved blends</p>

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
      </>)}
    </Shell>
  );
}
