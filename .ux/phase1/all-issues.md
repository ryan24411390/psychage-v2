# Psychage V2 UX Audit — Master Issue List

## Discovery Date: 2026-04-18
## Baseline: build green, 120/135 test files passing, 1400/1478 tests passing

| id | flow | severity | component | issue_type | description | proposed_fix |
|----|------|----------|-----------|------------|-------------|--------------|
| UX-001 | navigator | major | ResultCard.tsx | dead-end | Result cards don't link to condition-specific articles despite `guide_path`/`coping_path` existing on data | Add "Learn More" and "Coping Strategies" link buttons using existing guide_path/coping_path |
| UX-002 | navigator | major | ResultsScreen.tsx | missing-cta | "Start Over" button only at bottom — users must scroll to find it | Add secondary "Start New Assessment" button in page header |
| UX-003 | articles | major | ArticlePage.tsx | dead-end | No "Find a Provider" CTA after reading an article | Add FindSupportCTA component (already exists) with category-to-specialty mapping |
| UX-004 | articles | minor | ArticlePage.tsx | missing-cta | No "Read Next" sequential CTA after related articles | Add prominent "Continue Reading" card linking to first related article |
| UX-005 | providers | major | ProviderProfilePage.tsx | broken-cross-link | Provider profiles don't link to educational articles about specialties | Add "Learn About [Specialty]" section with specialty-to-category mapping |
| UX-006 | tools | major | AssessmentPage.tsx | missing-error-state | Clarity Score question fetch failure is silent (console.error only) | Add visible error UI with retry button |
| UX-007 | tools | minor | SyncBanner.tsx | missing-error-state | Sleep Architect sync error shows message but no retry action | Add onRetry prop and "Try again" button |
| UX-008 | tools | minor | MoodJournal.tsx | missing-loading-state | Generic Loader2 spinner instead of content-shaped skeleton | Replace with skeleton cards matching entry layout |
| UX-009 | auth | major | RoleGuard.tsx | auth-gate-failure | Silent redirect when user role doesn't match — no explanation | Add toast notification before redirect |
| UX-010 | auth | major | LoginPage.tsx | form-validation | "Email not confirmed" error has no "Resend" action | Add "Resend confirmation email" button with Supabase resend API |
| UX-011 | auth | minor | SignUpPage.tsx | missing-cta | Post-signup message unclear about email confirmation step | Update copy to mention checking email for confirmation link |
| UX-012 | tools | minor | JournalHistory.tsx | missing-empty-state | "No entries yet" is plain text with no action CTA | Replace with EmptyState component with "Create Your First Entry" button |
| UX-013 | mindmate | major | MindMate.tsx | missing-empty-state | First-time users see welcome message but no suggested prompts | Add 4 starter prompt pill buttons below welcome message |
| UX-014 | tools | minor | ResultsDashboard.tsx | broken-cross-link | Relationship Health results have no link to relationship articles | Add "Learn about healthy relationships" link after ToolRecommendation |
| UX-015 | navigator | major | ResultsScreen.tsx | dead-end | "Browse Library" next step links to generic /learn, not condition-specific articles | Make ns3 link to strongMatches[0].guide_path when available |
| UX-016 | navigation | minor | Tool pages | missing-cta | Some tool pages lack breadcrumb navigation | Add Breadcrumbs component to tools missing it |

## Summary
- **Total issues**: 16
- **Critical**: 0
- **Major**: 8 (UX-001, 002, 003, 005, 006, 009, 010, 013, 015)
- **Minor**: 8 (UX-004, 007, 008, 011, 012, 014, 016)
- **Info**: 0

**Under 40 threshold — proceeding with fixes.**
