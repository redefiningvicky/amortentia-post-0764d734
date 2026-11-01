import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { restoreRecipe } from "@/lib/recipe";
import { guest } from "@/lib/guest";
import type { Database } from "@/integrations/supabase/types";
import { findBrewable, STRENGTHS, ALL_BOXES } from "@/lib/catalog";
import { GoldButton, Shell } from "@/components/kit";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CONFESSION_LIMIT, validConfession } from "@/lib/confession";
import { ShowMore, useShowMore } from "@/components/blend-browse";

import sampleUnboxing from "@/assets/album-unboxing.jpg";
import sampleBite from "@/assets/album-firstbite.jpg";
import sampleKeepsake from "@/assets/album-keepsake.jpg";
import sampleFriends from "@/assets/album-friends.jpg";
import sampleDesk from "@/assets/album-desk.jpg";
import sampleDinner from "@/assets/album-dinner.jpg";
import samplePark from "@/assets/album-park.jpg";
import sampleBed from "@/assets/album-bed.jpg";
import sampleBiteHand from "@/assets/album-bite-hand.jpg";
import sampleDoorstep from "@/assets/album-doorstep.jpg";
import sampleTrain from "@/assets/album-train.jpg";
import sampleRain from "@/assets/album-rain.jpg";
import sampleFireplace from "@/assets/album-fireplace.jpg";
import sampleBeach from "@/assets/album-beach.jpg";
import sampleMorning from "@/assets/album-morning.jpg";
import sampleRooftop from "@/assets/album-rooftop.jpg";
import { OptArt } from "@/components/opt-art";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/wall")({
  head: () => ({
    meta: [
      { title: "Secret Admirer Wall — Amortentia Post" },
      {
        name: "description",
        content:
          "Anonymous love confessions sent with enchanted chocolates. Swoon for your favorites.",
      },
      { property: "og:title", content: "Secret Admirer Wall" },
      {
        property: "og:description",
        content: "Read anonymous confessions and see the most-craved love potions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Wall,
});

const name = (list: { id: string; name: string }[], id: string) =>
  list.find((x) => x.id === id)?.name ?? id;
const SAMPLE_PHOTOS = [
  {
    id: "sample-unboxing",
    url: sampleUnboxing,
    label: "The Unboxing",
    caption: "The group chat demanded an unboxing.",
  },
  {
    id: "sample-bite",
    url: sampleBite,
    label: "The First Bite",
    caption: "One bite. Seventeen drafts of a text.",
  },
  {
    id: "sample-keepsake",
    url: sampleKeepsake,
    label: "The Keepsake",
    caption: "Kept the box. Still checking my phone.",
  },
  {
    id: "sample-friends",
    url: sampleFriends,
    label: "The Spilled Secret",
    caption: "She made us promise not to tell. We told everyone.",
  },
  {
    id: "sample-desk",
    url: sampleDesk,
    label: "The Unsent Reply",
    caption: "Started a reply letter. Ate three instead.",
  },
  {
    id: "sample-dinner",
    url: sampleDinner,
    label: "The Third Wheel",
    caption: "He set two places. I only brought the chocolates.",
  },
  {
    id: "sample-park",
    url: samplePark,
    label: "The Bench",
    caption: "Left on our bench. I sat there anyway.",
  },
  {
    id: "sample-bed",
    url: sampleBed,
    label: "The Morning After",
    caption: "Breakfast in bed, courtesy of a secret admirer.",
  },
  {
    id: "sample-bite-hand",
    url: sampleBiteHand,
    label: "The Moment It Hit",
    caption: "The exact moment the potion kicked in.",
  },
  {
    id: "sample-doorstep",
    url: sampleDoorstep,
    label: "The Delivery",
    caption: "The owl barely made it out alive.",
  },
  {
    id: "sample-train",
    url: sampleTrain,
    label: "The Long Ride",
    caption: "Nine-hour train ride. The box lasted nine minutes.",
  },
  {
    id: "sample-rain",
    url: sampleRain,
    label: "The Rainy Day",
    caption: "Raining outside. Warm in here. Suspiciously warm.",
  },
  {
    id: "sample-fireplace",
    url: sampleFireplace,
    label: "The Last Chocolate",
    caption: "We both reached for the last one. Now we're engaged.",
  },
  {
    id: "sample-beach",
    url: sampleBeach,
    label: "The Sunset Picnic",
    caption: "Sunset, a rose, and twelve tiny life choices.",
  },
  {
    id: "sample-morning",
    url: sampleMorning,
    label: "The Missing Bite",
    caption: "Found a bite missing before breakfast. I know who did it.",
  },
  {
    id: "sample-rooftop",
    url: sampleRooftop,
    label: "The Midnight Toast",
    caption: "New Year's toast. The chocolates were the real fireworks.",
  },
];

function Wall() {
  const qc = useQueryClient();
  const [rankingsOpen, setRankingsOpen] = useState(true);
  useEffect(() => {
    try {
      setRankingsOpen(localStorage.getItem("ap-rankings-open") !== "false");
    } catch {
      /* Keep the current preference when storage is unavailable. */
    }
  }, []);

  const [tab, setTab] = useState<"confessions" | "album">("confessions");
  const [sort, setSort] = useState<"hot" | "new">("hot");
  const [confessing, setConfessing] = useState(false);
  const [confession, setConfession] = useState("");
  const [posting, setPosting] = useState(false);
  // Pretend posting: the confession shows in this session only, never saved to the Wall.
  const [localConfessions, setLocalConfessions] = useState<
    {
      id: string;
      note: string;
      tier: string;
      strength: string;
      aroma: string;
      potions: string[];
      swoon_count: number;
      created_at: string;
      outcome: string | null;
    }[]
  >([]);
  async function postConfession() {
    if (!validConfession(confession) || posting) return;
    setPosting(true);
    await new Promise((r) => setTimeout(r, 700));
    setPosting(false);
    setLocalConfessions((prev) => [
      {
        id: `local-${Date.now()}`,
        note: confession.trim(),
        tier: "confession",
        strength: "swoon",
        aroma: "rose",
        potions: [],
        swoon_count: 0,
        created_at: new Date().toISOString(),
        outcome: null,
      },
      ...prev,
    ]);
    setConfession("");
    setConfessing(false);
    setSort("new");
    toast.success("Your confession is on the Wall for this visit. Names stay secret.");
  }
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    setUserId(null);
  }, []);

  const [cachedConfessions, setCachedConfessions] = useState<
    Database["public"]["Tables"]["confessions"]["Row"][]
  >([]);
  useEffect(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem("ap-wall-cache-v1") ?? "null");
      if (Array.isArray(saved))
        setCachedConfessions(
          saved.filter((row) => row && typeof row.id === "string" && Array.isArray(row.potions)),
        );
    } catch {
      /* A damaged cache must not block the Wall. */
    }
  }, []);
  const {
    data: liveRows,
    error: confessionsError,
    refetch: retryConfessions,
    isFetching: confessionsLoading,
  } = useQuery({
    queryKey: ["confessions", sort],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("confessions")
        .select("*")
        .order(sort === "hot" ? "swoon_count" : "created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });
  useEffect(() => {
    if (!liveRows?.length) return;
    setCachedConfessions(liveRows);
    try {
      localStorage.setItem("ap-wall-cache-v1", JSON.stringify(liveRows));
    } catch {
      /* Continue browsing if storage is full. */
    }
  }, [liveRows]);
  const rows = liveRows ?? cachedConfessions;
  const [guestSwoons, setGuestSwoons] = useState<string[]>([]);
  useEffect(() => setGuestSwoons(guest.swoons()), []);
  const { data: dbSwoons = [] } = useQuery({
    queryKey: ["my-swoons", userId],
    enabled: !!userId,
    queryFn: async () =>
      (await supabase.from("swoons").select("confession_id")).data?.map((s) => s.confession_id) ??
      [],
  });
  const mine = userId ? dbSwoons : guestSwoons;
  const count = (r: { id: string; swoon_count: number }) =>
    r.swoon_count + (!userId && guestSwoons.includes(r.id) ? 1 : 0);

  const scores = new Map<string, number>();
  rows.forEach(
    (r) => r.outcome && scores.set(r.outcome, (scores.get(r.outcome) ?? 0) + r.swoon_count + 1),
  );
  const trending = [...scores.entries()]
    .map(([name, score]) => ({ id: name, name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // Confession feed: 10 at a time; changing the sort starts over at 10.
  const feed = [...localConfessions, ...rows].sort((a, b) =>
    sort === "hot" ? count(b) - count(a) : Date.parse(b.created_at) - Date.parse(a.created_at),
  );
  const {
    visible: feedVisible,
    shown: feedShown,
    total: feedTotal,
    more: showMoreConfessions,
  } = useShowMore(feed, sort);

  async function swoon(id: string) {
    const has = mine.includes(id);
    if (!userId) {
      const next = has ? guestSwoons.filter((x) => x !== id) : [...guestSwoons, id];
      guest.saveSwoons(next);
      setGuestSwoons(next);
      return;
    }
    const { error } = has
      ? await supabase.from("swoons").delete().eq("confession_id", id).eq("user_id", userId)
      : await supabase.from("swoons").insert({ confession_id: id });
    if (error) {
      toast.error("Couldn't swoon, try again");
      return;
    }
    qc.invalidateQueries({ queryKey: ["confessions"] });
    qc.invalidateQueries({ queryKey: ["my-swoons"] });
  }

  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const { data: photos = [] } = useQuery({
    queryKey: ["wall-photos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wall_photos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;
      if (!data.length) return [];
      const { data: signed } = await supabase.storage.from("wall-photos").createSignedUrls(
        data.map((p) => p.image_path),
        3600,
      );
      const urls = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
      return data.map((p) => ({ ...p, url: urls.get(p.image_path) ?? "" }));
    },
  });
  const photoMine = guestSwoons.filter((s) => s.startsWith("photo:"));
  function swoonPhoto(id: string) {
    const key = `photo:${id}`;
    const next = photoMine.includes(key)
      ? guestSwoons.filter((x) => x !== key)
      : [...guestSwoons, key];
    guest.saveSwoons(next);
    setGuestSwoons(next);
  }
  // Pretend pinning: pick a sample memory; it shows in this session only, nothing is uploaded.
  const [picking, setPicking] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<(typeof SAMPLE_PHOTOS)[number] | null>(null);
  const [pinned, setPinned] = useState<{ id: string; url: string; caption: string }[]>([]);
  async function pinSample(photo: (typeof SAMPLE_PHOTOS)[number]) {
    setPicking(false);
    setPhotoPreview(null);
    setUploading(true);
    await new Promise((r) => setTimeout(r, 700));
    setUploading(false);
    setPinned((prev) => [
      { id: `pin-${Date.now()}`, url: photo.url, caption: caption.trim() || photo.caption },
      ...prev,
    ]);
    setCaption("");
    toast.success("Pinned to the album");
  }

  const albumItems = [
    ...pinned.map((p) => ({ ...p, label: "Your Pinned Memory", swoon_count: 0 })),
    ...photos.map((p) => ({
      ...p,
      label: "A Secret Admirer’s Memory",
      caption: p.caption ?? "",
      swoon_count: p.swoon_count ?? 0,
    })),
    ...SAMPLE_PHOTOS.map((p) => ({ ...p, swoon_count: 0 })),
  ];
  const albumPage = useShowMore(albumItems, "album", 6);
  return (
    <Shell>
      <h1 className="font-display text-3xl text-gold-gradient">Secret Admirer Wall</h1>
      <p className="mt-1 text-muted-foreground">Anonymous confessions, sealed in chocolate.</p>
      <Dialog open={confessing} onOpenChange={setConfessing}>
        <DialogContent className="max-w-sm border-gold bg-background">
          <DialogHeader>
            <DialogTitle className="font-display text-xl text-gold">Confess Your Own</DialogTitle>
            <DialogDescription>
              No names. No purchase. Just the thing you wish you could say.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void postConfession();
            }}
          >
            <label htmlFor="wall-confession" className="text-sm text-gold">
              Your secret confession
            </label>
            <textarea
              id="wall-confession"
              value={confession}
              onChange={(event) => setConfession(event.target.value)}
              maxLength={CONFESSION_LIMIT}
              rows={5}
              placeholder="I rehearsed saying hello. Then I said ‘you too’ when you said happy birthday."
              className="mt-2 w-full resize-none rounded-lg bg-parchment p-4 text-lg italic text-parchment-foreground"
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">
              {confession.length}/{CONFESSION_LIMIT}
            </p>
            <p className="my-3 text-sm text-muted-foreground">
              Appears as A Secret Admirer for this visit only. Leave out names and contact details.
            </p>
            <GoldButton type="submit" disabled={!validConfession(confession) || posting}>
              {posting ? "Sealing your secret…" : "Post My Confession"}
            </GoldButton>
          </form>
        </DialogContent>
      </Dialog>

      <div className="mt-4 flex gap-2">
        {(
          [
            ["confessions", "Confessions"],
            ["album", "Photo Album"],
          ] as const
        ).map(([t, l]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "min-h-11 rounded-full border px-4",
              tab === t ? "bg-gold-gradient text-primary-foreground" : "bg-card",
            )}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === "album" && (
        <section className="mt-4">
          <div className="rounded-2xl border border-gold bg-card p-4">
            <p className="font-display text-lg text-gold-gradient">Pin a memory</p>
            <p className="text-sm text-muted-foreground">
              Your box, their smile, the aftermath. Your name is not displayed.
            </p>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={140}
              placeholder="Caption (optional)"
              aria-label="Photo caption"
              className="mt-3 h-12 w-full rounded-xl border bg-background px-4 outline-none focus:border-gold"
            />
            <button
              onClick={() => setPicking(true)}
              disabled={uploading}
              className="mt-3 h-12 w-full rounded-full bg-gold-gradient font-display text-lg text-primary-foreground shadow-glow disabled:opacity-40"
            >
              {uploading ? "Developing…" : "Choose a Photo"}
            </button>
          </div>
          <Dialog open={picking} onOpenChange={setPicking}>
            <DialogContent className="max-h-[80vh] max-w-sm overflow-y-auto border-gold bg-background">
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-gold">Choose a Photo</DialogTitle>
                <DialogDescription>Choose a memory from the shop’s collection.</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_PHOTOS.map((photo) => (
                  <button
                    key={photo.id}
                    onClick={() => {
                      setPicking(false);
                      setPhotoPreview(photo);
                    }}
                    className="overflow-hidden rounded-xl border text-left transition hover:border-gold"
                  >
                    <img
                      src={photo.url}
                      alt={photo.label}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                    <span className="block p-2 text-xs text-muted-foreground">{photo.label}</span>
                  </button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog
            open={!!photoPreview}
            onOpenChange={(open) => {
              if (!open) setPhotoPreview(null);
            }}
          >
            <DialogContent className="max-h-[85dvh] max-w-sm overflow-y-auto border-gold bg-background">
              <DialogHeader>
                <DialogTitle>Pin This Memory?</DialogTitle>
                <DialogDescription>
                  Your chosen memory appears in this visit’s album.
                </DialogDescription>
              </DialogHeader>
              {photoPreview && (
                <img
                  src={photoPreview.url}
                  alt={photoPreview.label}
                  className="aspect-square w-full rounded-lg object-cover"
                />
              )}
              <input
                aria-label="Preview photo caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={140}
                placeholder="Caption (optional)"
                className="h-12 rounded-lg border bg-card px-3"
              />
              <GoldButton
                disabled={uploading}
                onClick={() => photoPreview && void pinSample(photoPreview)}
              >
                Pin My Memory
              </GoldButton>
              <Button variant="outline" onClick={() => setPhotoPreview(null)}>
                Cancel
              </Button>
            </DialogContent>
          </Dialog>
          <h2 className="mt-6 font-display text-lg text-gold">A little album inspiration</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {albumPage.visible.map((photo) => (
              <figure key={photo.id} className="overflow-hidden rounded-lg border bg-card">
                {photo.url && (
                  <img
                    src={photo.url}
                    alt={photo.caption || photo.label}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                )}
                <figcaption className="p-3 text-sm text-muted-foreground">
                  <span className="mb-1 block text-xs uppercase text-gold">{photo.label}</span>
                  {photo.caption}
                  <button
                    onClick={() => swoonPhoto(photo.id)}
                    aria-pressed={photoMine.includes(`photo:${photo.id}`)}
                    aria-label={`Swoon for ${photo.label}`}
                    className={cn(
                      "mt-2 flex min-h-11 items-center gap-2 rounded-full border px-3",
                      photoMine.includes(`photo:${photo.id}`) && "bg-accent text-accent-foreground",
                    )}
                  >
                    <OptArt id="heart" alt="" className="h-5 w-5 rounded-full object-cover" />
                    {photo.swoon_count + (photoMine.includes(`photo:${photo.id}`) ? 1 : 0)}
                  </button>
                </figcaption>
              </figure>
            ))}
          </div>
          <ShowMore
            shown={albumPage.shown}
            total={albumPage.total}
            noun="photos"
            onMore={albumPage.more}
          />
        </section>
      )}

      {tab === "confessions" && (
        <>
          {confessionsError && (
            <div role="alert" className="mt-4 rounded-xl border border-gold bg-card p-4">
              <p className="text-gold">The owl can’t reach the confession archive.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                The Wall’s database is temporarily unavailable.
                {cachedConfessions.length > 0
                  ? " Showing the last saved confessions on this device."
                  : " Confessions will return when the connection is restored."}
              </p>
              <Button
                variant="outline"
                className="mt-3 min-h-11"
                disabled={confessionsLoading}
                onClick={() => void retryConfessions()}
              >
                {confessionsLoading ? "Trying again…" : "Retry Confessions"}
              </Button>
            </div>
          )}

          <GoldButton className="mt-5" onClick={() => setConfessing(true)}>
            Confess Your Own
          </GoldButton>
          <section className="mt-5 rounded-2xl border bg-card p-4">
            <button
              className="flex min-h-11 w-full items-center justify-between text-left text-sm uppercase tracking-[0.2em] text-gold"
              aria-expanded={rankingsOpen}
              onClick={() =>
                setRankingsOpen((open) => {
                  try {
                    localStorage.setItem("ap-rankings-open", String(!open));
                  } catch {
                    /* Keep the current preference when storage is unavailable. */
                  }
                  return !open;
                })
              }
            >
              Most craved blends <span aria-hidden="true">{rankingsOpen ? "⌃" : "⌄"}</span>
            </button>
            {rankingsOpen &&
              trending.map((t, i) => (
                <div key={t.id} className="mt-2 flex items-center gap-3">
                  <span className="w-6 font-display text-gold">{i + 1}</span>
                  <span className="flex-1 text-lg">{t.name}</span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <OptArt id="heart" alt="swoons" className="h-5 w-5 rounded-full object-cover" />{" "}
                    {t.score}
                  </span>
                </div>
              ))}
          </section>

          <div className="mt-5 flex gap-2">
            {(["hot", "new"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={cn(
                  "min-h-11 rounded-full border px-4",
                  sort === s ? "bg-gold-gradient text-primary-foreground" : "bg-card",
                )}
              >
                {s === "hot" ? "Most Smitten" : "Newest"}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-3">
            {feedVisible.map((r) => (
              <article
                key={r.id}
                className="rounded-2xl bg-parchment p-4 text-parchment-foreground"
              >
                {r.note && <p className="text-xl italic">“{r.note}”</p>}
                <p className="mt-3 font-display text-base text-accent">
                  {r.outcome ?? "No Potion Needed"}
                </p>
                <p className="text-xs uppercase tracking-wider opacity-70">
                  {r.tier === "confession" ? (
                    "A secret, straight from the heart"
                  ) : (
                    <>
                      {name(ALL_BOXES, r.tier)} ·{" "}
                      {r.potions.length
                        ? r.potions
                            .map((id) => findBrewable(id)?.name)
                            .filter(Boolean)
                            .join(" + ")
                        : name(STRENGTHS, r.strength)}
                    </>
                  )}
                </p>
                {r.potions.length > 0 &&
                  (restoreRecipe(r.potions) ? (
                    <Link
                      to="/spellbook"
                      search={{ recipe: r.potions.join(",") }}
                      className="mt-3 inline-flex min-h-11 items-center rounded-full border border-parchment-foreground/30 px-4 text-sm"
                    >
                      Brew This Blend
                    </Link>
                  ) : (
                    <p className="mt-2 text-sm opacity-70">This recipe is unavailable.</p>
                  ))}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm opacity-70">— A Secret Admirer</span>
                  <button
                    onClick={() => swoon(r.id)}
                    aria-pressed={mine.includes(r.id)}
                    className={cn(
                      "flex min-h-11 items-center gap-2 rounded-full border border-parchment-foreground/30 px-4",
                      mine.includes(r.id) && "bg-accent text-accent-foreground",
                    )}
                  >
                    <OptArt id="heart" alt="swoon" className="h-5 w-5 rounded-full object-cover" />{" "}
                    {count(r)}
                  </button>
                </div>
              </article>
            ))}
          </div>
          <ShowMore
            shown={feedShown}
            total={feedTotal}
            noun="confessions"
            onMore={showMoreConfessions}
          />

          <Button
            onClick={() => setConfessing(true)}
            className="mt-6 h-14 rounded-full bg-gold-gradient font-display text-lg text-primary-foreground shadow-glow"
          >
            Confess Your Own
          </Button>
        </>
      )}
    </Shell>
  );
}
