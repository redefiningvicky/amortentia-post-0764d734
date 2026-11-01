// Draws a funny, shareable 1080x1350 card on a canvas and returns it as a PNG file.
// Canvas can't read CSS variables, so the brand colors are mirrored here.
const BURGUNDY = "#3b0a14";
const GOLD = "#e8c272";
const PARCHMENT = "#f3e6c8";

export async function makeShareCard(o: {
  total: number;
  to: string;
  blend: string;
  level: string;
}): Promise<File> {
  const c = document.createElement("canvas");
  c.width = 1080;
  c.height = 1350;
  const g = c.getContext("2d")!;
  const bg = g.createRadialGradient(540, 500, 100, 540, 675, 900);
  bg.addColorStop(0, "#6b1324");
  bg.addColorStop(1, BURGUNDY);
  g.fillStyle = bg;
  g.fillRect(0, 0, 1080, 1350);
  g.strokeStyle = GOLD;
  g.lineWidth = 6;
  g.strokeRect(40, 40, 1000, 1270);
  g.textAlign = "center";
  const line = (t: string, y: number, size: number, color = PARCHMENT, font = "Georgia, serif") => {
    g.fillStyle = color;
    g.font = `${size}px ${font}`;
    const words = t.split(" ");
    let cur = "";
    let yy = y;
    for (const w of words) {
      if (g.measureText(cur + w).width > 900 && cur) {
        g.fillText(cur.trim(), 540, yy);
        cur = "";
        yy += size * 1.25;
      }
      cur += w + " ";
    }
    g.fillText(cur.trim(), 540, yy);
    return yy;
  };
  line("AMORTENTIA POST", 140, 44, GOLD);
  // Gold emblem drawn in vector: a heart cradling a chocolate bar.
  g.save();
  g.translate(540, 320);
  g.scale(11, 11);
  g.translate(-12, -12);
  g.strokeStyle = GOLD;
  g.lineWidth = 0.9;
  g.lineJoin = "round";
  g.lineCap = "round";
  g.stroke(
    new Path2D(
      "M12 20.5S4 15.6 4 10.2A4.7 4.7 0 0 1 12 7.3a4.7 4.7 0 0 1 8 2.9c0 5.4-8 10.3-8 10.3Z",
    ),
  );
  g.stroke(new Path2D("M8 11.5h8M12 8.8v6.5"));
  g.restore();
  let y = line(`I just spent $${o.total.toFixed(2)}`, 560, 76, GOLD, "bold Georgia, serif");
  y = line(`on love-potion chocolates to make ${o.to || "them"} love me.`, y + 90, 56);
  y = line("Pray for me.", y + 100, 64, GOLD, "italic Georgia, serif");
  line(`Blend: ${o.blend}`, y + 120, 40);
  line(`Desperation level: ${o.level}`, y + 180, 40, GOLD);
  line("Now we wait for the first bite…", 1240, 36, PARCHMENT, "italic Georgia, serif");
  const blob: Blob = await new Promise((r) => c.toBlob((b) => r(b!), "image/png"));
  return new File([blob], "amortentia-confession.png", { type: "image/png" });
}
