-- 010_egg_quality.sql
-- Migration for egg quality parameters, thresholds, and sampling records

-- Master list of quality parameters (static reference)
CREATE TABLE egg_quality_parameters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE, -- e.g., 'weight', 'shell_strength', 'haugh'
  description TEXT NOT NULL
);

-- Farm‑specific quality thresholds (optional date range validity)
CREATE TABLE egg_quality_thresholds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  parameter_id UUID NOT NULL REFERENCES egg_quality_parameters(id) ON DELETE CASCADE,
  min_value NUMERIC(12,4),
  max_value NUMERIC(12,4),
  effective_start DATE,
  effective_end DATE,
  UNIQUE (farm_id, parameter_id, effective_start, effective_end)
);

-- Recorded quality sample runs (manual sampling)
CREATE TABLE egg_quality_samples (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  sample_date DATE NOT NULL,
  shift_id TEXT,
  sampler_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  total_samples INTEGER NOT NULL CHECK (total_samples > 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Detailed defect counts per parameter for a sample run
CREATE TABLE egg_quality_sample_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quality_sample_id UUID NOT NULL REFERENCES egg_quality_samples(id) ON DELETE CASCADE,
  parameter_id UUID NOT NULL REFERENCES egg_quality_parameters(id) ON DELETE CASCADE,
  defect_count INTEGER NOT NULL CHECK (defect_count >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for new tables
ALTER TABLE egg_quality_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_quality_thresholds ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_quality_samples ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_quality_sample_details ENABLE ROW LEVEL SECURITY;

-- End of 010_egg_quality.sql
