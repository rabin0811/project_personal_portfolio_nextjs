import bcrypt from "bcryptjs";
import { execSync } from "node:child_process";
import { writeFileSync, rmSync } from "node:fs";
import path from "node:path";
import "dotenv/config";

const remote = process.argv.includes("--remote");
const dbName = process.env.D1_DATABASE_NAME ?? "rabin-portfolio-db";
const adminEmail = process.env.ADMIN_EMAIL ?? "admin@humagainrabin.com.np";
const adminPassword = process.env.ADMIN_PASSWORD ?? "change-me-now";
const adminHash = bcrypt.hashSync(adminPassword, 10);

const q = (s) => "'" + String(s).replace(/'/g, "''") + "'";

const svg = (label, color = "#111111") =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><rect width="1200" height="800" fill="${color}"/><text x="60" y="400" font-family="monospace" font-size="42" fill="#FAFAFA">${label}</text></svg>`,
  )}`;

function tableCount(table) {
  const out = execSync(
    `npx wrangler d1 execute ${dbName} ${remote ? "--remote" : "--local"} --json --command "SELECT COUNT(*) AS n FROM \\"${table}\\""`,
    { encoding: "utf8", shell: true },
  );
  const results = JSON.parse(out);
  return results[0]?.results?.[0]?.n ?? 0;
}

const skillCount = tableCount("Skill");
const hasContent = skillCount > 0;

const statements = [];

statements.push(`INSERT OR IGNORE INTO "User" ("id","email","passwordHash","role","createdAt") VALUES (${q("seed-admin")},${q(adminEmail)},${q(adminHash)},${q("admin")},${q("2026-08-01T00:00:00.000Z")});`);
statements.push(`INSERT OR IGNORE INTO "SiteConfig" ("id","bio","email","github","linkedin","twitter","location") VALUES (1,${q(
  "Full stack developer from Nepal building fast, reliable web applications. I work across the stack — Python, C#, .NET, Next.js, React — and I care about clean architecture, fast load times, and systems that stay up. When I'm not coding I'm usually traveling and taking photos.",
)},${q(adminEmail)},${q("https://github.com/rabin-humagain")},${q("https://www.linkedin.com/in/rabin-humagain")},${q("https://x.com/rabinhumagain")},${q("Nepal")});`);

if (!hasContent) {
  const skills = [
    ["Python", "language"], ["C", "language"], ["C++", "language"], ["C#", "language"],
    ["JavaScript", "language"], ["TypeScript", "language"], ["SQL", "language"],
    [".NET", "framework"], ["Next.js", "framework"], ["React", "framework"], ["Node.js", "framework"],
    ["Git", "tool"], ["Docker", "tool"], ["Prisma", "tool"], ["PostgreSQL", "tool"],
  ];
  skills.forEach(([name, category], index) => {
    statements.push(`INSERT INTO "Skill" ("id","name","category","order") VALUES (${q(`seed-skill-${index}`)},${q(name)},${q(category)},${index});`);
  });

  const projects = [
    {
      slug: "inventory-suite",
      title: "Inventory Suite",
      summary: "Warehouse management app with live stock tracking, barcode scanning and role-based dashboards.",
      description:
        "Problem: small warehouses tracked stock in spreadsheets, leading to overselling and order delays.\n\nApproach: built a .NET 8 API with a React dashboard, using PostgreSQL and Prisma for data, and a mobile-friendly scanner flow for receiving and dispatch.\n\nResult: dispatch time per order dropped from ~12 minutes to under 3, and stock discrepancies went to near zero.",
      tags: [".NET", "React", "PostgreSQL"],
      live: "https://example.com",
      repo: "https://github.com/rabin-humagain",
      featured: true,
    },
    {
      slug: "edumetrics",
      title: "EduMetrics",
      summary: "Learning analytics platform that turns raw assessment data into teacher-friendly reports.",
      description:
        "Problem: schools had no way to see learning trends across classes and terms.\n\nApproach: a Next.js front end with a Python data pipeline that ingests CSV exports, computes trends, and renders charts server-side.\n\nResult: teachers get per-class heatmaps and trend lines in one click, no spreadsheets required.",
      tags: ["Next.js", "Python", "SQL"],
      live: null,
      repo: "https://github.com/rabin-humagain",
      featured: true,
    },
    {
      slug: "chautari-chat",
      title: "Chautari Chat",
      summary: "A realtime chat app for community groups, with channels, threads and push notifications.",
      description:
        "Problem: community groups scattered across WhatsApp threads needed a calmer home.\n\nApproach: Next.js + WebSockets with C# services, image uploads, and offline-friendly reads.\n\nResult: a self-hostable chat app used by local groups for announcements and planning.",
      tags: ["Next.js", "C#", "Docker"],
      live: "https://example.com",
      repo: "https://github.com/rabin-humagain",
      featured: false,
    },
  ];
  projects.forEach((project, index) => {
    const pid = `seed-project-${index}`;
    statements.push(`INSERT INTO "Project" ("id","title","slug","summary","description","liveUrl","repoUrl","techTags","featured","published","order","createdAt") VALUES (${q(pid)},${q(project.title)},${q(project.slug)},${q(project.summary)},${q(project.description)},${project.live ? q(project.live) : "NULL"},${project.repo ? q(project.repo) : "NULL"},${q(project.tags.join(", "))},${project.featured ? 1 : 0},1,${index},${q("2026-07-01T00:00:00.000Z")});`);
    statements.push(`INSERT INTO "ProjectImage" ("id","projectId","url","order") VALUES (${q(`${pid}-shot`)} ,${q(pid)},${q(svg(project.title))},0);`);
  });

  const postId = "seed-post-1";
  statements.push(`INSERT INTO "BlogPost" ("id","title","slug","location","publishedAt","status") VALUES (${q(postId)},${q("Kopan Monastery, Kathmandu — a slow afternoon")},${q("kopan-monastery-kathmandu")},${q("Kathmandu")},${q("2026-07-20T09:00:00.000Z")},${q("published")});`);
  const blocks = [
    ["text", "Arrived early morning, fog hadn't lifted yet. The monastery sits on a hill east of the ring road, and the first thing you notice is the noise dropping away — just prayer flags and bells."],
    ["image", svg("Kopan hillside, Kathmandu", "#1a4d2e"), "Kopan hillside, Kathmandu"],
    ["text", "The afternoon classes were quiet; a few monks, a handful of visitors. If you go, take the path past the stupa and walk the outer circle — the view across the valley is worth it."],
  ];
  blocks.forEach(([type, content, caption], index) => {
    statements.push(`INSERT INTO "BlogBlock" ("id","postId","type","content","caption","order") VALUES (${q(`seed-block-1-${index}`)},${q(postId)},${q(type)},${q(content)},${caption ? q(caption) : "NULL"},${index});`);
  });

  const gallery = [
    ["Kathmandu valley at dusk", "Kathmandu", "#2b2b2b"],
    ["Tea garden rows", "Ilam", "#3f6212"],
    ["Mountain road", "Mustang", "#1e3a5f"],
    ["Old town lane", "Bhaktapur", "#7f1d1d"],
  ];
  gallery.forEach(([caption, location, color], index) => {
    statements.push(`INSERT INTO "GalleryImage" ("id","url","caption","location","uploadedAt") VALUES (${q(`seed-gallery-${index}`)},${q(svg(`${location} — sample photo`, color))},${q(caption)},${q(location)},${q(`2026-07-0${index + 1}T08:00:00.000Z`)});`);
  });
}

const sqlFile = path.resolve("scripts", "seed-tmp.sql");
writeFileSync(sqlFile, statements.join("\n"), "utf8");

try {
  const flag = remote ? "--remote" : "--local";
  execSync(`npx wrangler d1 execute ${dbName} ${flag} --file="${sqlFile}"`, {
    stdio: "inherit",
    shell: true,
  });
} finally {
  rmSync(sqlFile, { force: true });
}

console.log(hasContent ? "Seeded admin user + site config (content exists, skipped content seed)." : "Seeded admin, site config, skills, projects, blog post and gallery samples.");
