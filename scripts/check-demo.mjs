import fs from "node:fs";
import path from "node:path";
const directory = "dist-demo";
function files(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory() ? files(path.join(dir, entry.name)) : [path.join(dir, entry.name)],
    );
}
const all = files(directory);
const text = all
  .filter((file) => /\.(js|css|html)$/.test(file))
  .map((file) => fs.readFileSync(file, "utf8"))
  .join("\n");
for (const forbidden of [
  "supabase.co",
  "sb_publishable_",
  "sb_secret_",
  "__l5e/assets",
  "auth-bridge",
  "fonts.googleapis.com",
]) {
  if (text.includes(forbidden))
    throw new Error(`Static demo still includes a cloud dependency: ${forbidden}`);
}
if (!fs.existsSync(path.join(directory, "index.html"))) throw new Error("Missing index.html");
console.log(
  `Checked ${all.length} static files: no Lovable, Supabase, or external font dependencies.`,
);
