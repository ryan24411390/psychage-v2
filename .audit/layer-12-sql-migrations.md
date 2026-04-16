# Layer L12 — SQL Migrations (`supabase/migrations/`)

**Methodology:** Grouped 224 `.sql` files + 2 `.sql.skip` files by feature area from filename keywords. **Narrow vocabulary per prompt Section 8:**

- **KEEP** — represents current schema, RLS policies, seed data still in use
- **ARCHIVE-NOTE-ONLY** — represents a feature that was later reverted; we add a comment header but do not move the file (migrations are historical)
- **DELETE** — only valid for migrations that never ran in production
- **UNSURE** — default for migrations whose feature can't be traced

**Key principle:** migrations that have run in production cannot be deleted. The ledger is append-only.

Data sources: `.audit/raw/migrations.txt`, `.audit/raw/migrations-articles.txt`.

## Distribution by feature area

| Area | Count | Dominant pattern |
|---|---:|---|
| articles/content | 166 | Mostly seeds (~140) + 26 schema iterations (quality framework, versioning, RLS) |
| provider | 12 | provider_directory_v2 + NPI + search RPC iterations |
| auth_admin | 8 | profiles, admin_roles, audit log, RLS |
| navigator | 8 | Navigator tables + seeds + expansion (Phase 4) + RLS |
| ai/mindmate | 5 | pgvector, ai_tables, mindmate_pgvector, streaming_columns |
| tools | 4 | mood, sleep, clarity, medication |
| infrastructure | 4 | Idempotency key, triggers, RPC optimization |
| onboarding | 2 | — |
| safety | 1 | crisis_resources |
| miscellaneous | 15 | bookings/messages, contact_submissions, stripe_tables, verifications, signup_fields, content_feedback, category alignments |

Total: 224 active `.sql` + 2 `.sql.skip` = 226.

## DELETE — never ran in production (narrow criterion)

| path | classification | evidence | risk | notes |
|---|---|---|---|---|
| `20250109000003_full_schema.sql.skip` | DELETE | File extension `.sql.skip` — Supabase migration runner ignores it. Content is the original monolithic schema, superseded by granular migrations `20250109000000/1/2`. | LOW | Safe to delete; never applied to production |
| `20260326220201_update_category01_articles_session001.sql.skip` | DELETE | `.sql.skip` — never applied. Contains placeholder UPDATE statements that were meant to be paired with a TypeScript content-insertion script. The rewrite system now manages Cat 1 content directly from TSX files. | LOW | Safe to delete; content flow no longer uses this migration path |

## ARCHIVE-NOTE-ONLY — superseded but preserved as historical record

| group | path(s) | evidence | action |
|---|---|---|---|
| Article RLS iterations | `20260316000003_fix_article_admin_rls.sql`, `20260316000005_simplify_article_rls.sql`, `20260316000006_jwt_only_article_rls.sql`, `20260316000007_auth_user_article_rls.sql`, `20260316000008_disable_article_rls.sql`, `20260316000009_disable_remaining_article_rls.sql` | Six iterative RLS fixes culminating in `_disable_remaining_article_rls` — the final state is "disabled". Earlier fixes were superseded by later ones. | Add `-- SUPERSEDED: final state is in 20260316000009` comment header to the first 5. Do NOT delete — they shipped. |
| Navigator expansion schema iterations (if any) | None found via naming | — | N/A |
| Provider search RPC iterations | `20260316000019` through `20260316000023` (perf indexes, RPC v3, ANALYZE, unfiltered fix, fast_unfiltered_search_path) | Per CLAUDE.md memory: these are the current active search_providers_v2 RPC path. | KEEP all — they compose the current schema |

## KEEP — current schema, seeds, and RLS

| group | count | notes |
|---|---:|---|
| Core schema (profiles, tools_and_newsletter, remaining_tables) | 3 | `20250109000000/1/2` — foundation |
| Navigator tables, seeds, RLS, expansion | 8 | Sacred (Navigator engine); all active |
| Navigator Phase 4 expansion | 2 (`20260303000001/2`) | Sacred — 14 new conditions |
| AI/MindMate tables, pgvector, streaming | 5 | Sacred (MindMate) |
| Crisis resources | 1 | Sacred |
| Article quality framework (PEAF) | 1 (`20260315000003`) | Sacred (PEAF schema) |
| Article production system | 1 (`20260316000001`) | Article metadata pipeline |
| Article seeds (categories 01–31) | ~140 | All part of current seeded dataset |
| Provider directory v2 schema + seed | ~4 | Core provider directory |
| Provider NPI bulk seed artifacts | ~8 | 423K providers seeded, state-by-state |
| Tools tables (mood, sleep, clarity, medication) | 4 | Sacred tools |
| Auth + admin_roles + audit log RLS | 8 | Core security (sacred) |
| Infrastructure (idempotency, triggers, perf) | 4 | Core infra |
| Content feedback, onboarding, misc tables | 8 | Active features |

## UNSURE

| path | evidence | notes |
|---|---|---|
| `20260411000004_stripe_tables.sql` | Stripe integration tables, but there's no Stripe client code in `src/`. Might be planned-not-yet-shipped. | Keep per "append-only migrations" rule; flag for future review |
| `20260411000006_alter_verifications.sql` | Alters a `verifications` table — unclear if this is NPI verification or another feature | Trace usage to determine sacred status |

## Summary — L12

- **226 migration files total** (224 `.sql` + 2 `.sql.skip`)
- **DELETE: 2** (both `.sql.skip` — never ran)
- **ARCHIVE-NOTE-ONLY: 5** — Article RLS iterations (add SUPERSEDED comment headers; do not move/delete)
- **KEEP: 217** (core schema, seeds, RLS, current features)
- **UNSURE: 2** — Stripe tables + verifications alter (trace to determine)

Migration history is append-only and largely clean. The only true wins are the 2 `.sql.skip` files. Most "iteration" patterns (RLS fixes) require comment-header annotation rather than deletion.

No sacred items flagged for ARCHIVE/DELETE.
