-- 016_feed_issue.sql
-- Migration for feed issue records and FIFO/FEFO handling

CREATE TABLE feed_issue_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES feed_warehouses(id) ON DELETE RESTRICT,
  feed_batch_id UUID NOT NULL REFERENCES feed_batches(id) ON DELETE RESTRICT,
  quantity NUMERIC(12,4) NOT NULL CHECK (quantity > 0),
  unit_id UUID NOT NULL REFERENCES feed_units(id) ON DELETE RESTRICT,
  issue_date DATE NOT NULL,
  destination_flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE RESTRICT,
  destination_house_id UUID NOT NULL REFERENCES houses(id) ON DELETE RESTRICT,
  operator_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index to help FIFO/FEFO queries (earliest production_date first)
CREATE INDEX idx_feed_issue_batch_production_date ON feed_batches (production_date);

-- Enable Row Level Security (policies added later)
ALTER TABLE feed_issue_records ENABLE ROW LEVEL SECURITY;

-- End of 016_feed_issue.sql
