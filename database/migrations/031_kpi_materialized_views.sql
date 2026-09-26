-- 023_kpi_materialized_views.sql
-- Materialized views that aggregate KPI values on daily, weekly and monthly granularity.
-- These views call the functions defined in 022_kpi_functions.sql.

-- Daily KPI materialized view
CREATE MATERIALIZED VIEW public.kpi_daily_mv AS
SELECT
    f.organization_id,
    f.farm_id,
    f.site_id,
    f.house_id,
    f.id AS flock_id,
    d.recording_date AS kpi_date,
    kpt.kpi_type,
    public.get_kpi_value(f.id, kpt.kpi_type, d.recording_date) AS value,
    CASE kpt.kpi_type
        WHEN 'flock_age_days' THEN 'days'
        WHEN 'flock_age_weeks' THEN 'weeks'
        WHEN 'flock_age_completed_weeks' THEN 'weeks'
        WHEN 'production_days' THEN 'days'
        WHEN 'hen_day_egg_production' THEN '%'
        WHEN 'hen_housed_egg_production' THEN '%'
        WHEN 'mortality_percent' THEN '%'
        WHEN 'feed_conversion_ratio' THEN ''
        ELSE ''
    END AS unit,
    CASE WHEN public.get_kpi_value(f.id, kpt.kpi_type, d.recording_date) IS NULL THEN FALSE ELSE TRUE END AS data_complete,
    NULL::TEXT AS warnings
FROM flocks f
JOIN (SELECT DISTINCT recording_date FROM egg_production_records) d ON TRUE
CROSS JOIN LATERAL (
    SELECT unnest(enum_range(NULL::kpi_type)) AS kpi_type
) kpt;

-- Create an index for fast refresh/lookup
CREATE UNIQUE INDEX kpi_daily_mv_unique_idx ON public.kpi_daily_mv (organization_id, farm_id, site_id, house_id, flock_id, kpi_date, kpi_type);

-- Weekly KPI materialized view (ISO week, Monday start)
CREATE MATERIALIZED VIEW public.kpi_weekly_mv AS
SELECT
    organization_id,
    farm_id,
    site_id,
    house_id,
    flock_id,
    date_trunc('week', kpi_date)::date AS kpi_week,
    kpi_type,
    AVG(value) AS value,
    unit,
    BOOL_AND(data_complete) AS data_complete,
    NULL::TEXT AS warnings
FROM public.kpi_daily_mv
GROUP BY organization_id, farm_id, site_id, house_id, flock_id, kpi_week, kpi_type, unit;

CREATE UNIQUE INDEX kpi_weekly_mv_unique_idx ON public.kpi_weekly_mv (organization_id, farm_id, site_id, house_id, flock_id, kpi_week, kpi_type);

-- Monthly KPI materialized view
CREATE MATERIALIZED VIEW public.kpi_monthly_mv AS
SELECT
    organization_id,
    farm_id,
    site_id,
    house_id,
    flock_id,
    date_trunc('month', kpi_date)::date AS kpi_month,
    kpi_type,
    AVG(value) AS value,
    unit,
    BOOL_AND(data_complete) AS data_complete,
    NULL::TEXT AS warnings
FROM public.kpi_daily_mv
GROUP BY organization_id, farm_id, site_id, house_id, flock_id, kpi_month, kpi_type, unit;

CREATE UNIQUE INDEX kpi_monthly_mv_unique_idx ON public.kpi_monthly_mv (organization_id, farm_id, site_id, house_id, flock_id, kpi_month, kpi_type);

-- Refresh strategy (example comment):
-- Refresh daily view after data load each day:
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.kpi_daily_mv;
-- Refresh weekly and monthly views as needed, e.g., weekly on Monday.
