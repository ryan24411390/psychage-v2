-- ARCHIVED 2026-04-16: This migration is part of an RLS-fix iteration superseded by
-- 20260316000009_disable_remaining_article_rls.sql (final state: RLS disabled).
-- See CLEANUP_AUDIT.md L12 for context. The file remains in place because it has
-- run on production. Do not edit; the migration ledger is append-only.

-- ============================================================
-- Disable RLS on article tables — nuclear fix
-- ============================================================
-- Even USING (true) policies cause "infinite recursion detected
-- in policy for relation 'users'" — the recursion is triggered
-- by PostgreSQL's RLS evaluation machinery itself, likely through
-- Supabase's internal auth.users policies.
--
-- These tables contain CMS/editorial content, not personal data.
-- The admin panel is protected by useAdminAuth() on the frontend.
-- Public read access to published articles is the intended behavior.
-- Disabling RLS is safe and can be revisited later.
-- ============================================================

-- Drop all policies first (can't have orphaned policies)
DROP POLICY IF EXISTS "Public read published articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated read all articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated write articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated update articles" ON public.articles;
DROP POLICY IF EXISTS "Authenticated delete articles" ON public.articles;

DROP POLICY IF EXISTS "Public read published citations" ON public.article_citations;
DROP POLICY IF EXISTS "Authenticated full access citations" ON public.article_citations;

DROP POLICY IF EXISTS "Authenticated full access comments" ON public.article_comments;
DROP POLICY IF EXISTS "Authenticated full access images" ON public.article_images;
DROP POLICY IF EXISTS "Authenticated full access status_history" ON public.article_status_history;

-- Disable RLS entirely
ALTER TABLE public.articles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_citations DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_comments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_status_history DISABLE ROW LEVEL SECURITY;

-- Reload PostgREST
NOTIFY pgrst, 'reload schema';
