-- Migration: Extended SQL helper functions for full Phase 7 KPIs
-- File: database/migrations/027_extended_kpi_functions.sql

-- Helper function to fetch total culling for a flock in a date range
CREATE OR REPLACE FUNCTION get_flock_total_culling(
    p_flock_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS BIGINT
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_culling BIGINT := 0;
BEGIN
    SELECT COALESCE(SUM(culling_count), 0)
    INTO v_total_culling
    FROM daily_health_records
    WHERE flock_id = p_flock_id
      AND record_date >= p_start_date
      AND record_date <= p_end_date;

    RETURN v_total_culling;
END;
$$;

-- Helper function to fetch total egg weight in kg for a flock in a date range
CREATE OR REPLACE FUNCTION get_flock_total_egg_weight_kg(
    p_flock_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_weight_kg NUMERIC := 0;
BEGIN
    SELECT COALESCE(SUM(total_weight_kg), 0)
    INTO v_total_weight_kg
    FROM daily_egg_production
    WHERE flock_id = p_flock_id
      AND record_date >= p_start_date
      AND record_date <= p_end_date;

    RETURN v_total_weight_kg;
END;
$$;

-- Helper function to fetch total feed cost for a flock in a date range
CREATE OR REPLACE FUNCTION get_flock_total_feed_cost(
    p_flock_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS NUMERIC
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_cost NUMERIC := 0;
BEGIN
    SELECT COALESCE(SUM(total_cost), 0)
    INTO v_total_cost
    FROM daily_feed_consumption
    WHERE flock_id = p_flock_id
      AND record_date >= p_start_date
      AND record_date <= p_end_date;

    RETURN v_total_cost;
END;
$$;
