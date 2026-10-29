import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ALL_BOXES } from "@/lib/catalog";
import { BOX_ART } from "@/lib/art";
import { GoldButton, Shell } from "@/components/kit";

type Search = { id: string; to: string; from: string; tier: string; blend: string; note: string };

export const Route = createFileRoute("/gift")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const str = (k: string) => (typeof s[k] === "string" ? (s[k] as string) : "");
    return { id: str("id"), to: str("to"), from: str("from"), tier: str("tier"), blend: str("blend"), note: str("note") };
  },
  head: () => ({
    meta: [
      { title: "You've Got Enchanted Chocolates — Amortentia Post" },
      { name: "description", content: "Someone sent you a box of potion-brewed chocolates. Open it… and take a bite." },
      { property: "og:title", content: "Someone sent you enchanted chocolates 💘" },
      { property: "og:description", content: "A secret admirer brewed this just for you. One bite is all it takes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Gift,
});

const SYMPTOMS = ["Sudden urge to text them", "Uncontrollable smiling", "Heart doing a little flip", "Wondering what they're doing right now", "Rereading their messages"];

function Gift() {
  const s = Route.useSearch();
  const [stage, setStage] = useState<"closed" | "open" | "bitten">("closed");
  const box = ALL_BOXES.find((t) => t.id === s.tier) ?? ALL_BOXES[1]!;
  const from = s.from || "A Secret Admirer";

  useEffect(() => {
    if (stage !== "closed" && s.id) void supabase.rpc("mark_gift", { _id: s.id, _event: stage === "bitten" ? "bite" : "open" });
  }, [stage, s.id]);

  return (
    <Shell>
      <div className="my-auto text-center">
        {stage === "closed" && (
          <>
            <p className="text-sm uppercase tracking-[0.3em] text-gold">Special Owl Delivery</p>
            <h1 className="mt-2 font-display text-3xl text-gold-gradient">{s.to ? `${s.to}, someone has a crush on you` : "Someone has a crush on you"}</h1>
            <button onClick={() => setStage("open")} aria-label="Open the box" className="mx-auto mt-8 block w-64 animate-bounce">
              <img src={BOX_ART[box.id]} alt={box.name} width={816} height={816} className="rounded-3xl shadow-glow" />
            </button>
            <p className="mt-4 text-muted-foreground">Tap the box to open it 👆</p>
          </>
        )}
        {stage === "open" && (
          <>
            <p className="text-sm uppercase tracking-[0.3em] text-gold">From {from}</p>
            <h1 className="mt-2 font-display text-3xl text-gold-gradient">{box.name}</h1>
            {s.blend && <p className="mt-2 text-lg">Brewed with <span className="text-gold">{s.blend}</span></p>}
            {s.note && <blockquote className="mx-auto mt-5 max-w-xs rounded-2xl bg-parchment p-4 font-serif text-lg italic text-parchment-foreground">"{s.note}"</blockquote>}
            <p className="mt-6 text-muted-foreground">Go on. Just one. What's the worst that could happen? 😏</p>
            <GoldButton className="mt-4 text-2xl" onClick={() => setStage("bitten")}>Take a Bite 🍫</GoldButton>
          </>
        )}
        {stage === "bitten" && (
          <>
            <div className="relative h-40">
              {Array.from({ length: 14 }).map((_, i) => (
                <span key={i} className="absolute sparkle text-3xl" style={{ left: `${(i * 37) % 95}%`, top: `${(i * 53) % 90}%`, animationDelay: `${i * 0.15}s` }}>💘</span>
              ))}
            </div>
            <h1 className="font-display text-4xl text-gold-gradient">The potion is working…</h1>
            <p className="mt-3 text-lg">You suddenly can't stop thinking about <span className="text-gold">{from}</span>.</p>
            <div className="mt-6 space-y-2 text-left">
              <p className="text-sm uppercase tracking-[0.2em] text-gold">Symptoms detected</p>
              {SYMPTOMS.map((x, i) => (
                <div key={x} className="reveal rounded-xl border bg-card p-3" style={{ animationDelay: `${0.4 + i * 0.5}s` }}>✓ {x}</div>
              ))}
            </div>
            <Link to="/send" className="mt-8 flex h-14 w-full items-center justify-center rounded-full bg-gold-gradient font-display text-lg text-primary-foreground shadow-glow">
              Send One Back 💌
            </Link>
          </>
        )}
      </div>
    </Shell>
  );
}
