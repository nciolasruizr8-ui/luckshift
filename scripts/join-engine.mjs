import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dir = join(root, "engine-src");
const names = readdirSync(dir)
  .filter((name) => /^p\d+\.ts\.txt$/.test(name))
  .sort();
if (names.length !== 8) {
  throw new Error(`expected 8 engine parts, found ${names.length}`);
}
const body = names.map((name) => readFileSync(join(dir, name), "utf8")).join("");
mkdirSync(join(root, "src/game"), { recursive: true });
writeFileSync(join(root, "src/game/engine.ts"), body);
