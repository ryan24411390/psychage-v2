# Layer L08 — Services (33 files in `src/services/`)

**Methodology:** For each service, counted importers via `rg -l "from '@/services/<name>'" src api scripts`. Cross-checked against `.audit/raw/ts-prune-dead.txt` and `.audit/raw/orphans.txt`. Strict dep-integrity rule applied.

## DELETE — zero importers, no KEEP callers

| path | classification | evidence | dependencies | risk | notes |
|---|---|---|---|---|---|
| `src/services/sanityArticleService.ts` | DELETE | 0 importers in src/. Content cascade bypasses it (Supabase → TSX). Sanity CMS dormant per repo context. | Imports dead `@portabletext/types`, `sanityClient` | LOW | Scaffolding for future Sanity integration, never wired. Partners with L01 DELETE of `@portabletext/react`, `@portabletext/types`. |
| `src/services/activityService.ts` | DELETE | 0 importers. ts-prune marks `useActivityService` export as dead. `user_activity` table never queried from UI. | `@supabase/supabase-js` | LOW | Core activity tracking not wired. |
| `src/services/categoryIconMapper.tsx` | DELETE | 0 importers. ts-prune marks `iconMap`, `defaultIcon` dead. Marked `@deprecated` in file header. Superseded by `getCategoryTheme()` from `src/config/categoryThemes.ts`. | `lucide-react` | LOW | Duplicate icon registry, explicitly deprecated |
| `src/services/waitlistService.ts` | DELETE | 0 importers. ts-prune marks default export dead. No consumers for waitlist table. | `@supabase/supabase-js` | LOW | Waitlist table exists but never inserted/read |

## KEEP — core content / admin / sacred

| path | classification | evidence | risk | notes |
|---|---|---|---|---|
| `src/services/articleService.ts` | KEEP | 6 importers (ArticlePage, CategoryPage, useTopicHubData, RecommendedArticles, ArticleRedirect, useHomepageArticles). Content cascade Supabase → mock. | CRITICAL | Single source of truth for article data |
| `src/services/articleAdminService.ts` | KEEP | 12 importers across admin v2 pages | HIGH | Has ~8 dead exports per ts-prune (assignReviewer, getArticleCitations, saveArticleCitation, deleteArticleCitation, updateArticleQualityScore, updateArticleDerivative, deleteArticleDerivative, generateArticleProductionId, diagnoseConnection) — **cleanup opportunity** but service itself is used |
| `src/services/adminService.ts` | KEEP | 6 importers (AdminDashboard, AdminAnalyticsPage, AdminContentPage, AuditLogPage, UserManagementPage, AdminUserDetailPage) | HIGH | Imports `sanityClient` — gated by `isSanityConfigured()`. Cleanup opportunity: rip out Sanity blocks when L01 Sanity DELETE is approved |
| `src/services/consentService.ts` | KEEP | 5 importers (MindMate, CookieConsent, PrivacySettings, ClosingSection, SignUpPage) | HIGH | Sacred (MindMate dependency). GDPR consent audit trail |
| `src/services/chatPersistenceService.ts` | KEEP | 1 importer (MindMate.tsx) | CRITICAL | Sacred — persists AI conversation history |
| `src/services/moodService.ts` | KEEP | 5 importers across mood journal pages | MEDIUM | Mood tracking core tool |
| `src/services/sleepService.ts` | KEEP | 3 importers | MEDIUM | Sleep Architect tool dependency (sacred) |
| `src/services/providerService.ts` | KEEP | 2 importers | MEDIUM | Provider search/management core. ts-prune marks `useProviderService` dead — cleanup opportunity |
| `src/services/onboardingService.ts` | KEEP | 2 importers | MEDIUM | Onboarding flow |
| `src/services/sleepDiaryService.ts` | KEEP | 2 importers | MEDIUM | Part of Sleep Architect |
| `src/services/privacyService.ts` | KEEP | 2 importers | MEDIUM | Privacy/data handling |
| `src/services/provider-analytics.ts` | KEEP | 2 importers | MEDIUM | Analytics instrumentation |
| `src/services/provider-portal.ts` | KEEP | 2 importers | MEDIUM | Provider portal backend |
| `src/services/categoryService.ts` | KEEP | 2 importers | MEDIUM | Category management |
| `src/services/toolService.ts` | KEEP | 2 importers | MEDIUM | Tool orchestration |
| `src/services/alertService.ts` | KEEP | 1 importer (WellnessAlertBanner) | MEDIUM | Wellness alert system |
| `src/services/articleRewriteService.ts` | KEEP | 1 importer (ArticleDetail admin) | LOW | Admin article rewriting |
| `src/services/assessmentService.ts` | KEEP | 1 importer | MEDIUM | `useAssessmentService` export dead — cleanup opportunity |
| `src/services/bookmarkService.ts` | KEEP | 1 importer | LOW | Bookmark feature (sacred — BookmarkContext depends on it) |
| `src/services/contactService.ts` | KEEP | 1 importer (ContactPage) | LOW | Contact form |
| `src/services/clarityScoreService.ts` | KEEP | 1 importer (ClarityScoreTool — sacred) | MEDIUM | Sacred tool |
| `src/services/feedbackService.ts` | KEEP | 1 importer (FeedbackWidget) | LOW | Feedback collection |
| `src/services/newsletterService.ts` | KEEP | 1 importer (ClosingSection) | LOW | Newsletter signup |
| `src/services/searchService.ts` | KEEP | 1 importer (SearchResults) | LOW | Search |
| `src/services/symptomService.ts` | KEEP | 1 importer | MEDIUM | Symptom checker |
| `src/services/userProfileService.ts` | KEEP | 1 importer | MEDIUM | User profile |
| `src/services/videoService.ts` | KEEP | 1 importer | LOW | Video content |
| `src/services/bookingService.ts` | KEEP | 1 importer | MEDIUM | Provider booking |
| `src/services/messagingService.ts` | KEEP | 1 importer | MEDIUM | Provider messaging |

## Summary — L08

- **33 services total**
- **DELETE: 4** — `sanityArticleService.ts`, `activityService.ts`, `categoryIconMapper.tsx`, `waitlistService.ts`
- **KEEP: 29**
- **ARCHIVE / UNSURE: 0**

Cleanup opportunities (KEEP with dead exports — not full-file DELETE):
- `articleAdminService.ts` — 8 dead method exports
- `assessmentService.ts`, `providerService.ts` — dead hook exports
- `adminService.ts` — Sanity code blocks to rip out (if L01 Sanity DELETE approved)

Sacred preservation: `chatPersistenceService`, `consentService`, `articleService`, all tool services — all KEEP verified.
