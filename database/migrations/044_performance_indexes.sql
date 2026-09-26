-- Migration: 045_performance_indexes.sql
-- Adding missing indexes on foreign keys for performance and RLS efficiency

-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON profiles(organization_id);

-- Egg Module
CREATE INDEX IF NOT EXISTS idx_egg_production_org ON egg_production_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_egg_production_farm ON egg_production_records(farm_id);
CREATE INDEX IF NOT EXISTS idx_egg_breakdown_record ON egg_production_breakdown(egg_production_record_id);
CREATE INDEX IF NOT EXISTS idx_egg_grading_org ON egg_grading_batches(organization_id);
CREATE INDEX IF NOT EXISTS idx_egg_quality_org ON egg_quality_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_egg_inventory_org ON egg_inventory_transactions(organization_id);

-- Feed Module
CREATE INDEX IF NOT EXISTS idx_feed_master_org ON feed_master(organization_id);
CREATE INDEX IF NOT EXISTS idx_feed_requests_org ON feed_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_feed_receiving_org ON feed_receiving(organization_id);
CREATE INDEX IF NOT EXISTS idx_feed_inventory_org ON feed_inventory(organization_id);
CREATE INDEX IF NOT EXISTS idx_feed_issue_org ON feed_issue(organization_id);
CREATE INDEX IF NOT EXISTS idx_feed_consumption_org ON feed_consumption(organization_id);

-- Health Module
CREATE INDEX IF NOT EXISTS idx_health_master_org ON health_master(organization_id);
CREATE INDEX IF NOT EXISTS idx_daily_health_org ON daily_health_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_medication_org ON medication_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_vaccination_org ON vaccination_records(organization_id);

-- General
CREATE INDEX IF NOT EXISTS idx_biosecurity_org ON biosecurity_checklist_records(organization_id);
CREATE INDEX IF NOT EXISTS idx_kpi_definitions_org ON kpi_definitions(organization_id);
