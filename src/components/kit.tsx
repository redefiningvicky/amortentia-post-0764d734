import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Shell({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-24 pt-6">{children}</div>;
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
  { to: "/", label: "Home", icon: "🏰" },
  { to: "/wall", label: "Wall", icon: "💘" },
  { to: "/send", label: "Send", icon: "🦉" },
  { to: "/me", label: "Me", icon: "🪶" },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto flex max-w-md border-t bg-background/95 backdrop-blur">
      {TABS.map((t) => {
        const active = t.to === "/" ? pathname === "/" : pathname.startsWith(t.to);
        return (
          <Link key={t.to} to={t.to} className={cn("flex flex-1 flex-col items-center py-2 text-xs", active ? "text-gold" : "text-muted-foreground")}>
            <span className="text-xl">{t.icon}</span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
