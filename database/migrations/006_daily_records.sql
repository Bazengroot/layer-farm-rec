-- 006_daily_records.sql
-- Migration to add daily recording engine tables

-- Enums for record status and approval decision
CREATE TYPE record_status AS ENUM (
  'Draft',
  'Submitted',
  'Reviewed',
  'Approved',
  'Rejected',
  'Correction Requested',
  'Corrected'
);

CREATE TYPE approval_decision AS ENUM (
  'Approved',
  'Rejected',
  'Correction Requested'
);

-- Daily flock record (core)
CREATE TABLE daily_flock_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  shift_id TEXT, -- optional shift identifier (e.g.,  morning, evening)
  recorder_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  status record_status NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (flock_id, record_date, shift_id)
);

-- Daily population details linked to a daily flock record
CREATE TABLE daily_population_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_flock_record_id UUID NOT NULL REFERENCES daily_flock_records(id) ON DELETE CASCADE,
  opening_population INTEGER NOT NULL CHECK (opening_population >= 0),
  mortality INTEGER NOT NULL DEFAULT 0 CHECK (mortality >= 0),
  culling INTEGER NOT NULL DEFAULT 0 CHECK (culling >= 0),
  transfer_in INTEGER NOT NULL DEFAULT 0 CHECK (transfer_in >= 0),
  transfer_out INTEGER NOT NULL DEFAULT 0 CHECK (transfer_out >= 0),
  closing_population INTEGER NOT NULL CHECK (closing_population >= 0),
  reasons JSONB, -- optional free‑form reasons for losses
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Mortality detailed records (audit trail)
CREATE TABLE mortality_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_flock_record_id UUID NOT NULL REFERENCES daily_flock_records(id) ON DELETE CASCADE,
  cause TEXT,
  count INTEGER NOT NULL CHECK (count >= 0),
  age_weeks INTEGER CHECK (age_weeks >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Culling detailed records
CREATE TABLE culling_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_flock_record_id UUID NOT NULL REFERENCES daily_flock_records(id) ON DELETE CASCADE,
  reason TEXT,
  count INTEGER NOT NULL CHECK (count >= 0),
  age_weeks INTEGER CHECK (age_weeks >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Flock transfer (in/out) records
CREATE TABLE flock_transfer_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_flock_record_id UUID NOT NULL REFERENCES daily_flock_records(id) ON DELETE CASCADE,
  direction TEXT NOT NULL CHECK (direction IN ('In','Out')),
  target_flock_id UUID REFERENCES flocks(id),
  count INTEGER NOT NULL CHECK (count >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Egg production summary for the day
CREATE TABLE egg_production_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_flock_record_id UUID NOT NULL REFERENCES daily_flock_records(id) ON DELETE CASCADE,
  total_eggs INTEGER NOT NULL CHECK (total_eggs >= 0),
  broken_eggs INTEGER NOT NULL DEFAULT 0 CHECK (broken_eggs >= 0),
  dirty_eggs INTEGER NOT NULL DEFAULT 0 CHECK (dirty_eggs >= 0),
  classification JSONB, -- e.g., {A:1200,B:300}
  collection_rounds INTEGER NOT NULL DEFAULT 1 CHECK (collection_rounds > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Egg collection details per round (optional)
CREATE TABLE egg_collection_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  egg_production_record_id UUID NOT NULL REFERENCES egg_production_records(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL CHECK (round_number > 0),
  collected INTEGER NOT NULL CHECK (collected >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Feed consumption details
CREATE TABLE feed_consumption_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_flock_record_id UUID NOT NULL REFERENCES daily_flock_records(id) ON DELETE CASCADE,
  feed_type_id UUID NOT NULL, -- reference to master feed_types table (not shown here)
  feed_formula_id UUID, -- optional link to feed_formulas table
  opening_stock NUMERIC(12,4) NOT NULL CHECK (opening_stock >= 0),
  received NUMERIC(12,4) NOT NULL DEFAULT 0 CHECK (received >= 0),
  issued NUMERIC(12,4) NOT NULL DEFAULT 0 CHECK (issued >= 0),
  consumed NUMERIC(12,4) NOT NULL DEFAULT 0 CHECK (consumed >= 0),
  closing_stock NUMERIC(12,4) NOT NULL CHECK (closing_stock >= 0),
  wastage NUMERIC(12,4) CHECK (wastage >= 0),
  unit TEXT NOT NULL DEFAULT ''kg'',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Water consumption details
CREATE TABLE water_consumption_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_flock_record_id UUID NOT NULL REFERENCES daily_flock_records(id) ON DELETE CASCADE,
  liters NUMERIC(12,4) NOT NULL CHECK (liters >= 0),
  source TEXT,
  medication TEXT,
  treatment TEXT,
  meter_reading NUMERIC(12,4),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Environmental observations for the day
CREATE TABLE environmental_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_flock_record_id UUID NOT NULL REFERENCES daily_flock_records(id) ON DELETE CASCADE,
  temperature_min NUMERIC(6,2),
  temperature_max NUMERIC(6,2),
  temperature_avg NUMERIC(6,2),
  humidity_min NUMERIC(6,2),
  humidity_max NUMERIC(6,2),
  humidity_avg NUMERIC(6,2),
  ammonia_ppm NUMERIC(6,2),
  ventilation TEXT,
  lighting TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Body weight sampling records
CREATE TABLE body_weight_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_flock_record_id UUID NOT NULL REFERENCES daily_flock_records(id) ON DELETE CASCADE,
  sample_size INTEGER NOT NULL CHECK (sample_size > 0),
  average_weight NUMERIC(12,4) NOT NULL CHECK (average_weight >= 0),
  min_weight NUMERIC(12,4),
  max_weight NUMERIC(12,4),
  uniformity_percent NUMERIC(5,2),
  target_weight NUMERIC(12,4),
  variance NUMERIC(12,4),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Approval actions for a daily record
CREATE TABLE daily_record_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_flock_record_id UUID NOT NULL REFERENCES daily_flock_records(id) ON DELETE CASCADE,
  approver_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  decision approval_decision NOT NULL,
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Corrections requested and applied to a daily record
CREATE TABLE recording_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_flock_record_id UUID NOT NULL REFERENCES daily_flock_records(id) ON DELETE CASCADE,
  corrected_by_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  correction_timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for the new tables (policies added separately)
ALTER TABLE daily_flock_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_population_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE mortality_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE culling_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE flock_transfer_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_production_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_collection_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_consumption_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_consumption_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE environmental_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE body_weight_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_record_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE recording_corrections ENABLE ROW LEVEL SECURITY;

-- End of 006_daily_records.sql
