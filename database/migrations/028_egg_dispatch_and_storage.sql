-- 028_egg_dispatch_and_storage.sql
-- Migration for storage locations and egg dispatch management

-- Storage locations for eggs (e.g., Cold Room 1, Warehouse A)
CREATE TABLE storage_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  location_name TEXT NOT NULL,
  location_type TEXT, -- e.g., 'Cold Storage', 'Ambient', 'Loading Dock'
  capacity INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (farm_id, location_name)
);

-- Egg dispatch header
CREATE TABLE egg_dispatches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL, -- assumes a customers table exists or uses profiles
  dispatch_date DATE NOT NULL,
  vehicle_id TEXT,
  driver_name TEXT,
  delivery_document_ref TEXT,
  status TEXT NOT NULL DEFAULT 'Draft', -- Draft, Approved, Dispatched, Cancelled
  total_value NUMERIC(15,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Detailed items in a dispatch
CREATE TABLE egg_dispatch_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dispatch_id UUID NOT NULL REFERENCES egg_dispatches(id) ON DELETE CASCADE,
  grade_configuration_id UUID NOT NULL REFERENCES egg_grade_configurations(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity >= 0),
  weight NUMERIC(12,4) CHECK (weight >= 0),
  unit_price NUMERIC(12,2) NOT NULL CHECK (unit_price >= 0),
  total_price NUMERIC(15,2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE storage_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_dispatch_details ENABLE ROW LEVEL SECURITY;

-- End of 028_egg_dispatch_and_storage.sql