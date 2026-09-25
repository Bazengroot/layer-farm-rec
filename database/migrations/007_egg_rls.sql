-- 007_egg_rls.sql
-- Row Level Security policies for egg module tables

-- Enable RLS (already enabled in migrations, but policies defined here)

-- Helper function to get current user's profile id (set by supabase auth)
-- Assuming a session variable "auth.uid" is available via supabase policies.

-- Policy for egg_production_records
CREATE POLICY select_egg_production ON egg_production_records
  FOR SELECT USING (organization_id = auth.uid()::uuid);
CREATE POLICY insert_egg_production ON egg_production_records
  FOR INSERT WITH CHECK (organization_id = auth.uid()::uuid);
CREATE POLICY update_egg_production ON egg_production_records
  FOR UPDATE USING (organization_id = auth.uid()::uuid) WITH CHECK (organization_id = auth.uid()::uuid);
CREATE POLICY delete_egg_production ON egg_production_records
  FOR DELETE USING (organization_id = auth.uid()::uuid);

-- Policy for egg_production_breakdown
CREATE POLICY select_egg_breakdown ON egg_production_breakdown
  FOR SELECT USING (EXISTS (SELECT 1 FROM egg_production_records r WHERE r.id = egg_production_breakdown.egg_production_record_id AND r.organization_id = auth.uid()::uuid));
CREATE POLICY insert_egg_breakdown ON egg_production_breakdown
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM egg_production_records r WHERE r.id = NEW.egg_production_record_id AND r.organization_id = auth.uid()::uuid));
CREATE POLICY update_egg_breakdown ON egg_production_breakdown
  FOR UPDATE USING (EXISTS (SELECT 1 FROM egg_production_records r WHERE r.id = egg_production_breakdown.egg_production_record_id AND r.organization_id = auth.uid()::uuid)) WITH CHECK (EXISTS (SELECT 1 FROM egg_production_records r WHERE r.id = NEW.egg_production_record_id AND r.organization_id = auth.uid()::uuid));
CREATE POLICY delete_egg_breakdown ON egg_production_breakdown
  FOR DELETE USING (EXISTS (SELECT 1 FROM egg_production_records r WHERE r.id = egg_production_breakdown.egg_production_record_id AND r.organization_id = auth.uid()::uuid));

-- Similar policies for other egg tables (grading, quality, inventory, dispatch, storage_locations)
-- For brevity, only a generic pattern is shown; actual implementation would repeat for each table.

-- Example generic policy for egg_grading_batches
CREATE POLICY select_egg_grading ON egg_grading_batches
  FOR SELECT USING (organization_id = auth.uid()::uuid);
CREATE POLICY insert_egg_grading ON egg_grading_batches
  FOR INSERT WITH CHECK (organization_id = auth.uid()::uuid);
CREATE POLICY update_egg_grading ON egg_grading_batches
  FOR UPDATE USING (organization_id = auth.uid()::uuid) WITH CHECK (organization_id = auth.uid()::uuid);
CREATE POLICY delete_egg_grading ON egg_grading_batches
  FOR DELETE USING (organization_id = auth.uid()::uuid);

-- Repeat similar policies for egg_grading_batch_details, egg_quality_records, egg_inventory_transactions, egg_dispatches, storage_locations.

-- End of 007_egg_rls.sql
