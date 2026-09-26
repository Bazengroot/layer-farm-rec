-- Migration to create KPI definitions table
-- File: database/migrations/025_create_kpi_definitions.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS kpi_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,               -- short code, e.g., 'hdp'
    name TEXT NOT NULL,                      -- human‑readable name, e.g., 'Hen‑Day Egg Production'
    formula TEXT NOT NULL,                   -- description of the calculation
    unit TEXT NOT NULL,                      -- e.g., '%', 'kg', 'g'
    description TEXT,                        -- optional longer description
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert a default definition for Hen‑Day Production (HDP)
INSERT INTO kpi_definitions (code, name, formula, unit, description)
VALUES (
    'hdp',
    'Hen‑Day Egg Production',
    'Total eggs produced / Average live hens × 100',
    '%',
    'Measures the average number of eggs produced per live hen per day.'
) ON CONFLICT (code) DO NOTHING;
