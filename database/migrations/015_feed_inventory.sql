-- 015_feed_inventory.sql
-- Migration for feed inventory ledger and transaction types

-- Enum for feed transaction types
CREATE TYPE feed_transaction_type AS ENUM (
  'opening_balance',
  'receiving',
  'issue',
  'return',
  'transfer',
  'adjustment',
  'waste',
  'consumption'
);

-- Feed stock ledger (one entry per transaction)
CREATE TABLE feed_stock_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  feed_batch_id UUID NOT NULL REFERENCES feed_batches(id) ON DELETE RESTRICT,
  transaction_type feed_transaction_type NOT NULL,
  quantity NUMERIC(12,4) NOT NULL CHECK (quantity >= 0),
  unit_id UUID NOT NULL REFERENCES feed_units(id) ON DELETE RESTRICT,
  reference_id UUID, -- e.g., receiving_document_id, issue_record_id, etc.
  performed_by UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Prevent negative stock unless allowed via a special adjustment (handled in trigger)
-- We'll enforce via a trigger later.

-- Enable Row Level Security for ledger
ALTER TABLE feed_stock_ledger ENABLE ROW LEVEL SECURITY;

-- End of 015_feed_inventory.sql
