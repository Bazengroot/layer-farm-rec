-- ============================================================================
-- Layer Farm Recording & Management System (LFRMS)
-- Migration: 004_roles_permissions.sql
-- Description: 11 Enterprise Roles and Granular Action-Based Permissions
-- ============================================================================

-- 1. SEED 11 ENTERPRISE ROLES
INSERT INTO roles (code, name, description) VALUES
  ('SUPER_ADMIN', 'Super Admin', 'Full system-wide administrative access across all tenant organizations'),
  ('ORG_ADMIN', 'Organization Admin', 'Enterprise administrator with authority over organization, sites, users, and master data'),
  ('FARM_MANAGER', 'Farm Manager', 'Operational manager responsible for farm planning, facility allocations, flock oversight, and approvals'),
  ('SITE_MANAGER', 'Site Manager', 'Field supervisor responsible for daily site operations, flock housing, and initial recording reviews'),
  ('FARM_SUPERVISOR', 'Farm Supervisor', 'On-ground operational supervisor verifying feed distribution, egg collection, and flock records'),
  ('LAYER_RECORDING_STAFF', 'Layer Recording Staff', 'Daily operational recorder capturing egg counts, mortality, culling, and feed consumption'),
  ('VET_TECHNICAL', 'Poultry Technical / Veterinarian', 'Veterinary specialist responsible for flock health, vaccination schedules, and medication prescriptions'),
  ('FEED_INVENTORY_STAFF', 'Feed / Inventory Staff', 'Warehouse operator managing feed deliveries, silo levels, and ingredient logistics'),
  ('FINANCE_STAFF', 'Finance Staff', 'Financial analyst reviewing egg sales, procurement costs, FCR economics, and inventory valuations'),
  ('AUDITOR', 'Auditor', 'Independent inspector with read-only access to historical operations, compliance logs, and immutable audit trails'),
  ('VIEWER', 'Viewer', 'Stakeholder with baseline read-only dashboard visibility without operational mutation permissions')
ON CONFLICT (code) DO UPDATE
  SET name = EXCLUDED.name,
      description = EXCLUDED.description;

-- 2. SEED GRANULAR ACTION-BASED PERMISSIONS
INSERT INTO permissions (code, module, action, description) VALUES
  -- Organization & Setup
  ('org:view', 'organizations', 'view', 'View organization profile and details'),
  ('org:manage', 'organizations', 'manage_settings', 'Modify organization configuration, timezone, and branding'),

  -- Farm & Facility Hierarchy
  ('farm:view', 'farms', 'view', 'View farm information and sites'),
  ('farm:create', 'farms', 'create', 'Create new commercial farms'),
  ('farm:update', 'farms', 'update', 'Update farm details and configuration'),
  ('farm:delete', 'farms', 'delete', 'Decommission or delete a farm'),

  ('site:view', 'sites', 'view', 'View site facilities and manager assignments'),
  ('site:create', 'sites', 'create', 'Create new production sites'),
  ('site:update', 'sites', 'update', 'Update site attributes'),
  ('site:delete', 'sites', 'delete', 'Delete an operational site'),

  ('house:view', 'houses', 'view', 'View houses, cage systems, and equipment'),
  ('house:create', 'houses', 'create', 'Add new poultry houses to a site'),
  ('house:update', 'houses', 'update', 'Update house specs, capacity, and environmental systems'),
  ('house:delete', 'houses', 'delete', 'Delete poultry housing records'),

  -- Flock Lifecycle & Placements
  ('flock:view', 'flocks', 'view', 'View flock demographics, age, and population status'),
  ('flock:create', 'flocks', 'create', 'Create and initialize a new flock batch'),
  ('flock:update', 'flocks', 'update', 'Update flock metadata, breed standards, and targets'),
  ('flock:close', 'flocks', 'approve', 'Execute terminal flock closing and spent hen liquidation'),
  ('flock:placement:create', 'flocks', 'create', 'Record DOC or pullet placements'),
  ('flock:population:transact', 'flocks', 'create', 'Execute population transfers, additions, or adjustments'),

  -- Daily Operational Recording
  ('recording:view', 'daily_records', 'view', 'View daily flock logs'),
  ('recording:create', 'daily_records', 'create', 'Draft daily operational recording (mortality, eggs, feed)'),
  ('recording:update', 'daily_records', 'update', 'Edit draft or correction-requested recordings'),
  ('recording:submit', 'daily_records', 'update', 'Submit daily recording for supervisor approval'),
  ('recording:approve', 'daily_records', 'approve', 'Approve submitted daily recording'),
  ('recording:reject', 'daily_records', 'approve', 'Reject or request correction on daily recording'),

  -- Egg Management
  ('egg:view', 'egg_production', 'view', 'View egg collection, grading, and quality records'),
  ('egg:record', 'egg_production', 'create', 'Record egg collection and grading breakdown'),
  ('egg:inventory:manage', 'egg_inventory', 'update', 'Manage egg warehouse stocks and dispatch lots'),
  ('egg:quality:test', 'egg_quality', 'create', 'Record egg breakout quality tests (Haugh unit, yolk color)'),

  -- Feed Logistics & Nutrition
  ('feed:view', 'feed', 'view', 'View feed stock levels and consumption history'),
  ('feed:request:create', 'feed', 'create', 'Submit feed purchase or warehouse requisition'),
  ('feed:request:approve', 'feed', 'approve', 'Approve feed requests'),
  ('feed:receive', 'feed', 'create', 'Record feed delivery receiving and quality check'),
  ('feed:issue', 'feed', 'update', 'Issue feed bags/silo transfers to houses'),
  ('feed:adjust', 'feed', 'update', 'Record feed warehouse count reconciliations'),

  -- Flock Health & Veterinary
  ('health:view', 'health', 'view', 'View flock health observations and mortality autopsies'),
  ('health:record', 'health', 'create', 'Record daily health symptoms and mortality reasons'),
  ('health:prescribe', 'health', 'create', 'Prescribe medication or therapeutic treatments'),
  ('health:vaccinate', 'health', 'create', 'Record vaccine administration against schedule'),
  ('medication:view', 'medication', 'view', 'View global medication list and details'),
  ('medication:prescribe', 'medication', 'create', 'Record medication administration to flocks'),
  ('medication:manage', 'medication', 'manage_master_data', 'Create, update, or deactivate medication master data'),
  ('vaccination:view', 'vaccination', 'view', 'View vaccine catalog and schedules'),
  ('vaccination:record', 'vaccination', 'create', 'Record vaccine administration events'),
  ('vaccination:manage', 'vaccination', 'manage_master_data', 'Create, update, or deactivate vaccine master data'),
  ('biosecurity:view', 'biosecurity', 'view', 'View biosecurity checklist templates and records'),
  ('biosecurity:manage', 'biosecurity', 'manage_master_data', 'Create, update, or deactivate biosecurity checklist templates'),

  -- Master Reference Data
  ('master_data:view', 'master_data', 'view', 'View master data tables'),
  ('master_data:manage', 'master_data', 'manage_master_data', 'Create, update, or deactivate master data entries'),

  -- Reporting & Analytics
  ('reports:view', 'reports', 'view', 'View standard operational dashboards and KPI cards'),
  ('reports:export', 'reports', 'export', 'Export operational data, spreadsheets, and PDF reports'),
  ('reports:finance:view', 'reports', 'view', 'View financial KPI, egg sales valuations, and cost per kg egg'),

  -- User Administration & RBAC
  ('users:view', 'users', 'view', 'View user profiles, roles, and facility assignments'),
  ('users:manage', 'users', 'manage_users', 'Invite users, assign roles, and map facility scopes'),

  -- Audit & Compliance
  ('audit:view', 'audit_logs', 'view', 'View system-wide audit logs and compliance trails'),
  ('settings:manage', 'settings', 'manage_settings', 'Configure farm alert thresholds and system policies')
ON CONFLICT (code) DO UPDATE
  SET description = EXCLUDED.description,
      module = EXCLUDED.module,
      action = EXCLUDED.action;
