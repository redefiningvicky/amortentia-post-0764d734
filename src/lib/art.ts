import sweet from "@/assets/box-sweet.jpg";
import trueBox from "@/assets/box-true.jpg";
import eternal from "@/assets/box-eternal.jpg";
import vault from "@/assets/box-vault.jpg";
import grand from "@/assets/box-grand.jpg";
import valentine from "@/assets/box-valentine.jpg";
import galentine from "@/assets/box-galentine.jpg";
import revenge from "@/assets/box-revenge.jpg";
import spooky from "@/assets/box-spooky.jpg";
import sheet from "@/assets/potions-sheet.jpg";
import { ESSENCES } from "@/lib/catalog";

export const BOX_ART: Record<string, string> = { sweet, true: trueBox, eternal, vault, grand, valentine, galentine, revenge, spooky };

// Potion bottles live on one 5x2 sprite sheet, in ESSENCES order.
export function bottleStyle(essence: string): React.CSSProperties {
  const i = Math.max(0, ESSENCES.findIndex((e) => e.id === essence));
  return { backgroundImage: `url(${sheet})`, backgroundSize: "500% 200%", backgroundPosition: `${(i % 5) * 25}% ${Math.floor(i / 5) * 100}%` };
}
