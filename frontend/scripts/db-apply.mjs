import { execSync } from "node:child_process";
import { readdirSync } from "node:fs";
import path from "node:path";
import "dotenv/config";

const remote = process.argv.includes("--remote");
const dbName = process.env.D1_DATABASE_NAME ?? "rabin-portfolio-db";
const migrationsDir = path.resolve("migrations");

const files = readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.error("No migration files found in migrations/");
  process.exit(1);
}

for (const file of files) {
  const flag = remote ? "--remote" : "--local";
  console.log(`Applying ${file} (${remote ? "remote" : "local"})...`);
  execSync(
    `npx wrangler d1 execute ${dbName} ${flag} --file="${path.join(migrationsDir, file)}"`,
    { stdio: "inherit", shell: true },
  );
}

console.log(`Done. ${files.length} migration(s) applied ${remote ? "to remote D1" : "to local D1"}.`);
