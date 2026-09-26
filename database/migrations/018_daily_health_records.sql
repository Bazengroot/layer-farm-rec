-- 013_daily_health_records.sql
-- Migration for daily health records and related junction tables

-- Table for daily health events
CREATE TABLE daily_health_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  population_affected INTEGER CHECK (population_affected >= 0),
  mortality INTEGER CHECK (mortality >= 0),
  culling INTEGER CHECK (culling >= 0),
  veterinarian_notes TEXT,
  action_taken TEXT,
  follow_up_date DATE,
  attachment_url TEXT,
  escalation BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Many‑to‑many link to symptoms
CREATE TABLE daily_health_symptoms (
  health_record_id UUID NOT NULL REFERENCES daily_health_records(id) ON DELETE CASCADE,
  symptom_id UUID NOT NULL REFERENCES symptoms(id) ON DELETE RESTRICT,
  PRIMARY KEY (health_record_id, symptom_id)
);

-- Many‑to‑many link to diagnoses (diseases)
CREATE TABLE daily_health_diagnoses (
  health_record_id UUID NOT NULL REFERENCES daily_health_records(id) ON DELETE CASCADE,
  disease_id UUID NOT NULL REFERENCES diseases(id) ON DELETE RESTRICT,
  PRIMARY KEY (health_record_id, disease_id)
);

-- Enable Row Level Security (policies later)
ALTER TABLE daily_health_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_health_symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_health_diagnoses ENABLE ROW LEVEL SECURITY;

-- End of 013_daily_health_records.sql
