import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { demo } from "@/lib/demo";
import { ALL_BOXES, PACKAGING, KEEPSAKES, CARDS } from "@/lib/catalog";
import { BOX_ART } from "@/lib/art";
import { guest, type GiftDetails } from "@/lib/guest";
import { GoldButton, Shell } from "@/components/kit";
import { PotionResultCard } from "@/components/potion-result-card";
import { OptArt } from "@/components/opt-art";

type Search = {
  id: string;
  to: string;
  from: string;
  tier: string;
  blend: string;
  note: string;
  details?: string | undefined;
  preview?: boolean | undefined;
};
export const Route = createFileRoute("/gift")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const str = (k: string) => (typeof s[k] === "string" ? (s[k] as string) : "");
    return {
      id: str("id"),
      to: str("to"),
      from: str("from"),
      tier: str("tier"),
      blend: str("blend"),
      note: str("note"),
      details: str("details") || undefined,
      preview: s["preview"] === true || s["preview"] === "true",
    };
  },
  head: () => ({
    meta: [
      { title: "You've Got Enchanted Chocolates — Amortentia Post" },
      {
        name: "description",
        content: "Break the seal, unfold a confession, and take one very questionable bite.",
      },
    ],
  }),
  component: Gift,
});
const SYMPTOMS = [
  "Sudden urge to text them",
  "Uncontrollable smiling",
  "Heart doing a little flip",
  "Wondering what they're doing right now",
  "Rereading their messages",
];
function readDetails(s: Search): GiftDetails {
  const fallback: GiftDetails = {
    id: s.id,
    to: s.to,
    from: s.from,
    tier: s.tier,
    blend: s.blend,
    note: s.note,
  };
  try {
    const d = JSON.parse(s.details ?? "null");
    if (!d || typeof d !== "object" || d.id !== s.id) return fallback;
    const text = (key: string) => (typeof d[key] === "string" ? d[key] : undefined);
    return {
      ...fallback,
      wrapping: text("wrapping"),
      handwritten: text("handwritten"),
      card: text("card"),
      createdAt: text("createdAt"),
      keepsakes: Array.isArray(d.keepsakes)
        ? d.keepsakes.filter((v: unknown) => typeof v === "string")
        : [],
      potions: Array.isArray(d.potions)
        ? d.potions.filter((v: unknown) => typeof v === "string")
        : [],
    };
  } catch {
    return fallback;
  }
}
function Gift() {
  const s = Route.useSearch();
  const gift = useMemo(() => readDetails(s), [s]);
  const [stage, setStage] = useState<"sealed" | "note" | "open" | "bitten">("sealed");
  const [replaying, setReplaying] = useState(false);
  useEffect(() => {
    setStage("sealed");
    setReplaying(false);
  }, [s.id]);
  const box = ALL_BOXES.find((b) => b.id === gift.tier) ?? ALL_BOXES[1]!;
  const wrapping = PACKAGING.find((p) => p.id === gift.wrapping) ?? PACKAGING[0]!;
  const from = gift.from || "A Secret Admirer";
  useEffect(() => {
    if (stage === "sealed" || s.preview || !gift.id) return;
    try {
      guest.receive(gift);
    } catch {
      /* The gift remains usable if device storage is full. */
    }
    if (!replaying) demo.markGift(gift.id, stage === "bitten" ? "bite" : "open");
  }, [stage, s.id, s.preview, replaying, gift]);
  function replay() {
    setReplaying(true);
    setStage("sealed");
  }
  return (
    <Shell>
      {s.preview && (
        <p className="mb-4 rounded-lg border p-2 text-center text-sm text-gold">
          Unboxing preview · does not mark the gift opened
        </p>
      )}
      <div className="my-auto text-center">
        {stage === "sealed" && (
          <>
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Special Owl Delivery</p>
            <h1 className="mt-2 font-display text-3xl text-gold-gradient">
              {gift.to ? `${gift.to}, someone has a crush on you` : "Someone has a crush on you"}
            </h1>
            <p className="mt-4 text-muted-foreground">{wrapping.name}</p>
            <div className="relative mx-auto mt-6 w-64">
              <OptArt
                id={wrapping.id}
                alt={wrapping.name}
                className="aspect-square w-full rounded-3xl object-cover"
              />
              <button
                onClick={() => setStage("note")}
                aria-label="Break the wax seal"
                className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border-2 border-gold bg-card p-2 shadow-glow"
              >
                <OptArt id="seal" alt="" className="h-16 w-16 rounded-full object-cover" />
              </button>
            </div>
            <p className="mt-4 text-muted-foreground">
              Tap the wax seal. Your better judgment can wait.
            </p>
          </>
        )}
        {stage === "note" && (
          <div className="gift-unfold">
            <p className="text-sm uppercase tracking-[0.2em] text-gold">From {from}</p>
            <div className="mt-5 rounded-2xl bg-parchment p-5 text-parchment-foreground">
              <p className="font-display text-lg">To {gift.to || "my beloved"}</p>
              <blockquote className="mt-3 whitespace-pre-wrap break-words text-xl italic">
                {gift.note || "Some feelings are better expressed in chocolate."}
              </blockquote>
              {gift.handwritten && (
                <>
                  <p className="mt-5 text-xs uppercase">A note, penned by our scribes</p>
                  <blockquote className="mt-2 whitespace-pre-wrap break-words text-xl italic">
                    {gift.handwritten}
                  </blockquote>
                </>
              )}
            </div>
            {gift.card && (
              <p className="mt-3 text-gold">{CARDS.find((c) => c.id === gift.card)?.name}</p>
            )}
            <GoldButton className="mt-6" onClick={() => setStage("open")}>
              Reveal My Chocolates
            </GoldButton>
          </div>
        )}
        {stage === "open" && (
          <div className="gift-unfold">
            <h1 className="font-display text-3xl text-gold-gradient">{box.name}</h1>
            <img src={BOX_ART[box.id]} alt={box.name} className="mx-auto mt-5 w-64 rounded-3xl" />
            <p className="mt-3 text-gold">
              {box.pieces} tiny opportunities to lose your composure.
            </p>
            {gift.potions?.length ? (
              <div className="mt-4 text-left">
                <PotionResultCard ids={gift.potions} heading="Brewed just for you" showRecipe />
              </div>
            ) : (
              gift.blend && <p className="mt-3">Brewed with {gift.blend}</p>
            )}
            {!!gift.keepsakes?.length && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {gift.keepsakes.map((id) => {
                  const item = KEEPSAKES.find((k) => k.id === id);
                  return (
                    item && (
                      <div key={id} className="rounded-lg border bg-card p-3">
                        <OptArt
                          id={id}
                          alt={item.name}
                          className="mx-auto h-16 w-16 rounded-lg object-cover"
                        />
                        <p className="mt-2 text-sm">{item.name}</p>
                      </div>
                    )
                  );
                })}
              </div>
            )}
            <p className="mt-6 text-muted-foreground">
              Go on. Just one. What's the worst that could happen?
            </p>
            <GoldButton className="mt-4" onClick={() => setStage("bitten")}>
              Take a Bite
            </GoldButton>
          </div>
        )}
        {stage === "bitten" && (
          <>
            <OptArt id="heart" alt="" className="mx-auto h-24 w-24 rounded-full object-cover" />
            <h1 className="mt-5 font-display text-4xl text-gold-gradient">
              The potion is working…
            </h1>
            <p className="mt-3 text-lg">
              You suddenly can't stop thinking about <span className="text-gold">{from}</span>.
            </p>
            <div className="mt-6 space-y-2 text-left">
              <p className="text-sm uppercase tracking-[0.2em] text-gold">Symptoms detected</p>
              {SYMPTOMS.map((x, i) => (
                <div
                  key={x}
                  className="reveal rounded-xl border bg-card p-3"
                  style={{ animationDelay: `${i * 0.3}s` }}
                >
                  {x}
                </div>
              ))}
            </div>
            <Link
              to="/send"
              className="mt-6 flex min-h-14 items-center justify-center rounded-full bg-gold-gradient font-display text-lg text-primary-foreground"
            >
              Send One Back
            </Link>
          </>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {stage !== "sealed" && (
            <button
              className="min-h-11 rounded-full border px-4 text-sm text-gold"
              onClick={replay}
            >
              Replay Unboxing
            </button>
          )}
          {(stage === "sealed" || stage === "note") && (
            <button
              className="min-h-11 rounded-full border px-4 text-sm text-gold"
              onClick={() => setStage("open")}
            >
              Skip Animation
            </button>
          )}
          <Link
            to="/me"
            className="inline-flex min-h-11 items-center rounded-full border px-4 text-sm text-gold"
          >
            Back to My Gifts
          </Link>
        </div>
      </div>
    </Shell>
  );
}
