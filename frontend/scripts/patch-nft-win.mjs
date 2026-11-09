// Idempotently patches the nft bundle vendored inside next/dist to stop
// emitting directory globs outside the tracing base. Without this, `next build`
// on Windows fails with EPERM when nft statically evaluates the generated
// Prisma client's schema-path lookup and globs os.homedir()/**, which hits the
// "Application Data" junction.
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const file = join(root, "node_modules", "next", "dist", "compiled", "@vercel", "nft", "index.js");

const NEEDLE =
  "const emitAssetDirectory=e=>{if(!r.analysis.emitGlobs)return;const t=e.indexOf(c.WILDCARD);const o=t===-1?e.length:e.lastIndexOf(a.default.sep,t);const u=e.substring(0,o);";

const GUARD =
  "const emitAssetDirectory=e=>{if(!r.analysis.emitGlobs)return;const t=e.indexOf(c.WILDCARD);const o=t===-1?e.length:e.lastIndexOf(a.default.sep,t);let u=e.substring(0,o);const tb=a.default.resolve(r.base);const tup=u===\"\"?tb:a.default.resolve(r.base,u);const rel=a.default.relative(tb,tup);if(rel.startsWith(\"..\")||a.default.isAbsolute(rel))return;u=tup;";

if (!existsSync(file)) {
  console.log("[patch-nft-win] nft bundle not found, skipping.");
  process.exit(0);
}

const source = readFileSync(file, "utf8");
if (source.includes("const rel=a.default.relative(tb,tup);")) {
  console.log("[patch-nft-win] already patched, skipping.");
  process.exit(0);
}
if (!source.includes(NEEDLE)) {
  console.warn("[patch-nft-win] expected nft pattern not found; next may have been upgraded. Skipping.");
  process.exit(0);
}
writeFileSync(file, source.replace(NEEDLE, GUARD));
console.log("[patch-nft-win] patched nft emitAssetDirectory guard.");
