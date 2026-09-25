-- ============================================================================
-- Layer Farm Recording & Management System (LFRMS)
-- Seed: 001_seed_demo_org.sql
-- Description: Initial demo organization, farm, site, houses, and test flock
-- ============================================================================

DO $$
DECLARE
  v_org_id UUID;
  v_farm_id UUID;
  v_site_id UUID;
  v_house_a1_id UUID;
  v_house_a2_id UUID;
  v_flock_id UUID;
  v_admin_role_id UUID;
BEGIN
  -- 1. Create Demo Organization
  INSERT INTO organizations (
    organization_code,
    organization_name,
    legal_name,
    timezone,
    country,
    address,
    phone,
    email,
    active
  ) VALUES (
    'ORG-DEMO-01',
    'PT Sumber Unggas Makmur',
    'PT Sumber Unggas Makmur Tbk',
    'Asia/Jakarta',
    'Indonesia',
    'Jl. Raya Sukabumi No. 88, Jawa Barat',
    '+62 266 123456',
    'info@unggas-makmur.co.id',
    TRUE
  )
  ON CONFLICT (organization_code) DO UPDATE
    SET organization_name = EXCLUDED.organization_name
  RETURNING id INTO v_org_id;

  -- 2. Create Demo Farm
  INSERT INTO farms (
    organization_id,
    farm_code,
    farm_name,
    farm_type,
    location,
    province,
    city,
    address,
    active
  ) VALUES (
    v_org_id,
    'FARM-SKB-01',
    'Sukabumi Layer Farm Unit 1',
    'Layer Farm',
    'Kec. Cisaat, Sukabumi',
    'Jawa Barat',
    'Sukabumi',
    'Desa Sukamantri, Sukabumi',
    TRUE
  )
  ON CONFLICT (organization_id, farm_code) DO UPDATE
    SET farm_name = EXCLUDED.farm_name
  RETURNING id INTO v_farm_id;

  -- 3. Create Demo Site
  INSERT INTO sites (
    farm_id,
    site_code,
    site_name,
    address,
    active
  ) VALUES (
    v_farm_id,
    'SITE-SLB',
    'Site Salabintana North',
    'Kawasan Kaki Gunung Gede, Salabintana',
    TRUE
  )
  ON CONFLICT (farm_id, site_code) DO UPDATE
    SET site_name = EXCLUDED.site_name
  RETURNING id INTO v_site_id;

  -- 4. Create Demo Houses
  INSERT INTO houses (
    site_id,
    house_code,
    house_name,
    house_type,
    cage_system,
    capacity_birds,
    dimensions_length_m,
    dimensions_width_m,
    dimensions_height_m,
    ventilation_type,
    cooling_system,
    lighting_system,
    status,
    active
  ) VALUES
  (
    v_site_id,
    'H-A1',
    'Kandang A1 - Closed House',
    'Closed House',
    'Conventional Cage',
    25000,
    120.0,
    12.0,
    4.0,
    'Tunnel Ventilation 8 Fans',
    'Evaporative Cooling Pad',
    'LED Dimmer Programmable',
    'Occupied',
    TRUE
  )
  ON CONFLICT (site_id, house_code) DO UPDATE
    SET capacity_birds = EXCLUDED.capacity_birds
  RETURNING id INTO v_house_a1_id;

  INSERT INTO houses (
    site_id,
    house_code,
    house_name,
    house_type,
    cage_system,
    capacity_birds,
    dimensions_length_m,
    dimensions_width_m,
    dimensions_height_m,
    ventilation_type,
    cooling_system,
    lighting_system,
    status,
    active
  ) VALUES
  (
    v_site_id,
    'H-A2',
    'Kandang A2 - Closed House',
    'Closed House',
    'Conventional Cage',
    25000,
    120.0,
    12.0,
    4.0,
    'Tunnel Ventilation 8 Fans',
    'Evaporative Cooling Pad',
    'LED Dimmer Programmable',
    'Cleaned & Sanitized',
    TRUE
  )
  ON CONFLICT (site_id, house_code) DO UPDATE
    SET capacity_birds = EXCLUDED.capacity_birds
  RETURNING id INTO v_house_a2_id;

  -- 5. Create Demo Active Flock (Lohmann Brown Layer)
  INSERT INTO flocks (
    house_id,
    flock_code,
    flock_name,
    breed,
    strain,
    hatch_date,
    placement_date,
    initial_population,
    current_population,
    status,
    production_cycle,
    standard_profile_id,
    active
  ) VALUES (
    v_house_a1_id,
    'FL-2025-LB01',
    'Flock Lohmann Brown Batch 1',
    'Lohmann Brown',
    'Classic',
    CURRENT_DATE - INTERVAL '180 days',
    CURRENT_DATE - INTERVAL '68 days',
    24500,
    24180,
    'Active',
    'Laying',
    NULL,
    TRUE
  )
  ON CONFLICT (house_id, flock_code) DO UPDATE
    SET current_population = EXCLUDED.current_population
  RETURNING id INTO v_flock_id;

  RAISE NOTICE 'Seed completed: Org %, Farm %, Site %, House A1 %, Flock %',
    v_org_id, v_farm_id, v_site_id, v_house_a1_id, v_flock_id;
END $$;
