-- ============================================================================
-- Layer Farm Recording & Management System (LFRMS)
-- Migration: 003_master_data.sql
-- Description: 17 Master Data Reference Tables with RLS & Domain Attributes
-- ============================================================================

-- 1. Breeds
CREATE TABLE breeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  origin_country TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

-- 2. Strains
CREATE TABLE strains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  breed_id UUID REFERENCES breeds(id) ON DELETE SET NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  target_peak_production_pct NUMERIC(5,2),
  target_cum_eggs_at_80wks INTEGER,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

-- 3. Suppliers
CREATE TABLE suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General', -- Feed, DOC, Medicine, Equipment
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  tax_number TEXT,
  payment_terms_days INTEGER DEFAULT 30,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

-- 4. Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Wholesaler', -- Wholesaler, Supermarket, Distributor, Retailer
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  tax_number TEXT,
  credit_limit NUMERIC(15,2) DEFAULT 0,
  payment_terms_days INTEGER DEFAULT 7,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

-- 5. Feed Types
CREATE TABLE feed_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'Laying', -- Starter, Grower, Developer, Pre-Lay, Layer 1, Layer 2
  physical_form TEXT DEFAULT 'Mash', -- Mash, Crumble, Pellet
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

-- 6. Feed Formulas
CREATE TABLE feed_formulas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  feed_type_id UUID REFERENCES feed_types(id) ON DELETE SET NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  crude_protein_pct NUMERIC(5,2),
  metabolizable_energy_kcal NUMERIC(6,2),
  calcium_pct NUMERIC(5,2),
  available_phosphorus_pct NUMERIC(5,2),
  crude_fiber_pct NUMERIC(5,2),
  crude_fat_pct NUMERIC(5,2),
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

-- 7. Medication Products
CREATE TABLE medication_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Vitamin', -- Antibiotic, Anthelmintic, Vitamin, Mineral, Disinfectant
  active_substance TEXT,
  standard_dosage TEXT,
  withdrawal_period_days INTEGER NOT NULL DEFAULT 0,
  manufacturer TEXT,
  unit_of_measure TEXT DEFAULT 'gram',
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

-- 8. Vaccines
CREATE TABLE vaccines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  target_disease TEXT NOT NULL, -- ND, IB, IBD, AI, Coryza, Pox, Salmonella
  vaccine_type TEXT NOT NULL DEFAULT 'Live', -- Live, Inactivated, Recombinant
  application_method TEXT NOT NULL DEFAULT 'Drinking Water', -- Eye Drop, Drinking Water, Spray, Injection IM/SC, Wing Web
  standard_age_weeks INTEGER,
  manufacturer TEXT,
  storage_temp_c TEXT DEFAULT '2 - 8 C',
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

-- 9. Egg Grades
CREATE TABLE egg_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  min_weight_g NUMERIC(6,2) NOT NULL CHECK (min_weight_g >= 0),
  max_weight_g NUMERIC(6,2) NOT NULL CHECK (max_weight_g > min_weight_g),
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

-- 10. Egg Quality Parameters
CREATE TABLE egg_quality_parameters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  unit TEXT,
  standard_target_min NUMERIC(8,2),
  standard_target_max NUMERIC(8,2),
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

-- 11. Units of Measure (UOM)
CREATE TABLE units_of_measure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  conversion_factor_to_base NUMERIC(12,4) DEFAULT 1.0,
  category TEXT DEFAULT 'Weight', -- Weight, Volume, Quantity, Packing
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

-- 12. Warehouses
CREATE TABLE warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  warehouse_type TEXT NOT NULL DEFAULT 'General', -- Feed, Eggs, Medical, Equipment
  capacity_description TEXT,
  location TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

-- 13. Storage Locations
CREATE TABLE storage_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warehouse_id UUID NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  capacity_volume_m3 NUMERIC(10,2),
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (warehouse_id, code)
);

-- 14. Farm Equipment
CREATE TABLE farm_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  house_id UUID REFERENCES houses(id) ON DELETE SET NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Ventilation', -- Ventilation, Cooling, Feeding, Drinking, Lighting, Generator
  brand_model TEXT,
  serial_number TEXT,
  installation_date DATE,
  maintenance_interval_days INTEGER DEFAULT 90,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

-- 15. Operational Tasks
CREATE TABLE operational_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'Daily', -- Daily, Weekly, Monthly, Per Flock
  target_department TEXT,
  sop_reference TEXT,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

-- 16. Departments
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

-- 17. Job Positions
CREATE TABLE job_positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (department_id, code)
);


-- RLS ENFORCEMENT ON ALL 17 MASTER TABLES

ALTER TABLE breeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE strains ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE medication_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE egg_quality_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE units_of_measure ENABLE ROW LEVEL SECURITY;
ALTER TABLE warehouses ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_positions ENABLE ROW LEVEL SECURITY;

-- Helper RLS policies for master data
CREATE POLICY breeds_org ON breeds FOR ALL
  USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY strains_org ON strains FOR ALL
  USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY suppliers_org ON suppliers FOR ALL
  USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY customers_org ON customers FOR ALL
  USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY feed_types_org ON feed_types FOR ALL
  USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY feed_formulas_org ON feed_formulas FOR ALL
  USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY medication_org ON medication_products FOR ALL
  USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY vaccines_org ON vaccines FOR ALL
  USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY egg_grades_org ON egg_grades FOR ALL
  USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY egg_quality_org ON egg_quality_parameters FOR ALL
  USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY uom_org ON units_of_measure FOR ALL
  USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY warehouses_org ON warehouses FOR ALL
  USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY storage_loc_org ON storage_locations FOR ALL
  USING (
    is_super_admin() OR
    warehouse_id IN (SELECT id FROM warehouses WHERE organization_id = get_current_user_org_id())
  );

CREATE POLICY equipment_org ON farm_equipment FOR ALL
  USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY tasks_org ON operational_tasks FOR ALL
  USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY departments_org ON departments FOR ALL
  USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY job_positions_org ON job_positions FOR ALL
  USING (
    is_super_admin() OR
    department_id IN (SELECT id FROM departments WHERE organization_id = get_current_user_org_id())
  );
