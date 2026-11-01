import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Hand-drawn line artwork in place of emoji: thin engraved strokes, inked with currentColor.
const ART: Record<string, ReactNode> = {
  heart: (
    <path d="M12 20.5S4 15.6 4 10.2A4.7 4.7 0 0 1 12 7.3a4.7 4.7 0 0 1 8 2.9c0 5.4-8 10.3-8 10.3Z" />
  ),
  "broken-heart": (
    <>
      <path d="M12 20.5S4 15.6 4 10.2A4.7 4.7 0 0 1 12 7.3a4.7 4.7 0 0 1 8 2.9c0 5.4-8 10.3-8 10.3Z" />
      <path d="M12 7.3 9.6 12l3 2-1.6 3.6" />
    </>
  ),
  castle: (
    <>
      <path d="M4 21h16M6 21V9l3-2V4l3-1.5L15 7v2l3 2v10" />
      <path d="M10 21v-4a2 2 0 1 1 4 0v4" />
      <path d="M9 11.5h.01M15 11.5h.01" />
    </>
  ),
  owl: (
    <>
      <path d="M5 11a7 7 0 0 1 14 0v4a7 7 0 0 1-14 0Z" />
      <path d="M5 11 3.6 5.6 8 7.6M19 11l1.4-5.4L16 7.6" />
      <circle cx="9.4" cy="11.6" r="1.7" />
      <circle cx="14.6" cy="11.6" r="1.7" />
      <path d="M12 13.8l-1.4-1.9h2.8ZM9.6 21.4V20M14.4 21.4V20" />
    </>
  ),
  quill: (
    <>
      <path d="M20.5 3.5C14 4.5 8.5 8 5.5 14.5L3 21l6.5-2.5C16 15.5 19.5 10 20.5 3.5Z" />
      <path d="M6.4 17.6 12 12M14.2 7.8c-2.2 1.6-4.2 3.7-5.7 6.2" />
    </>
  ),
  flame: (
    <path d="M12 3c1.5 3.5 5 5.2 5 9a5 5 0 0 1-10 0c0-2 1-3.6 2-4.6 0 1.6 1 2.6 2 2.6S12 4.5 12 3Z" />
  ),
  rose: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M6 9a6 6 0 0 0 12 0M12 15v6" />
      <path d="M12 18c2.5 0 4-1.5 4-1.5M12 20c-2.5 0-4-1.5-4-1.5" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 1 1 10.5 4 7 7 0 0 0 20 14.5Z" />,
  star: <path d="M12 3.5 14.4 9l5.6.4-4.3 3.8 1.3 5.6-5-3.2-5 3.2 1.3-5.6L4 9.4 9.6 9Z" />,
  thorn: (
    <>
      <path d="M12 21V10" />
      <path d="M8.5 7.5C8.5 4.6 10 3 12 3s3.5 1.6 3.5 4.5c0 2.5-1.6 4-3.5 4s-3.5-1.5-3.5-4Z" />
      <path d="M8.5 7.5 10 9.6M15.5 7.5 14 9.6M12 13.2l-2.6-1.6M12 16.2l2.6-1.6" />
    </>
  ),
  honey: (
    <>
      <path d="M12 3.5s5.5 6.4 5.5 9.6a5.5 5.5 0 0 1-11 0C6.5 9.9 12 3.5 12 3.5Z" />
      <path d="M9.4 14a2.6 2.6 0 0 0 2.6 2.6" />
    </>
  ),
  mist: <path d="M4 8h9M16 8h4M6 12h13M3 16h7M13 16h8" />,
  bolt: <path d="M13.5 3 6 13.5h5L10 21l7.5-10.5h-5L13.5 3Z" />,
  bloom: (
    <>
      <circle cx="12" cy="12" r="2.6" />
      <path d="M12 6.6V3M12 21v-3.6M6.6 12H3M21 12h-3.6M8.2 8.2 5.6 5.6M18.4 18.4l-2.6-2.6M15.8 8.2l2.6-2.6M5.6 18.4l2.6-2.6" />
    </>
  ),
  snowflake: (
    <path d="M12 3v18M4.2 7.5l15.6 9M19.8 7.5l-15.6 9M12 7 9.5 4.5M12 7l2.5-2.5M12 17l-2.5 2.5M12 17l2.5 2.5" />
  ),
  envelope: (
    <>
      <path d="M3.5 6.5h17v11h-17Z" />
      <path d="M3.5 7.5 12 13.5l8.5-6" />
    </>
  ),
  music: (
    <>
      <circle cx="9" cy="17" r="2.5" />
      <circle cx="19.5" cy="14.5" r="2.5" />
      <path d="M11.5 17V5l10.5-2.5V14.5" />
    </>
  ),
  box: (
    <>
      <path d="M12 3 3.5 7.5 12 12l8.5-4.5L12 3Z" />
      <path d="M3.5 7.5v9L12 21l8.5-4.5v-9M12 12v9" />
    </>
  ),
  velvet: (
    <>
      <path d="M12 20.5S4 15.6 4 10.2A4.7 4.7 0 0 1 12 7.3a4.7 4.7 0 0 1 8 2.9c0 5.4-8 10.3-8 10.3Z" />
      <path d="M4.6 11.5h14.8" />
    </>
  ),
  wind: <path d="M3 8h9a3 3 0 1 0-3-3M3 13h13a3 3 0 1 1-3 3M3 18h8" />,
  hat: (
    <>
      <path d="M7 13V5.5h10V13" />
      <path d="M4 13h16v2.5H4Z" />
    </>
  ),
  seal: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8.2l1.2 2.6 2.8.3-2.1 1.9.6 2.7-2.5-1.4-2.5 1.4.6-2.7-2.1-1.9 2.8-.3Z" />
    </>
  ),
  vial: (
    <>
      <path d="M10 3h4M11 3v6.5L7 17.5A3 3 0 0 0 9.7 22h4.6A3 3 0 0 0 17 17.5l-4-8V3" />
      <path d="M8.2 15h7.6" />
    </>
  ),
  plush: (
    <>
      <circle cx="12" cy="13.5" r="5.5" />
      <circle cx="7.4" cy="7.4" r="2.3" />
      <circle cx="16.6" cy="7.4" r="2.3" />
      <path d="M10.2 12.6h.01M13.8 12.6h.01M10.4 15.6a2.2 2.2 0 0 0 3.2 0" />
    </>
  ),
  bouquet: (
    <>
      <circle cx="8" cy="7.6" r="2.4" />
      <circle cx="16" cy="7.6" r="2.4" />
      <circle cx="12" cy="6.4" r="2.4" />
      <path d="M12 11.5 6 20.5h12L12 11.5ZM9.6 16h4.8" />
    </>
  ),
  wand: (
    <>
      <path d="M4.5 19.5 14 10M14 10l6-6" />
      <path d="M17.6 3l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9Z" />
    </>
  ),
  sparkles: (
    <>
      <path d="M11 4l1.4 4.1 4.1 1.4-4.1 1.4L11 15l-1.4-4.1L5.5 9.5l4.1-1.4Z" />
      <path d="M18 15l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7Z" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3.5 20 6.5v6c0 4.8-3.6 7.6-8 8.8-4.4-1.2-8-4-8-8.8v-6Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  "eye-off": (
    <>
      <path d="M3 3l18 18" />
      <path d="M10.6 6.2A9 9 0 0 1 12 6c5 0 9 6 9 6a17 17 0 0 1-2.4 3M6.6 8A17 17 0 0 0 3 12s4 6 9 6a9 9 0 0 0 3.2-.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </>
  ),
  check: <path d="M5 12.5 10 17.5 19 7" />,
  x: <path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" />,
  tap: <path d="M12 4v13M6.5 11.5 12 17.5l5.5-6" />,
  card: (
    <>
      <path d="M3.5 7h17v10h-17Z" />
      <path d="M3.5 10.5h17M6.5 14h4" />
    </>
  ),
  chart: <path d="M4 19.5h16M5.5 15.5l4-5 3 3 5.5-7M18 6.5h-3.2M18 6.5v3.2" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  choco: (
    <>
      <path d="M4.5 7.5h15v11h-15Z" />
      <path d="M4.5 13h15M9.5 7.5v11M14.5 7.5v11" />
    </>
  ),
  fleur: (
    <>
      <path d="M12 4c1.5 2 1.5 4 0 6-1.5-2-1.5-4 0-6Z" />
      <path d="M12 10v10M6 12c2.5 0 4 1.5 5 3M18 12c-2.5 0-4 1.5-5 3M8 20h8" />
    </>
  ),
  emblem: (
    <>
      <path d="M12 20.5S4 15.6 4 10.2A4.7 4.7 0 0 1 12 7.3a4.7 4.7 0 0 1 8 2.9c0 5.4-8 10.3-8 10.3Z" />
      <path d="M8 11.5h8M12 8.8v6.5" />
    </>
  ),
};

export type IconName = keyof typeof ART;
export const ICON_NAMES = Object.keys(ART) as IconName[];

export function Icon({ name, className }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("inline-block h-6 w-6 shrink-0", className)}
    >
      {ART[name] ?? ART["sparkles"]}
    </svg>
  );
}
