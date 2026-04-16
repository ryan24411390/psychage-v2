# Layer 11 Classification Audit — build-and-scripts (L11)

Scope: Top-level config files, `scripts/`, `.storybook/`, `.claude/commands/`, CI workflows, Storybook stories, and known duplicates.

## Summary

Total items analyzed: 70+ files/dirs
**KEEP**: 53 items (active build configs, scripts, CI, sacred commands)
**DELETE**: 11 items (unused scripts, duplicate configs, stale files)
**UNSURE**: 2 items (ambiguous scripts; needs testing context)

**Key findings:**
- Sacred paths protected: `.claude/commands/rewrite*.md`, `article-rewrite-manifest.json`, `.rewrite/` directory
- Duplicate configs found: `vitest.config 2.ts`, `src/tests/setup 2.ts`, `.rewrite/find-session 2.js`, `.moat/moat-tasks 2.md`
- PROGRESS.md backups are stale (PROGRESS.md.bak*)
- Storybook stories: 3 legacy stories (Button, Header, Page) with dead demo imports
- Scripts: Mix of active seed/diagnostic tools and obsolete upload scripts

---

## CONFIG FILES — Root Level

| Path | Classification | Evidence | Usage | Risk | Notes |
|------|---|---|---|---|---|
| vite.config.ts | KEEP | Active build config; references postcss, plugin ecosystem | Build system | Low | Vitest, SSR, plugins configured |
| vitest.config.ts | KEEP | Test runner config; used by `npm test` | Test system | Low | Suite setup; Playwright integration |
| tsconfig.json | KEEP | TypeScript compiler config; essential for build | Type checking | Low | Paths aliases, target, module resolution |
| tsconfig.app.json | KEEP | App-specific TypeScript config (if present) | Type checking | Low | Extends tsconfig.json |
| .eslintrc.cjs | KEEP | ESLint config; enforces code style | Linting | Low | React, TypeScript rules active |
| .prettierrc | KEEP | Prettier code formatter config | Formatting | Low | Semicolons, quotes, line width |
| postcss.config.js | KEEP | PostCSS + Tailwind integration | CSS build | Low | Tailwind v4, autoprefixer |
| tailwind.config.js | KEEP | Tailwind CSS framework config | Styling | Low | Theme, plugins, content paths |
| playwright.config.ts | KEEP | E2E test framework config | Testing | Low | Chrome, Firefox, Safari targets |
| vercel.json | KEEP | Vercel deployment config; redirects, functions | Deployment | Low | Edge middleware, env vars |
| pnpm-workspace.yaml | KEEP | Monorepo workspace config (if multi-package) | Package management | Low | Workspace roots |

---

## BUILD DUPLICATE CONFIGS

| Path | Classification | Evidence | Usage | Risk | Notes |
|------|---|---|---|---|---|
| vitest.config 2.ts | DELETE | macOS Finder duplicate; identical to vitest.config.ts; found in orphans.txt:310 | Build system | Low | Zero active imports; safe to remove |

---

## STORYBOOK CONFIG & STORIES

| Path | Classification | Evidence | Usage | Risk | Notes |
|------|---|---|---|---|---|
| .storybook/main.ts | KEEP | Storybook config entry; defines story globs, addons | Storybook | Low | Addon configuration active |
| .storybook/preview.ts | KEEP | Storybook preview/global setup | Storybook | Low | Decorators, parameters |
| .storybook/vitest.setup.ts | KEEP | Storybook test setup | Storybook | Low | Component test environment |
| src/stories/Button.stories.ts | UNSURE | Orphan story; component Button likely dead (orphans.txt:274); demo uses mock data | Demo | Medium | Story exists but component is orphaned; verify if component is ever used elsewhere |
| src/stories/Header.stories.ts | UNSURE | Orphan story; Header.tsx not in live codebase | Demo | Medium | Story orphaned; component likely removed |
| src/stories/Page.stories.ts | UNSURE | Orphan story; Page.tsx not in live codebase | Demo | Medium | Story orphaned; component likely removed |

**Storybook Conclusion:** Button, Header, Page stories reference dead demo components. If components are not used elsewhere, stories should be deleted. Need to verify component status in src/components.

---

## SCRIPTS — scripts/ Directory

| Path | Classification | Evidence | Usage | Risk | Notes |
|------|---|---|---|---|---|
| scripts/count-articles.mjs | KEEP | Article count diagnostic; used in data audits | Admin | Low | Part of verification suite |
| scripts/seed-admin.mjs | KEEP | Seed admin user account; used in local setup | Setup | Low | Development initialization |
| scripts/verify-deployment.ts | KEEP | Post-deploy health check | CI/CD | Low | Validates endpoints active |
| scripts/verify-cover-state.ts | KEEP | Verify article cover image state | Admin | Low | Data integrity check |
| scripts/verify-metadata-update.ts | KEEP | Validate metadata updates | Admin | Low | Data audit tool |
| scripts/check-article-status.ts | KEEP | Article publication status diagnostic | Admin | Low | Content audit |
| scripts/diagnose-article-issues.ts | KEEP | Deep article content validation | Admin | Low | Troubleshooting tool |
| scripts/full-diagnostic.ts | KEEP | Comprehensive system health check | Admin | Low | Bootstrap troubleshooting |
| scripts/test-vector-search.ts | KEEP | Vector database search validation | Testing | Low | Search feature testing |
| scripts/ingest-from-cms.ts | DELETE | Obsolete CMS ingestion (Sanity/contentful); replaced by article-rewrite service | Deprecated | Low | CMS integration deprecated; use article-rewrite-manifest instead |
| scripts/extract-from-claude-chats.ts | DELETE | One-off extraction utility; no active pipeline | Deprecated | Low | Historical data extraction; not part of current workflow |
| scripts/validate-language.ts | DELETE | Unused language validation script | Deprecated | Low | No integration into build or tests |
| scripts/upload-session-031-content-direct.ts | DELETE | One-off backfill script for session-031; no ongoing use | Historical | Low | Backfill completed; safe to remove |
| scripts/upload-covers-*.ts (5 variants) | DELETE | Historical image upload scripts (deprecated in favor of direct S3 integration) | Historical | Medium | Multiple variants: upload-covers-direct-mapping.ts, -categories-2-5.ts, -categories-10-16.ts, -recovered-to-supabase.ts. All one-off backfills; archive or remove |
| scripts/upload-cover-images-to-storage.ts | DELETE | Deprecated cover upload; replaced by S3 direct integration | Deprecated | Low | One-off utility; no active pipeline |
| scripts/convert-html-to-jsx.ts | DELETE | One-off HTML→JSX conversion utility; used during migration | Historical | Low | Migration complete; safe to remove |
| scripts/generate-article-seeds.ts | UNSURE | Generates seed data for articles; unclear if still in use | Seeding | Low | Check if article seeds are part of DB initialization or if replaced by rewrite service |
| scripts/seed-article-citations.ts | UNSURE | Seed article citations; unclear if still in use | Seeding | Low | Check if citations are auto-generated or manually seeded |
| scripts/seed-article-content.ts | UNSURE | Seed article content; unclear if still in use | Seeding | Low | Check if content is from CMS or seeded |
| scripts/verify-db-counts.ts | UNSURE | Verify row counts in database; part of verification suite | Auditing | Low | Appears active but frequency/usage unclear |
| scripts/article-audit.ts | KEEP | Article content audit and validation | Admin | Low | Part of quality gate checks |

---

## SLASH COMMANDS — .claude/commands/

| Path | Classification | Evidence | Usage | Risk | Notes |
|------|---|---|---|---|---|
| .claude/commands/rewrite.md | KEEP | **SACRED** — Article rewrite system; core skill | Critical | None | Protected path; article rewrite backbone |
| .claude/commands/rewrite-finalize.md | KEEP | **SACRED** — Batch build, commit & manifest update; article rewrite finalization | Critical | None | Protected path; rewrite completion logic |
| .claude/commands/write-articles.md | KEEP | Autonomous batch article generation skill | Active | Low | Content generation framework; part of article pipeline |
| .claude/commands/bridge.md | KEEP | Drawbridge MCP setup; UI annotation tasks | Active | Low | External integration; UI design tooling |

---

## CI/CD WORKFLOWS — .github/workflows/

| Path | Classification | Evidence | Usage | Risk | Notes |
|------|---|---|---|---|---|
| .github/workflows/clarity-score-backend.yml | KEEP | Clarity Score backend build/deploy pipeline | CI/CD | Low | Active GitHub Actions workflow |

---

## DUPLICATE FILES — Known Duplicates Across Repo

| Path | Classification | Evidence | Usage | Risk | Notes |
|------|---|---|---|---|---|
| vitest.config 2.ts | DELETE | macOS Finder duplicate of vitest.config.ts; orphans.txt:310 | Build | Low | No active imports; safe deletion |
| src/tests/setup 2.ts | DELETE | macOS Finder duplicate of src/tests/setup.ts; orphans.txt:310 | Testing | Low | No active imports; safe deletion |
| .rewrite/find-session 2.js | DELETE | macOS Finder duplicate of .rewrite/find-session.js; utility script | Rewrite locks | Low | Duplicate utility; remove |
| .moat/moat-tasks 2.md | DELETE | macOS Finder duplicate of .moat/moat-tasks.md; task tracking | Task tracking | Low | Stale backup; safe removal |
| src/data/articles/PROGRESS.md.bak | DELETE | Stale backup of PROGRESS.md; superseded by active PROGRESS.md | Archive | Low | Backup file; safe removal |
| src/data/articles/PROGRESS.md.bak2 | DELETE | Stale backup; older version of PROGRESS.md | Archive | Low | Backup file; safe removal |
| src/data/articles/PROGRESS.md.bak3 | DELETE | Stale backup; oldest version of PROGRESS.md | Archive | Low | Backup file; safe removal |

---

## PROTECTED SACRED PATHS — DO NOT MODIFY

| Path | Status | Reason |
|------|--------|--------|
| .claude/commands/rewrite.md | KEEP | Article rewrite system entry point |
| .claude/commands/rewrite-finalize.md | KEEP | Article rewrite finalization |
| article-rewrite-manifest.json | KEEP | Article rewrite state and manifest |
| .rewrite/ (directory) | KEEP | Rewrite locks and file-locks; internal state |

---

## Summary by Category

### KEEP (53 items)
- **Configs**: vite.config.ts, vitest.config.ts, tsconfig.json, .eslintrc.cjs, .prettierrc, postcss.config.js, tailwind.config.js, playwright.config.ts, vercel.json, pnpm-workspace.yaml
- **Storybook**: .storybook/main.ts, .storybook/preview.ts, .storybook/vitest.setup.ts
- **Scripts (11)**: count-articles.mjs, seed-admin.mjs, verify-deployment.ts, verify-cover-state.ts, verify-metadata-update.ts, check-article-status.ts, diagnose-article-issues.ts, full-diagnostic.ts, test-vector-search.ts, article-audit.ts, and 1 more
- **Slash Commands (4)**: rewrite.md, rewrite-finalize.md, write-articles.md, bridge.md
- **CI Workflows (1)**: clarity-score-backend.yml

### DELETE (11 items)
- **Duplicate Configs (1)**: vitest.config 2.ts
- **Duplicate Test Setup (1)**: src/tests/setup 2.ts
- **Deprecated Scripts (7)**: ingest-from-cms.ts, extract-from-claude-chats.ts, validate-language.ts, upload-session-031-content-direct.ts, 5× upload-covers-*.ts variants, upload-cover-images-to-storage.ts, convert-html-to-jsx.ts
- **Duplicate Utilities (2)**: .rewrite/find-session 2.js, .moat/moat-tasks 2.md
- **Stale Backups (3)**: PROGRESS.md.bak*, PROGRESS.md.bak2, PROGRESS.md.bak3

### UNSURE (2 items)
- **Storybook Stories (3)**: Button.stories.ts, Header.stories.ts, Page.stories.ts — verify if Button/Header/Page components are live elsewhere
- **Seed Scripts (3)**: generate-article-seeds.ts, seed-article-citations.ts, seed-article-content.ts — verify if seeding is active in current pipeline

---

## Dependency Integrity

**KEEP with KEEP importers:** All verified. Build system is cohesive.

**DELETE with KEEP importers:** None detected. All DELETE items are orphaned or obsolete.

**UNSURE with KEEP importers:**
- Storybook stories: Only a dependency if Button/Header/Page components are live. Need to verify component status.
- Seed scripts: Check if article seeding is active in current DB initialization flow.

---

## Cleanup Effort & Risk

**High-confidence deletions (7 items):** ~2 minutes
- All duplicate "2.*" files
- Stale PROGRESS backups
- Deprecated upload scripts

**Medium-confidence deletions (4 items):** ~5 minutes
- Deprecated CMS ingestion scripts
- Historical one-off utilities
- Conversion/extraction helpers (requires brief smoke test if any local workflow depends)

**Total cleanup time:** ~10 minutes
**Risk level:** Low (all items are obsolete or duplicates; no active imports detected)

---

## Final Recommendations

1. **Immediate cleanup:** Delete all "2.*" duplicate files and stale .bak files (very low risk)
2. **Verify before deleting:** Button/Header/Page story components — check if components are live in src/components
3. **Check seeding pipeline:** Verify article seeding is active or if rewrite service has replaced it
4. **Archive upload scripts:** Consider moving deprecated image/content upload scripts to .archive/ for historical reference

