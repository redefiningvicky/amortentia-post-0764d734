import { useEffect, useRef, useState, type ReactNode } from "react";
import { MAX_BLEND } from "@/lib/catalog";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";

export const PAGE_SIZE = 10;

/** Shows matching items a page at a time (10 by default); resets whenever the filter key changes. */
export function useShowMore<T>(list: T[], resetKey: string, pageSize = PAGE_SIZE) {
  const [count, setCount] = useState(pageSize);
  useEffect(() => {
    setCount(pageSize);
  }, [resetKey, pageSize]);
  return {
    visible: list.slice(0, count),
    shown: Math.min(count, list.length),
    total: list.length,
    more: () => setCount((c) => c + pageSize),
  };
}

export function ShowMore({
  shown,
  total,
  noun,
  onMore,
}: {
  shown: number;
  total: number;
  noun: string;
  onMore: () => void;
}) {
  if (total === 0) return null;
  return (
    <div className="space-y-2 text-center">
      <p className="text-xs text-muted-foreground" aria-live="polite">
        Showing {shown} of {total} {noun}
      </p>
      {shown < total && (
        <Button
          variant="outline"
          className="h-11 w-full rounded-full border-gold text-gold"
          onClick={onMore}
        >
          Show More
        </Button>
      )}
    </div>
  );
}

export function SelectionChips({
  items,
  onRemove,
}: {
  items: { id: string; name: string; art?: ReactNode }[];
  onRemove: (id: string) => void;
}) {
  if (!items.length) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5" aria-label="Your selections">
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          onClick={() => onRemove(it.id)}
          className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-sm"
          aria-label={`Remove ${it.name}`}
        >
          {it.art}
          {it.name}
          <Icon name="x" className="h-3.5 w-3.5 opacity-70" />
        </button>
      ))}
    </div>
  );
}

/** Wraps the result card; when it scrolls away with a selection, shows a compact jump-back control at the top. */
export function BlendAnchor({ count, children }: { count: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [away, setAway] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => {
      if (e) setAway(!e.isIntersecting && e.boundingClientRect.top < 0);
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <>
      <div ref={ref} className="scroll-mt-4">
        {children}
      </div>
      {away && count > 0 && (
        <button
          type="button"
          onClick={() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="fixed left-1/2 top-3 z-40 -translate-x-1/2 rounded-full border border-gold bg-card px-4 py-2 text-sm font-semibold text-gold shadow-glow"
        >
          Your Blend · {count}/{MAX_BLEND}
        </button>
      )}
    </>
  );
}
