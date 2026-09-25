-- database/migrations/023_performance_permissions.sql

-- Permission for viewing performance KPIs
INSERT INTO permissions (code, description) VALUES
  ('performance:view', 'View performance KPI analytics');
