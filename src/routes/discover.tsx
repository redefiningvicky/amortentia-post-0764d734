import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, Label } from "@/components/kit";
import { OptArt } from "@/components/opt-art";
import { SEASONAL, BUNDLES, bundlePrice } from "@/lib/catalog";
import { BOX_ART } from "@/lib/art";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover Magical Gifts — Amortentia Post" },
      {
        name: "description",
        content: "Find birthday and holiday chocolate gifts, plus curated spell bundles.",
      },
      { property: "og:title", content: "Discover Magical Gifts — Amortentia Post" },
      { property: "og:description", content: "A chocolate spell for every celebration." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Discover,
});

function Discover() {
  return (
    <Shell>
      <h1 className="font-display text-3xl text-gold-gradient">Discover</h1>
      <p className="mt-2 text-lg text-muted-foreground">
        Some occasions deserve a little enchantment.
      </p>
      <Label>Every occasion, a little longing</Label>
      <div className="mt-3 grid grid-cols-2 gap-3">
        {SEASONAL.map((box) => (
          <Link
            key={box.id}
            to="/send"
            search={{ box: box.id }}
            className="overflow-hidden rounded-lg border bg-card"
          >
            <img
              src={BOX_ART[box.id]}
              alt={box.name}
              width={816}
              height={816}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
            <div className="p-3">
              <h2 className="font-display text-base text-gold">{box.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{box.blurb}</p>
              <p className="mt-2 font-semibold">
                {box.pieces} bites · ${box.price.toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <Label>Spell bundles</Label>
      <div className="mt-3 space-y-3">
        {BUNDLES.map((bundle) => (
          <Link
            key={bundle.id}
            to="/send"
            search={{ bundle: bundle.id }}
            className="flex items-center gap-3 rounded-lg border bg-card p-4"
          >
            <OptArt id={bundle.id} alt={bundle.name} />
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-lg text-gold">{bundle.name}</h2>
              <p className="text-sm text-muted-foreground">{bundle.desc}</p>
              <p className="mt-1 text-sm text-gold">
                Extras ${bundlePrice(bundle).toFixed(2)} · save ${bundle.save}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Box and potions priced separately. Best matching bundle saving applies; savings don’t stack.
      </p>
    </Shell>
  );
}
