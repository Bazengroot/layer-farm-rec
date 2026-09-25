-- 008_egg_production.sql
-- Migration for egg production records

-- Enum for egg categories (used in breakdown table)
CREATE TYPE egg_category AS ENUM (
  'Total',
  'Saleable',
  'Cracked',
  'Dirty',
  'Broken',
  'Floor',
  'Abnormal',
  'Rejected',
  'Other'
);

-- Core egg production record (one per farm/site/house/flock/date/shift/collection_round)
CREATE TABLE egg_production_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  collection_round INTEGER NOT NULL CHECK (collection_round > 0),
  shift_id TEXT, -- optional shift identifier
  recorder_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  total_eggs INTEGER NOT NULL CHECK (total_eggs >= 0),
  average_weight NUMERIC(12,4) CHECK (average_weight >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (flock_id, record_date, collection_round, shift_id)
);

-- Optional detailed breakdown per category (linked to core record)
CREATE TABLE egg_production_breakdown (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  egg_production_record_id UUID NOT NULL REFERENCES egg_production_records(id) ON DELETE CASCADE,
  category egg_category NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  weight NUMERIC(12,4) CHECK (weight >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (policy added later)
ALTER TABLE egg_production_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_production_breakdown ENABLE ROW LEVEL SECURITY;

-- End of 008_egg_production.sql
