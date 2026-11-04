import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import hero from "@/assets/hero.jpg";
import boxScreenshot from "@/assets/shot-current-box.jpg";
import potionsScreenshot from "@/assets/shot-current-potions.jpg";
import writingScreenshot from "@/assets/shot-current-writing.jpg";
import biteScreenshot from "@/assets/shot-current-reaction.jpg";
import grand from "@/assets/box-grand.jpg";
import { OptArt } from "@/components/opt-art";

export const Route = createFileRoute("/pitch")({
  validateSearch: (s: Record<string, unknown>) => ({
    slide: Math.max(1, Math.min(6, Number(s["slide"]) || 1)),
    export: s["export"] === "4k" ? "4k" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Pitch Deck — Amortentia Post" },
      {
        name: "description",
        content: "Love-potion chocolates for the hopelessly unrequited. Our six-slide story.",
      },
      { property: "og:title", content: "Amortentia Post — The Pitch" },
      { property: "og:description", content: "One bite. Finally seen." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Pitch,
});

function Slide({ children }: { children: ReactNode }) {
  return (
    <div className="slide-content relative overflow-hidden bg-background text-foreground">
      {children}
    </div>
  );
}
function Phone({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-[48px] border-[10px] border-card shadow-glow ${className}`}
      style={{ width: 360, height: 772 }}
    >
      <img src={src} alt={alt} className="h-full w-full bg-background object-contain object-top" />
    </div>
  );
}
const Kicker = ({ children }: { children: ReactNode }) => (
  <p className="slide-kicker text-gold">{children}</p>
);
const Ph = ({ children }: { children: ReactNode }) => (
  <span className="rounded-lg border-2 border-dashed border-gold px-3 text-gold">{children}</span>
);

const SLIDES: { title: string; el: ReactNode }[] = [
  {
    title: "Problem",
    el: (
      <Slide>
        <div className="absolute inset-0 grid grid-cols-2 items-center gap-20 px-[140px]">
          <div>
            <Kicker>01 · The Problem</Kicker>
            <h1 className="slide-title mt-6 font-display text-gold-gradient">
              Millions of people love someone who doesn't love them back.
            </h1>
            <ul className="slide-body mt-10 space-y-5 text-muted-foreground">
              <li className="flex gap-4">
                <OptArt
                  id="wand"
                  alt=""
                  className="mt-1 h-14 w-14 shrink-0 rounded-full border border-gold object-cover"
                />
                <span>
                  <b className="text-foreground">Who's hurting:</b> the hopeless crushers, the
                  left-on-read, the "we're just friends" crowd.
                </span>
              </li>
              <li className="flex gap-4">
                <OptArt
                  id="broken"
                  alt=""
                  className="mt-1 h-14 w-14 shrink-0 rounded-full border border-gold object-cover"
                />
                <span>
                  <b className="text-foreground">What's broken:</b> gifting is generic, confessing
                  is terrifying, and nothing makes heartache <i>fun</i>.
                </span>
              </li>
            </ul>
          </div>
          <div className="text-center">
            <OptArt
              id="broken"
              alt="A broken heart mended with gold"
              className="mx-auto h-[340px] w-[340px] rounded-[48px] border border-gold object-cover shadow-glow"
            />
            <p className="slide-subtitle mt-6 font-serif italic text-gold">
              "Why won't they notice me?"
            </p>
          </div>
        </div>
      </Slide>
    ),
  },
  {
    title: "Solution",
    el: (
      <Slide>
        <img
          src={hero}
          alt=""
          className="absolute right-0 top-0 h-full w-[45%] object-cover opacity-80"
        />
        <div className="absolute inset-y-0 left-0 flex w-[60%] flex-col justify-center bg-gradient-to-r from-background via-background to-transparent px-[140px]">
          <Kicker>02 · The Solution</Kicker>
          <h1 className="slide-title mt-6 font-display text-gold-gradient">
            What if one chocolate could make them fall for you?
          </h1>
          <p className="slide-body-lg mt-8 max-w-[900px] text-muted-foreground">
            We brew playful "love potions" into vintage heart-box chocolates. Send one, and all they
            have to do is take a bite.
          </p>
          <p className="slide-body mt-6 max-w-[900px] text-foreground">
            It's a gift, a confession, and a joke your whole family will laugh-cry over.
          </p>
        </div>
      </Slide>
    ),
  },
  {
    title: "Market",
    el: (
      <Slide>
        <div className="absolute inset-0 flex flex-col justify-center px-[140px]">
          <Kicker>03 · The Market</Kicker>
          <h1 className="slide-title mt-6 font-display text-gold-gradient">
            Everyone with a crush is a customer.
          </h1>
          <div className="mt-14 grid grid-cols-3 gap-10">
            {[
              ["Who pays", "Anyone buying for a crush, partner, ex… or bestie", "coins"],
              [
                "How many",
                <>
                  Valentine's spend: <span className="text-gold">$1 trillion</span>
                </>,
                "chart",
              ],
              [
                "Why now",
                "Gifting went social: people buy what makes a great share, not just a great present",
                "clock",
              ],
            ].map(([h, b, e]) => (
              <div
                key={String(h)}
                className="min-h-[300px] rounded-[32px] border border-gold/40 bg-card p-10"
              >
                <OptArt
                  id={String(e)}
                  alt=""
                  className="h-28 w-28 rounded-3xl border border-gold object-cover"
                />
                <p className="slide-subtitle mt-4 font-display text-gold">{h}</p>
                <p className="slide-body mt-4 text-muted-foreground">{b}</p>
              </div>
            ))}
          </div>
          <p className="slide-caption mt-10 text-muted-foreground">
            Typical damage: $54.98–$189.96. Dignity sold separately.
          </p>
        </div>
      </Slide>
    ),
  },
  {
    title: "Product",
    el: (
      <Slide>
        <div className="absolute inset-0 flex flex-col px-[110px] pt-[55px]">
          <Kicker>04 · The Product</Kicker>
          <h1 className="slide-subtitle mt-4 font-display text-gold-gradient">
            Pick a box, brew a potion, they take a bite, you find out.
          </h1>
          <div className="mt-7 flex justify-between gap-10">
            {[
              [boxScreenshot, "Choose your box"],
              [potionsScreenshot, "Brew their downfall"],
              [writingScreenshot, "Confess dramatically"],
              [biteScreenshot, "They ate it!"],
            ].map(([s, l]) => (
              <div key={l} className="text-center">
                <Phone src={s!} alt={l!} />
                <p className="slide-caption mt-5 text-gold">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </Slide>
    ),
  },
  {
    title: "The Payoff",
    el: (
      <Slide>
        <img
          src={grand}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 grid grid-cols-[1.15fr_1fr] items-center gap-20 px-[140px]">
          <div>
            <Kicker>05 · One Bite Later</Kicker>
            <h1 className="slide-title mt-6 font-display text-gold-gradient">
              Ramona sent chocolates. Henry lost the plot.
            </h1>
            <p className="slide-body-lg mt-8 text-muted-foreground">
              She chose the blend, tucked in her confession, and trusted an owl with her entire love
              life.
            </p>
            <p className="slide-body mt-6 text-foreground">
              He broke the seal. He took a bite. Now he’s composing wedding vows between mouthfuls.
            </p>
            <p className="slide-subtitle mt-8 font-serif italic text-gold">
              Owl Post update: THEY ATE IT.
            </p>
          </div>
          <div className="rounded-[40px] border border-gold/40 bg-card/95 p-10 shadow-glow">
            <p className="slide-caption uppercase tracking-widest text-gold">Henry’s condition</p>
            <h2 className="slide-subtitle mt-5 font-display text-gold">
              Utterly, inconveniently besotted.
            </h2>
            <p className="slide-body mt-6 text-muted-foreground">
              Chocolate: eaten.
              <br />
              Composure: missing.
              <br />
              Ramona: finally noticed.
            </p>
            <p className="slide-body mt-8 font-serif italic text-foreground">
              “Does she think of me? Should I write? Is it too soon to name our owl?”
            </p>
          </div>
        </div>
      </Slide>
    ),
  },
  {
    title: "Smile",
    el: (
      <Slide>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-[200px] text-center">
          <OptArt
            id="spell"
            alt="A bubbling cauldron of golden love potion"
            className="sparkle mx-auto h-[240px] w-[240px] rounded-full border border-gold object-cover shadow-glow"
          />
          <h1 className="slide-title mt-10 font-display text-gold-gradient">
            We can't make them love you…
          </h1>
          <p className="slide-subtitle mt-6 font-serif italic">
            …but we can make them eat the chocolate.
          </p>
        </div>
      </Slide>
    ),
  },
];

function Pitch() {
  const { slide, export: exportSize } = Route.useSearch();
  const navigate = useNavigate({ from: "/pitch" });
  const i = slide - 1;
  const go = (n: number) =>
    navigate({ search: { slide: Math.max(1, Math.min(SLIDES.length, n)), export: undefined }, replace: true });
  const wrap = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  const touch = useRef(0);

  useEffect(() => {
    const fit = () => {
      const el = wrap.current;
      if (el) setScale(Math.min(el.clientWidth / 1920, el.clientHeight / 1080));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (["ArrowRight", " ", "PageDown"].includes(e.key)) go(slide + 1);
      if (["ArrowLeft", "PageUp"].includes(e.key)) go(slide - 1);
      if (e.key === "f") void document.documentElement.requestFullscreen?.();
    };
    window.addEventListener("keydown", k);
    document.title = `${slide}/${SLIDES.length} — ${SLIDES[i]!.title}`;
    return () => window.removeEventListener("keydown", k);
  });

  if (exportSize === "4k") {
    return (
      <div className="bg-background" style={{ width: 3840, height: 2160, overflow: "hidden" }}>
        <div style={{ width: 1920, height: 1080, transform: "scale(2)", transformOrigin: "top left" }}>
          {SLIDES[i]!.el}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <div
        ref={wrap}
        className="relative flex-1 overflow-hidden"
        onTouchStart={(e) => (touch.current = e.touches[0]!.clientX)}
        onTouchEnd={(e) => {
          const d = e.changedTouches[0]!.clientX - touch.current;
          if (Math.abs(d) > 40) go(slide + (d < 0 ? 1 : -1));
        }}
      >
        <div className="slide-wrapper" style={{ ["--scale" as string]: scale }}>
          {SLIDES[i]!.el}
        </div>
      </div>
      <div className="flex items-center justify-center gap-4 p-3">
        <button
          onClick={() => go(slide - 1)}
          aria-label="Previous slide"
          className="h-11 w-11 rounded-full border text-gold"
        >
          ‹
        </button>
        <span className="text-sm text-muted-foreground">
          {slide} / {SLIDES.length} · {SLIDES[i]!.title}
        </span>
        <button
          onClick={() => go(slide + 1)}
          aria-label="Next slide"
          className="h-11 w-11 rounded-full border text-gold"
        >
          ›
        </button>
        <button
          onClick={() => void document.documentElement.requestFullscreen?.()}
          className="h-11 rounded-full border px-4 text-sm text-gold"
        >
          Present
        </button>
      </div>
    </div>
  );
}
