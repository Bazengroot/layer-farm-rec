-- 025_roles_permissions_kpi.sql
-- Insert new permission codes for KPI & Analytics module
INSERT INTO permissions (id, code, description) VALUES
    (gen_random_uuid(), 'view_kpi', 'Allow reading KPI values and snapshots'),
    (gen_random_uuid(), 'export_kpi', 'Allow exporting KPI data (CSV, PDF, optional Excel)'),
    (gen_random_uuid(), 'manage_kpi_config', 'Allow managing KPI configuration such as alert thresholds'),
    (gen_random_uuid(), 'view_kpi_alerts', 'Allow viewing KPI alerts and threshold breaches');
