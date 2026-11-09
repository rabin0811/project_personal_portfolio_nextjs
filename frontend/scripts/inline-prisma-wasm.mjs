import fs from "node:fs";
import path from "node:path";

const prismaDir = path.join(process.cwd(), "generated", "prisma");
const indexFile = path.join(prismaDir, "index.js");

if (!fs.existsSync(indexFile)) {
  console.error("inline-prisma-wasm: generated client index.js not found, skipping.");
  process.exit(0);
}

let source = fs.readFileSync(indexFile, "utf8");

if (source.includes("OPENCLOUD_INLINE_WASM")) {
  console.log("inline-prisma-wasm: already patched, skipping.");
  process.exit(0);
}

const blockPattern = /config\.compilerWasm = \{[\s\S]*?\n    \}/;
if (!blockPattern.test(source)) {
  console.error("inline-prisma-wasm: could not find config.compilerWasm block, skipping.");
  process.exit(0);
}

const inline = [
  "config.compilerWasm = {",
  "      /* OPENCLOUD_INLINE_WASM - query compiler wasm resolved from the worker module binding */",
  "      getRuntime: async () => require('./query_compiler_bg.js'),",
  "      getQueryCompilerWasmModule: async () => {",
  "        const loadedModule = globalThis.__PRISMA_QUERY_COMPILER_WASM__",
  "        if (loadedModule == null) throw new Error('Missing __PRISMA_QUERY_COMPILER_WASM__ module binding')",
  "        return loadedModule",
  "      }",
  "    }",
].join("\n");

source = source.replace(blockPattern, inline);
fs.writeFileSync(indexFile, source);
console.log("inline-prisma-wasm: patched compilerWasm to use globalThis module binding.");