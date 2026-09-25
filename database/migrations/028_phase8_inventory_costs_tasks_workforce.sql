-- Migration: Phase 8 - Farm Inventory, Expenses, Cost Allocation, Tasks, Equipment, and Workforce
-- File: database/migrations/028_phase8_inventory_costs_tasks_workforce.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. General Inventory Tables
CREATE TABLE IF NOT EXISTS inventory_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

INSERT INTO inventory_categories (code, name) VALUES
('medicine', 'Medicines'),
('vaccine', 'Vaccines'),
('disinfectant', 'Disinfectants'),
('cleaning', 'Cleaning Supplies'),
('ppe', 'PPE'),
('tools', 'Tools'),
('spare_parts', 'Spare Parts'),
('equipment_supplies', 'Equipment Supplies'),
('packaging', 'Packaging'),
('egg_trays', 'Egg Trays'),
('crates', 'Crates'),
('other', 'Other Materials')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES inventory_categories(id),
    item_code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    unit_of_measure TEXT NOT NULL,
    current_stock NUMERIC(12, 3) NOT NULL DEFAULT 0.000,
    min_stock_threshold NUMERIC(12, 3) DEFAULT 10.000,
    farm_id UUID,
    warehouse_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
    batch_number TEXT NOT NULL,
    quantity NUMERIC(12, 3) NOT NULL DEFAULT 0.000,
    expiry_date DATE,
    received_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS inventory_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID REFERENCES inventory_items(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES inventory_batches(id),
    transaction_type TEXT NOT NULL, -- 'receiving', 'issue', 'return', 'transfer', 'adjustment', 'count'
    quantity NUMERIC(12, 3) NOT NULL,
    unit_cost NUMERIC(12, 4) DEFAULT 0.0000,
    total_cost NUMERIC(12, 4) DEFAULT 0.0000,
    source_warehouse_id UUID,
    target_warehouse_id UUID,
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Farm Expenses & Cost Allocation
CREATE TABLE IF NOT EXISTS farm_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID,
    farm_id UUID,
    site_id UUID,
    house_id UUID,
    flock_id UUID,
    expense_category TEXT NOT NULL, -- 'Feed', 'Medication', 'Vaccination', 'Labor', 'Utilities', etc.
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    amount NUMERIC(14, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    vendor_name TEXT,
    invoice_number TEXT,
    payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'partially_paid'
    cost_center TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cost_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_id UUID REFERENCES farm_expenses(id) ON DELETE CASCADE,
    allocation_target_type TEXT NOT NULL, -- 'farm', 'site', 'house', 'flock', 'department', 'cost_center'
    target_id UUID,
    allocation_percentage NUMERIC(5, 2) NOT NULL,
    allocated_amount NUMERIC(14, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Operational Tasks
CREATE TABLE IF NOT EXISTS task_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Daily', 'Weekly', 'Maintenance', 'Cleaning', 'Feeding', 'Egg Collection', etc.
    description TEXT,
    priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS operational_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES task_templates(id),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    location TEXT,
    assigned_user_id UUID,
    due_date DATE NOT NULL,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'Pending', -- 'Pending', 'In Progress', 'Completed', 'Overdue', 'Cancelled', 'Verified'
    completion_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    evidence_url TEXT,
    approved_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Equipment & Maintenance
CREATE TABLE IF NOT EXISTS farm_equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    serial_number TEXT UNIQUE,
    location TEXT,
    purchase_date DATE,
    condition_status TEXT DEFAULT 'Good', -- 'Good', 'Fair', 'Poor', 'Under Repair'
    maintenance_interval_days INT DEFAULT 30,
    next_maintenance_date DATE,
    warranty_expiry_date DATE,
    status TEXT DEFAULT 'Active', -- 'Active', 'In Maintenance', 'Retired'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS equipment_maintenance_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID REFERENCES farm_equipment(id) ON DELETE CASCADE,
    maintenance_date DATE NOT NULL DEFAULT CURRENT_DATE,
    performed_by TEXT,
    description TEXT,
    cost NUMERIC(12, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 5. Workforce Management
CREATE TABLE IF NOT EXISTS farm_employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    department TEXT NOT NULL,
    position TEXT NOT NULL,
    farm_id UUID,
    shift TEXT DEFAULT 'Day', -- 'Day', 'Night', 'Rotating'
    attendance_reference TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employee_certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES farm_employees(id) ON DELETE CASCADE,
    certification_name TEXT NOT NULL,
    issued_date DATE,
    expiry_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
