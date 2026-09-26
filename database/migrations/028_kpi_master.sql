-- 021_kpi_master.sql
-- Migration for KPI master tables and enums

-- Enum for KPI types (list all KPI identifiers used in the system)
CREATE TYPE kpi_type AS ENUM (
  'flock_age_days',
  'flock_age_weeks',
  'flock_age_completed_weeks',
  'flock_age_production_days',
  'hen_day_egg_production',
  'hen_housed_egg_production',
  'mortality',
  'culling',
  'livability',
  'average_egg_weight',
  'egg_mass',
  'feed_per_bird',
  'feed_conversion_ratio',
  'feed_cost_per_egg',
  'feed_cost_per_kg_egg_mass'
);

-- Table for optional daily KPI snapshots (fast dashboard reads)
CREATE TABLE kpi_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  house_id UUID REFERENCES houses(id) ON DELETE SET NULL,
  flock_id UUID REFERENCES flocks(id) ON DELETE SET NULL,
  kpi_date DATE NOT NULL,
  kpi_type kpi_type NOT NULL,
  value NUMERIC(12,4),
  unit TEXT,
  data_complete BOOLEAN NOT NULL DEFAULT FALSE,
  warnings TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, farm_id, site_id, house_id, flock_id, kpi_date, kpi_type)
);

-- Enable Row Level Security (policies added later)
ALTER TABLE kpi_snapshots ENABLE ROW LEVEL SECURITY;

-- End of 021_kpi_master.sql
