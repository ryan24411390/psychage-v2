# Layer L02 — Environment Variables

**Methodology:** Extracted env var names from `.env.example` (30 declared) and cross-referenced against `import.meta.env.*` / `process.env.*` usage in `src/`, `api/`, `scripts/`. Followed string-key lookups through `src/lib/navigator/featureFlags.ts` and `src/config/navigation.ts` → `src/hooks/useNavPermissions.ts`.

Data sources: `.audit/raw/env-vars-used.txt`, `.audit/raw/env-vars-declared.txt`, `.env.example`.

## DELETE — declared but never read at runtime

| path | classification | evidence | dependencies | risk | bundle_impact | notes |
|---|---|---|---|---|---|---|
| `VITE_APP_NAME` | DELETE | Only mentioned in `src/vite-env.d.ts` type declaration. Zero runtime `import.meta.env.VITE_APP_NAME` reads. | — | LOW | — | Remove from `.env.example` + `vite-env.d.ts` |
| `VITE_APP_VERSION` | DELETE | Only in `.env.example`. Zero refs in src (not even declared in vite-env.d.ts). | — | LOW | — | Remove from `.env.example` only |
| `VITE_DEBUG_MODE` | DELETE | Declared in `vite-env.d.ts` + `.env.example`. Zero runtime reads. | — | LOW | — | Remove from both |
| `VITE_CRISIS_DETECTION_ENABLED` | DELETE | Zero refs anywhere in src/api. Flag never gated on. | — | LOW | — | Crisis detection is ALWAYS on (correct — sacred invariant). Flag is misleading — remove. |
| `VITE_MOOD_TRACKING_ENABLED` | DELETE | Zero refs anywhere. `VITE_ENABLE_MOOD_JOURNAL` is the real flag. | — | LOW | — | Duplicate/typo of `VITE_ENABLE_MOOD_JOURNAL`; remove |
| `VITE_SAFETY_PLAN_ENABLED` | DELETE | Zero refs anywhere. | — | LOW | — | Safety plan feature not gated by this flag |

## UNSURE — scope-dependent

| path | classification | evidence | dependencies | risk | bundle_impact | notes |
|---|---|---|---|---|---|---|
| `VITE_SANITY_PROJECT_ID` | UNSURE | Read in `src/lib/sanityClient.ts` — imported by `src/services/adminService.ts` (KEEP). Code path gated by `isSanityConfigured()`. | `sanityClient.ts` → `adminService.ts` | MED | — | Goes with L01 Sanity decision |
| `VITE_SANITY_DATASET` | UNSURE | Same as above | `sanityClient.ts` | MED | — | Goes with L01 Sanity decision |
| `VITE_SANITY_API_VERSION` | UNSURE | Same as above | `sanityClient.ts` | MED | — | Goes with L01 Sanity decision |

## KEEP — verified in use

| path | classification | evidence |
|---|---|---|
| `VITE_API_URL` | KEEP | `src/lib/api.ts:12` |
| `VITE_SUPABASE_URL` | KEEP | `src/lib/supabaseClient.ts:4`, `articleService.ts:29`, `provider-analytics.ts:123` |
| `VITE_SUPABASE_ANON_KEY` | KEEP | `src/lib/supabaseClient.ts:5` |
| `VITE_MAIN_URL` | KEEP | `src/lib/urls.ts:9` |
| `VITE_ADMIN_URL` | KEEP | `src/lib/urls.ts:10` |
| `VITE_ENABLE_AI_CHAT` | KEEP | `src/config/navigation.ts` via `requiredFeatureFlag` string key → `useNavPermissions.ts:60` |
| `VITE_ENABLE_PROVIDER_DIRECTORY` | KEEP | Same pattern |
| `VITE_ENABLE_MOOD_JOURNAL` | KEEP | Same pattern |
| `VITE_ENABLE_SLEEP_TRACKER` | KEEP | Same pattern |
| `VITE_ENABLE_CLARITY_SCORE` | KEEP | Same pattern |
| `VITE_ENABLE_MEDICATION_TRACKER` | KEEP | `src/config/navigation.ts:239` (NOT declared in `vite-env.d.ts` — fix type file) |
| `VITE_NAV_TIER1_ENABLED` through `VITE_NAV_TIER6_ENABLED` | KEEP × 6 | All resolved via string-keyed lookup in `src/lib/navigator/featureFlags.ts:59-64` |
| `VITE_NAVIGATOR_AGE_GATE` | KEEP | `src/lib/navigator/config.ts:20` |
| `VITE_NAVIGATOR_AGE_GATE_MIN_AGE` | KEEP | `src/lib/navigator/config.ts:21` |
| `VITE_NAVIGATOR_ANALYTICS` | KEEP | `src/lib/navigator/config.ts:23` (undeclared in .env.example — add) |
| `VITE_NAVIGATOR_PREFETCH` | KEEP | `src/lib/navigator/config.ts:24` (undeclared in .env.example — add) |
| `VITE_PLAUSIBLE_DOMAIN` | KEEP | `src/lib/analytics/plausible.ts:16` (undeclared in .env.example — add) |
| `ANTHROPIC_API_KEY` | KEEP | server-side `api/ai/health.ts`, `src/app/api/ai/chat/route.ts` |
| `OPENAI_API_KEY` | KEEP | `api/ai/embed.ts`, `api/ai/health.ts` |
| `SUPABASE_SERVICE_ROLE_KEY` | KEEP | `api/lib/supabase.ts`, `api/ai/embed.ts` |
| `LLM_PROVIDER` | KEEP | Resolved via `config.llmProvider` in `src/app/api/ai/chat/route.ts` |
| `import.meta.env.DEV` | KEEP | Used in 7 files (Vite built-in) |

## Undeclared but used (add to `.env.example`)

| var | usage | action |
|---|---|---|
| `VITE_NAVIGATOR_ANALYTICS` | `src/lib/navigator/config.ts:23` | Document in `.env.example` |
| `VITE_NAVIGATOR_PREFETCH` | `src/lib/navigator/config.ts:24` | Document in `.env.example` |
| `VITE_PLAUSIBLE_DOMAIN` | `src/lib/analytics/plausible.ts:16` | Document in `.env.example` |
| `VITE_ENABLE_MEDICATION_TRACKER` type | `src/config/navigation.ts:239` | Add field to `src/vite-env.d.ts` |

## Summary — L02

- **30 declared env vars**, **22 actually used** (plus 3 undeclared but used, plus Vite built-ins)
- **DELETE 6**: VITE_APP_NAME, VITE_APP_VERSION, VITE_DEBUG_MODE, VITE_CRISIS_DETECTION_ENABLED, VITE_MOOD_TRACKING_ENABLED, VITE_SAFETY_PLAN_ENABLED (no runtime readers)
- **UNSURE 3**: VITE_SANITY_* trio (goes with L01 scope decision)
- **KEEP 21** + 3 undeclared-used (document these)

All 6 Navigator tier flags verified as actively consumed via string-key lookup — do NOT flag them as dead even though `rg VITE_NAV_TIER4_ENABLED src` returns fewer hits than expected.
