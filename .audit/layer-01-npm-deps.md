# Layer L01 — npm Dependencies (73 deps + 39 devDeps = 112)

**Methodology:** For every dep in `package.json`, ran bash loop counting importers:
`rg -l -F "from '<dep>'"` across `src/` + `scripts/` (plus explicit rg of `@/lib/sanityClient`, `@tiptap/*`, `three`, `@react-three/*`, etc.). Cross-checked against `depcheck.json` (trustworthy for 11 unused deps). Knip flagged 67 deps but had massive false positives (`framer-motion` flagged unused with 233 importers) — **treated as low-signal**.

**Strict dep-integrity rule applied**: any DELETE candidate imported transitively by a KEEP file → escalated to UNSURE.

Data sources: `.audit/raw/dep-importers.tsv`, `.audit/raw/depcheck.json`, `.audit/raw/knip-unused-deps.txt`, per-dep rg verifications.

Sizes (node_modules unpacked via pnpm) noted where material. Bundle impact estimates assume tree-shaken production build; unpacked ≠ shipped — use as comparative signal only.

## DELETE — unused deps, safe to remove (high confidence)

| path | classification | evidence | dependencies | risk | bundle_impact | notes |
|---|---|---|---|---|---|---|
| `@anthropic-ai/sdk` | DELETE | 0 importers in src/api/scripts. `src/lib/ai/llm.ts` uses raw `fetch` to `api.anthropic.com` instead of the SDK. | — | LOW | ~4.9M node_modules | AI calls go via native fetch; SDK never adopted |
| `@google/genai` | DELETE | 0 importers anywhere. No `gemini`/`Gemini`/`GoogleGenAI` refs. | — | LOW | ~11M node_modules | CLAUDE.md docs claim Gemini is used for MindMate but implementation uses Anthropic/OpenAI HTTP |
| `openai` | DELETE | 0 importers. `llm.ts` uses `fetch` to `api.openai.com`. | — | LOW | ~13M node_modules | Same as anthropic — SDK unused |
| `three` | DELETE | 0 importers. No `import ... from 'three'` anywhere. No Hero3D component. | — | LOW | ~37M node_modules | Biggest single win. CLAUDE.md mentions 3D hero — not present |
| `@react-three/drei` | DELETE | 0 importers. Three.js ecosystem unused. | — | LOW | ~2.9M node_modules | Drops with Three.js |
| `@react-three/fiber` | DELETE | 0 importers. | — | LOW | ~504K node_modules | Drops with Three.js |
| `maath` | DELETE | 0 importers. Three.js helper lib. | — | LOW | ~672K node_modules | Drops with Three.js |
| `lodash` | DELETE | 0 importers across all .ts/.tsx/.js/.mjs. | — | LOW | ~4.9M node_modules | — |
| `rehype-highlight` | DELETE | 0 importers. MarkdownRenderer only uses `remark-gfm`. | — | LOW | ~52K node_modules | — |
| `@radix-ui/react-collapsible` | DELETE | 0 importers in src. | — | LOW | ~64K node_modules | No collapsible primitive used |
| `@radix-ui/react-scroll-area` | DELETE | 0 importers in src. | — | LOW | ~216K node_modules | — |
| `@portabletext/react` | DELETE | 0 importers. Sanity PortableText rendering not wired. | — | LOW | ~76K node_modules | Part of Sanity dead cluster |
| `@portabletext/types` | DELETE | Only importer is `src/services/sanityArticleService.ts` which itself has **0 importers** (dead cluster). | `sanityArticleService.ts` (dead) | LOW | ~24K node_modules | Goes together with sanityArticleService removal |
| `src/services/sanityArticleService.ts` | DELETE (out of scope for L01 — see L08) | 0 importers across src/. `articleService` cascade already bypasses it (Supabase → TSX). | — | LOW | — | Cross-ref: L08 |

## UNSURE — escalated per strict dep-integrity rule

| path | classification | evidence | dependencies | risk | bundle_impact | notes |
|---|---|---|---|---|---|---|
| `@sanity/client` | UNSURE | 1 importer: `src/lib/sanityClient.ts`. `sanityClient.ts` is imported by **`src/services/adminService.ts` (KEEP — powers admin pages)**. Inside adminService the sanity calls run only behind `isSanityConfigured()` guard (falls through to mock when VITE_SANITY_* absent). | `sanityClient.ts` → `adminService.ts` | MED | ~5.0M node_modules | Dead code path is reachable but gated. Execute prompt must decide: (a) drop sanityClient + rip out guarded blocks from adminService, (b) keep dep for future Sanity revival. Recommend (a). |
| `@sanity/image-url` | UNSURE | 1 importer: `src/lib/sanityClient.ts` (same chain as above). | `sanityClient.ts` | MED | ~20K node_modules | Goes with `@sanity/client` decision |
| `@portabletext/toolkit` | UNSURE | 2 importers: `api/ai/embed.ts` (Vercel serverless, uses `toPlainText` for Sanity body→text), `scripts/ingest-sanity.ts` (offline ingest script). Both are Sanity-adjacent; if Sanity is dormant, both are dead flows. | `api/ai/embed.ts`, `scripts/ingest-sanity.ts` | MED | ~72K node_modules | Needs decision: is `api/ai/embed.ts` actually deployed? Is `scripts/ingest-sanity.ts` still run? If no, DELETE all three. |

## KEEP — verified used (sampled highlights; full list below)

Pre-flight and rg confirmed these high-traffic deps:

| path | classification | evidence |
|---|---|---|
| `react` | KEEP | 587 importers |
| `lucide-react` | KEEP | 378 importers |
| `framer-motion` | KEEP | 233 importers |
| `react-router-dom` | KEEP | 186 importers |
| `vitest` | KEEP | 139 importers |
| `@supabase/supabase-js` | KEEP | 94 importers |
| `@testing-library/react` | KEEP | 89 importers |
| `@tanstack/react-query` | KEEP | 31 importers |
| `date-fns` | KEEP | 28 importers |
| `recharts` | KEEP | 20 importers |
| `@tanstack/react-table` | KEEP | 19 importers |
| `sonner` | KEEP | 18 importers |
| `@tiptap/react` | KEEP | 11 importers (admin editor) |
| `jspdf` | KEEP | Dynamically imported by `ClarityJournal/lib/pdfGenerator.ts` and `export.ts` (`await import('jspdf')`) |
| `d3` | KEEP | Used by `pages/tools/clarity-score/ScoreHistoryPage.tsx` |
| `remark-gfm` | KEEP | Used by `src/features/chat/components/MarkdownRenderer.tsx` |
| `@vercel/node` | KEEP | Used by `api/*` serverless (6 files) |
| `dompurify` | KEEP | 2 importers (XSS sanitization, per recent commit) |
| All `@tiptap/extension-*` (14 extensions) | KEEP | All imported by `src/components/admin/editor/TiptapEditor.tsx` |
| `@tiptap/pm` | KEEP | 0 direct imports but is a declared peer of TipTap extensions (required at install) |
| `@radix-ui/*` (react-accordion, react-alert-dialog, react-dialog, react-dropdown-menu, react-label, react-tabs, react-tooltip) | KEEP | 1–4 importers each |
| `@hookform/resolvers` | KEEP | 3 importers (form validation) |
| `zod` | KEEP | 3 importers |
| `react-hook-form` | KEEP | 3 importers |
| `clsx` | KEEP | 1 importer |
| `class-variance-authority` | KEEP | 1 importer |
| `tailwind-merge` | KEEP | 1 importer |
| `lenis` | KEEP | 1 importer (smooth scroll) |
| `lottie-web` | KEEP | 2 importers |
| `react-markdown` | KEEP | 2 importers |
| `i18next` + `react-i18next` + `i18next-browser-languagedetector` | KEEP | Multi-language system active |
| `jest-axe` | KEEP | A11y tests |
| `glob` | KEEP | 3 importers (scripts) |
| `gray-matter` | KEEP | 3 importers (scripts for article processing) |
| `@tailwindcss/typography` | KEEP | Tailwind plugin — loaded by `tailwind.config.*` (config-level, 0 src imports) |
| `autoprefixer`, `postcss` | KEEP | PostCSS pipeline |
| `tailwindcss` | KEEP | Build tool |
| `vite`, `@vitejs/plugin-react` | KEEP | Build tool |
| `typescript`, `tsx` | KEEP | Build/exec |
| `prettier`, `husky` | KEEP | Dev tooling |
| `jsdom` | KEEP | Vitest test environment |
| `axe-core` | KEEP | A11y test infra |
| All `eslint*`, `@typescript-eslint/*` | KEEP | Lint pipeline |
| All `@storybook/*` + `@chromatic-com/storybook` + `storybook` + `eslint-plugin-storybook` | KEEP | Storybook (see L11 for story files) |
| `@playwright/test`, `playwright` | KEEP | E2E tests |
| `@types/node`, `@types/react`, `@types/react-dom` | KEEP | Type-only deps |
| `@vitest/coverage-v8`, `@vitest/browser-playwright` | KEEP | Vitest addons |

## Missing (action for execute prompt, not classification)

| dep | status | note |
|---|---|---|
| `dotenv` | MISSING | Used in scripts but not declared in package.json. Add `"dotenv"` to devDeps. |

## Summary — L01

- **112 deps total**
- **14 DELETE** (clear wins): ~68MB node_modules, material bundle savings on Three.js (~180KB gzip est.), openai + anthropic + genai SDKs (~2MB gzip est.), sanity-react/types, lodash, rehype-highlight, 2 Radix primitives
- **3 UNSURE** (gated on scope decision about Sanity strip-out + ingest pipeline): `@sanity/client`, `@sanity/image-url`, `@portabletext/toolkit`
- **95 KEEP**
- **1 MISSING** (add `dotenv`)

Top-3 L01 wins:
1. `three` + `@react-three/*` + `maath` — Three.js ecosystem fully unused (0 imports, no 3D hero in code)
2. `openai` + `@anthropic-ai/sdk` + `@google/genai` — AI SDKs unused (raw fetch pattern)
3. Sanity dep cluster — remove if Sanity strip-out is in scope
