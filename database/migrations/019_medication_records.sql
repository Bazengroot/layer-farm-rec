-- 019_medication_records.sql
-- Migration for medication administration records

-- Table for medication administration events
CREATE TABLE medication_administrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  medication_product_id UUID NOT NULL REFERENCES medication_products(id) ON DELETE RESTRICT,
  dosage_amount NUMERIC CHECK (dosage_amount >= 0),
  dosage_unit_id UUID NOT NULL REFERENCES medication_units(id),
  administered_by UUID NOT NULL REFERENCES veterinarians(id),
  admin_date DATE NOT NULL,
  notes TEXT,
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (policies will be added later)
ALTER TABLE medication_administrations ENABLE ROW LEVEL SECURITY;

-- End of 019_medication_records.sql
