-- Migration: Create SQL functions for Performance KPI calculations
-- File: database/migrations/026_performance_kpi_functions.sql

-- Helper function to fetch total egg production for a flock in a date range
CREATE OR REPLACE FUNCTION get_flock_total_eggs(
    p_flock_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_eggs BIGINT := 0;
BEGIN
    SELECT COALESCE(SUM(good_eggs_count + cracked_eggs_count + dirty_eggs_count + broken_eggs_count), 0)
    INTO v_total_eggs
    FROM daily_egg_production
    WHERE flock_id = p_flock_id
      AND record_date >= p_start_date
      AND record_date <= p_end_date;

    RETURN v_total_eggs;
END;
$$;

-- Helper function to fetch total mortality for a flock in a date range
CREATE OR REPLACE FUNCTION get_flock_total_mortality(
    p_flock_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_mortality BIGINT := 0;
BEGIN
    SELECT COALESCE(SUM(mortality_count), 0)
    INTO v_total_mortality
    FROM daily_health_records
    WHERE flock_id = p_flock_id
      AND record_date >= p_start_date
      AND record_date <= p_end_date;

    RETURN v_total_mortality;
END;
$$;

-- Helper function to fetch total feed consumed (in kg) for a flock in a date range
CREATE OR REPLACE FUNCTION get_flock_total_feed_kg(
    p_flock_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_feed NUMERIC := 0;
BEGIN
    SELECT COALESCE(SUM(quantity_kg), 0)
    INTO v_total_feed
    FROM daily_feed_consumption
    WHERE flock_id = p_flock_id
      AND record_date >= p_start_date
      AND record_date <= p_end_date;

    RETURN v_total_feed;
END;
$$;
