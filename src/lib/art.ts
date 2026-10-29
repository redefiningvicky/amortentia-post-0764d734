import sweet from "@/assets/box-sweet.jpg";
import trueBox from "@/assets/box-true.jpg";
import eternal from "@/assets/box-eternal.jpg";
import vault from "@/assets/box-vault.jpg";
import grand from "@/assets/box-grand.jpg";
import valentine from "@/assets/box-valentine.jpg";
import galentine from "@/assets/box-galentine.jpg";
import revenge from "@/assets/box-revenge.jpg";
import spooky from "@/assets/box-spooky.jpg";
import christmas from "@/assets/box-christmas.jpg";
import newyear from "@/assets/box-newyear.jpg";
import thanksgiving from "@/assets/box-thanksgiving.jpg";
import birthday from "@/assets/box-birthday.jpg";
import cauldron from "@/assets/opt-cauldron.jpg";
import sheet from "@/assets/potions-sheet.jpg";
import bottleCharm from "@/assets/opt-bottle-charm.jpg";
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
import ing_ember_1 from "@/assets/ing-ember-1.jpg";
import ing_ember_2 from "@/assets/ing-ember-2.jpg";
import ing_ember_3 from "@/assets/ing-ember-3.jpg";
import ing_ember_4 from "@/assets/ing-ember-4.jpg";
import ing_rose_1 from "@/assets/ing-rose-1.jpg";
import ing_rose_2 from "@/assets/ing-rose-2.jpg";
import ing_rose_3 from "@/assets/ing-rose-3.jpg";
import ing_rose_4 from "@/assets/ing-rose-4.jpg";
import ing_moon_1 from "@/assets/ing-moon-1.jpg";
import ing_moon_2 from "@/assets/ing-moon-2.jpg";
import ing_moon_3 from "@/assets/ing-moon-3.jpg";
import ing_moon_4 from "@/assets/ing-moon-4.jpg";
import ing_star_1 from "@/assets/ing-star-1.jpg";
import ing_star_2 from "@/assets/ing-star-2.jpg";
import ing_star_3 from "@/assets/ing-star-3.jpg";
import ing_star_4 from "@/assets/ing-star-4.jpg";
import ing_thorn_1 from "@/assets/ing-thorn-1.jpg";
import ing_thorn_2 from "@/assets/ing-thorn-2.jpg";
import ing_thorn_3 from "@/assets/ing-thorn-3.jpg";
import ing_thorn_4 from "@/assets/ing-thorn-4.jpg";
import ing_honey_1 from "@/assets/ing-honey-1.jpg";
import ing_honey_2 from "@/assets/ing-honey-2.jpg";
import ing_honey_3 from "@/assets/ing-honey-3.jpg";
import ing_honey_4 from "@/assets/ing-honey-4.jpg";
import ing_mist_1 from "@/assets/ing-mist-1.jpg";
import ing_mist_2 from "@/assets/ing-mist-2.jpg";
import ing_mist_3 from "@/assets/ing-mist-3.jpg";
import ing_mist_4 from "@/assets/ing-mist-4.jpg";
import ing_storm_1 from "@/assets/ing-storm-1.jpg";
import ing_storm_2 from "@/assets/ing-storm-2.jpg";
import ing_storm_3 from "@/assets/ing-storm-3.jpg";
import ing_storm_4 from "@/assets/ing-storm-4.jpg";
import ing_bloom_1 from "@/assets/ing-bloom-1.jpg";
import ing_bloom_2 from "@/assets/ing-bloom-2.jpg";
import ing_bloom_3 from "@/assets/ing-bloom-3.jpg";
import ing_bloom_4 from "@/assets/ing-bloom-4.jpg";
import ing_frost_1 from "@/assets/ing-frost-1.jpg";
import ing_frost_2 from "@/assets/ing-frost-2.jpg";
import ing_frost_3 from "@/assets/ing-frost-3.jpg";
import ing_frost_4 from "@/assets/ing-frost-4.jpg";
import ing_charm_1 from "@/assets/ing-charm-1.jpg";
import ing_charm_2 from "@/assets/ing-charm-2.jpg";
import ing_charm_3 from "@/assets/ing-charm-3.jpg";
import ing_charm_4 from "@/assets/ing-charm-4.jpg";
import { ESSENCES } from "@/lib/catalog";

export const BOX_ART: Record<string, string> = { sweet, true: trueBox, eternal, vault, grand, valentine, galentine, revenge, spooky, christmas, newyear, thanksgiving, birthday };

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
  charm: optWand,
  wish: optVial,
  romance: optBouquet,
  serenade: optMusicbox,
  cauldron,
  flutter: optHeart,
  swoon: optFlame,
  besotted: optSpell,
  hour: optMoon,
  day: optClock,
  week: optLocket,
  sweet,
};

// Raw brewing ingredients (Brew My Own): one realistic still-life painting per ingredient, keyed by raw-* id.
export const ING_ART: Record<string, string> = {
  "raw-ember-1": ing_ember_1, "raw-ember-2": ing_ember_2, "raw-ember-3": ing_ember_3, "raw-ember-4": ing_ember_4,
  "raw-rose-1": ing_rose_1, "raw-rose-2": ing_rose_2, "raw-rose-3": ing_rose_3, "raw-rose-4": ing_rose_4,
  "raw-moon-1": ing_moon_1, "raw-moon-2": ing_moon_2, "raw-moon-3": ing_moon_3, "raw-moon-4": ing_moon_4,
  "raw-star-1": ing_star_1, "raw-star-2": ing_star_2, "raw-star-3": ing_star_3, "raw-star-4": ing_star_4,
  "raw-thorn-1": ing_thorn_1, "raw-thorn-2": ing_thorn_2, "raw-thorn-3": ing_thorn_3, "raw-thorn-4": ing_thorn_4,
  "raw-honey-1": ing_honey_1, "raw-honey-2": ing_honey_2, "raw-honey-3": ing_honey_3, "raw-honey-4": ing_honey_4,
  "raw-mist-1": ing_mist_1, "raw-mist-2": ing_mist_2, "raw-mist-3": ing_mist_3, "raw-mist-4": ing_mist_4,
  "raw-storm-1": ing_storm_1, "raw-storm-2": ing_storm_2, "raw-storm-3": ing_storm_3, "raw-storm-4": ing_storm_4,
  "raw-bloom-1": ing_bloom_1, "raw-bloom-2": ing_bloom_2, "raw-bloom-3": ing_bloom_3, "raw-bloom-4": ing_bloom_4,
  "raw-frost-1": ing_frost_1, "raw-frost-2": ing_frost_2, "raw-frost-3": ing_frost_3, "raw-frost-4": ing_frost_4,
  "raw-charm-1": ing_charm_1, "raw-charm-2": ing_charm_2, "raw-charm-3": ing_charm_3, "raw-charm-4": ing_charm_4,
};

// Potion bottles: the first 10 essences live on one 5x2 sprite sheet, in ESSENCES order;
// the 11th (charm) uses its own standalone painting.
export function bottleStyle(essence: string): React.CSSProperties {
  const i = Math.max(0, ESSENCES.findIndex((e) => e.id === essence));
  if (i >= 10) return { backgroundImage: `url(${bottleCharm})`, backgroundSize: "cover", backgroundPosition: "center" };
  return { backgroundImage: `url(${sheet})`, backgroundSize: "500% 200%", backgroundPosition: `${(i % 5) * 25}% ${Math.floor(i / 5) * 100}%` };
}
