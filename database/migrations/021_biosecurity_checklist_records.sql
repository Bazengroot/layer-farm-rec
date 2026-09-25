-- 021_biosecurity_checklist_records.sql
-- Migration for biosecurity checklist instance records

CREATE TABLE biosecurity_checklist_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  house_id UUID NOT NULL REFERENCES houses(id) ON DELETE CASCADE,
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES biosecurity_checklist_templates(id) ON DELETE RESTRICT,
  performed_by UUID NOT NULL REFERENCES veterinarians(id),
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  results JSONB NOT NULL, -- [{"code":"item1","result":"Pass"}, ...]
  notes TEXT,
  attachment_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE biosecurity_checklist_records ENABLE ROW LEVEL SECURITY;

-- End of 021_biosecurity_checklist_records.sql
