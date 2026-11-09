# project_personal_portfolio_nextjs

## Personal Portfolio (Next.js + Cloudflare)

A personal portfolio and blog built with Next.js 15, Prisma, Cloudflare D1, R2, and OpenNext. It includes public pages, a gallery, a blog, a contact form, and an admin area.

- Original location: `D:\projects\profile of mine`
- Working copy: `D:\PROJECTS_READY\project_personal_portfolio_nextjs`
- Stack: Next.js 15, React 19, TypeScript, Prisma 6, Cloudflare D1/R2, Wrangler, OpenNext

## Folder layout

```text
project_personal_portfolio_nextjs/
  frontend/   Next.js app, Prisma schema, D1 migrations, Wrangler config
  database/   Database notes
  infra/      Deployment notes
  docs/       Project documentation
```

## Local setup (Cloudflare runtime)

`next start` is **not** the supported runtime for this project. Use Wrangler with the local D1/R2 bindings.

```powershell
cd frontend
npm ci
Copy-Item .dev.vars.example .dev.vars
npm run db:apply:local
npm run db:seed
npm run build:cf
npm run preview
```

`npm run preview` starts `wrangler dev` on <http://localhost:8787> using local D1 state under `.wrangler/state/v3/d1`.

Environment files:

- `.dev.vars` — local Wrangler secrets (ignored by Git)
- `.env.example` / `.dev.vars.example` — templates

## Verified status (2026-11-09)

- [x] `npm ci` completed
- [x] Local D1 migration `0001_init.sql` applied
- [x] Seed data loaded
- [x] `npm run build:cf` passed with the Next.js compatibility flag
- [x] `wrangler dev` on port 8787 served `/`, `/about`, `/work`, `/blog`, `/gallery`, `/contact`, and `/admin/login` with HTTP 200
- [x] `/admin` redirects to login when unauthenticated
- [x] Admin login endpoint returned HTTP 200
- [ ] Cloudflare deployment not performed; requires `CLOUDFLARE_API_TOKEN`

## Notes and limitations

- This project targets Cloudflare Workers/Pages via OpenNext, not a plain Node.js server.
- The D1 database ID in `wrangler.jsonc` is a placeholder; replace it for a real Cloudflare deployment.
- R2 image storage is configured as a binding; local Wrangler simulates it.
- `.dev.vars`, `.env`, `.wrangler`, `.next`, and `.open-next` must not be committed.
- The build uses `--dangerouslyUseUnsupportedNextVersion` because the installed Next.js version is newer than OpenNext’s tested range.

## Troubleshooting

- **`next start` fails or behaves differently**: use `npm run preview` (Wrangler) instead.
- **D1 table missing**: run `npm run db:apply:local` before starting Wrangler.
- **Admin login fails**: run `npm run db:seed` and confirm the seeded credentials.
- **Deployment asks for credentials**: set `CLOUDFLARE_API_TOKEN` and replace the placeholder D1 database ID.
- **Wrangler port conflict**: stop the process on port 8787 or pass a different `--port`.
