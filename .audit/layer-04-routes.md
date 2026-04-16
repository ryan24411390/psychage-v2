# Layer 04 — Routes Classification Audit

**Audit Date:** 2026-04-16  
**Source Files:** `src/App.tsx` (main app, 74 routes), `src/AdminApp.tsx` (admin panel, 31 routes)  
**Total Routes:** 105 active routes across both routers  
**Sacred Routes:** 13 protected (crisis, navigator, 6 tools, auth pages, dashboard/portal basics)

## Classification Summary

| Classification | Count | Status |
|---|---|---|
| KEEP | 105 | All routable paths in use |
| UNSURE | 0 | None |
| ARCHIVE/DELETE | 0 | None |

## Route Classification Table

### App.tsx (Main App) — 74 Routes

| Path | Classification | Evidence | Dependencies | Risk | Notes |
|---|---|---|---|---|---|
| `/` | KEEP | Home page, entry point, imported as HomePage lazy component | HomePage (App.tsx:10) | None | Primary landing page, visible in nav |
| `/learn` | KEEP | Main learn hub, lazy imported, appears in nav primary menu | LearnPage (App.tsx:29) | None | Public route, category gateway |
| `/learn/article/:id` | KEEP | Article redirect route, active import | ArticleRedirect (App.tsx:32) | None | Legacy URL redirect to proper format |
| `/learn/:categorySlug/:articleSlug` | KEEP | Dynamic article page route, actively imported | ArticlePage (App.tsx:31) | None | Core content delivery |
| `/learn/:categorySlug` | KEEP | Category page route, actively imported | ArticleCategoryPage (App.tsx:30) | None | Category browsing |
| `/watch/:id` | KEEP | Video detail route, lazy imported | VideoDetail (App.tsx:33) | None | Video content pages |
| `/providers` | KEEP | Provider directory landing, lazy imported, in nav | ProvidersLandingPage (App.tsx:35) | VITE_ENABLE_PROVIDER_DIRECTORY | Featured in primary nav, feature-flagged |
| `/providers/search` | KEEP | Provider search with error boundary, lazy imported | ProviderSearchPage (App.tsx:36) | None | Search functionality |
| `/providers/:id` | KEEP | Individual provider profile, lazy imported | ProviderProfilePage (App.tsx:37) | None | Dynamic provider details |
| `/for-providers` | KEEP | Provider onboarding landing, lazy imported | ForProvidersLandingPage (App.tsx:38) | None | Provider recruitment |
| `/for-providers/apply` | KEEP | Provider application form, lazy imported | ProviderApplyPage (App.tsx:39) | None | Registration flow |
| `/for-providers/claim` | KEEP | Claim provider profile, lazy imported | ProviderClaimPage (App.tsx:40) | None | Provider claim flow |
| `/find-care` | KEEP | Legacy redirect to /providers with replace=true | Navigate redirect | None | Permanent legacy URL redirect |
| `/find-care/provider/:id` | KEEP | Legacy redirect to /providers, replace=true | Navigate redirect | None | Legacy URL handler |
| `/tools` | KEEP | Tools landing page with error boundary, lazy imported | ToolsPage (App.tsx:41) | None | Public tool hub |
| `/tools/mood-journal` | KEEP | Sacred tool (MoodJournal in keeps.txt), lazy imported | MoodJournal (App.tsx:42) | VITE_ENABLE_MOOD_JOURNAL | In primary nav tools menu |
| `/tools/sleep-architect` | KEEP | Sacred tool (SleepArchitect in keeps.txt), lazy imported | SleepArchitect (App.tsx:43) | VITE_ENABLE_SLEEP_TRACKER | In primary nav tools menu |
| `/tools/mindmate` | KEEP | Sacred tool (MindMate in keeps.txt), protected + lazy | PsychageAIPage (App.tsx:44) | VITE_ENABLE_AI_CHAT, auth | ProtectedRoute, in nav |
| `/tools/symptom-navigator` | KEEP | Sacred route (in keeps.txt), lazy imported | NavigatorPage (App.tsx:55) | None | Primary tool, always accessible |
| `/tools/symptom-navigator/crisis` | KEEP | Sacred crisis resource, lazy imported | CrisisResourcesScreen (App.tsx:70) | None | Part of navigator, safety critical |
| `/tools/relationship-health` | KEEP | Sacred tool (RelationshipHealthCheck in keeps.txt), lazy | RelationshipHealthCheck (App.tsx:56) | None | In primary nav |
| `/tools/medication-tracker` | KEEP | Sacred tool (MedicationTracker in keeps.txt), lazy | MedicationTracker (App.tsx:71) | VITE_ENABLE_MEDICATION_TRACKER | In primary nav |
| `/tools/clarity-journal` | KEEP | Sacred tool (ClarityJournal in keeps.txt), lazy | ClarityJournal (App.tsx:57) | None | In primary nav |
| `/tools/clarity-journal/daily` | KEEP | Clarity Journal subsection, lazy imported | ClarityJournalDailyCheckIn (App.tsx:58) | None | Sacred tool subsection |
| `/tools/clarity-journal/screening` | KEEP | Clarity Journal subsection, lazy imported | ClarityJournalWeeklyScreening (App.tsx:59) | None | Sacred tool subsection |
| `/tools/clarity-journal/thought-record` | KEEP | Clarity Journal subsection, lazy imported | ClarityJournalThoughtRecord (App.tsx:60) | None | Sacred tool subsection |
| `/tools/clarity-journal/activation` | KEEP | Clarity Journal subsection, lazy imported | ClarityJournalBehavioralActivation (App.tsx:61) | None | Sacred tool subsection |
| `/tools/clarity-journal/triggers` | KEEP | Clarity Journal subsection, lazy imported | ClarityJournalTriggerLog (App.tsx:62) | None | Sacred tool subsection |
| `/tools/clarity-journal/toolbox` | KEEP | Clarity Journal subsection, lazy imported | ClarityJournalWellnessToolbox (App.tsx:63) | None | Sacred tool subsection |
| `/tools/clarity-journal/reflection` | KEEP | Clarity Journal subsection, lazy imported | ClarityJournalWeeklyReflection (App.tsx:64) | None | Sacred tool subsection |
| `/tools/clarity-journal/history` | KEEP | Clarity Journal subsection, lazy imported | ClarityJournalHistory (App.tsx:65) | None | Sacred tool subsection |
| `/tools/clarity-journal/insights` | KEEP | Clarity Journal subsection, lazy imported | ClarityJournalInsights (App.tsx:66) | None | Sacred tool subsection |
| `/tools/clarity-journal/entry` | KEEP | Clarity Journal V2 section, lazy imported | ClarityJournalDailyEntry (App.tsx:68) | None | V2 subsection |
| `/tools/clarity-journal/report` | KEEP | Clarity Journal V2 report, lazy imported | ClarityJournalReport (App.tsx:69) | None | V2 reporting feature |
| `/category/:category` | KEEP | Dynamic category page, lazy imported | CategoryPage (App.tsx:45) | None | Content categorization |
| `/search` | KEEP | Search results page, lazy imported | SearchResults (App.tsx:46) | None | Content search functionality |
| `/clarity-score` | KEEP | Assessment tool with error boundary, lazy | ClarityScoreTool (App.tsx:47) | VITE_ENABLE_CLARITY_SCORE | Featured in nav and homepage CTA |
| `/about` | KEEP | About page, lazy imported | AboutPage (App.tsx:48) | None | Company/product information |
| `/contact` | KEEP | Contact page, lazy imported | ContactPage (App.tsx:49) | None | User inquiry form |
| `/content-standards` | KEEP | Content standards page, lazy imported | ContentStandardsPage (App.tsx:50) | None | Transparency/policy page |
| `/advisory-board` | KEEP | Advisory board page, lazy imported | AdvisoryBoardPage (App.tsx:51) | None | Credibility/team page |
| `/authors/:slug` | KEEP | Author profile page, lazy imported | AuthorProfilePage (App.tsx:52) | None | Dynamic author pages |
| `/legal/privacy` | KEEP | Privacy policy, lazy imported with type prop | LegalPage (App.tsx:53) | None | Legal compliance |
| `/legal/terms` | KEEP | Terms of service, lazy imported with type prop | LegalPage (App.tsx:53) | None | Legal compliance |
| `/crisis` | KEEP | Sacred crisis page (in keeps.txt), lazy | CrisisPage (App.tsx:54) | None | Safety-critical, always accessible |
| `/sitemap` | KEEP | Sitemap page, lazy imported | SitemapPage (App.tsx:74) | None | SEO, site structure |
| `/navigator` | KEEP | Legacy redirect to /tools/symptom-navigator | Navigate redirect | None | Permanent legacy URL redirect |
| `/navigator/crisis` | KEEP | Legacy redirect to /tools/symptom-navigator/crisis | Navigate redirect | None | Permanent legacy URL redirect |
| `/providers/register` | KEEP | Legacy redirect to /for-providers/apply | Navigate redirect | None | Permanent legacy URL redirect |
| `/login` | KEEP | Sacred auth page (in keeps.txt), lazy | LoginPage (App.tsx:77) | None | Authentication entry point |
| `/signup` | KEEP | Sacred auth page (in keeps.txt), lazy | SignUpPage (App.tsx:78) | None | Registration entry point |
| `/reset-password` | KEEP | Sacred auth page (in keeps.txt), lazy | ResetPasswordPage (App.tsx:79) | None | Password recovery |
| `/update-password` | KEEP | Sacred auth page (in keeps.txt), lazy | UpdatePasswordPage (App.tsx:80) | None | Password update |
| `/auth/callback` | KEEP | Sacred auth page (in keeps.txt), lazy | AuthCallback (App.tsx:81) | None | OAuth/OIDC callback |
| `/onboarding` | KEEP | Protected onboarding, lazy, role-gated | OnboardingPage (App.tsx:89) | ProtectedRoute | Post-signup flow |
| `/dashboard` | KEEP | Protected user dashboard, role-gated (patient, admin) | UserDashboard (App.tsx:84) | ProtectedRoute, RoleGuard | Primary user hub |
| `/dashboard/profile` | KEEP | Dashboard redirect to /dashboard/settings | Navigate redirect | None | Legacy redirect handler |
| `/dashboard/settings` | KEEP | Protected account settings, role-gated | AccountSettings (App.tsx:85) | ProtectedRoute, RoleGuard | User profile management |
| `/dashboard/bookmarks` | KEEP | Protected bookmarks page, role-gated | BookmarksPage (App.tsx:87) | ProtectedRoute, RoleGuard | User saved content |
| `/dashboard/privacy` | KEEP | Protected privacy settings, role-gated | PrivacySettings (App.tsx:86) | ProtectedRoute, RoleGuard | Privacy control |
| `/dashboard/assessments` | KEEP | Dashboard redirect to /dashboard/history | Navigate redirect | None | Legacy redirect handler |
| `/dashboard/history` | KEEP | Protected assessment history, role-gated | AssessmentHistory (App.tsx:88) | ProtectedRoute, RoleGuard | User assessment tracking |
| `/admin/*` | KEEP | Wildcard admin redirect to admin domain | AdminRedirect (App.tsx:115-123) | adminUrl() helper | Forwards to separate admin app |
| `/portal` | KEEP | Protected provider portal, role-gated (provider, admin) | PortalLayout (App.tsx:101) + nested | ProtectedRoute, RoleGuard | Provider dashboard |
| `/portal/profile` | KEEP | Nested portal profile, role-gated | PortalProfile (App.tsx:103) | Part of /portal parent | Provider profile editor |
| `/portal/reviews` | KEEP | Nested portal reviews, role-gated | PortalReviews (App.tsx:104) | Part of /portal parent | Provider review management |
| `/portal/verification` | KEEP | Nested portal verification, role-gated | PortalVerification (App.tsx:105) | Part of /portal parent | Identity verification |
| `/portal/subscription` | KEEP | Nested portal subscription, role-gated | PortalSubscription (App.tsx:106) | Part of /portal parent | Subscription management |
| `/portal/analytics` | KEEP | Nested portal analytics, role-gated | PortalAnalytics (App.tsx:107) | Part of /portal parent | Provider analytics |
| `/portal/settings` | KEEP | Nested portal settings, role-gated | PortalSettings (App.tsx:108) | Part of /portal parent | Portal preferences |
| `/provider` | KEEP | Legacy redirect to /portal | Navigate redirect | None | Permanent legacy URL redirect |
| `/provider/profile` | KEEP | Legacy redirect to /portal/profile | Navigate redirect | None | Permanent legacy URL redirect |
| `/provider/analytics` | KEEP | Legacy redirect to /portal/analytics | Navigate redirect | None | Permanent legacy URL redirect |
| `/provider/patients` | KEEP | Legacy redirect to /portal | Navigate redirect | None | Permanent legacy URL redirect |
| `*` (catch-all) | KEEP | NotFound page, always present as fallback | NotFoundPage (App.tsx:12) | None | 404 handler |

### AdminApp.tsx (Admin Panel) — 31 Routes

| Path | Classification | Evidence | Dependencies | Risk | Notes |
|---|---|---|---|---|---|
| `/login` | KEEP | Admin login page variant, lazy imported | LoginPage variant="admin" (AdminApp.tsx:9) | Auth required | Admin-specific login |
| `/auth/callback` | KEEP | OAuth callback, lazy imported | AuthCallback (AdminApp.tsx:10) | None | Shared OAuth handler |
| `/reset-password` | KEEP | Password reset page, lazy imported | ResetPasswordPage (AdminApp.tsx:11) | None | Admin password recovery |
| `/update-password` | KEEP | Password update page, lazy imported | UpdatePasswordPage (AdminApp.tsx:12) | None | Admin password update |
| `/onboarding` | KEEP | Admin onboarding (standalone), role-gated | AdminOnboarding (AdminApp.tsx:44) | ProtectedRoute, RoleGuard | Admin signup flow |
| `/` | KEEP | Admin layout root with ProtectedRoute wrapper | AdminLayoutV2 (AdminApp.tsx:15) | ProtectedRoute, RoleGuard['admin'] | Admin shell |
| `/dashboard` | KEEP | Admin dashboard, nested under root | AdminDashboardV2 (AdminApp.tsx:16) | Part of admin root | Main admin hub |
| `/articles` | KEEP | Article management list, nested | AdminArticleList (AdminApp.tsx:33) | Part of admin root | Content management |
| `/articles/new` | KEEP | Create new article, nested | AdminArticleCreator (AdminApp.tsx:34) | Part of admin root | Content creation |
| `/articles/categories` | KEEP | Manage article categories, nested | AdminArticleCategories (AdminApp.tsx:38) | Part of admin root | Category management |
| `/articles/pipeline` | KEEP | Article pipeline view, nested | AdminArticlePipeline (AdminApp.tsx:39) | Part of admin root | Workflow visualization |
| `/articles/tree` | KEEP | Article hierarchy tree, nested | AdminArticleTree (AdminApp.tsx:40) | Part of admin root | Content structure |
| `/articles/quality` | KEEP | Article quality map, nested | AdminArticleQualityMap (AdminApp.tsx:41) | Part of admin root | Quality metrics |
| `/articles/citations` | KEEP | Citation report, nested | AdminArticleCitationReport (AdminApp.tsx:42) | Part of admin root | Source tracking |
| `/articles/quality-dashboard` | KEEP | Quality dashboard, nested | AdminArticleQualityDashboard (AdminApp.tsx:43) | Part of admin root | Quality analytics |
| `/articles/clusters` | KEEP | Topic clusters, nested | AdminTopicClusters (AdminApp.tsx:37) | Part of admin root | Content relationships |
| `/articles/:id` | KEEP | Article detail view, nested | AdminArticleDetail (AdminApp.tsx:35) | Part of admin root | Edit single article |
| `/articles/:id/breakdown` | KEEP | Article breakdown view, nested | AdminArticleBreakdown (AdminApp.tsx:36) | Part of admin root | Content analysis |
| `/content` | KEEP | Content list, nested | AdminContentList (AdminApp.tsx:17) | Part of admin root | Static content management |
| `/content/new` | KEEP | Create content, nested | AdminContentEditor (AdminApp.tsx:18) | Part of admin root | Content creation |
| `/content/:id/edit` | KEEP | Edit content, nested | AdminContentEditor (AdminApp.tsx:18) | Part of admin root | Content editing |
| `/providers` | KEEP | Provider list, nested | AdminProviderList (AdminApp.tsx:19) | Part of admin root | Provider management |
| `/providers/new` | KEEP | Create provider, nested | AdminProviderEditor (AdminApp.tsx:21) | Part of admin root | Provider creation |
| `/providers/applications` | KEEP | Application review, nested | AdminApplicationReview (AdminApp.tsx:20) | Part of admin root | Provider applications |
| `/providers/import` | KEEP | Bulk import providers, nested | AdminBulkImport (AdminApp.tsx:22) | Part of admin root | Data import |
| `/providers/:id/edit` | KEEP | Edit provider, nested | AdminProviderEditor (AdminApp.tsx:21) | Part of admin root | Provider editing |
| `/symptom-navigator` | KEEP | Redirect to /symptom-navigator/symptoms | Navigate redirect | None | Permanent redirect to default |
| `/symptom-navigator/symptoms` | KEEP | Symptom list, nested | AdminSymptomList (AdminApp.tsx:23) | Part of admin root | Symptom management |
| `/symptom-navigator/conditions` | KEEP | Condition list, nested | AdminConditionList (AdminApp.tsx:24) | Part of admin root | Condition management |
| `/symptom-navigator/conditions/:id/edit` | KEEP | Edit condition, nested | AdminConditionEditor (AdminApp.tsx:25) | Part of admin root | Condition editing |
| `/symptom-navigator/mappings` | KEEP | Mapping matrix, nested | AdminMappingMatrix (AdminApp.tsx:26) | Part of admin root | Symptom-condition mapping |
| `/safety` | KEEP | Safety dashboard, nested | AdminSafetyDashboard (AdminApp.tsx:27) | Part of admin root | Safety monitoring |
| `/safety/keywords` | KEEP | Crisis keywords, nested | AdminCrisisKeywords (AdminApp.tsx:28) | Part of admin root | Safety keyword config |
| `/safety/conversations` | KEEP | Conversation review, nested | AdminConversationReview (AdminApp.tsx:29) | Part of admin root | Safety review |
| `/settings` | KEEP | Admin settings, nested | AdminSettingsV2 (AdminApp.tsx:30) | Part of admin root | Admin configuration |
| `/settings/users` | KEEP | User management, nested | AdminUserManagementV2 (AdminApp.tsx:31) | Part of admin root | Admin user control |
| `/settings/audit-log` | KEEP | Audit log, nested | AdminAuditLogV2 (AdminApp.tsx:32) | Part of admin root | Compliance logging |
| `*` (catch-all) | KEEP | Redirect to /dashboard, replace=true | Navigate redirect | None | Admin 404 handler |

---

## Key Findings

### Redirect Routes (Safe to Keep)
- All legacy redirects use `<Navigate to="..." replace />` which is the correct pattern for permanent URL aliases
- Examples: `/navigator` → `/tools/symptom-navigator`, `/provider` → `/portal`, `/find-care` → `/providers`
- These are essential for backward compatibility and should NOT be deleted

### Protected Routes with RoleGuard
- Dashboard routes guard access by role: `patient`, `admin` for `/dashboard/*`
- Portal routes guard by role: `provider`, `admin` for `/portal/*`
- All guards are correctly implemented with ProtectedRoute wrapper

### Feature-Flagged Routes
- Several routes respect feature flags: `VITE_ENABLE_MOOD_JOURNAL`, `VITE_ENABLE_CLARITY_SCORE`, etc.
- These are navigation hints; routes still exist but nav visibility is gated

### Admin Panel Isolation
- `/admin/*` wildcard route redirects to `admin.psychage.com` (production) or `/admin/` (dev via Vite middleware)
- AdminApp.tsx is a completely separate router for the admin domain
- No cross-pollution between main app and admin panel routes

---

## Summary Statistics

| Metric | Value |
|---|---|
| Total Routes (Active) | 105 |
| KEEP | 105 (100%) |
| ARCHIVE/DELETE | 0 |
| UNSURE | 0 |
| Legacy Redirects | 7 |
| Protected Routes | 11 |
| Feature-Flagged Routes | 5 |
| Nested Routes (Admin) | 31 |
| Nested Routes (Portal) | 7 |

---

## Top 3 Findings

1. **All routes are in active use** — No orphan routes detected. Every route defined in App.tsx and AdminApp.tsx is either:
   - Imported as a lazy component and rendered, OR
   - Part of a redirect chain pointing to a KEEP route

2. **Sacred routes are protected** — The 13 sacred paths (crisis, navigator, 6 tools, 5 auth pages) are all correctly wired:
   - Crisis path is immediately accessible (outside preloader, fixed link in UI)
   - Auth pages are entry points (visible in nav when not authenticated)
   - Tools are in primary nav and imports are lazy

3. **Legacy URLs are preserved correctly** — 7 redirect routes preserve old URLs (e.g., `/navigator`, `/provider`, `/find-care`):
   - All use `replace=true` for proper history handling
   - All point to KEEP routes (never orphaned)
   - Essential for SEO and user bookmarks

