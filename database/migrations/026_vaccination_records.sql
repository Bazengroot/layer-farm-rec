-- 020_vaccination_records.sql
-- Migration for vaccination administration records

CREATE TABLE vaccination_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  vaccine_id UUID NOT NULL REFERENCES vaccines(id) ON DELETE RESTRICT,
  administered_by UUID NOT NULL REFERENCES veterinarians(id),
  admin_date DATE NOT NULL,
  dosage_amount NUMERIC CHECK (dosage_amount >= 0),
  dosage_unit_id UUID NOT NULL REFERENCES medication_units(id),
  notes TEXT,
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE vaccination_records ENABLE ROW LEVEL SECURITY;

-- End of 020_vaccination_records.sql
