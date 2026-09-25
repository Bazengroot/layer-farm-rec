-- 011_egg_inventory.sql
-- Migration for egg inventory stock and transaction tracking

-- Enum for inventory transaction types
CREATE TYPE egg_inventory_tx_type AS ENUM (
  'Production_In',
  'Grading',
  'Transfer_In',
  'Transfer_Out',
  'Dispatch',
  'Breakage',
  'Waste',
  'Adjustment'
);

-- Current stock per farm/grade/location (one row per combination)
CREATE TABLE egg_inventory_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  grade_configuration_id UUID NOT NULL REFERENCES egg_grade_configurations(id) ON DELETE RESTRICT,
  storage_location_id UUID NOT NULL, -- assumes a storage_locations master table exists
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  total_weight NUMERIC(12,4) CHECK (total_weight >= 0),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (farm_id, grade_configuration_id, storage_location_id)
);

-- Transaction log for all inventory movements
CREATE TABLE egg_inventory_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  transaction_type egg_inventory_tx_type NOT NULL,
  related_record_id UUID, -- can point to production, grading, dispatch, etc.
  grade_configuration_id UUID REFERENCES egg_grade_configurations(id),
  storage_location_id UUID,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  weight NUMERIC(12,4) CHECK (weight >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE egg_inventory_stock ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_inventory_transactions ENABLE ROW LEVEL SECURITY;

-- End of 011_egg_inventory.sql
