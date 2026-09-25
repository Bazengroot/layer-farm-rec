-- ============================================================================
-- Layer Farm Recording & Management System (LFRMS)
-- Migration: 002_schema.sql
-- Description: Core Schema (Org, Farm, Site, House, Flock, Ledger, RBAC, Audit)
-- ============================================================================

-- 1. ENUMS
CREATE TYPE farm_type AS ENUM (
  'Layer Farm',
  'Pullet Farm',
  'Breeder Farm',
  'Hatchery',
  'Feedmill',
  'Other'
);

CREATE TYPE house_type AS ENUM (
  'Open House',
  'Closed House',
  'Environmentally Controlled House',
  'Pullets House',
  'Layer House'
);

CREATE TYPE cage_system AS ENUM (
  'Conventional Cage',
  'Enriched Cage',
  'Aviary',
  'Floor System',
  'Other'
);

CREATE TYPE flock_status AS ENUM (
  'Planned',
  'Active',
  'Transferred',
  'Closed',
  'Archived'
);

CREATE TYPE production_cycle AS ENUM (
  'Pullet',
  'Rearing',
  'Laying',
  'Spent Hen'
);

CREATE TYPE transaction_type AS ENUM (
  'Initial Placement',
  'Addition',
  'Mortality',
  'Culling',
  'Transfer In',
  'Transfer Out',
  'Adjustment',
  'Final Closing'
);

-- 2. CORE HIERARCHY TABLES

-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_code TEXT NOT NULL UNIQUE,
  organization_name TEXT NOT NULL,
  legal_name TEXT,
  timezone TEXT NOT NULL DEFAULT 'Asia/Jakarta',
  country TEXT NOT NULL DEFAULT 'Indonesia',
  address TEXT,
  phone TEXT,
  email TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Farms
CREATE TABLE farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_code TEXT NOT NULL,
  farm_name TEXT NOT NULL,
  farm_type farm_type NOT NULL DEFAULT 'Layer Farm',
  location TEXT,
  province TEXT,
  city TEXT,
  address TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, farm_code)
);

-- Sites
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  site_code TEXT NOT NULL,
  site_name TEXT NOT NULL,
  site_manager_id UUID, -- Foreign key added after profiles table creation
  address TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (farm_id, site_code)
);

-- Houses
CREATE TABLE houses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  house_code TEXT NOT NULL,
  house_name TEXT NOT NULL,
  house_type house_type NOT NULL DEFAULT 'Closed House',
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  cage_system cage_system NOT NULL DEFAULT 'Conventional Cage',
  floor_area_m2 NUMERIC(12,2) NOT NULL CHECK (floor_area_m2 > 0),
  dimensions_length_m NUMERIC(10,2),
  dimensions_width_m NUMERIC(10,2),
  dimensions_height_m NUMERIC(10,2),
  ventilation_type TEXT,
  cooling_system TEXT,
  lighting_system TEXT,
  status TEXT NOT NULL DEFAULT 'Cleaned & Sanitized',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (site_id, house_code)
);

-- Flocks
CREATE TABLE flocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  flock_code TEXT NOT NULL,
  flock_name TEXT,
  breed TEXT,
  strain TEXT,
  source_supplier TEXT,
  placement_date DATE NOT NULL,
  placement_age_weeks INTEGER NOT NULL DEFAULT 16 CHECK (placement_age_weeks >= 0),
  initial_population INTEGER NOT NULL DEFAULT 0 CHECK (initial_population >= 0),
  current_population INTEGER NOT NULL DEFAULT 0 CHECK (current_population >= 0),
  sex TEXT DEFAULT 'Female',
  flock_status flock_status NOT NULL DEFAULT 'Planned',
  production_cycle production_cycle NOT NULL DEFAULT 'Pullet',
  expected_end_date DATE,
  standard_profile_id UUID,
  notes TEXT,
  created_by UUID,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, flock_code)
);

-- Flock Placements
CREATE TABLE flock_placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  placement_date DATE NOT NULL,
  source TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  age_weeks INTEGER CHECK (age_weeks >= 0),
  average_weight_g NUMERIC(10,2) CHECK (average_weight_g >= 0),
  document_reference TEXT,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Flock Population Transactions Ledger
CREATE TABLE flock_population_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  transaction_type transaction_type NOT NULL,
  quantity INTEGER NOT NULL,
  source_flock_id UUID REFERENCES flocks(id) ON DELETE SET NULL,
  destination_flock_id UUID REFERENCES flocks(id) ON DELETE SET NULL,
  reason TEXT,
  reference_number TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_flock_pop_qty CHECK (
    (transaction_type = 'Adjustment' AND quantity <> 0) OR
    (transaction_type <> 'Adjustment' AND quantity > 0)
  )
);

-- Trigger: Atomic population maintenance & negative protection
CREATE OR REPLACE FUNCTION update_flock_population() RETURNS TRIGGER AS $$
DECLARE
  v_current_pop INTEGER;
  v_new_pop INTEGER;
BEGIN
  -- Lock flock row for atomic update to eliminate race conditions
  SELECT COALESCE(current_population, 0) INTO v_current_pop
  FROM flocks
  WHERE id = NEW.flock_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Flock with ID % does not exist', NEW.flock_id;
  END IF;

  CASE NEW.transaction_type
    WHEN 'Initial Placement' THEN
      v_new_pop := v_current_pop + NEW.quantity;
      -- Auto-update initial_population if 0
      UPDATE flocks
      SET initial_population = CASE WHEN COALESCE(initial_population, 0) = 0 THEN NEW.quantity ELSE initial_population END,
          flock_status = 'Active'
      WHERE id = NEW.flock_id;

    WHEN 'Addition' THEN
      v_new_pop := v_current_pop + NEW.quantity;

    WHEN 'Transfer In' THEN
      v_new_pop := v_current_pop + NEW.quantity;

    WHEN 'Mortality' THEN
      v_new_pop := v_current_pop - NEW.quantity;

    WHEN 'Culling' THEN
      v_new_pop := v_current_pop - NEW.quantity;

    WHEN 'Transfer Out' THEN
      v_new_pop := v_current_pop - NEW.quantity;

    WHEN 'Adjustment' THEN
      v_new_pop := v_current_pop + NEW.quantity;

    WHEN 'Final Closing' THEN
      v_new_pop := 0;
      UPDATE flocks SET flock_status = 'Closed' WHERE id = NEW.flock_id;

    ELSE
      RAISE EXCEPTION 'Unsupported transaction type: %', NEW.transaction_type;
  END CASE;

  -- Enforce non-negative population integrity
  IF v_new_pop < 0 THEN
    RAISE EXCEPTION 'Population integrity violation: Resulting flock population cannot be negative (current: %, delta: %, resulting: %)',
      v_current_pop, NEW.quantity, v_new_pop;
  END IF;

  UPDATE flocks
  SET current_population = v_new_pop,
      updated_at = now()
  WHERE id = NEW.flock_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_flock_population
AFTER INSERT ON flock_population_transactions
FOR EACH ROW EXECUTE FUNCTION update_flock_population();

-- Trigger: Immutability of Population Ledger Transactions
CREATE OR REPLACE FUNCTION prevent_population_tx_mutation() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Population ledger transactions are immutable records and cannot be updated or deleted. Record an Adjustment transaction instead.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_population_tx_mutation
BEFORE UPDATE OR DELETE ON flock_population_transactions
FOR EACH ROW EXECUTE FUNCTION prevent_population_tx_mutation();


-- 3. PROFILES & RBAC TABLES

-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_uid UUID NOT NULL UNIQUE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add site_manager_id foreign key to sites now that profiles exists
ALTER TABLE sites
  ADD CONSTRAINT fk_sites_manager
  FOREIGN KEY (site_manager_id) REFERENCES profiles(id) ON DELETE SET NULL;

-- Roles
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Permissions
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  module TEXT NOT NULL DEFAULT 'general',
  action TEXT NOT NULL DEFAULT 'view',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Role-Permission Matrix
CREATE TABLE role_permissions (
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (role_id, permission_id)
);

-- User-Role Mapping
CREATE TABLE user_roles (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

-- Facility Scope User Assignments
CREATE TABLE farm_user_assignments (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, farm_id)
);

CREATE TABLE site_user_assignments (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, site_id)
);

CREATE TABLE house_user_assignments (
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, house_id)
);

-- 4. AUDIT LOGGING

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: Immutability of Audit Logs (Append-Only)
CREATE OR REPLACE FUNCTION prevent_audit_log_mutation() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Audit logs are immutable append-only records and cannot be updated or deleted.';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_audit_log_mutation
BEFORE UPDATE OR DELETE ON audit_logs
FOR EACH ROW EXECUTE FUNCTION prevent_audit_log_mutation();

-- Revoke mutation rights from public and standard roles
REVOKE UPDATE, DELETE, TRUNCATE ON audit_logs FROM public, anon, authenticated;


-- 5. ROW LEVEL SECURITY (RLS) POLICIES

ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE flocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flock_placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE flock_population_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_user_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_user_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE house_user_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: get organization_id of current session user
CREATE OR REPLACE FUNCTION get_current_user_org_id() RETURNS UUID AS $$
  SELECT organization_id FROM profiles WHERE auth_uid = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper function: check if current user is super admin
CREATE OR REPLACE FUNCTION is_super_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    JOIN profiles p ON p.id = ur.user_id
    WHERE p.auth_uid = auth.uid() AND r.code = 'SUPER_ADMIN'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Organizations RLS
CREATE POLICY org_select ON organizations
  FOR SELECT USING (is_super_admin() OR id = get_current_user_org_id());

CREATE POLICY org_insert ON organizations
  FOR INSERT WITH CHECK (is_super_admin());

CREATE POLICY org_update ON organizations
  FOR UPDATE USING (is_super_admin() OR id = get_current_user_org_id());

CREATE POLICY org_delete ON organizations
  FOR DELETE USING (is_super_admin());

-- Farms RLS
CREATE POLICY farm_select ON farms
  FOR SELECT USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY farm_write ON farms
  FOR ALL USING (is_super_admin() OR organization_id = get_current_user_org_id());

-- Sites RLS
CREATE POLICY site_select ON sites
  FOR SELECT USING (
    is_super_admin() OR
    farm_id IN (SELECT id FROM farms WHERE organization_id = get_current_user_org_id())
  );

CREATE POLICY site_write ON sites
  FOR ALL USING (
    is_super_admin() OR
    farm_id IN (SELECT id FROM farms WHERE organization_id = get_current_user_org_id())
  );

-- Houses RLS
CREATE POLICY house_select ON houses
  FOR SELECT USING (
    is_super_admin() OR
    site_id IN (
      SELECT s.id FROM sites s
      JOIN farms f ON f.id = s.farm_id
      WHERE f.organization_id = get_current_user_org_id()
    )
  );

CREATE POLICY house_write ON houses
  FOR ALL USING (
    is_super_admin() OR
    site_id IN (
      SELECT s.id FROM sites s
      JOIN farms f ON f.id = s.farm_id
      WHERE f.organization_id = get_current_user_org_id()
    )
  );

-- Flocks RLS
CREATE POLICY flock_select ON flocks
  FOR SELECT USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY flock_write ON flocks
  FOR ALL USING (is_super_admin() OR organization_id = get_current_user_org_id());

-- Placements RLS
CREATE POLICY placement_select ON flock_placements
  FOR SELECT USING (
    is_super_admin() OR
    flock_id IN (SELECT id FROM flocks WHERE organization_id = get_current_user_org_id())
  );

CREATE POLICY placement_write ON flock_placements
  FOR ALL USING (
    is_super_admin() OR
    flock_id IN (SELECT id FROM flocks WHERE organization_id = get_current_user_org_id())
  );

-- Population Transactions RLS
CREATE POLICY pop_tx_select ON flock_population_transactions
  FOR SELECT USING (
    is_super_admin() OR
    flock_id IN (SELECT id FROM flocks WHERE organization_id = get_current_user_org_id())
  );

CREATE POLICY pop_tx_insert ON flock_population_transactions
  FOR INSERT WITH CHECK (
    is_super_admin() OR
    flock_id IN (SELECT id FROM flocks WHERE organization_id = get_current_user_org_id())
  );

-- Profiles RLS
CREATE POLICY profile_select ON profiles
  FOR SELECT USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY profile_update ON profiles
  FOR UPDATE USING (is_super_admin() OR auth_uid = auth.uid());

-- Roles & Permissions (Read by all authenticated in org, write by super/org admin)
CREATE POLICY roles_select ON roles FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY permissions_select ON permissions FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY role_perms_select ON role_permissions FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY user_roles_select ON user_roles FOR SELECT TO authenticated USING (TRUE);

-- Audit Logs RLS (Read only by authorized users, write via service or triggers)
CREATE POLICY audit_select ON audit_logs
  FOR SELECT USING (is_super_admin() OR organization_id = get_current_user_org_id());

CREATE POLICY audit_insert ON audit_logs
  FOR INSERT WITH CHECK (is_super_admin() OR organization_id = get_current_user_org_id());
