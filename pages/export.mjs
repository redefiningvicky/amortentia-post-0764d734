import { chromium } from "playwright";
import { PDFDocument } from "pdf-lib";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile, copyFile, cp } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { execFileSync } from "node:child_process";

const root = resolve("dist-pages");
const prefix = "/amortentia-post-0764d734/";
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".jpg": "image/jpeg", ".png": "image/png", ".woff2": "font/woff2" };
const server = createServer(async (req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  if (!pathname.startsWith(prefix)) { res.writeHead(404).end(); return; }
  const path = resolve(root, decodeURIComponent(pathname.slice(prefix.length)) || "index.html");
  if (!path.startsWith(root + "/")) { res.writeHead(403).end(); return; }
  try { res.writeHead(200, { "Content-Type": types[extname(path)] || "application/octet-stream" }); res.end(await readFile(path)); }
  catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(4173, "127.0.0.1", r));
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 3840, height: 2160 }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem("ap-toured", "1"));
  const base = "http://127.0.0.1:4173" + prefix;
  for (const route of ["/", "/discover", "/send", "/spellbook", "/wall", "/me", "/gift"]) {
    await page.goto(base + "#" + route, { waitUntil: "networkidle" });
    // Readiness follows the actual UI: Send uses an h2; Me has a profile input.
    const ready = route === "/send"
      ? page.getByRole("heading", { name: "How Many Bites Will It Take?", exact: true })
      : route === "/me"
        ? page.getByRole("textbox", { name: "Display name", exact: true })
        : page.locator("h1").first();
    try {
      await ready.waitFor();
    } catch (error) {
      throw new Error("Route readiness failed: " + route + "\\n" + errors.join("\\n") + "\\n" + (await page.locator("body").innerText()), { cause: error });
    }
    if (/Page not found|This page didn't load/.test(await page.locator("body").innerText())) throw new Error("Route failed: " + route);
    console.log("Verified route " + route);
  }
  // A real self-contained gift must survive reloading a project-subdirectory URL.
  const query = new URLSearchParams({ id: "pages-smoke-test", to: "Henry", from: "Ramona", tier: "sweet", blend: "", note: "A little magic." });
  await page.goto(base + "#/gift?" + query, { waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" });
  await page.getByRole("heading", { level: 1 }).first().waitFor();
  const out = resolve("exports/pitch");
  await mkdir(out + "/png", { recursive: true });
  await mkdir(out + "/jpg", { recursive: true });
  const combined = await PDFDocument.create();
  const names = ["problem", "solution", "market", "product", "the-payoff", "smile"];
  for (let i = 1; i <= 6; i++) {
    await page.goto(base + "#/pitch?slide=" + i + "&export=4k", { waitUntil: "networkidle" });
    await page.locator("[data-pitch-export]").waitFor();
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(async img => {
        img.loading = "eager";
        await img.decode();
        if (!img.naturalWidth) throw new Error("Missing image: " + img.src);
      }));
    });
    await page.emulateMedia({ media: "screen", reducedMotion: "reduce" });
    const box = await page.locator("[data-pitch-export]").boundingBox();
    if (box.width !== 3840 || box.height !== 2160) throw new Error("Incorrect export dimensions");
    await page.locator("[data-pitch-export]").screenshot({ path: out + "/png/" + String(i).padStart(2, "0") + "-" + names[i - 1] + ".png", animations: "disabled" });
    await page.locator("[data-pitch-export]").screenshot({ path: out + "/jpg/" + String(i).padStart(2, "0") + "-" + names[i - 1] + ".jpg", type: "jpeg", quality: 95, animations: "disabled" });
    const bytes = await page.pdf({ width: "3840px", height: "2160px", printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 }, pageRanges: "1" });
    const pdf = await PDFDocument.load(bytes);
    const [slide] = await combined.copyPages(pdf, [0]);
    combined.addPage(slide);
    console.log("Exported slide " + i);
  }
  if (errors.length) throw new Error(errors.join("\n"));
  combined.setTitle("Amortentia Post — Pitch Deck");
  await writeFile(out + "/amortentia-post-pitch.pdf", await combined.save());
  execFileSync("python3", ["-c", "from pathlib import Path; from zipfile import ZipFile, ZIP_DEFLATED; root=Path('exports/pitch'); z=ZipFile('exports/amortentia-post-png-pdf.zip','w',ZIP_DEFLATED); [z.write(p,p.relative_to(root)) for p in sorted(root.rglob('*')) if p.is_file()]; z.close()"]);
  await mkdir(root + "/downloads", { recursive: true });
  await copyFile("exports/amortentia-post-png-pdf.zip", root + "/downloads/amortentia-post-png-pdf.zip");
  await cp(out, root + "/downloads/pitch", { recursive: true });
  await writeFile(root + "/.nojekyll", "");
} finally {
  await browser.close();
  await new Promise(r => server.close(r));
}
