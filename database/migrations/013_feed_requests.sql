-- 013_feed_requests.sql
-- Migration for feed request tables and enums

-- Enum for feed request status
CREATE TYPE feed_request_status AS ENUM (
  'Draft',
  'Submitted',
  'Approved',
  'Rejected',
  'Partially Fulfilled',
  'Fulfilled',
  'Cancelled'
);

CREATE TABLE feed_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  feed_type_id UUID NOT NULL REFERENCES feed_types(id) ON DELETE RESTRICT,
  quantity NUMERIC(12,4) NOT NULL CHECK (quantity > 0),
  unit_id UUID NOT NULL REFERENCES feed_units(id) ON DELETE RESTRICT,
  required_date DATE NOT NULL,
  requester_id UUID NOT NULL REFERENCES profiles(id) ON DELETE SET NULL,
  reason TEXT,
  status feed_request_status NOT NULL DEFAULT 'Draft',
  approval_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS (policies added later)
ALTER TABLE feed_requests ENABLE ROW LEVEL SECURITY;

-- End of 013_feed_requests.sql
