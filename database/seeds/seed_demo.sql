-- Seed demo data for a single organization, farm, site, houses, and flock

-- Organization
INSERT INTO organizations (id, organization_code, organization_name, legal_name, timezone, country, address, phone, email, active)
VALUES (gen_random_uuid(), 'DEMO001', 'Demo Poultry Ltd.', 'Demo Poultry Limited', 'Asia/Jakarta', 'ID', 'Jl. Contoh No.1, Jakarta', '+62-21-12345678', 'info@demopoultry.id', TRUE);

-- Get the organization id for later use
WITH org AS (SELECT id FROM organizations WHERE organization_code = 'DEMO001')
-- Farm
INSERT INTO farms (id, organization_id, farm_code, farm_name, farm_type, location, province, city, address, active)
SELECT gen_random_uuid(), org.id, 'FARM001', 'Demo Layer Farm', 'Layer Farm', 'West Java', 'Jawa Barat', 'Bandung', 'Jl. Farm No.2, Bandung', TRUE FROM org;

-- Site
WITH org AS (SELECT id FROM organizations WHERE organization_code = 'DEMO001'),
     farm AS (SELECT id FROM farms WHERE farm_code = 'FARM001')
INSERT INTO sites (id, farm_id, site_code, site_name, site_manager_id, address, active)
SELECT gen_random_uuid(), farm.id, 'SITE001', 'Main Site', NULL, 'Jl. Site No.3, Bandung', TRUE FROM farm;

-- Houses (2)
WITH site AS (SELECT id FROM sites WHERE site_code = 'SITE001')
INSERT INTO houses (id, site_id, house_code, house_name, house_type, capacity, cage_system, floor_area_m2, active)
SELECT gen_random_uuid(), site.id, 'HOUSE001', 'House A', 'Layer House', 50000, 'Enriched Cage', 2000, TRUE FROM site;

WITH site AS (SELECT id FROM sites WHERE site_code = 'SITE001')
INSERT INTO houses (id, site_id, house_code, house_name, house_type, capacity, cage_system, floor_area_m2, active)
SELECT gen_random_uuid(), site.id, 'HOUSE002', 'House B', 'Layer House', 40000, 'Enriched Cage', 1600, TRUE FROM site;

-- Flock
WITH org AS (SELECT id FROM organizations WHERE organization_code = 'DEMO001'),
     farm AS (SELECT id FROM farms WHERE farm_code = 'FARM001'),
     site AS (SELECT id FROM sites WHERE site_code = 'SITE001'),
     house AS (SELECT id FROM houses WHERE house_code = 'HOUSE001')
INSERT INTO flocks (id, organization_id, farm_id, site_id, house_id, flock_code, flock_name, breed, strain, source_supplier, placement_date, placement_age_weeks, initial_population, current_population, sex, flock_status, production_cycle, expected_end_date, notes, created_by)
SELECT gen_random_uuid(), org.id, farm.id, site.id, house.id, 'FLK001', 'Demo Flock 1', 'Hy-Line Brown', 'HB-1', 'Supplier A', CURRENT_DATE, 20, 50000, 50000, 'Mixed', 'Active', 'Laying', CURRENT_DATE + INTERVAL '70 days', 'Initial demo flock', NULL
FROM org, farm, site, house;

-- Initial placement transaction (automatically handled by trigger if needed, but we insert for completeness)
WITH flk AS (SELECT id FROM flocks WHERE flock_code = 'FLK001')
INSERT INTO flock_population_transactions (id, flock_id, transaction_date, transaction_type, quantity, created_by)
SELECT gen_random_uuid(), flk.id, CURRENT_DATE, 'Initial Placement', 50000, NULL FROM flk;
