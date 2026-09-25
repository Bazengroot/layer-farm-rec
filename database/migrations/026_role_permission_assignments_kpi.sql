-- 026_role_permission_assignments_kpi.sql
-- Assign KPI permissions to existing roles.
-- Roles assumed to exist: SUPER_ADMIN, ORG_ADMIN, FARM_MANAGER, SITE_MANAGER, RECORDER, VIEWER.
-- Adjust role codes as needed.

-- Helper to fetch role ids (subquery) and permission ids.
WITH role_ids AS (
    SELECT id, code FROM roles WHERE code IN ('SUPER_ADMIN','ORG_ADMIN','FARM_MANAGER','SITE_MANAGER','RECORDER','VIEWER')
), perm_ids AS (
    SELECT id, code FROM permissions WHERE code IN ('view_kpi','export_kpi','manage_kpi_config','view_kpi_alerts')
)
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM role_ids r
JOIN perm_ids p ON (
    (r.code IN ('SUPER_ADMIN','ORG_ADMIN','FARM_MANAGER') AND p.code IN ('view_kpi','export_kpi','manage_kpi_config','view_kpi_alerts'))
    OR (r.code = 'SITE_MANAGER' AND p.code IN ('view_kpi','export_kpi'))
    OR (r.code IN ('RECORDER','VIEWER') AND p.code = 'view_kpi')
);
