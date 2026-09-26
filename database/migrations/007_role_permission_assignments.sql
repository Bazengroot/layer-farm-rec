-- ============================================================================
-- Layer Farm Recording & Management System (LFRMS)
-- Migration: 005_role_permission_assignments.sql
-- Description: Complete Role-to-Permission Assignment Matrix for 11 Roles
-- ============================================================================

-- Helper procedure to grant permissions to a role by codes
CREATE OR REPLACE FUNCTION grant_permissions(p_role_code TEXT, p_perm_codes TEXT[])
RETURNS VOID AS $$
DECLARE
  v_role_id UUID;
  v_perm_code TEXT;
  v_perm_id UUID;
BEGIN
  SELECT id INTO v_role_id FROM roles WHERE code = p_role_code;
  IF v_role_id IS NULL THEN
    RAISE NOTICE 'Role % does not exist', p_role_code;
    RETURN;
  END IF;

  FOREACH v_perm_code IN ARRAY p_perm_codes
  LOOP
    SELECT id INTO v_perm_id FROM permissions WHERE code = v_perm_code;
    IF v_perm_id IS NOT NULL THEN
      INSERT INTO role_permissions (role_id, permission_id)
      VALUES (v_role_id, v_perm_id)
      ON CONFLICT (role_id, permission_id) DO NOTHING;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 1. SUPER_ADMIN: Gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.code = 'SUPER_ADMIN'
ON CONFLICT DO NOTHING;

-- 2. ORG_ADMIN: Gets all org, farm, user, master data, and operational permissions
SELECT grant_permissions('ORG_ADMIN', ARRAY[
  'org:view', 'org:manage',
  'farm:view', 'farm:create', 'farm:update', 'farm:delete',
  'site:view', 'site:create', 'site:update', 'site:delete',
  'house:view', 'house:create', 'house:update', 'house:delete',
  'flock:view', 'flock:create', 'flock:update', 'flock:close', 'flock:placement:create', 'flock:population:transact',
  'recording:view', 'recording:create', 'recording:update', 'recording:submit', 'recording:approve', 'recording:reject',
  'egg:view', 'egg:record', 'egg:inventory:manage', 'egg:quality:test',
  'feed:view', 'feed:request:create', 'feed:request:approve', 'feed:receive', 'feed:issue', 'feed:adjust',
  'health:view', 'health:record', 'health:prescribe', 'health:vaccinate',
  'master_data:view', 'master_data:manage',
  'reports:view', 'reports:export', 'reports:finance:view',
  'users:view', 'users:manage',
  'audit:view', 'settings:manage'
]);

-- 3. FARM_MANAGER: Operational lead
SELECT grant_permissions('FARM_MANAGER', ARRAY[
  'org:view',
  'farm:view', 'farm:update',
  'site:view', 'site:create', 'site:update',
  'house:view', 'house:create', 'house:update',
  'flock:view', 'flock:create', 'flock:update', 'flock:close', 'flock:placement:create', 'flock:population:transact',
  'recording:view', 'recording:create', 'recording:update', 'recording:submit', 'recording:approve', 'recording:reject',
  'egg:view', 'egg:record', 'egg:inventory:manage', 'egg:quality:test',
  'feed:view', 'feed:request:create', 'feed:request:approve', 'feed:receive', 'feed:issue',
  'health:view', 'health:record', 'health:prescribe', 'health:vaccinate',
  'master_data:view',
  'reports:view', 'reports:export', 'reports:finance:view',
  'users:view',
  'audit:view'
]);

-- 4. SITE_MANAGER: Site operational lead
SELECT grant_permissions('SITE_MANAGER', ARRAY[
  'farm:view',
  'site:view',
  'house:view', 'house:update',
  'flock:view', 'flock:update', 'flock:placement:create', 'flock:population:transact',
  'recording:view', 'recording:create', 'recording:update', 'recording:submit', 'recording:approve', 'recording:reject',
  'egg:view', 'egg:record', 'egg:inventory:manage', 'egg:quality:test',
  'feed:view', 'feed:request:create', 'feed:receive', 'feed:issue',
  'health:view', 'health:record',
  'master_data:view',
  'reports:view', 'reports:export'
]);

-- 5. FARM_SUPERVISOR: Field supervisor
SELECT grant_permissions('FARM_SUPERVISOR', ARRAY[
  'farm:view', 'site:view', 'house:view',
  'flock:view', 'flock:update',
  'recording:view', 'recording:create', 'recording:update', 'recording:submit', 'recording:approve',
  'egg:view', 'egg:record', 'egg:quality:test',
  'feed:view', 'feed:receive', 'feed:issue',
  'health:view', 'health:record',
  'master_data:view',
  'reports:view'
]);

-- 6. LAYER_RECORDING_STAFF: Daily logging
SELECT grant_permissions('LAYER_RECORDING_STAFF', ARRAY[
  'farm:view', 'site:view', 'house:view', 'flock:view',
  'recording:view', 'recording:create', 'recording:update', 'recording:submit',
  'egg:view', 'egg:record',
  'feed:view',
  'health:view', 'health:record'
]);

-- 7. VET_TECHNICAL: Veterinary & bird health
SELECT grant_permissions('VET_TECHNICAL', ARRAY[
  'farm:view', 'site:view', 'house:view', 'flock:view',
  'recording:view',
  'health:view', 'health:record', 'health:prescribe', 'health:vaccinate',
  'master_data:view',
  'reports:view', 'reports:export'
]);

-- 8. FEED_INVENTORY_STAFF: Feed logistics
SELECT grant_permissions('FEED_INVENTORY_STAFF', ARRAY[
  'farm:view', 'site:view', 'house:view',
  'feed:view', 'feed:request:create', 'feed:receive', 'feed:issue', 'feed:adjust',
  'master_data:view',
  'reports:view'
]);

-- 9. FINANCE_STAFF: Financial and economic analysis
SELECT grant_permissions('FINANCE_STAFF', ARRAY[
  'org:view', 'farm:view', 'site:view', 'house:view', 'flock:view',
  'recording:view', 'egg:view', 'feed:view',
  'master_data:view',
  'reports:view', 'reports:export', 'reports:finance:view'
]);

-- 10. AUDITOR: Compliance & read-only access
SELECT grant_permissions('AUDITOR', ARRAY[
  'org:view', 'farm:view', 'site:view', 'house:view', 'flock:view',
  'recording:view', 'egg:view', 'feed:view', 'health:view',
  'master_data:view', 'reports:view', 'reports:export', 'reports:finance:view',
  'users:view', 'audit:view'
]);

-- 11. VIEWER: Baseline read-only
SELECT grant_permissions('VIEWER', ARRAY[
  'org:view', 'farm:view', 'site:view', 'house:view', 'flock:view',
  'recording:view', 'egg:view', 'reports:view'
]);

-- Cleanup helper function
DROP FUNCTION grant_permissions(TEXT, TEXT[]);
