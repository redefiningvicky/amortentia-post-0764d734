import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { guest } from "@/lib/guest";
import { TIERS, SEASONAL, ALL_BOXES, POTIONS, MAX_BLEND, desperationLevel, STRENGTHS, DURATIONS, CARDS, HANDWRITTEN, orderTotal, addonsTotal, potionsTotal, blendOutcome, PACKAGING, DELIVERY, KEEPSAKES, ANTIDOTE, upgradesTotal, BUNDLES, bundleSavings, bundleMatches, bundlePrice, expressWaiver, FREE_EXPRESS_OVER } from "@/lib/catalog";
import { PotionCabinet } from "@/components/potion-cabinet";
import { Chip, GoldButton, Label, Option, Shell } from "@/components/kit";
import { cn } from "@/lib/utils";
import { BOX_ART } from "@/lib/art";
import { OptArt } from "@/components/opt-art";
import { makeShareCard } from "@/lib/share-card";

export const Route = createFileRoute("/send")({
  validateSearch: (s: Record<string, unknown>): { box?: string; bundle?: string; blend?: string } => ({
    box: typeof s.box === "string" && ALL_BOXES.some((b) => b.id === s.box) ? s.box : undefined,
    bundle: typeof s.bundle === "string" && BUNDLES.some((b) => b.id === s.bundle) ? s.bundle : undefined,
    blend: typeof s.blend === "string" ? [...new Set(s.blend.split(","))].filter((id) => POTIONS.some((p) => p.id === id)).slice(0, MAX_BLEND).join(",") : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Send Enchanted Chocolates — Amortentia Post" },
      { name: "description", content: "Choose a box, brew your potion, add a handwritten note, and send it by owl." },
      { property: "og:title", content: "Send Enchanted Chocolates" },
      { property: "og:description", content: "Brew the potion that makes them yours." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Send,
});

const TITLES = ["How Many Bites Will It Take?", "The Potion Cabinet (No Judgment)", "Stir the Cauldron", "Make It Impossible Not to Eat", "Wrap & Summon the Owl", "Spill Your Heart", "Seal Your Fate"];

function Send() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const initialBundle = BUNDLES.find((b) => b.id === search.bundle);
  const [step, setStep] = useState(0);
  useEffect(() => { window.scrollTo(0, 0); }, [step]);
  const [potions, setPotions] = useState<string[]>(search.blend ? search.blend.split(",") : []);
  const [keepsakes, setKeepsakes] = useState<string[]>(initialBundle ? [...initialBundle.pick.keepsakes] : []);
  const [packaging, setPackaging] = useState(initialBundle?.pick.packaging ?? "kraft");
  const [delivery, setDelivery] = useState("owl");
  const [antidote, setAntidote] = useState(false);
  const toggleKeepsake = (id: string) => setKeepsakes((k) => (k.includes(id) ? k.filter((x) => x !== id) : [...k, id]));
  const [tier, setTier] = useState(search.box ?? "true");
  const [strength, setStrength] = useState("swoon");
  const aroma = "rose"; // scent choice removed for fewer decisions; DB still stores a value
  const [duration, setDuration] = useState("hour");
  const [handwritten, setHandwritten] = useState(initialBundle?.pick.handwritten ?? false);
  const [handText, setHandText] = useState("");
  const [card, setCard] = useState<string | null>(initialBundle?.pick.card ?? null);
  const [to, setTo] = useState("");
  const [toEmail, setToEmail] = useState("");
  const [from, setFrom] = useState("");
  const [note, setNote] = useState("");
  const [share, setShare] = useState(true);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [giftUrl, setGiftUrl] = useState("");

  const durId = DURATIONS.find((d) => d.id === duration) ? duration : DURATIONS[0]!.id;
  const saving = bundleSavings({ handwritten, card, keepsakes, packaging });
  const preDelivery = orderTotal(tier, strength, durId) + potionsTotal(potions) + addonsTotal(handwritten, card) + upgradesTotal(packaging, "owl", keepsakes, antidote) - saving;
  const waived = expressWaiver(delivery, preDelivery);
  const total = Math.round((-saving - waived + orderTotal(tier, strength, durId) + potionsTotal(potions) + addonsTotal(handwritten, card) + upgradesTotal(packaging, delivery, keepsakes, antidote)) * 100) / 100;
  const outcome = blendOutcome(potions);
  const canNext =
    (step !== 1 || potions.length > 0) &&
    (step !== 3 || !handwritten || handText.trim().length > 0) &&
    (step !== 5 || (to.trim() && from.trim() && /\S+@\S+\.\S+/.test(toEmail)));

  async function submit() {
    setBusy(true);
    const u = { user: null as null | { id: string } };
    let error: unknown = null;
    const giftId = crypto.randomUUID();
    await supabase.from("gifts").insert({ id: giftId });
    const qs = new URLSearchParams({ id: giftId, to: to.trim(), from: from.trim(), tier, blend: outcome?.name ?? "", note: note.trim() });
    const url = `${window.location.origin}/gift?${qs}`;
    if (u.user) {
      ({ error } = await supabase.from("orders").insert({
        tier, strength, aroma, duration: durId,
        sender_name: from.trim(), recipient_name: to.trim(), recipient_email: toEmail.trim(),
        note: note.trim() || null, total, share_on_wall: share,
        addons: [handwritten ? "handwritten" : null, card ? `card:${card}` : null, `pack:${packaging}`, `ship:${delivery}`, antidote ? "antidote" : null, ...keepsakes.map((k) => `keep:${k}`)].filter(Boolean) as string[],
        handwritten_text: handwritten ? handText.trim() : null,
        potions, outcome: outcome?.name ?? null,
      }));
    } else {
      guest.addOrder({ id: crypto.randomUUID(), tier, recipient_name: to.trim(), total, created_at: new Date().toISOString(), gift_id: giftId, gift_url: url });
      if (share) ({ error } = await supabase.from("confessions").insert({ tier, strength, aroma, note: note.trim().slice(0, 200) || null, potions, outcome: outcome?.name ?? null }));
    }
    setBusy(false);
    if (error) { toast.error("The owl tripped over its own feelings. Try again."); return; }
    setGiftUrl(url);
    setSent(true);
  }

  if (sent)
    return (
      <Shell>
        <div className="my-auto text-center">
          <OptArt id="owl" alt="An owl carrying your parcel" className="sparkle mx-auto h-32 w-32 rounded-full border border-gold object-cover shadow-glow" />
          <h2 className="mt-6 font-display text-3xl text-gold-gradient">Owl Dispatched</h2>
          <p className="mt-3 text-lg text-muted-foreground">Your box is flying to {to}. All they have to do is take one bite… Fingers crossed, tissues ready.</p>
          <div className="mt-8 space-y-3">
            <div className="rounded-2xl border border-gold bg-card p-4 text-left">
              <p className="text-sm uppercase tracking-[0.2em] text-gold">Step 1 · Send them their gift link</p>
              <p className="mt-1 text-sm text-muted-foreground">It opens their unboxing. We'll tell you the moment they take a bite.</p>
              <button onClick={async () => { await navigator.clipboard.writeText(giftUrl); toast.success("Gift link copied"); }}
                className="mt-3 h-12 w-full rounded-full border border-gold text-gold">Copy Gift Link</button>
            </div>
            <GoldButton onClick={async () => {
              const text = `I just spent $${total.toFixed(2)} on love-potion chocolates to make ${to} love me. Pray for me.`;
              const url = window.location.origin;
              const file = await makeShareCard({ total, to, blend: outcome?.name ?? "A Mystery Blend", level: desperationLevel(total).label });
              try {
                if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], text, url });
                else if (navigator.share) await navigator.share({ title: "Amortentia Post", text, url });
                else { const a = document.createElement("a"); a.href = URL.createObjectURL(file); a.download = file.name; a.click(); toast.success("Share card saved! Go make your friends laugh-cry."); }
              } catch { /* cancelled */ }
            }}>Tell My Friends (They'll Lose It)</GoldButton>
            <button onClick={() => navigate({ to: "/me" })} className="h-12 w-full rounded-full border text-gold">Did They Eat It Yet?</button>
            <button onClick={() => navigate({ to: "/wall" })} className="h-12 w-full rounded-full border text-gold">See Other Desperate Souls</button>
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
        {step === 0 && (
          <>
            {[{ title: "", list: TIERS }, { title: "Occasion Editions · a spell for every celebration", list: SEASONAL }].map((g) => (
              <div key={g.title} className="space-y-3">
                {g.title && <Label>{g.title}</Label>}
                {g.list.map((t) => (
                  <Option key={t.id} active={tier === t.id} onClick={() => setTier(t.id)}>
                    <img src={BOX_ART[t.id]} alt={t.name} loading="lazy" width={816} height={816} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-lg font-semibold leading-tight">{t.name}</span>
                        {t.id === "true" && <span className="rounded-full bg-gold-gradient px-2 py-0.5 text-xs font-bold text-primary-foreground">Popular</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{t.pieces} chocolates · {t.blurb}</p>
                    </div>
                    <span className="shrink-0 text-base font-bold text-gold">${t.price}</span>
                  </Option>
                ))}
              </div>
            ))}
          </>
        )}

        {step === 1 && <PotionCabinet value={potions} onChange={setPotions} />}

        {step === 2 && (
          <>
            <OptArt id="cauldron" alt="A chocolatier stirring molten chocolate beside love potion bottles" className="aspect-[4/3] w-full rounded-lg border border-gold object-cover" />
            <Label>How badly do you want them? (Be honest. We can tell.)</Label>
            {STRENGTHS.map((s) => (
              <Option key={s.id} active={strength === s.id} onClick={() => setStrength(s.id)}>
                <OptArt id={s.id} alt={s.name} className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                <div className="flex-1"><div className="text-lg font-semibold">{s.name}</div><p className="text-muted-foreground">{s.desc}</p></div>
                <span className="text-gold">+${s.price}</span>
              </Option>
            ))}
            <Label>How long they'll be yours</Label>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map((d) => (
                <Chip key={d.id} active={durId === d.id} onClick={() => setDuration(d.id)}>
                  <OptArt id={d.id} alt="" className="mx-auto mb-2 h-12 w-12 rounded-lg object-cover" />
                  {d.name}<br /><span className="text-xs opacity-75">+${d.price}</span>
                </Chip>
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <Label>Spell bundles · one tap, real savings</Label>
            {BUNDLES.map((b) => {
              const on = bundleMatches(b, { handwritten, card, keepsakes, packaging });
              return (
                <Option key={b.id} active={on} onClick={() => {
                  setHandwritten(b.pick.handwritten); setCard(b.pick.card);
                  setKeepsakes((k) => Array.from(new Set([...k, ...b.pick.keepsakes])));
                  if (b.pick.packaging) setPackaging(b.pick.packaging);
                }}>
                  <OptArt id={b.id} alt={b.name} />
                  <div className="min-w-0 flex-1"><div className="text-lg font-semibold">{b.name}</div><p className="text-sm text-muted-foreground">{b.desc}</p><p className="mt-1 text-sm text-gold">Extras ${bundlePrice(b).toFixed(2)} · save ${b.save}</p></div>
                </Option>
              );
            })}
            <p className="text-xs text-muted-foreground">Box and potions priced separately. Your best matching bundle saving applies; savings don’t stack.</p>
            <Label>Or pick your own · handwritten by our scribes</Label>
            <Option active={handwritten} onClick={() => setHandwritten(!handwritten)}>
              <OptArt id="quill" alt={HANDWRITTEN.name} />
              <div className="flex-1"><div className="text-lg font-semibold">{HANDWRITTEN.name}</div><p className="text-muted-foreground">{HANDWRITTEN.desc}</p></div>
              <span className="text-gold">+${HANDWRITTEN.price}</span>
            </Option>
            {handwritten && (
              <textarea value={handText} onChange={(e) => setHandText(e.target.value)} maxLength={300} rows={4}
                placeholder="Say it. The thing you rehearse in the shower."
                className="w-full resize-none rounded-2xl bg-parchment p-4 font-serif text-lg italic text-parchment-foreground outline-none" />
            )}
            <Label>Pick a card (optional)</Label>
            {CARDS.map((c) => (
              <Option key={c.id} active={card === c.id} onClick={() => setCard(card === c.id ? null : c.id)}>
                <OptArt id={c.id} alt={c.name} />
                <div className="flex-1"><div className="text-lg font-semibold">{c.name}</div><p className="text-muted-foreground">{c.desc}</p></div>
                <span className="text-gold">+${c.price}</span>
              </Option>
            ))}
            <Label>Extra bait for the first bite</Label>
            <p className="text-sm text-muted-foreground">Every bite counts. Make the box too beautiful to ignore.</p>
            {KEEPSAKES.map((k) => (
              <Option key={k.id} active={keepsakes.includes(k.id)} onClick={() => toggleKeepsake(k.id)}>
                <OptArt id={k.id} alt={k.name} />
                <div className="flex-1"><div className="text-lg font-semibold">{k.name}</div><p className="text-muted-foreground">{k.desc}</p></div>
                <span className="text-gold">+${k.price}</span>
              </Option>
            ))}
          </>
        )}

        {step === 4 && (
          <>
            <Label>The moment they first see it (and hopefully eat it)</Label>
            {PACKAGING.map((k) => (
              <Option key={k.id} active={packaging === k.id} onClick={() => setPackaging(k.id)}>
                <OptArt id={k.id} alt={k.name} />
                <div className="flex-1"><div className="text-lg font-semibold">{k.name}</div><p className="text-muted-foreground">{k.desc}</p></div>
                <span className="text-gold">{k.price ? `+$${k.price}` : "Included"}</span>
              </Option>
            ))}
            <Label>How long can you possibly wait?</Label>
            {DELIVERY.map((k) => (
              <Option key={k.id} active={delivery === k.id} onClick={() => setDelivery(k.id)}>
                <OptArt id={k.id} alt={k.name} />
                <div className="flex-1"><div className="text-lg font-semibold">{k.name}</div><p className="text-muted-foreground">{k.desc}</p></div>
                <span className="text-gold">{k.price ? `+$${k.price}` : "Included"}</span>
              </Option>
            ))}
          </>
        )}

        {step === 5 && (
          <div className="rounded-2xl bg-parchment p-5 text-parchment-foreground shadow-glow">
            <Field label="To my beloved" value={to} onChange={setTo} placeholder="Their name" />
            <Field label="Their email" value={toEmail} onChange={setToEmail} placeholder="So the owl can find them" type="email" />
            <Field label="From your admirer" value={from} onChange={setFrom} placeholder="Your name" />
            <label className="mt-2 block text-sm font-semibold uppercase tracking-wider">Your confession</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={200} rows={4} placeholder="I've liked you since… (please eat the chocolates)"
              className="mt-1 w-full resize-none rounded-lg border border-parchment-foreground/30 bg-transparent p-3 text-lg italic outline-none" />
            <p className="text-right text-xs opacity-60">{note.length}/200</p>
          </div>
        )}

        {step === 6 && (
          <>
            <div className="space-y-2 rounded-2xl border bg-card p-5">
              <Row k="Box" v={ALL_BOXES.find((t) => t.id === tier)!.name} />
              <Row k="Blend" v={outcome?.name ?? "—"} />
              <Row k="Potions" v={`${potions.length} potions`} />
              <Row k="Potency" v={STRENGTHS.find((s) => s.id === strength)!.name} />
              <Row k="Lasts" v={DURATIONS.find((d) => d.id === durId)!.name} />
              {handwritten && <Row k="Extra" v="Handwritten note" />}
              {card && <Row k="Card" v={CARDS.find((c) => c.id === card)!.name} />}
              {keepsakes.length > 0 && <Row k="Keepsakes" v={`${keepsakes.length} added`} />}
              <Row k="Wrapping" v={PACKAGING.find((x) => x.id === packaging)!.name} />
              <Row k="Delivery" v={DELIVERY.find((x) => x.id === delivery)!.name} />
              {saving > 0 && <Row k="Bundle savings" v={`−$${saving.toFixed(2)}`} />}
              {waived > 0 && <Row k="Express Owl" v="Free" />}
              <Row k="To" v={to} />
            </div>
            <Option active={antidote} onClick={() => setAntidote(!antidote)}>
              <OptArt id="shield" alt="" className="h-14 w-14 shrink-0 rounded-full border border-gold object-cover" />
              <div className="flex-1">
                <div className="font-semibold">{ANTIDOTE.name}</div>
                <p className="text-sm text-muted-foreground">{ANTIDOTE.desc}</p>
              </div>
              <span className="text-gold">+${ANTIDOTE.price}</span>
            </Option>
            <Option active={share} onClick={() => setShare(!share)}>
              <OptArt id={share ? "heart" : "locket"} alt="" className="h-14 w-14 shrink-0 rounded-full border border-gold object-cover" />
              <div className="flex-1">
                <div className="font-semibold">Share anonymously on the Wall</div>
                <p className="text-sm text-muted-foreground">Your confession only. Never your name or theirs.</p>
              </div>
            </Option>
          </>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-16 z-30 mx-auto max-w-md border-t bg-background/95 px-5 pb-3 pt-3 backdrop-blur">
        <div className="mb-2 flex items-center justify-between gap-3 text-muted-foreground">
          <div className="flex-1">
            <p className="text-xs">Desperation: <span className="inline-flex items-center gap-1.5 font-semibold text-gold"><OptArt id={desperationLevel(total).icon} alt="" className="h-6 w-6 rounded-full border border-gold object-cover" /> {desperationLevel(total).label}</span></p>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted" role="meter" aria-label="Desperation meter" aria-valuenow={Math.round(total)} aria-valuemin={0} aria-valuemax={470}>
              <div className="h-full bg-gold-gradient transition-all duration-500" style={{ width: `${Math.min(100, (total / 470) * 100)}%` }} />
            </div>
          </div>
          <span className="text-lg font-bold text-gold">${total.toFixed(2)}</span>
        </div>
        {step >= 3 && preDelivery < FREE_EXPRESS_OVER && (
          <p className="mb-2 text-center text-xs text-muted-foreground">Add ${(FREE_EXPRESS_OVER - preDelivery).toFixed(2)} more for <span className="text-gold">free Express Owl</span></p>
        )}
        <GoldButton disabled={!canNext || busy} onClick={() => (step === 6 ? submit() : setStep(step + 1))}>
          {step === 6 ? (busy ? "Summoning owl…" : "Seal My Fate") : "Continue"}
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
