# Layer L03 — Vite Config

**Methodology:** Read `vite.config.ts` line-by-line. Cross-referenced each plugin / manualChunk / optimizeDeps.include entry against L01 dep classifications.

Data source: `vite.config.ts` (107 lines).

## DELETE — entries tied to removed/dormant deps

| path | classification | evidence | dependencies | risk | bundle_impact | notes |
|---|---|---|---|---|---|---|
| `vite.config.ts:82` — `vendor-three` manualChunk | DELETE | L01 classifies all Three.js deps (`three`, `@react-three/*`, `maath`) as DELETE. No chunk needed once deps are gone. | L01 Three.js cluster | LOW | eliminates empty chunk | Remove the `if (id.includes('/three/'))` line |
| `vite.config.ts:89` — `vendor-sanity` manualChunk (`@sanity/`, `@portabletext/`) | DELETE (conditional on L01 UNSURE) | Tied to `@sanity/client`, `@sanity/image-url`, `@portabletext/*` cluster. If L01 UNSURE resolves DELETE, chunk becomes empty. If Sanity is preserved, keep. | L01 Sanity UNSURE | LOW | eliminates empty chunk | Remove in same pass as Sanity cleanup |

## KEEP — verified active

| path | classification | evidence |
|---|---|---|
| `adminFallbackPlugin` (L6-19) | KEEP | Dev-only middleware to serve admin.html for `/admin/*` routes (mimics Vercel hostname rewrite). Critical for local admin panel dev. |
| `react()` plugin (L42) | KEEP | `@vitejs/plugin-react` |
| `@` alias → `./src` (L45) | KEEP | Path alias used 1000+ times |
| `react`/`react-dom` alias + dedupe (L46-49) | KEEP | Prevents multiple React copies — important for TipTap + React Three (even after Three removal, keep for safety) |
| `optimizeDeps.include` TipTap list (L54-61) | KEEP | Pre-bundle TipTap for dev speed; all 14 extensions still active in admin editor |
| `optimizeDeps.exclude: ['clarity-score']` (L63) | KEEP | Excludes the `/clarity-score/` subfolder (separate Next.js app bundled here) |
| `optimizeDeps.entries: ['src/**/*.{ts,tsx}']` (L64) | KEEP | Correct entry glob |
| `test.environment: 'jsdom'` (L24) | KEEP | Vitest config |
| `test.setupFiles: './src/tests/setup.ts'` (L26) | KEEP | Vitest global setup |
| Dev proxy `/api` → `localhost:3000` (L33-36) | KEEP | Backend proxy for dev |
| `server.watch.ignored: ['**/clarity-score/**']` (L39) | KEEP | Same as optimizeDeps.exclude — clarity-score is a separate app |
| `build.rollupOptions.input.main/admin` (L68-71) | KEEP | Two-entry-point build (`index.html` + `admin.html`) — critical for deployment |
| `vendor-editor` manualChunk (L85) | KEEP | Prosemirror still used by TipTap |
| `vendor-supabase` manualChunk (L88) | KEEP | Supabase actively used (94 importers) |
| `vendor-i18n` manualChunk (L92) | KEEP | i18next actively used |
| `vendor-date` manualChunk (L95) | KEEP | date-fns actively used (28 importers) |
| `vendor-charts` manualChunk (L98 — d3) | KEEP | d3 used by ScoreHistoryPage; also a recharts dep |
| `chunkSizeWarningLimit: 600` (L103) | KEEP | Reasonable warning level |

## UNSURE

None at L03 scope — all UNSURE items here defer to L01 Sanity decision.

## Summary — L03

- **2 DELETE** candidates in vite.config.ts:
  - `vendor-three` manualChunk (tied to L01 DELETE of Three.js deps)
  - `vendor-sanity` manualChunk (tied to L01 UNSURE of Sanity cluster — remove together if Sanity scope-out is confirmed)
- **All other config entries KEEP** — vite.config.ts is lean and well-structured
- Cleanup will remove ~10 lines from vite.config.ts
