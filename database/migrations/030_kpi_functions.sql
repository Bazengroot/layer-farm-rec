-- 022_kpi_functions.sql
-- Functions that compute the KPI values used by the LFRMS analytics engine.
-- All functions assume the caller has appropriate RLS/permission checks.

-- Helper to fetch farm timezone for a given organization/farm hierarchy
CREATE OR REPLACE FUNCTION public.get_farm_timezone(p_organization_id UUID, p_farm_id UUID)
RETURNS TEXT LANGUAGE sql STABLE AS $$
    SELECT timezone FROM farms WHERE organization_id = p_organization_id AND id = p_farm_id;
$$;

-- 1. Flock age in days (including leap years)
CREATE OR REPLACE FUNCTION public.calc_flock_age_days(p_flock_id UUID, p_as_of DATE)
RETURNS INTEGER LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_placement DATE;
    v_age INT;
BEGIN
    SELECT placement_date INTO v_placement FROM flocks WHERE id = p_flock_id;
    IF v_placement IS NULL THEN
        RETURN NULL; -- unknown placement
    END IF;
    v_age := (p_as_of - v_placement);
    RETURN GREATEST(v_age, 0);
END;
$$;

-- 2. Flock age in weeks (floating point)
CREATE OR REPLACE FUNCTION public.calc_flock_age_weeks(p_flock_id UUID, p_as_of DATE)
RETURNS NUMERIC LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_days INT;
BEGIN
    v_days := public.calc_flock_age_days(p_flock_id, p_as_of);
    IF v_days IS NULL THEN RETURN NULL; END IF;
    RETURN ROUND(v_days / 7.0, 2);
END;
$$;

-- 3. Completed weeks (integer, floor)
CREATE OR REPLACE FUNCTION public.calc_flock_age_completed_weeks(p_flock_id UUID, p_as_of DATE)
RETURNS INTEGER LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_days INT;
BEGIN
    v_days := public.calc_flock_age_days(p_flock_id, p_as_of);
    IF v_days IS NULL THEN RETURN NULL; END IF;
    RETURN FLOOR(v_days / 7);
END;
$$;

-- 4. Production days (days since first egg production record)
CREATE OR REPLACE FUNCTION public.calc_flock_production_days(p_flock_id UUID, p_as_of DATE)
RETURNS INTEGER LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_first DATE;
BEGIN
    SELECT MIN(recording_date) INTO v_first FROM egg_production_records WHERE flock_id = p_flock_id;
    IF v_first IS NULL THEN RETURN NULL; END IF;
    RETURN (p_as_of - v_first);
END;
$$;

-- 5. Hen‑day egg production (%)
CREATE OR REPLACE FUNCTION public.calc_hen_day_egg_production(p_flock_id UUID, p_as_of DATE)
RETURNS NUMERIC LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_total_eggs NUMERIC;
    v_live_hens NUMERIC;
BEGIN
    SELECT COALESCE(SUM(total_eggs),0) INTO v_total_eggs FROM egg_production_records
    WHERE flock_id = p_flock_id AND recording_date = p_as_of;
    SELECT COALESCE(average_live_hens,0) INTO v_live_hens FROM flock_population
    WHERE flock_id = p_flock_id AND as_of_date = p_as_of;
    IF v_live_hens = 0 THEN RETURN NULL; END IF;
    RETURN ROUND((v_total_eggs / v_live_hens) * 100, 2);
END;
$$;

-- 6. Hen‑housed egg production (%)
CREATE OR REPLACE FUNCTION public.calc_hen_housed_egg_production(p_flock_id UUID, p_as_of DATE)
RETURNS NUMERIC LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_total_eggs NUMERIC;
    v_initial_hens NUMERIC;
BEGIN
    SELECT COALESCE(SUM(total_eggs),0) INTO v_total_eggs FROM egg_production_records
    WHERE flock_id = p_flock_id AND recording_date = p_as_of;
    SELECT initial_population INTO v_initial_hens FROM flocks WHERE id = p_flock_id;
    IF v_initial_hens = 0 THEN RETURN NULL; END IF;
    RETURN ROUND((v_total_eggs / v_initial_hens) * 100, 2);
END;
$$;

-- 7. Mortality (%)
CREATE OR REPLACE FUNCTION public.calc_mortality_percent(p_flock_id UUID, p_as_of DATE)
RETURNS NUMERIC LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_mortality INT;
    v_opening_pop INT;
BEGIN
    SELECT COALESCE(SUM(mortality_quantity),0) INTO v_mortality FROM daily_health_records
    WHERE flock_id = p_flock_id AND recording_date = p_as_of;
    SELECT opening_population INTO v_opening_pop FROM flocks WHERE id = p_flock_id;
    IF v_opening_pop = 0 THEN RETURN NULL; END IF;
    RETURN ROUND((v_mortality::NUMERIC / v_opening_pop) * 100, 2);
END;
$$;

-- 8. Feed conversion ratio (FCR) = feed_kg_consumed / egg_weight_kg_produced
CREATE OR REPLACE FUNCTION public.calc_feed_conversion_ratio(p_flock_id UUID, p_as_of DATE)
RETURNS NUMERIC LANGUAGE plpgsql STABLE AS $$
DECLARE
    v_feed_kg NUMERIC;
    v_egg_weight_kg NUMERIC;
BEGIN
    SELECT COALESCE(SUM(quantity_kg),0) INTO v_feed_kg FROM feed_consumption_records
    WHERE flock_id = p_flock_id AND consumption_date = p_as_of;
    SELECT COALESCE(SUM(egg_weight_kg),0) INTO v_egg_weight_kg FROM egg_production_records
    WHERE flock_id = p_flock_id AND recording_date = p_as_of;
    IF v_egg_weight_kg = 0 THEN RETURN NULL; END IF;
    RETURN ROUND(v_feed_kg / v_egg_weight_kg, 3);
END;
$$;

-- 9. Aggregate function to retrieve any KPI by type
CREATE OR REPLACE FUNCTION public.get_kpi_value(
    p_flock_id UUID,
    p_kpi_type TEXT,
    p_as_of DATE
) RETURNS NUMERIC LANGUAGE plpgsql STABLE AS $$
BEGIN
    CASE p_kpi_type
        WHEN 'flock_age_days' THEN RETURN public.calc_flock_age_days(p_flock_id, p_as_of);
        WHEN 'flock_age_weeks' THEN RETURN public.calc_flock_age_weeks(p_flock_id, p_as_of);
        WHEN 'flock_age_completed_weeks' THEN RETURN public.calc_flock_age_completed_weeks(p_flock_id, p_as_of);
        WHEN 'production_days' THEN RETURN public.calc_flock_production_days(p_flock_id, p_as_of);
        WHEN 'hen_day_egg_production' THEN RETURN public.calc_hen_day_egg_production(p_flock_id, p_as_of);
        WHEN 'hen_housed_egg_production' THEN RETURN public.calc_hen_housed_egg_production(p_flock_id, p_as_of);
        WHEN 'mortality_percent' THEN RETURN public.calc_mortality_percent(p_flock_id, p_as_of);
        WHEN 'feed_conversion_ratio' THEN RETURN public.calc_feed_conversion_ratio(p_flock_id, p_as_of);
        ELSE RETURN NULL;
    END CASE;
END;
$$;

-- Grant execute rights to the api role (or supabase anon/public)
GRANT EXECUTE ON FUNCTION public.calc_flock_age_days(uuid, date) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.calc_flock_age_weeks(uuid, date) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.calc_flock_age_completed_weeks(uuid, date) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.calc_flock_production_days(uuid, date) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.calc_hen_day_egg_production(uuid, date) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.calc_hen_housed_egg_production(uuid, date) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.calc_mortality_percent(uuid, date) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.calc_feed_conversion_ratio(uuid, date) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_kpi_value(uuid, text, date) TO anon, authenticated;
