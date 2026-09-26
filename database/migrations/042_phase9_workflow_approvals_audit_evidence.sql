-- Migration: Phase 9 - Workflow, Approvals, Correction, Evidence, & Audit Trail
-- File: database/migrations/029_phase9_workflow_approvals_audit_evidence.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Configurable Approval Rules & Requests
CREATE TABLE IF NOT EXISTS approval_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID,
    farm_id UUID,
    site_id UUID,
    record_type TEXT NOT NULL, -- 'daily_recording', 'feed_request', 'purchase', 'inventory_adjustment', 'expense', 'flock_transfer', 'flock_closing'
    amount_threshold NUMERIC(14, 2) DEFAULT 0.00,
    required_role TEXT NOT NULL, -- 'farm_supervisor', 'site_manager', 'farm_manager', 'bod'
    step_order INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS approval_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_type TEXT NOT NULL,
    record_id UUID NOT NULL,
    current_step INT DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'Submitted', -- 'Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Correction Requested', 'Cancelled'
    submitter_id UUID NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS approval_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    request_id UUID REFERENCES approval_requests(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL,
    action TEXT NOT NULL, -- 'Submitted', 'Approved', 'Rejected', 'Correction Requested', 'Cancelled'
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Record Corrections (Non-destructive Audit History)
CREATE TABLE IF NOT EXISTS record_corrections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_type TEXT NOT NULL,
    record_id UUID NOT NULL,
    original_data JSONB NOT NULL,
    proposed_data JSONB NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Approved', 'Rejected'
    requested_by UUID NOT NULL,
    approved_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Private Evidence Attachments Metadata
CREATE TABLE IF NOT EXISTS evidence_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT NOT NULL, -- 'health_record', 'biosecurity', 'inventory_receiving', 'stock_count', 'equipment_maintenance', 'egg_quality', 'corrective_action'
    entity_id UUID NOT NULL,
    bucket_name TEXT NOT NULL DEFAULT 'evidence-private',
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type TEXT NOT NULL,
    uploaded_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. Central Audit Trail Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action_type TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'SUBMIT', 'APPROVE', 'REJECT', 'CORRECTION_REQUEST', 'DELETE', 'EVIDENCE_UPLOAD', 'EVIDENCE_DELETE', 'PERMISSION_CHANGE'
    entity_type TEXT NOT NULL,
    entity_id UUID,
    user_id UUID,
    changes_json JSONB,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
