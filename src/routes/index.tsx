import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { useEffect, useState } from "react";
import { GoldButton, Shell } from "@/components/kit";
import { Icon } from "@/components/icons";

const TOUR = [
  { icon: "heart", title: "You love them.", body: "Like, a lot. Embarrassingly a lot." },
  { icon: "eye-off", title: "They don't notice you.", body: "Rude. Truly unacceptable." },
  { icon: "choco", title: "Make them eat a chocolate.", body: "We brew love potions into every bite. One bite and they finally see you.*" },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Amortentia Post — Be Loved Back" },
      { name: "description", content: "Potion-brewed chocolates in a vintage heart box. One bite and they finally see you." },
      { property: "og:title", content: "Amortentia Post — Be Loved Back" },
      { property: "og:description", content: "Send enchanted chocolates to the one who hasn't noticed you… yet." },
    ],
  }),
  component: Home,
});

function Home() {
  const [tour, setTour] = useState<number | null>(null);
  useEffect(() => { if (!localStorage.getItem("ap-toured")) setTour(0); }, []);
  const done = () => { localStorage.setItem("ap-toured", "1"); setTour(null); };
  if (tour !== null) {
    const t = TOUR[tour]!;
    return (
      <Shell>
        <button onClick={done} className="ml-auto min-h-11 px-2 text-sm text-muted-foreground">Skip</button>
        <div key={tour} className="reveal my-auto text-center">
          <Icon name={t.icon} className="mx-auto h-28 w-28 text-gold" />
          <h1 className="mt-6 font-display text-3xl text-gold-gradient">{t.title}</h1>
          <p className="mx-auto mt-3 max-w-xs text-lg text-muted-foreground">{t.body}</p>
        </div>
        <div className="mb-4 flex justify-center gap-2">
          {TOUR.map((_, i) => <span key={i} className={i === tour ? "h-2 w-6 rounded-full bg-gold-gradient" : "h-2 w-2 rounded-full bg-muted"} />)}
        </div>
        <GoldButton onClick={() => (tour < TOUR.length - 1 ? setTour(tour + 1) : done())}>{tour < TOUR.length - 1 ? "Next" : "Show Me the Potions"}</GoldButton>
      </Shell>
    );
  }
  return (
    <Shell>
      <div className="relative -mx-5 -mt-6 h-[52vh] overflow-hidden rounded-b-[2rem]">
        <img src={hero} alt="Heart-shaped chocolate box wrapped in vintage post" width={1024} height={1280} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>
      <div className="relative -mt-16 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-gold">Est. by Owl Post · Results not guaranteed*</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-gold-gradient">Amortentia Post</h1>
        <p className="mx-auto mt-3 max-w-xs text-lg text-muted-foreground">
          For everyone who's ever loved someone who didn't notice. Send potion-brewed chocolates. All they have to do is eat one.
        </p>
      </div>
      <div className="mt-8 space-y-3">
        <Link to="/send" className="flex h-14 w-full items-center justify-center rounded-full bg-gold-gradient font-display text-lg text-primary-foreground shadow-glow">
          Make Them Eat One
        </Link>
        <Link to="/wall" className="flex h-12 w-full items-center justify-center rounded-full border text-gold">
          Read the Secret Admirer Wall
        </Link>
      </div>
      <p className="mt-6 text-center text-xs italic text-muted-foreground">*Side effects may include blushing, giggling, and your group chat never letting this go.</p>
    </Shell>
  );
}
