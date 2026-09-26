-- 009_egg_grading.sql
-- Migration for egg grading configuration and grading batches

-- Table for farm‑specific egg grade configurations
CREATE TABLE egg_grade_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  grade_code TEXT NOT NULL,
  grade_name TEXT NOT NULL,
  min_weight NUMERIC(12,4) CHECK (min_weight >= 0),
  max_weight NUMERIC(12,4) CHECK (max_weight >= 0),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  effective_start DATE,
  effective_end DATE,
  UNIQUE (farm_id, grade_code, effective_start, effective_end)
);

-- Header for a grading batch (one per production record/shift)
CREATE TABLE egg_grading_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  production_record_id UUID NOT NULL REFERENCES egg_production_records(id) ON DELETE CASCADE,
  grading_date DATE NOT NULL,
  shift_id TEXT,
  operator_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'Draft', -- Draft, Completed
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (production_record_id, shift_id)
);

-- Details per grade within a batch
CREATE TABLE egg_grading_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grading_batch_id UUID NOT NULL REFERENCES egg_grading_batches(id) ON DELETE CASCADE,
  grade_configuration_id UUID NOT NULL REFERENCES egg_grade_configurations(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  total_weight NUMERIC(12,4) CHECK (total_weight >= 0),
  average_weight NUMERIC(12,4) CHECK (average_weight >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE egg_grade_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_grading_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_grading_details ENABLE ROW LEVEL SECURITY;

-- End of 009_egg_grading.sql
