import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { guest } from "@/lib/guest";
import { TIERS, STRENGTHS, AROMAS, DURATIONS, CARDS, HANDWRITTEN, orderTotal, addonsTotal, potionsTotal, blendOutcome } from "@/lib/catalog";
import { PotionCabinet } from "@/components/potion-cabinet";
import { Chip, GoldButton, Label, Option, Shell } from "@/components/kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/send")({
  head: () => ({
    meta: [
      { title: "Send Enchanted Chocolates — Amortentia Post" },
      { name: "description", content: "Choose a box, brew your potion, add a handwritten note, and send it by owl." },
      { property: "og:title", content: "Send Enchanted Chocolates" },
      { property: "og:description", content: "Brew the potion that makes them yours." },
    ],
  }),
  component: Send,
});

const TITLES = ["Choose Your Box", "The Potion Cabinet", "Brew Your Longing", "Add a Little Extra", "Confess Your Heart", "Seal & Send"];

function Send() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [potions, setPotions] = useState<string[]>([]);
  const [tier, setTier] = useState("true");
  const [strength, setStrength] = useState("swoon");
  const [aroma, setAroma] = useState("rose");
  const [duration, setDuration] = useState("hour");
  const [handwritten, setHandwritten] = useState(false);
  const [handText, setHandText] = useState("");
  const [card, setCard] = useState<string | null>(null);
  const [to, setTo] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [from, setFrom] = useState("");
  const [note, setNote] = useState("");
  const [share, setShare] = useState(true);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const durId = DURATIONS.find((d) => d.id === duration) ? duration : DURATIONS[0]!.id;
  const total = Math.round((orderTotal(tier, strength, durId) + potionsTotal(potions) + addonsTotal(handwritten, card)) * 100) / 100;
  const outcome = blendOutcome(potions);
  const canNext =
    (step !== 1 || potions.length > 0) &&
    (step !== 3 || !handwritten || handText.trim().length > 0) &&
    (step !== 4 || (to.trim() && from.trim() && /\S+@\S+\.\S+/.test(toEmail)));

  async function submit() {
    setBusy(true);
    const u = { user: null as null | { id: string } };
    let error: unknown = null;
    if (u.user) {
      ({ error } = await supabase.from("orders").insert({
        tier, strength, aroma, duration: durId,
        sender_name: from.trim(), recipient_name: to.trim(), recipient_email: toEmail.trim(),
        note: note.trim() || null, total, share_on_wall: share,
        addons: [handwritten ? "handwritten" : null, card ? `card:${card}` : null].filter(Boolean) as string[],
        handwritten_text: handwritten ? handText.trim() : null,
        potions, outcome: outcome?.name ?? null,
      }));
    } else {
      guest.addOrder({ id: crypto.randomUUID(), tier, recipient_name: to.trim(), total, created_at: new Date().toISOString() });
      if (share) ({ error } = await supabase.from("confessions").insert({ tier, strength, aroma, note: note.trim().slice(0, 200) || null, potions, outcome: outcome?.name ?? null }));
    }
    setBusy(false);
    if (error) { toast.error("The owl dropped your box. Try again."); return; }
    setSent(true);
  }

  if (sent)
    return (
      <Shell>
        <div className="my-auto text-center">
          <div className="sparkle text-7xl">🦉</div>
          <h2 className="mt-6 font-display text-3xl text-gold-gradient">Owl Dispatched</h2>
          <p className="mt-3 text-lg text-muted-foreground">Your enchanted box is flying to {to}. Soon, they'll only have eyes for you.</p>
          <div className="mt-8 space-y-3">
            <GoldButton onClick={() => navigate({ to: "/wall" })}>See the Wall</GoldButton>
            <button onClick={() => navigate({ to: "/me" })} className="h-12 w-full rounded-full border text-gold">My Letters</button>
          </div>
        </div>
      </Shell>
    );

  return (
    <Shell>
      <header className="flex items-center gap-3">
        {step > 0 && <button aria-label="Back" onClick={() => setStep(step - 1)} className="grid h-11 w-11 place-items-center rounded-full border text-gold">‹</button>}
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Step {step + 1} of {TITLES.length}</p>
          <h2 className="font-display text-xl text-gold">{TITLES[step]}</h2>
        </div>
      </header>
      <div className="mt-4 flex gap-1.5">
        {TITLES.map((s, i) => <div key={s} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-gold-gradient" : "bg-muted")} />)}
      </div>

      <main className="mt-6 flex-1 space-y-3 pb-36">
        {step === 0 && TIERS.map((t) => (
          <Option key={t.id} active={tier === t.id} onClick={() => setTier(t.id)}>
            <div className="text-4xl">{t.pieces < 10 ? "💝" : t.pieces < 20 ? "❤️‍🔥" : t.pieces < 40 ? "💘" : t.pieces < 60 ? "💖" : "👑"}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl font-semibold">{t.name}</span>
                {t.id === "true" && <span className="rounded-full bg-gold-gradient px-2 py-0.5 text-xs font-bold text-primary-foreground">Popular</span>}
              </div>
              <p className="text-muted-foreground">{t.pieces} chocolates · {t.blurb}</p>
            </div>
            <span className="text-xl font-bold text-gold">${t.price}</span>
          </Option>
        ))}

        {step === 1 && <PotionCabinet value={potions} onChange={setPotions} />}

        {step === 2 && (
          <>
            <Label>How badly do you want them?</Label>
            {STRENGTHS.map((s) => (
              <Option key={s.id} active={strength === s.id} onClick={() => setStrength(s.id)}>
                <div className="flex-1"><div className="text-lg font-semibold">{s.name}</div><p className="text-muted-foreground">{s.desc}</p></div>
                <span className="text-gold">+${s.price}</span>
              </Option>
            ))}
            <Label>The scent that reminds them of you</Label>
            <div className="flex flex-wrap gap-2">
              {AROMAS.map((a) => <Chip key={a.id} active={aroma === a.id} onClick={() => setAroma(a.id)}>{a.name}</Chip>)}
            </div>
            <Label>How long they'll be yours</Label>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => (
                <Chip key={d.id} active={durId === d.id} onClick={() => setDuration(d.id)}>
                  {d.name}<br /><span className="text-xs opacity-75">+${d.price}</span>
                </Chip>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <Label>Handwritten by our scribes</Label>
            <Option active={handwritten} onClick={() => setHandwritten(!handwritten)}>
              <div className="text-3xl">✒️</div>
              <div className="flex-1"><div className="text-lg font-semibold">{HANDWRITTEN.name}</div><p className="text-muted-foreground">{HANDWRITTEN.desc}</p></div>
              <span className="text-gold">+${HANDWRITTEN.price}</span>
            </Option>
            {handwritten && (
              <textarea value={handText} onChange={(e) => setHandText(e.target.value)} maxLength={300} rows={4}
                placeholder="What should we write, in your words?"
                className="w-full resize-none rounded-2xl bg-parchment p-4 font-serif text-lg italic text-parchment-foreground outline-none" />
            )}
            <Label>Pick a card (optional)</Label>
            {CARDS.map((c) => (
              <Option key={c.id} active={card === c.id} onClick={() => setCard(card === c.id ? null : c.id)}>
                <div className="text-3xl">{c.emoji}</div>
                <div className="flex-1"><div className="text-lg font-semibold">{c.name}</div><p className="text-muted-foreground">{c.desc}</p></div>
                <span className="text-gold">+${c.price}</span>
              </Option>
            ))}
          </>
        )}

        {step === 4 && (
          <div className="rounded-2xl bg-parchment p-5 text-parchment-foreground shadow-glow">
            <Field label="To my beloved" value={to} onChange={setTo} placeholder="Their name" />
            <Field label="Their email" value={toEmail} onChange={setToEmail} placeholder="So the owl can find them" type="email" />
            <Field label="From your admirer" value={from} onChange={setFrom} placeholder="Your name" />
            <label className="mt-2 block text-sm font-semibold uppercase tracking-wider">Your confession</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} rows={4} placeholder="Every time I see you…"
              className="mt-1 w-full resize-none rounded-lg border border-parchment-foreground/30 bg-transparent p-3 text-lg italic outline-none" />
            <p className="text-right text-xs opacity-60">{note.length}/200</p>
          </div>
        )}

        {step === 5 && (
          <>
            <div className="space-y-2 rounded-2xl border bg-card p-5">
              <Row k="Box" v={TIERS.find((t) => t.id === tier)!.name} />
              <Row k="Blend" v={outcome?.name ?? "—"} />
              <Row k="Potions" v={`${potions.length} potions`} />
              <Row k="Potency" v={STRENGTHS.find((s) => s.id === strength)!.name} />
              <Row k="Scent" v={AROMAS.find((a) => a.id === aroma)!.name} />
              <Row k="Lasts" v={DURATIONS.find((d) => d.id === durId)!.name} />
              {handwritten && <Row k="Extra" v="Handwritten note" />}
              {card && <Row k="Card" v={CARDS.find((c) => c.id === card)!.name} />}
              <Row k="To" v={to} />
            </div>
            <Option active={share} onClick={() => setShare(!share)}>
              <div className="text-2xl">{share ? "💘" : "🤫"}</div>
              <div className="flex-1">
                <div className="font-semibold">Share anonymously on the Wall</div>
                <p className="text-sm text-muted-foreground">Your confession only. Never your name or theirs.</p>
              </div>
            </Option>
          </>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-16 z-30 mx-auto max-w-md border-t bg-background/95 px-5 pb-3 pt-3 backdrop-blur">
        <div className="mb-2 flex justify-between text-muted-foreground">
          <span>Total</span><span className="text-lg font-bold text-gold">${total.toFixed(2)}</span>
        </div>
        <GoldButton disabled={!canNext || busy} onClick={() => (step === 5 ? submit() : setStep(step + 1))}>
          {step === 5 ? (busy ? "Summoning owl…" : "Send by Owl 🦉") : "Continue"}
        </GoldButton>
      </div>
    </Shell>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <label className="mb-3 block">
      <span className="text-sm font-semibold uppercase tracking-wider">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="mt-1 h-12 w-full border-b border-parchment-foreground/40 bg-transparent text-xl outline-none" />
    </label>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span></div>;
}
