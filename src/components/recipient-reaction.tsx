import { useId, useState } from "react";
import { OptArt } from "@/components/opt-art";
import { Button } from "@/components/ui/button";
import lovestruckAdmirer from "@/assets/owl-lovestruck-admirer-natural.jpg";

export function RecipientReaction({
  recipient,
  blend,
  bitten,
  onSimulate,
  onDismiss,
}: {
  recipient: string;
  blend: string;
  bitten: boolean;
  onSimulate?: (() => void) | undefined;
  onDismiss: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const reactionId = useId();
  return (
    <section
      aria-label={`Owl Post update for ${recipient}`}
      className="mt-5 rounded-2xl border border-gold bg-card p-5 shadow-glow"
    >
      <div className="flex items-start gap-3">
        <OptArt
          id="owl"
          alt=""
          className="h-14 w-14 shrink-0 rounded-full border border-gold object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Owl Post</p>
          <h2 className="mt-1 font-display text-xl text-gold-gradient">
            {bitten ? "THEY ATE IT." : "Delivered. Now we wait."}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            To {recipient} · {blend}
          </p>
        </div>
      </div>
      {bitten ? (
        <>
          <figure className="mt-4 overflow-hidden rounded-lg border bg-card">
            <img
              src={lovestruckAdmirer}
              alt="A dreamy red-haired admirer gazing adoringly after a bite of enchanted chocolate"
              width={1448}
              height={1086}
              className="aspect-[4/3] w-full object-cover"
            />
          </figure>
          <p role="status" className="mt-4 text-lg">
            {recipient} has developed a sudden, deeply unreasonable affection for you.
          </p>
          <p className="mt-3 text-sm text-gold">Symptoms reported</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Smiling at your name. Writing your surname next to theirs. Asking the owl if you’re
            single.
          </p>
          <Button
            variant="outline"
            className="mt-4 min-h-11 w-full rounded-full border-gold text-gold"
            aria-expanded={expanded}
            aria-controls={reactionId}
            onClick={() => setExpanded((value) => !value)}
          >
            {expanded ? "Fold Their Letter" : "Read Their Reaction"}
          </Button>
          {expanded && (
            <blockquote
              id={reactionId}
              className="mt-3 whitespace-pre-wrap rounded-xl bg-parchment p-4 font-serif text-lg italic text-parchment-foreground"
            >
              “I had one chocolate and suddenly your name sounds like poetry. Are you seeing anyone?
              Is the owl seeing anyone? Please send your timetable. And another box.”
              <span className="mt-3 block text-sm not-italic">
                — {recipient}, currently drawing hearts around your initials
              </span>
            </blockquote>
          )}
          <button
            onClick={onDismiss}
            className="mt-2 min-h-11 w-full rounded-full px-3 text-sm text-muted-foreground"
          >
            Dismiss Update
          </button>
        </>
      ) : (
        <>
          <p className="mt-4 text-sm text-muted-foreground">
            The box has arrived. Your owl is watching for the first bite with absolutely no
            subtlety.
          </p>
          {onSimulate && (
            <Button
              className="mt-4 min-h-11 w-full rounded-full bg-gold-gradient text-primary-foreground"
              onClick={onSimulate}
            >
              See What Happens After a Bite
            </Button>
          )}
        </>
      )}
    </section>
  );
}
