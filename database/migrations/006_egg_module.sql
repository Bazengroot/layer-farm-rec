-- 006_egg_module.sql
-- Migration to create egg production, grading, quality, inventory and dispatch tables

-- Enums for status
CREATE TYPE egg_record_status AS ENUM ('Draft', 'Submitted', 'Approved', 'Rejected', 'Correction Requested', 'Corrected');
CREATE TYPE dispatch_status AS ENUM ('Draft', 'Approved', 'Dispatched', 'Cancelled');

-- 1. Egg Production Records (core daily record)
CREATE TABLE egg_production_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  collection_round INTEGER NOT NULL CHECK (collection_round > 0),
  shift_id TEXT,
  recorder_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  total_eggs INTEGER NOT NULL CHECK (total_eggs >= 0),
  saleable_eggs INTEGER NOT NULL DEFAULT 0 CHECK (saleable_eggs >= 0),
  cracked_eggs INTEGER NOT NULL DEFAULT 0 CHECK (cracked_eggs >= 0),
  dirty_eggs INTEGER NOT NULL DEFAULT 0 CHECK (dirty_eggs >= 0),
  broken_eggs INTEGER NOT NULL DEFAULT 0 CHECK (broken_eggs >= 0),
  floor_eggs INTEGER NOT NULL DEFAULT 0 CHECK (floor_eggs >= 0),
  abnormal_eggs INTEGER NOT NULL DEFAULT 0 CHECK (abnormal_eggs >= 0),
  rejected_eggs INTEGER NOT NULL DEFAULT 0 CHECK (rejected_eggs >= 0),
  other_eggs INTEGER NOT NULL DEFAULT 0 CHECK (other_eggs >= 0),
  average_weight NUMERIC(6,3) NOT NULL CHECK (average_weight >= 0),
  notes TEXT,
  status egg_record_status NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (flock_id, record_date, collection_round, shift_id)
);

-- 2. Egg Grading Configurations (farm‑specific)
CREATE TABLE egg_grading_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  grade_code TEXT NOT NULL,
  grade_name TEXT NOT NULL,
  min_weight NUMERIC(6,3) NOT NULL CHECK (min_weight >= 0),
  max_weight NUMERIC(6,3) NOT NULL CHECK (max_weight >= min_weight),
  active BOOLEAN NOT NULL DEFAULT true,
  applicable_from DATE NOT NULL,
  applicable_to DATE,
  UNIQUE (farm_id, grade_code, applicable_from)
);

-- 3. Egg Grading Batches (records of a grading operation)
CREATE TABLE egg_grading_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_record_id UUID NOT NULL REFERENCES egg_production_records(id) ON DELETE CASCADE,
  grade_config_id UUID NOT NULL REFERENCES egg_grading_configs(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  total_weight NUMERIC(12,3) NOT NULL CHECK (total_weight >= 0),
  average_weight NUMERIC(6,3) GENERATED ALWAYS AS (total_weight / NULLIF(quantity,0)) STORED,
  grading_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  operator_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  UNIQUE (production_record_id, grade_config_id)
);

-- 4. Egg Quality Records (sampling)
CREATE TABLE egg_quality_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  production_record_id UUID NOT NULL REFERENCES egg_production_records(id) ON DELETE CASCADE,
  sample_size INTEGER NOT NULL CHECK (sample_size > 0),
  avg_weight NUMERIC(6,3) NOT NULL CHECK (avg_weight >= 0),
  shell_strength NUMERIC(6,3),
  shell_thickness NUMERIC(6,3),
  shell_color TEXT,
  haugh_unit NUMERIC(6,3),
  albumen_quality TEXT,
  yolk_color TEXT,
  blood_spot INTEGER CHECK (blood_spot >= 0),
  meat_spot INTEGER CHECK (meat_spot >= 0),
  cracked_shell INTEGER CHECK (cracked_shell >= 0),
  dirty_shell INTEGER CHECK (dirty_shell >= 0),
  deformed_egg INTEGER CHECK (deformed_egg >= 0),
  double_yolk INTEGER CHECK (double_yolk >= 0),
  other_defect TEXT,
  notes TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Storage Locations (optional master table)
CREATE TABLE storage_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  location_name TEXT NOT NULL,
  description TEXT,
  UNIQUE (farm_id, location_name)
);

-- 6. Egg Inventory Transactions (ledger)
CREATE TABLE egg_inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES storage_locations(id) ON DELETE RESTRICT,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN (
    'Production In','Grading','Transfer In','Transfer Out','Dispatch','Breakage','Waste','Adjustment'
  )),
  grade_config_id UUID REFERENCES egg_grading_configs(id),
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  weight NUMERIC(12,3) NOT NULL CHECK (weight >= 0),
  reference_id UUID, -- links to production, grading, dispatch etc.
  notes TEXT,
  transaction_date TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Egg Dispatches
CREATE TABLE egg_dispatches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL, -- assume a customers table exists elsewhere
  dispatch_date DATE NOT NULL,
  grade_config_id UUID NOT NULL REFERENCES egg_grading_configs(id),
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  weight NUMERIC(12,3) NOT NULL CHECK (weight >= 0),
  price_per_kg NUMERIC(10,4) NOT NULL CHECK (price_per_kg >= 0),
  total_value NUMERIC(14,4) GENERATED ALWAYS AS (weight * price_per_kg) STORED,
  vehicle TEXT,
  driver TEXT,
  delivery_doc TEXT,
  status dispatch_status NOT NULL DEFAULT 'Draft',
  approver_profile_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (policies added separately)
ALTER TABLE egg_production_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_grading_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_grading_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_quality_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_inventory_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_dispatches ENABLE ROW LEVEL SECURITY;

-- End of 006_egg_module.sql
