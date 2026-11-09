import fs from "node:fs";
import path from "node:path";

const workerFile = path.join(process.cwd(), ".open-next", "worker.js");
const wasmRelative = "server-functions/default/generated/prisma/query_compiler_bg.wasm";

if (!fs.existsSync(workerFile)) {
  console.error("patch-worker-wasm: .open-next/worker.js not found, skipping.");
  process.exit(0);
}

let source = fs.readFileSync(workerFile, "utf8");

if (source.includes("__PRISMA_QUERY_COMPILER_WASM__")) {
  console.log("patch-worker-wasm: already patched, skipping.");
  process.exit(0);
}

const prelude = [
  "// patched by patch-worker-wasm - exposes the prisma query compiler wasm module",
  `import queryCompilerWasm from "./${wasmRelative}";`,
  "globalThis.__PRISMA_QUERY_COMPILER_WASM__ = queryCompilerWasm ?? queryCompilerWasm?.module ?? queryCompilerWasm?.default;",
  "",
].join("\n");

source = prelude + source;
fs.writeFileSync(workerFile, source);
console.log("patch-worker-wasm: injected wasm module import into worker.js.");