-- Function to validate and submit a daily flock record
-- This ensures that business rules are enforced on the server side before a record is submitted.

CREATE OR REPLACE FUNCTION submit_daily_record(
  p_record_id UUID,
  p_recorder_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  v_pop_record RECORD;
  v_egg_record RECORD;
  v_calculated_closing INTEGER;
BEGIN
  -- 1. Validate Population Reconciliation
  SELECT * INTO v_pop_record 
  FROM daily_population_records 
  WHERE daily_flock_record_id = p_record_id;

  IF v_pop_record IS NULL THEN
    RAISE EXCEPTION 'Population record missing for this daily record';
  END IF;

  v_calculated_closing := v_pop_record.opening_population + v_pop_record.transfer_in - v_pop_record.transfer_out - v_pop_record.mortality - v_pop_record.culling;

  IF v_pop_record.closing_population != v_calculated_closing THEN
    RAISE EXCEPTION 'Population mismatch: Closing population must be % (Opening + In - Out - Mort - Cull)', v_calculated_closing;
  END IF;

  IF v_pop_record.closing_population < 0 THEN
    RAISE EXCEPTION 'Closing population cannot be negative';
  END IF;

  -- 2. Validate Egg Production Reconciliation
  SELECT * INTO v_egg_record 
  FROM egg_production_records 
  WHERE daily_flock_record_id = p_record_id;

  IF v_egg_record IS NOT NULL THEN
    -- We check if total_eggs is at least the sum of known grades (if stored in JSONB)
    -- For this simple version, we ensure total_eggs is non-negative
    IF v_egg_record.total_eggs < 0 THEN
      RAISE EXCEPTION 'Total eggs cannot be negative';
    END IF;
  END IF;

  -- 3. Update Status to Submitted
  UPDATE daily_flock_records 
  SET status = 'Submitted', 
      updated_at = now() 
  WHERE id = p_record_id AND recorder_profile_id = p_recorder_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
