-- 012_health_master.sql
-- Migration for health master data tables and enums

-- Enums
CREATE TYPE med_route AS ENUM ('Oral', 'Injection', 'InWater', 'InFeed', 'Topical', 'Other');
CREATE TYPE med_form AS ENUM ('Tablet', 'Solution', 'Powder', 'Suspension', 'Gel', 'Other');
CREATE TYPE vaccination_method AS ENUM ('Injection', 'Oral', 'Aerosol', 'Other');
CREATE TYPE biosecurity_result AS ENUM ('Pass', 'Fail', 'NotApplicable');

-- Medication units (e.g., mg, mL, g)
CREATE TABLE medication_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Medication products
CREATE TABLE medication_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  unit_id UUID NOT NULL REFERENCES medication_units(id),
  withdrawal_period_days INTEGER CHECK (withdrawal_period_days >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Veterinarians (could also be stored as profiles with a role, but dedicated table for simplicity)
CREATE TABLE veterinarians (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_info JSONB,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vaccines
CREATE TABLE vaccines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  method vaccination_method NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Disease / diagnosis catalog
CREATE TABLE diseases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Symptoms (catalog)
CREATE TABLE symptoms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Treatment protocols (template per disease)
CREATE TABLE treatment_protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  disease_id UUID NOT NULL REFERENCES diseases(id) ON DELETE CASCADE,
  protocol_json JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Withdrawal period overrides (optional per flock/house)
CREATE TABLE withdrawal_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_product_id UUID NOT NULL REFERENCES medication_products(id) ON DELETE CASCADE,
  flock_id UUID REFERENCES flocks(id) ON DELETE SET NULL,
  house_id UUID REFERENCES houses(id) ON DELETE SET NULL,
  override_days INTEGER NOT NULL CHECK (override_days >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Vaccine schedules (template per flock type)
CREATE TABLE vaccine_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  vaccine_id UUID NOT NULL REFERENCES vaccines(id) ON DELETE CASCADE,
  flock_stage TEXT NOT NULL,
  scheduled_day INTEGER NOT NULL CHECK (scheduled_day > 0),
  notes TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Biosecurity checklist templates (JSON array of items)
CREATE TABLE biosecurity_checklist_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  items JSONB NOT NULL, -- [{"code":"personnel_entry","label":"Personnel entry"}, ...]
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (policies will be added later)
ALTER TABLE medication_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE veterinarians ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawal_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccine_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE biosecurity_checklist_templates ENABLE ROW LEVEL SECURITY;

-- End of 012_health_master.sql
