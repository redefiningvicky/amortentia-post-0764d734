import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { OptArt } from "@/components/opt-art";

function MagicDust() {
  return (
    <div className="magic-dust" aria-hidden="true">
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} style={{ left: `${(i * 61) % 97}%`, animationDuration: `${9 + ((i * 7) % 9)}s`, animationDelay: `${(i * 1.7) % 12}s` }} />
      ))}
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-md flex-col border-2 border-gold/50 px-5 pb-24 pt-6 shadow-frame">
      <MagicDust />
      <div className="relative z-10 flex flex-1 flex-col">{children}</div>
    </div>
  );
}

export function GoldButton({ className, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className={cn(
        "h-14 w-full rounded-full bg-gold-gradient font-display text-lg text-primary-foreground shadow-glow transition active:scale-95 disabled:opacity-40",
        className,
      )}
    />
  );
}

export function Option({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={cn("flex w-full items-center gap-4 rounded-2xl border bg-card p-4 text-left transition", active && "border-gold shadow-glow")}>
      {children}
    </button>
  );
}

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={cn("min-h-11 rounded-full border px-4 py-2 transition", active ? "bg-gold-gradient text-primary-foreground" : "bg-card")}>
      {children}
    </button>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="pt-3 text-sm uppercase tracking-[0.2em] text-gold">{children}</p>;
}

const TABS = [
  { to: "/", label: "Home", icon: "castle" },
  { to: "/discover", label: "Discover", icon: "sweet" },
  { to: "/spellbook", label: "Spellbook", icon: "spell" },
  { to: "/wall", label: "Wall", icon: "heart" },
  { to: "/send", label: "Send", icon: "owl" },
  { to: "/me", label: "Me", icon: "quill" },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  if (pathname.startsWith("/pitch")) return null;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md border-x-2 border-t border-gold/50 bg-background/95 backdrop-blur">
      {TABS.map((t) => {
        const active = t.to === "/" ? pathname === "/" : pathname.startsWith(t.to);
        return (
          <Link key={t.to} to={t.to} className={cn("flex min-w-0 flex-1 flex-col items-center gap-1 py-2 text-[10px]", active ? "text-gold" : "text-muted-foreground")}>
            <OptArt id={t.icon} alt="" className={cn("h-9 w-9 rounded-full border object-cover", active ? "border-gold shadow-glow" : "border-transparent opacity-70")} />
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
