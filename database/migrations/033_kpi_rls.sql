-- 024_kpi_rls.sql
-- Row Level Security policies for KPI tables and materialized views.
-- Assumes permission helper function has_permission(auth.uid(), '<perm>') exists.

-- Ensure RLS is enabled on the snapshots table (if it exists)
ALTER TABLE IF EXISTS public.kpi_snapshots ENABLE ROW LEVEL SECURITY;

-- SELECT policy for KPI snapshots (read‑only view)
CREATE POLICY select_kpi_snapshots ON public.kpi_snapshots
    FOR SELECT USING (has_permission(auth.uid(), 'view_kpi'));

-- Daily materialized view
ALTER MATERIALIZED VIEW public.kpi_daily_mv ENABLE ROW LEVEL SECURITY;
CREATE POLICY select_kpi_daily_mv ON public.kpi_daily_mv
    FOR SELECT USING (has_permission(auth.uid(), 'view_kpi'));

-- Weekly materialized view
ALTER MATERIALIZED VIEW public.kpi_weekly_mv ENABLE ROW LEVEL SECURITY;
CREATE POLICY select_kpi_weekly_mv ON public.kpi_weekly_mv
    FOR SELECT USING (has_permission(auth.uid(), 'view_kpi'));

-- Monthly materialized view
ALTER MATERIALIZED VIEW public.kpi_monthly_mv ENABLE ROW LEVEL SECURITY;
CREATE POLICY select_kpi_monthly_mv ON public.kpi_monthly_mv
    FOR SELECT USING (has_permission(auth.uid(), 'view_kpi'));

-- Optional INSERT/UPDATE/DELETE policies for snapshots if writable (admin only)
CREATE POLICY manage_kpi_snapshots ON public.kpi_snapshots
    FOR INSERT, UPDATE, DELETE USING (has_permission(auth.uid(), 'manage_kpi_config'));

-- Note: Materialized views are typically refreshed by backend jobs; they are not directly writable.

-- Grant usage to the public role (or anon/authenticated) – no extra grants needed for SELECT as RLS handles it.
