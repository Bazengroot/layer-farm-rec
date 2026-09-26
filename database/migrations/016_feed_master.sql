-- 012_feed_master.sql
-- Migration for feed master data tables

-- Enum for feed stages
CREATE TYPE feed_stage AS ENUM (
  'Starter',
  'Grower',
  'Developer',
  'Pre-layer',
  'Layer Phase 1',
  'Layer Phase 2',
  'Layer Phase 3',
  'Custom'
);

-- Feed units (e.g., kg, metric_ton)
CREATE TABLE feed_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Feed types
CREATE TABLE feed_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Feed suppliers
CREATE TABLE feed_suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_info JSONB,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Feed warehouses
CREATE TABLE feed_warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  location TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Storage bins (belong to a warehouse)
CREATE TABLE feed_storage_bins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES feed_warehouses(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  capacity NUMERIC(12,4) CHECK (capacity >= 0),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (warehouse_id, code)
);

-- Feed batches (physical deliveries)
CREATE TABLE feed_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_type_id UUID NOT NULL REFERENCES feed_types(id) ON DELETE RESTRICT,
  supplier_id UUID NOT NULL REFERENCES feed_suppliers(id) ON DELETE RESTRICT,
  batch_code TEXT NOT NULL,
  production_date DATE NOT NULL,
  expiration_date DATE,
  unit_id UUID NOT NULL REFERENCES feed_units(id),
  quantity NUMERIC(12,4) NOT NULL CHECK (quantity >= 0),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (supplier_id, batch_code)
);

-- Feed prices (historical)
CREATE TABLE feed_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_type_id UUID NOT NULL REFERENCES feed_types(id) ON DELETE CASCADE,
  unit_id UUID NOT NULL REFERENCES feed_units(id) ON DELETE RESTRICT,
  price_per_unit NUMERIC(12,4) NOT NULL CHECK (price_per_unit >= 0),
  effective_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (feed_type_id, unit_id, effective_date)
);

-- Feed nutritional specifications (normalized per nutrient)
CREATE TABLE feed_nutritional_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_type_id UUID NOT NULL REFERENCES feed_types(id) ON DELETE CASCADE,
  nutrient TEXT NOT NULL,
  amount_per_kg NUMERIC(12,4) NOT NULL CHECK (amount_per_kg >= 0),
  unit TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (feed_type_id, nutrient)
);

-- Feed formulas – may reference a supplier and a nutritional spec (JSON for flexibility)
CREATE TABLE feed_formulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  feed_stage feed_stage NOT NULL,
  supplier_id UUID REFERENCES feed_suppliers(id) ON DELETE SET NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  nutritional_spec_json JSONB,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for all new tables (policies added later)
ALTER TABLE feed_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_storage_bins ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_nutritional_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_formulas ENABLE ROW LEVEL SECURITY;

-- End of 012_feed_master.sql
