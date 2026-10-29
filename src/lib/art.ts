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
import optQuill from "@/assets/opt-quill.jpg";
import optCardVintage from "@/assets/opt-card-vintage.jpg";
import optCardSinging from "@/assets/opt-card-singing.jpg";
import optSeal from "@/assets/opt-seal.jpg";
import optVial from "@/assets/opt-vial.jpg";
import optPlush from "@/assets/opt-plush.jpg";
import optBouquet from "@/assets/opt-bouquet.jpg";
import optKraft from "@/assets/opt-kraft.jpg";
import optVelvet from "@/assets/opt-velvet.jpg";
import optMusicbox from "@/assets/opt-musicbox.jpg";
import optOwl from "@/assets/opt-owl.jpg";
import optExpress from "@/assets/opt-express.jpg";
import optCourier from "@/assets/opt-courier.jpg";
import optWand from "@/assets/opt-wand.jpg";
import optSpell from "@/assets/opt-spell.jpg";
import optCastle from "@/assets/opt-castle.jpg";
import optHeart from "@/assets/opt-heart.jpg";
import optMoon from "@/assets/opt-moon.jpg";
import optFlame from "@/assets/opt-flame.jpg";
import optShield from "@/assets/opt-shield.jpg";
import optBroken from "@/assets/opt-broken.jpg";
import optLocket from "@/assets/opt-locket.jpg";
import optCoins from "@/assets/opt-coins.jpg";
import optChart from "@/assets/opt-chart.jpg";
import optClock from "@/assets/opt-clock.jpg";
import { ESSENCES } from "@/lib/catalog";

export const BOX_ART: Record<string, string> = { sweet, true: trueBox, eternal, vault, grand, valentine, galentine, revenge, spooky };

// Realistic storybook artwork (one artist's style: burgundy & gold oil painting on aged parchment),
// keyed by catalog entry id or UI motif name.
export const OPT_ART: Record<string, string> = {
  quill: optQuill,
  vintage: optCardVintage,
  singing: optCardSinging,
  seal: optSeal,
  vial: optVial,
  plush: optPlush,
  bouquet: optBouquet,
  kraft: optKraft,
  velvet: optVelvet,
  music: optMusicbox,
  owl: optOwl,
  express: optExpress,
  courier: optCourier,
  wand: optWand,
  spell: optSpell,
  castle: optCastle,
  heart: optHeart,
  moon: optMoon,
  flame: optFlame,
  shield: optShield,
  broken: optBroken,
  locket: optLocket,
  coins: optCoins,
  chart: optChart,
  clock: optClock,
  sparkles: optWand,
  sweet,
};

// Potion bottles live on one 5x2 sprite sheet, in ESSENCES order.
export function bottleStyle(essence: string): React.CSSProperties {
  const i = Math.max(0, ESSENCES.findIndex((e) => e.id === essence));
  return { backgroundImage: `url(${sheet})`, backgroundSize: "500% 200%", backgroundPosition: `${(i % 5) * 25}% ${Math.floor(i / 5) * 100}%` };
}
