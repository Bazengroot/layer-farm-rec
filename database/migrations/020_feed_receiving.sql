-- 014_feed_receiving.sql
-- Migration for feed receiving documents and items

-- Table for receiving documents (one per supplier delivery)
CREATE TABLE feed_receiving_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  supplier_id UUID NOT NULL REFERENCES feed_suppliers(id) ON DELETE RESTRICT,
  delivery_date DATE NOT NULL,
  document_number TEXT NOT NULL,
  warehouse_id UUID NOT NULL REFERENCES feed_warehouses(id) ON DELETE RESTRICT,
  storage_bin_id UUID NOT NULL REFERENCES feed_storage_bins(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (supplier_id, document_number)
);

-- Items belonging to a receiving document (each represents a batch)
CREATE TABLE feed_receiving_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  receiving_document_id UUID NOT NULL REFERENCES feed_receiving_documents(id) ON DELETE CASCADE,
  feed_batch_id UUID NOT NULL REFERENCES feed_batches(id) ON DELETE RESTRICT,
  quantity NUMERIC(12,4) NOT NULL CHECK (quantity > 0),
  unit_id UUID NOT NULL REFERENCES feed_units(id) ON DELETE RESTRICT,
  purchase_price NUMERIC(12,4) NOT NULL CHECK (purchase_price >= 0),
  moisture_percent NUMERIC(5,2) CHECK (moisture_percent >= 0),
  packaging_condition TEXT,
  quality_inspection_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (policies added later)
ALTER TABLE feed_receiving_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_receiving_items ENABLE ROW LEVEL SECURITY;

-- End of 014_feed_receiving.sql
