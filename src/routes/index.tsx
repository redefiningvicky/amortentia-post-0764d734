import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import hero from "@/assets/hero.jpg";
import { TIERS, STRENGTHS, AROMAS, DURATIONS, orderTotal } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amortentia Post — Enchanted Chocolates by Owl" },
      { name: "description", content: "Send a heart-shaped box of love-potion chocolates, sealed in vintage post." },
      { property: "og:title", content: "Amortentia Post — Enchanted Chocolates" },
      { property: "og:description", content: "Pick a box, brew your potion, and send it by owl." },
    ],
  }),
  component: App,
});

const STEPS = ["Box", "Potion", "Letter", "Seal"];

function App() {
  const [step, setStep] = useState(-1);
  const [tier, setTier] = useState("true");
  const [strength, setStrength] = useState("flutter");
  const [aroma, setAroma] = useState("rose");
  const [duration, setDuration] = useState("hour");
  const [to, setTo] = useState("");
  const [from, setFrom] = useState("");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const total = orderTotal(tier, strength, duration);

  if (step === -1) {
    return (
      <Shell>
        <div className="relative -mx-5 -mt-6 h-[58vh] overflow-hidden rounded-b-[2rem]">
          <img src={hero} alt="Heart-shaped chocolate box wrapped in vintage post" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
        <div className="-mt-16 relative text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gold">Est. by Owl Post</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-gold-gradient">Amortentia Post</h1>
          <p className="mx-auto mt-3 max-w-xs text-lg text-muted-foreground">
            You've waited long enough to be loved back. One bite of our potion-brewed chocolates, and they'll finally see you.
          </p>
        </div>
        <CTA onClick={() => setStep(0)}>Make Them Mine ✦</CTA>
      </Shell>
    );
  }

  if (sent) {
    return (
      <Shell>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <div className="text-7xl sparkle">🦉</div>
          <h2 className="mt-6 font-display text-3xl text-gold-gradient">Owl Dispatched</h2>
          <p className="mt-3 max-w-xs text-lg text-muted-foreground">
            Your enchanted box is flying to {to || "your beloved"}. Expect swooning upon first bite.
          </p>
        </div>
        <CTA onClick={() => { setSent(false); setStep(-1); }}>Send Another</CTA>
      </Shell>
    );
  }

  const canNext = step !== 2 || (to.trim() && from.trim());

  return (
    <Shell>
      <header className="flex items-center gap-3">
        <button aria-label="Back" onClick={() => setStep(step - 1)} className="grid h-11 w-11 place-items-center rounded-full border text-gold">‹</button>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Step {step + 1} of 4</p>
          <h2 className="font-display text-xl text-gold">{["Choose Your Box", "Brew Your Longing", "Confess Your Heart", "Seal & Send"][step]}</h2>
        </div>
      </header>
      <div className="mt-4 flex gap-1.5">
        {STEPS.map((s, i) => (
          <div key={s} className={cn("h-1 flex-1 rounded-full", i <= step ? "bg-gold-gradient" : "bg-muted")} />
        ))}
      </div>

      <main className="mt-6 flex-1 space-y-3 pb-32">
        {step === 0 && TIERS.map((t) => (
          <Option key={t.id} active={tier === t.id} onClick={() => setTier(t.id)}>
            <div className="text-4xl">{t.pieces < 10 ? "💝" : t.pieces < 20 ? "❤️‍🔥" : "💘"}</div>
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

        {step === 1 && (
          <>
            <Label>Potency</Label>
            {STRENGTHS.map((s) => (
              <Option key={s.id} active={strength === s.id} onClick={() => setStrength(s.id)}>
                <div className="flex-1">
                  <div className="text-lg font-semibold">{s.name}</div>
                  <p className="text-muted-foreground">{s.desc}</p>
                </div>
                <span className="text-gold">{s.price ? `+$${s.price}` : "Included"}</span>
              </Option>
            ))}
            <Label>Aroma — what they'll smell</Label>
            <div className="flex flex-wrap gap-2">
              {AROMAS.map((a) => (
                <Chip key={a.id} active={aroma === a.id} onClick={() => setAroma(a.id)}>{a.name}</Chip>
              ))}
            </div>
            <Label>Enchantment lasts</Label>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => (
                <Chip key={d.id} active={duration === d.id} onClick={() => setDuration(d.id)}>
                  {d.name}<br /><span className="text-xs opacity-75">{d.price ? `+$${d.price}` : "Free"}</span>
                </Chip>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <div className="rounded-2xl bg-parchment p-5 text-parchment-foreground shadow-glow">
            <Field label="To my beloved" value={to} onChange={setTo} placeholder="Their name" />
            <Field label="From your admirer" value={from} onChange={setFrom} placeholder="Your name" />
            <label className="mt-4 block text-sm font-semibold uppercase tracking-wider">A note, sealed in wax</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} rows={4}
              placeholder="Every time I see you…"
              className="mt-1 w-full resize-none rounded-lg border border-parchment-foreground/30 bg-transparent p-3 text-lg italic outline-none focus:border-accent" />
            <p className="text-right text-xs opacity-60">{note.length}/200</p>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 rounded-2xl border bg-card p-5">
            <Row k="Box" v={TIERS.find((t) => t.id === tier)!.name} />
            <Row k="Potency" v={STRENGTHS.find((s) => s.id === strength)!.name} />
            <Row k="Aroma" v={AROMAS.find((a) => a.id === aroma)!.name} />
            <Row k="Lasts" v={DURATIONS.find((d) => d.id === duration)!.name} />
            <Row k="To" v={to} />
            <Row k="From" v={from} />
            {note && <p className="border-t pt-3 italic text-muted-foreground">"{note}"</p>}
          </div>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 mx-auto max-w-md border-t bg-background/90 px-5 pb-6 pt-3 backdrop-blur">
        <div className="mb-2 flex justify-between text-muted-foreground">
          <span>Total</span><span className="text-lg font-bold text-gold">${total.toFixed(2)}</span>
        </div>
        <button disabled={!canNext} onClick={() => (step === 3 ? setSent(true) : setStep(step + 1))}
          className="h-14 w-full rounded-full bg-gold-gradient font-display text-lg text-primary-foreground shadow-glow transition active:scale-95 disabled:opacity-40">
          {step === 3 ? "Send by Owl 🦉" : "Continue"}
        </button>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pt-6">{children}</div>;
}
function CTA({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <div className="mt-auto pb-8 pt-8">
      <button onClick={onClick} className="h-14 w-full rounded-full bg-gold-gradient font-display text-lg text-primary-foreground shadow-glow transition active:scale-95">{children}</button>
    </div>
  );
}
function Option({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={active}
      className={cn("flex w-full items-center gap-4 rounded-2xl border bg-card p-4 text-left transition", active && "border-gold shadow-glow")}>
      {children}
    </button>
  );
}
function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={active}
      className={cn("min-h-11 rounded-full border px-4 py-2 transition", active ? "bg-gold-gradient text-primary-foreground" : "bg-card")}>
      {children}
    </button>
  );
}
function Label({ children }: { children: React.ReactNode }) {
  return <p className="pt-3 text-sm uppercase tracking-[0.2em] text-gold">{children}</p>;
}
function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="mb-3 block">
      <span className="text-sm font-semibold uppercase tracking-wider">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="mt-1 h-12 w-full border-b border-parchment-foreground/40 bg-transparent font-display text-xl outline-none focus:border-accent" />
    </label>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span></div>;
}
