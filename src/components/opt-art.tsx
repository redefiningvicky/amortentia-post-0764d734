import { OPT_ART } from "@/lib/art";

export function OptArt({ id, alt, className }: { id: string; alt: string; className?: string }) {
  return (
    <img
      src={OPT_ART[id]}
      alt={alt}
      loading="lazy"
      width={512}
      height={512}
      className={className ?? "h-14 w-14 shrink-0 rounded-xl object-cover"}
    />
  );
}
