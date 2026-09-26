-- 007_daily_records_rls.sql
-- Row Level Security policies for daily recording tables

-- Helper function assumed: has_permission(user_id UUID, permission_code TEXT) returning BOOLEAN

-- daily_flock_records policies
CREATE POLICY daily_flock_select ON daily_flock_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organization_id = daily_flock_records.organization_id
    )
  );

CREATE POLICY daily_flock_insert ON daily_flock_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organization_id = daily_flock_records.organization_id
    ) AND has_permission(auth.uid(), 'create_recording')
  );

CREATE POLICY daily_flock_update ON daily_flock_records
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.organization_id = daily_flock_records.organization_id
    ) AND has_permission(auth.uid(), 'edit_recording')
  );

CREATE POLICY daily_flock_delete ON daily_flock_records
  FOR DELETE USING (false);

-- daily_population_records policies
CREATE POLICY daily_population_select ON daily_population_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM daily_flock_records dfr WHERE dfr.id = daily_population_records.daily_flock_record_id AND dfr.organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY daily_population_insert ON daily_population_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM daily_flock_records dfr WHERE dfr.id = daily_population_records.daily_flock_record_id AND dfr.organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
    ) AND has_permission(auth.uid(), 'edit_recording')
  );

CREATE POLICY daily_population_update ON daily_population_records
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM daily_flock_records dfr WHERE dfr.id = daily_population_records.daily_flock_record_id AND dfr.organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
    ) AND has_permission(auth.uid(), 'edit_recording')
  );

-- mortality_records policies
CREATE POLICY mortality_select ON mortality_records
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM daily_flock_records dfr WHERE dfr.id = mortality_records.daily_flock_record_id AND dfr.organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY mortality_insert ON mortality_records
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM daily_flock_records dfr WHERE dfr.id = mortality_records.daily_flock_record_id AND dfr.organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
    ) AND has_permission(auth.uid(), 'edit_recording')
  );

CREATE POLICY mortality_update ON mortality_records
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM daily_flock_records dfr WHERE dfr.id = mortality_records.daily_flock_record_id AND dfr.organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid())
    ) AND has_permission(auth.uid(), 'edit_recording')
  );

-- Additional policies for culling_records, flock_transfer_records, egg_production_records, egg_collection_records, feed_consumption_records, water_consumption_records, environmental_records, body_weight_records, daily_record_approvals, recording_corrections would follow the same pattern.

-- Ensure RLS is enabled (already set in migration 006).

-- End of 007_daily_records_rls.sql
